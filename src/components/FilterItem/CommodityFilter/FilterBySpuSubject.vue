<template>
  <!-- 学科下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in Constants.subjectList(currentLang)"
      :key="item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const selectId = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    return {
      currentLang,
      selectId,
      changeSelect,
    };
  },
};
</script>
