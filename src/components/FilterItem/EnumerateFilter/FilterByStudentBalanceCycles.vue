<template>
  <!-- 根据用户剩余课时预计消耗时长筛选 -->
  <el-select
    v-model="key"
    filterable
    style="width: 230px;"
    clearable
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('请选择剩余课时预计消耗时长')"
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
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const optionList = ref([
      { value: "P1", label: "P1" },
      { value: "P2", label: "P2" },
      { value: "P3", label: "P3" },
      { value: "P4", label: "P4" },
      { value: "P5", label: "P5" },
      { value: "P6", label: "P6" },
      { value: "P6+", label: "P6+" },
    ]);
    const key = ref("");
    const changeSelect = async (val) => {
      emit("change", val);
    };
    watch(
      () => props.initVal,
      (val) => {
        key.value = val || "";
      },
      {
        immediate: true,
      }
    );

    return {
      optionList,
      key,
      multiple: props.multiple,
      changeSelect,
    };
  },
};
</script>
