<template>
  <!-- 老师请假类型筛选 -->
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
      { value: "", label: "全部" },
      { value: "1", label: "事假" },
      { value: "2", label: "病假" },
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
