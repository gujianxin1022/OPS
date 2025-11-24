<template>
  <el-dialog
    width="400px"
    :title="$t(`导入数据`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="auto" class="custom-form">
      <el-form-item :label="$t('导入说明')" prop="name" required class="import-name-item">
        <el-input
          v-model="formData.name"
          :placeholder="$t('请输入导入说明')"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item prop="file" :label="$t('选择文件')" required>
        <el-upload
          ref="upload"
          class="upload-demo"
          accept=".xls,.xlsx"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"

        >
          <el-button size="small" type="primary">{{ $t("点击上传") }}</el-button>
          <el-button type="text" @click="handleDownload" class="download" v-if="!!templateUrl">
            {{ $t("下载示例文件") }}
          </el-button>
        </el-upload>
        <div v-if="formData.file" class="file-info el-upload__tip">
          {{ $t("已选择文件") }}: {{ formData.file.name }}
          <el-button type="text" @click="removeFile">{{ $t("删除") }}</el-button>
        </div>
      </el-form-item>

      <el-form-item :label="$t('所属月份')" prop="month" required>
        <el-select v-model="formData.month" :placeholder="$t('请选择月份')">
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <div class="warning-tip">
        {{ $t("PS: 上传后薪酬即刻更新，请谨慎操作") }}
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t("确定") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed } from "@vue/composition-api";
import fileDownload from "js-file-download";
import axios from "axios";

const { jwtToken } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  props: {
    visible: { type: Boolean, default: false },
    businessLine: { type: Number, default: void 0 },
    templateUrl: { type: String, default: "" },
    uploadUrl: { type: String, default: "" },
  },
  setup(props, { root, refs, emit }) {
    const uploadLoading = ref(false);
    const submitLoading = ref(false);
    const formData = reactive({
      name: '',
      file: null,
      month: ''
    });
    const rules = {
      name: [
        { required: true, message: root.$t("请输入导入说明"), trigger: "blur" },
        { max: 50, message: root.$t("导入说明不能超过50个字符"), trigger: "blur" }
      ],
      file: [{ required: true, message: root.$t("请上传文件"), trigger: "change" }],
      month: [{ required: true, message: root.$t("请选择月份"), trigger: "change" }]
    };

    const monthOptions = computed(() => {
      const currentDate = new Date();
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
      
      return [
        {
          value: formatDate(currentMonth),
          label: formatDate(currentMonth)
        },
        {
          value: formatDate(lastMonth),
          label: formatDate(lastMonth)
        }
      ];
    });

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}${month}`;
    };

    const validateFileType = (file) => {
      const _fileType = file.name.split(".").reverse()[0];
      if (["xls", "xlsx"].includes(_fileType)) return true;
      root.$message.error(root.$t("格式错误,仅支持xls、xlsx格式"));
      return false;
    };

    const validateFileSize = (file) => {
      if (file.size <= 1024 * 1024 * 1024 * 2) return true;
      root.$message.error(root.$t("上传的文件大于$1，请编辑后重新上传！").replace("$1", "2M"));
      return false;
    };

    const beforeUpload = (file) => {
      return validateFileType(file);// && validateFileSize(file);
    };

    const handleFileChange = (file, fileList) => {
      if (fileList.length > 0) {
        formData.file = file.raw;
      } else {
        formData.file = null;
      }
    };

    const removeFile = () => {
      formData.file = null;
      refs.upload.clearFiles();
    };

    const upload = () => {
      if (!formData.file) {
        root.$message.error(root.$t("请选择要上传的文件"));
        return Promise.reject();
      }

      submitLoading.value = true;
      let data = new FormData();
      data.append("file", formData.file);
      data.append("name", formData.name);
      data.append("month", formData.month);

      return axios({
        method: "post",
        url: props.uploadUrl,
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
          } else {
            root.$notify({
              message: root.$t("未导入的异常数据已下载请查看"),
              type: "warning",
            });
            fileDownload(res.data, "异常数据.xlsx");
          }
        })
        .catch((err) => {
          root.$notify({ message: err.message, type: "error" });
        })
        .finally(() => {
          submitLoading.value = false;
        });
    };

    const handleDownload = () => {
      location.href = props.templateUrl;
    };

    const handleClose = () => {
      emit("close");
      emit("update:visible", false);
    };

    const handleSubmit = () => {
      refs.form.validate((valid) => {
        if (valid) {
          upload();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    };

    return {
      formData,
      rules,
      monthOptions,
      uploadLoading,
      submitLoading,
      handleFileChange,
      beforeUpload,
      handleClose,
      handleDownload,
      handleSubmit,
      removeFile,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 10px;
}
::v-deep .el-form-item__label {
  &::before {
    display: none;
  }
}
.file-info {
  margin-top: 10px;
}
.warning-tip {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
.import-name-item {
  
  // align-items: center;
  
  ::v-deep .el-form-item__content {
    // margin-left: 0px !important;
    flex: 1;

    .el-input__count {
      background: transparent;
      font-size: 12px;
      color: #909399;
      position: absolute;
      right: 5px;
      top: 0;
      line-height: 20px;
    }

    .el-input__suffix {
      width: 100%;
    }
  }
}

.custom-form {
  ::v-deep .el-form-item {
    display: flex;
    align-items: center;
  }
  ::v-deep .el-form-item:before {
    content: '* ';
    color: #F56C6C;
    margin-right: 4px;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0px !important;
  }

  ::v-deep .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>