<template>
  <div class="student-dashboard-warp p20">
    <el-alert
      :title="
        $t('数据范围以所选的日期为节点,周期数据以所选日期前一个周期开始计算')
      "
      type="warning"
      class="mb20"
    >
    </el-alert>
    <div class="header mb20">
      <div class="title">{{ $t("今日用户健康度大盘") }}</div>
      <div class="search">
        <FilterBySubjectNotMusic
          style="width: 100px"
          class="mr10"
          :initVal="screenData.subjectTypeId"
          @changeSelect="
            (val) => {
              screenData.subjectTypeId = val;
            }
          "
        />
        <FilterByUserRenewalPhase
          class="mr10"
          :multiple="true"
          @change="
            (val) => {
              screenData.studentLifeCycles = val;
            }
          "
        />
        <FilterByStudentBalanceCycles
          class="mr10"
          :multiple="true"
          @change="
            (val) => {
              screenData.studentBalanceCycles = val;
            }
          "
        />
        <el-button
          :loading="loadingSummary"
          @click="getOverViewSummary"
          type="primary"
          >{{ $t("查询") }}</el-button
        >
      </div>
    </div>
    <el-row class="data-card mb20" :gutter="20">
      <el-col :span="6">
        <el-card shadow="always">
          <div
            class="card"
            v-loading="loadingSummary"
            @click="toListPage('allStudents')"
          >
            <div class="icon">
              <img :src="allUser" alt="" />
            </div>
            <div class="data">
              <div class="data-title">{{ $t("全部用户") }}</div>
              <div class="data-num">{{ allStudentCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <div
            class="card"
            v-loading="loadingSummary"
            @click="toListPage('warnStudents')"
          >
            <div class="icon">
              <img :src="warnUser" alt="" />
            </div>
            <div class="data">
              <div class="data-title">{{ $t("预警用户") }}</div>
              <div class="data-num">{{ warnStatusCnt }}</div>
            </div>
          </div>
        </el-card> </el-col
      ><el-col :span="6">
        <el-card shadow="always">
          <div
            class="card"
            v-loading="loadingSummary"
            @click="toListPage('abnormalStudents')"
          >
            <div class="icon">
              <img :src="abnormalUser" alt="" />
            </div>
            <div class="data">
              <div class="data-title">{{ $t("异常用户") }}</div>
              <div class="data-num">{{ abnormalStatusCnt }}</div>
            </div>
          </div>
        </el-card> </el-col
      ><el-col :span="6">
        <el-card shadow="always">
          <div
            class="card"
            v-loading="loadingSummary"
            @click="toListPage('normalStudents')"
          >
            <div class="icon">
              <img :src="normalUser" alt="" />
            </div>
            <div class="data">
              <div class="data-title">{{ $t("正常用户") }}</div>
              <div class="data-num">{{ normalStatusCnt }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="chart">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ $t("学情趋势") }}</span>
          <el-button
            class="fr"
            :loading="trendloading"
            @click="getOverViewTrend"
            type="text"
            >{{ $t("查询") }}</el-button
          >
          <el-date-picker
            class="fr mr10"
            v-model="chartScreenData.dateArr"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>

          <FilterByStudentBalanceCycles
            class="fr mr10"
            :multiple="true"
            @change="
              (val) => {
                chartScreenData.studentBalanceCycles = val;
              }
            "
          />
          <FilterByUserRenewalPhase
            class="fr mr10"
            :multiple="true"
            @change="
              (val) => {
                chartScreenData.studentLifeCycles = val;
              }
            "
          />
          <FilterBySubjectNotMusic
            style="width: 100px"
            class="fr mr10"
            :initVal="chartScreenData.subjectTypeId"
            @changeSelect="
              (val) => {
                chartScreenData.subjectTypeId = val;
              }
            "
          />
        </div>
        <div v-loading="trendloading">
          <div ref="myCharts" class="chart-dom"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { ref, reactive, toRefs, onMounted,watch } from "@vue/composition-api";
import FilterByUserRenewalPhase from "@/components/FilterItem/EnumerateFilter/FilterByUserRenewalPhase";
import FilterByStudentBalanceCycles from "@/components/FilterItem/EnumerateFilter/FilterByStudentBalanceCycles";
import FilterBySubjectNotMusic from "@/components/FilterItem/CommodityFilter/FilterBySubjectNotMusic";
import echarts from "echarts";
import allUser from "@/assets/students/全部用户.png";
import warnUser from "@/assets/students/预警用户.png";
import abnormalUser from "@/assets/students/异常用户.png";
import normalUser from "@/assets/students/正常用户.png";
import moment from "moment";

export default {
  components: {
    FilterByUserRenewalPhase,
    FilterByStudentBalanceCycles,
    FilterBySubjectNotMusic,
  },
  setup(props, { root, emit, refs }) {
    const screenData = ref({
      studentLifeCycles: [],
      studentBalanceCycles: [],
      subjectTypeId: "0",
      opsUserId: JSON.parse(localStorage.userInfo).id,
    });
    const overViewSummaryState = reactive({
      allStudentCount: 0,
      warnStatusCnt: 0,
      abnormalStatusCnt: 0,
      normalStatusCnt: 0,
      loadingSummary: false,
    });
    const chartScreenData = ref({
      dateArr: [],
      studentLifeCycles: [],
      studentBalanceCycles: [],
      subjectTypeId: "0",
      opsUserId: JSON.parse(localStorage.userInfo).id,
    });
    const pickerOptions = {
      shortcuts: [
        {
          text: "最近7天",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: "最近30天",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          },
        },
      ],
    };
    const toListPage = (tabName) => {
      root.$router.push({
        path: "/studentManagement/studentHealthList",
        query: {
          tabName: tabName,
          screenData: JSON.stringify(screenData.value),
        },
      });
    };
    const randerEcharts = async (res) => {
      let allStudentCount = [];
      let warnStatusCnt = [];
      let abnormalStatusCnt = [];
      let normalStatusCnt = [];
      let data = [];
      res.forEach((e) => {
        allStudentCount.push(e.allStudentCount);
        warnStatusCnt.push(e.warnStatusCnt);
        abnormalStatusCnt.push(e.abnormalStatusCnt);
        normalStatusCnt.push(e.normalStatusCnt);
        data.push(e.reportDate);
      });
      let myChart = echarts.init(refs.myCharts);
      const option = {
        color: ["#6675DD", "#F14648", "#FF9727", "#008447"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [root.$t("全部用户"), root.$t("预警用户"), root.$t("异常用户"), root.$t("正常用户")],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: { show: false },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: root.$t("全部用户"),
            type: "line",
            data: allStudentCount,
          },
          {
            name: root.$t("预警用户"),
            type: "line",
            data: warnStatusCnt,
          },
          {
            name: root.$t("异常用户"),
            type: "line",
            data: abnormalStatusCnt,
          },
          {
            name: root.$t("正常用户"),
            type: "line",
            data: normalStatusCnt,
          },
        ],
      };
      option && myChart.setOption(option);
    };
    const trendloading = ref(false);
    const getOverViewTrend = async () => {
      try {
        const {
          studentLifeCycles,
          dateArr,
          subjectTypeId,
          opsUserId,
          studentBalanceCycles,
        } = chartScreenData.value;
        trendloading.value = true;
        const res = await root.$Api.studentManagement.reqLearnOverViewTrend({
          studentLifeCycles,
          subjectTypeId,
          opsUserId,
          studentBalanceCycles,
          reportDate: dateArr[0],
          endReportDate: dateArr[1],
        });
        randerEcharts(res);
      } finally {
        trendloading.value = false;
      }
    };
    const getOverViewSummary = async () => {
      try {
        overViewSummaryState.loadingSummary = true;
        const res = await root.$Api.studentManagement.reqLearnOverViewSummary(
          screenData.value
        );
        if (res === null) {
          overViewSummaryState.allStudentCount = 0;
          overViewSummaryState.warnStatusCnt = 0;
          overViewSummaryState.abnormalStatusCnt = 0;
          overViewSummaryState.normalStatusCnt = 0;
          return;
        }
        Object.assign(overViewSummaryState, res);
      } finally {
        overViewSummaryState.loadingSummary = false;
      }
    };
    watch(
      () => chartScreenData.value.dateArr,
      (val) => {
        const diffNum = Math.abs(moment(val[0]).diff(moment(val[1]), "days"));
        if (diffNum > 30) {
          root.$notify.warning(root.$t("最多筛选30天数据"));
          chartScreenData.value.dateArr=[]
          return;
        }
      }
    );
    onMounted(() => {
      chartScreenData.value.dateArr = [
        moment(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)).format(
          "YYYY-MM-DD"
        ),
        moment(new Date()).format("YYYY-MM-DD"),
      ];
      getOverViewSummary();
      getOverViewTrend();
    });

    return {
      screenData,
      chartScreenData,
      pickerOptions,
      allUser,
      warnUser,
      abnormalUser,
      normalUser,
      trendloading,
      ...toRefs(overViewSummaryState),
      toListPage,
      getOverViewSummary,
      getOverViewTrend,
    };
  },
};
</script>
<style scoped lang="scss">
.student-dashboard-warp {
  min-width: 1000px;
  color: #969696;
  .header {
    display: flex;
    .title {
      flex: 1;
    }
    .search {
      flex: 2;
      text-align: right;
    }
  }
  .data-card {
    .card {
      height: 60px;
      display: flex;
      cursor: pointer;
      .icon {
        flex: 2;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .data {
        color: #666666;
        flex: 4;
        padding-left: 20px;
        line-height: 30px;
        .data-title {
          font-size: 14px;
        }
        .data-num {
          font-size: 26px;
          font-weight: 700px;
        }
      }
    }
  }
  .chart {
    .chart-dom {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
