<template>
  <!-- 根据老师语言标签筛选 -->
  <div class="teacher-filter-style-warp">
    <el-select
      v-model="styleIds"
      multiple
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      @change="changeSelect"
    >
      <el-option
        v-for="item in styleList"
        :key="item.id"
        :label="$t(item.typeKey)"
        :value="item.id"
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
  },
  setup(props, { root, emit }) {
    const styleList = ref([]);
    const styleIds = ref([]);
    const getStyleList = async () => {
      const {
        status,
        data: { code, data },
      } =await root.$Api.tutorManagement.getExamineDic(4);
      if (status !== 200 || code !== 200) return Promise.reject();
      styleList.value = data || [];
    };
    const changeSelect=async (val)=>{
      emit('changeStyleSelect',val)
    }
    onMounted(()=>{
      getStyleList()
    });
    return {
      styleList,
      styleIds,
      changeSelect
    };
  },
};
</script>