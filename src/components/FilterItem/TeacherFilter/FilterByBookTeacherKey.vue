<template>
  <!-- 根据老师姓名，昵称，id筛选 -->
  <div class="teacher-filter-key-warp">
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
        class="search-type"
      >
        <el-option :label="$t('按真实姓名搜索')" value="1"></el-option>
        <el-option :label="$t('按老师昵称搜索')" value="2"></el-option>
        <el-option :label="$t('按教师ID')" value="3"></el-option>
      </el-select>
    </el-input>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "@vue/composition-api";
export default {
  name: "FilterByBookTeacherKey",
  setup(props, { root, emit }) {
    const searchState = reactive({
      value: "",
      type: "1",
    });
    const myPlaceholder = ref("请输入教师姓名");
    const changeSearchType = (type) => {
      switch (type) {
        case "1":
          myPlaceholder.value = "请输入教师姓名";
          break;
        case "2":
          myPlaceholder.value = "请输入教师昵称";
          break;
        case "3":
          myPlaceholder.value = "请输入教师ID";
          break;
      }
      emit("changeSearchType", type);
    };
    const changeSearchValue = (val) => {
      emit("changeSearchValue", val);
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
.teacher-filter-key-warp {
  .el-select .el-input {
    .el-input__inner {
      width: 140px;
    }
    width: 140px;
  }
  .input-with-select{
    width: 398px;
  }
}
</style>
