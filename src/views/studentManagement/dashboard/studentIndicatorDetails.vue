<template>
  <div class="student-indicator-details-warp p20">
    <div class="title mb20">{{ $t("用户健康度详情") }}</div>
    <div v-if="pageData">
      <div style="font-size: 14px" class="mb20">
        <el-row class="mb20">
          <el-col :span="5"
            >{{ $t("学生姓名") }}:
            <span class="ml10">{{ pageData.studentName }} </span>
          </el-col>
          <el-col :span="5"
            >{{ $t("当前状态") }}:<el-tag
              class="ml10"
              :type="statusTextMap[pageData.finalStatus].type"
            >
              {{$t(statusTextMap[pageData.finalStatus].text)}}
            </el-tag>
          </el-col>
          <el-col :span="5"
            >{{ $t("家长id") }}:
            <span class="ml10">
              <router-link
                :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: pageData.parentId },
                }"
              >
                <span style="color: #7580e5; cursor: pointer" type="text">{{
                  pageData.parentId
                }}</span>
              </router-link></span
            >
          </el-col>
          <el-col :span="9"
            >{{ $t("课程进度") }}:
            <span class="ml10">{{ pageData.lastClassLearningProgress }} </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6"
            >{{ $t("课时余额") }}:
            <span class="ml10">{{ pageData.balance }} </span>
          </el-col>
        </el-row>
      </div>
      <div class="echarts-box">
        <el-row :gutter="20">
          <el-col class="chart" :span="12"
            ><DifficultyRating
              :idxType="1"
              :subjectTypeId="pageData.subjectTypeId"
              :studentId="pageData.studentId"
            />
          </el-col>
          <el-col class="chart" :span="12"
            ><WeeklyClassSpending
              :idxType="4"
              :subjectTypeId="pageData.subjectTypeId"
              :studentId="pageData.studentId"
              :rowData="pageData"
          /></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="chart" :span="12"
            ><ClassroomPerformance
              :idxType="2"
              :subjectTypeId="pageData.subjectTypeId"
              :studentId="pageData.studentId"
          /></el-col>
          <el-col class="chart" :span="12"
            ><MonthlyClassSpending
              :idxType="5"
              :subjectTypeId="pageData.subjectTypeId"
              :studentId="pageData.studentId"
              :rowData="pageData"
          /></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="chart" :span="12"
            ><AttendanceDuration
              :idxType="3"
              :subjectTypeId="pageData.subjectTypeId"
              :studentId="pageData.studentId"
          /></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch, onMounted } from "@vue/composition-api";
import DifficultyRating from "./components/DifficultyRating.vue";
import WeeklyClassSpending from "./components/WeeklyClassSpending.vue";
import ClassroomPerformance from "./components/ClassroomPerformance.vue";
import MonthlyClassSpending from "./components/MonthlyClassSpending.vue";
import AttendanceDuration from "./components/AttendanceDuration.vue";

export default {
  components: {
    DifficultyRating,
    WeeklyClassSpending,
    ClassroomPerformance,
    MonthlyClassSpending,
    AttendanceDuration,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const pageData = ref(null);
    onMounted(() => {
      pageData.value = JSON.parse(root.$route.query.rowData);
    });
    return {
      pageData,
      isEn,
      statusTextMap: {
        UNKNOWN: { type: "info", text: "-" },
        GREEN: { type: "success", text: "正常" },
        YELLOW: { type: "warning", text: "关注" },
        RED: { type: "danger", text: "预警" },
      },
    };
  },
};
</script>

<style scoped lang="scss">
.student-indicator-details-warp {
  color: #969696;
  .echarts-box {
    .chart {
      height: 600px;
      //       border: 1px solid #ccc;
    }
  }
}
</style>
