<template>
  <!-- 课程包下的级别下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    :collapse-tags="true"
    :placeholder="$t('单元')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    levelId: {
      type: String,
      default: '',
    },
    unitList: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const init = () => {
      selectId.value = "";
      emit("changeSelect", "");
      optionList.value = [];
    };
    watch(
      () => props.levelId,
      () => {
        init();
      }
    );
    watch(
      () => props.unitList,
      (val) => {
        optionList.value = val;
      }
    );
    watch(
      () => selectId.value,
      (val) => {
        let unitItem = optionList.value.filter((v) => {
          return v.id === val;
        });
        const lessonOptions = unitItem[0]?.children || [];
        emit("changeLessonOptions", lessonOptions);
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