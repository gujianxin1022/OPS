<template>
  <!-- 任务状态下拉筛选 -->
  <div>
    <el-select
      v-model="key"
      filterable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      @change="changeSelect"
    >
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="$t(item.label)"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const optionList = ref([
      { value: "1", label: root.$t("未完成任务") },
      { value: "2", label: root.$t("已完成任务") },
      { value: "3", label: root.$t("已失效任务") },
      { value: "4", label: root.$t("已作废任务") },
    ]);
    const key = ref("1");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };

    return {
      optionList,
      key,
      changeSelect,
    };
  },
};
</script>
