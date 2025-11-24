<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ $t("周课消") }}</span>
      <el-select
        class="fr mr10"
        v-model="screenData.start"
        filterable
        clearable
        :multiple="multiple"
        :collapse-tags="true"
        :placeholder="$t('请选择')"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div ref="myCharts" class="chart-dom"></div>
  </el-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import echarts from "echarts";

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
    rowData: {
      default: {},
      type: Object,
    },
  },
  setup(props, { root, emit, refs }) {
    const screenData = ref({
      idxType: props.idxType,
      subjectType: props.subjectTypeId,
      studentId: props.studentId,
      start: 6,
      extra: "",
    });
    const selectOptions = [
      { label: "近三周", value: 3 },
      { label: "近六周", value: 6 },
      { label: "近十二周", value: 12 },
    ];
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
              text: root.$t("参考标准课消:2节/周"),
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
          right: "5%",
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
            formatter: function (value,index) {
              return `W${index+1}`;
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "周课消",
            type: "line",
            stack: "Total",
            data: data,
          },
        ],
      };
      option && myChart.setOption(option);
    };

    const reqChartData = async () => {
      try {
        const res = await root.$Api.studentManagement.reqLearnOverViewGraph(
          screenData.value
        );
        let date = [];
        let data = [];
        if (res && res.length) {
          res.forEach((e) => {
            date.push(e.reportDate.replace(/-/g, "/"));
            data.push(e.value);
          });
        }
        randerEcharts(date, data);
      } finally {
      }
    };
    watch(
      () => screenData.value.start,
      (val) => {
        switch (val) {
          case 3:
            screenData.value.extra = props.rowData.consumptionLesson3w;
            break;
          case 6:
            screenData.value.extra = props.rowData.consumptionLesson6w;
            break;
          case 12:
            screenData.value.extra = props.rowData.consumptionLesson12w;
            break;
        }
        reqChartData();
      },
      {
        immediate: true,
      }
    );
    return { screenData, selectOptions };
  },
};
</script>

<style scoped lang="scss">
.chart-dom {
  width: 100%;
  height: 450px;
}
</style>
