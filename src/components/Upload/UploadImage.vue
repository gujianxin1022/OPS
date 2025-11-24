<template>
  <div class="upload-img">
    <el-image
      v-if="showImg"
      class="image-slot"
      style="width: 250px; height: 50px"
      :src="imgSrc"
      :preview-src-list="[imgSrc]"
    >
      <div slot="error">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <el-upload
      :before-upload="beforeImageUpload"
      accept="image/jpg, image/png, image/jpeg"
      :show-file-list="false"
      :http-request="uploadImage"
    >
      <section>
        <el-button :disabled="disabled" :loading="loading" size="mini" type="text">
          {{ isReUpload ? $t("重新上传") : $t("点击上传") }}
        </el-button>
      </section>
    </el-upload>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { uploadVideoFun } from "@/views/teacherManagement/videoResources/components/uploadVideoFun";

export default {
  props: {
    showImg: { type: Boolean, default: true },
    isReUpload: { type: Boolean, default: false },
    imgUrl: { type: String, default: "" },
    disabled: { type: Boolean, default: false },

  },
  setup(props, { root, emit, refs }) {
    const loading = ref(false);
    const imgSrc = ref("");
    if (props.imgUrl && props.imgUrl.length > 0) {
      imgSrc.value = props.imgUrl;
    }
    const beforeImageUpload = async (file) => {
      const { validateFileType, validateFileSize } = uploadVideoFun(root);
      await validateFileType(file.name, ["jpeg", "jpg", "png"]);
      await validateFileSize(file.size, 2);
    };
    const uploadImage = async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", 1); // 1-sku上传; 2-订单退款上传
      try {
        loading.value = true;
        const {
          status,
          data: { code, data },
        } = await root.$Api.systemManagement.uploadFileInterface(formData);
        if (status !== 200 || code !== 200) return Promise.reject();
        emit("uploadedSuccessfully", data);
        emit("change", data);
        imgSrc.value = data;
      } finally {
        loading.value = false;
      }
    };
    return {
      disabled:props.disabled,
      showImg: props.showImg,
      isReUpload: props.isReUpload,
      loading,
      imgSrc,
      beforeImageUpload,
      uploadImage,
    };
  },
};
</script>
<style lang="scss" scoped>
.upload-img {
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 14px;
  }
}
</style>
