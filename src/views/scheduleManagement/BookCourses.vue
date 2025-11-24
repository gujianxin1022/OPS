<template>
  <div>
    <el-button
      :disabled="
        !Per.handleButtonPer(
          `teach.studentMT.studentInfo.sistStudentTimetable.sistMakeAnAppointmentForStudents`
        )
      "
      v-show="showBtn"
      @click="handleOpenBookDialog"
      type="primary"
      >{{ $t("约课") }}
    </el-button>
    <el-drawer
      :visible.sync="dialogVisible"
      append-to-body
      direction="btt"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :destroy-on-close="true"
    >
      <template slot="title">
        <div class="title-slot">
          <span>{{ $t("学生") }}：</span>
          <span class="mr20">{{ studentInfo.studentName }}</span>
          <span>{{ $t("约课时区") }}：</span>
          <span class="mr20">
            {{ filterZoneName(studentInfo.timeZone, isEn) }}</span
          >
          <span>
            （<span v-if="getTimeDifference(studentInfo.timeZone) > 0">{{
              $t("您本地时区比用户时区快$小时").replace(
                "$",
                Math.abs(getTimeDifference(studentInfo.timeZone))
              )
            }}</span>
            <span v-if="getTimeDifference(studentInfo.timeZone) < 0">{{
              $t("您本地时区比用户时区慢$小时").replace(
                "$",
                Math.abs(getTimeDifference(studentInfo.timeZone))
              )
            }}</span>
            <span v-if="getTimeDifference(studentInfo.timeZone) === 0">{{
              $t("您本地时区与用户时区时间一致")
            }}</span
            >）
          </span>
          <div
            v-if="studentInfo.hasDst === 1"
            class="mt10"
            style="font-size: 12px; color: #f56c6c"
          >
            {{ $t("注意：该地区有令时变更规则") }}
          </div>
        </div>
      </template>
      <div class="book-courses-search-warp">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form
              ref="myForm"
              :model="formState"
              props="packageType"
              class="demo-form-inline"
            >
              <el-form-item prop="packageType" :label="$t('课程')">
                <el-radio-group
                  @change="changePackageType"
                  v-model="formState.packageType"
                >
                  <el-radio :label="FORMAL_COURSE">{{ $t("正式") }}</el-radio>
                  <el-radio :label="AUDITION_COURSE">{{ $t("试听") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="coursePackageId" :label="$t('课包')">
                <el-select
                  @change="handleCoursePackageChange"
                  v-model="formState.coursePackageId"
                >
                  <el-option
                    v-for="item in formState.packageType === '1'
                      ? formalPackageList
                      : auditionPackageList"
                    :key="item.packageId"
                    :label="item.packageNameCommon"
                    :value="item.packageId"
                  >
                  </el-option>
                </el-select>
                <br />
                <span v-if="formState.coursePackageId" style="font-size: 12px"
                  >{{ $t("余额") }}：
                  <span style="color: #f56c6c">{{ balance }}</span>
                </span>
              </el-form-item>
              <el-form-item :label="$t('进度')">
                <span v-if="!formState.coursePackageId">
                  {{ $t("请选择课包") }}
                </span>
                <span v-else>
                  <el-tag
                    v-if="
                      currentProgress &&
                      currentProgress.progressDescZH &&
                      currentProgress.progressDescZH.length
                    "
                    type="info"
                  >
                    {{
                      isEn
                        ? currentProgress.progressDescEN
                        : currentProgress.progressDescZH
                    }}</el-tag
                  >
                  <el-button
                    v-else
                    type="text"
                    @click="isShowProgressDialog = true"
                    >{{ $t("Adjust the schedule") }}
                  </el-button>
                </span>
              </el-form-item>
              <el-form-item :label="$t('时间筛选方式')">
                <el-switch
                  :active-value="false"
                  :inactive-value="true"
                  style="vertical-align: baseline"
                  v-model="formState.dateFormatType"
                  :active-text="$t('时间段')"
                  :inactive-text="$t('时间点')"
                  @change="handleChangeDateFormatType"
                >
                </el-switch>
              </el-form-item>
              <el-form-item
                v-if="!formState.dateFormatType"
                :label="$t('时间筛选逻辑')"
              >
                <el-switch
                  :active-value="2"
                  :inactive-value="1"
                  style="vertical-align: baseline"
                  v-model="formState.dateType"
                  :active-text="$t('一个即符合')"
                  :inactive-text="$t('全部符合')"
                >
                </el-switch>
              </el-form-item>
              <el-form-item
                v-if="!formState.dateFormatType"
                :label="$t('时间')"
              >
                <i
                  @click="addOption(-1)"
                  v-show="formState.bookTimes.length <= 0"
                  class="el-icon-plus"
                  style="cursor: pointer; color: #7e8ae7"
                ></i>
                <template v-show="formState.bookTimes.length > 0">
                  <div
                    style="display: block; padding-left: 40px"
                    v-for="(item, index) in formState.bookTimes"
                    class="mb10"
                    :key="item.key"
                  >
                    <div>
                      <BookTimePeriodPanel
                        :key="item.key"
                        :ref="`bookTime${index}`"
                        @handleDeleTag="deleteOption(index)"
                        @onSelectDateTime="
                          (date) => {
                            item.value = date;
                          }
                        "
                        :minStartTime="minStartTime"
                      ></BookTimePeriodPanel>
                      <i
                        v-show="
                          formState.bookTimes.length > 0 &&
                          index === formState.bookTimes.length - 1
                        "
                        @click="addOption(index)"
                        class="el-icon-plus"
                        style="cursor: pointer; color: #7e8ae7"
                      ></i>
                      <br />
                      <span
                        v-if="
                          item.value &&
                          getTimeDifference(studentInfo.timeZone) !== 0
                        "
                        style="font-size: 12px"
                        >{{ $t("用户时间") }}：
                        {{
                          toUserTimeZoneTime2(
                            userTimeZone,
                            item.value.minStartTime
                          ).replace(
                            /\(.*?\)/,
                            `(${$t(
                              toUserTimeZoneTime2(
                                userTimeZone,
                                item.value.minStartTime
                              ).match(/\(([^)]+)\)/)[1]
                            )})`
                          )
                        }}
                        ~
                        {{
                          toUserTimeZoneTime2(
                            userTimeZone,
                            item.value.maxStartTime
                          ).replace(
                            /\(.*?\)/,
                            `(${$t(
                              toUserTimeZoneTime2(
                                userTimeZone,
                                item.value.maxStartTime
                              ).match(/\(([^)]+)\)/)[1]
                            )})`
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item v-if="formState.dateFormatType" :label="$t('时间')">
                <i
                  @click="addOption(-1)"
                  v-show="formState.bookTimes.length <= 0"
                  class="el-icon-plus"
                  style="cursor: pointer; color: #7e8ae7"
                ></i>
                <template v-show="formState.bookTimes.length > 0">
                  <div
                    style="display: block; padding-left: 40px"
                    v-for="(item, index) in formState.bookTimes"
                    class="mb10"
                    :key="item.key"
                  >
                    <div>
                      <BookTimePanel
                        :key="item.key"
                        :ref="`bookTime${index}`"
                        @onSelectDateTime="
                          (date) => {
                            item.value = date;
                          }
                        "
                        :minStartTime="minStartTime"
                      ></BookTimePanel>
                      <i
                        @click="addOption(index)"
                        class="el-icon-plus"
                        style="cursor: pointer; color: #7e8ae7"
                      ></i>
                      <i
                        @click.prevent="deleteOption(index)"
                        class="el-icon-minus"
                        style="cursor: pointer; color: #7e8ae7"
                      ></i>
                      <br />
                      <span v-if="item.value"
                        >{{ $t("用户时间") }}：{{
                          toUserTimeZoneTime(userTimeZone, item.value)
                        }}({{
                          $t(
                            moment
                              .utc(item.value)
                              .tz(userTimeZone)
                              .format("dddd")
                          )
                        }})</span
                      >
                    </div>
                  </div>
                </template>
              </el-form-item>
            </el-form></el-col
          >
          <el-col :span="17">
            <AvailableTeachers
              ref="AvailableTeachers"
              @openTeacherTimeTable="handelOpenTeacherTimeTable"
              :params="formState"
            />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <AdjustCourseProgress
      v-if="isShowProgressDialog"
      :studentId="$route.query.studentId"
      :visible.sync="isShowProgressDialog"
      @adjustSucessCb="
        () => {
          isShowProgressDialog = false;
          getStudentLearningPlan(formState.coursePackageId);
          reqAvailableTeachers();
        }
      "
      :currentProgressData="{
        packageId: formState.coursePackageId,
      }"
    />
    <el-drawer
      :visible.sync="showTeacherTimeTable"
      append-to-body
      direction="btt"
      :before-close="handleCloseTeacherTimeTable"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :destroy-on-close="true"
      :title="$t('确定约课信息')"
    >
      <BookTeacherTime
        class="teacher-table-warp"
        v-if="teacherState && operationScheduleType.length"
        :teacherName="teacherState.realName"
        :teacherId="teacherState.id"
        :showTeacherTimetable="showTeacherTimetable"
        :coursePackageId="formState.coursePackageId"
        @goBack="handleCloseTeacherTimeTable"
        :studentInfo="studentInfo"
    
        @closeBookDialog="
          () => {
            handleCloseTeacherTimeTable();
            handleClose();
          }
        "
        :minStartTime="minStartTime"
      />
    </el-drawer>
  </div>
</template>

<script>
import { ref, computed, reactive, toRefs, watch } from "@vue/composition-api";
import BookTimePanel from "./BookTimePanel.vue";
import BookTimePeriodPanel from "@/components/NewFilter/BookTimePeriodPanel.vue";
import {
  AUDITION_COURSE /* 试听课 */,
  FORMAL_COURSE /* 正式课 */,
} from "@/utils/constants";
import AvailableTeachers from "./AvailableTeachers.vue";
import AdjustCourseProgress from "@/views/studentManagement/components/adjustCourseProgress.vue";
import BookTeacherTime from "./teacherTime/BookTeacherTime.vue"; // 老师课表
import {
  bookCoursePackageInfo,
  bookParamsTimes,
  markingBookTime,
  isHasOverlap,
  bookPackageType,
  bookMinStartTime,
  operationScheduleType,
} from "./teacherTime/bookCurriculum";
import { deepClone } from "@/utils/handleData";
import { logEvent } from "@/utils/analyticsNew";
import moment from "moment";
import {
  filterZoneName,
  toUserTimeZoneTime2,
  toUserTimeZoneTime,
  getTimeDifference,
} from "@/utils/timeZone";

export default {
  props: {
    studentInfo: {
      type: Object,
      default: () => {},
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    BookTimePanel,
    BookTimePeriodPanel,
    AvailableTeachers,
    AdjustCourseProgress,
    BookTeacherTime,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const userTimeZone = computed(() => root.$store.getters.userTimeZone);
    const hasNoTimeZoneTips = () => {
      return root
        .$confirm(
          root.$t("请先在家长信息页面完善用户约课时区"),
          root.$t("提示"),
          {
            showCancelButton: true,
            confirmButtonText: root.$t("去完善"),
            cancelButtonText: root.$t("取消"),
            type: "warning",
            center: true,
          }
        )
        .then(() => {
          root.$router.push(
            `/studentManagement/parentInfo?parentUserId=${window.sessionStorage.getItem(
              "parentUserId"
            )}`
          );
        })
        .catch(() => {});
    };
    const dialogVisible = ref(false);
    const handleOpenBookDialog = async (from) => {
      if (!userTimeZone.value || !userTimeZone.value.length) {
        hasNoTimeZoneTips();
        return;
      }
      await initData();
      dialogVisible.value = true;
      if (from === "studentTimeTables") {
        logEvent("student_timeTables_click_slot", "学生课表-点击-课表slot", {
          studentUserId: root.$route.query.studentId,
        });
      } else {
        logEvent(
          "student_information_click-schedule_class_button",
          "学生信息-点击-约课按钮",
          {
            studentUserId: root.$route.query.studentId,
          }
        );
      }
    };
    const handleClose = () => {
      formState.dateFormatType=true
      dialogVisible.value = false;
      refs.myForm.resetFields();
      formState.bookTimes = [];
      bookParamsTimes.value = [];
      markingBookTime.value = [];
      bookCoursePackageInfo.value = null;
      emit("closeBookCourses");
    };
    const formState = reactive({
      packageType: "1",
      coursePackageId: null,
      bookTimes: [],
      dateType: "1",
      dateFormatType: true,
    });
    watch(
      () => formState.bookTimes,
      (list) => {
        isHasOverlap.value = false;
        if (!list.length || list.length === 1) return;
        isHasOverlap.value = hasOverlap(
          list,
          bookCoursePackageInfo.value.duration
        );
      },
      {
        deep: true,
      }
    );
    const hasOverlap = (list, duration) => {
      const times = list.map((item) => ({
        start: new Date(item.value),
        end: new Date(new Date(item.value).getTime() + duration * 60 * 1000),
      }));
      // 按照开始时间进行排序
      times.sort((a, b) => a.start - b.start);
      // 进行交集判断
      for (let i = 1; i < times.length; i++) {
        if (times[i].start < times[i - 1].end) {
          return true; // 存在交集
        }
      }
      return false; // 不存在交集
    };
    const addOption = (index) => {
      if (formState.bookTimes.length >= 3) {
        return root.$notify.warning(root.$t("选项最多$个").replace("$", "3"));
      }
      formState.bookTimes.splice(index + 1, 0, {
        key: new Date().getTime(),
        value: "",
      });
      root.$nextTick(() => {
        setTimeout(() => {
          let refName = `bookTime${index + 1}`;
          refs[refName][0].show = true;
        }, 100);
      });
    };
    const deleteOption = (index) => {
      formState.bookTimes.splice(index, 1);
    };
    const coursePackageState = reactive({
      formalPackageList: [],
      auditionPackageList: [],
    });
    const changePackageType = async (val) => {
      formState.coursePackageId = null;
      minStartTime.value =
        val == 1
          ? minStartTimeState.formalMinStartTime
          : minStartTimeState.auditionMinStartTime;
      bookMinStartTime.value = minStartTime.value;
      bookCoursePackageInfo.value = null;
      bookPackageType.value = val;
    };
    const minStartTimeState = reactive({
      auditionMinStartTime: "",
      formalMinStartTime: "",
    });
    const minStartTime = ref("");
    const reqMinStartTime = async () => {
      let now = moment(root.DateTimeUtils.getNextHalfHour().toISOString())
        .subtract(30, "minutes")
        .toISOString();

      minStartTimeState.formalMinStartTime = now;
      minStartTimeState.auditionMinStartTime = now;
      changePackageType("1");
    };
    const initData = async () => {
      reqMinStartTime();
      const res = await Promise.all([
        root.$Api.classManagement.reqBookCoursePackage({
          studentId: root.$route.query.studentId,
          courseType: 1,
        }),
        root.$Api.classManagement.reqBookCoursePackage({
          studentId: root.$route.query.studentId,
          courseType: 0,
        }),
      ]);
      coursePackageState.formalPackageList = res[0] || [];
      if (res[0].length) {
        handleCoursePackageChange(res[0][0].packageId);
        setTimeout(() => {
          formState.coursePackageId = res[0][0].packageId;
        }, 500);
      }
      coursePackageState.auditionPackageList = res[1] || [];
    };
    const balance = ref("");
    const handleCoursePackageChange = (packageId) => {
      let packageList =
        formState.packageType === "1"
          ? coursePackageState.formalPackageList
          : coursePackageState.auditionPackageList;
      packageList.some((e) => {
        if (e.packageId === packageId) {
          balance.value = e.balance;
        }
        return e.packageId === packageId;
      });
      getStudentLearningPlan(packageId);
    };
    const currentProgress = ref(null);
    const getStudentLearningPlan = async (coursePackageId) => {
      bookCoursePackageInfo.value = null;
      const res = await root.$Api.studentManagement.getStudentLearningPlan({
        studentUserId: root.$route.query.studentId,
        coursePackageId: coursePackageId,
      });
      if (res.data.code !== 200) {
        currentProgress.value = null;
      } else {
        currentProgress.value = res.data.data;
        bookCoursePackageInfo.value = res.data.data;
        bookCoursePackageInfo.value.balance = balance.value;
      }
    };
    const isShowProgressDialog = ref(false);
    /* 展示教师课表 */
    const showTeacherTimeTable = ref(false);
    const teacherState = ref(null);
    const handelOpenTeacherTimeTable = (row) => {
      showTeacherTimeTable.value = true;
      teacherState.value = row;
    };
    const handleCloseTeacherTimeTable = () => {
      showTeacherTimeTable.value = false;
      teacherState.value = null;
      bookParamsTimes.value = deepClone(formState.bookTimes);
      // bookParamsTimes.value = deepClone(markingBookTime.value);
    };
    const reqAvailableTeachers = () => {
      refs.AvailableTeachers.search();
    };
    const handleChangeDateFormatType = (val) => {
      formState.bookTimes = [];
    };
    return {
      isEn,
      handleOpenBookDialog,
      dialogVisible,
      handleClose,
      filterZoneName,
      formState,
      AUDITION_COURSE,
      FORMAL_COURSE,
      changePackageType,
      ...toRefs(coursePackageState),
      addOption,
      deleteOption,
      minStartTime,
      currentProgress,
      handleCoursePackageChange,
      isShowProgressDialog,
      getStudentLearningPlan,
      handelOpenTeacherTimeTable,
      showTeacherTimeTable,
      handleCloseTeacherTimeTable,
      teacherState,
      balance,
      reqAvailableTeachers,
      userTimeZone: computed(() => root.$store.getters.userTimeZone),
      toUserTimeZoneTime2,
      toUserTimeZoneTime,
      moment,
      getTimeDifference,
      handleChangeDateFormatType,
      operationScheduleType,
    };
  },
};
</script>
<style scoped lang="scss">
.title-slot {
  font-weight: 700;
}
.book-courses-search-warp {
  padding: 0px 20px;
  color: #606266;
  height: 90vh;
  overflow-y: scroll;
  .teacher-table-warp {
    width: 100%;
    height: 90vh;
  }
}
</style>
