<template>
  <div
    class="student-info-wrap"
    :class="{ w70b: isShowFollowIn && taskCode != '104101' }"
  >
    <template>
      <div v-if="status === 3" class="delete-account">
        {{ $t("该用户已删除") }}
      </div>
      <div v-else v-loading="loading">
        <el-alert
          :title="$t('该账号申请删除中，请勿操作！')"
          type="warning"
          show-icon
          :closable="false"
          v-if="deleteApplyStatus"
          style="margin-bottom: 10px"
        >
        </el-alert>
        <div class="student-info-in">
          <BookCourses
            style="
              float: right;
              z-index: 10;
              position: relative;
              margin-left: 10px;
            "
            v-if="studentInfo"
            @closeBookCourses="initCanlender"
            :studentInfo="studentInfo"
          />
          <el-button
            style="float: right; z-index: 10; position: relative"
            v-if="
              Per.handleButtonPer(
                'teach.studentMT.studentInfo.sisfStudentFiles.giveLessonPer'
              ) && activeName === 'studentFiles'
            "
            @click="giveLesson"
            type="primary"
            >{{ $t("赠送试听课") }}
          </el-button>
          <el-button
            type="primary"
            style="
              margin-right: 10px;
              float: right;
              z-index: 100;
              position: relative;
            "
            @click="showDrawer"
            plain
            >{{ $t("跟进记录") }}</el-button
          >
          <el-button
            type="primary"
            style="
              margin-right: 10px;
              float: right;
              z-index: 100;
              position: relative;
            "
            @click="showDeviceCheckDrawer"

            >{{ $t("设备检测记录") }}

            <i v-if="deviceCheckInfo.deviceCheckCode != 3"
              class="el-icon-warning"
              style="
                margin-top: -15px;
                color: red;
                margin-right: -20px;
                float: right;
              "
            ></i>

            <!-- v-if="!studentInfo.studentName" -->
          </el-button>
          <IMButton v-if="studentInfo" :studentId="studentId" :studentInfo="studentInfo" :parentId="parentUserId" />

          <el-tabs type="card" v-model="activeName">
            <el-tab-pane
              :label="$t('Student files')"
              name="studentFiles"
              v-if="
                Per.handleTabsPer(
                  'teach.studentMT.studentInfo.sisfStudentFiles'
                )
              "
            >
              <StudentFileInfo
                :studentId="studentId"
                :taskCode="taskCode"
                @toggleDrawer="toggleDrawer"
                @changePackageType="changePackageType"
                :updateCourseList="updateCourseList"
                @emitStudentInfo="
                  (val) => {
                    studentInfo = val;
                  }
                "
                @changeDeleteApplyStatus="
                  (val) => {
                    deleteApplyStatus = val;
                  }
                "
                @emitParentId="
                  (val) => {
                    parentId = val;
                  }
                "
                @emitSubject="
                  (val) => {
                    subjectType = val;
                  }
                "
                @getParentID="
                  (val) => {
                    parentUserId = val;
                    deviceCheckInfo.parentUserId = val;
                    this.getDeviceCheck();
                  }
                "
                @changeAccountStatus="getAccountStatus"
              ></StudentFileInfo>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('Student 课表')"
              name="studentTabletimes"
              v-if="
                Per.handleTabsPer(
                  'teach.studentMT.studentInfo.sistStudentTimetable'
                )
              "
            >
              <StudentTimetables
                ref="studentTabletimes"
                :studentInfo="studentInfo"
                v-if="activeName == 'studentTabletimes'"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="showlog"
              :label="$t('学生班级')"
              name="studentGroup"
            >
              <StudentGroup v-if="activeName == 'studentGroup'"></StudentGroup>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('学生账户')"
              name="studentAccount"
              v-if="
                Per.handleTabsPer('teach.studentMT.studentInfo.studentAccount')
              "
            >
              <StudentAccount
                v-if="activeName == 'studentAccount'"
                :studentId="studentId"
                :parentUserId="parentUserId"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('学生工单')" name="studentWorkOrder">
              <MyWorkOrder />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </template>
    <GiveLessonDialog
      v-if="isShowGiveLessonDialog"
      :visible.sync="isShowGiveLessonDialog"
      @closeGiveLessonDialog="closeGiveLessonDialog"
      :studentId="studentId"
      :parentId="parentId"
      :packageType="packageType"
      :subjectType="subjectType"
    />
    <el-drawer
      v-if="showFollowRecords"
      :visible.sync="showFollowRecords"
      :title="$t('查看跟进记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <FollowUpRecords />
    </el-drawer>

    <el-drawer
      v-if="showDeviceCheckRecords"
      :visible.sync="showDeviceCheckRecords"
      :title="$t('查看设备检测记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <TaskDeviceCheckDrawer
         :data="deviceCheckInfo"
      />
    </el-drawer>
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";

