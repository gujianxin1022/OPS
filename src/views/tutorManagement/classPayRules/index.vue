<template>
  <div
    class="class-pay-rules"
    v-if="
      Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesChinese') ||
      Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesEnglish')||
      Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesMath')
    "
  >
    <el-radio-group v-model="subjectType" class="mb15">
      <el-radio-button
        :label="SUBJECT_TYPE.CHINESE"
        v-if="
          Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesChinese')
        "
      >
        {{ $t("中文") }}
      </el-radio-button>
      <el-radio-button
        :label="SUBJECT_TYPE.ENGLISH"
        v-if="
          Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesEnglish')
        "
      >
        {{ $t("英文") }}
      </el-radio-button>
      <el-radio-button
        :label="SUBJECT_TYPE.MATH"
        v-if="Per.handleButtonPer('teach.tutorMT.classPayRules.payRulesMath')"
      >
        {{ $t("数学") }}
      </el-radio-button>
    </el-radio-group>
    <el-tabs type="card" v-model="classPayType">
      <el-tab-pane :label="subjectType === SUBJECT_TYPE.CHINESE ? $t('正常课堂薪酬'): $t('课酬规则')" name="normalClassPay">
        <NormalClassPay :subjectType="subjectType" />
      </el-tab-pane>
      <el-tab-pane
        name="abnormalClassPay"
        :label="subjectType === SUBJECT_TYPE.CHINESE ? $t('异常课堂薪酬') :$t('其他奖惩规则') "
      >
        <AbnormalClassPay v-if="classPayType==='abnormalClassPay' && subjectType === SUBJECT_TYPE.CHINESE" />
        <OtherRewardPunish v-if="classPayType==='abnormalClassPay' && subjectType !== SUBJECT_TYPE.CHINESE " :subjectType="subjectType" />
      </el-tab-pane>


    </el-tabs>
  </div>
</template>

<script>
import { ref, unref, onMounted, watchEffect } from "@vue/composition-api";
import { SUBJECT_TYPE } from "@/utils/constants";

import HandlePermission from "@/utils/handlePermission";
import NormalClassPay from "./components/NormalClassPay";
import AbnormalClassPay from "./components/AbnormalClassPay";
import OtherRewardPunish from "./components/OtherRewardPunish";

const { handleButtonPer } = HandlePermission;

export default {
  components: {
    NormalClassPay,
    AbnormalClassPay,
    OtherRewardPunish
  },
  setup() {
    const subjectType = ref("");

    const classPayType = ref("normalClassPay");

    watchEffect(() => {
      if (unref(subjectType) === SUBJECT_TYPE.ENGLISH || unref(subjectType) === SUBJECT_TYPE.MATH)
        classPayType.value = "normalClassPay";
    });

    onMounted(() => {
      if (handleButtonPer("teach.tutorMT.classPayRules.payRulesChinese")) {
        return (subjectType.value = SUBJECT_TYPE.CHINESE);
      }
      if (handleButtonPer("teach.tutorMT.classPayRules.payRulesEnglish")) {
        return (subjectType.value = SUBJECT_TYPE.ENGLISH);
      }
    });

    return {
      SUBJECT_TYPE,

      subjectType,
      classPayType,
    };
  },
};
</script>

<style lang="scss" scoped>
.class-pay-rules {
  padding: 16px;
}
</style>
