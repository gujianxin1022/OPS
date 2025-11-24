<template>
  <!-- 学科下拉 -->
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
      v-for="item in availableLevelsAtThisPeriodlList(isEn)"
      :key="item.value"
      :label="$t(item.label)"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import { availableLevelsAtThisPeriodlList } from "@/utils/zoho_menu.js";
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
        key.value = val || "";
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
      availableLevelsAtThisPeriodlList
    };
  },
};
</script>
