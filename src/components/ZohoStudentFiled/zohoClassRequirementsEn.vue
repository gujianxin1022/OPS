<template>
  <el-select
    v-model="key"
    filterable
    clearable
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
    multiple-limit="3"
  >
    <el-option
      v-for="item in classRequirementslListForEn(isEn)"
      :key="item.value"
      :label="$t(item.label)"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import { classRequirementslListForEn } from "@/utils/zoho_menu.js";
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
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const key = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    watch(
      () => props.initVal,
      (val) => {
        if (!val) return [];
        if (typeof val === "object") {
          return (key.value = val || "");
        }
        key.value = val.split(",") || "";
      },
      {
        immediate: true,
      }
    );
    return {
      isEn,
      key,
      multiple: props.multiple,
      changeSelect,
      classRequirementslListForEn,
    };
  },
};
</script>
