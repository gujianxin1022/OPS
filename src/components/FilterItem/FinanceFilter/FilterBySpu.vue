<template>
  <!-- 全部spu下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :multiple="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="getLabel(item)"
      :value="item.spuId"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getSPUList({
        type: -1,
        status: -1,
        appShow: -1,
        pageNum: 1,
        pageSize: 1000,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data?.list || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val.join(','));
    };
    const getLabel = (item) => {
      return isEn.value ? item.spuNameEn : item.spuNameCn;
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
