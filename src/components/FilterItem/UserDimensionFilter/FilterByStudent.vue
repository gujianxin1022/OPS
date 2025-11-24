<template>
  <!-- 根据学生id动态搜索组件 -->
  <el-autocomplete
    style="width: 100%"
    v-model="result"
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('请输入学生ID')"
    :maxlength="16"
    show-word-limit
    :debounce="400"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
export default {
  props: ["user"],
  setup(props, { root, emit }) {
    const querySearchAsync = async (queryString, cb) => {
      const regex = /^\d{16}$/;
      if (!regex.test(queryString)) {
        return root.$notify.warning({ message: root.$t("请输入16位纯数字") });
      }
      try {
        const res = await root.$Api.classManagement.reqBookStudentById({
          studentId: queryString,
        });
        // 2688550635732979
        // 1396670590186679
        // 4768935140599649
        res.value = res.studentName;
        cb([res]);
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
          emit("change", { userInfo: { id: null } });
        }
      }
    );
    watch(
      () => props.user,
      (val) => {
        result.value = val.businessUserName;
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
