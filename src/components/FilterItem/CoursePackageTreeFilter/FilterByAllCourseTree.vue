<template>
  <!-- 所有课程树（版本）下拉 -->
  <el-select
    :style="`width:${isEn ? 360 : 280}px`"
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
      :key="item.editionId"
      :label="getLabel(item)"
      :value="`${item.editionId}`"
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
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      const {
        status,
        data: { code, data },
      } = await await root.$Api.courseTree.reqAllCourseTreeList();
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const getLabel = (item) => {
      return isEn.value ? item.editionNameOpsEn : item.editionNameOpsZh;
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
      multiple: props.multiple,
      optionList,
      selectId,
      changeSelect,
      getLabel,
    };
  },
};
</script>
