<template>
  <div class="part-time-classPay">

    <div class="top-search-wrap">
      <div class="export-button-wrap mt10">
        <div class="search-left-date mr10">
          <el-date-picker
            v-model="currentDate"
            type="month"
            :picker-options="pickerOptions"
            :placeholder="$t('选择月')"
          >
          </el-date-picker>
          <span class="ml20" style="display: inline-block; width: 412px;">
            <FilterByUserAccount
              @change="
                (params) => {
                  userParams = params;
                }
              "
            />
          </span>
          <el-button
            type="primary"
            class="ml10"
            @click="search"
          >{{$t('查询')}}</el-button>
        </div>

        <div> 
          <!-- <el-button @click="handleImport" style="padding-right: 10px;">{{$t('导入数据')}}</el-button> -->
          <el-button @click="handleExport" style="padding-right: 10px;">{{$t('导出报表')}}</el-button>
        </div>
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
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        
        <el-table-column
          align="center"
          :label="$t('教师ID')"
          prop="tutorUserId"
          width="180"
        >
        </el-table-column>
        
        <el-table-column
          align="center"
          :label="$t('教师昵称')"
          prop="tutorRealName"
          min-width="150"
        ></el-table-column>
        
        <el-table-column
          align="center"
          :label="$t('总课酬')"
          prop="totalFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalFee }} {{ $t('美元') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('课时费用')"
          prop="baseFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.baseFee }} {{ $t('美元') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('扣款')"
          prop="deductionFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.deductionFee }} {{ $t('美元') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('补偿')"
          prop="compensateFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.compensateFee }} {{ $t('美元') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('激励')"
          prop="incentiveFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.incentiveFee }} {{ $t('美元') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          :label="$t('操作')"
          prop="name"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goDetail(scope.row)"
            >{{$t('查看详情')}}</el-button>
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
  name: 'partTimeClassPayEn',
  components: {
    FilterByUserAccount,
  },
  props: {
    subjectType: { type: Number, default: void 0 },
  },

  data () {
    return {
      userParams: {},
      currentDate: '',
      screenData: {
        pageNum: 1,
        pageSize: 50,
      },
      tableData: [{ name: 1 }],
      loading: false,
      total: 0,
      startTime: '',
      endTime: '',
      pickerOptions: {
        disabledDate(time) {
          const startDate = new Date(2024, 8, 1); // 2024年9月1日
          const currentDate = new Date();
          const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          
          // 禁用2024年9月之前的日期和大于当前月份的日期
          return time.getTime() < startDate.getTime() || time.getTime() > currentMonth.getTime();
        }
      }

    }
  },
  watch: {
    currentDate (newData) {
      // console.log("partTimeClassPayEn-----------", this.currentDate)
      this.screenData.pageNum = 1;
      this.getTutorVirtualList();
    },
    subjectType() {
      // console.log("partTimeClassPayEn-----------", this.subjectType)
      this.screenData.pageNum = 1;
      this.getTutorVirtualList();
    }
  },
  methods: {
    search () {
      this.screenData.pageNum = 1;
      this.getTutorVirtualList()
    },
    handleExport () {
      let y = new Date(this.currentDate).getFullYear(), m = new Date(this.currentDate).getMonth() + 1, fileName = `兼职教师课程 ${y}-${m}`
      
      // 构建查询参数
      let queryParams = new URLSearchParams({
        businessLine: this.subjectType + 1,
        month: this.getTheDateOfYYMM(),
        tutorType: 0,
        ...this.userParams
      });
      
      downloadFile(
        `${process.env.VUE_APP_BASE_API}/opsapi/teachermanager/teacher-manage/tutor/salary/ops/export?${queryParams.toString()}`,
        fileName
      )
    },
    handleImport() {
      this.$router.push(`/tutorManagement/importClassPay?businessLine=${this.subjectType + 1}`)
    },
    goDetail (scopeRow) {
      console.log("partTimeClassPayEn-----------", this.subjectType)
      this.$router.push(`/tutorManagement/classPayDetailEn?tutorId=${scopeRow.tutorUserId}&time=${this.getTheDateOfYYMM()}&tutorName=${scopeRow.tutorRealName}&businessLine=${this.subjectType + 1}`)
    },
    getCurrentPage (page) {
      this.screenData.pageNum = page;
      // console.log("getCurrentPage---------", this.screenData.pageNum);

      this.getTutorVirtualList();
    },
    getPerPage (perPage) {
      this.screenData.pageNum = 1;
      this.screenData.pageSize = perPage;

      // console.log("getPerPage---------", this.screenData.pageSize);

      this.getTutorVirtualList();
    },
    getTheDateOfYYMM () {
      var currentDate = new Date(this.currentDate),
        year = currentDate.getFullYear(),
        month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1,
        yearAndMonthStr = `${year}${month}`
      return yearAndMonthStr
    },

    // 表格数据
    getTutorVirtualList () {
      this.loading = true
      let businessLine = this.subjectType + 1;
      var { pageNum, pageSize } = this.screenData
      var tutorType = 0,
        params = {
          businessLine,
          month: this.getTheDateOfYYMM(),
          pageNum,
          pageSize,
          tutorType,
          ...this.userParams
        }
      this.$Api.tutorManagement.getEnTutorVirtualList(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list
            this.total = data.data.total
          }
          this.loading = false
        })
    }

  },
  created () {
    this.currentDate = this.DateTimeUtils.getMonthStartDate();
  }
}
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
  .table-wrap {
    width: 100%;
    overflow-x: auto;
  }

  ::v-deep .el-table__body-wrapper {
    overflow-x: auto !important;
  }
  
  ::v-deep .el-table__fixed-right {
    height: 100% !important;
    right: 0;
    box-shadow: -3px 0 5px rgba(0, 0, 0, 0.1);
  }

}
</style>
