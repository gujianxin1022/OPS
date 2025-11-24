<template>
  <el-dialog
    class="leave-class-info-container"
    width="1100px"
    top="5vh"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <span slot="title"
      >{{
        courseType == SUBJECT_TYPE.CHINESE
          ? $t("请假次数详情-中文")
          : $t("请假次数详情-英文")
      }}
      <el-popover
        trigger="click"
        placement="right"
        :title="$t('请假机会规则描述')"
      >
        <div class="tip-wrap">
          <p>1.{{ $t("leaveClassInfo1") }}</p>
          <p>2.{{ $t("请假机会发放时间：") }}</p>
          <p class="sub-info">(1){{ $t("leaveClassInfo2.1") }}</p>
          <p class="sub-info">(2){{ $t("leaveClassInfo2.2") }}</p>
          <p>3.{{ $t("leaveClassInfo3") }}</p>
          <p>4.{{ $t("leaveClassInfo4") }}</p>
          <p>5.{{ $t("请假机会状态描述") }}：</p>
          <p class="sub-info">(1){{ $t("leaveClassInfo5.1") }}</p>
          <p class="sub-info">(2){{ $t("leaveClassInfo5.2") }}</p>
          <p class="sub-info">(3){{ $t("leaveClassInfo5.3") }}</p>
          <p class="sub-info">(4){{ $t("leaveClassInfo5.4") }}</p>
        </div>
        <i slot="reference" class="el-icon-question"></i>
      </el-popover>
      <el-button
        v-if="
          Per.handleButtonPer(
            'teach.studentMT.studentInfo.sisfStudentFiles.addTheNumberOfLeave'
          )
        "
        type="primary"
        round
        style="margin: -6px 50px 0 0"
        class="fr"
        @click="addTimes"
        >{{ $t("添加") }}</el-button
      >
    </span>
    <p class="tip">
      {{ $t("下次发放时间") }}：
      <span v-if="leaveClassInfo.nextGrantTime"
        >{{ DateTimeUtils.dateClockTime(leaveClassInfo.nextGrantTime) }}（{{
          $t("您当前时区")
        }}）</span
      ><span v-else>-</span>
    </p>
    <el-tabs class="tab-wrap" type="card" v-model="activeType">
      <el-tab-pane :name="LEAVE_CLASS_TYPE.NO_USE">
        <span slot="label">
          {{ $t("未使用") }} {{ leaveClassInfo.notUsedNum }}</span
        >
      </el-tab-pane>
      <el-tab-pane :name="LEAVE_CLASS_TYPE.OCCUPANCY">
        <span slot="label">
          {{ $t("已占用") }} {{ leaveClassInfo.occupyNum }}</span
        >
      </el-tab-pane>
      <el-tab-pane :name="LEAVE_CLASS_TYPE.USED"
        ><span slot="label">
          {{ $t("已使用") }} {{ leaveClassInfo.usedNum }}</span
        ></el-tab-pane
      >
      <el-tab-pane :name="LEAVE_CLASS_TYPE.FAILURE"
        ><span slot="label">
          {{ $t("已失效") }} {{ leaveClassInfo.expiredNum }}</span
        >
      </el-tab-pane>
      <LeaveClassInfoList
        ref="myList"
        :activeType="activeType"
        :courseType="courseType"
        :studentId="studentId"
      />
    </el-tabs>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from "@vue/composition-api";
import LeaveClassInfoList from "./leaveClassInfoList.vue";
import {
  SUBJECT_TYPE,
  FORMAL_COURSE,
  AUDITION_COURSE,
  LEAVE_CLASS_TYPE,
} from "@/utils/constants";

export default defineComponent({
  props: {
    courseType: {
      type: Number,
      defalult: null,
    },
    visible: {
      type: Boolean,
      defalult: false,
    },
    studentId: {
      type: Number,
      defalult: null,
    },
  },
  components: { LeaveClassInfoList },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const activeType = ref(LEAVE_CLASS_TYPE.NO_USE);
    const handleClose = () => {
      emit("update:visible", false);
    };
    const leaveClassInfo = ref({});

    const getLeaveClassTimes = () => {
      root.$Api.studentManagement
        .getLeaveClassTimes(props.studentId, props.courseType)
        .then(({ status, data: { code, data } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          leaveClassInfo.value = data;
        });
    };

    const addTimes = async () => {
      await root.$confirm(
        root.$t(root.$t("确定添加一次请假机会?")),
        root.$t("提示"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        }
      );
      await root.$Api.studentManagement.reqManuallyIssueTheNumberOfLeaveRequests(
        {
          grantNum: 1,
          studentUserId: props.studentId,
          subjectType: props.courseType,
        }
      );
      root.$notify({
        message: root.$t("操作成功"),
        type: "success",
      });
      activeType.value = LEAVE_CLASS_TYPE.NO_USE;
      getLeaveClassTimes();
      refs.myList.getData();
    };

    onMounted(getLeaveClassTimes);

    return {
      isEn,
      leaveClassInfo,
      activeType,
      SUBJECT_TYPE,
      FORMAL_COURSE,
      AUDITION_COURSE,
      LEAVE_CLASS_TYPE,
      addTimes,
      handleClose,
      getLeaveClassTimes,
    };
  },
});
</script>
<style lang="scss" scoped>
.leave-class-info-container {
  .tab-wrap {
    margin-top: -40px;
  }
  .tip {
    text-align: right;
  }
}
.tip-wrap {
  .sub-info {
    text-indent: 10px;
  }
  width: 1000px;
  word-break: break-word !important;
}
</style>
