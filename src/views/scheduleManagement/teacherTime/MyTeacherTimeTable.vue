<template>
  <div class="teacherTimeTableWrap">
    <div class="headerConsole">
      <div>
        <i class="el-icon-arrow-left" @click="clickPreWeek"></i>
        <el-button class="backBtn" @click="goBackToNowWeek">{{
          $t("本周")
        }}</el-button>
        <i class="el-icon-arrow-right" @click="clickNextWeek"></i>
        <FilterBySingleDate
          ref="FilterBySingleDate"
          style="width: 192px; display: none"
          class="ml20"
          :clearable="false"
          :defaultCurDate="
            !bookParamsTimes.length &&
            operationScheduleType !== 'adjustOneClass'
          "
          @changeSelect="changeSingleDate"
        />
      </div>
      <div class="headerTips">
        <div>
          <div
            v-if="operationScheduleType === 'requestClass'"
            class="c-dot-blue mr30"
          >
            {{ $t("可求课") }} {{ canSchedulNum }}
          </div>
          <div v-else class="c-dot-blue mr30">
            {{ $t("可预约") }} {{ canSchedulNum }}
          </div>
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
            @click="handleClickSlot(timeItem, weekItem)"
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
              <template v-if="isEmptySlot(weekItem, timeItem)"> </template>
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
                    :src="groupIcon"
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
                    :src="shiIcon"
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
  </div>
</template>

<script>
import { COURSE_TYPE } from "@/utils/constants";
import * as momentLibrary from "moment";
import groupIcon from "@/assets/group-icon1.png";
import shiIcon from "@/assets/shi.png";
import { ref, computed, onMounted, reactive } from "@vue/composition-api";
import {
  bookParamsTimes,
  bookCoursePackageInfo,
  operationScheduleType,
} from "./bookCurriculum";
import FilterBySingleDate from "@/components/FilterItem/CommodityFilter/FilterBySingleDate";

