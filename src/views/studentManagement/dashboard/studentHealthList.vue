<template>
  <div class="student-health-list-warp p20 clearfix">
    <el-alert
      :title="
        $t('数据范围以所选的日期为节点,周期数据以所选日期前一个周期开始计算')
      "
      type="warning"
      class="mb20"
    >
    </el-alert>
    <div class="title mb20">{{ $t("用户健康度列表") }}</div>
    <div class="search mb20">
      <FilterBySubjectNotMusic
        style="width: 100px"
        class="mr10 mb10"
        :initVal="screenData.subjectTypeId"
        @changeSelect="
          (val) => {
            screenData.subjectTypeId = val;
          }
        "
      />
      <FilterByUserRenewalPhase
        style="width: 180px"
        :multiple="true"
        :initVal="screenData.studentLifeCycles"
        class="mr10"
        @change="
          (val) => {
            screenData.studentLifeCycles = val;
          }
        "
      />
      <FilterByStudentBalanceCycles
        style="width: 228px"
        class="mr10"
        :multiple="true"
        :initVal="screenData.studentBalanceCycles"
        @change="
          (val) => {
            screenData.studentBalanceCycles = val;
          }
        "
      />
      <el-input
        class="mr10"
        style="width: 160px"
        clearable
        v-model.trim="screenData.parentId"
        :placeholder="$t('glb-input') + (isEn ? '...' : '家长ID')"
      />
      <el-input
        class="mr10"
        style="width: 160px"
        clearable
        v-model="screenData.studentName"
        :placeholder="$t('glb-input') + (isEn ? '...' : '学生账户名')"
      />
      <FilterBySingleDate
        style="width: 192px"
        class="mr10"
        :defaultCurDate="true"
        invalidTime="2023-09-01"
        @changeSelect="changeSingleDate"
      />
      <el-button type="primary" @click="getOverViewList()">{{
        $t("查询")
      }}</el-button>
    </div>
    <el-tabs class="mb20" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部用户')" name="allStudents"></el-tab-pane>
      <el-tab-pane :label="$t('预警用户')" name="warnStudents"></el-tab-pane>
      <el-tab-pane
        :label="$t('异常用户')"
        name="abnormalStudents"
      ></el-tab-pane>
      <el-tab-pane :label="$t('正常用户')" name="normalStudents"></el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="loading"
      :data="list"
      stripe
      @sort-change="handleSort"
      style="width: 100%"
    >
      <el-table-column align="center" :label="$t('序号')" :width="50">
        <template slot-scope="scope">{{
          (pageNum - 1) * pageSize + scope.$index + 1
        }}</template>
      </el-table-column>
      <el-table-column prop="parentId" :label="$t('家长id')" width="180">
      </el-table-column>
      <el-table-column prop="studentId" :label="$t('学生id')" width="180">
      </el-table-column>
      <el-table-column prop="studentName" :label="$t('学生姓名')" width="180">
      </el-table-column>
      <el-table-column
        prop="warnStatusCnt"
        width="150px"
        :label="$t('异常指标')"
        sortable="custom"
      >
      </el-table-column>
      <el-table-column prop="finalStatus" width="100px" :label="$t('健康状态')">
        <template slot-scope="scope">
          <el-tag :type="statusTextMap[scope.row.finalStatus].type">
            {{ $t(statusTextMap[scope.row.finalStatus].text) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="lastClassStartTime"
        :label="$t('上次上课时间')"
      >
        <template slot-scope="scope">
          <span>{{
            DateTimeUtils.dateClockTime(scope.row.lastClassStartTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="studentBalanceCycle"
        :label="$t('剩余课时预计消耗时长')"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="studentLifeCycle"
        :label="$t('用户阶段')"
        width="180"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columnProps"
        :key="index"
        align="center"
        :show-overflow-tooltip="true"
        min-width="200"
      >
        <template slot="header" slot-scope="scope">
          <span>{{ item.indexDisplay }}</span>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content" style="line-height: 20px">
              <span>
                <span style="font-weight: 700; font-size: 15px"> 指标规则:</span
                ><br />{{ item.indexDesc }}</span
              >
              <br /><span
                ><span style="font-weight: 700; font-size: 15px">
                  指标预警规则:</span
                ><br />{{ item.indexRules }}</span
              >
            </div>
            <i
              style="font-size: 16px; cursor: pointer"
              class="el-icon-question"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div v-for="ite in scope.row.propsArr" :key="ite.key">
            <div
              :style="`color:${statusColorMap[ite.color]}`"
              v-if="ite.key === item.indexName"
            >
              <span style="font-weight: 700">{{
                ite.value == null ? "-" : ite.value
              }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    
      <el-table-column align="center" prop :label="$t('操作')" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetailPage(scope.row)">{{
            $t("查看详情")
          }}</el-button></template
        ></el-table-column
      >
    </el-table>
    <el-pagination
      class="fr mt10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import {
  ref,
  computed,
  toRefs,
  onMounted,
  reactive,
  watch,
} from "@vue/composition-api";
import FilterByUserRenewalPhase from "@/components/FilterItem/EnumerateFilter/FilterByUserRenewalPhase";
import FilterBySubjectNotMusic from "@/components/FilterItem/CommodityFilter/FilterBySubjectNotMusic";
import FilterByStudentBalanceCycles from "@/components/FilterItem/EnumerateFilter/FilterByStudentBalanceCycles";
import FilterBySingleDate from "@/components/FilterItem/CommodityFilter/FilterBySingleDate";
import { deepClone } from "@/utils/handleData";
import moment from "moment";

export default {
  components: {
    FilterByUserRenewalPhase,
    FilterBySubjectNotMusic,
    FilterBySingleDate,
    FilterByStudentBalanceCycles,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = ref({
      opsUserId: JSON.parse(localStorage.userInfo).id,
      subjectTypeId: "",
      studentLifeCycles: [],
      studentBalanceCycles: [],
      parentId: "",
      studentName: "",
      reportDate: "",
      endReportDate: "",
      healthType: null,
    });
    const activeName = ref("");
    const tableData = ref([{}]);

    const toDetailPage = async (val) => {
      root.$router.push({
        path: "/studentManagement/studentIndicatorDetails",
        query: { rowData: JSON.stringify(val) },
      });
    };
    const tableState = reactive({
      list: [],
      loading: false,
      total: 0,
      pageNum: 1,
      pageSize: 50,
      allList: [],
    });
    const getOverViewList = async () => {
      try {
        tableState.pageNum = 1;
        tableState.list = [];
        tableState.loading = true;
        let params = deepClone(screenData.value);
        params.subjectTypeId = params.subjectTypeId - 0;
        const res = await root.$Api.studentManagement.reqLearnOverViewList(
          params
        );
        let result = res ? await assembleData(res) : [];
        tableState.allList = deepClone(result) || [];
        tableState.total = tableState.allList.length;
        tableState.list = queryByPage();
      } finally {
        tableState.loading = false;
      }
    };

    const queryByPage = () => {
      const start = (tableState.pageNum - 1) * tableState.pageSize;
      const end = tableState.pageNum * tableState.pageSize;
      return tableState.allList.slice(start, end);
    };
    const handleSizeChange = (val) => {
      tableState.pageSize = val;
      tableState.pageNum = 1;
      tableState.list = queryByPage();
    };
    const handleCurrentChange = (val) => {
      tableState.pageNum = val;
      tableState.list = queryByPage();
    };

    const assembleData = async (res) => {
      res.forEach((e) => {
        let propsArr = [];
        propsArr[0] = {
          key: "lastClassLessonScore",
          value: e.lastClassLessonScore,
          color: e.lastClassLessonScoreStatus,
        };
        propsArr[1] = {
          key: "lastClassStudentSpeakRate",
          value: e.lastClassStudentSpeakRate,
          color: e.lastClassStudentSpeakRateStatus,
        };
        propsArr[2] = {
          key: "lastClassTeacherScore",
          value: e.lastClassTeacherScore,
          color: e.lastClassTeacherScoreStatus,
        };
        propsArr[3] = {
          key: "abnormalAttendanceCnt",
          value: e.abnormalAttendanceCnt,
          color: e.abnormalAttendanceCntStatus,
        };
        propsArr[4] = {
          key: "absencesCnt",
          value: e.absencesCnt,
          color: e.absencesCntStatus,
        };
        propsArr[5] = {
          key: "balanceConsumptionRate",
          value: e.balanceConsumptionRate,
          color: e.balanceStatus,
        };
        propsArr[6] = {
          key: "consumptionLesson3w",
          value: e.consumptionLesson3w,
          color: e.consumptionLesson3wStatus,
        };
        propsArr[7] = {
          key: "consumptionLesson3m",
          value: e.consumptionLesson3m,
          color: e.consumptionLesson3mStatus,
        };
        propsArr[8] = {
          key: "roomTicketCnt",
          value: e.roomTicketCnt,
          color: e.roomTicketCntStatus,
        };

        e.propsArr = propsArr;
      });
      return res;
    };
    const columnProps = ref([]);
    const reqColumnProps = async () => {
      const res = await root.$Api.studentManagement.reqLearnOverViewIndices();
      columnProps.value = res ?? [];
    };
    watch(
      () => activeName.value,
      (val) => {
        if (!val.length) return;
        switch (val) {
          case "allStudents":
            screenData.value.healthType = null;
            break;
          case "warnStudents":
            screenData.value.healthType = 3;
            break;
          case "abnormalStudents":
            screenData.value.healthType = 2;
            break;
          case "normalStudents":
            screenData.value.healthType = 1;
            break;
        }
        getOverViewList();
      },
      {
        immediate: true,
      }
    );
    const changeSingleDate = (time) => {
      screenData.value.reportDate = moment(new Date(time[0]).getTime()).format(
        "YYYY-MM-DD"
      );
      screenData.value.endReportDate = moment(
        new Date(time[0]).getTime()
      ).format("YYYY-MM-DD");
    };

    const handleSort = ({ column, prop, order }) => {
      switch (order) {
        case "ascending":
          tableState.allList.sort(function (a, b) {
            return a.warnStatusCnt - b.warnStatusCnt;
          });
          break;
        case "descending":
          tableState.allList.sort(function (a, b) {
            return b.warnStatusCnt - a.warnStatusCnt;
          });
          break;
      }
      tableState.pageNum = 1;
      tableState.list = queryByPage();
    };
    onMounted(async () => {
      activeName.value = root.$route.query.tabName;
      Object.assign(screenData.value, JSON.parse(root.$route.query.screenData));
      await reqColumnProps();
    });

    return {
      isEn,
      screenData,
      activeName,
      tableData,
      ...toRefs(tableState),
      statusColorMap: {
        UNKNOWN: "#666",
        GREEN: "#67C23A",
        YELLOW: "#E6A23C",
        RED: "#F56C6C",
      },
      statusTextMap: {
        UNKNOWN: { type: "info", text: "-" },
        GREEN: { type: "success", text: "正常" },
        YELLOW: { type: "warning", text: "异常" },
        RED: { type: "danger", text: "预警" },
      },
      columnProps,
      getOverViewList,
      toDetailPage,
      handleSizeChange,
      handleCurrentChange,
      changeSingleDate,
      handleSort,
    };
  },
};
</script>

<style scoped lang="scss">
.student-health-list-warp {
  color: #969696;
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 200px !important;
}
</style>
