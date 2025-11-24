<template>
  <div class="contact-dashboard">
    <div>
      <strong class="dashboard-title">{{ $t('付费用户建联情况看板') }}</strong>
      <el-popover placement="right" width="500" trigger="click">
        <instructions-dialog></instructions-dialog>
        <template v-slot:reference>
          <el-button class="instructions" type="text">{{ $t('使用说明') }}</el-button>
        </template>
      </el-popover>
      <!-- 刷新时间提示 -->
      <div class="refresh-time">{{ $t('本页面数据更新时间') }}: T+1</div>
    </div>
    <!-- 顶部统计卡片 -->
    <StatisticsCards v-if="statistics" class="mt-10" :data="statistics" />

    <!-- 筛选条件 -->
    <FilterSection class="mt-10" @search="handleSearch" />

    <!-- 数据表格 -->
    <DataTable :list="dataList" :isSelfScope="isSelfScope" :isCC="isCC" :pagination="pagination" :loading="loading"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @sort-change="handleSortChange" />
  </div>
</template>

<script>
import StatisticsCards from './components/StatisticsCards.vue'
import FilterSection from './components/FilterSection.vue'
import DataTable from './components/DataTable.vue'
import InstructionsDialog from './components/InstructionsDialog.vue'
import { getStorage } from "@/utils/handleStorage";

export default {
  name: 'ContactDashboard',
  components: {
    StatisticsCards,
    FilterSection,
    DataTable,
    InstructionsDialog,
  },
  data() {
    return {
      statistics: null, // 统计数据
      filterForm: {}, // 筛选条件
      loading: false,
      dataList: [], // 数据列表
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 100
      },
      sortField: '',
      sortOrder: '',
    }
  },
  computed: {
    userId() {
      const id = JSON.parse(getStorage("userInfo")).id;
      return id;
    },
    isSelfScope() {
      return this.filterForm.employeeId === this.userId;
    },
    // 数据来源: 1 按销售查 2按顾问查
    querySource() {
      return this.filterForm.scopeType === '2' ? 2 : 1;
    },
    fetchStatisticsParams() {
      return {
        employeeId: this.filterForm.employeeId,
        querySource: this.querySource
      }
    },
    isCC() {
      return this.querySource === 1;
    },
  },
  watch: {
    // 仅特定参数变化后才需要查询卡片统计数据
    fetchStatisticsParams: {
      handler() {
        this.fetchStatistics();
      },
    }
  },
  methods: {
    fetchStatistics() {
      const params = this.fetchStatisticsParams;
      return this.$Api.workBench.getContactDashboardStatistics(params).then(res => {
        this.statistics = res.data;
      });
    },
    fetchDataList() {
      if (!this.filterForm.employeeId) {
        this.$message.error('请选择我的范围');
        return;
      }
      this.loading = true;
      const sortType = this.sortOrder ? this.sortOrder === 'ascending' ? 1 : 2 : undefined;
      const params = {
        ...this.filterForm,
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        querySource: this.filterForm.scopeType === '2' ? 2 : 1, // 数据来源: 1 按销售查 2按顾问查
        ninetyDayClassConsumption: this.filterForm.hasRecentClassConsumption, // 最近有课消
        scopeType: undefined,
        sortColumn: sortType ? this.sortField : undefined,
        sort: sortType,
        // employeeId: 4353,
      }
      return this.$Api.workBench.getContactDashboardList(params).then(({ data }) => {
        this.dataList = data.list;
        this.pagination.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSearch(filterForm) {
      this.filterForm = filterForm;
      this.pagination.currentPage = 1;
      this.fetchDataList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.fetchDataList()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.fetchDataList()
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.pagination.currentPage = 1;
      this.fetchDataList();
    }
  },
}
</script>

<style lang="scss" scoped>
.contact-dashboard {
  padding: 20px;

  .refresh-time {
    float: right;
    font-size: 12px;
    color: #666;
  }
}

.dashboard-title {
  font-size: 16px;
}

.instructions {
  margin-left: 1em;
  font-size: 12px;
  color: #7580e5;
}

.mt-10 {
  margin-top: 10px;
}
</style>
