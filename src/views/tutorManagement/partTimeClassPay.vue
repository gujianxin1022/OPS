<template>
  <div class="part-time-classPay">
    <el-radio-group v-model="subjectType" class="mb15">
      <el-radio-button
        :label="SUBJECT_TYPE.CHINESE"
      >
        {{ $t("中文") }}
      </el-radio-button>
      <el-radio-button
        :label="SUBJECT_TYPE.ENGLISH"
      >
        {{ $t("英文") }}
      </el-radio-button>
      <el-radio-button
        :label="SUBJECT_TYPE.MATH"
      >
        {{ $t("数学") }}
      </el-radio-button>
    </el-radio-group>

    <div class="table-wrap">
      <partTimeClassPayCh v-if="subjectType === SUBJECT_TYPE.CHINESE" />
      <partTimeClassPayEn v-else :subjectType="subjectType" />
    </div>
  </div>
</template>
<script>
import { SUBJECT_TYPE } from "@/utils/constants";
import partTimeClassPayCh from "./classPaySub/partTimeClassPayCh";
import partTimeClassPayEn from "./classPaySub/partTimeClassPayEn";

export default {
  name: 'partTimeClassPay',
  components: {
    partTimeClassPayCh,
    partTimeClassPayEn
  },
  data () {
    return {
      SUBJECT_TYPE,
      subjectType: 0,
    }
  },
}
</script>
<style lang="scss" scoped>
.part-time-classPay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .top-search-wrap {
    width: 100%;
    display: flex;
  }
  .search-left-date {
    display: flex;
    align-items: center;
    > span {
      margin-right: 20px;
      color: #666;
    }
  }
  .search-right {
    width: 100%;
    text-align: right;
  }
  .center-datashow-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }
  .card-flex {
    width: 33%;
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
  .export-button-wrap {
    width: 100%;
    // text-align: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
