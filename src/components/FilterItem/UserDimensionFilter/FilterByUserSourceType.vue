<template>
  <!-- 根据用户类型筛选 -->
  <el-select
    v-model="key"
    filterable
    clearable
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('请选择用户类型')"
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
      { value: "LTO", label: "低接触" },
      { value: "HT", label: "高接触" },
    ]);
    const key = ref("");
    const changeSelect = async (val) => {
      emit("change", val);
    };
    onMounted(() => {
      optionList.value = props.isShowAll
        ? [
            { value: "", label: "全部" },
            { value: "LTO", label: "低接触" },
            { value: "HT", label: "高接触" },
          ]
        : [
            { value: "LTO", label: "低接触" },
            { value: "HT", label: "高接触" },
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
