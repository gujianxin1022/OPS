<template>
  <div class="routing-plan-warp">
    <el-form
      :disabled="isDisabled"
      :rules="planRules"
      :label-width="isEn?'140px':'120px'"
      ref="planForm"
      :model="planState"
    >
      <el-form-item prop="programName" :label="$t('方案名称')">
        <el-input
          :placeholder="$t('请输入')"
          style="width: 200px"
          :maxlength="100"
          v-model="planState.programName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="currency" :label="$t('出示币种')">
        <FilterByCurrency
          :initVal="planState.currency"
          @changeSelect="
            (val) => {
              planState.currency = val;
            }
          "
        />
      </el-form-item>
      <el-form-item prop="startTime" :label="$t('生效周期')">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              planState.startTime = timeArr[0];
              planState.endTime = timeArr[1];
            }
          "
          :isInvalidPastTime="true"
          :defaultTimeArr="[planState.startTime, planState.endTime]"
        />
      </el-form-item>
      <el-form-item prop="startTime" :label="$t('版本号')">
        <FilterBySolutionVersion
          :initVal="planState.payVersion"
          @changeSelect="
            (val) => {
              planState.payVersion = val;
            }
          "
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { computed, ref } from "@vue/composition-api";
import FilterByCurrency from "@/components/FilterItem/FinanceFilter/FilterByCurrency";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterBySolutionVersion from "@/components/FilterItem/FinanceFilter/FilterBySolutionVersion";
export default {
  components: {
    FilterByCurrency,
    FilterByTimePeriod,
    FilterBySolutionVersion,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const planState = ref({
      programName: "",
      currency: null,
      startTime: "",
      endTime: "",
      payVersion: "",
    });
    const planRules = {
      programName: {
        required: true,
        message: root.$t("请输入"),
        trigger: "blur",
      },
      currency: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      startTime: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      payVersion: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
    };
    const submit = async (type) => {
      await refs.planForm.validate();
      if (type === "add") {
        const res = await root.$Api.financeManagement.reqCreateProgram(
          planState.value
        );
        return res;
      }
      if (type === "update") {
        const res = await root.$Api.financeManagement.reqUpdateProgram({
          ...planState.value,
          programId: root.$route.query.id,
        });
        return res;
      }
    };
    const isDisabled = ref(false);
    return {
      isEn,
      planState,
      planRules,
      isDisabled,
      submit,
    };
  },
};
</script>
