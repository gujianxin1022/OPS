<template>
  <!-- 工单分类下拉 -->
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
      :key="item.id"
      :label="$t(item.name)"
      :value="`${item.id}`"
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
    options: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
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
    };
  },
};
</script>
