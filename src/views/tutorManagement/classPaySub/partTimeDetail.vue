<template>
  <div class="part-time-detail-wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="新数据" :name="DATA_TYPE.NEW"></el-tab-pane>
      <el-tab-pane label="老数据" :name="DATA_TYPE.OLD"></el-tab-pane>
    </el-tabs>
    <div class="top-message-wrap mt20">
      <span>统计周期：{{ time.slice(0, 4) }}年{{ time.slice(4) }}月</span>
      <span class="ml20">当前老师：{{ tutorName }}</span>
    </div>
    <div class="center-datashow-wrap" v-loading="loading">
      <el-card shadow="hover" class="card-flex box-card">
        <div class="card-inner">
          <span class="card-inner-font-weight mb10">课酬</span>
          <div>
            <span
              >课酬{{ totalAmount | thousandthPercentile }}
              <span v-if="salaryUnit === 2">元</span>
              <span v-if="salaryUnit === 3">USD</span>
            </span>
            +
            <span
              >转化{{ transferAmount }}<span v-if="salaryUnit === 2">元</span>
              <span v-if="salaryUnit === 3">USD</span></span
            >
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="card-flex box-card" v-loading="loading">
        <div class="card-inner">
          <div class="card-inner-font-weight">学生数量</div>
          <div>{{ studentTotal }}人</div>
          <!-- <div class="mt20">
            <el-tag type="success">1v1</el-tag> {{ oneToOneTotal }}人
            <span class="ml10"><el-tag>小班课</el-tag> {{ smallClassTotal }}人</span>
          </div> -->
        </div>
      </el-card>
      <el-card shadow="hover" class="card-flex box-card" v-loading="loading">
        <div class="card-inner">
          <div class="card-inner-font-weight">课堂数量</div>
          <div class="mt10">{{ classTotal | thousandthPercentile }}节</div>
          <div class="mt20">
            <el-tag type="success">正常课堂</el-tag>
            {{ normalVirtualClassNum | thousandthPercentile }}节
            <span class="ml10">
              <el-tag type="warning">异常课堂</el-tag>
              {{ abnormalVirtualClassNum | thousandthPercentile }}节
            </span>
          </div>
        </div>
      </el-card>
    </div>
    <classPayDetailEn v-if="activeName === DATA_TYPE.NEW" :tutorIdC="tutorId" :timeC="time" :tutorNameC="tutorName" />
    <div class="table-wrap" v-else>
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column fixed align="center" :label="$t('序号')">
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上课时间"
          prop="startTime"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="基础课酬"
          prop="baseAmount"
          width="150"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.baseAmount ? scope.row.baseAmount : 0 }}
              <span v-if="scope.row.salaryUnit === 1">新币</span>
              <span v-if="scope.row.salaryUnit === 2">元</span>
              <span v-if="scope.row.salaryUnit === 3">USD</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="补偿"
          prop="compensateAmount"
          width="150"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.compensateAmount ? scope.row.compensateAmount : 0
              }}<span v-if="scope.row.salaryUnit === 1">新币</span>
              <span v-if="scope.row.salaryUnit === 2">元</span>
              <span v-if="scope.row.salaryUnit === 3">USD</span></span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="罚金"
          prop="punishAmount"
          width="150"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.punishAmount ? scope.row.punishAmount : 0
              }}<span v-if="scope.row.salaryUnit === 1">新币</span>
              <span v-if="scope.row.salaryUnit === 2">元</span>
              <span v-if="scope.row.salaryUnit === 3">USD</span></span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="凌晨补助" prop="subsidyAmount">
          <template slot-scope="scope">
            <span
              >{{ scope.row.subsidyAmount ? scope.row.subsidyAmount : 0
              }}<span v-if="scope.row.salaryUnit === 1">新币</span>
              <span v-if="scope.row.salaryUnit === 2">元</span>
              <span v-if="scope.row.salaryUnit === 3">USD</span></span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('小班课补贴')"
          prop="smallClassFee"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="学生/班级"
          prop="name"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          label="班型"
          prop="classType"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.classType | mapClassType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="课程" prop="name" width="150">
          <template slot-scope="scope">
            <span
              >{{
                currentLang === "zh"
                  ? scope.row.editionNameOpsZh
                  : scope.row.editionNameOpsEn
              }}
              {{ scope.row.courseName }} Lesson{{ scope.row.lessonNo }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="课堂反馈"
          prop="name"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.feedbackStatus === 0 ? "未反馈" : "已反馈"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="课堂状态"
          prop="virtualClassStatus"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.virtualClassStatus"></span>
            <span v-else>{{
              scope.row.virtualClassStatus === 3 ? "正常" : "异常"
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import classPayDetailEn from "./classPayDetailEn.vue";
const DATA_TYPE = {
  NEW: 1,
  OLD: 2,
};
export default {
  name: "partTimeDetail",
  components: {
    classPayDetailEn,
  },
  data() {
    return {
      DATA_TYPE,
      activeName: DATA_TYPE.NEW,
      tableData: [{ name: 1 }],
      loading: false,
      total: 0,
      screenData: {
        pageNum: 1,
        pageSize: 50,
      },
      oneToOneTotal: 0,
      smallClassTotal: 0,
      oneToOneTotalClass: 0,
      smallClassTotalClass: 0,
      totalAmount: 0,
      transferAmount: 0,
      totalSgAmount: 0,
      classTotal: 0,
      normalVirtualClassNum: 0,
      abnormalVirtualClassNum: 0,
      studentTotal: 0,
      salaryUnit: null,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    tutorId() {
      return this.$route.query.tutorId;
    },
    time() {
      return this.$route.query.time;
    },
    tutorName() {
      return this.$route.query.tutorName;
    },
    localArea() {
      return this.$route.query.localArea * 1;
    },
  },
  methods: {
    handleClick() {
      this.getTableData();
    },
    // 获取老师学生总数
    getTutorStudentTotal() {
      this.$Api.tutorManagement
        .getTutorStudentTotal(this.tutorId, { yearAndMonthStr: this.time })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.studentTotal = data.data;
          }
        });
    },
    // 获取老师课堂总数
    getTutorVirtualTotal() {
      let params = {
        yearAndMonthStr: this.time,
        tutorType: 0,
        tutorId: this.tutorId,
      };
      this.$Api.tutorManagement
        .getTutorVirtualTotal(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            let { abnormalVirtualClassNum, normalVirtualClassNum } = data.data;
            this.classTotal = abnormalVirtualClassNum + normalVirtualClassNum;
            this.normalVirtualClassNum = normalVirtualClassNum;
            this.abnormalVirtualClassNum = abnormalVirtualClassNum;
          }
        });
    },
    // 获取老师表格数据
    getTableData() {
      this.loading = true;
      var tutorType = 0,
        tutorId = this.tutorId,
        pageNum = this.screenData.pageNum,
        pageSize = this.screenData.pageSize,
        params = {
          yearAndMonthStr: this.time,
        };
      const url =
        this.activeName === DATA_TYPE.NEW
          ? "getTutorVirtutalClassSalaryListV2"
          : "getTutorVirtutalClassSalaryList";
      this.$Api.tutorManagement[url](tutorId, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
            this.loading = false;
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
          this.total = 0;
        });
    },
    // 兼职老师课酬
    getTutorSalaryTotal() {
      let params = {
        yearAndMonthStr: this.time,
        tutorId: this.tutorId,
      };
      this.$Api.tutorManagement
        .getTutorSalaryTotal(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            let { totalAmount, totalSgAmount, transferAmount, salaryUnit } =
              data.data;
            this.totalAmount = totalAmount == null ? 0 : totalAmount;
            this.totalSgAmount = totalSgAmount == null ? 0 : totalSgAmount;
            this.transferAmount = transferAmount === null ? 0 : transferAmount;
            this.salaryUnit = salaryUnit;
          }
        });
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
  },
  created() {
    this.getTutorStudentTotal();
    this.getTutorVirtualTotal();
    this.getTableData();
    this.getTutorSalaryTotal();
  },
};
</script>
<style lang="scss" scoped>
.part-time-detail-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .top-message-wrap {
    width: 100%;
    font-size: 14px;
  }
  .center-datashow-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }
  .card-flex {
    width: 33%;
    padding: 0 10px;
    padding: 0;
  }
  .card-inner {
    width: 100%;
    height: 102px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 14px;
    box-sizing: border-box;
    .card-inner-font-weight {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
