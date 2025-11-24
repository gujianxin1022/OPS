<template>
  <div class="my-editor-warp" v-loading="loading">
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      class="editor"
      :options="editorConfig"
      @change="onEditorChange($event)"
    />
    <UploadToS3
      class="upload-to-s3"
      style="display: none"
      ref="uploadS3"
      :config="s3Config"
      @setUploading="setUploading"
      @changFileData="uploadSuccessFun"
    />
  </div>
</template>
<script>
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import UploadToS3 from "@/components/Upload/uploadToS3";
export default {
  components: {
    UploadToS3,
  },
  props: {
    editorConfig: {
      type: Object,
      default: {
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false,
        },
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
            [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 颜色选择
            [{ font: [] }], // 字体
            [{ align: [] }], // 居中
            ["clean"], // 清除样式,
            ["audio"],
          ],
        },
      },
      placeholder: "请输入",
    },
  },
  setup(props, { root, emit, refs }) {
    const content = ref("");
    const loading = ref(false);
    const setUploading = (flag) => {
      loading.value = flag;
    };
    const onEditorChange = ({ quill, html, text }) => {
      if (quill.getSelection()) {
        focusIndex.value = quill.getSelection().index;
      }
      content.value = html;
      emit("handelChangeContent", content.value);
    };
    /* 附件上传 */
    const getSignUrl = async (fileType) => {
      /* 获取预签名函数 */
      const res = await root.$Api.financeManagement.reqPointsMallUploadSign({
        fileType: fileType,
      });
      return res;
    };
    const s3Config = ref({
      accept: "image/jpg, image/png, image/jpeg, video/mp4, audio/mp3",
      limit: 10000,
      maxSize: 20000,
      multiple: false,
      showImgList: true,
      getSignFun: getSignUrl,
      pasteUpload: true,
    });
    const uploadVideo = () => {
      refs.uploadS3.triggerClick();
    };
    let addRange = [];
    const imageTypes = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
    const audioTypes = [
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "mid",
      "wma",
      "flac",
      "mpc",
      "ape",
      "spx",
      "opus",
    ];
    const videoTypes = [
      "mp4",
      "m4v",
      "avi",
      "mkv",
      "mov",
      "mpg",
      "mpeg",
      "wmv",
      "flv",
      "3gp",
      "3g2",
      "webm",
    ];
    const uploadSuccessFun = async (fileList) => {
      const url = await getS3UrlByfilePath(fileList[0].filePath);
      const nameSplitArr = url.split(".");
      const fileType = nameSplitArr[nameSplitArr.length - 1];
      let attachmentType = "";
      if (imageTypes.includes(fileType)) {
        attachmentType = "image";
      }
      if (audioTypes.includes(fileType)) {
        attachmentType = "audio";
      }
      if (videoTypes.includes(fileType)) {
        attachmentType = "video";
      }
      if (url != null && url.length > 0) {
        let quill = refs.myQuillEditor.quill;
        addRange = quill.getSelection();
        let index =
          addRange !== null ? addRange.index + 1 : focusIndex.value + 1;
        await quill.insertEmbed(index, attachmentType, url);
        quill.insertText(index + 1, " ");
        quill.setSelection(index + 2);
      } else {
        root.$notify.error(`${fileType}插入失败`);
      }
      refs.uploadS3.fileDataList = []; // 插入成功后清除input的内容
    };
    const customMenu = (quill) => {
      const element = document.querySelectorAll(".ql-audio")[0];
      element.classList.add("el-icon-paperclip");
      let toolbar = quill.getModule("toolbar");
      toolbar.addHandler("audio", uploadVideo);
    };
    const { id } = JSON.parse(localStorage.getItem("userInfo"));
    const mediaCdn = ref("");
    const reqMediaCdn = async () => {
      const res = await root.$Api.workBench.reWorkOrderConfig({
        userId: id,
      });
      mediaCdn.value = res.mediaCdn;
    };
    const getS3UrlByfilePath = async (filePath) => {
      return `${mediaCdn.value}${filePath}`;
    };
    const copyHandler = () => {
      const clipboard = refs.myQuillEditor.quill.getModule("clipboard");
      clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        delta.ops = delta.ops.map((op) => {
          if (op.insert && typeof op.insert === "object") {
            return { insert: "" };
          }
          return op;
        });
        return delta;
      });
    };
    const focusIndex = ref(0);

    onMounted(() => {
      reqMediaCdn();
      customMenu(refs.myQuillEditor.quill);
      refs.myQuillEditor.quill.on("selection-change", function (range) {
        if (range) {
          focusIndex.value = range.index;
        }
      });
      copyHandler();
    });

    return {
      content,
      s3Config,
      onEditorChange,
      uploadSuccessFun,
      loading,
      setUploading,
      focusIndex,
    };
  },
};
</script>
<style lang="scss" scoped>
.my-editor-warp {
  height: 100%;
  overflow: hidden;
  .editor {
    height: 70%;
  }
}
</style>
<style>
.ql-attachment {
  display: inline-block;
  cursor: pointer;
  color: #000;
  width: 28px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  font-size: 18px;
}
.ql-attachment:hover {
  color: #005cc1;
}
</style>
