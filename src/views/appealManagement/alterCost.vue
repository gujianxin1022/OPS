<template>
  <div class="alter-cost">
    <div class="basic-info">
      <div class="s-1">
        <div class="item title">{{ $t("本课费用") }}</div>
        <br />
        <div class="item">
          {{ $t("老师课酬") }}：
          <span
            v-if="
              itemInfo.classroomTutorAmount ||
              itemInfo.classroomTutorAmount == 0
            "
            style="color: red"
            >{{ itemInfo.classroomTutorAmount }}
            {{ itemInfo.tutorLocalAreaCurrency }}
            {{ itemInfo.grantRatio === null ? "":`(${$t("实际发放比例")}: ${itemInfo.grantRatio}%)` }}
          </span>
          <span v-else>{{ $t("未知") }}</span>
        </div>
        <div class="item">
          {{ $t("学生课时") }}：
          <span
            v-if="
              itemInfo.classroomStudentAmount ||
              itemInfo.classroomStudentAmount == 0
            "
            style="color: green"
            >{{ itemInfo.classroomStudentAmount }}</span
          >
          <span v-else>{{ $t("未知") }}</span>
        </div>
      </div>
      <div class="hr-dashed-line"></div>
      <div class="table-info">
        <div class="table-info-item">
          <div class="key">{{ $t("上课时间") }}：</div>
          <div class="value">
            {{ DateTimeUtils.dateClockTime(itemInfo.startTime) }}
          </div>
        </div>
        <div class="table-info-item">
          <div class="key">{{ $t("my-home-Curriculum") }}：</div>
          <div class="value">
            {{
              currentLang === "zh"
                ? itemInfo.editionNameOpsZh
                : itemInfo.editionName
            }}
            Level {{ itemInfo.courseLevel }} Lesson {{ itemInfo.lessonNo }}
          </div>
        </div>
        <div class="table-info-item">
          <div class="key">{{ $t("老师") }}：</div>
          <div class="value">{{ itemInfo.tutorUsername }}</div>
        </div>
        <div class="table-info-item">
          <div class="key">{{ $t("老师进出课堂时间") }}：</div>
          <div class="value">
            <el-button
              style="margin-top: -3px"
              @click="viewClassRoomLog()"
              type="text"
            >
              {{
                DateTimeUtils.dateClockTime(itemInfo.tutorInTime).split(
                  " "
                )[1] || $t("未知")
              }}
              ~
              {{
                DateTimeUtils.dateClockTime(itemInfo.tutorOutTime).split(
                  " "
                )[1] || "未知"
              }}
            </el-button>
          </div>
        </div>
        <div class="table-info-item">
          <div class="key">{{ $t("上课时长") }}：</div>
          <div class="value">
            {{ secondToMinute(itemInfo.actualClassDuration) }}
          </div>
        </div>
      </div>
      <div class="student-info">
        <el-table
          :data="itemInfo.virtualClassMemberResultList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="studentRealName"
            :label="$t('学生')"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="parentUserId"
            :label="$t('家长ID')"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            :label="$t('schedule-Time for students to enter class')"
            min-width="150"
          >
            <template slot-scope="scope">
              {{
                DateTimeUtils.dateClockTime(scope.row.enterTime).split(
                  " "
                )[1] || $t("未知")
              }}
              ~
              {{
                DateTimeUtils.dateClockTime(scope.row.leaveTime).split(
                  " "
                )[1] || "未知"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="adviserUserName"
            :label="$t('课程顾问')"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="xgUserName"
            :label="$t('学管老师')"
            min-width="150"
          >

          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 10px 0">
        {{ $t("my-home-Abnormal Reason") }}：{{
          itemInfo.reason | abnormalFinishedResult
        }}
      </div>
      <div>{{ $t("详细描述") }}：{{ itemInfo.remark }}</div>
    </div>
    <div class="hr-dashed-line"></div>
    <div class="alter-info" v-if="$route.query.correctStatus === 'true'">
      <div class="item">
        <span class="key">{{ $t("处理时间") }}：</span>
        <span class="value">{{
          DateTimeUtils.dateClockTime(itemInfo.correctTime)
        }}</span>
      </div>
      <div class="item">
        <span class="key">{{ $t("处理人员") }}：</span>
        <span class="value">{{ itemInfo.handlerUserName }}</span>
      </div>
      <div class="item">
        <span class="key">{{ $t("处理结论") }}：</span>
        <span class="value"
          ><span style="margin-right: 15px"
            >{{ $t("老师课酬") }}：{{ getMoneyTip(itemInfo) }}{{ getMoneyNum(itemInfo) }}
            {{ itemInfo.teacherHandleType===1 ? "%" : itemInfo.currency }} </span
          >{{ $t("学生课时") }}：{{ itemInfo.studentAmount }}</span
        >
      </div>
      <div class="item" v-if="itemInfo.handlerReason">
        <span class="key">{{ $t("处理原因") }}：</span>
        <span
          v-show="fromRouter !== '/appealManagement/clearingList'"
          class="value"
        >
          {{ $t(Filters.correctReasonFilter(itemInfo.handlerReason)) }}
        </span>
        <span
          v-show="fromRouter === '/appealManagement/clearingList'"
          class="value"
        >
          {{ $t(Filters.newCorrectReasonFilter(itemInfo.handlerReason)) }}
        </span>
      </div>
      <div class="item" v-if="itemInfo.handlerReasonDetail">
        <span class="key">{{ $t("详细原因") }}：</span>
        <span class="value">{{ itemInfo.handlerReasonDetail }}</span>
      </div>
      <div class="item" v-if="itemInfo.extraStudentAmount">
        <span class="key">{{ $t("额外补偿学生") }}：</span>
        <span class="value"
          >{{ itemInfo.extraStudentAmount }}{{ $t("课时") }}</span
        >
      </div>
      <div class="item" v-if="itemInfo.extraStudentReason">
        <span class="key">{{ $t("额外补偿原因") }}：</span>
        <span class="value">{{ itemInfo.extraStudentReason }}</span>
      </div>
    </div>
    <div class="alter-form" v-else>
      <div class="alter-form-item" v-if="this.hasCorrectCourseMoneyPer">
        <div class="key">
          <span class="reqired-star">*</span> {{ $t("老师课酬") }}
        </div>
        <div>
          <el-radio
            v-model="teacherHandleStyle"
            :label="1"
            @click.native.prevent="
              changeHandleStyle(1, 'teacherHandleStyle', 'tRadioValue')
            "
            >{{ $t("扣除") }}</el-radio
          >
          <el-radio
            v-model="teacherHandleStyle"
            :label="0"
            @click.native.prevent="
              changeHandleStyle(0, 'teacherHandleStyle', 'tRadioValue')
            "
            >{{ $t("补偿") }}</el-radio
          >
        </div>
        <div class="ipb">
          <el-input :placeholder="$t('请输入金额')" v-model="tRadioValue">
            <template slot="append">{{
              itemInfo.subjectType==SUBJECT_TYPE.CHINESE?itemInfo.tutorLocalAreaCurrency:"%"
            }}</template>
          </el-input>
        </div>
      </div>
      <div class="alter-form-item" v-if="this.hasCorrectCourseTimePer">
        <div class="key">{{ $t("学生课时") }}</div>
        <div>
          <el-radio
            v-model="studentHandleStyle"
            :label="1"
            @click.native.prevent="
              changeHandleStyle(1, 'studentHandleStyle', 'sRadioValue')
            "
            :disabled="!studentHandleStyleDiabled"
            >{{ $t("扣除") }}</el-radio
          >
          <el-radio
            v-model="studentHandleStyle"
            :label="0"
            @click.native.prevent="
              changeHandleStyle(0, 'studentHandleStyle', 'sRadioValue')
            "
            :disabled="studentHandleStyleDiabled"
            >{{ $t("补偿") }}</el-radio
          >
        </div>
        <div class="ipb">
          <el-input
            :placeholder="$t('请输入课时')"
            v-model="sRadioValue"
            :disabled="sRadioDisabled"
          >
            <template slot="append">{{ $t("课时") }}</template>
          </el-input>
        </div>
      </div>
      <div class="alter-form-item">
        <div class="key">
          <span class="reqired-star">*</span> {{ $t("选择原因") }}
        </div>
        <div class="ipb" style="margin-left: 0">
          <el-select clearable v-model="reason" :placeholder="$t('请选择原因')">
            <el-option
              v-for="item in fromRouter === '/appealManagement/clearingList'
                ? newReasonList
                : reasonList"
              :key="item.id"
              :label="item.reason"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="alter-form-item">
        <div class="key">
          <span class="reqired-star">*</span> {{ $t("详细原因") }}
        </div>
        <div>
          <el-input
            style="width: 415px"
            type="textarea"
            maxlength="500"
            show-word-limit
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="reasonDetail"
          >
          </el-input>
        </div>
      </div>
      <!-- <div
        class="extra-box"
        v-if="hasCorrectCourseTimePer"
      >
        <el-checkbox
          class="i-1"
          v-model="extraStu"
        >{{$t('额外补偿学生')}}</el-checkbox>
        <el-input
          v-if="extraStu"
          class="i-2"
          :placeholder="$t('请输入额外补偿课时')"
          v-model="sExtraRadioValue"
        >
          <template slot="append">{{$t('课时')}}</template>
        </el-input>
        <el-select
          v-if="extraStu"
          class="i-3"
          clearable
          v-model="extraReason"
          :placeholder="$t('请选择原因')"
        >
          <el-option
            v-for="item in extraReasonList"
            :key="item.id"
            :label="currentLang === 'zh' ? item.describeZh : item.describeEn"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div> -->
      <div class="btn-box">
        <el-button type="default" @click="cancel">{{ $t("取消") }}</el-button>
        <el-button type="primary" :loading="loading" @click="confirm">{{
          $t("确认")
        }}</el-button>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="showClassroomLog"
      width="680px"
    >
      <ClassRoomLog
        :classTypeId="classTypeId"
        :virtualclassId="virtualClassId"
        v-if="showClassroomLog"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showClassroomLog = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { reasonList, newReasonList } from "./constants";
import { secondToMinute } from "@/utils/handleData";
import ClassRoomLog from "@/views/classManagement/components/ClassRoomLog.vue";
import { SUBJECT_TYPE } from "@/utils/constants";

export default {
  name: "alterCost",
  components: {
    ClassRoomLog,
  },
  data() {
    return {
      SUBJECT_TYPE,
      showClassroomLog: false,
      secondToMinute,
      abnormalEnding: true,
      // 额外补偿
      extraStu: false,
      extraReason: null,
      extraReasonList: [],
      itemInfo: {},
      teacherHandleStyle: 0,
      studentHandleStyle: 1,
      studentHandleStyleDiabled: true,
      tRadioValue: null,
      sRadioValue: 1,
      sRadioDisabled: true,
      sExtraRadioValue: null,
      reason: null,
      reasonDetail: null,
      reasonList: reasonList(),
      newReasonList: newReasonList(),
      fromRouter: "",
      loading: false,
      hasCorrectCourseMoneyPer: false,
      hasCorrectCourseTimePer: false,
      correctRole: -1,
      classTypeId: -1,
      virtualClassId: -1,

    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
  },
  watch: {
    currentLang() {
      this.initData(), (this.reasonList = reasonList());
      this.newReasonList = newReasonList();
    },
  },
  created() {
    this.initData();
    this.getDetail();
    this.getExtraReasonList();
  },
  methods: {
    getMoneyNum(appealData) {
      if (!appealData) {
        return 0;
      }
      if (appealData.teacherHandleType === 1) {
        return appealData.teacherBaseRatio || 0;
      }
      
      return appealData.teacherMoney || 0;
    },

    getMoneyTip(appealData) {
      if (!appealData) {
        return "";
      }
      if (appealData.teacherHandleType === 1) {
        return appealData.teacherBaseRatio == 0 ? "" : appealData.teacherBaseRatio > 0 ? this.$t("补偿") : this.$t("扣除");
      }
      
      return appealData.teacherMoney == 0 ? "" : appealData.teacherMoney > 0 ? this.$t("补偿") : this.$t("扣除");
    },

    /* 查看教室日志 */
    viewClassRoomLog() {
      this.showClassroomLog = true;
    },
    changeHandleStyle(e, target, targetValue) {
      if (this[target] != null && e == this[target]) {
        this[target] = null;
        this[targetValue] = null;
      } else {
        if (
          (e == 1 &&
            target == "studentHandleStyle" &&
            !this.studentHandleStyleDiabled) ||
          (e == 0 &&
            target == "studentHandleStyle" &&
            this.studentHandleStyleDiabled)
        ) {
          return;
        }
        this[target] = e;
        // 判断禁用输入框默认值为1的情况
        if (this.sRadioDisabled && target == "studentHandleStyle" && e == 0) {
          this.sRadioValue = 1;
        }
      }
    },
    initData() {
      this.classTypeId = this.$route.query.classTypeId;
      this.virtualClassId = this.$route.query.virtualClassId;
      this.fromRouter = this.$route.query.from;
      this.hasCorrectCourseMoneyPer = this.fromRouter.includes(
        "appealManagement/clearingList"
      );
      this.hasCorrectCourseTimePer = this.fromRouter.includes("work/myClass");
      this.correctRole = this.hasCorrectCourseMoneyPer
        ? 1
        : this.hasCorrectCourseTimePer
        ? 2
        : null;
    },
    getDetail() {
      this.$Api.appealManagement
        .getCorrectDetail(
          this.$route.query.virtualClassId,
          this.$route.query.classTypeId,
          this.correctRole
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.itemInfo = res.data.data;
            if (this.itemInfo.status == 3) {
              this.abnormalEnding = false;
              this.teacherHandleStyle = 1;
              this.studentHandleStyle = 0;
              this.sRadioValue = 1;
              this.sRadioDisabled = true;
              this.studentHandleStyleDiabled = false;
            }
          }
        });
    },
    getExtraReasonList() {
      this.$Api.financeManagement
        .searchReasonList(this.nowUserInfo.id, { lessonMark: 1 })
        .then((res) => {
          if (res.data.code == 200) {
            this.extraReasonList = res.data.data.filter(
              (v) =>
                v.type === 1 /* 原因类型: 添加 */ &&
                (v.classify === 1 /* 手动 */ ||
                  v.classify === 2) /* 手动&自动 */
            );
          }
        });
    },
    cancel() {
      this.$router.push(this.$route.query.from);
    },
    confirm() {
      if (this.hasCorrectCourseMoneyPer) {
        if (this.teacherHandleStyle == null) {
          this.$notify({
            message: "教师课酬补偿为必填项",
            type: "error",
          });
          return;
        }
        // 教师课酬必填
        if (this.tRadioValue == null) {
          this.$notify({
            message: "请输入教师课酬调整数",
            type: "error",
          });
          return;
        }
        // 教师课酬判断 正整数或者最多两位小数
        if (
          this.teacherHandleStyle != null &&
          (this.tRadioValue < 0 ||
            !/^[1-9]+\d*(\.\d{0,2})?$|^0?\.*\d{0,2}$/.test(this.tRadioValue))
        ) {
          this.$notify({
            message: "教师课酬填写有误，请修改后提交",
            type: "error",
          });
          return;
        }
      }
      if (this.hasCorrectCourseTimePer) {
        // 学生课时判断
        if (this.studentHandleStyle != null && this.sRadioValue == null) {
          this.$notify({
            message: "请填写学生课时调整数",
            type: "error",
          });
          return;
        }
        // 学生课时判断 可以等于0
        if (
          this.studentHandleStyle != null &&
          this.sRadioValue != 0 &&
          this.sRadioValue != 1
        ) {
          this.$notify({
            message: "学生课时数填写有误，请修改后提交",
            type: "error",
          });
          return;
        }
      }

      if (!this.reason || !this.reasonDetail) {
        this.$notify({
          message: "请选择补偿原因及详细原因",
          type: "error",
        });
        return;
      }
      // 额外补偿 必须大于0
      if (
        this.hasCorrectCourseTimePer &&
        this.extraStu &&
        (this.sExtraRadioValue % 1 !== 0 || this.sExtraRadioValue <= 0)
      ) {
        this.$notify({
          message: "额外补偿学生课时必须为正整数",
          type: "error",
        });
        return;
      }
      if (this.hasCorrectCourseTimePer && this.extraStu && !this.extraReason) {
        this.$notify({
          message: "请选择额外补偿原因",
          type: "error",
        });
        return;
      }

      let params = {
        classTypeId: Number(this.$route.query.classTypeId),
        virtualClassId: Number(this.$route.query.virtualClassId),
        reason: this.reason,
        teacherHandleStyle: this.teacherHandleStyle,
        studentHandleStyle: this.studentHandleStyle,
        reasonDetail: this.reasonDetail,
        currency: this.itemInfo.tutorLocalAreaCurrency,
        studentAmount:
          this.studentHandleStyle == 1
            ? this.sRadioValue * -1
            : this.sRadioValue * 1,
        correctRole: this.correctRole,
      };

      if (this.itemInfo.subjectType == SUBJECT_TYPE.CHINESE) {
        params["teacherHandleType"] = 0;
        params["teacherMoney"] = this.teacherHandleStyle == 1
            ? this.tRadioValue * -1
            : this.tRadioValue * 1;
      }
      else {
        params["teacherHandleType"] = 1;
        params["teacherBaseRatio"] = this.teacherHandleStyle == 1
            ? this.tRadioValue * -1
            : this.tRadioValue * 1;
      }

      if (this.hasCorrectCourseTimePer && this.extraStu) {
        params.extraStudentAmount = this.sExtraRadioValue * 1;
        params.extraStudentReasonId = this.extraReason;
      }
      this.loading = true;
      this.$Api.appealManagement
        .saveCorrect(params)
        .then((res) => {
          if (res.data.code == 200) {
            this.$notify({
              message: "费用修正成功",
              type: "success",
            });
            this.$router.push(this.$route.query.from);
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="scss" scoped>
.hr-dashed-line {
  margin: 25px 0;
}

.alter-cost {
  padding: 25px;
  font-size: 14px;
  color: #333;

  .basic-info {
    padding-bottom: 0 0 20px 0;

    .s-1 {
      display: flex;
      line-height: 16px;

      .item {
        margin-right: 40px;
      }

      .title {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .table-info {
      display: flex;
      flex-wrap: wrap;

      .table-info-item {
        width: 25%;
        line-height: 24px;
        display: flex;
        .value {
          color: #666;
        }
      }
    }
  }

  .alter-form {
    .alter-form-item {
      display: flex;
      margin-bottom: 20px;

      .key {
        margin-right: 30px;
      }

      .ipb {
        margin-left: 30px;
        margin-top: -6px;
      }
    }

    .btn-box {
      padding-left: 85px;
    }
  }

  .alter-info {
    line-height: 30px;

    .value {
      color: #666;
      word-break: break-all;
    }
  }

  .student-info {
    margin: 10px 0;
  }
}

.extra-box {
  padding-left: 95px;

  .i-1 {
    margin-right: 10px;
    margin-bottom: 20px;
    color: #606060;
  }

  .i-2 {
    width: 250px;
    margin-right: 10px;
  }
}

.reqired-star {
  color: red;
  font-size: 16px;
}
</style>
