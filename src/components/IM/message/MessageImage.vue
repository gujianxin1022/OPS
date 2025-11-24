<template>
  <el-image
    class="message-image"
    :src="originalUrl"
    fit="contain"
    lazy
    :preview-src-list="[originalUrl]"
  ></el-image>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageList() {
      return this.content.ImageInfoArray || [];
    },
    // 缩略图
    thumbnailUrl() {
      const info = this.imageList.find((item) => item.Type === 3);
      return info?.URL;
    },
    // 原图
    originalUrl() {
      const info = this.imageList.find((item) => item.Type === 1);
      return info?.URL;
    },
  },
};
</script>

<style lang="scss" scoped>
.message-image {
  width: 200px;
  height: 200px;
  ::v-deep .el-image__preview {
    object-position: left top;
  }
}
</style>
