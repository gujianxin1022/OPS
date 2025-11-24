<template>
  <div id="bottomTabs">
    <div class="study-condition-wrap">
      <el-card style="height: 100%">
        <div class="common-title">{{ $t("学习情况") }}</div>
        <div class="content-wrap">
          <div class="left-box">
            <el-card style="height: 100%">
              <el-radio-group v-model="packageType" @change="onChangeType">
                <el-radio-button label="1">{{ $t("正式") }}</el-radio-button>
                <el-radio-button label="0">{{ $t("试听") }}</el-radio-button>
              </el-radio-group>
              <div class="course-list-wrap" v-loading="courseListLoading">
                <template v-if="courseList && courseList.length">
                  <span
                    :class="{ 'active-span': currentCoursePkgIdx === index }"
                    v-for="(coursePkg, index) in courseList"
                    :key="coursePkg.packageId"
                    @click="
                      (currentCoursePkgIdx = index),
                        onChangeCoursePkg(coursePkg)
                    "
                    >{{
                      (currentLang === "en"
                        ? coursePkg.packageNameEn
                        : coursePkg.packageNameZH) || "---"
                    }}</span
                  >
                </template>
                <span v-else class="empty">{{ $t("暂无数据") }}</span>
              </div>
            </el-card>
          </div>
          <div class="right-box">
            <div class="top">
              <div v-if="situationInfo" v-loading="isLoadingSituation">
                <div class="btn-wrap">
                  <div class="mb10">
                    <!-- 1：1对1；2：小班课；3：大班课 -->
                    <!-- 小班课不展示-->
                    <span></span>
                    {{ $t("课程进度") }}：{{
                      currentLang === "en"
                        ? situationInfo.lessonNameEn
                        : situationInfo.lessonNameZh
                    }}
                    <span>
                      <el-tag
                        v-show="situationInfo.isHandover === 2"
                        class="ml5"
                        type="success"
                        >{{ $t("已交接") }}</el-tag
                      >
                      <el-tag
                        v-show="situationInfo.isHandover === 1"
                        class="ml5"
                        type="warning"
                      >
                        <span>{{ $t("交接中") }}</span>
                        <span
                          v-if="
                            situationInfo.handoverName &&
                            situationInfo.handoverName.length
                          "
                          >{{
                            $t("：等待“$name”分配").replace(
                              "$name",
                              situationInfo.handoverName
                            )
                          }}</span
                        >
                      </el-tag>
                      <el-tag
                        v-show="situationInfo.isHandover === 0"
                        class="ml5"
                        type="danger"
                        >{{ $t("未交接") }}</el-tag
                      >
                    </span>
                    <el-button
                      v-if="
                        currentCoursePkg &&
                        currentCoursePkg.classType &&
                        currentCoursePkg.classType !== 2 &&
                        currentCoursePkg.activityType !==
                          1 /* 0:默认课包，1:LTO课包 */
                      "
                      type="text"
                      class="ml20"
                      @click="isShowProgressDialog = true"
                      >{{ $t("Adjust the schedule") }}
                    </el-button>
                  </div>
                  <!-- <el-button
                    v-if="packageType == '1' && situationInfo.lessonId"
                    type="primary"
                    style="height: 35px"
                    @click="onOpenFollowDrawer"
                  >{{ $t("自发跟进") }}</el-button> -->
                </div>
                <div
                  class="mb20"
                  v-if="
                    situationInfo.teacherAdvice &&
                    situationInfo.teacherAdvice.length > 0
                  "
                >
                  {{ $t("老师建议级别") }}：{{ situationInfo.teacherAdvice }}
                </div>
                <div class="mb10">
                  <span class="item">
                    <span class="label">{{ $t("学管") }}：</span>
                    <span class="value">{{
                      situationInfo.xgUserName || "---"
                    }}</span>
                  </span>
                  <span>
                    <span class="label">{{ $t("顾问") }}：</span>
                    <span class="value">{{
                      situationInfo.counselorName || "---"
                    }}</span>
                  </span>
                </div>
                <!-- 小班课才展示-->
                <div
                  class="class-wrap"
                  v-if="currentCoursePkg && currentCoursePkg.classType === 2"
                >
                  <div>
                    <span class="class-label mr10">{{ $t("班级") }}:</span>
                  </div>
                  <div style="flex: 1">
                    <el-button type="text" @click="openSignUpDialog">{{
                      $t("报名小班课")
                    }}</el-button>
                    <div
                      class="class-box"
                      v-if="
                        situationInfo.classId && situationInfo.classId.length
                      "
                    >
                      <div
                        class="class-item"
                        v-for="(id, i) in situationInfo.classId"
                        :key="id"
                      >
                        <span class="value id-wrap"
                          >{{ getClassName(i) || id }}
                        </span>
                        <el-button
                          class="mr10"
                          v-if="id"
                          type="text"
                          @click="removeClass(id)"
                          >{{ $t("移出小班") }}</el-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  v-if="
                    currentCoursePkg &&
                    currentCoursePkg.classType === 2 &&
                    packageType == FORMAL_COURSE
                  "
                  v-loading="loadingLeaveTimes"
                >
                  <span class="mr10">{{ $t("请假次数") }}:</span>
                  <div class="leave-class">
                    <span class="mr10"
                      >{{ leaveClassInfo.notUsedNum || 0 }}{{ $t("次") }}</span
                    >
                    <el-button
                      type="text"
                      @click="showLeaveInfoDialog = true"
                      >{{ $t("详情") }}</el-button
                    >
                  </div>
                </span>
                <span
                  class="ml20"
                  v-if="
                    currentCoursePkg &&
                    currentCoursePkg.classType === 2 &&
                    packageType == FORMAL_COURSE
                  "
                  v-loading="loadingLeaveTimes"
                >
                  <span class="mr10">{{ $t("调课次数") }}:</span>
                  <div class="leave-class">
                    <span class="mr10"
                      >{{ adjustmentCourseInfo.notUsedNum || 0
                      }}{{ $t("次") }}</span
                    >
                    <el-button
                      type="text"
                      @click="showAdjustmentCourseInfoDialog = true"
                      >{{ $t("详情") }}</el-button
                    >
                  </div>
                </span>
              </div>
            </div>
            <div class="bottom">
              <StudyConditionList
                @refreshLeaveTimes="refreshLeaveTimes"
                :studentInfo="studentInfo"
                :situationInfo="situationInfo"
                :currentCoursePkg="currentCoursePkg"
                :courseType="courseType"
                @refreshAdjustmentCourseTimes="refreshAdjustmentCourseTimes()"
              />
            </div>
          </div>
        </div>
      </el-card>
      <!-- 调整进度 -->
      <AdjustCourseProgress
        v-if="isShowProgressDialog"
        :studentId="studentId"
        :currentProgressData="currentProgressData"
        :visible.sync="isShowProgressDialog"
        @adjustSucessCb="adjustSucessCb"
      />
    </div>
    <div
      class="right-float-box"
      v-show="isShowFollowIn"
      :class="{ 'r-0b': isShowFollowIn }"
    >
      <!-- 自动跟进 -->
      <FollowUpDrawer
        :studentId="studentId"
        :change-follow-type="changeFollowType"
        :planId="situationInfo.planId"
        @close="onCloseFollowDrawer"
      ></FollowUpDrawer>
    </div>
    <!-- 报名小班 -->
    <SignUpSmallClasses
      :packageType="packageType"
      :visible.sync="signUpSmallClassesState.visible"
      :progressInfo="currentProgressData"
      @ok="signUpSuccess"
    />
    <!-- 请假/调课详情 -->
    <LeaveClassInfoDialog
      v-if="showLeaveInfoDialog"
      :visible.sync="showLeaveInfoDialog"
      :courseType="courseType"
      :studentId="studentId"
    >
    </LeaveClassInfoDialog>
    <adjustmentCourseInfoDialog
      v-if="showAdjustmentCourseInfoDialog"
      :visible.sync="showAdjustmentCourseInfoDialog"
      :courseType="courseType"
      :studentId="studentId"
    >
    </adjustmentCourseInfoDialog>
  </div>
