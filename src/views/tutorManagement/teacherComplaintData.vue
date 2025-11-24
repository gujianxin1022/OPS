<template>
  <div class="teacher-recommend-config">
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('投诉数据导入')">
        <header class="flex-wrapper flex-space-between">
          <el-button type="primary" class="fr" @click="importDataVisible = true">
            {{ $t("导入教师投诉数据") }}
          </el-button>
        </header>
        <h4>{{ $t("上传记录") }}</h4>
        <BasicTable
          v-loading="tableState.loading"
          :column="tableState.columns"
          :data="tableState.data"
          :page="tableState.page"
          :total="tableState.total"
          :limit="tableState.limit"
          :pagination="true"
          @pagination="handlePaginationChange"
        />
      </el-tab-pane>
    </el-tabs>
    <ImportData
      :visible.sync="importDataVisible"
      @close="handlePaginationChange({ page: 1 })"
    />
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "@vue/composition-api";

import moment from "moment";
import BasicTable from "@/components/table/basic-table";
import ImportData from "./_dialog/ImportComplaintData";

export default {
  components: {
    BasicTable,
    ImportData,
  },
  setup(props, { root }) {
    const importDataVisible = ref(false);
    const tableState = reactive({
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("上传时间"),
            render: (h, { row }) =>
              moment(row.createTime).format("YYYY-MM-DD HH:mm:ss"),
          },
          { label: root.$t("操作人"), prop: "createUserName" },
          {
            fixed: "right",
            label: root.$t("上传文件"),
            render: (h, { row }) => (
              <div>
                <el-button
                  type="text"
                  onClick={() => (location.href = row.fileUrl)}
                >
                  {root.$t("点击下载")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const queryTableData = async () => {
      tableState.loading = true;
      const { list, total } =
        await root.$Api.tutorManagement.getComplaintDataImportList({
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
      Object.assign(tableState, { data: list, total, loading: false });
    };

    onMounted(queryTableData);

    return {
      tableState,
      importDataVisible,
      handlePaginationChange,
    };
  },
};
</script>
<style lang="scss" scoped>
.teacher-recommend-config {
  padding: 24px;
  ::v-deep .el-tabs__content {
    min-height: calc(100vh - 200px);
  }
}
</style>
