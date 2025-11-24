<template>
  <div class="appeal-list">
    <div class="tab-box">
      <el-tabs
        v-model="activeTabName"
        @tab-click="changeClassType"
        class="tab-box"
      >
        <el-tab-pane :label="$t('1对1')" name="oneToOne"> </el-tab-pane>
        <el-tab-pane :label="$t('小班课')" name="smallClass"> </el-tab-pane>
      </el-tabs>
    </div>
    <TeacherComments
      v-if="teacherComments"
      :teacherComments="teacherComments"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentFeedback="studentFeedback"
      :titleName="titleName"
      @getTableData="getTableData"
      @closeTeacherComments="closeTeacherComments"
    ></TeacherComments>
    <div class="introduction-wrap">
      <screen-wrapper @search="search" screenTitle="">
        <div style="padding-top: 10px">
          <el-radio-group v-model="screenData.dateType" @change="changeRadion">
            <el-radio-button :label="-1">{{ $t("上月") }}</el-radio-button>
            <el-radio-button :label="0">{{ $t("本月") }}</el-radio-button>
          </el-radio-group>
        </div>
        <screen-item label="" :part="4" label-width="0">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="screenData.registryTime"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            @change="changeDatePicker"
          >
          </el-date-picker>
        </screen-item>
        <screen-item
          :label="$t('请选择老师反馈')"
          :part="4"
          :label-width="currentLang == 'en' ? 200 : 110"
        >
          <el-select
            clearable
            v-model="screenData.feedbackStatus"
            :placeholder="$t('请选择老师反馈')"
          >
            <el-option
              v-for="item in tFeedback"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </screen-item>
        <screen-item
          :label="$t('请选择是否修正')"
          :part="4"
          :label-width="currentLang == 'en' ? 200 : 110"
        >
          <el-select
            clearable
            v-model="screenData.appealStatus"
            :placeholder="$t('请选择是否修正')"
          >
            <el-option
              v-for="item in appealStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </screen-item>
        <screen-item
          :label="$t('请输入老师名字')"
          :part="4"
          :label-width="currentLang == 'en' ? 200 : 110"
        >
          <el-input clearable v-model="screenData.tutorUserName"></el-input>
        </screen-item>
        <screen-item
          :label="$t('请输入学生名字')"
          :part="4"
          :label-width="currentLang == 'en' ? 200 : 110"
        >
          <el-input clearable v-model="screenData.studentUserName"></el-input>
        </screen-item>
        <screen-item
          :label="$t('教师管理人员')"
          :part="4"
          :label-width="currentLang === 'en' ? 180 : 100"
        >
          <el-select
            filterable
            clearable
            v-model="screenData.tmUserId"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in teachPersonlist"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </screen-item>
      </screen-wrapper>
      <div class="table-wrapper">
        <div class="tips" v-if="!isSearch">
          {{ $t("请设置筛选条件后查询") }}
        </div>
        <el-table
          v-else
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          class="attend-table"
        >
          <el-table-column align="center" :label="$t('序号')" :width="50">
            <template slot-scope="scope">{{
              (pageObj.pageNum - 1) * pageObj.pageSize + scope.$index + 1
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('上课时间')"
            prop="startTime"
            width="140"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.startTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师姓名')"
            prop="tutorIdentityName"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师用户名')"
            prop="tutorUsername"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('my-home-Student')"
            prop="studentUsername"
          >
            <template slot-scope="scope">
              <div
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
              >
                <router-link
                  :to="{
                    path: `/studentManagement/studentInfo`,
                    query: {
                      studentId: i.studentUserId,
                      studentName: i.studentRealName,
                    },
                  }"
                >
                  <el-button type="text">{{ i.studentRealName }}</el-button>
                </router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('家长id')"
            prop="parentUserId"
          >
            <template slot-scope="scope">
              <div
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
              >
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: i.parentUserId },
                  }"
                >
                  <el-button type="text">{{ i.parentUserId }}</el-button>
                </router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('my-home-Curriculum')"
            prop="name"
          >
            <template slot-scope="scope">
              <div>
                {{
                  currentLang === "zh"
                    ? scope.row.editionNameOpsZh
                    : scope.row.editionName
                }}
                level {{ scope.row.courseLevel }} lesson
                {{ scope.row.lessonNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('schedule-Time for students to enter class')"
            prop="enterTime"
          >
            <template slot-scope="scope">
              <div
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
              >
                <div>
                  {{
                    DateTimeUtils.dateClockTime(i.enterTime).split(" ")[1] ||
                    "未知"
                  }}
                  ~
                  {{
                    DateTimeUtils.dateClockTime(i.leaveTime).split(" ")[1] ||
                    "未知"
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('教师进出课堂时间')"
            prop="tutorInTime"
          >
            <template slot-scope="scope">
              <el-button @click="viewClassRoomLog(scope.row)" type="text">
                <span>
                  {{
                    DateTimeUtils.dateClockTime(scope.row.tutorInTime).split(
                      " "
                    )[1] || "未知"
                  }}
                  ~
                  {{
                    DateTimeUtils.dateClockTime(scope.row.tutorOutTime).split(
                      " "
                    )[1] || "未知"
                  }}
                </span></el-button
              >
            </template>
          </el-table-column>

          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('上课时长')"
            prop="tutorInTime"
          >
            <template slot-scope="scope">
              {{ secondToMinute(scope.row.actualClassDuration) }}
            </template>
          </el-table-column>

          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师反馈')"
            prop="feedbackStatus"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.feedbackStatus == 0">{{
                $t("未反馈")
              }}</span>
              <span v-if="scope.row.feedbackStatus == 1">{{
                $t("正常反馈")
              }}</span>
              <span v-if="scope.row.feedbackStatus == 2">{{
                $t("异常反馈")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            :label="$t('my-home-Abnormal Reason')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.reason == 0 && scope.row.status == 4">{{
                $t("老师未反馈")
              }}</span>
              <span v-else>{{
                scope.row.reason | abnormalFinishedResult
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师课酬')"
            prop="classroomTutorAmount"
          >
            <template slot-scope="scope">
              {{ scope.row.classroomTutorAmount }}
              {{ scope.row.tutorLocalAreaCurrency }}
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('学生课时')"
            prop="classroomStudentAmount"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('顾问&学管')"
            prop="adviserUserName"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
              >
                <div>
                  <p>
                    {{ $t("学管") }}：<span>{{ i.xgUserName }}</span>
                  </p>
                  <p>
                    {{ $t("顾问") }}：<span>{{ i.adviserUserName }}</span>
                  </p>
                </div>
                <div slot="reference">
                  <el-button type="text">{{ $t("点击查看") }} </el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('lv2-nav-Teacher Management')"
            prop="xgTutorUserName"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tmUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('是否修正')"
            prop="correctStatus"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.correctStatus === 3 &&
                  scope.row.tmCorrectStatus === 1
                "
                >{{ $t("已修正") }}</span
              >
              <span v-else>{{ $t("未修正") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="240"
            align="center"
            :label="$t('操作')"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  clickHandlerPlayback(
                    scope.row.virtualClassId,
                    scope.row.classTypeId
                  )
                "
              >
                {{ $t("回放") }}</el-button
              >
              <el-button
                type="text"
                @click="
                  openTeacherComments(
                    scope.row.virtualClassId,
                    'Student',
                    scope.row
                  )
                "
              >
                {{ $t("老师反馈") }}</el-button
              >
              <el-button type="text" @click="goToAlterCost(scope.row)">
                <span
                  v-if="
                    scope.row.correctStatus === 3 &&
                    scope.row.tmCorrectStatus === 1
                  "
                  >{{ $t("查看费用") }}</span
                >
                <span v-else>{{ $t("修正费用") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <custom-pagination
        v-if="isSearch && total >= 1"
        :total="total"
        :current-page="pageObj.pageNum"
        :pageSize="pageObj.pageSize"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <el-dialog
      @close="beforeCloseDialog"
      :title="
        currentItem.updateAttendStatus == 1
          ? '查看老师出席状态修改记录'
          : '修改状态'
      "
      center
      :visible.sync="statusDialogVisiable"
    >
      <div v-if="currentItem.updateAttendStatus == 1">
        <div class="dialog-box">
          <div class="item">
            <span class="key">修改时间：</span>
            <span class="value">{{
              DateTimeUtils.dateClockTime(currentAttendStatusDetail.updateTime)
            }}</span>
          </div>
          <div class="item">
            <span class="key">修改人：</span>
            <span class="value">{{
              currentAttendStatusDetail.updateUserName
            }}</span>
          </div>
          <div class="item">
            <span class="key">修改前：</span>
            <span class="value">{{
              currentAttendStatusDetail.beforeAttendStatus
                | teacherAttendStatusFilter
            }}</span>
          </div>
          <div class="item">
            <span class="key">修改后：</span>
            <span class="value">{{
              currentAttendStatusDetail.afterAttendStatus
                | teacherAttendStatusFilter
            }}</span>
          </div>
          <div class="item">
            <span class="key">修改理由：</span>
            <span class="value">{{ currentAttendStatusDetail.reason }}</span>
          </div>
        </div>
      </div>
      <div class="dialog-box" v-else>
        <div class="item">
          <span>老师：{{ currentItem.tutorUsername }}</span>
        </div>
        <div class="item">
          <span
            >出席状态：<span v-if="currentItem.attendStatus">{{
              currentItem.attendStatus | teacherAttendStatusFilter
            }}</span
            ><span v-else>未知</span>
          </span>
        </div>
        <div class="item">
          <span>状态修改：</span>
          <el-select
            clearable
            v-model="tStatusValue"
            placeholder="请选择教师出席状态"
          >
            <el-option
              v-for="item in tStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span>状态理由：</span>
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            :rows="4"
            placeholder="请输入你的修改理由，最少10个字最多500个字"
            v-model="updateReason"
          >
          </el-input>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="currentItem.updateAttendStatus == 0"
      >
        <el-button @click="statusDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="sure" :loading="sureLoading"
          >确定
        </el-button>
      </span>
    </el-dialog>
    <ClassCallBack
      :classType="currentCBclassTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    >
    </ClassCallBack>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="showClassroomLog"
      width="680px"
    >
      <ClassRoomLog
        :classTypeId="screenData.classTypeId"
        :virtualclassId="currentRow.virtualClassId"
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
import { virtualclassComment } from "@/api/classManagement/";
import moment from "moment";
import { mapState, mapGetters } from "vuex";
import TeacherComments from "../myWorkbench/components/teacherComments";
import ClassCallBack from "../../components/ClassCallBack";
import { secondToMinute } from "@/utils/handleData";
import ClassRoomLog from "@/views/classManagement/components/ClassRoomLog.vue";

export default {
  name: "clearingList",
  components: {
    TeacherComments,
    ClassCallBack,
    ClassRoomLog,
  },
  data() {
    return {
      secondToMinute,
      isSearch: false,
      teachPersonlist: [],
      // 老师反馈 start
      teacherComments: false,
      teacherInfo: {},
      commentsLoading: true,
      valuationrate: {
        comment: [], // 评价
        valuation: [], // 评分
      },
      studentAll: [],
      studentFeedback: true, // 学生反馈
      titleName: "",
      // 老师反馈 end
      activeTabName: "oneToOne",
      tableData: [],
      currentItem: {},
      currentAttendStatusDetail: {},
      updateReason: null,
      tStatusValue: null,
      tFeedback: [],
      tStatus: [
        {
          id: 0,
          name: "正常",
        },
        {
          id: 1,
          name: "迟到",
        },
        {
          id: 2,
          name: "早退",
        },
        {
          id: 3,
          name: "旷课",
        },
        {
          id: 4,
          name: "迟到早退",
        },
      ],
      appealStatusList: [],
      tableHeight: window.innerHeight - 200 || 300,
      screenData: {
        classTypeId: 1,
        dateType: 0,
        tutorUserName: "",
        studentUserName: "",
        registryTime: [],
        attendStatus: "",
        feedbackStatus: "",
        appealStatus: "",
        tmUserId: "",
      },
      pageObj: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      statusDialogVisiable: false,
      currentCallBackId: 0,
      showCallBack: false,
      currentCBclassTypeId: 0,
      currentRow: {},
      showClassroomLog: false,
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
      currentLang: (state) => state.app.currentLang,
    }),
    ...mapGetters(["xgList", "gwList"]),
  },
  watch: {
    currentLang() {
      this.initData();
      this.getTeachPerson();
    },
  },
  methods: {
    /* 查看教室日志 */
    viewClassRoomLog(row) {
      this.currentRow = row;
      this.showClassroomLog = true;
    },
    initData() {
      this.tFeedback = [
        {
          id: "",
          name: this.$t("全部"),
        },
        {
          id: 0,
          name: this.$t("未反馈"),
        },
        {
          id: 1,
          name: this.$t("正常反馈"),
        },
        {
          id: 2,
          name: this.$t("异常反馈"),
        },
      ];
      this.appealStatusList = [
        {
          id: "",
          name: this.$t("全部"),
        },
        {
          id: 0,
          name: this.$t("未修正"),
        },
        {
          id: 3,
          name: this.$t("已修正"),
        },
      ];
      this.screenData.feedbackStatus = this.screenData.feedbackStatus || "";
      this.screenData.appealStatus = this.screenData.appealStatus || "";
    },
    openTeacherComments(virtualClassId, target, obj) {
      this.studentAll = [];
      this.teacherInfo.teacherName = obj.tutorUsername;
      this.teacherInfo.classTime = obj.startTime;
      this.teacherInfo.classType = obj.classTypeId == 1 ? "一对一" : "小班课";
      this.studentFeedback = target === "Student";
      this.titleName =
        target === "Student"
          ? this.$t("my-home-Teacher Feedback")
          : this.$t("my-home-Student Feedback");
      this.teacherInfo.course = `${obj.editionName} ${obj.courseName} ${obj.lessonNo}`;
      this.commentsLoading = true;
      obj.virtualClassMemberResultList.map((i) => {
        i.studentName = i.studentRealName;
      });
      // this.studentAll = obj.virtualClassMemberResultList
      virtualclassComment(virtualClassId, target).then((res) => {
        this.commentsLoading = false;
        this.valuationrate = res.data.data || [];
        this.teacherComments = true;
      });
    },
    closeTeacherComments() {
      this.teacherComments = false;
      this.valuationrate = [];
    },
    // 课堂回放
    clickHandlerPlayback(virtualClassId, virtualclassTypeId) {
      this.currentCallBackId = virtualClassId;
      this.currentCBclassTypeId = virtualclassTypeId;
      this.showCallBack = true;
    },
    handleCloseCallBack() {
      this.showCallBack = false;
    },
    sure() {
      if (this.updateReason == null || this.tStatusValue == null) {
        this.$notify({
          message: "请填写完整表单再提交",
          type: "error",
        });
        return;
      }
      let params = {
        attendStatus: this.tStatusValue,
        classTypeId: this.currentItem.classTypeId,
        tutorUserId: Number(this.currentItem.tutorUserId),
        updateReason: this.updateReason,
        virtualClassId: this.currentItem.virtualClassId,
      };
      this.$Api.appealManagement.updateAttendstatus(params).then((res) => {
        if (res.data.code == 200) {
          this.$notify({
            message: "更新成功",
            type: "success",
          });
          this.statusDialogVisiable = false;
          this.getTableData();
        } else {
          this.$notify({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    // 改变班级类型
    changeClassType(tab) {
      this.pageObj = {
        pageNum: 1,
        pageSize: 10,
      };
      this.screenData.classTypeId = tab.name == "oneToOne" ? 1 : 2;
      this.isSearch = false;
    },
    changeRadion(val) {
      this.screenData.registryTime = [];
      this.getTableData();
    },
    changeDatePicker() {
      this.screenData.dateType = "";
    },
    beforeCloseDialog() {
      this.updateReason = null;
      this.tStatusValue = null;
    },
    goToAlterCost(item) {
      this.$router.push(
        `/appealManagement/alterCost?classTypeId=${
          item.classTypeId
        }&virtualClassId=${item.virtualClassId}&correctStatus=${
          item.correctStatus === 3 && item.tmCorrectStatus === 1
        }&from=/appealManagement/clearingList`
      );
    },
    search() {
      this.pageObj.pageNum = 1;
      this.getTableData();
    },
    getCurrentPage(page) {
      this.pageObj.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.pageObj.pageSize = perPage;
      this.getTableData();
    },
    getTeachPerson() {
      this.$Api.systemManagement
        .getThisRoleUserList({
          roleId: this.Constants.teacherMtCode,
          pageNum: 1,
          pageSize: 1000,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.teachPersonlist = [
              {
                username: this.$t("全部"),
                id: "",
              },
              ...data.data.list,
            ];
          }
        });
    },
    getTableData() {
      this.tableData = [];
      this.total = 0;
      this.isSearch = true;
      let { pageNum, pageSize } = this.pageObj;
      let {
        studentUserName,
        tutorUserName,
        classTypeId,
        registryTime,
        dateType,
        attendStatus,
        feedbackStatus,
        appealStatus,
        tmUserId,
      } = this.screenData;
      let params = {
        studentUserName,
        tutorUserName,
        classTypeId,
        dateType,
        attendStatus,
        feedbackStatus,
        appealStatus,
        tmUserId,
        startTime:
          Array.isArray(registryTime) && registryTime.length != 0
            ? moment(`${registryTime[0]} 00:00:00`).toISOString()
            : "",
        endTime:
          Array.isArray(registryTime) && registryTime.length != 0
            ? moment(`${registryTime[1]} 23:59:59`).toISOString()
            : "",
      };
      this.loading = true;
      this.$Api.appealManagement
        .getCorrectListV2(pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            this.loading = false;
            this.total = data.data.total;
            this.tableData = data.data.list;
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
          this.total = 0;
        });
    },
  },
  created() {},

  activated() {
    this.getTeachPerson();
    this.initData();
    this.search();
  },
};
</script>
<style lang="scss" scoped>
.dialog-box {
  .item {
    line-height: 2;
    margin-bottom: 10px;

    .key {
      font-weight: bold;
      display: inline-block;
      width: 70px;
      text-align: right;
    }
  }
}

.tab-box {
  padding: 5px 10px 0 10px;
}

.introduction-wrap {
  padding: 5px;
}

.table-wrapper {
  margin-top: 20px;
  padding: 0 15px;

  .tips {
    margin: 50px auto;
    text-align: center;
    color: #666;
    font-size: 14px;
  }

  .attend-table {
    border: 1px solid #f1f1f1;

    table {
      width: 100%;
    }
  }
}
</style>
