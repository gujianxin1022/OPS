<template>
  <el-input
    :placeholder="$t('请输入')"
    v-model="value"
    clearable
    class="input-with-select-sku"
    @keyup.enter.native="search"
  >
    <el-select v-model="type" slot="prepend" :placeholder="$t('请选择')">
      <el-option :label="$t('名称')" value="1"></el-option>
      <el-option label="ID" value="2"></el-option>
    </el-select>
  </el-input>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const type = ref("1");
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
<style>
.input-with-select-sku {
  .el-input__inner {
    width: 150px !important;
  }
  .el-input-group__prepend {
    .el-input {
      width: 80px;
    }
    .el-input__inner {
      width: 80px !important;
    }
  }
}
</style>
