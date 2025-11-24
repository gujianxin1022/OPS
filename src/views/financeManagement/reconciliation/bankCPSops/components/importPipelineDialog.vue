<template>
  <div>
    <el-dialog
      :title="$t('上传流水')"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-upload
          v-if="!repeatMsg.length"
          drag
          accept=".xls,.xlsx"
          :http-request="upload"
          :before-upload="beforeUpload"
          :show-file-list="false"
          v-loading="loading"
          :element-loading-text="$t('上传中...')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("将文件拖到此处，或") }} <em>{{ $t("选择文件") }}</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            <span>{{
              $t("只能上传xls/xlsx文件，且不超过$1").replace("$1", "2M")
            }}</span>
            <el-button type="text">
              <a href="https://priv.cdn.lingoace.com/OPS/TemplateOfReference.xlsx">{{
                $t("下载模板")
              }}</a>
            </el-button>
          </div>
        </el-upload>
        <el-input
          v-else
          v-model="repeatMsg"
          type="textarea"
          :rows="6"
          disabled
        />
      </div>
      <span v-if="repeatMsg.length" slot="footer" class="dialog-footer">
        <el-button @click="coverFun(0)">{{ $t("不覆盖") }}</el-button>
        <el-button type="primary" @click="coverFun(1)">{{
          $t("覆盖")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import axios from "axios";

export default {
  props: {
    dialogVisible: { type: Boolean, define: false },
  },
  setup(props, { root, emit, refs }) {
    const loading = ref(false);
    const repeatMsg = ref("");
    const fileMsg = ref(null);
    const importPaymentUrl = `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/business/check/import/payment`;

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

    const upload = ({ file }) => {
      loading.value = true;
      fileMsg.value = file;
      const formData = new FormData();
      formData.append("file", file);
      handleFile(importPaymentUrl, formData);
    };

    const coverFun = (type) => {
      loading.value = true;
      const formData = new FormData();
      formData.append("file", fileMsg.value);
      formData.append("isCover", type); // null : 第一次上传,验重;  0: 不覆盖; 1:覆盖
      handleFile(importPaymentUrl, formData);
    };

    const handleFile = (url, formData) => {
      axios({
        url: `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/business/check/import/payment`,
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
              handleClose();
              root.$confirm(root.$t("上传成功"), root.$t("提示"), {
                confirmButtonText: root.$t("知道了"),
                showCancelButton: false,
                type: "success",
              });
            } else if (res.code == 20001) {
              repeatMsg.value = JSON.parse(res.list);
            } else if (res.code == 20002) {
              root.$alert(res.message, root.$t("提示"), {
                confirmButtonText: root.$t("我知道了"),
              });
            }
          } catch (err) {
            let blob = new Blob([response.data]);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = `DataFailed.xls`; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            handleClose();
          }
        })
        .finally(() => (loading.value = false));
    };

    const handleClose = () => {
      repeatMsg.value = "";
      emit("update:dialogVisible", false);
    };

    return {
      loading,
      repeatMsg,
      beforeUpload,
      upload,
      coverFun,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  display: flex;
  justify-content: space-between;
  ::v-deep .el-button--text {
    padding: 0;
  }
}
</style>
