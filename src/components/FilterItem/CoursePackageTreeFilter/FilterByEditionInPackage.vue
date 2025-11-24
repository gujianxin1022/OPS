<template>
  <!-- 课程包下的版本下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('版本')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.packageTreeId"
      :label="isEn ? item.editionNameOpsEn : item.editionNameOpsZh"
      :value="item.packageTreeId"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    coursePackageId: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async (coursePackageId) => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryPackageTreeList({
        packageId: coursePackageId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data || [];
    };
    const name = ref("");
    const courseEditionId = ref("");
    const changeSelect = async (val) => {
      optionList.value.some((e) => {
        if (e.packageTreeId == val) {
          name.value = isEn.value ? e.editionNameOpsEn : e.editionNameOpsZh;
          courseEditionId.value = e.courseRootId;
        }
        return e.packageTreeId == val;
      });
      emit("changeSelect", val);
      emit("changeName", name.value);
      emit("changeCourseEditionId", courseEditionId.value);
    };
    const init = () => {
      selectId.value = "";
      emit("changeSelect", "");
      optionList.value = [];
    };
    watch(
      () => props.coursePackageId,
      (val) => {
        init();
        if (val === "" || !val || val === "undefined") return;
        reqOptionList(val);
      },
      {
        immediate: true,
      }
    );
    const clear = () => {
      selectId.value = [];
    };
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      clear,
    };
  },
};
</script>
