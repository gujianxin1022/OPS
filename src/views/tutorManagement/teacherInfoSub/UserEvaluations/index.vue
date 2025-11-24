<template>
  <div>
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item label="" labelWidth="0">
        <el-date-picker v-model="query.timeRange" type="datetimerange" :start-placeholder="$t('开始时间')"
          :end-placeholder="$t('结束时间')" size="small" :default-time="['00:00:00', '23:59:59']" />
      </screen-item>
      <screen-item :label="$t('status')" :labelWidth="labelWidth">
        <el-select v-model="query.status" :placeholder="$t('请选择')" clearable>
          <el-option :label="$t('已上架')" :value="1" />
          <el-option :label="$t('未上架')" :value="2" />
        </el-select>
      </screen-item>
      <screen-item :label="$t('家长ID')" :labelWidth="labelWidth">
        <el-input v-model.trim="query.parentId" clearable />
      </screen-item>
      <screen-item :label="$t('星级')" :labelWidth="labelWidth">
        <el-select v-model="query.starLevel" :placeholder="$t('请选择')" clearable style="width: 100px!important;">
          <el-option v-for="n in 5" :key="n" :label="`${n}`" :value="n" />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <Statistics :data="summaryData" />
    <DataTable :loading="loading" :data="list" :index="(index) => (page.pageNum - 1) * page.pageSize + index + 1"
      :hideColumns="['teacher']" @refresh="getDataList" />
    <custom-pagination :current-page="page.pageNum" :total="page.total" :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange" @getPerPage="onPageSizeChange" />
  </div>
</template>

<script>
import Statistics from './Statistics.vue';
// 复用家长评价Table
import DataTable from '@/views/studentManagement/subPage/UserEvaluations/DataTable.vue';
import { getEvaluationsOfTeacher, getEvaluationsSummaryOfTeacher } from '@/api/evaluation/index';

export default {
  components: {
    Statistics,
    DataTable,
  },
  props: {
    teacherId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      query: {
        timeRange: [], // 最近会话时间
        parentId: "", // 家长id
        status: null, // 状态
        starLevel: null, // 星
      },
      loading: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      summaryData: null, // 统计数据
    };
  },
  computed: {
    labelWidth() {
      return this.$i18n.local == "en" ? "165" : "100";
    },
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.loading = true;
      this.list = [];
      this.summaryData = null;
      const params = {
        teacherId: this.teacherId,
        parentId: this.query.parentId,
        starLevel: this.query.starLevel,
        status: this.query.status,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      };
      const numberReg = /^\d+$/;
      if (
        [params.parentUserId]
          .filter((p) => p)
          .some((p) => !numberReg.test(p))
      ) {
        const message =
          this.$i18n.locale === "zh"
            ? "请输入正确的家长ID"
            : "Please enter the correct parent ID";
        this.$message.error(message);
        this.loading = false;
        return;
      }
      const timeRange = this.query.timeRange;
      if (timeRange && timeRange.length > 1) {
        params.courseStartTime = timeRange[0];
        params.courseEndTime = timeRange[1];
      }
      // 获取列表数据
      const listPromise = getEvaluationsOfTeacher(params).then(data => {
        this.page.total = data.total;
        this.list = data.list;
      });
      // 获取汇总数据
      const summaryPromise = getEvaluationsSummaryOfTeacher(params).then(data => {
        this.summaryData = data;
      });
      await Promise.allSettled([listPromise, summaryPromise]);
      this.loading = false;
    },
    search() {
      this.page.pageNum = 1;
      this.getDataList();
    },
    // 当前页码改变
    onCurrentPageChange(val) {
      this.page.pageNum = val;
      this.getDataList();
    },
    // 每页展示数据条数改变
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getDataList();
    },
  },
};
</script>

<style scoped>
.mt-10 {
  margin-top: 10px;
}
</style>
