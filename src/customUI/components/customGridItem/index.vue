<template>
  <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
    <slot />
  </el-col>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'label'
    },
    part: {
      type: Number,
      default: 4
    },
    xs: {
      type: Number || Object,
      default() {
        if (this.part === 1) return 24
        if (this.part === 2) return 24
        if (this.part === 3) return 24
        if (this.part === 4) return 24
        if (this.part === 6) return 24
        if (this.part === 8) return 12
        if (this.part === 12) return 8
        if (this.part === 24) return 4
      }
    },
    sm: {
      type: Number || Object,
      default() {
        if (this.part === 1) return 24
        if (this.part === 2) return 24
        if (this.part === 3) return 24
        if (this.part === 4) return 12
        if (this.part === 6) return 12
        if (this.part === 8) return 6
        if (this.part === 12) return 4
        if (this.part === 24) return 3
      }
    },
    md: {
      type: Number || Object,
      default() {
        if (this.part === 1) return 24
        if (this.part === 2) return 24
        if (this.part === 3) return 12
        if (this.part === 4) return 12
        if (this.part === 6) return 6
        if (this.part === 8) return 6
        if (this.part === 12) return 4
        if (this.part === 24) return 3
      }
    },
    lg: {
      type: Number || Object,
      default() {
        if (this.part === 1) return 24
        if (this.part === 2) return 12
        if (this.part === 3) return 8
        if (this.part === 4) return 6
        if (this.part === 6) return 4
        if (this.part === 8) return 3
        if (this.part === 12) return 2
        if (this.part === 24) return 2
      }
    },
    xl: {
      type: Number || Object,
      default() {
        if (this.part === 1) return 24
        if (this.part === 2) return 12
        if (this.part === 3) return 8
        if (this.part === 4) return 6
        if (this.part === 6) return 4
        if (this.part === 8) return 3
        if (this.part === 12) return 2
        if (this.part === 24) return 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-item-wrapper {
  margin: 10px 0;
  .screen-item-label {
    padding: 0 10px;
    min-width: 100px;
    line-height: 36px;
    text-align: right;
  }
}
</style>
