<template>
  <!-- 课程包下拉筛选 -->
  <el-cascader
    v-model="selectId"
    :options="optionList"
    clearable
    :props="{
      value: 'packageId',
      label: 'name',
      children: 'children',
      expandTrigger: 'hover',
    }"
    :placeholder="$t('请选择课程包')"
    @change="changeSelect"
    @remove-tag="clear"
  ></el-cascader>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    classType: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const rawData = ref([]);
    const reqOptionList = async () => {
      const params = props.classType ? { classType: props.classType } : {};
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryClassPackageList(params);
      if (status !== 200 || code !== 200) return Promise.reject();
      rawData.value = data;
      optionList.value = processData(data);
    };
    const processData = (data) => {
      if (!data) return [];
      const categorizedData = {
        0: { name: root.$t("中文"), children: [] },
        1: { name: root.$t("英语"), children: [] },
        2: { name: root.$t("数学"), children: [] },
        3: { name: root.$t("音乐"), children: [] },
        6: { name: root.$t("单词通"), children: [] },
      };
      data.forEach((item) => {
        const category = categorizedData[item.subjectType];
        if (category) {
          category.children.push({
            packageId: item.packageId,
            name: isEn.value
              ? item.coursePackageNameList[1].name
              : item.packageName,
          });
        }
      });
      return Object.values(categorizedData);
    };
    const coursePackageName = ref("");
    const changeSelect = async (val) => {
      if (val.length) {
        rawData.value.some((e) => {
          if (e.packageId == val[1]) {
            coursePackageName.value = isEn.value
              ? e.coursePackageNameList[1].name
              : e.packageName;
          }
          return e.packageId === val[1];
        });
        emit("changeEditionSelect", val[1] + "");
      } else {
        coursePackageName.value = "";
        emit("changeEditionSelect", "");
      }
      emit("getCoursePackageName", coursePackageName.value);
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
        selectId.value = val || "";
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      reqOptionList();
    });
    const clear = () => {
      selectId.value = [];
      emit("getCoursePackageName", "");
    };
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      getCoursePackageName,
      clear,
    };
  },
};
</script>
