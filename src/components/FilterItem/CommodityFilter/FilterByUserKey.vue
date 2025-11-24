<template>
  <!-- 根据学生/家长的姓名/id筛选 -->
  <div class="user-filter-key-warp">
    <el-input
      :placeholder="$t(myPlaceholder)"
      v-model="value"
      clearable
      class="input-with-select"
      @change="changeSearchValue"
      @keyup.enter.native="search"
    >
      <el-select
        v-model="type"
        @change="changeSearchType"
        slot="prepend"
        :placeholder="$t('请选择')"
      >
        <el-option :label="$t('按学生姓名')" value="studentName"></el-option>
        <el-option :label="$t('按学生ID')" value="studentUserId"></el-option>
        <el-option :label="$t('按家长ID')" value="parentUserId"></el-option>
      </el-select>
    </el-input>
  </div>
</template>

<script>
import { reactive, toRefs, ref, computed, watch } from "@vue/composition-api";
export default {
  name: "FilterByUserKey",
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const searchState = reactive({
      value: "",
      type: "studentName",
    });
    const myPlaceholder = ref("请输入学生姓名");
    const changeSearchType = (type) => {
      searchState.type = type;
      searchState.value = "";
      switch (type) {
        case "studentName":
          myPlaceholder.value = "请输入学生姓名";
          break;
        case "studentUserId":
          myPlaceholder.value = "请输入学生ID";
          break;
        case "parentUserId":
          myPlaceholder.value = "请输入家长ID";
          break;
      }
      changeSearchValue();
    };

    const changeSearchValue = () => {
      const keyArr = ["studentName", "studentUserId", "parentUserId"];
      const delKeyArr = keyArr.filter((e) => {
        return e !== searchState.type;
      });
      emit("changeSearchValue", searchState, delKeyArr);
    };
    const search = () => {
      emit("search");
    };
    return {
      ...toRefs(searchState),
      changeSearchType,
      changeSearchValue,
      search,
      myPlaceholder,
    };
  },
};
</script>

<style lang="scss">
.user-filter-key-warp {
  .el-select .el-input {
    .el-input__inner {
      width: 120px !important;
    }
    width: 120px;
  }
}
</style>
