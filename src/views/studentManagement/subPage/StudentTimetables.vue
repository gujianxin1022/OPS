<template>
  <div
    class="student-timetables-wrap"
    v-if="
      Per.handleButtonPer(
        'teach.studentMT.studentInfo.sistStudentTimetable.sistViewStudentTimetable'
      )
    "
  >
    <div class="students-timetables-header">
      <div class="buttons">
        <div class="button last-week-button" @click="clickPreWeek">
          <i class="el-icon-arrow-left"></i>
          <span>{{ $t("上周") }}</span>
        </div>
        <div class="button next-week-button" @click="clickNextWeek">
          <span>{{ $t("下周") }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div>
        <span v-show="isUserTimes" v-if="studentLoginTz">{{
          studentLoginTz
        }}</span>
        <el-select
          :disabled="true"
          v-model="isUserTimes"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="button" @click="goBackToNowWeek">{{ $t("本周") }}</div>
    </div>
    <div v-loading="loading" class="student-timetables-content">
      <div class="timetables-time-week">
        <div class="times-item">{{ $t("time") }}</div>
        <div v-for="(item, index) in list" :key="index" class="week-item w150">
          <p>{{ item.week }}</p>
          <p>{{ item.day }}</p>
        </div>
      </div>
      <div
        class="timetables-time-table"
        :style="{ height: tableHeight + 'px' }"
      >
        <ul v-for="(item, index) in time25Arr" :key="index">
          <li class="lh60">
            {{ item.split(":")[0] < 10 ? "0" : "" }}{{ item }} -
            {{
              (item.split(":")[1] === "00"
                ? item.split(":")[0]
                : Number(item.split(":")[0]) + 1) < 10
                ? "0"
                : ""
            }}{{
              item.split(":")[1] === "00"
                ? item.split(":")[0]
                : Number(item.split(":")[0]) + 1
            }}:{{ item.split(":")[1] === "00" ? "30" : "00" }}
          </li>
          <li
            @click="bookClass(weekItem, item, computeClassInfo(weekItem, item))"
            v-for="(weekItem, weekIndex) in currentWeekArr"
            :key="weekIndex"
            :class="computeStatusClass(computeClassInfo(weekItem, item))"
            style="display: flex; justify-content: center; align-items: center"
          >
            <template v-if="computeClassInfo(weekItem, item)">
              <!-- 时间过去的，(预约成功或预占成功)并且课时时长为55分钟的并且((本节预约成功并且下节没有预约)或者(本节预占成功并且下节没有预占))单元格不显示任何文字 -->
              <template
                v-if="
                  (computeClassInfo(weekItem, item).detail !== null &&
                    computeClassInfo(weekItem, item).detail.duration === 55 &&
                    ((computeClassInfo(weekItem, item).hasBookedClass &&
                      !computeClassInfo(weekItem, item).nextBooked) ||
                      (computeClassInfo(weekItem, item).hasScheduledClass &&
                        !computeClassInfo(weekItem, item).nextScheduled))) ||
                  computeClassInfo(weekItem, item).detail === null ||
                  computeClassInfo(weekItem, item).is90MinutesFirstSlot ||
                  computeClassInfo(weekItem, item).is90MinutesThirdSlot
                "
              >
                <div
                  style="width: 100%; height: 100%; position: unset"
                  v-if="computeClassInfo(weekItem, item).hasScheduledClass"
                  :class="computeScheduledClass(weekItem, item)"
                ></div>
              </template>
              <template v-else>
                <div
                  style="width: 100%; height: 100%; position: absolute"
                  v-if="computeClassInfo(weekItem, item).hasScheduledClass"
                  :class="computeScheduledClass(weekItem, item)"
                ></div>
                <span
                  class="l0r0"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img
                    src="../../../assets/group-icon.png"
                    class="small-class-icon mr5"
                    v-if="
                      computeClassInfo(weekItem, item).detail.classTypeId ===
                      ApiConstants.smallGroup
                    "
                  />
                  <img
                    src="../../../assets/group-icon1.png"
                    class="c-group-icon mr5"
                    v-else-if="
                      computeClassInfo(weekItem, item).detail.classTypeId !==
                      ApiConstants.oneByOneClass
                    "
                  />
                  <div class="hidden">
                    <span
                      :title="
                        computeClassInfo(weekItem, item).detail
                          .coursePackageName
                      "
                    >
                      {{
                        computeClassInfo(weekItem, item).detail
                          .coursePackageName
                      }}
                    </span>
                    <br />
                    <span
                      :title="
                        computeClassInfo(weekItem, item).detail.tutorRealName
                      "
                    >
                      {{
                        computeClassInfo(weekItem, item).detail.tutorRealName
                      }}
                    </span>
                  </div>
                  <img
                    src="../../../assets/shi.png"
                    class="c-try-icon ml5"
                    v-if="
                      computeClassInfo(weekItem, item).detail.courseType ===
                      COURSE_TYPE.TRIAL
                    "
                  />
                  <img
                    src="../../../assets/zhan.png"
                    class="c-zhan-icon ml5"
                    v-if="computeClassInfo(weekItem, item).hasScheduledClass"
                  />
                </span>
              </template>
              <!-- 是否是学管约的课 -->
              <span
                class="opsRoleStatus"
                v-if="
                  (computeClassInfo(weekItem, item).hasBookedClass ||
                    computeClassInfo(weekItem, item).hasScheduledClass) &&
                  (computeClassInfo(weekItem, item).nextBooked ||
                    computeClassInfo(weekItem, item).nextScheduled ||
                    computeClassInfo(weekItem, item).detail.duration === 25) &&
                  computeClassInfo(weekItem, item).detail.opsRole ==
                    ApiConstants.opsTeacherAppointCode &&
                  !computeClassInfo(weekItem, item).is90MinutesSecondSlot &&
                  !computeClassInfo(weekItem, item).is90MinutesThirdSlot
                "
              ></span>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <BookCourses
      :showBtn="false"
      v-if="studentInfo"
      :studentInfo="studentInfo"
      ref="BookCourses"
      @closeBookCourses="initCanlender"
    />
    <CancelClassDialog
      @resetCalender="resetCalender"
      :cancelInfo="cancelInfo"
      v-if="showCancelDialog"
      :show="showCancelDialog"
      @closeCancelClassDialog="closeCancelClassDialog"
      :startTimes="startTimes"
      :isUserTimes="isUserTimes"
    ></CancelClassDialog>
    <!-- <MakeClassWithTeacher
      @resetCalender="resetCalender"
      :show="teacherDialog"
      @closeTeacherDialog="closeTeacherDialog"
      :startTimes="startTimes"
      :appointInfo="cancelInfo"
      :isUserTimes="isUserTimes"
      :courseType="handelSlotCourseType"
      :studentInfo="studentInfo"
    ></MakeClassWithTeacher> -->
  </div>
</template>

<script>
import CancelClassDialog from "./CancelClassDialog";
// import MakeClassWithTeacher from "./MakeClassWithTeacher";
import { mapState, mapGetters } from "vuex";
import { COURSE_TYPE } from "@/utils/constants";
import BookCourses from "@/views/scheduleManagement/BookCourses.vue";
import moment from "moment";

export default {
  components: {
    CancelClassDialog,
    // MakeClassWithTeacher,
    BookCourses,
  },
  props: {
    studentInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      COURSE_TYPE,
      list: [],
      options: [],
      week: 0,
      maxWeek: 0,
      monDate: "",
      loading: false,
      showCancelDialog: false,
      // teacherDialog: false,
      startTimes: new Date(),
      cancelInfo: {},
      isUserTimes: false,
      tableHeight: window.innerHeight - 200 || 300,
      time25Arr: [],
      currentWeekArr: [],
      studentTimetableData: null,
      finalStudentTimeTableData: {},
      handelSlotCourseType: null, //课程类型，1：试听，2：正式，3：试听&正式
    };
  },
  watch: {
    isUserTimes(newData) {
      if (newData && !this.studentLoginTz) {
        this.$notify.error({
          title: "提示",
          message: "学生时区课表不可用，请切换至当前时区约课哦(＞人＜；)~",
          duration: 0,
        });
      }
      this.resetCalender();
    },
    currentLang() {
      this.initData();
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
    ...mapState({
      studentLoginTz: (state) => state.user.studentLoginTz,
      userTimeZone: (state) => state.user.userTimeZone,
    }),
    isProduct() {
      return process.env.NODE_ENV == "development" ? false : true;
    },
  },
  methods: {
    toClassInfo(classId) {
      this.$router.push(`/groupManagement/classInfo?id=${classId}&type=2`);
    },
    computeClassInfo(weekItem, item) {
      return this.finalStudentTimeTableData[
        new Date(
          weekItem.getFullYear(),
          weekItem.getMonth(),
          weekItem.getDate(),
          item.split(":")[0],
          item.split(":")[1],
          0
        )
      ];
    },
    initData() {
      this.list = [
        { day: 1, week: this.$t("周一"), cur: false },
        { day: 2, week: this.$t("周二"), cur: false },
        { day: 3, week: this.$t("周三"), cur: false },
        { day: 4, week: this.$t("周四"), cur: false },
        { day: 5, week: this.$t("周五"), cur: false },
        { day: 6, week: this.$t("周六"), cur: false },
        { day: 7, week: this.$t("周日"), cur: false },
      ];
      this.options = [
        {
          value: false,
          label: this.$t("当前时区"),
        },
      ];
    },
    async bookClass(dateItem, timeItem, item) {
      /* 小班课跳转班级详情页面 */
      if (item.detail && item.detail.classId && item.detail.classTypeId === 2) {
        this.toClassInfo(item.detail.classId);
      }
      if (item.isPast) {
        if (!item.hasBookedClass && !item.hasScheduledClass) {
          return;
        } else {
          let now = new Date().getTime(),
            classTime = new Date(
              new Date(
                new Date(dateItem.setHours(timeItem.split(":")[0])).setMinutes(
                  timeItem.split(":")[1]
                )
              ).setSeconds(0)
            ).getTime();
          if (classTime - 2 * 60 * 60 * 1000 < now) {
            return;
          }
        }
      }
      let startTime = new Date(
        dateItem.getFullYear(),
        dateItem.getMonth(),
        dateItem.getDate(),
        timeItem.split(":")[0],
        timeItem.split(":")[1],
        0
      );


      if (item.canBook) {
        /* 约课，弹约课弹窗 */

        // 停留页面时间过长，超过了当前时间，需要刷新页面
        if (startTime < new Date().getTime()) {
          this.resetCalender();
          return;
        }

        this.$refs.BookCourses.handleOpenBookDialog('studentTimeTables');
        this.$refs.BookCourses.formState.bookTimes = [
          { key: new Date().getTime(), value: startTime.toISOString() },
        ];


        setTimeout(() => {
          this.$refs.BookCourses.$refs.bookTime0[0].myDateModel = startTime;
          this.$refs.BookCourses.$refs.bookTime0[0].myTime = moment(
            startTime.toISOString()
          ).format("HH:mm");
          this.$refs.BookCourses.$refs.bookTime0[0].handleDateChange(_, true);
        }, 1000);


      } else if (item.hasBookedClass || item.hasScheduledClass) {
        if (item.detail.classTypeId === this.ApiConstants.oneByOneClass) {
          if (!this.userTimeZone || !this.userTimeZone.length) {
            this.hasNoTimeZoneTips();
            return;
          }
          if (
            item.detail.duration === 55 &&
            !item.nextBooked &&
            !item.nextScheduled
          ) {
            startTime = new Date(startTime.getTime() - 1000 * 60 * 30);
          }
          if (
            !this.Per.handleButtonPer(
              "teach.studentMT.studentInfo.sisfStudentFiles.cancelCourse"
            )
          ) {
            return this.$notify.warning("无取消课程的权限");
          }
          this.startTimes = startTime;
          this.cancelInfo.startTime = startTime;
          this.cancelInfo.startTimeUTC = startTime.toISOString();
          this.cancelInfo.tutorRealName = item.detail.tutorRealName;
          this.cancelInfo.tutorUserId = item.detail.tutorUserId;
          this.cancelInfo.studentName = item.detail.studentUsername;
          this.cancelInfo.coursePackageId = item.detail.coursePackageId;
          this.showCancelDialog = true;
        }
      }
    },
    initCurrentWeekArr() {
      let now = new Date(
          new Date().getTime() + this.week * 7 * 24 * 60 * 60 * 1000
        ),
        arr = [],
        nowDay = now.getDay(),
        nowDate = now.getDate();
      let currentWeekMonday = new Date(
        now.setDate(nowDay === 0 ? nowDate - 6 : nowDate - (nowDay - 1))
      );
      for (let i = 0; i < 7; i++) {
        arr.push(
          new Date(currentWeekMonday.getTime() + i * 24 * 60 * 60 * 1000)
        );
      }
      this.currentWeekArr = arr;
    },
    initTimeArr() {
      let now = new Date(
          new Date().getTime() + this.week * 7 * 24 * 60 * 60 * 1000
        ),
        arr = [];
      for (let hour = 0; hour < 24; hour++) {
        now.setHours(hour);
        arr.push(`${now.getHours()}:00`);
        arr.push(`${now.getHours()}:30`);
      }
      this.time25Arr = arr;
    },
    async initFinalStudentTimeTableData(data) {
      let obj = {},
        finalStudentTimeTableData = {};
      data.forEach((item, index) => {
        item.startTime = new Date(item.startTime);
        item.endTime = new Date(
          new Date(item.startTime).setMinutes(
            new Date(item.startTime).getMinutes() + 25
          )
        );
        obj[item.startTime] = item;
      });
      let currentTime;
      if (this.isUserTimes) {
        currentTime = this.computedUserTimesFun(this.DateTimeUtils.getNextHalfHour().toISOString());
      } else {
        currentTime = this.DateTimeUtils.getNextHalfHour().toISOString();
      }
        
      this.currentWeekArr.forEach((weekItem, weekIndex) => {
        this.time25Arr.forEach((momentItem, momentIndex) => {
          let momentArr = momentItem.split(":"),
            lastMomentArr =
              momentIndex === 0
                ? weekIndex === 0
                  ? null
                  : this.time25Arr[this.time25Arr.length - 1].split(":")
                : this.time25Arr[momentIndex - 1].split(":");
          let year = weekItem.getFullYear(),
            month = weekItem.getMonth(),
            date = weekItem.getDate();
          let key = new Date(year, month, date, momentArr[0], momentArr[1], 0);
          let lastMoment =
            momentIndex === 0
              ? weekIndex === 0
                ? null
                : new Date(
                    this.currentWeekArr[weekIndex - 1].getFullYear(),
                    this.currentWeekArr[weekIndex - 1].getMonth(),
                    this.currentWeekArr[weekIndex - 1].getDate(),
                    lastMomentArr[0],
                    lastMomentArr[1],
                    0
                  )
              : new Date(
                  year,
                  month,
                  date,
                  lastMomentArr[0],
                  lastMomentArr[1],
                  0
                );
          let item = {
            hasBookedClass: false,
            hasScheduledClass: false,
            canBook: true,
            nextBooked: false,
            nextScheduled: false,
            detail: null,
            isPast: false,
            is90Minutes: false,
            is90MinutesFirstSlot: false,
            is90MinutesSecondSlot: false,
            is90MinutesThirdSlot: false,
          };
          if (key.getTime() < new Date(currentTime).getTime()) {
            item.isPast = true;
          }
          if (obj[key]) {
            if (item.isPast) {
              if (
                obj[key].startTime.getTime() - 2 * 60 * 60 * 1000 >
                new Date().getTime()
              ) {
                // 课前两小时不能取消
                item.isPast = false;
              }
            }
            // 0：取消；1：预约成功；2：已发布未预约；3：已预约未发布
            switch (obj[key].status) {
              case 1: {
                item.hasBookedClass = true;
                item.canBook = false;
                item.detail = obj[key];
                if (item.detail.duration === 55) item.nextBooked = true;
                if (item.detail.duration === 90) {
                  item.is90Minutes = true;
                  item.nextBooked = true;
                  item.is90MinutesFirstSlot = true;
                }
                break;
              }
              case 3: {
                item.hasScheduledClass = true;
                item.canBook = false;
                item.detail = obj[key];
                if (item.detail.duration === 55) item.nextScheduled = true;
                if (item.detail.duration === 90) {
                  item.is90Minutes = true;
                  item.nextScheduled = true;
                  item.is90MinutesFirstSlot = true;
                }
                break;
              }
            }
          } else {
            if (
              lastMoment !== null &&
              (finalStudentTimeTableData[lastMoment].nextBooked ||
                finalStudentTimeTableData[lastMoment].nextScheduled)
            ) {
              item.canBook = false;
              item.detail = finalStudentTimeTableData[lastMoment].detail;
              if (finalStudentTimeTableData[lastMoment].nextBooked) {
                item.hasBookedClass = true;
              } else {
                item.hasScheduledClass = true;
              }
              if (finalStudentTimeTableData[lastMoment].is90MinutesFirstSlot) {
                item.is90MinutesSecondSlot = true;
                item.is90Minutes = true;
                if (finalStudentTimeTableData[lastMoment].nextBooked) {
                  item.nextBooked = true;
                } else {
                  item.nextScheduled = true;
                }
              }
            }
          }
          finalStudentTimeTableData[key] = item;
        });
      });
      for (let key in finalStudentTimeTableData) {
        /* 渲染90分钟的第三个slot */
        let lastMoment = new Date(new Date(key).getTime() - 30 * 60 * 1000);
        if (finalStudentTimeTableData[lastMoment]?.is90MinutesSecondSlot) {
          finalStudentTimeTableData[key].is90MinutesThirdSlot = true;
          finalStudentTimeTableData[key].is90Minutes = true;
          finalStudentTimeTableData[key].detail =
            finalStudentTimeTableData[lastMoment].detail;
          if (finalStudentTimeTableData[lastMoment].nextBooked) {
            finalStudentTimeTableData[key].hasBookedClass = true;
          } else {
            finalStudentTimeTableData[key].hasScheduledClass = true;
          }
        }
      }
      this.finalStudentTimeTableData = finalStudentTimeTableData;
    },
    computeScheduledClass(weekItem, item) {
      let moment =
        this.finalStudentTimeTableData[
          new Date(
            weekItem.getFullYear(),
            weekItem.getMonth(),
            weekItem.getDate(),
            item.split(":")[0],
            item.split(":")[1],
            0
          )
        ];
      if (moment.hasScheduledClass) {
        return "willStartClassWrap";
      }
    },
    computeStatusClass(item) {
      if (this.loading) return "";
      let classStr = "";
      if (item.hasBookedClass) {
        classStr += "studentAppointSuccessed";
      } else if (item.hasScheduledClass) {
        classStr += "studentWillStartClass";
      }
      if (!item.is90Minutes && (item.nextBooked || item.nextScheduled)) {
        classStr += " pt60 relative";
      }
      if (
        ((item.hasBookedClass && !item.nextBooked) ||
          (item.hasScheduledClass && !item.nextScheduled)) &&
        item.detail.duration === 55
      ) {
        classStr += " no-relative";
      }
      if (
        (item.detail !== null &&
          item.detail.duration === 55 &&
          !item.nextBooked &&
          !item.nextScheduled) ||
        item.is90MinutesSecondSlot ||
        item.is90MinutesThirdSlot
      ) {
        classStr += " no-top-border";
      }
      if (item.detail !== null && item.detail.duration === 25) {
        classStr += " relative";
      } else if (
        item.detail !== null &&
        item.detail.duration === 55 &&
        ((item.hasBookedClass && item.nextBooked) ||
          (item.hasScheduledClass && item.nextScheduled))
      ) {
        classStr += " lhunset";
      }
      if (item.isPast) classStr += " timePast";
      return classStr;
    },
    /**
     * @description: 请求学生课表
     * @Author: HoMeTown
     * @Date: 2020-03-14 14:49:40
     * @param {Int} week 当前周
     */
    studentTimetable(week) {
      let studentId;
      if (this.$route.query.studentId) {
        studentId = this.$route.query.studentId;
      } else {
        studentId = window.sessionStorage.getItem("student");
      }
      this.loading = true;
      let start = new Date(this.monDate.getTime() + 1000 * 60 * 60 * 24),
        end = new Date(this.monDate.getTime() + 1000 * 60 * 60 * 24 * 8);
      start.setSeconds(0);
      start.setMilliseconds(0);
      start.setHours(0);
      start.setMinutes(0);
      end.setHours(0);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);
      let startUTC = this.DateTimeUtils.handleTimes(start, "-", 24),
        endUTC = this.DateTimeUtils.handleTimes(end, "+", 24);
      this.$Api.studentManagement
        .getStudentTimetables(studentId, startUTC, endUTC)
        .then((res) => {
          if (res.data.code == 200) {
            // let times = [...this.datas[this.week]];
            let resTimes = res.data.data;
            // resTimes[0].duration = 90;
            // resTimes[0].status = 3;
            //如果选择的是学生时区
            if (this.isUserTimes) {
              //换算学生时区的时间
              resTimes.forEach((ite, i) => {
                ite.startTime = this.computedUserTimesFun(ite.startTime);
              });
            }
            this.finalStudentTimeTableData = null;
            this.initFinalStudentTimeTableData(resTimes);
            this.loading = false;
            this.$forceUpdate();
          } else {
          }
        });
    },
    initCanlender() {
      this.makeData();
      this.studentTimetable(this.week);
    },
    /**
     * 计算用户时间差值的方法
     */
    computedUserTimesFun(time) {
      if (this.studentLoginTz) {
        let str = this.studentLoginTz.split(" ");
        let f = str[1][0]; // 运算符
        let num = Number(str[1].slice(1).split("0").join(""));
        return this.DateTimeUtils.handleTimes(time, f, num);
      }
    },
    clickPreWeek() {
      this.week -= 1;
      this.monDate = this.addDay(this.monDate, -7);
      this.$forceUpdate();
      this.resetCalender();
    },
    goBackToNowWeek() {
      this.week = 0;
      var cur = new Date();
      let week = -1 * cur.getDay();
      this.monDate = this.addDay(cur, week);
      this.resetCalender();
    },
    clickNextWeek() {
      this.week += 1;
      this.monDate = this.addDay(this.monDate, 7);
      this.maxWeek = this.week;
      this.resetCalender();
    },
    resetCalender() {
      this.maxWeek = this.week;
      this.initCanlender();
      this.finalStudentTimeTableData = {};
      this.initTimeArr();
      this.initCurrentWeekArr();
    },
    setInitTime(date, h = 0, m = 0) {
      date.setHours(h);
      date.setMinutes(m);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    },
    makeData(time) {
      this.list.forEach((item, index) => {
        item.time = this.addDay(this.monDate, index + 1);
        item.day = this.formartDate(item.time);
      });
    },
    addDay(date, days) {
      date = new Date(date);
      let plusDays = date.getDate() * 1 + days * 1;
      date.setDate(plusDays);
      return date;
    },
    formartDate(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return `${year}.${month}.${day}`;
    },
    closeCancelClassDialog() {
      this.showCancelDialog = false;
    },
    // closeTeacherDialog() {
    //   this.handelSlotCourseType = null;
    //   this.teacherDialog = false;
    // },
  },
  created() {
    this.initData();
    let cur = new Date();
    let week = -1 * cur.getDay();
    if (week == 0) {
      week = -7;
    }
    this.monDate = this.addDay(cur, week);
    this.initCanlender();
    this.initTimeArr();
    this.initCurrentWeekArr();
  },
};
</script>
<style lang="scss" scoped>
.text-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.timeBefore {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
.opsRoleStatus {
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: solid;
  border-color: rgba(255, 0, 0, 0.678) rgba(255, 0, 0, 0.678) transparent
    transparent;
  position: absolute;
  right: 0;
  top: 0;
}
.student-timetables-wrap {
  margin-top: 20px;
  .students-timetables-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .student-timetables-content {
    margin-top: 40px;
    .timetables-time-week {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      background-color: #fff;
      width: 100%;
      .week-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        p {
          margin: 5px 0;
        }
      }
    }
    .timetables-time-table {
      ul {
        li {
          position: relative;
        }
        li.no-top-border {
          border-top: none !important;
        }
        li.lh60 {
          line-height: 60px;
        }
        li.lhunset {
          line-height: unset;
        }
        li.timePast::after {
          content: "";
          display: block;
          background: #f5f5f5;
          opacity: 0.5;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        li.no-relative {
          position: unset;
          &::after {
            display: none;
          }
        }
        li.pt60 {
          &::after {
            height: 202%;
          }
        }
      }
    }
  }
  .times-item {
    flex: 1;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .studentAraeFiled {
    font-size: 12px;
    margin-top: 5px;
    color: red;
  }
  .timetables-time-table {
    width: 100%;
    overflow: auto;
    font-size: 14px;
    border-bottom: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    ul {
      width: 100%;
      display: flex;
      list-style: none;
      padding: 0px;
      margin: 0;
    }
    li {
      border: 1px solid #d9d9d9;
      // width: 163px;
      flex: 1;
      height: 61px;
      text-align: center;
      // line-height: 60px;
      background-color: #fff;
      border-bottom: none;
      border-right: none;
    }
    .studentAppointSuccessed {
      background-color: rgb(218, 133, 47);
      color: #fff;
    }
    .studentWillStartClass {
      background-color: rgb(218, 133, 47);
      color: #000;
    }
  }
  .buttons {
    cursor: pointer;
    color: #666;
    display: flex;
  }
  .button {
    margin-right: 20px;
    cursor: pointer;
    color: #666;
  }
  .button:hover {
    color: #5cc2d0;
  }
  .timeBefore {
    width: 100%;
    height: 100%;
    // background-color: #f5f5f5;
  }
  .relative {
    position: relative;
  }
  .l0r0 {
    position: absolute;
    display: flex;
    justify-content: center;
    left: 10px;
    right: 10px;
  }
  .noChoose {
    position: relative;
  }
  .twelve-hours {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    position: absolute;
    left: 0;
    top: 0;
  }
  .willStartClassWrap {
    width: 100%;
    height: 100%;
    background-color: rgba(204, 204, 204, 0.5);
    position: absolute;
    left: 0;
    top: 0;
  }
  .small-class-icon {
    width: 58px;
    height: 16px;
  }
  .c-group-icon {
    width: 16px;
    height: 16px;
  }
  .c-try-icon {
    width: 16px;
    height: 16px;
  }
  .c-zhan-icon {
    width: 47px;
    height: 16px;
  }
  .flex {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    .noChooseWrap {
      width: 100%;
      height: 100%;
      background-color: rgba(204, 204, 204, 0.5);
    }
  }
}
</style>
