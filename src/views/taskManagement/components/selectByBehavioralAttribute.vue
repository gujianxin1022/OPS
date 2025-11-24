<template>
  <!-- 根据目标用户行为属性范围选择 -->
  <div class="select-attribute-warp">
    <div v-for="(t, index) in behaviorConditionList" :key="index">
      <div class="condition-item">
        <el-select
          :style="{ width: isEn ? '180px' : '150px' }"
          v-model="t.conditionTarget"
          clearable
          @change="
            () => {
              t.conditionCode = '';
            }
          "
        >
          <el-option
            v-for="item in getUserDimensionList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          :style="{ width: isEn ? '180px' : '150px' }"
          v-model="t.conditionCode"
          clearable
          @change="
            () => {
              t.conditionMinValue = '';
              t.conditionMaxValue = '';
            }
          "
        >
          <el-option
            v-for="item in getBehaviorConditionList(isEn)"
            :disabled="!item.conditionTarget.includes(t.conditionTarget)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- 属性值 -->
        <template>
          <el-input-number
            :min="0"
            v-model="t.conditionMinValue"
            :step="1"
            step-strictly
          ></el-input-number>
          <span style="font-size: 16px; color: #666666">~</span>
          <el-input-number
            :min="0"
            v-model="t.conditionMaxValue"
            :step="1"
            step-strictly
          ></el-input-number>
        </template>
        <i @click="addOption(index)" class="el-icon-plus"></i>
        <i
          @click.prevent="deleteOption(index)"
          v-if="behaviorConditionList.length > 1"
          class="el-icon-minus"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import {
  getUserDimensionList,
  getBehaviorConditionList,
} from "../dataConfig/constant";

export default {
  components: {},
  props: {},
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const behaviorConditionList = ref([
      {
        conditionCode: "",
        conditionTarget: "",
        conditionMinValue: 0,
        conditionMaxValue: 0,
      },
    ]);

    const addOption = (index) => {
      if (behaviorConditionList.value.length >= 30) {
        return root.$message.warning(root.$t("选项最多$个").replace('$','30'));
      }
      behaviorConditionList.value.splice(index + 1, 0, {
        conditionCode: "",
        conditionTarget: "",
        conditionMinValue: 0,
        conditionMaxValue: 0,
      });
    };
    const deleteOption = (index) => {
      behaviorConditionList.value.splice(index, 1);
    };

    onMounted(() => {});
    return {
      isEn,
      behaviorConditionList,
      addOption,
      deleteOption,
      getUserDimensionList,
      getBehaviorConditionList,
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
