import { reactive, ref, toRefs } from "@vue/composition-api";
import axios from "axios";
import MP4Box from "mp4box";

let controller /* 取消请求 */ = null;

const uploadForm = reactive({
  title: "",
  titleEn: "",
  introduction: "",
  introductionEn: "",
  courseTopicIds: [],
  format: "",
  codeRate: "",
  duration: "",
  resolution: "",
  resolutionHeight: 0,
  resolutionWidth: 0,
  poster: "",
  url: "",
  couresTree: "",
  useType: 4,
});
const uploadVideo = reactive({
  videoUploadPercent: 0,
  videoFlag: false,
  videoDisabled: false,
});
const source = ref(null);

export const uploadVideoFun = (root, refs) => {
  const uploadRules = {
    title: [{ required: true, message: root.$t("请输入"), trigger: "blur" }],
    titleEn: [{ required: true, message: root.$t("请输入"), trigger: "blur" }],
    poster: [{ required: true, message: root.$t("请上传"), trigger: "change" }],
    url: [{ required: true, message: root.$t("请上传"), trigger: "change" }],
    courseTopicIds: [
      { required: true, message: root.$t("请选择"), trigger: "change" },
    ],
    couresTree: [
      { required: true, message: root.$t("请选择课程树"), trigger: "change" },
    ],
  };

  const {
    validateFileType,
    validateFileSize,
    validateFileError,
    validateCodec,
  } = useValidate(root);

  // 视频校验
  const videoValidate = async (file) => {
    await validateFileType(file.name, ["mp4"]);
    await validateFileSize(file.size, 500);
    await validateFileError(new Audio(URL.createObjectURL(file)));
    await validateCodec(file);
  };
  // 获取视频时长
  const getVideoDuration = (el) => {
    return new Promise((resolve, reject) => {
      el.addEventListener("loadedmetadata", () => {
        resolve(+el.duration.toFixed(2));
      });
    });
  };
  // 获取预签名URL
  const getSignUrl = async (fileType) => {
    const {
      status,
      data: { code, data },
    } = await root.$Api.teacherManagement.getS3Url(fileType);
    if (status !== 200 || code !== 200) return Promise.reject();
    return data;
  };
  // 上传视频
  const uploadVideoFile = async ({ file }) => {
    try {
      // 产品要拿到文件信息就回显视频名称
      uploadForm.title = uploadForm.title
        ? uploadForm.title
        : file.name.split(".")[0];
      uploadVideo.videoFlag = true;
      uploadVideo.videoDisabled = true;
      Object.assign(uploadForm, { url: "", format: "", size: 0 });
      const nameSplit = file.name.split(".");
      const fileMsg = await getSignUrl(nameSplit[nameSplit.length - 1]);
      let keys = Object.keys(fileMsg);
      let url = fileMsg[keys[0]];
      controller = new AbortController();
      await axios.put(url, file, {
        signal: controller.signal,
        headers: { "Content-Type": file.type },
        onUploadProgress: ({ lengthComputable, loaded, total }) => {
          if (!lengthComputable) return;
          uploadVideo.videoUploadPercent = ~~((loaded / total) * 100);
        },
      });
      uploadForm.url = `${process.env.VUE_APP_UPLOAD_CDN_VIDEO_IMG}${keys[0]}`;
      // uploadForm.url = URL.createObjectURL(file);
      uploadForm.format = file.type.split("/")[1];
      uploadForm.size = +(file.size / 1024 / 1024).toFixed(2);
      uploadForm.duration = await getVideoDuration(
        new Audio(URL.createObjectURL(file))
      );
      uploadVideo.videoDisabled = false;
      root.$message.success("上传成功");
      if (Object.keys(refs).length) {
        refs.uploadForm.validateField("url");
        refs.uploadForm.validateField("title");
      }
      return {
        path: keys[0],
        usBucketStatus: 1,
        cnBucketStatus: 0,
      };
    } catch {
      root.$message.error("上传失败");
      return false;
    } finally {
      Object.assign(uploadVideo, { videoUploadPercent: 0, videoFlag: false });
    }
  };

  const closecCntroller = () => {
    controller?.abort();
  };

  return {
    uploadForm,
    uploadVideo,
    source,
    uploadRules,
    videoValidate,
    uploadVideoFile,
    validateFileType,
    validateFileSize,
    validateCodec,
    closecCntroller,
  };
};

const useValidate = (root) => {
  const validateFileType /* 校验文件类型 */ = (fileType, typeList) => {
    let splitName = fileType.split(".");
    if (typeList.indexOf(splitName[splitName.length - 1]) !== -1) return;
    root.$message.error(root.$t("暂不支持此类型的文件"));
    return Promise.reject();
  };

  const validateFileSize /* 校验文件大小 */ = (fileSize, size) => {
    if (fileSize / 1024 / 1024 <= size) return;
    const msg = root.$t("上传的文件大于$M，请编辑后重新上传");
    root.$message.error(msg.replace("$", size));
    return Promise.reject();
  };

  const validateFileError /* 校验视是否可以播放 */ = async (video) => {
    return new Promise((resolve, reject) => {
      video.oncanplay = function () {
        resolve();
      };
      video.onerror = function () {
        root.$message.error("该视频存在问题");
        reject();
      };
    });
  };

  const validateCodec /* 校验视频编码格式 */ = (file) => {
    return new Promise((resolve, reject) => {
      const mp4boxFile = MP4Box.createFile();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        arrayBuffer.fileStart = 0;
        mp4boxFile.appendBuffer(arrayBuffer);
      };
      mp4boxFile.onReady = function (info) {
        getResolution(info);
        // if (info.mime.split(";")[1].includes("avc1")) {
        resolve(info.mime);
        // } else {
        //   root.$message.error(root.$t("编码格式不正确，请转码后再上传"));
        //   reject(info)
        // }
      };
      mp4boxFile.onError = function (info) {
        root.$message.error(root.$t("编码格式不正确，请转码后再上传"));
        reject(info);
      };
    });
  };
  // 获取分辨率 & 比特率
  const getResolution = ({ tracks }) => {
    tracks.forEach((item) => {
      if (!item.name.includes("Video")) return;
      uploadForm.resolution = `${item.video.width} x ${item.video.height}`;
      uploadForm.resolutionHeight = item.video.height;
      uploadForm.resolutionWidth = item.video.width;
      uploadForm.codeRate = (item.bitrate / 1024).toFixed();
    });
  };

  return {
    validateCodec,
    validateFileType,
    validateFileError,
    validateFileSize,
  };
};
