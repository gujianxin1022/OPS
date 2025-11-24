<template>
  <!-- 根据用户角色筛选 -->
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
    const optionList = ref([]);
    const key = ref("");
    const changeSelect = async (val) => {
      emit("change", val);
    };
    onMounted(() => {
      optionList.value = props.isShowAll
        ? [
            { value: "", label: "全部" },
            { value: 4, label: "课程顾问" },
            { value: 5, label: "学管" },
            { value: 6, label: "客服" },
          ]
        : [
            { value: 4, label: "课程顾问" },
            { value: 5, label: "学管" },
            { value: 6, label: "客服" },
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
