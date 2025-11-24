<template>
  <div class="part-time-classPay">
    <div class="top-search-wrap">
      <div class="search-left-date mr10">
        <el-date-picker
          v-model="currentDate"
          type="month"
          :picker-options="pickerOptions"
          :placeholder="$t('选择月')"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="center-datashow-wrap">
      <el-card shadow="hover" class="card-flex box-card">
        <div class="card-inner">
          <span class="card-inner-font-weight mb10">{{
            $t("兼职老师课酬")
          }}</span>
          <span v-if="salaryUnit === 2">
            {{ totalAmount | thousandthPercentile }}元课酬 +
            {{ transferAmount }}元转化</span
          >
          <span v-if="salaryUnit === 3">
            {{ totalAmount | thousandthPercentile }} USD课酬 +
            {{ transferAmount }} USD转化</span
          >
        </div>
      </el-card>
      <el-card shadow="hover" class="card-flex box-card">
        <div class="card-inner">
          <span class="card-inner-font-weight mb10">{{
            $t("兼职老师数量")
          }}</span>
          <span>{{ tutorTotal | thousandthPercentile }}人</span>
        </div>
      </el-card>
      <el-card shadow="hover" class="card-flex box-card">
        <div class="card-inner">
          <div class="card-inner-font-weight">{{ $t("课堂数量") }}</div>
          <div class="mt10">{{ classTotal | thousandthPercentile }}节</div>
          <div class="mt20">
            <el-tag type="success">{{ $t("正常课堂") }}</el-tag>
            {{ normalVirtualClassNum | thousandthPercentile }}节
            <span class="ml10">
              <el-tag type="warning">{{ $t("异常课堂") }}</el-tag>
              {{ abnormalVirtualClassNum | thousandthPercentile }}节
            </span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="export-button-wrap mt10">
      <div>
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
          />
        </span>
        <el-button type="primary" class="ml10" @click="search">{{
          $t("查询")
        }}</el-button>
      </div>
      <div>
        <el-button @click="handleExport">{{ $t("导出表格数据") }}</el-button>
      </div>
    </div>
    <div class="table-wrap">
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
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('老师用户名')"
          prop="username"
          width="150"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorId}&teacherName=${scope.row.realName}`,
              }"
            >
              <el-button type="text">{{ scope.row.username }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorId}&teacherName=${scope.row.realName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('老师姓名')"
          prop="realName"
          width="150"
        ></el-table-column>
        <el-table-column align="center" :label="$t('课酬')" prop="salary">
          <template slot-scope="scope">
            <span v-if="scope.row.salaryUnit === 2"
              >{{ scope.row.salary }}元</span
            >
            <span v-if="scope.row.salaryUnit === 3"
              >{{ scope.row.salary }} USD</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('转化')" prop="salary">
          <template slot-scope="scope">
            <span v-if="scope.row.salaryUnit === 2"
              >{{ scope.row.transfer }}元</span
            >
            <span v-if="scope.row.salaryUnit === 3"
              >{{ scope.row.transfer }} USD</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课堂数量')"
          prop="virtualClassNum"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.abnormalLessonNum + scope.row.virtualClassNum
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('正常课堂')"
          prop="virtualClassNum"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('异常课堂')"
          prop="abnormalLessonNum"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('身份证号')"
          prop="identityNumber"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('银行账户')"
          prop="bankAccountNumber"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('开户行')"
          prop="bankName"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('支行名称')"
          prop="bankBranchName"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('上岗时间')"
          prop="workingTime"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.workingTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          prop="name"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="goDetail(scope.row)">{{
              $t("查看明细")
            }}</el-button>
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
import { downloadFile } from "../../../utils/handleData";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  name: "partTimeClassPayCh",
  components: {
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      currentDate: "",
      screenData: {
        pageNum: 1,
        pageSize: 50,
      },
      tableData: [{ name: 1 }],
      loading: false,
      total: 0,
      startTime: "",
      endTime: "",
      totalAmount: 0, //老师人民币总课酬
      salaryUnit: null,
      transferAmount: 0, //转化
      totalSgAmount: 0, // 老师新币总课酬
      tutorTotal: 0, // 老师数量
      oneToOneTotal: 0, // 1v1数量
      smallClassTotal: 0, //小班课数量
      classTotal: 0,
      normalVirtualClassNum: 0,
      abnormalVirtualClassNum: 0,
      pickerOptions: {
        // 判断是否日历上的日期是否小于当前日期
        disabledDate(time) {
          var date = new Date();
          if (
            time.getMonth() === date.getMonth() &&
            time.getFullYear() === date.getFullYear()
          ) {
            return true;
          }
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    currentDate(newData) {
      this.getTutorSalaryTotal();
      this.getTutorSumTotal();
      this.getTutorVirtualTotal();
      this.getTutorVirtualList();
    },
  },
  methods: {
    search() {
      this.pageNum = 1;
      this.getTutorVirtualList();
    },
    handleExport() {
      let y = new Date(this.currentDate).getFullYear(),
        m = new Date(this.currentDate).getMonth() + 1,
        fileName = `兼职教师课程 ${y}-${m}`;
      
      // 构建查询参数
      let queryParams = new URLSearchParams({
        yearAndMonthStr: this.getTheDateOfYYMM(),
        ...this.userParams
      });
      
      downloadFile(
        `${
          process.env.VUE_APP_BASE_API
        }/opsapi/tutor/export/virtual/salary/0/list?${queryParams.toString()}`,
        fileName
      );
    },
    goDetail(scopeRow) {
      this.$router.push(
        `/tutorManagement/partTimeDetail?tutorId=${
          scopeRow.tutorId
        }&time=${this.getTheDateOfYYMM()}&tutorName=${
          scopeRow.realName
        }&localArea=${scopeRow.localArea}`
      );
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTutorVirtualList();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTutorVirtualList();
    },
    getTheDateOfYYMM() {
      var currentDate = new Date(this.currentDate),
        year = currentDate.getFullYear(),
        month =
          currentDate.getMonth() + 1 < 10
            ? `0${currentDate.getMonth() + 1}`
            : currentDate.getMonth() + 1,
        yearAndMonthStr = `${year}${month}`;
      return yearAndMonthStr;
    },
    // 兼职老师课酬
    getTutorSalaryTotal() {
      let params = {
        yearAndMonthStr: this.getTheDateOfYYMM(),
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
    // 兼职老师数量
    getTutorSumTotal() {
      let params = {
        yearAndMonthStr: this.getTheDateOfYYMM(),
      };
      this.$Api.tutorManagement
        .getTutorSumTotal(0, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tutorTotal = data.data;
          }
        });
    },
    // 课堂数量
    getTutorVirtualTotal() {
      let params = {
        yearAndMonthStr: this.getTheDateOfYYMM(),
        tutorType: 0,
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
    // 表格数据
    getTutorVirtualList() {
      this.loading = true;
      var { pageNum, pageSize } = this.screenData;
      var tutorType = 0,
        params = {
          yearAndMonthStr: this.getTheDateOfYYMM(),
          ...this.userParams,
        };
      this.$Api.tutorManagement
        .getTutorVirtualList(tutorType, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.currentDate = this.DateTimeUtils.getLastMonthStartDate();
  },
};
</script>
<style lang="scss" scoped>
.part-time-classPay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .top-search-wrap {
    width: 100%;
    display: flex;
  }
  .search-left-date {
    display: flex;
    align-items: center;
    > span {
      margin-right: 20px;
      color: #666;
    }
  }
  .search-right {
    width: 100%;
    text-align: right;
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
  .export-button-wrap {
    width: 100%;
    // text-align: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
