<template>
  <!-- 根据老师语言标签筛选 -->
  <div class="teacher-filter-style-warp">
    <el-select
      v-bind="$attrs"
      v-model="styleIds"
      multiple
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="placeholder"
      @change="changeSelect"
    >
      <el-option
        v-for="item in styleList"
        :key="item.configId"
        :label="item.name"
        :value="item.configId"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    subjectType: {
      type: Number,
      default: 0 /* 0：中文，1：英文，2：数学 */,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  setup(props, { root, emit }) {
    const styleList = ref([]);
    const styleIds = ref([]);
    const getStyleList = async () => {
      const res = await root.$Api.tutorManagement.reqLableOptionsConfig({
        labelType: 1,
        subjectType: props.subjectType,
      });
      styleList.value = res || [];
    };
    const changeSelect = async (val) => {
      emit("changeStyleSelect", val);
    };
    const clear = () => {
      styleIds.value = "";
    };
    onMounted(() => {
      getStyleList();
    });
    return {
      styleList,
      styleIds,
      changeSelect,
      clear,
    };
  },
};
</script>
