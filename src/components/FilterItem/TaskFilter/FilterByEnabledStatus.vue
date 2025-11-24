<template>
  <!-- 启用状态下拉筛选 -->
  <div>
    <el-select
      v-model="key"
      filterable
      clearable
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
      { value: "", label: root.$t("全部") },
      { value: "0", label: root.$t("启用") },
      { value: "1", label: root.$t("停用") },
    ]);
    const key = ref("");
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
