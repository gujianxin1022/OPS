<template>
  <el-autocomplete
    v-model="result"
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('搜索代管人（姓名或邮箱）')"
    @select="handleSelect"
    clearable
    ref="autocomplete"
    @clear="handleClear"
  ></el-autocomplete>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
export default {
  props: ["user", "excludedUserId"],
  setup(props, { root, emit, refs }) {
    const querySearchAsync = async (queryString, cb) => {
      try {
        const res = await root.$Api.systemManagement.reqUserListByidentity({
          identity: queryString,
          excludedUserId: props.excludedUserId,
        });
        res.forEach((e) => {
          e.value = e.email ? `${e.username} (${e.email})` : e.username;
        });
        cb(res);
      } catch {
        cb([]);
      } finally {
      }
    };

    // 自动搜索并选中第一项的函数
    const autoSearchAndSelect = async (searchText) => {
      if (!searchText) return;

      try {
        const res = await root.$Api.systemManagement.reqUserListByidentity({
          identity: searchText,
          excludedUserId: props.excludedUserId,
        });

        if (res && res.length > 0) {
          const firstUser = res[0];
          firstUser.value = firstUser.email
            ? `${firstUser.username} (${firstUser.email})`
            : firstUser.username;
          result.value = firstUser.value;
          emit("change", firstUser);
        }
      } catch (error) {
        console.error("Auto search failed:", error);
      }
    };

    const result = ref("");
    const handleSelect = (user) => {
      emit("change", user);
    };
    const handleClear = () => {
      refs.autocomplete.$children[0].blur();
    };
    watch(
      () => result.value,
      (val) => {
        if (!val) {
          emit("change", null);
        }
      }
    );

    return {
      result,
      querySearchAsync,
      handleSelect,
      autoSearchAndSelect,
      handleClear,
    };
  },
};
</script>
