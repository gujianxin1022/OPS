<!-- 用户的评价 -->
<template>
  <div class="user-evaluations">
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
      <screen-item :label="$t('星级')" :labelWidth="labelWidth">
        <el-select v-model="query.starLevel" :placeholder="$t('请选择')" clearable style="width: 100px!important;">
          <el-option v-for="n in 5" :key="n" :label="`${n}`" :value="n" />
        </el-select>
      </screen-item>
      <screen-item :label="$t('学科')" :labelWidth="labelWidth">
        <FilterBySubject @changeSelect="(val) => query.subjectType = val" />
      </screen-item>
      <screen-item :label="$t('课程类型')" :label-width="labelWidth">
        <el-select v-model="query.courseType" clearable :placeholder="$t('请选择')">
          <el-option :label="$t('正式')" :value="1" />
          <el-option :label="$t('试听')" :value="0" />
        </el-select>
      </screen-item>
      <screen-item :label="$t('教师ID')" :labelWidth="labelWidth">
        <el-input v-model.trim="query.teacherId" clearable />
      </screen-item>
    </screen-wrapper>
    <DataTable :loading="loading" :data="list" :index="(index) => (page.pageNum - 1) * page.pageSize + index + 1"
      :hideColumns="['parent']" @refresh="getDataList" />
    <custom-pagination :current-page="page.pageNum" :total="page.total" :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange" @getPerPage="onPageSizeChange" />
  </div>
</template>

<script>
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import DataTable from './DataTable.vue';
import { getParentEvaluations } from "@/api/evaluation/index";

export default {
  components: {
    FilterBySubject,
    DataTable,
  },
  props: {
    parentId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      query: {
        timeRange: [], // 最近会话时间
        status: null, // 状态
        starLevel: null, // 星
        subjectType: null, // 学科
        courseType: null, // 课程类型
        teacherId: "", // 教师id
        // teacherSearchType: "1", // 教师搜索类型
        // teacher: "", // 教师搜索值
      },
      loading: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
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
      const params = {
        ...this.query,
        timeRange: undefined,
        parentId: this.parentId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      };
      const numberReg = /^\d+$/;
      if (
        [params.parentId, params.teacherId]
          .filter((p) => p)
          .some((p) => !numberReg.test(p))
      ) {
        const message =
          this.$i18n.locale === "zh"
            ? "请输入正确的参数类型"
            : "Please enter the correct parameter type";
        this.$message.error(message);
        this.loading = false;
        return;
      }
      const timeRange = this.query.timeRange;
      if (timeRange && timeRange.length > 1) {
        params.courseStartTime = timeRange[0];
        params.courseEndTime = timeRange[1];
      }
      try {
        // 获取列表数据
        const data = await getParentEvaluations(params);
        this.page.total = data.total;
        this.list = data.list;
      } catch (error) {
        console.error(error);
      }
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
.user-evaluations {
  width: 90vw;
  padding: 0 20px;
}

.mt-10 {
  margin-top: 10px;
}
</style>
