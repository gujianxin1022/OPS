<template>
  <!-- 执行状态下拉筛选 -->
  <div>
    <el-select
      v-model="key"
      filterable
      clearable
      multiple
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
import { onMounted, ref } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const optionList = ref([
      { value: 0, label: root.$t("待执行") },
      { value: 1, label: root.$t("执行中") },
      { value: 2, label: root.$t("已执行") },
      { value: 3, label: root.$t("已取消") },
    ]);
    const key = ref([]);
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
