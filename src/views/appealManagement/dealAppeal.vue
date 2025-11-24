<template>
  <div class="alter-cost">
    <el-dialog
      @close="beforeCloseDialog"
      :title="$t('处理申诉')"
      center
      :visible.sync="statusDialogVisiable"
    >
      <div class="alter-form">
        <div class="alter-form-item">
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
        <div class="alter-form-item">
          <div class="key">
            <span class="reqired-star">*</span> {{ $t("选择原因") }}
          </div>
          <div class="ipb" style="margin-left: 0">
            <el-select
              clearable
              v-model="reason"
              :placeholder="$t('请选择原因')"
            >
              <el-option
                v-for="item in reasonList"
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisiable = false">
          {{ $t("my-home-CCancel") }}</el-button
        >
        <el-button type="primary" @click="sure" :loading="sureLoading">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
    <div class="basic-info">
      <div class="s-box">
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
              {{ itemInfo.grantRatio === null  ? "":`(${$t("实际发放比例")}: ${itemInfo.grantRatio}%)` }}
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
        <div class="s-2">
          <div>
            <span class="title">{{ $t("本课申诉") }}：</span
            >{{ itemInfo.appealCount || 0 }}{{ $t("次") }}
          </div>
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
          <div class="key">{{ $t("课程") }}：</div>
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
                )[1] || $t("未知")
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
                )[1] || $t("未知")
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
    <div
      class="history-item"
      v-for="(item, index) in appealHistoryList"
      :key="index"
    >
      <div class="btn-box">
        <el-button
          :loading="dealAppealBtnLoading"
          type="primary"
          v-if="item.appealStatus == 1 && appealStopTime"
          @click="dealAppeal(item.appealId)"
          >{{ $t("处理申诉") }}</el-button
        >
      </div>
      <div class="hr-dashed-line"></div>
      <div class="alter-info">
        <div class="item">
          <span class="key">{{ $t("申诉时间") }}：</span>
          <span class="value">{{
            DateTimeUtils.dateClockTime(item.appealTime)
          }}</span>
        </div>
        <div class="item">
          <span class="key">{{ $t("申诉状态") }}：</span>
          <span class="value">
            <span v-if="item.appealStatus == 0">{{ $t("未申诉") }}</span>
            <span v-if="item.appealStatus == 1">{{ $t("待处理") }}</span>
            <span v-if="item.appealStatus == 2">{{ $t("已处理") }}</span>
            <span v-if="item.appealStatus == 3">{{ $t("已修正") }}</span>
          </span>
        </div>
        <div class="item">
          <span class="key">{{ $t("申诉原因") }}：</span>
          <span class="value">{{ item.appealReasonDetail }}</span>

          <div>
            <el-image 
              v-if="!!item.fileUrl"
              style="width: 100px; height: 100px"
              :src="item.fileUrl" 
              :preview-src-list="[item.fileUrl]"
              hide-on-click-modal=true
              close-on-press-escape=true
              />
          </div>
        </div>

        <div
          class="item"
          v-if="item.appealStatus == 2 || item.appealStatus == 3"
        >
          <div class="deal-detail-box">
            <div>
              {{ $t("处理结论") }}：{{ $t("老师") }} {{ getMoneyTip(item) }} {{ getMoneyNum(item) }}
              {{ item.teacherHandleType===1 ? "%" : item.currency }} 
            </div>
            <div>
              {{ $t("处理时间") }}：{{
                DateTimeUtils.dateClockTime(item.handleTime)
              }}
            </div>
            <div>{{ $t("处理人员") }}：{{ item.handlerUserName }}</div>
            <div v-if="item.handlerReason">
              {{ $t("处理原因") }}：{{
                $t(Filters.newCorrectReasonFilter(item.handlerReason))
              }}
            </div>
            <div v-if="item.handlerReasonDetail">
              {{ $t("处理意见") }}：{{ item.handlerReasonDetail }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="showClassroomLog"
      width="680px"
    >
      <ClassRoomLog
        :classTypeId="itemInfo.classTypeId"
        :virtualclassId="itemInfo.virtualClassId"
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
import { newReasonList } from "./constants";
import { secondToMinute } from "@/utils/handleData";
import ClassRoomLog from "@/views/classManagement/components/ClassRoomLog.vue";
import { SUBJECT_TYPE } from "@/utils/constants";

export default {
  name: "dealAppeal",
  components: { ClassRoomLog },
  data() {
    return {
      SUBJECT_TYPE,
      showClassroomLog: false,
      abnormalEnding: true,
      dealAppealBtnLoading: false,
      appealId: null,
      statusDialogVisiable: false,
      itemInfo: {},
      teacherHandleStyle: 0,
      tRadioValue: null,
      sExtraRadioValue: null,
      reason: null,
      reasonDetail: null,
      reasonList: newReasonList(),
      appealHistoryList: [],
      appealStopTime: true,
      secondToMinute,
      // subjectType: 0,
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
      this.reasonList = newReasonList();
    },
  },
  created() {

    // this.subjectType = this.$route.query.subjectType;
    this.initData();
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
        this[target] = e;
      }
    },
    initData() {
      this.getDetail();
      // this.getAppealItemHistory();
    },
    getDetail() {
      const url =
        this.$route.query.dataType == 1
          ? "getAppealDetailV2"
          : "getAppealDetail";
      this.$Api.appealManagement[url](
        this.$route.query.appealId,
        this.$route.query.classTypeId
      ).then((res) => {
        if (res.data.code == 200) {
          this.itemInfo = res.data.data;
          this.appealHistoryList = this.itemInfo ? this.itemInfo.financeClassroomAppealHistoryResultList : [];
          if (this.itemInfo.status == 3) {
            this.abnormalEnding = false;
            this.teacherHandleStyle = 1;
          }
          // this.itemInfo.startTime = "2024-08-15T13:30:00.000Z"
          if (
            new Date(this.itemInfo.startTime).getMonth() !==
            new Date().getMonth()
          ) {
            this.getAppealStopTime();
          }
        }
      });
    },
    getAppealItemHistory() {
      this.$Api.appealManagement
        .getAppealItemHistory(this.$route.query.virtualClassId)
        .then((res) => {
          if (res.data.code == 200) {
            
            this.appealHistoryList = res.data.data;
          }
        });
    },
    dealAppeal(appealId) {
      this.appealId = appealId;
      this.statusDialogVisiable = true;
    },
    sure() {
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
      // 教师课酬判断 可以等于0
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
      if (!this.reason || !this.reasonDetail) {
        this.$notify({
          message: "请选择补偿原因及详细原因",
          type: "error",
        });
        return;
      }

      let params = {
        appealId: this.appealId,
        classTypeId: this.itemInfo.classTypeId,
        currency: this.itemInfo.tutorLocalAreaCurrency,
        reason: this.reason,
        teacherHandleStyle: this.teacherHandleStyle,
        reasonDetail: this.reasonDetail,
        virtualClassId: this.itemInfo.virtualClassId,
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

      this.dealAppealBtnLoading = true;
      const url =
        this.$route.query.dataType == 1 ? "updateAppealV2" : "updateAppeal";
      this.$Api.appealManagement[url](params).then((res) => {
        if (res.data.code == 200) {
          this.$notify({
            message: "处理成功",
            type: "success",
          });
          this.statusDialogVisiable = false;
          this.initData();
          this.dealAppealBtnLoading = false;
        } else {
          this.$notify({
            message: res.data.message,
            type: "error",
          });
          this.dealAppealBtnLoading = false;
        }
      });
    },
    cancel() {
      this.$router.push("/appealManagement/clearingList");
    },
    getAppealStopTime() {
      this.$Api.appealManagement
        .getAppealStopTime()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            let timeo = data.data.find(
              (item) => item.typeKey === this.ApiConstants.appealStopTime
            );
            if (+new Date() > +new Date(timeo.stopTime)) {
              this.appealStopTime = false;
            } else {
              this.appealStopTime = true;
            }
          }
        });
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

    .s-box {
      display: flex;
      justify-content: space-between;
    }

    .s-1,
    .s-2 {
      display: flex;
      line-height: 16px;
    }

    .item {
      margin-right: 40px;
    }

    .title {
      font-weight: bold;
      font-size: 16px;
    }

    .table-info {
      display: flex;
      flex-wrap: wrap;

      .table-info-item {
        min-width: 25%;
        line-height: 24px;
        display: flex;

        .key {
        }

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
    word-break: break-all;

    .deal-detail-box {
      max-width: 400px;
      margin-top: 10px;
      background: #f3f3f3;
      border-radius: 4px;
      padding: 10px;

      .key {
      }

      .value {
        color: #666;
      }
    }
  }
}

.history-item {
  position: relative;

  .btn-box {
    position: absolute;
    top: 30px;
    right: 20px;
    z-index: 999;
  }
}

.student-info {
  margin: 10px 0;
}

.extra-box {
  .i-1 {
    margin-right: 10px;
    margin-bottom: 20px;
    color: #606060;
  }

  .i-2 {
    width: 250px;
    margin-right: 10px;
  }

  .i-3 {
  }
}

.reqired-star {
  color: red;
  font-size: 16px;
  width: 5px;
  display: inline-block;
}
</style>
