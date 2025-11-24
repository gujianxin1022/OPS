<template>
  <!-- 根据目标用户属性范围选择 -->
  <div class="select-attribute-warp">
    <div v-for="(t, index) in basicConditionList" :key="index">
      <div class="condition-item">
        <el-select
          :style="{ width: isEn ? '180px' : '150px' }"
          v-model="t.conditionCode"
          clearable
          @change="changeConditionCode(t)"
        >
          <el-option
            v-for="item in getBaseConditionList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select style="width: 100px" v-model="t.conditionOperator" clearable>
          <el-option
            v-for="item in getConditionStatus(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 属性值 -->
        <template>
          <!-- 课程进度类型  -->
          <el-select
            class="w194"
            v-model="t.conditionValue"
            clearable
            multiple
            v-show="t.conditionCode === BASE_CONDITION_TYPE.COURSE_TYPE"
          >
            <el-option
              v-for="item in getPlanTypeList(isEn)"
              :key="`${item.value}`"
              :label="item.name"
              :value="`${item.value}`"
            >
            </el-option>
          </el-select>
          <!-- 课包 -->
          <FilterByCoursePackageInit
            :initVal="t.conditionValue"
            v-show="t.conditionCode === BASE_CONDITION_TYPE.COURSE_PACKAGE_ID"
            @changeEditionSelect="
              (val) => {
                t.conditionValue = val;
              }
            "
            :multiple="true"
          />
          <!-- 上课类型  -->
          <el-select
            class="w194"
            v-model="t.conditionValue"
            clearable
            multiple
            v-show="t.conditionCode === BASE_CONDITION_TYPE.CLASS_TYPE"
          >
            <el-option
              v-for="item in Constants.courseTypeList(isEn)"
              :key="item.value"
              :label="item.label"
              :value="`${item.value}`"
            >
            </el-option>
          </el-select>
          <!-- 学科 -->
          <FilterBySubject
            :initVal="t.conditionValue"
            v-show="t.conditionCode === BASE_CONDITION_TYPE.SUBJECT_ID"
            @changeSelect="
              (val) => {
                t.conditionValue = val;
              }
            "
            :multiple="true"
          />
          <!-- 所有版本 -->
          <FilterByAllCourseTree
            :initVal="t.conditionValue"
            v-show="t.conditionCode === BASE_CONDITION_TYPE.PACKAGE_TREE"
            :multiple="true"
            @changeSelect="
              (val) => {
                t.conditionValue = val;
              }
            "
          />
          <!-- 付费方式 -->
          <FilterByPayType
            v-show="t.conditionCode === BASE_CONDITION_TYPE.PAYMENT_TYPE"
            :initVal="t.conditionValue"
            @changeSelect="
              (val) => {
                t.conditionValue = val;
              }
            "
            :multiple="true"
          />
          <!-- 用户接触类型 -->
          <FilterByUserSourceType
            :isShowAll="false"
            :initVal="t.conditionValue"
            :multiple="true"
            v-show="t.conditionCode === BASE_CONDITION_TYPE.PARENT_LTO_LABEL"
            @change="
              (val) => {
                t.conditionValue = val;
              }
            "
          />
        </template>
        <i @click="addOption(index)" class="el-icon-plus"></i>
        <i
          @click.prevent="deleteOption(index)"
          v-if="basicConditionList.length > 1"
          class="el-icon-minus"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import {
  getBaseConditionList,
  getConditionStatus,
  getPlanTypeList,
} from "../dataConfig/constant";
import { BASE_CONDITION_TYPE } from "../dataConfig/enum";
import FilterByCoursePackageInit from "@/components/FilterItem/CoursePackageTreeFilter/FilterByCoursePackageInit";
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import FilterByPayType from "@/components/FilterItem/CommodityFilter/FilterByPayType";
import FilterByUserSourceType from "@/components/FilterItem/UserDimensionFilter/FilterByUserSourceType";
import FilterByAllCourseTree from "@/components/FilterItem/CoursePackageTreeFilter/FilterByAllCourseTree";

export default {
  components: {
    FilterByCoursePackageInit,
    FilterBySubject,
    FilterByPayType,
    FilterByUserSourceType,
    FilterByAllCourseTree,
  },
  props: {},
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const basicConditionList = ref([
      {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
        conditionTarget: "",
      },
    ]);

    const addOption = (index) => {
      if (basicConditionList.value.length >= 30) {
        return root.$message.warning(root.$t("选项最多$个").replace('$','30'));
      }
      basicConditionList.value.splice(index + 1, 0, {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
        conditionTarget: "",
      });
    };
    const deleteOption = (index) => {
      basicConditionList.value.splice(index, 1);
    };
    const changeConditionCode = (t) => {
      if (!t.conditionCode.length) return;
      let item = getBaseConditionList().filter((e) => {
        return e.value === t.conditionCode;
      })[0];
      t.conditionTarget = item.conditionTarget;
      t.conditionValue = [];
    };

    onMounted(() => {});
    return {
      isEn,
      basicConditionList,
      addOption,
      deleteOption,
      getBaseConditionList,
      getConditionStatus,
      getPlanTypeList,
      changeConditionCode,
      BASE_CONDITION_TYPE,
    };
  },
};
</script>
<style lang="scss" scoped>
.select-attribute-warp {
  .w194 {
    width: 194px;
  }
  .condition-item {
    margin-bottom: 20px;
    i {
      font-weight: 700;
      cursor: pointer;
      font-size: 16px;
      margin-left: 5px;
    }
  }
}
</style>
