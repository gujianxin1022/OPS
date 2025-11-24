<template>
  <!-- 根据学管账号动态搜索组件 -->
  <el-autocomplete
    v-model="result"
    clearable
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('请输入学管账号')"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const querySearchAsync = async (queryString, cb) => {
      try {
        const res = await root.$Api.taskManagement.reqLaListByAccount({
          userName: queryString,
        });
        res.forEach((e) => {
          e.value = e.username;
        });
        cb(res);
      } catch {
        cb([]);
      } finally {
      }
    };
    const result = ref("");
    const handleSelect = (user) => {
      emit("change", user);
    };
    watch(
      () => result.value,
      (val) => {
        if (!val) {
          emit("change", { id: null });
        }
      }
    );

    onMounted(() => {});
    return {
      result,
      querySearchAsync,
      handleSelect,
    };
  },
};
</script>
