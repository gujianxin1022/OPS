<template>
  <el-upload
    style="display: inline-block"
    accept=".xls,.xlsx"
    :before-upload="beforeUpload"
    :http-request="upload"
    :on-remove="handleRemove"
    :limit="1"
    :file-list="fileList"
    :show-file-list="showFileList"
    :action="''"
  >
    <el-button
      @click="
        () => {
          fileList = [];
        }
      "
      size="small"
      :type="config.btnType || 'primary'"
    >
      <i class="el-icon-upload"></i>
      <span v-if="config.btnTxt">{{ config.btnTxt }}</span>
      <span v-else>
        {{ targetUserGroupId.length ? $t("重新选择") : $t("选择文件") }}</span
      >
    </el-button>
  </el-upload>
</template>
<script>
import { ref } from "@vue/composition-api";
import axios from "axios";
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    config: {
      type: Object,
      default: () => {},
    },
    showFileList: {
      type: Boolean,
      default: () => true,
    },
    showInterfaceMsg: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {},
  setup(props, { root, emit }) {
    const fileList = ref([]);
    const loading = ref(false);
    const fileMsg = ref(null);
    const importPaymentUrl = `${process.env.VUE_APP_BASE_API}${props.config.url}`;
    const beforeUpload = (file) => {
      const typeList = ["xls", "xlsx", "XLS", "XLSX"];
      const fileType = file.name.split(".")[file.name.split(".").length - 1];
      if (!typeList.includes(fileType)) {
        root.$notify({
          message: root.$t("格式错误,仅支持xls、xlsx格式"),
          type: "warning",
        });
        return false;
      }
      if (file.size > 1024 * 1024 * 1024 * 10) {
        root.$notify({
          message: root.$t(
            "上传的文件大于$1，请编辑后重新上传！".replace("$1", "2M")
          ),
          type: "warning",
        });
        return false;
      }
    };
    const targetUserGroupId = ref("");
    const upload = ({ file }) => {
      loading.value = true;
      fileMsg.value = file;
      const formData = new FormData();
      formData.append("file", file);
      handleFile(importPaymentUrl, formData);
    };
    const handleFile = (url, formData) => {
      axios({
        url: props.type.length ? url + `${props.type}` : url,
        method: "post",
        data: formData,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
        },
      })
        .then((response) => {
          try {
            const enc = new TextDecoder("utf-8");
            const res = JSON.parse(enc.decode(new Uint8Array(response.data))); //转化成json对象
            if (res.code == 200) {
              targetUserGroupId.value = res.data;
              emit("ok", targetUserGroupId.value);
              root.$notify.success({
                message: props.showInterfaceMsg
                  ? res.message
                  : root.$t("上传成功"),
              });
            } else {
              fileList.value = [];
              root.$notify.warning({ message: res.message });
            }
          } catch (err) {
            let blob = new Blob([response.data]);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = `${root.$t("数据上传失败")}.xls`; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            root.$notify({
              message: root.$t(
                "存在数据错误，请查看已下载文件《数据上传失败.xlsx》"
              ),
              type: "error",
            });
            window.URL.revokeObjectURL(href); //释放掉blob对象
            fileList.value = [];
          }
        })
        .finally(() => (loading.value = false));
    };
    const handleRemove = (file, fileList) => {
      targetUserGroupId.value = "";
      emit("ok", "");
    };
    return {
      loading,
      fileList,
      targetUserGroupId,
      upload,
      beforeUpload,
      handleRemove,
    };
  },
};
</script>
