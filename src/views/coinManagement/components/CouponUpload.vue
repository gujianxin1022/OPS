<template>
  <el-upload
    style="display: inline-block"
    accept=".xls,.xlsx"
    :before-upload="beforeUpload"
    :http-request="upload"
    :on-remove="handleRemove"
    :limit="1"
    :show-file-list="false"
    :file-list="fileList"
  >
    <el-button
      @click="
        () => {
          fileList = [];
        }
      "
      type="text"
      size="mini"
      >{{ $t("增加") }}</el-button
    >
  </el-upload>
</template>
<script>
import { onMounted, ref, computed } from "@vue/composition-api";
import axios from "axios";

export default {
  props: {
    id: {
      type: String,
      default: -1,
    },
    operationType: {
      type: String,
      default: "edit",
    },
  },
  components: {},
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const fileList = ref([]);
    const loading = ref(false);
    const fileMsg = ref(null);
    const creatId = () => {
      if (props.id !== -1) return props.id;
      return Math.floor(Math.random() * 900000000) + 100000000;
    };
    const randomNum = ref("");
    if (props.operationType === "create") {
      randomNum.value = creatId();
    }
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
      handleFile(formData);
    };
    const handleFile = (formData) => {
      axios({
        url: `${
          process.env.VUE_APP_BASE_API
        }/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/import/excel?id=${
          props.operationType === "create" ? randomNum.value : props.id
        }&type=${props.operationType === "create" ? 0 : 1}`,
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
            //如果JSON.parse(enc.decode(new Uint8Array(res.data)))不报错，说明后台返回的是json对象，则弹框提示
            //如果JSON.parse(enc.decode(new Uint8Array(res.data)))报错，说明返回的是文件流，进入catch，下载文件
            const enc = new TextDecoder("utf-8");
            const res = JSON.parse(enc.decode(new Uint8Array(response.data))); //转化成json对象
            if (res.code == 200) {
              emit("ok", res.count);
              if (props.operationType === "create") {
                emit("setRandomNum", randomNum.value);
              }
              root.$notify.success({ message: "上传成功" });
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
        .finally(() => {
          loading.value = false;
          if (props.operationType === "create") {
            randomNum.value = creatId();
          }
        });
    };
    const handleRemove = (file, fileList) => {
      targetUserGroupId.value = "";
      emit("ok", "");
    };

    onMounted(() => {});
    return {
      isEn,
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
