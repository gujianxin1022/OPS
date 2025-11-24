<template>
  <!-- 根据用户续费阶段筛选 -->
  <el-select
    v-model="key"
    filterable
    clearable
    :multiple="multiple"
    :collapse-tags="true"
    multiple-limit="6"
    :placeholder="$t('请选择用户续费阶段')"
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
      { value: "M0", label: "M0" },
      { value: "M1", label: "M1" },
      { value: "M2", label: "M2" },
      { value: "M3", label: "M3" },
      { value: "M4", label: "M4" },
      { value: "M5", label: "M5" },
      { value: "M6", label: "M6" },
      { value: "M7", label: "M7" },
      { value: "M8", label: "M8" },
      { value: "M9", label: "M9" },
      { value: "M10", label: "M10" },
      { value: "M11", label: "M11" },
      { value: "M12", label: "M12" },
      { value: "M12+", label: "M12+" },
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
