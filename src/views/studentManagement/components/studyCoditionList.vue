<!-- 原学生档案列表模块移入 -->
<template>
  <div class="list-wrap">
    <el-tabs
      class="top-tab"
      type="card"
      v-model="bottomTabsActive"
      @tab-click="handleClick"
    >
      <!-- 上课安排-->
      <el-tab-pane :label="$t('上课安排')" name="classArrangement">
        <ClassScheduleList
          @refreshLeaveTimes="refreshLeaveTimes"
          @refreshAdjustmentCourseTimes="handelAdjustSucess"
          :activeTab="bottomTabsActive"
          :currentCoursePkg="currentCoursePkg"
        />
      </el-tab-pane>
      <!-- 历史课堂 -->
      <el-tab-pane :label="$t('历史课堂')" name="historyClass">
        <div class="mt10">
          <el-table
            v-loading="historyLoading"
            :data="historyTableData"
            tooltip-effect="dark"
            :border="false"
            fit
            show-overflow-tooltip="true"
            style="width: 100%; margin-top: 10px"
            stripe
            :height="tableHeight"
            :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
            @sort-change="sortChange($event, 'historyClass')"
          >
            <el-table-column
              align="center"
              :label="$t('序号')"
              :width="currentLang == 'en' ? 110 : 50"
            >
              <template slot-scope="scope">
                {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="currentClassType === 2 || currentClassType === 1"
              align="center"
              :width="currentLang == 'en' ? 180 : 80"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="!scope.row.enterTime && !scope.row.leaveTime"
                  type="warning"
                  >{{ $t("缺") }}</el-tag
                >
                <el-tag
                  v-if="scope.row.isLeave == 1 && currentClassType === 2"
                  size="mini"
                  >{{ $t("假") }}</el-tag
                >
                <el-tag
                  type="success"
                  size="mini"
                  v-if="
                    scope.row.isRepair == 1 &&
                    scope.row.usageType == 2 &&
                    currentClassType === 2
                  "
                  >{{ $t("异常补课") }}</el-tag
                >
                <el-tag
                  v-if="
                    scope.row.isSubstitute == 1 &&
                    (currentClassType === 1 || currentClassType === 2)
                  "
                  type="warning"
                  size="mini"
                  >{{ $t("代") }}</el-tag
                >
                <el-tag
                  v-if="
                    scope.row.isRepair == 1 &&
                    (currentClassType === 1 || currentClassType === 2)
                  "
                  type="error"
                  size="mini"
                  >{{ $t("调") }}</el-tag
                >
                <el-tag
                  v-show="
                    scope.row.classTagDesc &&
                    scope.row.classTagDesc.length
                  "
                  style="
                    color: #37c0f9;
                    background-color: #e6faff;
                    border-color: #c4f2ff;
                  "
                  size="mini"
                  plain
                  >{{ scope.row.classTagDesc }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('上课时间')"
              prop="name"
              min-width="150"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{
                  DateTimeUtils.dateClockTime(scope.row.startTime)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('班级')"
              prop="classNameZh"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.classNameZh">{{
                  scope.row.classNameZh
                }}</span>
                <span v-else>---</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('my-home-Teacher\'s Name')"
              prop="tutorRealName"
              min-width="120"
            >
              <template slot-scope="scope">
                <router-link
                  target="_blank"
                  :to="{
                    path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.tutorRealName}`,
                  }"
                >
                  <el-button type="text">{{
                    scope.row.tutorRealName
                  }}</el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('教师ID')" width="180">
              <template slot-scope="scope">
                <span type="text">{{ scope.row.tutorUserId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('my-home-Curriculum')"
              prop="lessonDescription"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.lessonDescEN || scope.row.lessonDescZH">{{
                  currentLang === "en"
                    ? scope.row.lessonDescEN
                    : scope.row.lessonDescZH
                }}</span>
                <span v-else>---</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              :label="$t('上课平台')"
              prop="name"
              min-width="120"
            >
              <template slot-scope="scope">
                <span>{{
                  Filters.virtualclassType(
                    scope.row.virtualclassTypeId,
                    currentLang
                  )
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('房间号')" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.roomId || "---" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('课堂状态')"
              prop="name"
              :width="currentLang == 'en' ? 120 : 100"
            >
              <template slot-scope="scope">
                <span>{{
                  Filters.courseStatus(scope.row.status, currentLang)
                }}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column width="180" align="center" :label="$t('操作')">
              <template slot-scope="scope">
                <!-- 回放 -->
                <el-button
                  v-if="
                    scope.row.replayStatus !== PLAY_BACK_TYPES.DELETE &&
                    scope.row.replayStatus !== PLAY_BACK_TYPES.EMPTY
                  "
                  :disabled="
                    scope.row.replayStatus === PLAY_BACK_TYPES.ACTIVING
                  "
                  type="text"
                  @click="
                    clickHandlerPlayback(
                      scope.row.virtualClassId,
                      scope.row.replayStatus
                    )
                  "
                >
                  <span
                    v-if="scope.row.replayStatus === PLAY_BACK_TYPES.TO_ACTIVE"
                    >{{ $t("激活回放") }}</span
                  >
                  <span
                    v-else-if="scope.row.replayStatus === PLAY_BACK_TYPES.ABLE"
                    >{{ $t("回放") }}</span
                  >
                  <span
                    v-else-if="
                      scope.row.replayStatus === PLAY_BACK_TYPES.ACTIVING
                    "
                    >{{ $t("激活中") }}</span
                  >
                </el-button>
                <!-- 本课小结 -->
                <el-button
                  type="text"
                  @click="
                    clickHandlerComment(
                      scope.row.virtualClassId,
                      'Student',
                      scope.row
                    )
                  "
                >
                  {{ $t("本课小结") }}
                </el-button>
                <!-- 查看作业 -->
                <el-button
                  v-if="currentClassType !== 3"
                  type="text"
                  @click="checkHomework(scope.row)"
                >
                  {{ $t("查看作业") }}
                </el-button>
                <!-- 首课反馈 -->
                <el-button
                  :disabled="!scope.row.firstReportId"
                  type="text"
                  @click="handleGoFirstCallback(scope.row)"
                  >{{ $t("首课反馈") }}</el-button
                >
                <el-button
                  type="text"
                  @click="clickMyHighlight(scope.row)"
                  v-if="scope.row.momentsStatus === 1"
                  >{{ $t("my-highlight") }}</el-button
                >
                <el-button type="text" @click="viewClassRoomLog(scope.row)">{{
                  $t("教室时间轴")
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <custom-pagination
            :total="historyClassTotal"
            :current-page="pageNum"
            @getCurrentPage="getCurrentPage"
            @getPerPage="getPerPage"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('操作明细')" name="operateDetail">
        <span slot="label">{{ $t("操作明细") }}</span>
        <OperateDetails
          :id="studentId"
          :userRole="2"
          :currentCoursePkg="currentCoursePkg"
          :activeTab="bottomTabsActive"
        ></OperateDetails>
      </el-tab-pane>
    </el-tabs>
    <!-- 回放 -->
    <ClassCallBack
      :classType="currentCBclassTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="showCallBack = false"
    >
    </ClassCallBack>
    <!-- 老师评语和学生反馈-本课小结 -->
    <TeacherComments
      v-if="teacherComments"
      :teacherComments="teacherComments"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentFeedback="studentFeedback"
      :titleName="titleName"
      @getTableData="getHistoryClassTableData"
      @closeTeacherComments="closeTeacherComments"
    ></TeacherComments>
    <el-dialog
      width="500px"
      :title="$t('试听课反馈暂未提交')"
      :visible.sync="showStudentLevelDialog"
      append-to-body
    >
      <div style="font-size: 16px">
        {{ $t("老师建议级别") }}：{{ studentLevel }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showStudentLevelDialog = false">
          {{ $t("知道了") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="classroomLogDialogVisible"
      width="680px"
      append-to-body
    >
      <ClassRoomLog
        :classTypeId="currentCoursePkg.classType"
        :virtualclassId="currentRow.virtualClassId"
        v-if="classroomLogDialogVisible"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="classroomLogDialogVisible = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  computed,
  reactive,
  onMounted,
  ref,
  watch,
  toRefs,
} from "@vue/composition-api";
import OperateDetails from "../subPage/operateDetails.vue";
import ClassCallBack from "@/components/ClassCallBack";
import TeacherComments from "@/views/myWorkbench/components/teacherComments";
import { PLAY_BACK_TYPES } from "@/utils/constants";
import { getFirstClassFeedbackDetails } from "@/api/unitReportManagement/";
import ClassScheduleList from "./ClassScheduleList.vue";
import { getPlatformInfo } from "@lingoace/environment-lingoace"; //环境变量sdk
import ClassRoomLog from "@/views/classManagement/components/ClassRoomLog.vue";

export default {
  props: {
    studentInfo: {
      type: Object,
      default: {},
    },
    currentCoursePkg: {
      type: Object,
      default: {
        packageId: -1,
        packageName: "",
      },
    },
    situationInfo: {
      type: Object,
      default: {}, // 学习情况信息
    },
    // 学科类型：0-中文，1-英文，2-数学，3-音乐
    courseType: {
      type: Number,
      default: -1,
    },
  },
  components: {
    OperateDetails,
    ClassCallBack,
    TeacherComments,
    ClassScheduleList,
    ClassRoomLog,
  },
  setup(props, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
    const currentLang = computed(() => root.$store.getters.currentLang);
    const studentId = ref(-1);
    const loadState = reactive({
      historyLoading: false,
    });
    const showStudentLevelDialog = ref(false);
    const versions = ref("");
    const studentLevel = ref("");
    const optRow = ref({});
    const currentCBclassTypeId = ref(0);
    const currentClassType = ref(-1);
    const currentCallBackId = ref(0);
    const studentFeedback = ref(true); // 学生反馈
    const historyActiveIndex = ref(1);
    const classroomLogDialogVisible = ref(false);
    const currentRow = ref(null); // 表格当前选中行

    const commentData = reactive({
      // 本课小结相关数据
      valuationrate: {
        comment: [], // 评价
        valuation: [], // 评分
      },
      teacherComments: false,
      titleName: "",
      teacherInfo: {
        teacherName: "",
        classTime: "",
        classType: "",
        course: "",
      },
    });
    const tableData = reactive({
      historyTableData: [],
    });
    const activeTabs = reactive({
      bottomTabsActive: "classArrangement",
    });
    const historyClassScreen = reactive({
      pageNum: 1,
      pageSize: 50,
      startTimeOrder: "desc",
      historyClassTotal: 0,
    });
    const showState = reactive({
      showCallBack: false, // 回放
      commentsLoading: false, //本课小结
    });

    let classType;
    watch(
      () => props.currentCoursePkg,
      (pkg) => {
        currentClassType.value = pkg.classType;
        classType = pkg.classType;
        if (classType && activeTabs.bottomTabsActive === "historyClass") {
          getHistoryClassTableData();
        }
        if (!classType) {
          tableData.historyTableData = [];
        }
      },
      { deep: true }
    );

    // 关闭老师评价 dialog
    const closeTeacherComments = () => {
      commentData.teacherComments = false;
      commentData.valuationrate = [];
    };

    // 查看作业
    const checkHomework = (row) => {
      let lessonName =
        currentLang.value === "en" ? row.lessonDescEN : row.lessonDescZH;
      const url = `/studentManagement/homeworkView?lessonId=${row.lessonId}&virtualClassId=${row.virtualClassId}&tabName=teachRecord&studentUserId=${studentId.value}&classTypeId=${currentClassType.value}&studentName=${props.studentInfo.studentName}&lessonName=${lessonName}&subjectType=${props.courseType}`;
      window.open(url, "_blank");
    };
    /**
     * 获取历史课堂
     */
    const getHistoryClassTableData = () => {
      if (!classType || classType === -1) {
        tableData.historyTableData = [];
        historyClassScreen.historyClassTotal = 0;
        loadState.historyLoading = false;
        return;
      }
      const {
        currentCoursePkg: { packageId },
      } = props;
      let apiName = null;
      if (classType == 1) {
        apiName = "getStudentHisClassOneClass";
      } else if (classType == 2) {
        apiName = "getStudentHisClassSmallClass";
      } else if (classType == 3) {
        apiName = "getStudentHisClassBigClass";
      }
      let { pageNum, pageSize, startTimeOrder } = historyClassScreen;
      loadState.historyLoading = true;
      root.$Api.studentManagement[apiName](
        studentId.value,
        pageNum,
        pageSize,
        packageId,
        startTimeOrder
      )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            tableData.historyTableData = data.data.list;
            historyClassScreen.historyClassTotal = data.data.total;
            loadState.historyLoading = false;
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          tableData.historyTableData = [];
          historyClassScreen.historyClassTotal = 0;
          loadState.historyLoading = false;
        });
    };
    // 跳转首课反馈页面
    const handleGoFirstCallback = async (item) => {
      const {
        status,
        data: { code, data },
      } = await getFirstClassFeedbackDetails(item.firstReportId, classType);
      if (status !== 200 || code !== 200) return Promise.reject();
      switch (data.firstReportDetail.status) {
        case 0:
          studentLevel.value =
            data.firstReportDetail?.suggestInfo || root.$t("无");
          showStudentLevelDialog.value = true;
          break;
        case 1:
          // 已提交未审核
          window.open(
            `/reportManagement/feedbackAudited?reportId=${item.firstReportId}&classTypeId=${classType}`,
            "_blank"
          );
          break;
        case 2:
          // 审核不通过
          window.open(
            `/reportManagement/feedbackAuditFailed?reportId=${item.firstReportId}&classTypeId=${classType}`,
            "_blank"
          );
          break;
        case 3:
          // 审核通过已发送
          window.open(
            `/reportManagement/feedbackAuditSuccessed?reportId=${item.firstReportId}&classTypeId=${classType}`,
            "_blank"
          );
          break;
        case 4:
          // 审核通过未发送
          window.open(
            `/reportManagement/feedbackAudited?reportId=${item.firstReportId}&classTypeId=${classType}`,
            "_blank"
          );
          break;
        default:
          break;
      }
    };

    const clickMyHighlight = (row) => {
      const { momentsUrl } = row;
      if (typeof momentsUrl !== "string" || momentsUrl.length === 0) {
        console.error("无效的精彩瞬间链接地址", row);
        throw new Error();
      }

      const urlParam = encodeURIComponent(momentsUrl);
      root.$router.push(`/work/myHighlight?url=${urlParam}`);
    };
    // 课堂回放
    const clickHandlerPlayback = (virtualclassId, playbackStatus) => {
      if (playbackStatus === PLAY_BACK_TYPES.ABLE) {
        currentCBclassTypeId.value = classType;
        currentCallBackId.value = virtualclassId;
        showState.showCallBack = true;
      } else if (playbackStatus === PLAY_BACK_TYPES.TO_ACTIVE) {
        // const isCurrentXgOrGw = userId === props.situationInfo.xgUserId || userId === props.situationInfo.counselorId
        // if (!isCurrentXgOrGw) return root.$notify.warning(root.$t('您没有操作权限'))
        root.$Api.base
          .activeReplay(classType, virtualclassId, userId, 5)
          .then(({ status, data: { data, code } }) => {
            if (status !== 200 || code !== 200) return Promise.reject();
            getHistoryClassTableData();
            return root.$notify.warning(root.$t("操作成功"));
          });
      }
    };

    // 本课小结
    const clickHandlerComment = (virtualClassId, target, obj) => {
      commentData.teacherInfo.teacherName = obj.tutorRealName;
      commentData.teacherInfo.classTime = root.DateTimeUtils.dateClockTime(
        obj.startTime
      );
      if (classType === 1) {
        commentData.teacherInfo.classType = "1对1";
      } else if (classType === 2) {
        commentData.teacherInfo.classType = "小班课";
      } else if (classType === 3) {
        commentData.teacherInfo.classType = "大班课";
      }
      commentData.teacherInfo.course = {
        lessonDescEN: obj.lessonDescEN,
        lessonDescZH: obj.lessonDescZH,
      };
      studentFeedback.value = target === "Student";
      commentData.titleName =
        target === "Student"
          ? root.$t("本课小结")
          : root.$t("my-home-Student Feedback");

      showState.commentsLoading = true;
      root.$Api.classManagement
        .virtualclassComment(virtualClassId, target)
        .then((res) => {
          showState.commentsLoading = false;
          commentData.valuationrate = res.data.data || [];
          commentData.teacherComments = true;
        });
    };

    const getCurrentPage = (page) => {
      historyClassScreen.pageNum = page;
      getHistoryClassTableData();
    };

    const getPerPage = (perPage) => {
      historyClassScreen.pageSize = perPage;
      getHistoryClassTableData();
    };

    const refreshLeaveTimes = (e) => {
      emit("refreshLeaveTimes");
    };

    const handleClick = (e) => {
      if (e.index === "1") {
        getHistoryClassTableData();
      }
    };

    //上课安排 历史课堂
    const sortChange = (column, name) => {
      if (column.prop === "name" && column.order === "ascending") {
        // 升序
        historyClassScreen.startTimeOrder = "asc";
      } else if (column.prop === "name" && column.order === "descending") {
        // 降序
        historyClassScreen.startTimeOrder = "desc";
      } else {
        return;
      }
      historyClassScreen.pageNum = 1;
      getHistoryClassTableData();
    };

    const handelAdjustSucess = () => {
      emit("refreshAdjustmentCourseTimes");
    };

    function viewClassRoomLog(row) {
      currentRow.value = row;
      classroomLogDialogVisible.value = true;
    }

    onMounted(() => {
      if (root.$route.query.studentId) {
        window.sessionStorage.setItem("student", root.$route.query.studentId);
        studentId.value = root.$route.query.studentId;
      } else {
        studentId.value = window.sessionStorage.getItem("student");
      }
      if (root.$route.query.fromMC) {
        activeTabs.bottomTabsActive = "operateDetail";
      }
    });

    return {
      showStudentLevelDialog,
      studentLevel,
      currentLang,
      studentId,
      optRow,
      PLAY_BACK_TYPES,
      currentCBclassTypeId,
      currentClassType,
      currentCallBackId,
      studentFeedback,
      historyActiveIndex,
      versions,
      ...toRefs(historyClassScreen),
      ...toRefs(activeTabs),
      ...toRefs(tableData),
      ...toRefs(showState),
      ...toRefs(commentData),
      ...toRefs(loadState),
      refreshLeaveTimes,
      handleClick,
      getCurrentPage,
      getPerPage,
      sortChange,
      getHistoryClassTableData,
      clickHandlerPlayback,
      clickHandlerComment,
      closeTeacherComments,
      checkHomework,
      handleGoFirstCallback,
      clickMyHighlight,
      handelAdjustSucess,
      tableHeight:
        getPlatformInfo().os === "Mac OS" ? window.innerHeight - 300 : "310px",
      currentRow,
      classroomLogDialogVisible,
      viewClassRoomLog,
    };
  },
};
</script>
<style scoped lang="scss">
.info-wrap {
  display: flex;
  flex-wrap: wrap;
  .wh50 {
    width: 50%;
  }
  li {
    width: 400px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 24px;

    .label {
      display: inline-block;
      position: relative;
      margin-right: 30px;
    }
    .w100 {
      width: 60%;
    }
  }
}
.list-wrap {
  // height:calc(100vh - 300px);
  width: 100%;
  overflow: auto;
  // padding-bottom: 150px;
}

.leave-dialog {
  .el-row {
    margin-bottom: 10px;
  }
}
::v-deep .top-tab > .el-tabs__header:first-child {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #fff;
}
.emao-pagination {
  margin-top: 10px;
  margin-bottom: 0px;
}
</style>
