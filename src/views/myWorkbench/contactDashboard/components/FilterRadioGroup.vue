<template>
  <el-radio-group v-model="localValue">
    <el-radio-button label="">{{ $t('全部') }}</el-radio-button>
    <el-radio-button label="1">{{ $t('是') }}</el-radio-button>
    <el-radio-button label="0">{{ $t('否') }}</el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '1'
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
};
</script>