</template>
<script>
import StudyConditionList from "./studyCoditionList.vue";
import {
  ref,
  onMounted,
  reactive,
  toRefs,
  computed,
  watch,
  unref,
} from "@vue/composition-api";
import AdjustCourseProgress from "./adjustCourseProgress.vue";
import FollowUpDrawer from "../subPage/followUpDrawer";
import SignUpSmallClasses from "../subPage/SignUpSmallClasses";
import {
  SUBJECT_TYPE,
  FORMAL_COURSE,
  AUDITION_COURSE,
} from "@/utils/constants";
import LeaveClassInfoDialog from "./leaveClassInfoDialog.vue";
import adjustmentCourseInfoDialog from "./adjustmentCourseInfoDialog.vue";

export default {
  props: {
    studentInfo: {
      type: Object,
      default: {},
    },
    studentId: {
      type: String,
      default: -1,
    },
    taskCode: {
      type: "String",
      default: "",
    },
    courseType: {
      type: Number,
      default: -1, // 0：中文 1：英文
    },
    updateCourseList: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    StudyConditionList,
    AdjustCourseProgress,
    FollowUpDrawer,
    SignUpSmallClasses,
    LeaveClassInfoDialog,
    adjustmentCourseInfoDialog,
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const loadingState = reactive({
      isLoadingSituation: false,
      courseListLoading: false,
      loadingLeaveTimes: false,
      loadingAdjustmentCourse: false,
    });
    const courseList = ref([]);
    const situationInfo = ref({});
    const currentCoursePkgIdx = ref(0);
    const currentCoursePkg = ref({});
    const packageType = ref(1); //课包类型（0-试听，1-正式）
    const leaveClassInfo = ref({});
    const adjustmentCourseInfo = ref({});
    const followDrawerState = reactive({
      isShowFollowIn: false,
      changeFollowType: false,
    });
    const showDialogState = reactive({
      isShowProgressDialog: false,
      showLeaveInfoDialog: false,
      showAdjustmentCourseInfoDialog: false,
    });

    const signUpSmallClassesState = reactive({
      visible: false,
    });

    const currentProgressData = reactive({
      lessonName: "",
      pkgName: "",
      packageId: -1,
      packageTreeId: -1,
      lessonId: -1,
      scheduleInfo: [],
    });

    watch(
      () => props.courseType,
      (newVal) => {
        console.log(newVal);
        currentCoursePkgIdx.value = 0;
        getCoursePackageList();
        getLeaveClassTimes();
        getAdjustmentCourseTimes();
      }
    );

    watch(
      () => props.updateCourseList,
      (val) => {
        if (val) {
          getCoursePackageList();
        }
      }
    );

    watch(
      () => currentCoursePkg.value,
      (pkg) => {
        if (pkg) {
          currentProgressData.pkgName = pkg.packageNameZH;
          currentProgressData.packageId = pkg.packageId;
          getStudySituation();
        } else {
          situationInfo.value = {};
          currentProgressData.scheduleInfo = [];
        }
      }
    );
    watch(
      () => showDialogState.showLeaveInfoDialog,
      (flag) => {
        if (!flag) {
          getLeaveClassTimes();
        }
      }
    );
    watch(
      () => showDialogState.showAdjustmentCourseInfoDialog,
      (flag) => {
        if (!flag) {
          getAdjustmentCourseTimes();
        }
      }
    );

    emit("changePackageType", packageType.value);

    const getClassName = (i) => {
      if (!situationInfo.value || !situationInfo.value.className.length) {
        return;
      }
      return (
        situationInfo.value.className.replace("，", ",").split(",")[i] || ""
      );
    };

    const adjustSucessCb = () => {
      showDialogState.isShowProgressDialog = false;
      getStudySituation();
    };

    const removeClass = (id) => {
      root.$router.push(`/groupManagement/classInfo?id=${id}&type=2`);
    };

    const signUpSuccess = () => {
      getStudySituation();
      getLeaveClassTimes();
      getAdjustmentCourseTimes();
    };

    // 获取课程包列表
    const getCoursePackageList = () => {
      loadingState.courseListLoading = true;
      root.$Api.studentManagement
        .getCoursePackageList({
          studentId: props.studentId,
          packageType: packageType.value,
          courseType: props.courseType,
        })
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          courseList.value = data.data;
          currentCoursePkg.value = data.data[0];
          loadingState.courseListLoading = false;
        })
        .catch(() => {
          loadingState.courseListLoading = false;
        });
    };

    // 正式课试听课切换
    const onChangeType = (val) => {
      getCoursePackageList();
      currentCoursePkgIdx.value = 0;
      emit("changePackageType", val);
      getLeaveClassTimes();
      getAdjustmentCourseTimes();
    };

    // 切换课程包
    const onChangeCoursePkg = (current) => {
      currentCoursePkg.value = current;
    };

    // 获取学习情况信息
    const getStudySituation = () => {
      loadingState.isLoadingSituation = true;
      root.$Api.studentManagement
        .getStudentSituation(
          props.studentId,
          currentCoursePkg.value.packageId,
          packageType.value,
          props.studentInfo.parentUserId,
          currentCoursePkg.value.activityType
        )
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          situationInfo.value = data.data;
          situationInfo.value.classId = data.data.classId?.length
            ? data.data.classId.replace("，", ",").split(",")
            : [];
          const { lessonNameEn, lessonNameZh, packageTreeId, lessonId } =
            data.data;
          const { packageId } = currentProgressData;
          currentProgressData.lessonName = lessonNameZh;
          currentProgressData.lessonNameEn = lessonNameEn;
          currentProgressData.packageTreeId = packageTreeId;
          currentProgressData.lessonId = lessonId;
          loadingState.isLoadingSituation = false;
          if (packageId && packageTreeId && lessonId) {
            getSelectIds(packageId, packageTreeId, lessonId);
          } else {
            currentProgressData.scheduleInfo = [];
          }
        })
        .catch(() => {
          currentProgressData.lessonName = "";
          currentProgressData.packageTreeId = -1;
          currentProgressData.lessonId = -1;
          currentProgressData.scheduleInfo = [];
          situationInfo.value = {};
          loadingState.isLoadingSituation = false;
        });
    };

    // 根据lessonId 反查进度信息
    const getSelectIds = async (packageId, packageTreeId, id) => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.task.reqTreeIdsByPackageId({
        packageId,
        packageTreeId: packageTreeId,
        lessonIdList: [id],
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      if (!data || !data.length) {
        currentProgressData.scheduleInfo = [];
        return;
      } else {
        const { packageTreeId, levelId, unitId, lessonId } = data[0];
        currentProgressData.scheduleInfo = [
          packageTreeId,
          levelId,
          unitId,
          lessonId,
        ];
      }
    };

    // 自发跟进抽屉关闭
    const onCloseFollowDrawer = () => {
      followDrawerState.isShowFollowIn = !followDrawerState.isShowFollowIn;
      followDrawerState.changeFollowType = false;
      emit("toggleDrawer", followDrawerState.isShowFollowIn);
    };

    // 自发跟进抽屉
    const onOpenFollowDrawer = () => {
      followDrawerState.changeFollowType = true;
      followDrawerState.isShowFollowIn = true;
      emit("toggleDrawer", followDrawerState.isShowFollowIn);
    };

    // 报名小班
    const openSignUpDialog = () => {
      signUpSmallClassesState.visible = true;
    };

    // 校验基本信息是否完善
    const getLeaveClassTimes = () => {
      loadingState.loadingLeaveTimes = true;
      root.$Api.studentManagement
        .getLeaveClassTimes(props.studentId, props.courseType)
        .then(({ status, data: { code, data } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          leaveClassInfo.value = data;
          loadingState.loadingLeaveTimes = false;
        })
        .catch(() => {
          loadingState.loadingLeaveTimes = false;
        });
    };
    //获取小班课调课次数
    const getAdjustmentCourseTimes = async () => {
      loadingState.loadingAdjustmentCourse = true;
      try {
        const res = await root.$Api.studentManagement.reqAdjustmentCourseTimes(
          props.studentId,
          props.courseType
        );
        adjustmentCourseInfo.value = res;
      } finally {
        loadingState.loadingAdjustmentCourse = false;
      }
    };

    const refreshLeaveTimes = () => {
      getLeaveClassTimes();
    };
    const refreshAdjustmentCourseTimes = () => {
      getAdjustmentCourseTimes();
    };

    onMounted(() => {
      getLeaveClassTimes();
      getAdjustmentCourseTimes();
      getCoursePackageList();
    });

    return {
      SUBJECT_TYPE,
      FORMAL_COURSE,
      AUDITION_COURSE,
      situationInfo,
      leaveClassInfo,
      adjustmentCourseInfo,
      courseList,
      currentCoursePkgIdx,
      currentCoursePkg,
      currentProgressData,
      signUpSmallClassesState,
      packageType,
      currentLang,
      ...toRefs(showDialogState),
      ...toRefs(followDrawerState),
      ...toRefs(loadingState),
      getCoursePackageList,
      onChangeCoursePkg,
      onChangeType,
      getStudySituation,
      onCloseFollowDrawer,
      onOpenFollowDrawer,
      openSignUpDialog,
      adjustSucessCb,
      removeClass,
      getClassName,
      refreshLeaveTimes,
      signUpSuccess,
      refreshAdjustmentCourseTimes,
    };
  },
};
</script>
<style scoped lang="scss">
.right-float-box {
  position: fixed;
  right: -26%;
  width: 24%;
  height: 88%;
  background: #fff;
  top: 90px;
  border-radius: 5px;
  transition: all 0.5s;
  z-index: 999;
}

