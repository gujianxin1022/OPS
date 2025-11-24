<template>
  <div class="book-more-warp">
    <div>
      <div class="title">{{ $t("周期约课") }}</div>
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
        <el-form-item class="mb20" :label="$t('学生时区')">
          {{ `${userTimeZone}` }}
          {{ filterZoneName(userTimeZone, isEn) }}
        </el-form-item>
        <br />
        <br />
        <el-table
          :row-key="getRowKeys"
          :data="tableData"
          border
          style="width: 100%"
          :height="300"
        >
          <el-table-column :label="$t('序号')" width="46">
            <template slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('周期')" min-width="80">
            <template slot-scope="{ row }">
              {{ $t(moment(row.value).format("dddd")) }}
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('时间')" min-width="60">
            <template slot-scope="{ row }">
              {{ $t(moment(row.value).format("HH:mm")) }}
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('开始时间')" min-width="90">
            <template slot-scope="{ row }">
              {{ $t(moment(row.value).format("yyy-MM-DD")) }}
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('结束时间')" min-width="160">
            <template slot-scope="{ row }">
              <el-date-picker
                style="width: 130px"
                :key="row.value"
                size="mini"
                v-model="row.endTime"
                type="date"
                :placeholder="$t('选择日期')"
                :picker-options="{
                  disabledDate(time) {
                    return (
                      time.getTime() < new Date(row.value).getTime() ||
                      time.getTime() >
                        Date.now() + 24 * 60 * 60 * 1000 * 365 * 3
                    );
                  },
                }"
              >
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <div class="bottom-btn-wrap">
            <el-button
              @click="goBack"
              :loading="loading"
              style="width: 100px"
              >{{ $t("返回") }}</el-button
            >
            <el-button
              style="width: 100px"
              :loading="loading"
              type="primary"
              @click="onCheck"
              >{{ $t("确认") }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <div slot="title">
        <div>
          <span> {{ $t("可约") }}:{{ checkDetail.successNum }} </span>&nbsp;
          <span> {{ $t("预占") }}:{{ checkDetail.occupyNum }} </span>&nbsp;
          <span style="color: #f56c6c">
            {{ $t("不可约") }}:{{ checkDetail.failNum }}
          </span>
        </div>
      </div>
      <div>
        <el-table
          v-if="checkDetail.detailList"
          :data="checkDetail.detailList"
          border
          style="width: 100%"
          :height="300"
        >
          <el-table-column :label="$t('序号')" width="46">
            <template slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('已选时间')" min-width="180">
            <template slot-scope="{ row }">
              {{ DateTimeUtils.dateClockTime(row.startTime) }} (
              {{ $t(moment(row.startTime).format("dddd")) }})
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            :label="$t('用户本地上课时间')"
            min-width="150"
          >
            <template slot-scope="{ row }">
              {{ toUserTimeZoneTime(userTimeZone, row.startTime) }} ({{
                $t(moment.utc(row.startTime).tz(userTimeZone).format("dddd"))
              }})
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('状态')" min-width="80">
            <template slot-scope="{ row }">
              <span :style="`color:${statusMap[row.status].color}`">
                {{ $t(statusMap[row.status].text) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cannotReason"
            :label="$t('原因')"
            min-width="160"
          >
            <template slot-scope="{ row }">
              {{ $t(cannotReasonMap[row.cannotReason]) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="showDetail = false"
          >{{ $t("取消") }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import {
  bookParamsTimes,
  bookCourseTeacherInfo,
  bookCoursePackageInfo,
} from "./bookCurriculum";
import { deepClone } from "@/utils/handleData";
import moment from "moment";
import { filterZoneName, toUserTimeZoneTime } from "@/utils/timeZone";
import { logEvent } from "@/utils/analyticsNew";
import { sortBy } from "lodash-es";

export default {
  props: {
    student: {
      type: Object,
      default: null,
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
    const mergeDateTime = (utcTime, date) => {
      const utcMoment = moment.utc(utcTime);
      const dateMoment = moment(date);
      return moment
        .utc()
        .year(dateMoment.year())
        .month(dateMoment.month())
        .date(dateMoment.date())
        .hour(utcMoment.hour())
        .minute(utcMoment.minute())
        .second(0)
        .milliseconds(0)
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    };
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
    const params = ref({
      coursePackageId: bookCoursePackageInfo.value.coursePackageId,
      cycleTimeList: [],
      studentUserId: root.$route.query.studentId || props.student.studentUserId,
      tutorUserId: bookCourseTeacherInfo.value.id,
    });
    const checkDetail = ref({});
    const onCheck = async () => {
      if (!tableData.value.length) {
        return root.$notify.warning(root.$t("请选择约课时间"));
      }
      let fail = tableData.value.some((e) => {
        return !e.endTime;
      });
      if (fail) {
        return root.$notify.warning(root.$t("请选择结束时间"));
      }
      tableData.value.forEach((e) => {
        e.endUtcTime = mergeDateTime(e.value, e.endTime);
      });
      params.value.cycleTimeList = tableData.value.map((v) => {
        return {
          startTime: v.value,
          endTime: v.endUtcTime,
        };
      });
      try {
        loading.value = true;
        const res = await root.$Api.classManagement.reqDoScheduleCycleCheck(
          params.value
        );
        checkDetail.value = res || {};
        showDetail.value = true;
      } finally {
        loading.value = false;
      }
    };
    const cannotReasonMap = {
      1: "老师时间被占",
      2: "学生时间被占",
      3: "当日系统维护",
    };
    const statusMap = {
      1: { text: "不可约", color: "#F56C6C" },
      2: { text: "可约", color: "#67C23A" },
      3: { text: "预占", color: "#409EFF" },
    };
    const loading = ref(false);
    const onSubmit = async () => {
      try {
        loading.value = true;
        await root.$Api.classManagement.reqdoScheduleCycle(params.value);
        root.$notify.success(root.$t("操作成功"));
        showDetail.value = false;
        logEvent("submit_do_schedule_cycle", "周期约课", {
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
    onMounted(() => {
      if (
        bookParamsTimes.value.length &&
        typeof bookParamsTimes.value[0].value !== "string"
      ) {
        return;
      }
      tableData.value = deepClone(bookParamsTimes.value) || [];
    });
    /* 查看详情 */
    const showDetail = ref(false);

    return {
      isEn,
      bookCourseTeacherInfo,
      bookCoursePackageInfo,
      bookParamsTimes,
      userTimeZone: computed(
        () => root.$store.getters.userTimeZone || props.student.timeZone
      ),
      toUserTimeZoneTime,
      filterZoneName,
      goBack,
      moment,
      onSubmit,
      onCheck,
      getRowKeys: (row) => row.value,
      tableData,
      showDetail,
      checkDetail,
      cannotReasonMap,
      statusMap,
      loading,
    };
  },
};
</script>
<style scoped lang="scss">
.book-more-warp {
  color: #444444;
  width: 100%;
  padding-left: 20px;
  .title {
    font-family: "Hiragino Sans GB";
    margin: 0px;
    font-weight: 700;
    text-align: center;
    .return-icon {
      float: left;
      cursor: pointer;
      font-weight: 200;
      font-size: 16px;
    }
    .return-icon:hover {
      color: #7580e5;
    }
  }
  .bottom-btn-wrap {
    position: fixed;
    bottom: 40px;
    text-align: center;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
