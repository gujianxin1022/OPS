<template>
  <!-- 根据老师转化率标签筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :disabled="isDisabled"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.configId"
      :label="item.name"
      :value="item.configId"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: String,
      default: null,
    },
    subjectType: {
      type: Number,
      default: 0 /* 0：中文，1：英文，2：数学 */,
    },
  },
  setup(props, { root, emit }) {
    const optionList = ref([]);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const selectId = ref(-1);
    const reqList = async () => {
      const res = await root.$Api.tutorManagement.reqLableOptionsConfig({
        labelType: 3,
        subjectType: props.subjectType,
      });
      optionList.value = res || [];
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
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    onMounted(() => {
      reqList();
    });
    const clear = (id) => {
      selectId.value = id;
      emit("changeSelect", selectId.value);
    };
    return {
      currentLang,
      optionList,
      selectId,
      changeSelect,
      clear,
    };
  },
};
</script>
