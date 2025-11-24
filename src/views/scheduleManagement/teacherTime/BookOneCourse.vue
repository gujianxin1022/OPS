<template>
  <div class="book-one-warp">
    <div class="title">{{ $t("单次约课") }}</div>
    <br />
    <el-form :label-width="isEn ? '120px' : '80px'">
      <el-form-item :label="$t('教师')">
        {{ bookCourseTeacherInfo.realName }}
      </el-form-item>
      <el-form-item :label="$t('学生')">
        {{ studentInfo ? studentInfo.studentName : student.studentName }}
      </el-form-item>
      <el-form-item :label="$t('课包')">
        {{
          isEn
            ? bookCoursePackageInfo.progressDescEN
            : bookCoursePackageInfo.progressDescZH
        }}
      </el-form-item>
      <el-form-item :label="$t('课包余额')">
        {{ bookCoursePackageInfo.balance }}
      </el-form-item>
      <el-form-item :label="$t('学生时区')">
        {{ filterZoneName(userTimeZone, isEn) }}
      </el-form-item>
      <br />
      <br />
      <el-table
        :data="sortBy(tableData, 'value')"
        border
        style="width: 100%"
        :height="tableData.length > 6 ? '445px' : ''"
      >
        <el-table-column :label="$t('序号')" width="46">
          <template slot-scope="{ row, $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="value" :label="$t('已选时间')" min-width="180">
          <template slot-scope="{ row }">
            {{ DateTimeUtils.dateClockTime(row.value) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          :label="$t('用户本地上课时间')"
          min-width="180"
        >
          <template slot-scope="{ row }">
            {{ toUserTimeZoneTime(userTimeZone, row.value) }}
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <div class="bottom-btn-wrap">
          <el-button :loading="loading" @click="goBack" style="width: 100px">{{
            $t("返回")
          }}</el-button>
          <el-button
            :loading="loading"
            style="width: 100px"
            type="primary"
            @click="onSubmit"
            >{{ $t("确认") }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ref, computed, onMounted, watch, toRefs } from "@vue/composition-api";
import {
  bookParamsTimes,
  bookCourseTeacherInfo,
  bookCoursePackageInfo,
  operationScheduleType,
} from "./bookCurriculum";
import { filterZoneName, toUserTimeZoneTime } from "@/utils/timeZone";
import { logEvent } from "@/utils/analyticsNew";
import { sortBy } from "lodash-es";
import { deepClone } from "@/utils/handleData";

export default {
  props: {
    student: {
      type: Object,
      default: {},
    },
    studentInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const goBack = () => {
      emit("goBack");
    };
    const loading = ref(false);

    const onSubmit = async () => {
      try {
        const params = {
          coursePackageId: bookCoursePackageInfo.value.coursePackageId,
          startTimeList: tableData.value.map((v) => {
            return v.value;
          }),
          studentUserId:
            root.$route.query.studentId || props.student.studentUserId,
          tutorUserId: bookCourseTeacherInfo.value.id,
        };
        loading.value = true;
        await root.$Api.classManagement.reqdoScheduleSingle(params);
        root.$notify.success(root.$t("操作成功"));
        logEvent("submit_do_schedule_single", "单次约课", {
          studentUserId:
            root.$route.query.studentId || props.student.studentUserId,
        });
        goBack();
        emit("closeBookDialog");
      } finally {
        loading.value = false;
      }
    };
    const tableData = ref([]);
    watch(
      () => bookParamsTimes.value,
      () => {
        bookParamsTimes.value.forEach((item) => {
          const e = tableData.value.find((e) => e.value == item.value);
          if (e) {
            item.endTime = e.endTime;
          }
        });
        tableData.value = sortBy(deepClone(bookParamsTimes.value), "value");
      }
    );
    onMounted(() => {
      if (
        bookParamsTimes.value.length &&
        typeof bookParamsTimes.value[0].value !== "string"
      ) {
        return;
      }
      tableData.value = deepClone(bookParamsTimes.value) || [];
    });
    return {
      isEn,
      bookCourseTeacherInfo,
      bookCoursePackageInfo,
      userTimeZone: computed(
        () => root.$store.getters.userTimeZone || props.student.timeZone
      ),
      toUserTimeZoneTime,
      filterZoneName,
      goBack,
      onSubmit,
      loading,
      tableData,
      sortBy,
    };
  },
};
</script>
<style scoped lang="scss">
.book-one-warp {
  color: #444444;
  width: 100%;
  padding-left: 20px;
  .title {
    font-family: "Hiragino Sans GB";
    margin: 0px;
    font-weight: 700;
    text-align: center;
  }
  .bottom-btn-wrap {
    position: fixed;
    bottom: 20px;
    text-align: center;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
