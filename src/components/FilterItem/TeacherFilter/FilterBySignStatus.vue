<template>
  <!-- 教师合同签署状态下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="item.label"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    watch(
      () => isEn.value,
      () => {
        optionList.value = [
          { id: 0, label: root.$t("已完成") },
          { id: 1, label: root.$t("待签署") },
        ];
      },
      {
        immediate: true,
      }
    );
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
    };
  },
};
</script>
