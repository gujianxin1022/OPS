<template>
  <div class="local-tag" :class="{ 'is-active': isActive }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.local-tag {
  display: inline-block;
  background-color: #F2F3FF;
  border-radius: 6px;
  padding: 6px 12px;
  color: #5D5F7B;
  font-size: 12px;

  &+& {
    margin-left: 10px;
  }
  &.is-active {
    background-color: #ff6c27;
    color: #fff;
  }
}
</style>
