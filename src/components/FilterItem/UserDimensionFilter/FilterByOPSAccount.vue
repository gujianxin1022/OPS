<template>
  <!-- 根据学管账号动态搜索组件 -->
  <el-autocomplete
    v-model="result"
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('请输入OPS用户账号')"
    @select="handleSelect"
    clearable
  ></el-autocomplete>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
export default {
  props: ["user"],
  setup(props, { root, emit }) {
    const querySearchAsync = async (queryString, cb) => {
      try {
        const res = await root.$Api.systemManagement.getUserInfoList({
          userName: queryString,
          pageNum: 1,
          pageSize: 10,
          status: 1,
        });
        if (res.status !== 200 || res.data.code !== 200)
          return Promise.reject();
        res.data.data.list.forEach((e) => {
          e.value = e.userInfo.username;
        });
        cb(res.data.data.list);
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
          emit("change", {userInfo:{ id: null }});
        }
      }
    );
    watch(
      () => props.user,
      (val) => {
        result.value=val.businessUserName
      }
    );
    return {
      result,
      querySearchAsync,
      handleSelect,
    };
  },
};
</script>
