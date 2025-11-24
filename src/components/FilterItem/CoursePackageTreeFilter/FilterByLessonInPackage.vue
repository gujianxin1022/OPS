<template>
  <!-- 课程包下的级别下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    multiple
    :multiple-limit="limit"
    :collapse-tags="true"
    :placeholder="$t('Lesson')"
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
    unitId: {
      type: String,
      default: '',
    },
    lessonOptionsList: {
      type: Array,
      default: [],
    },
    limit:{
      type: Number,
      default: 0,
    }
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref([]);
    const changeSelect = async (val) => {
      emit("changeSelect", val);
      if (val.length <= 0) {
        emit("changeSelect", handleAllLessonAtUnit(optionList.value));
      }
    };
    const init = () => {
      selectId.value = [];
      optionList.value=[]
      emit("changeSelect", []);
    };
    const handleAllLessonAtUnit = (arr) => {
      let lessonIdList = [];
      arr.map((v) => {
        lessonIdList.push(v.id);
      });
      return lessonIdList;
    };
    watch(
      () => props.lessonOptionsList,
      (val) => {
        console.log();
        if (val.length <= 0) {
          init();
        } else {
          optionList.value = val;
          let lessonIdList = handleAllLessonAtUnit(val);
          emit("changeSelect", lessonIdList);
        }
      }
    );
    watch(
      () => props.unitId,
      () => {
        selectId.value = [];
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