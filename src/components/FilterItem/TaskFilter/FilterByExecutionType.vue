<template>
  <!-- 执行类型下拉筛选 -->
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
      { value: "1", label: root.$t("长期执行") },
      { value: "2", label: root.$t("一次执行") },
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
