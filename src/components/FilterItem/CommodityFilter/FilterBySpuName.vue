<template>
  <!-- spu下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
    :multiple="multiple"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="getLabel(item)"
      :value="getLabel(item)"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      const res = await root.$Api.financeManagement.reqSpuFilterList();
      optionList.value = res || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const getLabel = (item) => {
      return isEn.value ? item.nameEn : item.nameCn;
    };
    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      getLabel,
    };
  },
};
</script>
