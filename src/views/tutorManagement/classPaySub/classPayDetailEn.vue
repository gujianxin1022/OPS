<template>
  <div class="part-time-detail-wrap">

    <div class="top-message-wrap mt10" v-if="!tutorIdC">
      <span v-if="time">{{ $t("time") }}: {{ time ? `${time.slice(0,4)}年${time.slice(4)}月` : "" }}</span>
      <span class="ml20">{{ $t("教师昵称") }}: {{ tutorName }}</span>
    </div>

    <div class="mt20">
      <el-radio-group v-model="activePayType" class="mb15">
        <el-radio-button
          :label="CLASS_PAY_TYPE.NORMAL"
        >
          {{ $t("课时费用") }}
        </el-radio-button>
        <el-radio-button
          :label="CLASS_PAY_TYPE.DEDUCTION"
        >
          {{ $t("扣款") }}
        </el-radio-button>
        <el-radio-button
          :label="CLASS_PAY_TYPE.COMPENSATE"
        >
          {{ $t("补偿") }}
        </el-radio-button>
        <el-radio-button
          :label="CLASS_PAY_TYPE.EXCITATION"
        >
          {{ $t("激励") }}
        </el-radio-button>
      </el-radio-group>
    </div>
   
    <div class="table-wrap">
      <classPayNormalDetail 
        v-if="activePayType==CLASS_PAY_TYPE.NORMAL"
        :tutorId="tutorId"
        :time="time"
        :tutorName="tutorName"
        :businessLine="businessLine"
      />
      <classPayCompensateDetail 
        v-else-if="activePayType==CLASS_PAY_TYPE.COMPENSATE"
        :tutorId="tutorId"
        :time="time"
        :tutorName="tutorName"
      />
      <classPayDeductionDetail 
        v-else-if="activePayType==CLASS_PAY_TYPE.DEDUCTION"
        :tutorId="tutorId"
        :time="time"
        :tutorName="tutorName"
      />
      <classPayExcitationDetail 
        v-else
        :tutorId="tutorId"
        :time="time"
        :tutorName="tutorName"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import classPayCompensateDetail from "./classPayCompensateDetailEn";
import classPayDeductionDetail from "./classPayDeductionDetailEn";
import classPayExcitationDetail from "./classPayExcitationDetailEn";
import classPayNormalDetail from "./classPayNormalDetailEn";

const CLASS_PAY_TYPE = {
  NORMAL: 1,
  DEDUCTION: 2,
  COMPENSATE: 3,
  EXCITATION: 4
}

export default {
  name: 'classPayDetailEn',

  components: {
    classPayCompensateDetail,
    classPayDeductionDetail,
    classPayExcitationDetail,
    classPayNormalDetail
  },

  props: {
    tutorIdC: {
      type: String,
      default: ''
    },
    timeC: {
      type: String,
      default: ''
    },
    tutorNameC: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      CLASS_PAY_TYPE,
      activePayType: CLASS_PAY_TYPE.NORMAL,

    }
  },
  computed: {
    ...mapGetters(['currentLang']),
    tutorId () {
      return this.tutorIdC || this.$route.query.tutorId
    },
    time () {
      return this.timeC || this.$route.query.time
    },
    tutorName () {
      return this.tutorNameC || this.$route.query.tutorName
    },
    businessLine () {
      return this.$route.query.businessLine || '1'
    }
  },
  methods: {
 
  },

}
</script>
<style lang="scss" scoped>
.part-time-detail-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .top-message-wrap {
    width: 100%;
    font-size: 14px;
  }
  .center-datashow-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }
  .card-flex {
    width: 49%;
    padding: 0 10px;
    padding: 0;
  }
  .card-inner {
    width: 100%;
    height: 102px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 14px;
    box-sizing: border-box;
    .card-inner-font-weight {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>