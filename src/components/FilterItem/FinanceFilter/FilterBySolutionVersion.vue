<template>
  <!-- 支付路由方案版本下拉下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="item.label"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    initVal: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    watch(
      () => isEn.value,
      () => {
        optionList.value = [
          { id: 1, label: "V1" },
          { id: 2, label: "V2" },
          { id: 3, label: "V3" },
          { id: 4, label: "V4" },
          { id: 5, label: "V5" },
          { id: 6, label: "V6" },
          { id: 7, label: "V7" },
          { id: 8, label: "V8" },
          { id: 9, label: "V9" },
          { id: 10, label: "V10" },
        ];
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.initVal,
      (val) => {
        selectId.value = val || "";
      },
      {
        immediate: true,
      }
    );
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
    };
  },
};
</script>
