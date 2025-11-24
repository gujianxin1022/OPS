<template>
  <div class="upload-teacher-info">
    <!------------------------------- el-upload--------------------------->
    <el-upload
      class="custom-upload"
      :accept="accept"
      :disabled="disabled"
      :show-file-list="!disabled && !uploading"
      :file-list="fileList"
      :http-request="handleUploadFile"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
    >
      <template v-if="domesticLink">
        <el-image
          :src="domesticLink"
          :preview-src-list="[domesticLink]"
          v-if="disabled && isPicture"
          style="display: block; width: 178px; height: 178px"
        />
      </template>
      <div v-else :class="['upload-tips', disabled && 'upload-tips-disabled']">
        <i class="el-icon-plus upload-icon" />
        <div class="tips-text">
          {{
            isPicture
              ? $t("限$1格式，上限$2")
                  .replace("$1", "jpg、jpeg、png")
                  .replace("$2", `${maxFileSize}M`)
              : $t("限$1以内，$2格式，上限$3")
                  .replace("$1", `${Math.floor(maxDuration)}min`)
                  .replace("$2", `mp4`)
                  .replace("$3", `${maxFileSize}M`)
          }}
        </div>
      </div>
    </el-upload>
    <el-progress v-if="uploading" :percentage="progress" />

    <!----------------------------- 复制跳转 ------------------------------>

    <div class="operation-area" v-if="disabled && domesticLink && !isPicture">
      <a :href="domesticLink" target="_blank">
        {{ $t("点击查看") }}
      </a>
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          {{ $t("复制链接") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-if="domesticLink"
            v-clipboard:copy="domesticLink"
            v-clipboard:success="handleCopySuccess"
          >
            {{ $t("发送到中国区") }}
          </el-dropdown-item>
          <el-dropdown-item
            v-if="overseasLink"
            v-clipboard:copy="overseasLink"
            v-clipboard:success="handleCopySuccess"
          >
            {{ $t("发送到海外") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MP4Box from "mp4box";

import {
  computed,
  onBeforeUnmount,
  reactive,
  toRefs,
  unref,
  watch,
} from "@vue/composition-api";
import { getS3SignUrl } from "@/api/tutorManagement";

let controller /* 取消请求 */ = null;

export default {
  props: {
    id: { type: String, default: null } /* 用于生成唯一文件名 */,
    domesticLink: { type: String, default: null } /* 国内cdn域名的地址 */,
    overseasLink: { type: String, default: null } /* 海外cdn域名的地址 */,
    maxFileSize: { type: Number, default: Infinity } /* MB */,
    maxDuration: { type: Number, default: Infinity } /* MINUTE */,
    accept: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    mediaType: {
      type: String,
      default: "picture",
      validator: (value) => ["picture", "video"].includes(value),
    },
  },
  setup(props, { root, emit }) {
    const isPicture = computed(() => props.mediaType === "picture");

    const fileList = computed(() => {
      if (!props.domesticLink) return [];
      const chunk = props.domesticLink.split("/");
      const name = decodeURI(chunk[chunk.length - 1]);
      return [{ url: props.domesticLink, name }];
    });

    const uploadState = reactive({ progress: 0, uploading: false });

    const {
      validateCodec,
      validateDuration,
      validateFileSize,
      validateFileType,
    } = useValidate(props, root);

    const handleBeforeUpload /* 上传前校验 */ = async (file) => {
      await validateFileType(file.type);
      await validateFileSize(file.size);
      if (unref(isPicture)) return;
      await validateCodec(file);
      await validateDuration(new Audio(URL.createObjectURL(file)));
    };

    const getSignUrl /* 获取预签名URL */ = async (extension) => {
      const fileName = `${props.id}_${Date.now()}.${extension}`;
      const {
        status,
        data: { code, data },
      } = await getS3SignUrl(fileName);
      if (status !== 200 || code !== 200) return Promise.reject();
      return data;
    };

    const handleUploadFile /* 上传文件 */ = async ({ file }) => {
      try {
        uploadState.uploading = true;
        const nameSplit = file.name.split(".");
        const url = await getSignUrl(nameSplit[nameSplit.length - 1]);
        controller = new AbortController();
        await axios.put(url, file, {
          signal: controller.signal,
          headers: { "Content-Type": file.type },
          onUploadProgress: ({ lengthComputable, loaded, total }) => {
            if (!lengthComputable) return;
            uploadState.progress = ~~((loaded / total) * 100);
          },
        });
        root.$message.success("上传成功");
        emit("unpdate:overseasLink", "");
        emit(
          "unpdate:domesticLink",
          `${process.env.VUE_APP_MEDIA_CDN_DOMESTIC}${
            url.match(/(\/teacherInformation[a-zA-Z0-9_\/\.]*)/)[0]
          }`
        );
      } catch {
        root.$message.error("上传失败");
      } finally {
        Object.assign(uploadState, { progress: 0, uploading: false });
      }
    };

    const handleRemove = () => {
      emit("unpdate:domesticLink", "");
      emit("unpdate:overseasLink", "");
    };

    const handleCopySuccess = () =>
      void root.$message.success(root.$t("复制成功"));

    watch(
      () => props.disabled,
      (val) => void (val && controller?.abort())
    );

    onBeforeUnmount(() => void controller?.abort());

    return {
      isPicture,
      fileList,
      ...toRefs(uploadState),

      handleUploadFile,
      handleBeforeUpload,
      handleRemove,
      handleCopySuccess,
    };
  },
};

const useValidate = (props, root) => {
  const validateFileType /* 校验文件类型 */ = (fileType) => {
    if (props.accept.includes(fileType)) return;
    root.$message.error(root.$t("暂不支持此类型的文件"));
    return Promise.reject();
  };

  const validateFileSize /* 校验文件大小 */ = (fileSize) => {
    const { maxFileSize } = props;
    if (fileSize / 1024 / 1024 <= maxFileSize) return;
    const msg = root.$t("上传的文件大于$M，请编辑后重新上传");
    root.$message.error(msg.replace("$", maxFileSize));
    return Promise.reject();
  };

  const validateDuration /* 校验视频时长 */ = async (el) => {
    return new Promise((resolve, reject) => {
      el.addEventListener("loadedmetadata", () => {
        const { maxDuration } = props;
        if (el.duration / 60 <= maxDuration) {
          resolve();
        } else {
          const msg = root.$t("上传的文件时长大于$分钟，请编辑后重新上传");
          root.$message.error(msg.replace("$", ~~maxDuration));
          reject();
        }
      });
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
        if (info.mime.split(";")[1].includes("avc1")) {
          resolve(info.mime)
        } else {
          root.$message.error(root.$t("编码格式不正确，请转码后再上传"));
          reject(info)
        }
      };
      mp4boxFile.onError = function (info) {
        root.$message.error(root.$t("编码格式不正确，请转码后再上传"));
        reject(info);
      };
    });
  };

  return {
    validateCodec,
    validateFileType,
    validateDuration,
    validateFileSize,
  };
};
</script>

<style lang="scss" scoped>
.upload-teacher-info {
  width: 350px;
  ::v-deep .custom-upload {
    line-height: 0;
    .el-upload {
      border-radius: 6px;
      border: 1px dashed #d9d9d9;
      &:hover {
        border-color: #409eff;
      }
      .upload-tips {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 178px;
        height: 178px;
        .upload-icon {
          margin-top: 32px;
          font-size: 32px;
          color: #8c939d;
          text-align: center;
        }
        .tips-text {
          line-height: 1.7;
          padding: 16px;
          color: #8c939d;
        }
      }
      .upload-tips-disabled {
        background: #f5f7fa;
        cursor: not-allowed;
      }
    }
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
  .operation-area {
    display: flex;
    align-items: center;
    a {
      font-size: 14px;
      color: #409eff;
      margin-right: 16px;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
  .el-progress {
    margin-top: 16px;
  }
}
</style>
