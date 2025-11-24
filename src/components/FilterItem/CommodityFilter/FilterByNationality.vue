<template>
  <!-- 国籍下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.areaId"
      :label="isEn ? item.nameEn : item.nameZh"
      :value="item.areaId"
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
    const currentLang = computed(() => root.$store.getters.currentLang);
    const optionList = ref([]);
    const selectId = ref([]);
    const reqOptionList = async () => {
      const res = await root.$Api.tutorManagement.getCountryList({
        "X-LNG": currentLang.value,
      });
      optionList.value = res || [];
    };
    const nationalityNameArr = ref([]);
    const changeSelect = async (val) => {
      nationalityNameArr.value = [];
      if (val && val.length) {
        val.forEach((e) => {
          const selectedOption = optionList.value.find(
            (item) => item.areaId === e
          );
          nationalityNameArr.value.push(selectedOption.nameZh);
          nationalityNameArr.value.push(selectedOption.nameEn);
        });
      }
      emit("changeSelect", nationalityNameArr.value);
    };

    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
    };
  },
};
</script>
