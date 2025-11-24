<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <MyTeacherTimeTable
        ref="MyTeacherTimeTable"
        class="teacher-table-warp"
        :teacherName="teacherName"
        :teacherId="teacherId"
        :showTeacherTimetable="showTeacherTimetable"
        :coursePackageId="coursePackageId"
        :minStartTime="minStartTime"
        :student="student"
    /></el-col>
    <el-col :span="8">
      <RequestCourse
        :student="student"
        :studentInfo="studentInfo"
        @goBack="goBack"
        v-if="operationScheduleType === 'requestClass'"
        @closeBookDialog="closeBookDialog"
      />
      <BookMoreCourses
        :student="student"
        :studentInfo="studentInfo"
        @goBack="goBack"
        v-if="operationScheduleType === 'bookMoreClass'"
        @closeBookDialog="closeBookDialog"
      />
      <BookOneCourse
        :student="student"
        :studentInfo="studentInfo"
        @goBack="goBack"
        v-if="operationScheduleType === 'bookOneClass'"
        @closeBookDialog="closeBookDialog"
      />
      <AdjustOneClass
        :student="student"
        :studentInfo="studentInfo"
        @goBack="goBack"
        v-if="operationScheduleType === 'adjustOneClass'"
        :teacherName="teacherName"
        :rowData="rowData"
      />
    </el-col>
  </el-row>
</template>

<script>
import { computed, onMounted, ref } from "@vue/composition-api";

import MyTeacherTimeTable from "./MyTeacherTimeTable";
import BookMoreCourses from "./BookMoreCourses";
import BookOneCourse from "./BookOneCourse";
import RequestCourse from "./RequestCourse";
import AdjustOneClass from "./AdjustOneClass";
import moment from "moment";
import {
  operationScheduleType,
  bookParamsTimes,
  markingBookTime,
} from "./bookCurriculum";
import { deepClone } from "@/utils/handleData";

export default {
  props: {
    teacherId: {
      type: Number,
      default: -1,
    },
    teacherName: {
      type: String,
      default: "",
    },
    showTeacherTimetable: {
      type: Boolean,
      default: false,
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
    rowData: {
      type: Object,
      default: () => {},
    },
    minStartTime: {
      type: String,
      default: "",
    },
    student: {
      type: Object,
      default: null,
    },
    studentInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    MyTeacherTimeTable,
    BookMoreCourses,
    BookOneCourse,
    AdjustOneClass,
    RequestCourse,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const goBack = () => {
      emit("goBack");
    };
    const closeBookDialog = () => {
      emit("closeBookDialog");
    };

    const findNearestDate = (dates) => {
      if (!dates.length) return null;
      if (typeof dates[0].value !== "string") return moment().utc();
      if (dates.length == 1) return dates[0].value;
      var now = moment();
      return dates.reduce(function (nearest, date) {
        return Math.abs(now.diff(moment(nearest.value), "seconds")) <
          Math.abs(now.diff(moment(date.value), "seconds"))
          ? nearest.value
          : date.value;
      });
    };
    const setTeacherTimeTable = (utcTime) => {
      setTimeout(() => {
        refs.MyTeacherTimeTable.$refs.FilterBySingleDate.time = new Date(
          utcTime
        );
        refs.MyTeacherTimeTable.$refs.FilterBySingleDate.timeChange(
          new Date(utcTime)
        );
      }, 500);
    };
    onMounted(() => {
      if (operationScheduleType.value === "adjustOneClass") {
        setTeacherTimeTable(props.rowData.startTime);
      }
      const positionUTCTime = findNearestDate(bookParamsTimes.value);
      if (!positionUTCTime) return;
      setTeacherTimeTable(positionUTCTime);
      markingBookTime.value = deepClone(bookParamsTimes.value);
    });

    let coursePackageId = props.coursePackageId;
    return {
      isEn,
      operationScheduleType,
      coursePackageId,
      goBack,
      closeBookDialog,
    };
  },
};
</script>
<style scoped lang="scss">
.teacher-table-warp {
  width: 100%;
  height: 90vh;
}
</style>
