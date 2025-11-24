<template>
  <!-- 设置支付路由规则条件 -->
  <div class="select-conditions-warp">
    <div v-for="(t, index) in basicConditionList" :key="index">
      <div class="condition-item">
        <el-select
          :style="{ width: isEn ? '180px' : '150px' }"
          v-model="t.conditionCode"
          clearable
          @change="
            changeConditionCode(t),
              () => {
                t.conditionValue = [];
              }
          "
        >
          <el-option
            :disabled="
              basicConditionList.length >= 1 &&
              (basicConditionList[0].conditionCode === item.value||(basicConditionList[1]&&basicConditionList[1].conditionCode === item.value))
            "
            v-for="item in getConditionList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          @change="handelEmit()"
          style="width: 100px"
          v-model="t.conditionOperator"
          clearable
        >
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
          <!-- 付费方式 -->
          <FilterByPayType
            v-if="t.conditionCode === 'PAYMENT_TYPE'"
            :initVal="t.conditionValue"
            @changeSelect="
              (val) => {
                t.conditionValue = val;
                handelEmit();
              }
            "
            :multiple="true"
          />
          <FilterByRegion
            ref="region"
            v-if="t.conditionCode === 'REGION'"
            @changeSelect="
              (val) => {
                t.conditionValue = val;
                handelEmit();
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
import { onMounted, ref, watch, computed } from "@vue/composition-api";
import { getConditionList, getConditionStatus } from "../dataConfig/constant";
import FilterByPayType from "@/components/FilterItem/CommodityFilter/FilterByPayType";
import FilterByRegion from "@/components/FilterItem/CommodityFilter/FilterByRegion";
export default {
  components: {
    FilterByPayType,
    FilterByRegion,
  },
  props: {},
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const basicConditionList = ref([
      {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      },
    ]);
    const handelEmit = () => {
      emit("changeSelect", basicConditionList.value);
    };
    const addOption = (index) => {
      if (basicConditionList.value.length >= 2) {
        return root.$message.warning(root.$t("设定条件选项目前最多支持2个"));
      }
      basicConditionList.value.splice(index + 1, 0, {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      });
      handelEmit();
    };
    const deleteOption = (index) => {
      basicConditionList.value.splice(index, 1);
      handelEmit();
    };
    const changeConditionCode = (t) => {
      handelEmit();
      if (!t.conditionCode.length) return;
      let item = getConditionList().filter((e) => {
        return e.value === t.conditionCode;
      })[0];
    };
    onMounted(() => {});
    return {
      isEn,
      basicConditionList,
      addOption,
      deleteOption,
      getConditionList,
      getConditionStatus,
      changeConditionCode,
      handelEmit,
    };
  },
};
</script>
<style lang="scss" scoped>
.select-conditions-warp {
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
