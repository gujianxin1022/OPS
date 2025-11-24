<template>
  <!-- 订单类型下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in Constants.orderList(isEn)"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const selectId = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };

    return {
      isEn,
      selectId,
      changeSelect,
    };
  },
};
</script>
