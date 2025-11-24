<template>
  <!-- 工单优先级下拉 -->
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
      v-for="item in options"
      :key="item.value"
      :label="$t(item.label)"
      :value="`${item.value}`"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: [String, Array],
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const options = [
      { label: "低", value: 10 },
      { label: "中", value: 20 },
      { label: "高", value: 30 },
      { label: "紧", value: 40 },
    ];
    const key = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
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
      currentLang,
      key,
      changeSelect,
      options,
    };
  },
};
</script>
