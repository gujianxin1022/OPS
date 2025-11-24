<template>
  <div class="delete-wechat-data-logs">
    <h2>{{ $t("历史删除数据") }}</h2>
    <el-form :inline="true" :model="searchForm">
      <el-form-item :label="$t('日期')">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        />
      </el-form-item>
      <el-form-item :label="$t('操作人')">
        <el-input
          clearable
          v-model="searchForm.userName"
          :placeholder="`${$t('请输入')} ${$t('操作人')}`"
        />
      </el-form-item>
      <el-form-item label="OpenId">
        <el-input
          clearable
          v-model="searchForm.openId"
          :placeholder="`${$t('请输入')} ${$t('OpenId')}`"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)">
          {{ $t("搜索") }}
        </el-button>
      </el-form-item>
    </el-form>
    <h2 class="mt15">{{ $t("数据操作") }}</h2>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :header-cell-style="{ background: '#626DC4', color: '#fff' }"
    >
      <el-table-column :label="$t('number')" width="150">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="openId" label="OpenId" />
      <el-table-column prop="userName" :label="$t('操作人')" />
      <el-table-column :label="$t('操作时间')">
        <template slot-scope="scope">
          {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      @getCurrentPage="handleCurrentChange"
      @getPerPage="handleSizeChange"
    />
  </div>
</template>

<script>
import { markRaw, onMounted, reactive, toRefs } from "@vue/composition-api";
import moment from "moment";
export default {
  name: "delete-wechat-data-logs",
  setup(props, { root }) {
    const searchForm = reactive({
      userName: "",
      openId: "",
      date: [void 0, void 0],
    });
    const tableState = reactive({ tableLoading: false, tableData: [] });
    const paginationState = reactive({ total: 0, pageNum: 1, pageSize: 50 });

    const queryTableData = async () => {
      tableState.tableLoading = true;
      const { date, ...params } = searchForm;
      const [startTime, endTime] = date ?? [void 0, void 0];
      const { total, ...pageInfo } = paginationState;
      const _endTime =
        endTime &&
        new Date(moment(endTime).set({ hours: 23, minutes: 59, seconds: 59 }));
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.queryWeChatDelLogList(
        { ...pageInfo },
        { ...params, startTime, endTime: _endTime }
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      paginationState.total = data.total;
      tableState.tableLoading = false;
      tableState.tableData = markRaw(data.list);
    };
    const handleCurrentChange = (val) => {
      paginationState.pageNum = val;
      queryTableData();
    };
    const handleSizeChange = (val) => {
      Object.assign(paginationState, { pageNum: 1, pageSize: val });
      queryTableData();
    };

    onMounted(queryTableData);

    return {
      moment,

      searchForm,
      ...toRefs(tableState),
      ...toRefs(paginationState),

      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete-wechat-data-logs {
  padding: 24px;
  h2 {
    font-size: 14px;
    margin-bottom: 24px;
  }
  .el-form-item {
    margin-right: 40px;
    &:nth-child(3) {
      margin-right: 16px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  ::v-deep .el-table__body-wrapper {
    tbody {
      tr:nth-child(even) {
        background: #ECEDF9;
      }
      tr:nth-child(odd) {
        background: #F9F9FF;
      }
    }
  }
}
</style>