import StudentFileInfo from "./studentFileInfo";
import StudentTimetables from "./StudentTimetables";
import StudentGroup from "./studentGroup";
import FollowUpDrawer from "./followUpDrawer";
import { mapMutations, mapGetters } from "vuex";
import GiveLessonDialog from "../components/giveLessonDialog.vue";
import StudentAccount from "./studentAccount";
import FollowUpRecords from "../../taskManagement/components/FollowUpRecords.vue";
import MyWorkOrder from "@/views/myWorkbench/sub/MyWorkOrder.vue";
import BookCourses from "@/views/scheduleManagement/BookCourses.vue";
import TaskDeviceCheckDrawer from "@/views/taskManagement/components/taskDeviceCheckDrawer.vue";
import IMButton from "./IM/IMButton.vue";

export default {
  name: "studentInfo",
  props: ["studentUserId"],
  components: {
    BookCourses,
    StudentTimetables,
    StudentFileInfo,
    StudentGroup,
    FollowUpDrawer,
    GiveLessonDialog,
    StudentAccount,
    FollowUpRecords,
    MyWorkOrder,
    TaskDeviceCheckDrawer,
    IMButton,
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  data() {

    const deviceCheckInfo = reactive({
      deviceCheckCode: 3, // 1:从未做过设备检测 2:最近一次检测结果为，不通过 3:最近一次检测结果为，通过
      parentUserId: "",
    });

    return {
      parentUserId: "",
      loading: true,
      isShowGiveLessonDialog: false,
      activeName: "studentFiles",
      showlog: false,
      studentId: "",
      isShowFollowIn: false,
      taskCode: "",
      packageType: -1,
      updateCourseList: false,
      deleteApplyStatus: false,
      parentId: null,
      subjectType: null,
      status: -1 /* status 0：未激活；1：已激活；2：被封禁；3：被删除*/,
      studentInfo: null,
      showFollowRecords: false,
      showDeviceCheckRecords: false,
      deviceCheckInfo
    };
  },
  methods: {
    initCanlender() {
      if (this.activeName !== "studentTabletimes") {
        this.activeName = "studentTabletimes";
      } else {
        this.$refs.studentTabletimes.initCanlender();
      }
    },
    showDrawer() {
      this.showFollowRecords = true;
    },

    async showDeviceCheckDrawer() {

      // await this.getDeviceCheck();
      this.showDeviceCheckRecords = true;
    },

    async getDeviceCheck() {

      // console.log("getDeviceCheck parentUserId====", this.parentUserId)
      const res = await this.$Api.taskManagement.reqUserLastDeviceCheckResult({
        parentId: this.parentUserId,
      });
      this.deviceCheckInfo.deviceCheckCode = res ? res.result : 1;
    },

    getAccountStatus(status) {
      (this.loading = false), (this.status = status);
      if (this.status === 3) return;
      this.$Api.studentManagement
        .getStudentHasLog(this.studentId)
        .then(({ status, data }) => {
          if (status == 200) {
            this.showlog = data.data;
          }
        });
    },
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),

    giveLesson() {
      this.updateCourseList = false;
      this.isShowGiveLessonDialog = true;
    },

    closeGiveLessonDialog() {
      this.isShowGiveLessonDialog = false;
      this.updateCourseList = true;
    },

    toggleDrawer(val) {
      this.isShowFollowIn = val;
      this.$emit("toggleDrawer", val);
    },

    handleHasFollowStatus() {
      let followCode = this.$route.query.followCode;
      if (followCode != undefined) {
        setTimeout(() => {
          this.handleShowFollowIn();
        }, 1000);
      }
    },
    changePackageType(val) {
      this.packageType = val;
    },
  },
  mounted() {
    this.handleHasFollowStatus();
    let studentId = this.$route.query.studentId || this.studentUserId;
    this.taskCode = this.$route.query.taskCode || "";
    if (studentId) {
      window.sessionStorage.setItem("student", studentId);
      this.studentId = studentId;
    } else {
      this.studentId = window.sessionStorage.getItem("student");
    }
    if (this.$route.query.studentName) {
      this.setPageTitle(this.$route.query.studentName);
    } else {
      this.setPageTitle("学生信息");
    }
    if (this.$route.query.tab) this.activeName = this.$route.query.tab;
    if (this.$route.query.fromMC) {
      this.$nextTick(() => {
        document.querySelector("#bottomTabs").scrollIntoView();
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.w70b {
  width: 72% !important;
}
.student-info-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  .delete-account {
    color: #909399;
    margin: 0 auto;
    text-align: center;
    padding-top: 280px;
  }
}
.student-info-wrap {
  padding: 15px;
  position: relative;
  transition: all 0.5s;
  width: 100%;
  .student-info-in {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
