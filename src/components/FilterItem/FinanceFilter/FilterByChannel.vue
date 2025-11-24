<template>
  <!-- 渠道及联选择筛选 -->
  <el-cascader
    v-model="value"
    clearable
    :options="optionList"
    :placeholder="$t('请选择')"
    :props="{ expandTrigger: 'hover',value: 'channelName', label: 'channelName' ,children:'childList'}"
    @change="changeSelect"
  ></el-cascader>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      root.$Api.financeManagement
        .getChannelList()
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            optionList.value = data ?? [];
          }
        });
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const getLabel = (item) => {
      return isEn.value ? item.currencyEn : item.currencyZh;
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
