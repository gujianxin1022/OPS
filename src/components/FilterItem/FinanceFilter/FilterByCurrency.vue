<template>
  <!-- 币种下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :multiple="multiple"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="getLabel(item)"
      :value="item.currency"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
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
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      const data = await root.$Api.systemManagement.getCurrency();
      optionList.value = data || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const getLabel = (item) => {
      return isEn.value ? item.currencyEn : item.currencyZh;
    };
    watch(
      () => props.initVal,
      (val) => {
        selectId.value = val || "";
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      getLabel,
      multiple: props.multiple,
    };
  },
};
</script>
