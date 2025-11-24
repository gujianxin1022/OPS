<template>
  <!-- 根据LA/CC筛选 -->
  <el-select
    v-model="key"
    filterable
    clearable
    :multiple="multiple"
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
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    isShowAll: {
      type: Boolean,
      default: true,
    },
    initVal: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const optionList = ref([
      { value: "", label: "全部" },
      { value: "1", label: "学管" },
      { value: "2", label: "销售" },
      { value: "3", label: "教师" },
    ]);
    const key = ref("");
    const changeSelect = async (val) => {
      emit("change", val);
    };
    onMounted(() => {
      optionList.value = props.isShowAll
        ? [
            { value: "", label: "全部" },
            { value: "1", label: "学管" },
            { value: "2", label: "销售" },
            { value: "3", label: "教师" },
          ]
        : [
            { value: "1", label: "学管" },
            { value: "2", label: "销售" },
            { value: "3", label: "教师" },
          ];
    });
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
