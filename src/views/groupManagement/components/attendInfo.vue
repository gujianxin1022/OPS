<template>
  <div>
    <div class="f16 pt30 pb30 clear-fix">
      <el-button
        class="right"
        type="primary"
        @click="exportData"
      >{{
        $t("导出数据")
      }}</el-button>
      {{ $t("结束") }} {{ classTimes }} {{ $t("节") }} / {{ $t("共") }}
      {{ appointmentCount }} {{ $t("节") }}
    </div>
    <el-table
      ref="table"
      id="myTable"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      height="380px"
    >
      <el-table-column
        type="index"
        width="120"
        align="center"
        :label="$t('序号')"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        :label="$t('上课时间')"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <div>
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('my-home-Curriculum')"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <span v-show="currentLang==='en'">{{ scope.row.courseEditionId | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEditionId | mapEdtion }}</span>
            Level{{ scope.row.courseLevel }} Lesson{{ scope.row.lessonNo }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="tutorRealName"
        align="center"
        width="180"
        :label="$t('教师')"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in headerData"
        :key="index"
        width="190"
        :label="item.studentRealName"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{
              studentStatus(
                scope.row.smallClassStudentAttendInfoList[index],
                scope.row
              )
            }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="count"
      :current-page="screenData.page"
      @getCurrentPage="handleChangeCurrent"
      @getPerPage="getPerPage"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      statistics: [
        {
          name: "统计",
        },
      ],
      loading: false,
      tableData: [],
      headerData: [],
      count: -1,
      screenData: {
        page: 1,
        page_size: 50,
        class_id: "",
        status: 3,
        ordering: "start_time",
      },
      classTimes: 0,
      appointmentCount: 0,
      groupDetailInfo: null,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    handleChangeCurrent (currentPage) {
      this.screenData.page = currentPage;
      this.getData();
    },
    getPerPage (perPage) {
      this.screenData.page_size = perPage;
      this.getData();
    },
    getData () {
      this.loading = true;
      if (window.sessionStorage.getItem("group")) {
        this.screenData.class_id = JSON.parse(
          window.sessionStorage.getItem("group")
        ).id;
      } else {
        this.screenData.class_id = this.$route.query.id;
      }
      if (this.groupDetailInfo.type == 2) {
        this.$Api.classManagement
          .getSmallClassAttendInfo(
            this.screenData.class_id,
            this.screenData.page,
            this.screenData.page_size
          )
          .then(({ status, data }) => {
            this.tableData = data.data.list;
            this.count = data.data.total;
            if (this.tableData.length != 0) {
              if (this.tableData[0].smallClassStudentAttendInfoList) {
                this.headerData = [
                  ...this.tableData[0].smallClassStudentAttendInfoList,
                ];
              }
            }
            this.loading = false;
          });
      } else {
        this.$Api.classManagement
          .getBigClassAttendInfo(
            this.screenData.class_id,
            this.screenData.page,
            this.screenData.page_size
          )
          .then(({ status, data }) => {
            this.tableData = data.data.list;
            this.count = data.data.total;
            if (this.tableData.length != 0) {
              if (this.tableData[0].smallClassStudentAttendInfoList) {
                this.headerData = [
                  ...this.tableData[0].smallClassStudentAttendInfoList,
                ];
              }
            }
            this.loading = false;
          });
      }
    },
    tableToExcel (table, name) {
      var uri = "data:application/vnd.ms-excel;base64,",
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
          });
        };
      return function (table, name) {
        var ctx = {
          worksheet: name || "Worksheet",
          table: table.innerHTML,
        };
        window.location.href = uri + base64(format(template, ctx));
      };
    },
    exportData () {
      this.$nextTick(() => {
        let myTable = document.getElementById("myTable");
        this.tableToExcel()(myTable, "导出表格");
      });
      return;
    },
    studentStatus (items, scope) {
      let { enterTime, leaveTime, status } = items;
      let { endTime, startTime } = scope;
      let before = "",
        after = "",
        msg = "";

      if (status == 2) {
        if (!enterTime && !leaveTime) {
          return this.currentLang == "en" ? "Absent" : "缺席";
        } else {
          before = `${this.DateTimeUtils.dateClockTime(enterTime).split(" ")[1]
            }`;
          after = `${this.DateTimeUtils.dateClockTime(leaveTime).split(" ")[1]
            }`;
          if (new Date(startTime).getTime() < new Date(enterTime).getTime()) {
            before = ` ${this.DateTimeUtils.dateClockTime(enterTime).split(" ")[1] || ""
              }(${this.currentLang == "en" ? "Late" : "迟到"})`;
          }
          if (new Date(endTime).getTime() > new Date(leaveTime).getTime()) {
            after = `${this.DateTimeUtils.dateClockTime(leaveTime).split(" ")[1] || ""
              }(${this.currentLang == "en" ? "Leave early" : "早退"})`;
          }

          return before + " - " + after;
        }
      } else {
        return this.statusMap(status);
      }
    },
    statusMap (status, currentLang = this.currentLang) {
      switch (status) {
        case 1:
          return currentLang == "en" ? "Not yet joined" : "尚未加入";
          break;
        case 2:
          return currentLang == "en" ? "Normal" : "正常";
          break;
        case 3:
          return currentLang == "en" ? "Exited" : "已经退出";
          break;
        case 4:
          return currentLang == "en" ? "Leave" : "请假";
          break;
        case 5:
          return currentLang == "en" ? "Course adjustment" : "调课";
          break;
        default:
          break;
      }
    },
  },
  created () {
    this.groupDetailInfo =
      (Object.values(this.$route.query).length ? this.$route.query : false) ||
      JSON.parse(window.sessionStorage.getItem("group"));
    this.getData();
    if (this.groupDetailInfo.type == 2) {
      this.$Api.classManagement
        .getSmallClassAttendStatisticInfo(
          this.$route.query.id || this.groupDetailInfo.id
        )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.classTimes = data.data.finishCourseNum;
            this.appointmentCount = data.data.scheduleCourseNum;
          }
        });
    } else {
      this.$Api.classManagement
        .getBigClassAttendStatisticInfo(
          this.$route.query.id || this.groupDetailInfo.id
        )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.classTimes = data.data.finishCourseNum;
            this.appointmentCount = data.data.scheduleCourseNum;
          }
        });
    }
  },
};
</script>
