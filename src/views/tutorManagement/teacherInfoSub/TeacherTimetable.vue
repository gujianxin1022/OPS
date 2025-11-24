<template>
  <div class="teacherTimeTableWrap">
    <div class="headerConsole">
      <div>
        <i class="el-icon-arrow-left" @click="clickPreWeek"></i>
        <el-button class="backBtn" @click="goBackToNowWeek">{{
          $t("本周")
        }}</el-button>
        <i class="el-icon-arrow-right" @click="clickNextWeek"></i>
      </div>
      <div class="headerTips">
        <div class="c-dot-blue mr30">
          {{ $t("可预约") }} {{ canSchedulNum }}
        </div>
        <div class="c-dot-purple mr30">
          {{ $t("预约成功") }} {{ successSchedulNum }}
        </div>
        <div class="c-dot-orange mr30">
          {{ $t("邀约中") }} {{ invitingNum }}
        </div>
        <div class="c-dot-ccc mr30">{{ $t("预占") }} {{ pubSchedulNum }}</div>
      </div>
      <div class="teacherName" style="font-size: 14px">
        {{ $t("教师") }}：{{ teacherName }}
      </div>
      <div class="update-timeTable-btn" v-if="isFromTeacher">
        <el-button
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.teacherTimetable.showBookWhiteListBtn'
            )
          "
          type="primary"
          @click="showWhiteList = true"
          >{{ $t("约课白名单") }}</el-button
        >
        <el-button
          @click="updateTimeTable"
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.teacherTimetable.ttPublishTimeFoeTeacher'
            )
          "
          >{{ $t("更新日程表") }}</el-button
        >
      </div>
    </div>
    <div class="tableWrapper" v-loading="teacherTimetableLoading">
      <div class="teableHeader">
        <div class="timesItem">{{ $t("time") }}</div>
        <div v-for="(item, index) in list" :key="index" class="weekItem w150">
          <p>{{ item.week }}</p>
          <p>{{ item.day }}</p>
        </div>
      </div>
      <div class="tableContent" :style="{ height: tableHeight + 'px' }">
        <ul v-for="(timeItem, timeIndex) in time25Arr" :key="timeIndex">
          <li>
            {{ timeItem.split(":")[0] < 10 ? "0" : "" }}{{ timeItem }} -
            {{
              (timeItem.split(":")[1] === "00"
                ? timeItem.split(":")[0]
                : Number(timeItem.split(":")[0]) + 1) < 10
                ? "0"
                : ""
            }}{{
              timeItem.split(":")[1] === "00"
                ? timeItem.split(":")[0]
                : Number(timeItem.split(":")[0]) + 1
            }}:{{ timeItem.split(":")[1] === "00" ? "30" : "00" }}
          </li>
          <li
            v-for="(weekItem, weekIndex) in currentWeekArr"
            :key="weekIndex"
            :class="computeMomentClass(timeItem, weekItem)"
            :data-content="
              computeMomentClass(timeItem, weekItem).includes('show-formal-tag')
                ? $t('仅正式')
                : $t('仅试听')
            "
            @click="publishClass(timeItem, weekItem)"
          >
            <template
              v-if="
                teacherTimetableObj[
                  new Date(
                    weekItem.getFullYear(),
                    weekItem.getMonth(),
                    weekItem.getDate(),
                    timeItem.split(':')[0],
                    timeItem.split(':')[1],
                    0
                  )
                ]
              "
            >
              <!-- 什么都不显示: 强占30min的，没发布的，发布未预约的， 55分钟的下半节并且下半节不是凌晨00：00; 90分钟1,3slot -->
              <template v-if="isEmptySlot(weekItem, timeItem)">
                <div
                  v-if="
                    !teacherTimetableObj[
                      new Date(
                        weekItem.getFullYear(),
                        weekItem.getMonth(),
                        weekItem.getDate(),
                        timeItem.split(':')[0],
                        timeItem.split(':')[1],
                        0
                      )
                    ].hasBooked &&
                    !teacherTimetableObj[
                      new Date(
                        weekItem.getFullYear(),
                        weekItem.getMonth(),
                        weekItem.getDate(),
                        timeItem.split(':')[0],
                        timeItem.split(':')[1],
                        0
                      )
                    ].hasScheduled &&
                    !teacherTimetableObj[
                      new Date(
                        weekItem.getFullYear(),
                        weekItem.getMonth(),
                        weekItem.getDate(),
                        timeItem.split(':')[0],
                        timeItem.split(':')[1],
                        0
                      )
                    ].isInviteTime
                  "
                ></div>
              </template>
              <template v-else>
                <div>
                  <span
                    @click.stop=""
                    :title="
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(':')[0],
                          timeItem.split(':')[1],
                          0
                        )
                      ].detail.classTypeId !== ApiConstants.oneByOneClass
                        ? teacherTimetableObj[
                            new Date(
                              weekItem.getFullYear(),
                              weekItem.getMonth(),
                              weekItem.getDate(),
                              timeItem.split(':')[0],
                              timeItem.split(':')[1],
                              0
                            )
                          ].detail.className
                        : teacherTimetableObj[
                            new Date(
                              weekItem.getFullYear(),
                              weekItem.getMonth(),
                              weekItem.getDate(),
                              timeItem.split(':')[0],
                              timeItem.split(':')[1],
                              0
                            )
                          ].detail.studentUsername
                    "
                  >
                    {{
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(":")[0],
                          timeItem.split(":")[1],
                          0
                        )
                      ].detail.classTypeId !== ApiConstants.oneByOneClass
                        ? teacherTimetableObj[
                            new Date(
                              weekItem.getFullYear(),
                              weekItem.getMonth(),
                              weekItem.getDate(),
                              timeItem.split(":")[0],
                              timeItem.split(":")[1],
                              0
                            )
                          ].detail.className
                        : teacherTimetableObj[
                            new Date(
                              weekItem.getFullYear(),
                              weekItem.getMonth(),
                              weekItem.getDate(),
                              timeItem.split(":")[0],
                              timeItem.split(":")[1],
                              0
                            )
                          ].detail.studentUsername
                    }}
                  </span>
                  <img
                    src="../../../assets/group-icon1.png"
                    class="c-group-icon"
                    v-if="
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(':')[0],
                          timeItem.split(':')[1],
                          0
                        )
                      ].detail &&
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(':')[0],
                          timeItem.split(':')[1],
                          0
                        )
                      ].detail.classTypeId !== ApiConstants.oneByOneClass
                    "
                  />
                  <img
                    src="../../../assets/shi.png"
                    class="c-try-icon"
                    v-if="
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(':')[0],
                          timeItem.split(':')[1],
                          0
                        )
                      ].hasBooked &&
                      teacherTimetableObj[
                        new Date(
                          weekItem.getFullYear(),
                          weekItem.getMonth(),
                          weekItem.getDate(),
                          timeItem.split(':')[0],
                          timeItem.split(':')[1],
                          0
                        )
                      ].detail.courseType === COURSE_TYPE.TRIAL
                    "
                  />
                </div>
              </template>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="cancel-class-wrap">
      <el-dialog
        :title="$t('预约课程')"
        :close-on-click-modal="false"
        :show-close="true"
        :visible.sync="show"
        :before-close="close"
        width="500px"
        append-to-body
        center
      >
        <div class="dialog-content-wrap">
          <el-tabs stretch v-model="tabsActive" v-if="classInfo">
            <el-tab-pane :label="$t('单次约课')" name="appointSingle">
              <div class="appointSingle">
                <p>{{ $t("教师") }}：{{ teacherName }}</p>
                <p>
                  {{ $t("my-home-Student") }}：{{
                    $route.query.studentName || studentNameFromSession
                  }}
                </p>
                <p v-if="classInfo">
                  {{ $t("上课时间") }}：{{
                    DateTimeUtils.dateClockTime(classInfo.startTime)
                  }}
                </p>
                <p v-if="classInfo">
                  {{ $t("用户本地上课时间") }}：{{
                    toUserTimeZoneTime(userTimeZone, classInfo.startTime)
                  }}
                </p>
              </div>
              <!-- <div v-else class="noMoney">{{$t('用户课时余额为0或更少，无法约课')}}</div> -->
            </el-tab-pane>
            <el-tab-pane :label="$t('多次约课')" name="appointMore">
              <div class="appointMore">
                <div class="block">
                  <div>
                    <span>{{ $t("开始日期") }}：</span>
                    <el-date-picker
                      v-model="classInfo.startTime"
                      disabled
                      size="small"
                      class="w150"
                      type="date"
                      :placeholder="$t('选择日期')"
                    ></el-date-picker>
                  </div>
                  <div>
                    <span>{{ $t("结束日期") }}：</span>
                    <el-date-picker
                      :picker-options="pickerOptions"
                      v-model="endTimes"
                      type="date"
                      class="w150"
                      :placeholder="$t('选择日期')"
                    ></el-date-picker>
                  </div>
                </div>
                <p>{{ $t("教师") }}：{{ teacherName }}</p>
                <p>
                  {{ $t("my-home-Student") }}：{{
                    $route.query.studentName || studentNameFromSession
                  }}
                </p>
                <p v-if="classInfo">
                  {{ $t("上课时间") }}：{{
                    DateTimeUtils.dateClockTime(classInfo.startTime).split(
                      " "
                    )[1]
                  }}
                </p>
                <p v-if="classInfo">
                  {{ $t("用户本地开始时间") }}：{{ multipleBookingStartTime }}
                </p>
              </div>
              <!-- <div v-else class="noMoney">{{$t('用户余额不足5课时，无法多次约课')}}</div> -->
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close">{{ $t("close") }}</el-button>
          <el-button
            :loading="appointLoading"
            type="primary"
            @click="sureAppoint"
            >{{ $t("Book") }}</el-button
          >
        </div>
      </el-dialog>
    </div>
    <template v-if="conflictTimeData && showConflictTimeDialog">
      <ConflictTimeDialog
        :data="conflictTimeData"
        :show="showConflictTimeDialog"
        @close="showConflictTimeDialog = false"
      />
    </template>
    <BookParentWhiteList
      v-if="showWhiteList"
      :tutorUserId="teacherId"
      :dialogVisible.sync="showWhiteList"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { COURSE_TYPE } from "@/utils/constants";
