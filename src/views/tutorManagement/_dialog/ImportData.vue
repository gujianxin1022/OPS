<template>
  <el-dialog
    width="400px"
    :title="$t(`导入数据`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-button type="text" @click="handleDownload" class="download">
      {{ $t("下载模版") }}
    </el-button>
    <el-upload
      drag
      accept=".xls,.xlsx"
      :show-file-list="false"
      :http-request="upload"
      :before-upload="beforeUpload"
      v-loading="uploadLoading"
      :element-loading-text="$t('上传中...')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        {{ $t("将文件拖到此处，或") }}<em>{{ $t("点击上传") }}</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        {{ $t("只能上传xls/xlsx文件，且不超过$1").replace("$1", "2M") }}
      </div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";

import fileDownload from "js-file-download";
import axios from "axios";

const { jwtToken } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  props: {
    visible: { type: Boolean, default: false },
    businessLine: { type: Number, default: void 0 },
  },
  setup(props, { root, refs, emit }) {
    const uploadLoading = ref(false);

    const validateFileType /* 校验文件类型 */ = (file) => {
      const _fileType = file.name.split(".").reverse()[0];
      if (["xls", "xlsx"].includes(_fileType)) return;
      root.$message.error(root.$t("格式错误,仅支持xls、xlsx格式"));
      return Promise.reject();
    };

    const validateFileSize /* 校验文件大小 */ = (file) => {
      if (file.size <= 1024 * 1024 * 1024 * 2) return;
      root.$message.error(root.$t("上传的文件大于$1，请编辑后重新上传！").replace("$1", "2M"));
      return Promise.reject();
    };

    const beforeUpload = async (file) => {
      await Promise.all([validateFileType(file), validateFileSize(file)]);
    };

    const upload = (e) => {
      uploadLoading.value = true;
      let data = new FormData();
      data.append("file", e.file);
      axios({
        method: "post",
        url: `${process.env.VUE_APP_BASE_API}/opsapi/teachermanager/teacher-manage/teacher/import/recommend/tutor/${props.businessLine}`,
        data,
        responseType: "blob",
        headers: {
          authorization: `Bearer ${jwtToken}`,
          "Content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.type == "application/json") {
            root.$notify({
              message: root.$t("导入成功"),
              type: "success",
            });
            handleClose();
            uploadLoading.value = false;
          } else {
            root.$notify({
              message: root.$t("未导入的异常数据已下载请查看"),
              type: "warning",
            });
            fileDownload(res.data, "异常数据.xlsx");
            uploadLoading.value = false;
          }
        })
        .catch((err) => {
          this.$notify({ message: err.message, type: "error" });
          uploadLoading.value = false;
        });
    };

    const handleDownload = () => {
      location.href =
        "https://s3.us-west-1.amazonaws.com/media.pplingo.com/templates/recommendTeacher/uploadScoreTemplate_v2.xlsx";
    };

    const handleClose = () => {
      emit("close");
      emit("update:visible", false);
    };

    return {
      uploadLoading,

      upload,
      beforeUpload,
      handleClose,
      handleDownload,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 0;
}
::v-deep .el-form-item__label {
  &::before {
    display: none;
  }
}
</style>