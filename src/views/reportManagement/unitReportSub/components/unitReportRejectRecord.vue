<template>
  <!-- 单元报告驳回记录组件 -->
  <div class="unit-report-rejec-record-warp">
    <el-button
      v-if="isAudited"
      :disabled="curIndex === -1"
      @click="selectAuditedReport"
      type="text"
      >{{ $t("点击查看当前版本报告内容") }}</el-button
    >
    <p v-if="isAudited">{{ $t("更多单元报告审核未通过记录") }}：</p>
    <div v-for="(item, index) in list" :key="item.id">
      <div v-if="!isAudited && index === 0">
        <el-button
          :disabled="index === curIndex"
          @click="getUnitReportInfo(item.unitReportInfo, index, item.id)"
          type="text"
          >{{ $t("点击查看当前版本报告内容") }}</el-button
        >
      </div>
      <div v-else>
        <p v-if="!isAudited && index === 1">{{ $t("更多单元报告审核未通过记录") }}：</p>
        <p>{{ $t("审核记录") + (list.length - index) + ":" }}</p>
        <p>{{ $t("审核人") }}：{{ item.examiner }}</p>
        <p>
          {{ $t("审核时间") }}：{{
            DateTimeUtils.dateClockTime(item.examineTime)
          }}
        </p>
        <p>{{ $t("评语") }}：{{ item.remark }}</p>
        <el-button
          :disabled="index === curIndex"
          @click="getUnitReportInfo(item.unitReportInfo, index, item.id)"
          type="text"
          >{{ $t("点击查看历史报告版本") + (list.length - index) }}</el-button
        >
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from "@vue/composition-api";
export default {
  name: "unitReportRejectRecord",
  props: {
    list: {
      type: Array,
      default: [],
    },
    isAudited: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const curIndex = ref(-1);
    if(!props.isAudited){
      curIndex.value=0
    }
    const getUnitReportInfo = async (info, index, id) => {
      if (!info) {
        root.$message.warning(root.$t("历史记录没有详情数据"));
        return;
      }
      curIndex.value = index;
      let recordContent = JSON.parse(info);
      emit("showHistoryVersion", { info: recordContent, index: index, id: id });
    };
    const selectAuditedReport = () => {
      curIndex.value = -1;
      emit("reqCurrentAuditedReport");
    };
    return {
      list: props.list,
      getUnitReportInfo,
      curIndex,
      selectAuditedReport,
    };
  },
};
</script>

<style scoped lang='scss'>
.unit-report-rejec-record-warp {
  padding-top: 20px;
}
</style>