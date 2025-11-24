<template>
  <!-- 课程包下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :placeholder="$t('请选择课程包')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.packageId"
      :label="getCoursePackageName(item)"
      :value="`${item.packageId}`"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    classType: {
      type: Number,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: Array,
      default: [],
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref([]);
    const reqOptionList = async () => {
      const params = props.classType ? { classType: props.classType } : {};
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryClassPackageList(params);
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data || [];
    };
    const changeSelect = async (val) => {
      emit("changeEditionSelect", val);
    };
    const getCoursePackageName = (item) => {
      return (
        item.coursePackageNameList.find((t) =>
          isEn.value ? t.languageCode === "EN" : t.languageCode === "CN"
        )?.name || item.packageName
      );
    };
    watch(
      () => props.initVal,
      (val) => {
        selectId.value = val || [];
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
      getCoursePackageName,
    };
  },
};
</script>
