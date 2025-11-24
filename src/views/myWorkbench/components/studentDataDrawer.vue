<template>
  <div
    class="student-data-warp"
    v-loading="loading"
  >
    <div class="header">
      <p>
        <span class="name">{{ $t("学生") }}：</span>
        <span class="value">
          <el-button type="text">{{ studentData.studentRealName }}</el-button>
        </span>
        <el-tag
          v-if="studentData.studentFirstSingleCycle"
          type="success"
        >M{{ studentData.studentFirstSingleCycle }}</el-tag>
        <el-tag
          v-if="studentData.studentOrderNum"
          type="success"
        >付费{{ studentData.studentOrderNum }}次</el-tag>
      </p>
      <p>
        <span class="name">{{ $t("学生ID") }}：</span>
        <span class="value">
          <el-button
            @click="toStudentPage"
            type="text"
          >{{
            studentData.studentUserId
          }}</el-button>
        </span>
      </p>
      <p>
        <span class="name">{{ $t("家长ID") }}：</span>
        <span class="value">
          <el-button
            @click="toParentPage"
            type="text"
          >{{
            studentData.parentUserId
          }}</el-button>
        </span>
        <el-tag
          v-if="studentData.parentFirstSingleCycle"
          type="success"
        >M{{ studentData.parentFirstSingleCycle }}</el-tag>
        <el-tag
          v-if="studentData.parentKolIdentity === 1"
          type="success"
        >{{
          $t("推广大使")
        }}</el-tag>
        <el-tag
          v-if="studentData.parentKolIdentity === 2"
          type="success"
        >{{
          $t("团长")
        }}</el-tag>
      </p>
      <p>
        <span class="name">{{ $t("学科") }}：</span>
        <span class="value">
          {{ studentData.subjectTypeId === 0 ? $t("中文") : $t("英文") }}
        </span>
      </p>
      <p>
        <span class="name">{{ $t("顾问") }}：</span>
        <span class="value"> {{ studentData.advUserStr || "-" }} </span>
      </p>
      <p>
        <span class="name">{{ $t("学管") }}：</span>
        <span class="value"> {{ studentData.xgUserStr || "-" }} </span>
      </p>
    </div>
    <el-divider></el-divider>
    <div class="tabs">
      <el-radio-group
        v-model="activeName"
        style="margin-bottom: 30px"
      >
        <el-radio-button label="baseInfo">{{ $t("基础信息") }}</el-radio-button>
        <el-radio-button label="classElimination">{{
          $t("课消")
        }}</el-radio-button>
        <el-radio-button label="renewal">{{ $t("续费") }}</el-radio-button>
        <el-radio-button label="introduce">{{ $t("转介绍") }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="scroll-box">
      <div
        ref="baseInfo"
        class="baseInfo"
      >
        <el-form
          label-position="right"
          label-width="120px"
          :model="baseInfo"
        >
          <el-form-item :label="$t('地区')">
            {{ studentData.parentCountryOfResidence || "-" }}
          </el-form-item>
          <el-form-item :label="$t('时差')">
            {{ getTimeDifference(studentData.parentTimeDifference) }}
          </el-form-item>
          <el-form-item :label="$t('年龄')">
            {{ studentData.age || "-" }}
          </el-form-item>
          <el-form-item :label="$t('性别')">
            {{
              studentData.gender === 0
                ? $t("未知")
                : studentData.gender === 1
                ? $t("男")
                : $t("女")
            }}
          </el-form-item>
          <el-form-item :label="$t('最近交接时间')">
            {{
              DateTimeUtils.dateClockTime(studentData.lastHandoverTime) || "-"
            }}
          </el-form-item>
          <el-form-item :label="$t('最近跟进时间')">
            {{ DateTimeUtils.dateClockTime(studentData.lastFollowTime) || "-" }}
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
      </div>
      <div
        ref="classElimination"
        class="classElimination"
      >
        <el-form
          label-position="right"
          label-width="120px"
          :model="baseInfo"
        >
          <el-form-item :label="$t('上次完课时间')">
            {{
              DateTimeUtils.dateClockTime(studentData.lastClassEndTime) || "-"
            }}
          </el-form-item>
          <el-form-item :label="$t('下次上课时间')">
            {{
              DateTimeUtils.dateClockTime(studentData.nextClassStartTime) || "-"
            }}
          </el-form-item>
          <el-form-item :label="$t('本周正常完课')">
            {{ studentData.classCompletedThisWeekNum }}
          </el-form-item>
          <el-form-item :label="$t('本周已约未上')">
            {{ studentData.classScheduledThisWeekNum }}
          </el-form-item>
          <el-form-item :label="$t('本周预计完课')">
            {{ studentData.classPlannedCompletedThisWeekNum }}
          </el-form-item>
          <el-form-item :label="$t('本月正常完课')">
            {{ studentData.classCompletedThisMonthNum }}
          </el-form-item>
          <el-form-item :label="$t('本月已约未上')">
            {{ studentData.classScheduledThisMonthNum }}
          </el-form-item>
          <el-form-item :label="$t('本月预计完课')">
            {{ studentData.classPlannedCompletedThisMonthNum }}
          </el-form-item>
          <el-form-item :label="$t('历史平均月完课')">
            {{ studentData.beforeThereMonthCompletedNum }}
          </el-form-item>
          <el-form-item :label="$t('三周约课对比')">
            {{ studentData.classCompletedLastWeekNum }} :
            {{ studentData.classPlannedCompletedThisWeekNum }} :
            {{ studentData.classScheduledNextWeekNum }}
          </el-form-item>
          <el-form-item :label="$t('三月约课对比')">
            {{ studentData.classCompletedLastMonthNum }} :
            {{ studentData.classPlannedCompletedThisMonthNum }} :
            {{ studentData.classScheduledNextMonthNum }}
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
      </div>
      <div
        ref="renewal"
        class="renewal"
      >
        <el-form
          label-position="right"
          label-width="120px"
          :model="baseInfo"
        >
          <el-form-item :label="$t('学生课时')">
            {{ studentData.studentAccountBalance }}
          </el-form-item>
          <el-form-item :label="$t('家长课时')">
            {{ studentData.parentAccountBalance }}
          </el-form-item>
          <el-form-item :label="$t('家长积分')">
            {{ studentData.parentCoinBalance }}
          </el-form-item>
          <el-form-item :label="$t('N签')">
            {{ studentData.studentOrderNum||'0' }}
          </el-form-item>
          <el-form-item :label="$t('本月是否有订单')">
            {{ studentData.thisMonthHasOrder === 0 ? $t("没有") : $t("有") }}
          </el-form-item>
          <el-form-item :label="$t('上次续费时间')">
            {{ DateTimeUtils.dateClockTime(studentData.lastOrderTime) || "-" }}
          </el-form-item>
          <el-form-item :label="$t('累计完课')">
            {{ studentData.classCompletedTotalNum }}
          </el-form-item>
          <el-form-item :label="$t('家长账户优惠券')">
            {{ studentData.couponListStr || "-" }}
          </el-form-item>
          <el-form-item :label="$t('订单情况')">
            {{
              $t("待支付") + "：" + studentData.parentOrderPaymentPendingNum
            }},
            {{
              $t("已支付") + "：" + studentData.parentOrderPaymentCompletedNum
            }},
            {{ $t("已取消") + "：" + studentData.parentOrderPaymentCancelNum }}
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
      </div>
      <div
        ref="introduce"
        class="introduce"
      >
        <el-form
          label-position="right"
          label-width="120px"
          :model="baseInfo"
        >
          <el-form-item :label="$t('剩余打卡次数')">
            {{ studentData.parentRemainingPunchInNum }}
          </el-form-item>
          <el-form-item :label="$t('上次打卡时间')">
            {{
              DateTimeUtils.dateClockTime(
                studentData.parentRemainingPunchInTime
              ) || "-"
            }}
          </el-form-item>
          <el-form-item :label="$t('本周是否上传')">
            {{
              studentData.parentRemainingPunchInUpload === 0
                ? $t("否")
                : $t("是")
            }}
          </el-form-item>
          <el-form-item :label="$t('本周是否打卡')">
            {{ studentData.parentRemainingPunchIn === 0 ? $t("否") : $t("是") }}
          </el-form-item>
          <el-form-item :label="$t('本月已打卡次数')">
            {{ studentData.parentRemainingPunchInThisMonthNum||'0' }}
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch, toRefs } from "@vue/composition-api";
import DateTimeUtils from "@/utils/datetime_utils";

