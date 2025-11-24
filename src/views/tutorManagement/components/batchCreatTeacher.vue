<template>
  <el-dialog
    :title="$t('批量创建老师账号')"
    :visible.sync="visible"
    @close="closeDialog"
    width="800px"
    center
    class="batch-assign-container"
  >
    <el-upload
      class="upload-demo"
      accept=".xls,.xlsx"
      :http-request="upload"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :element-loading-text="$t('上传中...')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("将文件拖到此处，或") }} <em>{{ $t("选择文件") }}</em></div>

      <div
        class="el-upload__tip"
        slot="tip"
      >
        <el-button type="text"><a
            href="https://priv.cdn.lingoace.com/OPS/批量创建老师模版.xlsx"
          >{{
                $t("下载模板")
              }}</a></el-button>
        {{ $t("只能上传xls/xlsx文件，且不超过$1").replace("$1", "3M")}}
      </div>
    </el-upload>
  </el-dialog>
</template>
<script >
import { defineComponent, computed, onMounted } from "@vue/composition-api";
import axios from "axios";
import { getDevice } from "@/utils/handleData";
import datetime from "@/utils/datetime_utils";
const jstz = require("@/utils/jstz");
const timezone = jstz.jstz.determine();
const ua = navigator.userAgent.toLowerCase()

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang);
    const uploadUrl = `${process.env.VUE_APP_BASE_API}/opsapi/teachermanager/teacher-manage/front/user/tutor/ops/register/import
`;
    const closeDialog = () => {
      emit('update:visible', false)
    };
    const beforeUpload = (file) => {
      if (file.size > 1024 * 1024 * 1024 * 3) {
        root.$notify({
          message: root.$t(
            "上传的文件大于$1，请编辑后重新上传！".replace("$1", "3M")
          ),
          type: "warning",
        });
        return false;
      }
    };

    const handleFile = (url, formData) => {
      axios({
        url: url,
        method: 'post',
        data: formData,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
            }`,
          "X-LNG": root.$store.getters.currentLang,
          "X-TZ": timezone.name() + " " + datetime.getTimeZone(),
          "X-DEVICE": getDevice(ua),
        },
      }).then((response) => {
        console.log(response)
        try {
          const enc = new TextDecoder("utf-8");
          const res = JSON.parse(enc.decode(new Uint8Array(response.data)));
          if (res.code === 200) {
            root.$confirm(
              root.$t('数据上传成功'),
              root.$t("数据导入成功") + '!',
              {
                confirmButtonText: root.$t("我知道了"),
                showCancelButton: false
              }
            ).then(() => {
              emit('uploadSuccess')
            });
          } else {
            root.$notify.error({ message: res.message || root.$t('操作失败') })
          }
        } catch {
          root.$alert(
            root.$t(
              "批量创建老师账号处理结束， 详情请查看已下载的文件《批量创建老师账号结果.xlsx》"
            ),
            root.$t("文件上传完成") + '!',
            {
              confirmButtonText: root.$t("我知道了"),
            }
          );
          let blob = new Blob([response.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = `批量创建老师账号结果.xlsx`; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }
      })
    };

    const upload = ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);
      handleFile(uploadUrl, formData);
    };

    return {
      isEn,
      closeDialog,
      upload,
      beforeUpload,
    };
  },
});
</script>
<style lang="scss" scoped>
.batch-assign-container {
  ::v-deep .el-upload-dragger {
    width: 750px;
  }
}
</style>
