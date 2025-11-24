<template>
  <div class="list-indicator">
    <span v-if="finished" class="no-more-text">{{ $t("没有更多了") }}</span>
    <i v-else class="el-icon-loading"></i>
  </div>
</template>

<script>
export default {
  props: {
    // 是否已加载完成
    finished: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.list-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  font-size: 18px;
}
.no-more-text {
  font-size: 12px;
  color: #666;
}
</style>
