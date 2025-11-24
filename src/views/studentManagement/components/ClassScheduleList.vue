<template>
  <div class="box-card-class-table mt10">
    <el-button
      class="fr mb10"
      v-if="
        currentClassType === 1 &&
        Per.handleButtonPer(
          'teach.studentMT.studentInfo.sisfStudentFiles.cancelCourse'
        )
      "
      :disabled="!timetableIdList.length"
      type="primary"
      @click="showBatcCancelDialog = true"
      >{{ $t("批量取消") }}</el-button
    >
    <el-table
      v-loading="classLoading"
      :data="classAttendTableData"
      tooltip-effect="dark"
      :border="false"
      fit
      row-key="timetableId"
      show-overflow-tooltip="true"
      style="width: 100%; margin-top: 10px"
      stripe
      :height="tableHeight"
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      @sort-change="sortChange($event)"
      @selection-change="changeSelection"
      :key="keyIndex"
    >
      <el-table-column
        v-if="
          currentClassType === 1 &&
          Per.handleButtonPer(
            'teach.studentMT.studentInfo.sisfStudentFiles.cancelCourse'
          )
        "
        type="selection"
        width="55"
      />
      <el-table-column align="center" :label="$t('序号')" :width="50">
        <template slot-scope="scope">
          {{ (classPageNum - 1) * classPageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-show="currentClassType === 2"
        align="center"
        :width="currentLang == 'en' ? 160 : 160"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isLeave == 1" size="mini">{{
            $t("假")
          }}</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.usageType == 2">{{
            $t("异常补课")
          }}</el-tag>
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
            v-if="currentClassType === 1 && scope.row.timetableStatus === 3"
            style="color: #ffa13c"
            size="mini"
            >{{ $t("预占") }}</el-tag
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
        min-width="230"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span
            >{{ DateTimeUtils.dateClockTime(scope.row.startTime) }} （{{
              $t(moment(scope.row.startTime).format("dddd"))
            }}）</span
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('用户本地上课时间')"
        prop="name"
        min-width="220"
      >
        <template slot-scope="scope">
          <span v-if="!userTimeZone">{{ $t("无约课时区") }}</span>
          <span v-else
            >{{ toUserTimeZoneTime(userTimeZone, scope.row.startTime) }} ({{
              $t(
                moment.utc(scope.row.startTime).tz(userTimeZone).format("dddd")
              )
            }})</span
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        v-if="currentClassType == 2"
        :label="$t('班级')"
        prop="classNameZh"
        min-width="150"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.classNameZh">{{ scope.row.classNameZh }}</span>
          <span v-else>--</span>
          {{ currentClassType }}
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
            <el-button type="text">{{ scope.row.tutorRealName }}</el-button>
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
        prop="name"
        min-width="250"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.lessonDescEN || scope.row.lessonDescZH">{{
            currentLang === "en"
              ? scope.row.lessonDescEN
              : scope.row.lessonDescZH
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('上课平台')"
        prop="name"
        min-width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.virtualclassTypeId">{{
            Filters.virtualclassType(scope.row.virtualclassTypeId, currentLang)
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('房间号')"
        :width="150"
        prop="roomId"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('my-home-1-Class Type')"
        min-width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.courseType === 0">{{ $t("试听课") }}</span>
          <span v-else-if="scope.row.courseType === 1">{{ $t("正式课") }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('课堂状态')"
        prop="name"
        :width="currentLang == 'en' ? 120 : 100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status">{{
            Filters.courseStatus(scope.row.status, currentLang)
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        align="center"
        fixed="right"
        prop=""
        :label="$t('操作')"
        :width="currentLang == 'en' ? 220 : 180"
      >
        <template slot-scope="scope">
          <!-- 旁听 -->
          <el-button
            v-if="scope.row.status == 2"
            type="text"
            @click="clickHandlerMonitor(scope.row.virtualClassId)"
          >
            {{ $t("旁听") }}</el-button
          >
          <!-- 退出班级 -->
          <el-button
            type="text"
            v-if="scope.row.isShowButtonOut == 1"
            @click="clickHandlerLeave(scope.row, 1)"
            >{{ $t("退出班级") }}
          </el-button>
          <!-- 请假-->
          <el-button
            v-if="
              currentClassType === 2 &&
              Per.handleButtonPer(
                'teach.studentMT.studentInfo.sisfStudentFiles.leaveClassPermission'
              )
            "
            type="text"
            @click="clickHandlerLeave(scope.row, 2)"
            >{{ $t("请假") }}
          </el-button>
          <!-- 调课 -->
          <el-button
            v-if="
              currentClassType === 2 &&
              Per.handleButtonPer(
                'teach.studentMT.studentInfo.sisfStudentFiles.adjustClassPermission'
              )
            "
            type="text"
            @click="clickHandlerLeave(scope.row, 3)"
            >{{ $t("调课") }}
          </el-button>
          <el-button
            v-if="
              currentClassType === 1 &&
              Per.handleButtonPer(
                'teach.studentMT.studentInfo.sisfStudentFiles.adjustClassPermission'
              )
            "
            type="text"
            @click="handelOpenTeacherTimeTable(scope.row)"
            >{{ $t("调课") }}
          </el-button>
          <el-button
            v-if="
              currentClassType === 1 &&
              Per.handleButtonPer(
                'teach.studentMT.studentInfo.sisfStudentFiles.cancelCourse'
              )
            "
            type="text"
            @click="handelCancelCourse(scope.row)"
            >{{ $t("取消课程") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      v-show="classBeginsTotal > 0"
      :total="classBeginsTotal"
      :pageSizes="[10, 20, 50, 100]"
      :current-page="classPageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <!-- 小班课请假dialog -->
    <el-dialog
      :title="$t('小班课请假')"
      :visible.sync="showLeaveDialog"
      width="600px"
      @close="leaveReason = ''"
    >
      <div class="leave-dialog">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("班级名称") }}</el-col>
              <el-col :span="16">{{ optRow.classNameZh }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("上课时间") }}</el-col>
              <el-col :span="16">{{
                DateTimeUtils.dateClockTime(optRow.startTime)
              }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("课程") }}</el-col>
              <el-col :span="16">
                {{
                  currentLang === "en"
                    ? optRow.lessonDescEN
                    : optRow.lessonDescZH
                }}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("老师") }}</el-col>
              <el-col :span="16">{{ optRow.tutorRealName }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">{{ $t("请假理由") }}</el-col>
          <el-col :span="16">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="500"
              :placeholder="$t('请输入请假理由')"
              v-model="leaveReason"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLeaveDialog = false">{{ $t("取消") }}</el-button>
        <el-button
          type="primary"
          :disabled="leaveReason.length < 1"
          @click="reqLeave"
          >{{ $t("确定请假") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 小班课退出班级dialog -->
    <el-dialog
      :title="$t('退出班级')"
      :visible="showSignoutDialog"
      width="600px"
      @close="(removeReason = ''), (showSignoutDialog = false)"
    >
      <div class="leave-dialog">
        <el-row>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("班级名称") }}</el-col>
              <el-col :span="16">{{ optRow.classNameZh }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">{{ $t("退班理由") }}</el-col>
          <el-col :span="16">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="500"
              :placeholder="$t('请输入退班理由')"
              v-model="removeReason"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSignoutDialog = false">{{
          $t("取消")
        }}</el-button>
        <el-button
          :disabled="removeReason.length < 1"
          type="primary"
          @click="reqRemove"
          >{{ $t("确定退出") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 小班课调课弹窗 -->
    <SmallClassAdjustDialog
      @close="showAdjustmentDialog = false"
      v-if="showAdjustmentDialog"
      :show="showAdjustmentDialog"
      :studentId="studentId"
      :adjustVirtualclassId="optRow.virtualClassId"
      @success="
        () => {
          getClassBeginsTableData();
          handelAdjustSucess();
        }
      "
    />
    <CancelClassDialog
      @resetCalender="
        () => {
          getClassBeginsTableData();
        }
      "
      v-if="showCancelDialog"
      :cancelInfo="cancelInfo"
      :show="showCancelDialog"
      @closeCancelClassDialog="showCancelDialog = false"
      :startTimes="startTimes"
    ></CancelClassDialog>
    <el-drawer
      :visible.sync="showTeacherTimeTable"
      append-to-body
      direction="btt"
      :before-close="handleCloseTeacherTimeTable"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :destroy-on-close="true"
      :title="$t('确定调课信息')"
    >
      <BookTeacherTime
        class="teacher-table-warp"
        v-if="teacherState"
        :teacherName="teacherState.realName"
        :teacherId="teacherState.tutorUserId"
        :showTeacherTimetable="showTeacherTimetable"
        :rowData="optRow"
        :coursePackageId="currentCoursePkg.packageId"
        @goBack="showTeacherTimeTable = false"
      />
    </el-drawer>
    <BatcCancel
      @resetCalender="
        () => {
          getClassBeginsTableData();
        }
      "
      v-if="showBatcCancelDialog"
      :timetableIdList="timetableIdList"
      :show="showBatcCancelDialog"
      :currentCoursePkg="currentCoursePkg"
      @closeCancelClassDialog="showBatcCancelDialog = false"
      @success="
        () => {
          classPageNum = 1;
          getClassBeginsTableData();
        }
      "
    ></BatcCancel>
  </div>
</template>
<script>
import {
  reactive,
  onMounted,
  ref,
  watch,
  toRefs,
  unref,
  computed,
} from "@vue/composition-api";
import SmallClassAdjustDialog from "@/views/studentManagement/subPage/smallClassAdjustDialog.vue";
import { removeSmallClassStudent } from "@/api/groupManagement";
import { ABNORMAL_CODE } from "@/utils/constants";
import { reqStudentLeave } from "@/api/studentManagement";
import { virtualclassMonitor } from "@/api/classManagement/";
import CancelClassDialog from "@/views/studentManagement/subPage/CancelClassDialog.vue";
import { getPlatformInfo } from "@lingoace/environment-lingoace"; //环境变量sdk
import BookTeacherTime from "@/views/scheduleManagement/teacherTime/BookTeacherTime.vue";
import BatcCancel from "@/views/scheduleManagement/cancelClass/BatcCancel.vue";
import {
  operationScheduleType,
  bookCoursePackageInfo,
} from "@/views/scheduleManagement/teacherTime/bookCurriculum.js";
import moment from "moment";
import { filterZoneName, toUserTimeZoneTime } from "@/utils/timeZone";

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
    activeTab: {
      type: String,
      default: () => "",
    },
  },
  components: {
    SmallClassAdjustDialog,
    CancelClassDialog,
    BookTeacherTime,
    BatcCancel,
  },
  setup(props, { root, emit }) {
    /* 1v1调课逻辑start */
    const showTeacherTimeTable = ref(false);
    const teacherState = ref({
      tutorUserId: "",
      realName: "",
    });
    const currentLang = computed(() => root.$store.getters.currentLang);
    const handelOpenTeacherTimeTable = async (row) => {
      await root.$Api.classManagement.reqOtoAdjustCheck(row.timetableId);
      optRow.value = row;
      teacherState.value.tutorUserId = row.tutorUserId;
      teacherState.value.realName = row.tutorRealName;
      operationScheduleType.value = "adjustOneClass";
      bookCoursePackageInfo.value = {
        nameZh: props.currentCoursePkg.packageNameZH,
        nameEn: props.currentCoursePkg.packageNameEn,
        packageId: props.currentCoursePkg.packageId,
        classType: props.currentCoursePkg.classType,
      };
      showTeacherTimeTable.value = true;
    };
    const handleCloseTeacherTimeTable = () => {
      showTeacherTimeTable.value = false;
      teacherState.value = {};
    };

    /* 1v1调课逻辑end */

    const studentId = ref(-1);
    const currentClassType = ref(-1);
    const tableData = reactive({
      classAttendTableData: [],
      historyTableData: [],
    });
    const loadState = reactive({
      classLoading: false,
      historyLoading: false,
    });
    const classBeginsScreen = reactive({
      classPageNum: 1,
      classPageSize: 50,
      classStartTimeOrder: "",
      classBeginsTotal: 0,
    });
    /** 获取上课安排列表 */
    const getClassBeginsTableData = () => {
      if (!classType || classType === -1) {
        tableData.classAttendTableData = [];
        classBeginsScreen.classBeginsTotal = 0;
        loadState.classLoading = false;
        return;
      }
      const {
        currentCoursePkg: { packageId },
      } = props;
      let apiName = null;
      if (classType == 1) {
        apiName = "getStudentAttendClassOneClass";
      } else if (classType == 2) {
        apiName = "getStudentAttendClassSmallClass";
      } else if (classType == 3) {
        apiName = "getStudentAttendClassBigClass";
      }
      loadState.classLoading = true;
      root.$Api.studentManagement[apiName](
        studentId.value,
        classBeginsScreen.classPageNum,
        classBeginsScreen.classPageSize,
        packageId,
        classBeginsScreen.classStartTimeOrder
      )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            tableData.classAttendTableData = data.data.list;
            classBeginsScreen.classBeginsTotal = data.data.total;
            loadState.classLoading = false;
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          classBeginsScreen.classBeginsTotal = 0;
          tableData.classAttendTableData = [];
          loadState.classLoading = false;
        });
    };
    let classType;
    const keyIndex = ref(0);
    watch(
      () => props.currentCoursePkg,
      (pkg) => {
        currentClassType.value = pkg.classType;
        root.$forceUpdate();
        keyIndex.value++;
        classType = pkg.classType;
        if (classType) {
          getClassBeginsTableData();
        } else {
          tableData.classAttendTableData = [];
          tableData.historyTableData = [];
        }
      },
      { deep: true }
    );
    watch(
      () => props.activeTab,
      (val) => {
        getClassBeginsTableData();
      },
      { deep: true }
    );
    const getCurrentPage = (page) => {
      classBeginsScreen.classPageNum = page;
      getClassBeginsTableData();
    };
    const getPerPage = (perPage) => {
      classBeginsScreen.classPageSize = perPage;
      getClassBeginsTableData();
    };
    onMounted(() => {
      if (root.$route.query.studentId) {
        window.sessionStorage.setItem("student", root.$route.query.studentId);
        studentId.value = root.$route.query.studentId;
      } else {
        studentId.value = window.sessionStorage.getItem("student");
      }
      getClassBeginsTableData();
    });
    /* 操作 */
    const clickHandlerMonitor = (virtualclassId) => {
      /* 旁听 */
      virtualclassMonitor(currentClassType.value, virtualclassId).then(
        ({ status, data }) => {
          if (status == 200 && data.code == 200) {
            console.log(`${data.data.entryPath}?subRole=2`);
            window.open(`${data.data.entryPath}?subRole=2`, "_blank");
          }
        }
      );
    };
    const showState = reactive({
      showSignoutDialog: false, // 退出班级
      showLeaveDialog: false, //请假
      showAdjustmentDialog: false, //调课
    });
    const optRow = ref({});
    const checkLeaveClassPermission = async (sid, classId) => {
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.checkBeforeLeaveClass(sid, classId);
      if (status !== 200 || code !== 200) return Promise.reject();
      return Promise.resolve();
    };
    // 操作请假，调课，退出班级
    const clickHandlerLeave = (row, key) => {
      optRow.value = row;
      switch (key) {
        case 1: //退出班级
          showState.showSignoutDialog = true;
          break;
        case 2: //请假
          checkLeaveClassPermission(unref(studentId), row.virtualClassId).then(
            () => {
              showState.showLeaveDialog = true;
            }
          );
          break;
        case 3: //调课
          checkAdjustCoursePermission(
            unref(studentId),
            row.virtualClassId
          ).then(() => {
            showState.showAdjustmentDialog = true;
          });
          break;
      }
    };
    const checkAdjustCoursePermission = async (sid, classId) => {
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.checkBeforeAdjustCourse(
        sid,
        classId
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      return Promise.resolve();
    };
    const handelAdjustSucess = () => {
      emit("refreshAdjustmentCourseTimes");
    };
    const reason = reactive({
      removeReason: "", //退班理由
      leaveReason: "", //请假理由
    });
    const reqLeave = () => {
      let reqData = {
        reason: reason.leaveReason,
        classId: optRow.value.classId,
        studentUserId: studentId.value * 1,
        virtualclassId: optRow.value.virtualClassId,
      };
      reqStudentLeave(reqData).then(({ status, data: { code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject();
        root.$notify({
          message: root.$t("请假成功"),
          type: "success",
        });
        emit("refreshLeaveTimes");
        showState.showLeaveDialog = false;
        getClassBeginsTableData();
      });
    };
    //退班
    const reqRemove = () => {
      let reqData = {
        reason: reason.removeReason,
        classId: optRow.value.classId,
        studentId: studentId.value,
      };
      removeSmallClassStudent(reqData).then((res) => {
        if (res.data.code === ABNORMAL_CODE.hasCourseIn2HourCode) {
          return root.$notify({
            message: root.$t(
              "学生当前班级在2h内有未完成的课程，无法退出或转班"
            ),
            type: "error",
          });
        }
        if (res.status == 200 && res.data.code == 200) {
          root.$notify({
            message: root.$t("退班成功"),
            type: "success",
          });
          showState.showSignoutDialog = false;
          getClassBeginsTableData();
        }
      });
    };
    const sortChange = (column) => {
      if (column.prop === "name" && column.order === "ascending") {
        // 升序
        classBeginsScreen.classStartTimeOrder = "asc";
      } else if (column.prop === "name" && column.order === "descending") {
        // 降序
        classBeginsScreen.classStartTimeOrder = "desc";
      } else {
        return;
      }
      classBeginsScreen.classPageNum = 1;
      getClassBeginsTableData();
    };
    const userTimeZone = computed(() => root.$store.getters.userTimeZone);
    const cancelInfo = reactive({
      startTimeUTC: "",
      tutorRealName: "",
      tutorUserId: "",
      studentName: "",
      coursePackageId: "",
    });
    const startTimes = ref(new Date());
    const showCancelDialog = ref(false);
    const handelCancelCourse = (row) => {
      /* 取消课程 */
      if (!userTimeZone.value || !userTimeZone.value.length) {
        hasNoTimeZoneTips();
        return;
      }
      cancelInfo.startTime = row.startTime;
      cancelInfo.startTimeUTC = row.startTime;
      cancelInfo.tutorRealName = row.tutorRealName;
      cancelInfo.tutorUserId = row.tutorUserId;
      cancelInfo.studentName = root.$route.query.studentName;
      cancelInfo.coursePackageId = props.currentCoursePkg.packageId;
      startTimes.value = row.startTime;
      showCancelDialog.value = true;
    };
    const hasNoTimeZoneTips = () => {
      return root
        .$confirm(
          root.$t("请先在家长信息页面完善用户约课时区"),
          root.$t("提示"),
          {
            showCancelButton: false,
            confirmButtonText: root.$t("知道了"),
            type: "warning",
            center: true,
          }
        )
        .then(() => {})
        .catch(() => {});
    };
    /* 非固定取消课程 */
    const timetableIdList = ref([]);
    const changeSelection = (rows) => {
      timetableIdList.value = rows.map((item) => {
        return item.timetableId;
      });
    };
    const showBatcCancelDialog = ref(false);
    return {
      studentId,
      tableHeight:
        getPlatformInfo().os === "Mac OS" ? window.innerHeight - 340 : "310px",
      ...toRefs(tableData),
      ...toRefs(loadState),
      ...toRefs(classBeginsScreen),
      currentClassType,
      getCurrentPage,
      getPerPage,
      clickHandlerMonitor,
      clickHandlerLeave,
      ...toRefs(showState),
      ...toRefs(reason),
      reqLeave,
      optRow,
      getClassBeginsTableData,
      handelAdjustSucess,
      reqRemove,
      sortChange,
      handelCancelCourse,
      cancelInfo,
      showCancelDialog,
      startTimes,
      showTeacherTimeTable,
      handelOpenTeacherTimeTable,
      handleCloseTeacherTimeTable,
      teacherState,
      changeSelection,
      showBatcCancelDialog,
      timetableIdList,
      moment,
      currentLang,
      userTimeZone: computed(() => root.$store.getters.userTimeZone),
      toUserTimeZoneTime,
      keyIndex,
    };
  },
};
</script>
<style scoped lang="scss">
.box-card-class-table {
  height: 100vh;
  overflow-y: scroll;
  .my-table {
    height: calc(100vh - 350px);
  }
}
.emao-pagination {
  margin-top: 10px;
  margin-bottom: 0px;
}
</style>