import { ABNORMAL_CODE } from "@/utils/constants";
import { toUserTimeZoneTime } from "@/utils/timeZone";
import * as momentLibrary from "moment";
import ConflictTimeDialog from "./components/ConflictTimeDialog.vue";
import BookParentWhiteList from "./components/BookParentWhiteList.vue";
export default {
  name: "teacherTimetable",
  components: { ConflictTimeDialog, BookParentWhiteList },
  props: {
    teacherId: {
      type: Number,
      default: -1,
    },
    teacherName: {
      type: String,
      default: "",
    },
    startTimes: {
      type: Date,
      default: () => new Date(),
    },
    isFromSmallClass: {
      type: Boolean,
      default: false,
    },
    isFromTeacher: {
      type: Boolean,
      default: false,
    },
    isUserTimes: {
      type: Boolean,
      default: false,
    },
    showTeacherTimetable: {
      type: Boolean,
      default: false,
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
    source: {
      /* 埋点相关 */ type: String,
      default: null,
    },
    isAuditionClass: {
      /* 埋点相关 */ type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showWhiteList: false,
      COURSE_TYPE,
      teacherTimetableLoading: false,
      successSchedulNum: 0,
      canSchedulNum: 0,
      pubSchedulNum: 0,
      invitingNum: 0,
      list: [],
      datas: { 0: [], length: this.maxWeek },
      week: 0,
      maxWeek: 0,
      monDate: "",
      dateStr: "",
      loading: false,
      appointLoading: false,
      show: false,
      endTimes: null,
      tabsActive: "appointSingle",
      classInfo: null,
      tableHeight: window.innerHeight - 200 || 300,
      pushDateTimes: [],
      time25Arr: [],
      currentWeekArr: [],
      teacherTimetableObj: {},
      publishStartTimes: [],
      conflictTimeData: null,
      showConflictTimeDialog: false,
    };
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < this.classInfo.startTime.getTime();
        },
      };
    },
    ...mapState({
      studentLoginTz: (state) => state.user.studentLoginTz,
      userTimeZone: (state) => state.user.userTimeZone,
    }),
    ...mapGetters(["currentLang"]),
    isProduct() {
      return process.env.NODE_ENV == "development" ? false : true;
    },
    studentNameFromSession() {
      return window.sessionStorage.getItem("studentName");
    },
    multipleBookingStartTime() {
      return toUserTimeZoneTime(
        this.userTimeZone,
        this.classInfo.startTime.toISOString()
      );
    },
  },
  watch: {
    dateStr(newData, oldData) {
      var cur = new Date(newData);
      let week = -1 * cur.getDay();
      this.monDate = this.addDay(cur, week);
    },
    showTeacherTimetable() {
      this.initCanlender();
    },
    currentLang() {
      this.initData();
    },
  },
  methods: {
    toUserTimeZoneTime,
    /**
     * 什么都不显示:
     * 1、强占30min的
     * 2、没发布的
     * 3、发布未预约的
     * 4、55分钟的下半节并且下半节不是凌晨00：00;
     * 5\6、90分钟1,3slot
     * 7、邀约中的55分钟下半节不是凌晨00：00的;
     *
     * */
    isEmptySlot(weekItem, timeItem) {
      let moment = new Date(
        weekItem.getFullYear(),
        weekItem.getMonth(),
        weekItem.getDate(),
        timeItem.split(":")[0],
        timeItem.split(":")[1],
        0
      );
      let flagState = {
        flag1: this.teacherTimetableObj[moment].hasforciblyOccupy30Min,
        flag2:
          !this.teacherTimetableObj[moment].hasPublished &&
          !this.teacherTimetableObj[moment].isInviteTime,
        flag3:
          this.teacherTimetableObj[moment].hasPublished &&
          this.teacherTimetableObj[moment].detail === null,
        flag4:
          this.teacherTimetableObj[moment].detail !== null &&
          this.teacherTimetableObj[moment].detail.duration === 55 &&
          timeItem !== "0:00" &&
          !this.teacherTimetableObj[moment].nextNeedCompute,
        flag5: this.teacherTimetableObj[moment].is90MinutesFirstSlot,
        flag6: this.teacherTimetableObj[moment].is90MinutesThirdSlot,
        flag7:
          this.teacherTimetableObj[moment].isInviteTime &&
          !this.teacherTimetableObj[moment].nextNeedCompute,
      };
      const { flag1, flag2, flag3, flag4, flag5, flag6, flag7 } = flagState;
      let flag = flag1 || flag2 || flag3 || flag4 || flag5 || flag6 || flag7;
      return flag;
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
    },
    close() {
      this.endTimes = null;
      this.show = false;
    },
    publishClass(timeItem, dateItem) {
      let moment = new Date(
          dateItem.getFullYear(),
          dateItem.getMonth(),
          dateItem.getDate(),
          timeItem.split(":")[0],
          timeItem.split(":")[1],
          0
        ),
        item = this.teacherTimetableObj[moment];
      if (item.isInviteTime) return;
      if (this.isFromTeacher) {
        if (!item.hasPublished && !item.isPast && !item.toBePublish) {
          this.$set(item, "toBePublish", true);
          this.publishStartTimes.push(moment.toISOString());
          this.$set(
            item,
            "toBePublishIndex",
            this.publishStartTimes.length - 1
          );
        } else if (item.toBePublish) {
          this.publishStartTimes = this.publishStartTimes.filter(
            (item) => item !== moment.toISOString()
          );
          this.$set(item, "toBePublish", false);
        }
      } else if (!this.isFromSmallClass) {
        if (
          item.hasPublished &&
          !item.isPast &&
          !item.hasBooked &&
          !item.hasScheduled
        ) {
          this.classInfo = {};
          this.$set(this.classInfo, "startTime", moment);
          this.$set(this.classInfo, "tutorUserId", item);
          this.show = true;
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
        ),
        currentWeekMondayDate = currentWeekMonday.getDate();
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
    initCanlender() {
      this.makeData();
      this.initTimeArr();
      this.initCurrentWeekArr();
      this.tutorTimetable(this.week);
    },
    tutorTimetable(week) {
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
      let startUTC = start.toISOString(),
        endUTC = end.toISOString(),
        params = {
          tutor_user_id: this.teacherId,
          start_time: startUTC,
          end_time: endUTC,
          week: this.week,
        };
      this.loading = true;
      this.successSchedulNum = 0;
      this.pubSchedulNum = 0;
      this.canSchedulNum = 0;
      this.invitingNum = 0;
      this.teacherTimetableLoading = true;
      this.$Api.teacherManagement.teacherTimetable(params).then((res) => {
        let resTimes = res.data.data;
        //如果选择的是学生时区
        if (this.isUserTimes) {
          //换算学生时区的时间
          resTimes.tutorPublishTimetableList.forEach((ite, i) => {
            ite.startTime = this.computedUserTimesFun(ite.startTime);
          });
          resTimes.tutorInviteTimetableList.forEach((ite, i) => {
            ite.startTime = this.computedUserTimesFun(ite.startTime);
          });
          resTimes.tutorTimetableList.forEach((ite, i) => {
            ite.startTime = this.computedUserTimesFun(ite.startTime);
          });
        }
        let currentTime = new Date();
        if (this.isUserTimes && this.studentLoginTz) {
          let str = this.studentLoginTz.split(" ");
          let f = str[1][0]; // 运算符
          let num = Number(str[1].slice(1).split("0").join(""));
          currentTime = new Date(
            this.DateTimeUtils.handleTimes(currentTime.toISOString(), f, num)
          ); //时间 运算符 小时
        }
        let publishObj = {},
          auditionObj = {},
          formalObj = {},
          timetableObj = {},
          inviteTimetableObj = {},
          obj = {};
        /* 老师发布slots */
        resTimes.tutorPublishTimetableList &&
          resTimes.tutorPublishTimetableList.forEach(
            (momentItem, momentIndex) => {
              publishObj[new Date(momentItem.startTime)] = momentItem;
            }
          );
        if (
          this.Per.handleButtonPer(
            "teach.tutorMT.teacherTimetable.showSlotsTag"
          )
        ) {
          /* 仅试听slots类型标签 */
          resTimes.tutorAuditionTimetableList &&
            resTimes.tutorAuditionTimetableList.forEach((momentItem) => {
              auditionObj[new Date(momentItem.startTime)] = momentItem;
            });
          /* 仅正式slots类型标签 */
          resTimes.tutorFormalTimetableList &&
            resTimes.tutorFormalTimetableList.forEach((momentItem) => {
              formalObj[new Date(momentItem.startTime)] = momentItem;
            });
        }

        /* 邀约slots */
        this.invitingNum = resTimes.tutorInviteTimetableList?.length || 0;
        resTimes.tutorInviteTimetableList &&
          resTimes.tutorInviteTimetableList.forEach((classItem, classIndex) => {
            if (classItem.duration === 55) {
              let key = new Date(
                new Date(classItem.startTime).getTime() + 1000 * 60 * 30
              ).toISOString();
              // 55分钟的预占课，老师发布了下半个时间点
              if (publishObj[new Date(key)]) {
                let classItemCopy = JSON.parse(JSON.stringify(classItem));
                inviteTimetableObj[new Date(key)] = classItemCopy;
              } else {
                inviteTimetableObj[new Date(key)] = classItem;
              }
            }

            // 55分钟的课老师发布了上半个时间点
            if (publishObj[new Date(classItem.startTime)]) {
              classItem = JSON.parse(JSON.stringify(classItem));
            }
            inviteTimetableObj[new Date(classItem.startTime)] = classItem;
          });

        /* 课表slots */
        resTimes.tutorTimetableList &&
          resTimes.tutorTimetableList.forEach((classItem, classIndex) => {
            if (
              classItem.status === this.ApiConstants.studentAppointSuccessed
            ) {
              this.successSchedulNum++;
            } else if (
              classItem.status !== this.ApiConstants.forciblyOccupy30Min
            ) {
              this.pubSchedulNum++;
            }
            if (classItem.duration === 55) {
              let key = new Date(
                new Date(classItem.startTime).getTime() + 1000 * 60 * 30
              ).toISOString();

              // 55分钟的预占课，老师发布了下半个时间点
              if (
                publishObj[new Date(key)] &&
                classItem.status === this.ApiConstants.studentWillStartClass
              ) {
                let classItemCopy = JSON.parse(JSON.stringify(classItem));
                classItemCopy.status =
                  this.ApiConstants.studentAppointSuccessed;
                timetableObj[new Date(key)] = classItemCopy;
              } else {
                timetableObj[new Date(key)] = classItem;
              }
            }
            // 55分钟的课老师发布了上半个时间点
            // if (
            //   publishObj[new Date(classItem.startTime)] &&
            //   classItem.status === this.ApiConstants.studentWillStartClass
            // ) {
            //   classItem = JSON.parse(JSON.stringify(classItem));
            //   classItem.status = 1;
            // }
            /* 90分钟逻辑 */
            if (classItem.duration === 90) {
              let secondSlotKey = new Date(
                new Date(classItem.startTime).getTime() + 1000 * 60 * 30
              ).toISOString();
              let thirdSlotKey = new Date(
                new Date(classItem.startTime).getTime() + 1000 * 60 * 60
              ).toISOString();
              classItem = JSON.parse(JSON.stringify(classItem));
              classItem.is90Minutes = true;
              classItem.is90MinutesFirstSlot = true;
              timetableObj[new Date(secondSlotKey)] = {
                ...classItem,
                is90MinutesSecondSlot: true,
                is90MinutesFirstSlot: false,
              };
              timetableObj[new Date(thirdSlotKey)] = {
                ...classItem,
                is90MinutesFirstSlot: false,
                is90MinutesSecondSlot: false,
                is90MinutesThirdSlot: true,
              };
            }
            timetableObj[new Date(classItem.startTime)] = classItem;
          });
        this.currentWeekArr.forEach((dateItem, dateIndex) => {
          this.time25Arr.forEach((momentItem, momentIndex) => {
            let momentArr = momentItem.split(":"),
              lastMomentArr =
                momentIndex === 0
                  ? dateIndex === 0
                    ? null
                    : this.time25Arr[this.time25Arr.length - 1].split(":")
                  : this.time25Arr[momentIndex - 1].split(":");
            let year = dateItem.getFullYear(),
              month = dateItem.getMonth(),
              date = dateItem.getDate();
            let moment = new Date(
              year,
              month,
              date,
              momentArr[0],
              momentArr[1],
              0
            );
            let lastMoment =
              momentIndex === 0
                ? dateIndex === 0
                  ? null
                  : new Date(
                      this.currentWeekArr[dateIndex - 1].getFullYear(),
                      this.currentWeekArr[dateIndex - 1].getMonth(),
                      this.currentWeekArr[dateIndex - 1].getDate(),
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
              hasPublished: false,
              hasBooked: false,
              hasScheduled: false,
              isPast: false,
              isInviteTime: false,
              detail: null,
              nextNeedCompute: false,
              hasforciblyOccupy30Min: false,
              hasNextForciblyOccupy30Min: false,
              is90Minutes: false,
              is90MinutesFirstSlot: false,
              is90MinutesSecondSlot: false,
              is90MinutesThirdSlot: false,
              isAuditionTimeSlot: false,
              isFormalTimeSlot: false,
            };
            if (publishObj[moment]) {
              item.hasPublished = true;
            }
            if (auditionObj[moment]) {
              item.isAuditionTimeSlot = true;
            }
            if (formalObj[moment]) {
              item.isFormalTimeSlot = true;
            }
            if (inviteTimetableObj[moment]) {
              item.isInviteTime = true;
              item.detail = inviteTimetableObj[moment];
              if (
                inviteTimetableObj[moment].duration === 55 &&
                new Date(inviteTimetableObj[moment].startTime).getTime() ===
                  moment.getTime()
              ) {
                item.nextNeedCompute = true;
              }
            }
            if (timetableObj[moment]) {
              item.isInviteTime = false;
              item.detail = timetableObj[moment];
              if (
                timetableObj[moment].status ===
                this.ApiConstants.forciblyOccupy30Min
              ) {
                item.hasforciblyOccupy30Min = true;
                item.hasBooked = true;
              } else if (
                timetableObj[moment].status ===
                this.ApiConstants.studentAppointSuccessed
              ) {
                item.hasBooked = true;
              } else {
                item.hasScheduled = true;
              }
              item.hasPublished = true;
              if (
                timetableObj[moment].duration === 55 &&
                new Date(timetableObj[moment].startTime).getTime() ===
                  moment.getTime()
              ) {
                item.nextNeedCompute = true;
              } else {
                item.nextNeedCompute = false;
              }
              if (timetableObj[moment].duration === 55) {
                const forciblyOccupyItem =
                  timetableObj[
                    new Date(
                      momentLibrary(timetableObj[moment].startTime).add(1, "h")
                    )
                  ];
                if (
                  forciblyOccupyItem?.status ===
                  this.ApiConstants.forciblyOccupy30Min
                ) {
                  item.hasNextForciblyOccupy30Min = true;
                }
              }
              if (timetableObj[moment].duration === 25) {
                const forciblyOccupyItem =
                  timetableObj[
                    new Date(
                      momentLibrary(timetableObj[moment].startTime).add(
                        0.5,
                        "h"
                      )
                    )
                  ];
                if (
                  forciblyOccupyItem?.status ===
                  this.ApiConstants.forciblyOccupy30Min
                ) {
                  item.hasNextForciblyOccupy30Min = true;
                }
              }
            }

            // 确定55分钟的课下半节状态
            /* 邀约中的55分钟 */
            // if (obj[lastMoment] && obj[lastMoment].nextNeedCompute) {
            //   item.detail = obj[lastMoment].detail;
            // }
            /* 老师课表 */
            if (obj[lastMoment] && obj[lastMoment].nextNeedCompute) {
              if (
                timetableObj[moment]?.status === this.studentAppointSuccessed
              ) {
                item.hasBooked = true;
                item.hasPublished = true;
                item.detail = obj[lastMoment].detail;
              } else if (
                timetableObj[moment]?.status === this.studentWillStartClass
              ) {
                item.hasScheduled = true;
                item.hasPublished = true;
                item.detail = obj[lastMoment].detail;
              }
            }
            // 计算是否过去
            if (moment.getTime() < currentTime) item.isPast = true;
            // 计算可以约课的课堂数
            if (
              !item.isPast &&
              item.hasPublished &&
              !item.hasBooked &&
              !item.hasScheduled
            ) {
              this.canSchedulNum++;
            }
            if (item.isInviteTime) {
              item.hasPublished = false;
            }
            if (item.detail?.duration === 90) {
              item.is90Minutes = item.detail.is90Minutes || false;
              item.is90MinutesFirstSlot =
                item.detail.is90MinutesFirstSlot || false;
              item.is90MinutesSecondSlot =
                item.detail.is90MinutesSecondSlot || false;
              item.is90MinutesThirdSlot =
                item.detail.is90MinutesThirdSlot || false;
            }
            obj[moment] = item;
          });
        });
        this.teacherTimetableObj = obj;
        this.loading = false;
        this.$forceUpdate();
        this.teacherTimetableLoading = false;
      });
    },
    computeMomentClass(timeItem, dateItem) {
      if (this.teacherTimetableLoading) return "";
      let moment = new Date(
          dateItem.getFullYear(),
          dateItem.getMonth(),
          dateItem.getDate(),
          timeItem.split(":")[0],
          timeItem.split(":")[1],
          0
        ),
        classStr = "",
        item = this.teacherTimetableObj[moment];
      if (
        item.hasPublished &&
        !item.hasBooked &&
        !item.hasScheduled &&
        !item.isPast
      ) {
        classStr += " teacherTimetablePubNotAppoint";
      }

      if (item.hasBooked) classStr += " teacherTimetableSuccessed";
      if (item.hasBooked && item.nextNeedCompute && timeItem !== "23:30") {
        classStr += " top20";
      }

      if (
        (item.hasBooked &&
          !item.nextNeedCompute &&
          item.detail.duration === 55 &&
          !item.isInviteTime &&
          timeItem !== "0:00") ||
        (timeItem !== "0:00" &&
          (item.is90MinutesSecondSlot || item.is90MinutesThirdSlot))
      )
        classStr += " no-top-border";
      if (item.hasScheduled) classStr += " teacherTimetableAppointNotPub";
      if (item.hasScheduled && item.nextNeedCompute) classStr += " top20";
      if (
        item.hasScheduled &&
        !item.nextNeedCompute &&
        item.detail.duration === 55
      )
        classStr += " no-top-border";
      if (item.isPast) classStr += " timeBefore";
      if (item.toBePublish) classStr += " preRelease";
      if (item.hasforciblyOccupy30Min && timeItem !== "0:00")
        classStr += " no-top-border";
      if (
        item.hasNextForciblyOccupy30Min &&
        item.detail.duration === 25 &&
        timeItem !== "23:30"
      )
        classStr += " top20";
      if (
        item.hasNextForciblyOccupy30Min &&
        item.detail.duration === 55 &&
        timeItem !== "23:00"
      )
        classStr += " top40";

      if (item.isInviteTime) {
        classStr += " inviting";
        if (
          item.detail.duration == 55 &&
          !item.nextNeedCompute &&
          timeItem !== "0:00"
        ) {
          classStr += " no-top-border";
        }
        if (item.detail.duration == 55 && item.nextNeedCompute) {
          classStr += " top20";
        }
      }
      if (item.isAuditionTimeSlot) {
        classStr += " show-audition-tag";
      }
      if (item.isFormalTimeSlot) {
        classStr += " show-formal-tag";
      }

      return classStr;
    },

    /**
     * 确认约课
     */
    sureAppoint() {
      if (this.appointLoading) return;
      this.appointLoading = true;
      if (this.tabsActive == "appointSingle") {
        //这里是单次约课
        let { startTime } = this.classInfo;
        //判断如果当前选择的是学生的时区
        if (this.isUserTimes && this.studentLoginTz) {
          let str = this.studentLoginTz.split(" ");
          let f = str[1][0]; // 运算符
          let num = Number(str[1].slice(1).split("0").join(""));
          startTime = new Date(
            this.DateTimeUtils.appointTimes(startTime.toISOString(), f, num)
          ); //时间 运算符 小时
        }
        let params = {
          opsRole: this.ApiConstants.opsTeacherAppointCode,
          startTime: startTime.toISOString(),
          startTimeFinal: startTime.toISOString(),
          studentUserId:
            this.$route.query.studentId ||
            window.sessionStorage.getItem("student"),
          tutorUserId: this.teacherId,
          coursePackageId: this.coursePackageId,
        };
        this.$Api.studentManagement.appointClass(params).then((res) => {
          if (res.status == 200 && res.data.code == 200) {
            this.$notify({
              message: this.$t("约课成功"),
              type: "success",
            });
            this.appointLoading = false;
            this.resetCalender();
            this.close();
          } else {
            this.errorHandlingFunction(res.data);
            this.appointLoading = false;
          }
        });
      } else {
        //这里是多次约课
        let { startTime } = this.classInfo;
        let endTimes = this.endTimes;
        //判断如果当前选择的是学生的时区
        if (this.isUserTimes && this.studentLoginTz) {
          let str = this.studentLoginTz.split(" ");
          let f = str[1][0]; // 运算符
          let num = Number(str[1].slice(1).split("0").join(""));
          startTime = new Date(
            this.DateTimeUtils.appointTimes(startTime.toISOString(), f, num)
          ); //时间 运算符 小时
          endTimes = new Date(
            this.DateTimeUtils.appointTimes(endTimes.toISOString(), f, num)
          );
        }
        if (startTime.getDay() !== endTimes.getDay()) {
          // 开始星期非零
          if (startTime.getDay() > 0) {
            // 结束时间非零
            if (endTimes.getDay() > 0) {
              if (endTimes.getDay() > startTime.getDay()) {
                endTimes = new Date(
                  new Date(
                    new Date(
                      endTimes.getTime() -
                        (endTimes.getDay() - startTime.getDay()) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).setHours(startTime.getHours())
                  ).setMinutes(startTime.getMinutes())
                );
              } else {
                endTimes = new Date(
                  new Date(
                    new Date(
                      endTimes.getTime() -
                        (6 - startTime.getDay() + endTimes.getDay()) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).setHours(startTime.getHours())
                  ).setMinutes(startTime.getMinutes())
                );
              }
              endTimes = new Date(
                new Date(
                  new Date(
                    endTimes.getTime() +
                      (startTime.getDay() - endTimes.getDay()) *
                        24 *
                        60 *
                        60 *
                        1000
                  ).setHours(startTime.getHours())
                ).setMinutes(startTime.getMinutes())
              );
            } else {
              endTimes = new Date(
                new Date(
                  new Date(
                    endTimes.getTime() -
                      (7 - startTime.getDay()) * 24 * 60 * 60 * 1000
                  ).setHours(startTime.getHours())
                ).setMinutes(startTime.getMinutes())
              );
            }
            // 开始星期为0
          } else {
            endTimes = new Date(
              new Date(
                new Date(
                  endTimes.getTime() - endTimes.getDay() * 24 * 60 * 60 * 1000
                ).setHours(startTime.getHours())
              ).setMinutes(startTime.getMinutes())
            );
          }
        } else {
          endTimes = new Date(
            new Date(endTimes.setHours(startTime.getHours())).setMinutes(
              startTime.getMinutes()
            )
          );
        }
        let params = {
          opsRole: this.ApiConstants.opsTeacherAppointCode,
          startTime: startTime.toISOString(),
          startTimeFinal: endTimes.toISOString(),
          studentUserId:
            this.$route.query.studentId ||
            window.sessionStorage.getItem("student"),
          tutorUserId: this.teacherId,
          coursePackageId: this.coursePackageId,
        };
        this.$Api.studentManagement.appointClass(params).then((res) => {
          if (res.status == 200 && res.data.code == 200) {
            this.$notify({
              message: this.$t("约课成功"),
              type: "success",
            });
            this.appointLoading = false;
            this.resetCalender();
            this.close();
          } else {
            this.errorHandlingFunction(res.data);
            this.appointLoading = false;
          }
        });
      }
    },
    errorHandlingFunction({ code, data }) {
      switch (code) {
        case ABNORMAL_CODE.releaseOrAppointmentTimeConflict:
          this.$notify({
            message: this.$t("发布或者约课时间有冲突"),
            type: "error",
          });
          this.appointmentStatusDesc = this.$t("发布或者约课时间有冲突");
          break;
        case ABNORMAL_CODE.partStudentTimeBooked:
          this.$notify({
            message: this.$t(
              "由于学生部分时间被占，无法预约，请选择其他时间进行批量约课。"
            ),
            type: "error",
          });
          this.appointmentStatusDesc = this.$t("学生部分时间被占");
          break;
        case ABNORMAL_CODE.allStudentTimeBooked:
          this.$notify({
            message: this.$t("由于学生时间被占，无法预约，请选择其他时间"),
            type: "error",
          });
          this.appointmentStatusDesc = this.$t("学生全部时间被占");
          break;
        case ABNORMAL_CODE.allTeacherTimeBooked:
          this.$notify({
            message: this.$t("由于老师时间被占，无法预约，请选择其他时间"),
            type: "error",
          });
          this.appointmentStatusDesc = this.$t("老师时间全部被占");
          break;
        case ABNORMAL_CODE.partOfTeacherTimeBooked:
          this.appointmentStatusDesc = this.$t("老师时间部分被占");
          this.conflictTimeData = data;
          this.showConflictTimeDialog = true;
          break;
      }
    },
    /**
     * 判断十二小时
     */
    computedTwelvehours(sitem) {
      if (this.isProduct) {
        //生产环境 增加十二小时限制
        if (this.isUserTimes) {
          // 用户时区
          let startTime = new Date(sitem.startTimeUTC).getTime();
          let afterDate = new Date(
            this.computedUserTimesFun(
              this.DateTimeUtils.addTime12Hours(Date.now())
            )
          ).getTime();
          if (startTime < afterDate) {
            sitem.twelveHours = true;
            return "twelve-hours";
          }
        } else {
          // 本地时区
          let startTime = new Date(sitem.startTime).getTime();
          let afterDate = this.DateTimeUtils.addTime12Hours(
            Date.now()
          ).getTime();
          if (startTime < afterDate) {
            sitem.twelveHours = true;
            return "twelve-hours";
          }
        }
      } else {
        //dev环境
      }
    },
    // 请求老师课表
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
      this.datas.length = this.maxWeek;
      this.resetCalender();
    },
    resetCalender() {
      this.maxWeek = this.week;
      this.datas = { 0: [], length: this.maxWeek };
      this.initCanlender();
    },
    setInitTime(date, h = 0, m = 0) {
      date.setHours(h);
      date.setMinutes(m);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
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
    makeData(time) {
      this.list.forEach((item, index) => {
        item.time = this.addDay(this.monDate, index + 1);
        item.day = this.formartDate(item.time);
      });
    },
    appointClassFn(sitem) {
      // 判断如果弹窗打开自小班课，那么不允许用户进行约课
      if (sitem.status != null) {
        //已经发布的课。。。或者已经被约的课
        if (
          this.isFromSmallClass ||
          sitem.noChoose ||
          sitem.isBefore ||
          this.isFromTeacher
        ) {
          return;
        }
        let { status } = sitem;
        let { teacherTimetablePubNotAppoint } = this.ApiConstants;
        if (status == teacherTimetablePubNotAppoint) {
          // 发布未预约 && 没有过时间就可以约了
          this.classInfo = sitem;
          this.show = true;
        }
      } else {
        // 老师未发布的课 如果来自老师信息页才可以约课
        if (this.isFromTeacher) {
          if (sitem.preRelease) {
            sitem.preRelease = false;
            let time = sitem.startTimeUTC,
              i = this.pushDateTimes.findIndex((t) => t == time);
            this.pushDateTimes.splice(i, 1);
          } else {
            sitem.preRelease = true;
            this.pushDateTimes.push(sitem.startTimeUTC);
          }
          this.$forceUpdate();
        }
      }
    },
    computedUserTimesFun(time) {
      if (this.studentLoginTz) {
        let str = this.studentLoginTz.split(" ");
        let f = str[1][0]; // 运算符
        let num = Number(str[1].slice(1).split("0").join(""));
        return this.DateTimeUtils.handleTimes(time, f, num);
      }
    },
    /**
     * 更新日程表
     */
    updateTimeTable() {
      if (this.publishStartTimes.length === 0) {
        this.$notify({
          type: "warning",
          message: "发布时间不能为空",
        });
        return;
      }
      let schedulePublishTimeParam = {
        startTimes: this.publishStartTimes,
        userId: this.$route.query.id,
        opsRole: this.ApiConstants.opsTeacherAppointCode,
      };
      this.$Api.tutorManagement
        .teacherPublish(schedulePublishTimeParam)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("代发布成功"),
              type: "success",
            });
            this.initCanlender();
            this.publishStartTimes = [];
          }
        });
    },
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
  },
};
</script>
<style lang="scss" scoped>
.noMoney {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.noChoose {
  width: 100%;
  height: 100%;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  left: 0;
  top: 0;
}
.appointSingle,
.appointMore {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 30px;
  p {
    padding-left: 50px;
    margin: 0;
    margin-top: 20px;
  }
}
.block {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  div {
    margin: 5px 0;
  }
}
.teacherTimeTableWrap {
  .headerTips {
    display: flex;
    margin-left: 40px;
    font-size: 14px;
  }
  .headerConsole {
    margin-top: 20px;
    display: flex;
    align-items: center;
    position: relative;
    .update-timeTable-btn {
      position: absolute;
      right: 0;
    }
    i {
      font-size: 25px;
      position: relative;
      top: 5px;
    }
    i:hover {
      color: rgb(61, 186, 200);
    }
    .backBtn {
      width: 100px;
    }
  }
  .tableWrapper {
    background-color: rgb(240, 240, 240);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }
  .teableHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    background-color: #fff;
    width: 100%;
    .weekItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 5px 0;
      }
    }
  }
  .tableContent {
    width: 100%;
    overflow: auto;
    font-size: 14px;
    border-bottom: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    ul {
      display: flex;
      list-style: none;
      padding: 0px;
      margin: 0;
    }
    li {
      border: 1px solid #d9d9d9;
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #fff;
      border-bottom: none;
      border-right: none;
      position: relative;
      div {
        padding: 0 4px;
        width: 100%;
        z-index: 10;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
      }
    }
    li.teacherTimetableSuccessed {
      background-color: #9b90d9;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    li.teacherTimetablePubNotAppoint {
      background-color: #56bdcc;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    li.teacherTimetableAppointNotPub {
      background-color: #e1e1e1;
      color: #969696;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    li.inviting {
      background-color: #de8e1d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    li.no-top-border {
      border-top: none;
    }
    li.top20 {
      div {
        top: 20px;
      }
    }
    li.top40 {
      div {
        top: 40px;
      }
    }
    li.preRelease {
      background: #ddf2f5;
    }
    li.timeBefore::after {
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
    li.show-audition-tag {
      position: relative;
      font-size: 16px;
    }

    li.show-audition-tag::before {
      content: attr(data-content);
      position: absolute;
      font-style: italic;
      font-weight: 700;
      top: 50%;
      right: -20px;
      transform: translate(-50%, -50%);
      font-size: 15px;
      color: #f5a623;
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
    li.show-formal-tag {
      position: relative;
      font-size: 16px;
    }

    li.show-formal-tag::before {
      content: attr(data-content);
      position: absolute;
      font-style: italic;
      top: 50%;
      right: -20px;
      transform: translate(-50%, -50%);
      font-size: 15px;
      font-weight: 700;
      color: #5b478f;
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
  }
  .timesItem {
    width: 160px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .showItem {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .agoWrap {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #f5f5f5;
    opacity: 0.5;
    left: 0;
    top: 0;
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
  .twelve-hours {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    position: absolute;
    left: 0;
    top: 0;
  }
  .timeBeforeButSuccess {
    width: 100%;
    height: 100%;
  }
  .c-dot-blue,
  .c-dot-purple,
  .c-dot-ccc,
  .c-dot-orange {
    position: relative;
    padding-left: 15px;
  }
  .c-dot-blue:after,
  .c-dot-purple:after,
  .c-dot-ccc:after,
  .c-dot-orange:after {
    background: #56bdcc;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    left: 0;
    content: "";
  }
  .c-dot-purple:after {
    background: #9b90d9;
  }
  .c-dot-orange:after {
    background: #de8e1d;
  }
  .c-dot-ccc:after {
    background: #e1e1e1;
  }
}
</style>
