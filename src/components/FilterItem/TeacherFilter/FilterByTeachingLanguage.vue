<template>
  <!-- 根据老师语言标签筛选 -->
  <div>
    <el-select
      v-model="langIds"
      multiple
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择语言标签')"
      @change="changeSelect"
    >
      <el-option
        v-for="item in langList"
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
    const langList = ref([]);
    const langIds = ref([]);
    const getLangList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.tutorManagement.getExamineDic(5);
      if (status !== 200 || code !== 200) return Promise.reject();
      langList.value = data || [];
    };
    const changeSelect = async (val) => {
      emit("changeLangSelect", val);
    };
    onMounted(() => {
      getLangList();
    });
    return {
      langList,
      langIds,
      changeSelect,
    };
  },
};
</script>
