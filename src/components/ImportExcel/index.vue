<template>
  <div class="import-teacher-list-dialog-warp">
    <el-dialog
      :title="config.title"
      :visible.sync="showDialog"
      width="400px"
      :close-on-click-modal="false"
      @close="$emit('closeDialog')"
    >
      <div>
        <el-upload
          drag
          multiple
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
            {{ $t("只能上传xls/xlsx文件，且不超过$1").replace("$1", "2M") }}
          </div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
export default {
  name: "ImportExcel",
  data() {
    return {
      loading: false,
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    requesetHeaders: {
      type: Object,
      default: () => ({
        "Content-type": "multipart/form-data",
        authorization: `Bearer ${
          JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
        }`,
      }),
    },
    config: {
      type: Object,
      default: () => ({
        fileName: "file",
        title: "批量导入",
        requestUrl: "",
      }),
    },
  },
  methods: {
    upload(e) {
      this.loading = true;
      let _this = this;
      let cancelToken = this.$Axios.CancelToken;
      this.source = cancelToken.source();
      let fm = new FormData();
      fm.append(this.config.fileName || "file", e.file);

      this.$Axios({
        method: "post",
        url: this.config.requestUrl,
        data: fm,
        responseType: "blob",
        headers: this.requesetHeaders,
        cancelToken: _this.source.token,
      })
        .then((res) => {
          let r = new FileReader();
          let that = this;
          r.onload = function () {
            try {
              let resData = JSON.parse(this.result);
              if (resData.code == 500) {
                that.$notify({
                  message: that.$t("上传失败"),
                  type: "error",
                });
                that.loading = false;
              }
              if (resData.code == 200) {
                that.$notify({
                  message: resData.message,
                  type: "success",
                });
                that.$emit("importSuccess");
                that.loading = false;
              }
            } catch (err) {
              if (res.data.type == "application/json") {
                //上传成功
                customElements.$notify({
                  message: that.$t("导入成功"),
                  type: "success",
                });
                that.$emit("importSuccess");
                that.loading = false;
              } else {
                that.$alert(
                  that.$t(
                    "未导入的异常数据已下载请查看，文件《导入失败数据.xlsx》"
                  ),
                  that.$t("有部分数据创建失败！"),
                  {
                    confirmButtonText: that.$t("我知道了"),
                  }
                );
                fileDownload(res.data, "导入失败数据.xlsx");
                that.$emit("importSuccess");
                that.loading = false;
              }
            }
          };
          r.readAsText(res.data);
        })
        .catch((err) => {
          this.$notify({
            message: err.message,
            type: "error",
          });
          this.loading = false;
        });
    },
    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 1024 * 2) {
        this.$notify({
          message: this.$t("上传的文件大于$1，请编辑后重新上传！").replace("$1", "2M"),
          type: "warning",
        });
        return false;
      }
      const [tail, ...rest] = [...file.name.split(".")].reverse();
      const typeStr = "xls,xlsx,XLS,XLSX";
      const isAllowType = typeStr.includes(tail);
      if (!isAllowType) {
        this.$notify({
          message: this.$t("格式错误,仅支持xls、xlsx格式"),
          type: "warning",
        });
        return isAllowType;
      }
    },
  },
};
</script>
