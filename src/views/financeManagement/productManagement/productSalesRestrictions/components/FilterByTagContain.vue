<template>
  <div class="tag-contain-warp">
    <el-select class="contain-select" v-model="type" :placeholder="$t('请选择')">
      <el-option :label="$t('包含')" value="0"></el-option>
      <el-option :label="$t('不包含')" value="1"></el-option>
    </el-select>
    <el-select
      class="tag-select"
      v-model="value"
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
    >
      <el-option
        v-for="(item, index) in getNewSigningOrRenewalList(isEn)"
        :key="index"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import { getNewSigningOrRenewalList } from "../dataConfig/constant";

export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
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
    return {
      isEn,
      currentLang,
      type,
      value,
      getNewSigningOrRenewalList,
    };
  },
};
</script>
<style lang="scss">
.tag-contain-warp {
  .contain-select {
    .el-input__inner {
      width: 100px !important;
      background: #f5f7fa;
      border-right: none;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
  .tag-select {
    .el-input__inner {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      margin-left: -5px;
    }
  }
}
</style>
