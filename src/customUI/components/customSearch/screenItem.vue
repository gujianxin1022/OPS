<template>
  <div :part="part" class="screen-item-wrapper flex-wrapper flex-column-center">
    <div class="screen-item-label" :style="{ width: device === 'mobile' ? '100px' : `${labelWidth}px`}"> <span v-if="star" style="color:red">*</span>{{ label }}</div>
    <div class="screen-item-inner flex-item">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    label: {
      type: String,
      default: 'label'
    },
    labelWidth: {
      type: String,
      default: '140'
    },
    part: {
      type: Number,
      default: 3
    },
    star: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';

.screen-item-wrapper {
  margin: 10px 0;
  .screen-item-label {
    padding: 0 10px;
    line-height: 32px;
    text-align: right;
    @include font-style(12px, #666);
  }
  .screen-item-inner {
    line-height: 32px!important;
    display: flex;
    .el-select {
      width: 100%!important;
      flex: 0 0 1;
    }
  }
}
.screen-item-inner {
  line-height: 32px!important;
  .el-select {
    width: 100%!important;
  }
  .el-input {
    width: 100%!important;
  }
}
</style>
