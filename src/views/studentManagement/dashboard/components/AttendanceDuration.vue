<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ $t("出勤时长") }}</span>
      <el-date-picker
        class="fr mr10"
        v-model="screenData.date"
        type="daterange"
        align="right"
        range-separator="~"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </div>
    <div ref="myCharts" class="chart-dom"></div>
  </el-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import echarts from "echarts";
import moment from "moment";
import { deepClone } from "@/utils/handleData";
export default {
  props: {
    idxType: {
      default: -1,
      type: Number,
    },
    subjectTypeId: {
      default: -1,
      type: Number,
    },
    studentId: {
      default: -1,
      type: Number,
    },
  },
  setup(props, { root, emit, refs }) {
    const screenData = ref({
      date: [],
      idxType: props.idxType,
      subjectType: props.subjectTypeId,
      studentId: props.studentId,
    });
    const randerEcharts = async (date, data) => {
      let myChart = echarts.init(refs.myCharts);
      const option = {
        title: !data.length
          ? {
              text: "暂无数据",
              x: "center",
              y: "center",
              textStyle: {
                fontSize: 14,
                fontWeight: "normal",
              },
            }
          : {
              text: root.$t("参考标准分值:25min/55min"),
              x: "left",
              y: "top",
              textStyle: {
                fontSize: 18,
                fontWeight: "700",
              },
            },
        tooltip: {
          trigger: "axis",
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
          data: date,
          axisLabel: {
            formatter: function (value, index) {
              return value.split(" ").join("\n");
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: root.$t("出勤时长"),
            type: "line",
            stack: "Total",
            data: data,
          },
        ],
      };
      option && myChart.setOption(option);
    };
    const pickerOptions = {
      shortcuts: [
        {
          text: root.$t("最近一周"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: root.$t("最近一个月"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          },
        },
      ],
      disabledDate: (time) => {
        return time.getTime() > Date.now();
      },
    };
    const reqChartData = async () => {
      const params = deepClone(screenData.value);
      params.start = params.date[0];
      params.end = params.date[1];
      delete params.date;
      try {
        const res = await root.$Api.studentManagement.reqLearnOverViewGraph(
          params
        );
        let date = [];
        let data = [];
        if (res && res.length) {
          res.forEach((e) => {
            let time=root.DateTimeUtils.dateClockTime(e.reportDate)
            date.push(time.replace(/-/g,'/'));
            data.push(e.value);
          });
        }
        randerEcharts(date, data);
      } finally {
      }
    };
    watch(
      () => screenData.value.date,
      (val) => {
        const diffNum = Math.abs(moment(val[0]).diff(moment(val[1]), "days"));
        if (diffNum > 30) {
          root.$notify.warning(root.$t("最多筛选30天数据"));
          return;
        }
        reqChartData();
      }
    );
    const initDate = () => {
      screenData.value.date = [
        moment(new Date(new Date().getTime() - 3600 * 1000 * 24 * 15)).format(
          "YYYY-MM-DD"
        ),
        moment(new Date()).format("YYYY-MM-DD"),
      ];
    };
    onMounted(() => {
      initDate();
    });

    return { screenData, pickerOptions };
  },
};
</script>

<style scoped lang="scss">
.chart-dom {
  width: 100%;
  height: 450px;
}
</style>
