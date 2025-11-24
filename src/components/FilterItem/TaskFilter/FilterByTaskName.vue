<template>
  <!-- 根据任务名称动态搜索组件 -->
  <el-autocomplete
    v-model="result"
    clearable
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('请输入关键字')"
    @select="handleSelect"
    @clear="handelClear"
    :value-key="isEn ? 'typeNameEn' : 'typeNameCn'"
    :debounce="500"
  ></el-autocomplete>
</template>

<script>
import { onMounted, ref, watch, computed } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const querySearchAsync = async (queryString, cb) => {
      try {
        const res = await root.$Api.taskManagement.reqTaskNameOptions({
          taskTypeName: queryString,
        });
        res.forEach((e) => {
          e.value = `${e.typeId}_${e.typeSource}`;
          e.typeNameEn=`${e.typeId}_${e.typeNameEn}`;
          e.typeNameCn=`${e.typeId}_${e.typeNameCn}`;
        });
        cb(res);
      } catch {
        cb([]);
      } finally {
      }
    };
    const result = ref("");
    const handleSelect = (val) => {
      let taskTypes = [
        {
          typeId: val.typeId,
          typeSource: val.typeSource,
        },
      ];
      emit("change", taskTypes);
    };
    const handelClear = () => {
      emit("change", null);
    };
    onMounted(() => {});
    return {
      isEn,
      result,
      querySearchAsync,
      handleSelect,
      handelClear,
    };
  },
};
</script>
