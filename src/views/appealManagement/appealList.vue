<template>
  
  <div class="appeal-list">

    <div class="tab-box">
      <el-tabs v-model="activeName" @tab-click="changeStatus" class="tab-box">
        <el-tab-pane :label="$t('待处理')" name="tab1"></el-tab-pane>
        <el-tab-pane :label="$t('已处理')" name="tab2"></el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      @close="beforeCloseDialog"
      title="教师反馈"
      center
      :visible.sync="teacherCommentsDialogVisiable"
    >
      <div class="feedback-box">
        <div>{{ $t("教师") }}：{{ currentItem.tutorUsername }}</div>
        <div>
          {{ $t("上课时间") }}：{{
            DateTimeUtils.dateClockTime(currentItem.startTime)
          }}
        </div>
        <div>
          {{ $t("schedule-Class Size") }}：{{
            currentItem.classTypeId | mapClassType
          }}
        </div>
        <div>
          {{ $t("my-home-1-Lesson Detail") }}：
          <span v-show="currentLang === 'en'">{{
            currentItem.courseEditionId | mapEdtionEn
          }}</span>
          <span v-show="currentLang === 'zh'">{{
            currentItem.courseEditionId | mapEdtion
          }}</span>
          Level {{ currentItem.courseLevel }} Lesson
          {{ currentItem.lessonNo }}
        </div>
        <div>
          {{ $t("my-home-Abnormal Reason") }}：{{
            currentItem.reason | abnormalFinishedResult
          }}
        </div>
        <div>{{ $t("详细原因") }}：{{ currentItem.remark }}</div>
      </div>
    </el-dialog>
    <TeacherComments
      v-if="teacherComments"
      :teacherComments="teacherComments"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentAll="studentAll"
      :studentFeedback="studentFeedback"
      :titleName="titleName"
      @getTableData="getTableData"
      @closeTeacherComments="closeTeacherComments"
    >
    </TeacherComments>
    <div class="introduction-wrap">
      <screen-wrapper @search="search" screenTitle>
        <div style="padding-top: 10px">
          <el-radio-group v-model="screenData.dateType" @change="changeRadion">
            <el-radio-button :label="-1">{{ $t("上月") }}</el-radio-button>
            <el-radio-button :label="0">{{ $t("本月") }}</el-radio-button>
          </el-radio-group>
        </div>
        <screen-item label :part="4" label-width="0">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="screenData.registryTime"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            @change="changeDatePicker"
          ></el-date-picker>
        </screen-item>
        <screen-item
          :label="$t('请输入老师姓名')"
          :part="4"
          :label-width="currentLang === 'en' ? 180 : 110"
        >
          <el-input clearable v-model="screenData.tutorUserName"></el-input>
        </screen-item>
        <screen-item
          :label="$t('请输入学生名字')"
          :part="4"
          :label-width="currentLang === 'en' ? 180 : 110"
        >
          <el-input clearable v-model="screenData.studentUserName"></el-input>
        </screen-item>
        <screen-item
          :label="$t('老师是否同意')"
          :part="4"
          :label-width="currentLang === 'en' ? 180 : 100"
        >
          <el-select
            clearable
            v-model="screenData.agreeStatus"
            :placeholder="$t('老师是否同意')"
          >
            <el-option
              v-for="item in agreeStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <screen-item :label="$t('数据类型')" :part="4" label-width="100">
          <el-select v-model="dataType">
            <el-option :label="$t('新数据')" :value="DATA_TYPE.NEW" />
            <el-option :label="$t('老数据')" :value="DATA_TYPE.OLD" />
          </el-select>
        </screen-item>
        <screen-item :label="$t('学科')">
        <el-select
          clearable
          v-model="subjectType"
          :placeholder="$t('请选择')"
        >
          <el-option :label="$t('中文')" :value="SUBJECT_TYPE.CHINESE">
          </el-option>
          <el-option :label="$t('英文')" :value="SUBJECT_TYPE.ENGLISH">
          </el-option>
          <el-option :label="$t('数学')" :value="SUBJECT_TYPE.MATH">
          </el-option>
          <!-- <el-option
            v-if="Per.handleButtonPer('teach.dealsMT.filterByMusic')"
            :label="$t('音乐')"
            :value="SUBJECT_TYPE.MUSIC"
          >
          </el-option> -->
        </el-select>
      </screen-item>
      </screen-wrapper>
      <div class="table-wrapper">
        <el-table
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
            :label="$t('申诉时间')"
            prop="appealTime"
            width="140"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.appealTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('申诉人(老师姓名)')"
            prop="tutorIdentityName"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('申诉人(老师用户名)')"
            prop="tutorUsername"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('上课时间')"
            prop="startTime"
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
            :label="$t('学生')"
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
                <div>{{ i.parentUserId }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="200"
            align="center"
            :label="$t('my-home-2-Lesson Detail')"
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
            prop="studentInTime"
          >
            <template slot-scope="scope">
              <div
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
              >
                <div>
                  {{
                    DateTimeUtils.dateClockTime(i.enterTime).split(" ")[1] ||
                    $t("未知")
                  }}
                  ~
                  {{
                    DateTimeUtils.dateClockTime(i.leaveTime).split(" ")[1] ||
                    $t("未知")
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师进出课堂时间')"
            prop="tutorInTime"
          >
            <template slot-scope="scope">
              <el-button @click="viewClassRoomLog(scope.row)" type="text">
                {{
                  DateTimeUtils.dateClockTime(scope.row.tutorInTime).split(
                    " "
                  )[1] || $t("未知")
                }}
                ~
                {{
                  DateTimeUtils.dateClockTime(scope.row.tutorOutTime).split(
                    " "
                  )[1] || $t("未知")
                }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('上课时长')"
            prop="actualClassDuration"
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
              <div v-if="scope.row.feedbackStatus == 0">{{ $t("未反馈") }}</div>
              <div v-if="scope.row.feedbackStatus == 1">
                {{ $t("正常反馈") }}
              </div>
              <div v-if="scope.row.feedbackStatus == 2">
                {{ $t("异常反馈") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('老师课酬')"
            prop="classroomTutorAmount"
          >
            <template slot-scope="scope"
              >{{ scope.row.classroomTutorAmount }}
              {{ scope.row.tutorLocalAreaCurrency }}</template
            >
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
                v-for="(i, index) in scope.row.virtualClassMemberResultList"
                :key="index"
                width="200"
                trigger="hover"
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
                  <el-button type="text">{{ $t("点击查看") }}</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('lv2-nav-Teacher Management')"
            prop="tmUserName"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('本节课申诉次数')"
            prop="appealCount"
          ></el-table-column>
          <el-table-column
            :min-width="150"
            align="center"
            :label="$t('处理人员')"
            prop="handlerUserName"
            v-if="activeName == 'tab2'"
          >
            <template slot-scope="scope">{{
              scope.row.handlerUserName
            }}</template>
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
            :label="$t('老师是否同意')"
            prop="appealStatus"
            v-if="activeName == 'tab2'"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.appealStatus | teacherAppealStatusFilter
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="240"
            align="center"
            :label="$t('操作')"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="clickHandlerPlayback(scope.row)"
                >{{ $t("回放") }}
              </el-button>
              <el-button type="text" @click="openTeacherComments(scope.row)">
                {{ $t("老师反馈") }}</el-button
              >
              <el-button type="text" @click="goToDealAppeal(scope.row)"
                >{{ $t("处理申诉") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <custom-pagination
        :total="total"
        :current-page="pageObj.pageNum"
        :pageSize="pageObj.pageSize"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <ClassCallBack
      :classType="currentCBclassTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    ></ClassCallBack>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="showClassroomLog"
      width="680px"
    >
      <ClassRoomLog
        :classTypeId="currentRow.classTypeId"
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
import { mapState } from "vuex";
import moment from "moment";
import TeacherComments from "../myWorkbench/components/teacherComments";
import ClassCallBack from "../../components/ClassCallBack";
import { secondToMinute } from "@/utils/handleData";
import ClassRoomLog from "@/views/classManagement/components/ClassRoomLog.vue";
import { SUBJECT_TYPE } from "@/utils/constants";
import {
  watch,
} from "@vue/composition-api";

const DATA_TYPE = {
  NEW: 1,
  OLD: 2,
};
export default {
  name: "appealList",
  components: {
    TeacherComments,
    ClassCallBack,
    ClassRoomLog,
  },
  data() {
    return {
      SUBJECT_TYPE,
      subjectType: "",
      currentRow: {},
      showClassroomLog: false,
      secondToMinute,
      dataType: DATA_TYPE.NEW,
      currentItem: {},
      teacherCommentsDialogVisiable: false,
      // 搜索
      agreeStatusList: [],
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
      activeName: "tab1",
      tableData: [],
      screenData: {
        agreeStatus: "",
        cmsUserId: "",
        tmUserId: "",
        dateType: 0,
        appealStatus: 1,
        tutorUserName: "",
        studentUserName: "",
        registryTime: [],
      },
      pageObj: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      currentCallBackId: 0,
      showCallBack: false,
      currentCBclassTypeId: 0,
      DATA_TYPE,
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
      currentLang: (state) => state.app.currentLang,
    }),
  },
  watch: {
    currentLang() {
      this.initData();
      this.getTeachPerson();
    },
    // subjectType(v) {
      
    //   this.getTableData();
    // }
  },
  
  methods: {
    /* 查看教室日志 */
    viewClassRoomLog(row) {
      this.currentRow = row;
      this.showClassroomLog = true;
    },
    initData() {
      this.agreeStatusList = [
        {
          value: 0,
          name: this.$t("全部"),
        },
        {
          value: 1,
          name: this.$t("暂未同意"),
        },
        {
          value: 2,
          name: this.$t("已同意"),
        },
      ];
    },
    openTeacherComments(item) {
      this.currentItem = item;
      this.teacherCommentsDialogVisiable = true;
    },
    closeTeacherComments() {
      this.teacherComments = false;
      this.valuationrate = [];
    },
    // 课堂回放
    clickHandlerPlayback(item) {
      this.currentCallBackId = item.virtualClassId;
      this.currentCBclassTypeId = item.classTypeId;
      this.showCallBack = true;
    },
    handleCloseCallBack() {
      this.showCallBack = false;
    },
    // 改变处理类型
    changeStatus(tab) {
      this.pageObj = {
        pageNum: 1,
        pageSize: 10,
      };
      this.screenData.appealStatus = tab.name == "tab1" ? 1 : 2;
      this.getTableData();
    },
    changeRadion(val) {
      this.screenData.registryTime = [];
      this.getTableData();
    },
    changeDatePicker() {
      this.screenData.dateType = "";
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
    goToDealAppeal(item) {
      this.$router.push(
        `/appealManagement/dealAppeal?classTypeId=${item.classTypeId}&appealId=${item.appealId}&virtualClassId=${item.virtualClassId}&dataType=${this.dataType}&subjectType=${this.subjectType}`
      );
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
      let subjectType = this.subjectType;
      let { pageNum, pageSize } = this.pageObj;
      let {
        studentUserName,
        tutorUserName,
        registryTime,
        dateType,
        appealStatus,
        agreeStatus,
        cmsUserId,
        tmUserId,
      } = this.screenData;
      let params = {
        subjectType,
        studentUserName,
        tutorUserName,
        dateType,
        appealStatus,
        agreeStatus,
        cmsUserId,
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
      const url =
        this.dataType === DATA_TYPE.NEW ? "getAppealListV2" : "getAppealList";
      this.$Api.appealManagement[url](pageNum, pageSize, params)
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
          this.tableData = [];
          this.loading = false;
          this.total = 0;
        });
    },
  },
  created() {
    this.getTeachPerson();
    this.getTableData();
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
.tab-box {
  padding: 5px 10px 0 10px;
}

.introduction-wrap {
  padding: 5px;
}

.table-wrapper {
  margin-top: 20px;
  padding: 0 15px;

  .attend-table {
    border: 1px solid #f1f1f1;

    table {
      width: 100%;
    }
  }
}

.feedback-box {
  line-height: 2;
}
.appeal-list-radio{
  padding: 20px 15px 0;
}
</style>
<!-- https://test188.member.lingo-ace.com/opsapi/financeclassroom/list/correct/1/50 -->