export default {
  name: "myTeacherTimetable",
  components: { FilterBySingleDate },
  props: {
    teacherId: {
      type: Number,
      default: -1,
    },
    teacherName: {
      type: String,
      default: "",
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
    minStartTime: {
      type: String,
      default: "",
    },
    student: {
      type: Object,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    let minStartTime = props.minStartTime; //new Date().toISOString();
    if (!minStartTime) {
      minStartTime = momentLibrary(
        root.DateTimeUtils.getNextHalfHour().toISOString()
      )
        .subtract(30, "minutes")
        .toISOString();
    }

    const isEn = computed(() => root.$store.getters.currentLang === "en");
    /* 初始化课表 */
    const teacherTimetableLoading = ref(false);
    const successSchedulNum = ref(0);
    const canSchedulNum = ref(0);
    const pubSchedulNum = ref(0);
    const invitingNum = ref(0);
    const maxWeek = ref(0);
    const list = ref([]);
    const datas = ref({ 0: [], length: maxWeek.value });
    const week = ref(0);
    const monDate = ref("");
    const time25Arr = ref([]);
    const currentWeekArr = ref([]);
    const teacherTimetableObj = ref({});
    const addDay = (date, days) => {
      date = new Date(date);
      let plusDays = date.getDate() * 1 + days * 1;
      date.setDate(plusDays);
      return date;
    };
    const formartDate = (date) => {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return `${year}.${month}.${day}`;
    };
    const makeData = () => {
      list.value.forEach((item, index) => {
        item.time = addDay(monDate.value, index + 1);
        item.day = formartDate(item.time);
      });
    };
    const initTimeArr = () => {
      let now = new Date(
          new Date().getTime() + week.value * 7 * 24 * 60 * 60 * 1000
        ),
        arr = [];
      for (let hour = 0; hour < 24; hour++) {
        now.setHours(hour);
        arr.push(`${now.getHours()}:00`);
        arr.push(`${now.getHours()}:30`);
      }
      time25Arr.value = arr;
    };
    const initCurrentWeekArr = () => {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push(
          new Date(monDate.value.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
        );
      }
      currentWeekArr.value = arr;
    };
    /* 渲染发布时间逻辑 */
    const initPublishTimetable = () => {
      tutorPublishTimetableList.value.forEach((momentItem) => {
        if (
          !timeObjState.publishObj[new Date(momentItem.startTime)]?.isWillToBook
        ) {
          timeObjState.publishObj[new Date(momentItem.startTime)] = momentItem;
        }
        if (willBookTimesObj.value.has(momentItem.startTime)) {
          timeObjState.publishObj[new Date(momentItem.startTime)] =
            willBookTimesObj.value.get(momentItem.startTime);
          let classItem =
            timeObjState.publishObj[new Date(momentItem.startTime)];
          // 55分钟逻辑
          if (classItem.duration === 55) {
            let nextSlotStartTime = new Date(
              new Date(classItem.startTime).getTime() + 1000 * 60 * 30
            ).toISOString();
            timeObjState.publishObj[new Date(nextSlotStartTime)] = JSON.parse(
              JSON.stringify(classItem)
            );
          }
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
            timeObjState.publishObj[new Date(classItem.startTime)] = {
              ...classItem,
              is90MinutesFirstSlot: true,
              is90MinutesSecondSlot: false,
              is90MinutesThirdSlot: false,
            };
            timeObjState.publishObj[new Date(secondSlotKey)] = {
              ...classItem,
              is90MinutesSecondSlot: true,
              is90MinutesFirstSlot: false,
            };
            timeObjState.publishObj[new Date(thirdSlotKey)] = {
              ...classItem,
              is90MinutesFirstSlot: false,
              is90MinutesSecondSlot: false,
              is90MinutesThirdSlot: true,
            };
          }
        }
      });
    };
    /* 渲染邀约时间 */
    const initInviteTimetable = (
      tutorInviteTimetableList,
      publishObj,
      inviteTimetableObj
    ) => {
      tutorInviteTimetableList.forEach((classItem) => {
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
    };
    /* 渲染老师已约时间 */
    const initTutorTimetable = (
      tutorTimetableList,
      timetableObj,
      publishObj
    ) => {
      tutorTimetableList.forEach((classItem, classIndex) => {
        if (classItem.status === root.ApiConstants.studentAppointSuccessed) {
          successSchedulNum.value++;
        } else if (classItem.status !== root.ApiConstants.forciblyOccupy30Min) {
          pubSchedulNum.value++;
        }
        if (classItem.duration === 55) {
          let key = new Date(
            new Date(classItem.startTime).getTime() + 1000 * 60 * 30
          ).toISOString();
          // 55分钟的预占课，老师发布了下半个时间点
          if (
            publishObj[new Date(key)] &&
            classItem.status === root.ApiConstants.studentWillStartClass
          ) {
            let classItemCopy = JSON.parse(JSON.stringify(classItem));
            classItemCopy.status = root.ApiConstants.studentAppointSuccessed;
            timetableObj[new Date(key)] = classItemCopy;
          } else {
            timetableObj[new Date(key)] = classItem;
          }
        }
        // 55分钟的课老师发布了上半个时间点
        // if (
        //   publishObj[new Date(classItem.startTime)] &&
        //   classItem.status === root.ApiConstants.studentWillStartClass
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
    };
    /* 遍历week,计算回显 */
    const initWeek = (obj, publishObj, inviteTimetableObj, timetableObj) => {
      currentWeekArr.value.forEach((dateItem, dateIndex) => {
        time25Arr.value.forEach((momentItem, momentIndex) => {
          let momentArr = momentItem.split(":"),
            lastMomentArr =
              momentIndex === 0
                ? dateIndex === 0
                  ? null
                  : time25Arr.value[time25Arr.value.length - 1].split(":")
                : time25Arr.value[momentIndex - 1].split(":");
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
                    currentWeekArr.value[dateIndex - 1].getFullYear(),
                    currentWeekArr.value[dateIndex - 1].getMonth(),
                    currentWeekArr.value[dateIndex - 1].getDate(),
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
            isWillToBook: false,
          };
          if (publishObj[moment]) {
            if (publishObj[moment].isWillToBook) {
              item.detail = publishObj[moment];
              item.isWillToBook = true;
              if (
                item.detail.duration === 55 &&
                new Date(publishObj[moment].startTime).getTime() ===
                  moment.getTime()
              ) {
                item.nextNeedCompute = true;
              }
            }
            item.hasPublished = true;
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
              root.ApiConstants.forciblyOccupy30Min
            ) {
              item.hasforciblyOccupy30Min = true;
              item.hasBooked = true;
            } else if (
              timetableObj[moment].status ===
              root.ApiConstants.studentAppointSuccessed
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
                root.ApiConstants.forciblyOccupy30Min
              ) {
                item.hasNextForciblyOccupy30Min = true;
              }
            }
            if (timetableObj[moment].duration === 25) {
              const forciblyOccupyItem =
                timetableObj[
                  new Date(
                    momentLibrary(timetableObj[moment].startTime).add(0.5, "h")
                  )
                ];
              if (
                forciblyOccupyItem?.status ===
                root.ApiConstants.forciblyOccupy30Min
              ) {
                item.hasNextForciblyOccupy30Min = true;
              }
            }
          }
          // 确定55分钟的课下半节状态
          /* 邀约中的55分钟 */
          /* 老师课表 */
          if (obj[lastMoment] && obj[lastMoment].nextNeedCompute) {
            if (
              timetableObj[moment]?.status ===
              root.ApiConstants.studentAppointSuccessed
            ) {
              item.hasBooked = true;
              item.hasPublished = true;
              item.detail = obj[lastMoment].detail;
            } else if (
              timetableObj[moment]?.status ===
              root.ApiConstants.studentWillStartClass
            ) {
              item.hasScheduled = true;
              item.hasPublished = true;
              item.detail = obj[lastMoment].detail;
            } else if (obj[lastMoment].nextNeedCompute) {
              item.isWillToBook = true;
            }
          }

          // 计算是否过去
          // console.log("initWeek-----", props.minStartTime+ "*******\n", moment+ "*******\n", moment.getTime()+ "*******\n", new Date( momentLibrary(props.minStartTime).add(30, "minutes").toISOString() ))
          if (
            moment.getTime() <
            new Date(
              momentLibrary(minStartTime).add(30, "minutes").toISOString()
            )
          )
            item.isPast = true;
          // 计算可以约课的课堂数
          if (
            !item.isPast &&
            item.hasPublished &&
            !item.hasBooked &&
            !item.hasScheduled
          ) {
            canSchedulNum.value++;
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
    };
    const tutorPublishTimetableList = ref([]);
    const timeObjState = reactive({
      publishObj: {},
      timetableObj: {},
      inviteTimetableObj: {},
      obj: {},
    });
    const tutorTimetable = () => {
      let start = new Date(monDate.value.getTime() + 1000 * 60 * 60 * 24),
        end = new Date(monDate.value.getTime() + 1000 * 60 * 60 * 24 * 8);
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
          tutor_user_id: props.teacherId,
          start_time: startUTC,
          end_time: endUTC,
          coursePackageId: props.coursePackageId,
          week: week.value,
          studentUserId:
            root.$route.query.studentId || props.student.studentUserId,
        };
      successSchedulNum.value = 0;
      pubSchedulNum.value = 0;
      canSchedulNum.value = 0;
      invitingNum.value = 0;
      teacherTimetableLoading.value = true;
      let reqFn = root.$Api.teacherManagement.scheduleTeacherTimetable;
      if (operationScheduleType.value === "requestClass") {
        reqFn = root.$Api.teacherManagement.reqRequestScheduleTeacherTimetable;
      }
      reqFn(params).then((res) => {
        let resTimes = res.data.data;
        /* 老师发布slots */
        if (operationScheduleType.value === "requestClass") {
          tutorPublishTimetableList.value = resTimes.tutorRequestTimetableList;
        } else {
          tutorPublishTimetableList.value = resTimes.tutorPublishTimetableList;
        }
        tutorPublishTimetableList.value &&
          initPublishTimetable(timeObjState.publishObj);

        /* 邀约slots */
        invitingNum.value = resTimes.tutorInviteTimetableList?.length || 0;
        resTimes.tutorInviteTimetableList &&
          initInviteTimetable(
            resTimes.tutorInviteTimetableList,
            timeObjState.publishObj,
            timeObjState.inviteTimetableObj
          );

        /* 课表slots */
        resTimes.tutorTimetableList &&
          initTutorTimetable(
            resTimes.tutorTimetableList,
            timeObjState.timetableObj,
            timeObjState.publishObj
          );
        initWeek(
          timeObjState.obj,
          timeObjState.publishObj,
          timeObjState.inviteTimetableObj,
          timeObjState.timetableObj
        );
        teacherTimetableObj.value = timeObjState.obj;
        root.$forceUpdate();
        teacherTimetableLoading.value = false;
      });
    };
    const initCanlender = () => {
      initBookTimes();
      makeData();
      initTimeArr();
      initCurrentWeekArr();
      tutorTimetable();
    };
    const initData = () => {
      list.value = [
        { day: 1, week: root.$t("周一"), cur: false },
        { day: 2, week: root.$t("周二"), cur: false },
        { day: 3, week: root.$t("周三"), cur: false },
        { day: 4, week: root.$t("周四"), cur: false },
        { day: 5, week: root.$t("周五"), cur: false },
        { day: 6, week: root.$t("周六"), cur: false },
        { day: 7, week: root.$t("周日"), cur: false },
      ];
    };
    const positioningWeek = (utcTime) => {
      let cur = new Date(utcTime);
      let weekNum = -1 * cur.getDay();
      if (weekNum == 0) {
        weekNum = -7;
      }
      monDate.value = addDay(cur, weekNum);
      initCanlender();
    };
    const changeSingleDate = (time) => {
      setTimeout(() => {
        positioningWeek(time[0]);
      }, 100);
    };
    onMounted(() => {
      initData();
    });
    /* 渲染 */
    const willBookTimesObj = ref(new Map());
    const initBookTimes = () => {
      let willBookTimesMap = new Map();
      if (bookParamsTimes.value && bookParamsTimes.value.length) {
        bookParamsTimes.value.forEach((e) => {
          if (e?.value?.length) {
            let endTime = new Date(e.value);
            endTime.setMinutes(
              endTime.getMinutes() + bookCoursePackageInfo.value.duration
            );
            let item = {
              duration: bookCoursePackageInfo.value.duration,
              startTime: e.value,
              classTypeId: 1 /* 1v1 */,
              status: 0,
              endTime: endTime.toISOString(),
              studentUsername: "",
              isWillToBook: true,
            };
            willBookTimesMap.set(e.value, item);
          }
        });
      }
      willBookTimesObj.value = willBookTimesMap;
    };
    const clearSelectSlot = (firstSlotKey, secondSlotKey, thirdSlotKey) => {
      /* 清空所有已选slot */
      teacherTimetableObj.value[firstSlotKey].isWillToBook = false;
      teacherTimetableObj.value[firstSlotKey].nextNeedCompute = false;
      teacherTimetableObj.value[firstSlotKey].detail.isWillToBook = false;

      teacherTimetableObj.value[secondSlotKey].isWillToBook = false;
      teacherTimetableObj.value[secondSlotKey].nextNeedCompute = false;
      teacherTimetableObj.value[secondSlotKey].detail.isWillToBook = false;

      teacherTimetableObj.value[thirdSlotKey].isWillToBook = false;
      teacherTimetableObj.value[thirdSlotKey].nextNeedCompute = false;
      teacherTimetableObj.value[thirdSlotKey].detail.isWillToBook = false;

      willBookTimesObj.value.delete(new Date(firstSlotKey).toISOString());
    };
    const handleDrawWillBookSlot = (item, moment) => {
      if (
        !["bookOneClass", "bookMoreClass", "requestClass"].includes(
          operationScheduleType.value
        )
      )
        return;
      if (!item.isWillToBook) {
        let lastSlotStartTime = "";
        if (bookCoursePackageInfo.value.duration === 55) {
          lastSlotStartTime = new Date(
            new Date(moment).getTime() + 1000 * 60 * 30
          );
        } else if (bookCoursePackageInfo.value.duration === 90) {
          lastSlotStartTime = new Date(
            new Date(moment).getTime() + 1000 * 60 * 60
          );
        }

        if (
          bookCoursePackageInfo.value.duration >= 55 &&
          (!teacherTimetableObj.value[lastSlotStartTime].hasPublished ||
            teacherTimetableObj.value[lastSlotStartTime].hasBooked ||
            teacherTimetableObj.value[lastSlotStartTime].isWillToBook ||
            teacherTimetableObj.value[lastSlotStartTime].hasScheduled)
        ) {
          return root.$notify.warning(
            root.$t("可用课时不够，请选择其他时间段")
          );
        }
        if (willBookTimesObj.value.size === 10) {
          return root.$notify.warning(root.$t("最多可以选择10个时间"));
        }
        item.isWillToBook = true;
        let endTime = new Date(moment);
        endTime.setMinutes(
          endTime.getMinutes() + bookCoursePackageInfo.value.duration
        );
        willBookTimesObj.value.set(new Date(moment).toISOString(), {
          duration: bookCoursePackageInfo.value.duration,
          classTypeId: 1,
          startTime: new Date(moment).toISOString(),
          endTime: endTime.toISOString(),
          studentUsername: "",
          isWillToBook: true,
        });
      } else {
        if (item.detail.duration === 25) {
          item.isWillToBook = false;
          item.detail.isWillToBook = false;
          willBookTimesObj.value.delete(new Date(moment).toISOString());
        }
        if (item.detail.duration === 55) {
          if (item.nextNeedCompute) {
            /* 点击第一格 */
            const secondSlotKey = new Date(
              new Date(moment).getTime() + 1000 * 60 * 30
            );
            teacherTimetableObj.value[secondSlotKey].isWillToBook = false;
            teacherTimetableObj.value[
              secondSlotKey
            ].detail.isWillToBook = false;
            item.nextNeedCompute = false;
            item.detail.isWillToBook = false;
            willBookTimesObj.value.delete(new Date(moment).toISOString());
          } else {
            /* 点击第二格 */
            const firstSlotKey = new Date(
              new Date(moment).getTime() - 1000 * 60 * 30
            );
            teacherTimetableObj.value[firstSlotKey].isWillToBook = false;
            teacherTimetableObj.value[firstSlotKey].nextNeedCompute = false;
            teacherTimetableObj.value[firstSlotKey].detail.isWillToBook = false;
            teacherTimetableObj.value[moment].isWillToBook = false;
            teacherTimetableObj.value[moment].detail.isWillToBook = false;
            willBookTimesObj.value.delete(new Date(firstSlotKey).toISOString());
          }
        }
        if (item.detail.duration === 90) {
          if (item.is90MinutesFirstSlot) {
            /* 点击第一格 */
            const firstSlotKey = moment;
            const secondSlotKey = new Date(
              new Date(moment).getTime() + 1000 * 60 * 30
            );
            const thirdSlotKey = new Date(
              new Date(moment).getTime() + 1000 * 60 * 60
            );
            clearSelectSlot(firstSlotKey, secondSlotKey, thirdSlotKey);
          } else if (item.is90MinutesSecondSlot) {
            /* 点击第二格 */
            const firstSlotKey = new Date(
              new Date(moment).getTime() - 1000 * 60 * 30
            );
            const secondSlotKey = moment;
            const thirdSlotKey = new Date(
              new Date(moment).getTime() + 1000 * 60 * 30
            );
            clearSelectSlot(firstSlotKey, secondSlotKey, thirdSlotKey);
          } else if (item.is90MinutesThirdSlot) {
            /* 点击第三格 */
            const firstSlotKey = new Date(
              new Date(moment).getTime() - 1000 * 60 * 60
            );
            const secondSlotKey = new Date(
              new Date(moment).getTime() - 1000 * 60 * 30
            );
            const thirdSlotKey = moment;
            clearSelectSlot(firstSlotKey, secondSlotKey, thirdSlotKey);
          }
        }
      }
      initPublishTimetable(timeObjState.publishObj);
      initWeek(
        timeObjState.obj,
        timeObjState.publishObj,
        timeObjState.inviteTimetableObj,
        timeObjState.timetableObj
      );
      teacherTimetableObj.value = Object.assign(
        {},
        teacherTimetableObj.value,
        timeObjState.obj
      );
      changeBookParamsTimes();
    };
    const isEmptySlot = (weekItem, timeItem) => {
      /**
       * 什么都不显示:
       * 1、强占30min的
       * 2、没发布的
       * 3、发布未预约的
       * 4、55分钟的下半节并且下半节不是凌晨00：00;
       * 5、6、90分钟1,3slot
       * 7、邀约中的55分钟下半节不是凌晨00：00的;
       *
       * */
      let moment = new Date(
        weekItem.getFullYear(),
        weekItem.getMonth(),
        weekItem.getDate(),
        timeItem.split(":")[0],
        timeItem.split(":")[1],
        0
      );
      let flagState = {
        flag1: teacherTimetableObj.value[moment].hasforciblyOccupy30Min,
        flag2:
          !teacherTimetableObj.value[moment].hasPublished &&
          !teacherTimetableObj.value[moment].isInviteTime,
        flag3:
          teacherTimetableObj.value[moment].hasPublished &&
          teacherTimetableObj.value[moment].detail === null,
        flag4:
          teacherTimetableObj.value[moment].detail !== null &&
          teacherTimetableObj.value[moment].detail.duration === 55 &&
          timeItem !== "0:00" &&
          !teacherTimetableObj.value[moment].nextNeedCompute,
        flag5: teacherTimetableObj.value[moment].is90MinutesFirstSlot,
        flag6: teacherTimetableObj.value[moment].is90MinutesThirdSlot,
        flag7:
          teacherTimetableObj.value[moment].isInviteTime &&
          !teacherTimetableObj.value[moment].nextNeedCompute,
      };
      const { flag1, flag2, flag3, flag4, flag5, flag6, flag7 } = flagState;
      let flag = flag1 || flag2 || flag3 || flag4 || flag5 || flag6 || flag7;
      return flag;
    };
    const handleClickSlot = (timeItem, dateItem) => {
      let moment = new Date(
          dateItem.getFullYear(),
          dateItem.getMonth(),
          dateItem.getDate(),
          timeItem.split(":")[0],
          timeItem.split(":")[1],
          0
        ),
        item = teacherTimetableObj.value[moment];
      if (
        item.hasPublished &&
        !item.isPast &&
        !item.hasBooked &&
        !item.hasScheduled
      ) {
        handleDrawWillBookSlot(item, moment);
      }
    };
    const changeBookParamsTimes = () => {
      let arr = [];
      willBookTimesObj.value.forEach((e) => {
        arr.push({
          key: Math.random(),
          value: e.startTime,
        });
      });
      bookParamsTimes.value = arr;
    };
    const computeMomentClass = (timeItem, dateItem) => {
      if (teacherTimetableLoading.value) return "";
      let moment = new Date(
          dateItem.getFullYear(),
          dateItem.getMonth(),
          dateItem.getDate(),
          timeItem.split(":")[0],
          timeItem.split(":")[1],
          0
        ),
        classStr = "",
        item = teacherTimetableObj.value[moment];

      if (
        item.hasPublished &&
        !item.hasBooked &&
        !item.hasScheduled &&
        !item.isPast
      ) {
        if (item.isWillToBook) {
          classStr += " teacherTimetableWillToBook";
        } else {
          classStr += " teacherTimetablePubNotAppoint";
        }
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
          (item.is90MinutesSecondSlot || item.is90MinutesThirdSlot)) ||
        item.isWillToBook
      )
        classStr += " no-top-border";
      if (item.hasScheduled) classStr += " teacherTimetableAppointNotPub";
      if (item.hasScheduled && item.nextNeedCompute) classStr += " top20";
      if (item.isWillToBook && item.nextNeedCompute) classStr += " top20";
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
      return classStr;
    };
    const resetCalender = () => {
      maxWeek.value = week.value;
      datas.value = { 0: [], length: maxWeek.value };
      initCanlender();
    };
    const clickPreWeek = () => {
      week.value -= 1;
      monDate.value = addDay(monDate.value, -7);
      root.$forceUpdate();
      resetCalender();
    };
    const goBackToNowWeek = () => {
      week.value = 0;
      var cur = new Date();
      let _week = -1 * cur.getDay();
      monDate.value = addDay(cur, _week);
      resetCalender();
    };
    const clickNextWeek = () => {
      week.value = week.value - 0;
      week.value += 1;
      monDate.value = addDay(monDate.value, 7);
      maxWeek.value = week.value;
      datas.value.length = maxWeek.value;
      resetCalender();
    };

    return {
      list,
      COURSE_TYPE,
      time25Arr,
      currentWeekArr,
      tableHeight: window.innerHeight - 200 || 300,
      groupIcon,
      shiIcon,
      isEmptySlot,
      handleClickSlot,
      computeMomentClass,
      clickPreWeek,
      goBackToNowWeek,
      clickNextWeek,
      teacherTimetableObj,
      changeSingleDate,
      positioningWeek,
      teacherTimetableLoading,
      bookParamsTimes,
      operationScheduleType,
    };
  },
};
</script>
<style lang="scss" scoped>
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
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    li.teacherTimetablePubNotAppoint:hover {
      transform: scale(1.07); /* 放大 10% */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 添加阴影，增强凸显效果 */
      z-index: 999;
      background-color: #8cd4e0;
    }
    li.teacherTimetableWillToBook {
      background-color: #68cdf4;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    li.teacherTimetableWillToBook:hover {
      transform: scale(1.07); /* 放大 10% */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 添加阴影，增强凸显效果 */
      z-index: 999;
      background-color: #b1e9f3;
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