export default {
  name: "studentDataDrawer",
  props: {
    studentID: {
      type: String,
      default: -1,
    },
    subjectTypeId: {
      type: Number,
      default: -1,
    },
  },
  setup (props, { root, refs, emit }) {
    let activeName = ref("baseInfo");
    const loading = ref(false);
    let studentData = ref({});
    const reqStudentData = async (_) => {
      loading.value = true;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.reqStudentDataBoard({
          studentUserId: props.studentID,
          subjectTypeId: props.subjectTypeId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        let age = DateTimeUtils.birthdayMapToAge(data.birthday);
        let couponListStr = "";
        if (data.couponList && data.couponList.length > 0) {
          couponListStr = data.couponList.join(",");
        }
        studentData.value = data;
        studentData.value.age = age;
        studentData.value.couponListStr = couponListStr;
      } finally {
        loading.value = false;
      }
    };
    const handleScroll = async (val) => {
      const $container = refs[`${val}`];
      $container.scrollIntoView(true);
    };
    watch(activeName, (val) => val && handleScroll(val));
    const toStudentPage = () => {
      emit("close");
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${studentData.value.studentUserId}&studentName=${studentData.value.studentRealName}`
      );
    };

    const getTimeDifference = (time) => {
      if (!time) return root.$t("无时差");
      time += "";
      const hour = parseInt(
        time.startsWith("-") ? time.substr(1) / 60 : time / 60
      );
      const minute = parseInt(
        time.startsWith("-") ? time.substr(1) % 60 : time % 60
      );
      const radioVal = time.startsWith("-") ? "-" : "+";
      return minute
        ? `${radioVal} ${hour}${root.$t("小时")}${minute}${root.$t("分钟")}`
        : `${radioVal} ${hour}${root.$t("小时")}`;
    };
    const toParentPage = () => {
      emit("close");
      root.$router.push(
        `/studentManagement/parentInfo?parentUserId=${studentData.value.parentUserId}`
      );
    };
    onMounted(async () => {
      await reqStudentData();
    });
    return {
      activeName,
      loading,
      toStudentPage,
      studentData,
      handleScroll,
      toParentPage,
      getTimeDifference,
    };
  },
};
</script>

<style lang='scss' scoped>
.student-data-warp {
  padding: 0 20px;
  font-size: 14px;
  .header {
    .name {
      color: #72767b;
    }
    .value {
      color: #606266;
    }
  }
  .tabs {
    .pane {
      margin-top: 20px;
      height: 100%;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .scroll-box {
    height: calc(100vh - 440px);
    overflow-y: scroll;
    border: 1px solid #ccc;
    border-radius: 8px;
    .introduce {
      padding-bottom: 300px;
    }
  }
}
</style>