.r-0b {
  right: 0 !important;
}
.study-condition-wrap {
  height: calc(100vh + 30px) ;
  .class-label {
    display: flex;
    margin-top: 6px;
  }
  font-size: 14px;
  color: #303133;
  .btn-wrap {
    display: flex;
    justify-content: space-between;
  }
  .common-title {
    width: 100%;
    position: relative;
    font-size: 20px;
    margin-bottom: 10px;
  }
  .content-wrap {
    width: 100%;
    display: flex;
    height: calc(100vh - 40px);
    .left-box {
      height: 100%;
      margin-right: 20px;
    }
    .right-box {
      width: 80%;
      height: 100%;
      .leave-class {
        display: inline-block;
      }
      .top {
        min-height: 150px;
        padding-top: 10px;
        .item {
          margin-right: 80px;
          .label {
            width: 100px;
          }
        }

        .class-wrap {
          display: flex;
          align-items: center;
          align-items: flex-start;
          .id-wrap {
            margin-right: 10px;
            display: inline-block;
          }
          .class-box {
            max-height: 150px;
            width: 95%;
            overflow: auto;
            .class-item {
              float: left;
            }
          }
        }
      }
    }
  }
  .course-list-wrap {
    margin-top: 30px;
    height: 400px;
    overflow: auto;
    span {
      height: 30px;
      display: block;
      margin: 10px 0px;

      &:hover {
        color: #7580e5;
        cursor: pointer;
      }
    }
    .empty {
      text-align: center;
      margin-top: 50px;
      color: #999;
      font-size: 12px;
    }
    .active-span {
      color: #7580e5;
    }
  }
}
::v-deep .el-radio-group {
  display: flex;
  justify-content: center;
}
</style>
