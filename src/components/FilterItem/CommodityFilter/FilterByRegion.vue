<template>
  <!-- 国家区域下拉筛选 -->
  <el-cascader
    :key="keyIndex"
    filterable
    @change="changeSelect"
    style="width: 200px"
    :placeholder="$t('请选择')"
    :props="countryProps"
    :options="optionList"
    :show-all-levels="false"
    :collapse-tags="true"
    v-model="selectId"
    size="mini"
    clearable
  ></el-cascader>
</template>

<script>
import {
  watch,
  onMounted,
  ref,
  computed,
  reactive,
} from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const keyIndex = ref(1);
    const reqOptionList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.base.getCountryList();
      if (status !== 200 || code !== 200) {
        return Promise.resolve([]);
      }
      data.unshift({
        code: "Global",
        nameEn: "Global",
        nameZh: "全球",
      });
      optionList.value = data || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const countryProps = reactive({
      emitPath: false,
      multiple: true,
      children: "children",
      label: isEn.value ? "nameEn" : "nameZh",
      value: "code",
    });
    watch(
      () => isEn.value,
      (val) => {
        keyIndex.value++;
        countryProps.label = val ? "nameEn" : "nameZh";
      }
    );

    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      selectId,
      countryProps,
      keyIndex,
      changeSelect,
    };
  },
};
</script>
