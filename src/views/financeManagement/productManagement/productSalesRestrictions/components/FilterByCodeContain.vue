<template>
  <el-input
    :placeholder="$t('请输入')"
    v-model="value"
    clearable
    class="code-contain-warp"
    @keyup.enter.native="search"
  >
    <el-select v-model="type" slot="prepend" :placeholder="$t('请选择')">
      <el-option :label="$t('包含')" value="0"></el-option>
      <el-option :label="$t('不包含')" value="1"></el-option>
    </el-select>
  </el-input>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const type = ref("0");
    const value = ref("");
    watch(
      () => value.value,
      (val) => {
        emit("change", type.value, val);
      }
    );
    watch(
      () => type.value,
      (val) => {
        emit("change", val, value.value);
      }
    );
    const search=()=>{
      emit("search");
    }
    return {
      currentLang,
      type,
      value,
      search
    };
  },
};
</script>
<style lang="scss">
.code-contain-warp {
  .el-input__inner {
    width: 192px !important;
  }
  .el-input-group__prepend {
    .el-input {
      width: 100px;
    }
    .el-input__inner {
      width: 100px !important;
    }
  }
}
</style>
