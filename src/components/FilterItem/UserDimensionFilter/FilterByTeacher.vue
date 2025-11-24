<template>
  <!-- 根据教师id动态搜索组件 -->
  <el-autocomplete
    style="width: 100%"
    v-model="result"
    :fetch-suggestions="querySearchAsync"
    :placeholder="$t('请输入教师ID')"
    :maxlength="16"
    show-word-limit
    :debounce="400"
    @focus="result = ''"
    @select="handleSelect"
  >
    <template slot-scope="{ item }">
      <div v-if="JSON.stringify(item) !== '{}'">{{ item.value }}</div>
      <div v-else>{{ $t('暂无数据') }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
export default {
  props: {
    businessLine: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { root, emit }) {
    const querySearchAsync = async (queryString, cb) => {
      if (!queryString.length) return;
      const regex = /^\d{16}$/;
      if (!regex.test(queryString)) {
        return root.$notify.warning({ message: root.$t("请输入16位纯数字") });
      }
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.tutorManagement.getTutorList(1, 10, {
          teacherUsername: queryString,
          searchType: "2",
          businessLine: props.businessLine,
        });
        console.log(data);
        let res = {};
        if (data.list.length) {
          res = data.list[0];
          res.value = res.realName;
        }
        cb([res]);
      } catch {
        cb([]);
      } finally {
      }
    };
    const result = ref("");
    const handleSelect = (user) => {
      console.log(user);
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
