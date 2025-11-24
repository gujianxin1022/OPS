<template>
  <div class="class-pay-config">
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('特殊薪酬处理')">
        <div class="class-pay">
          
          <el-button type="primary" @click="importDataVisible = true">
            {{ $t("导入数据") }}
          </el-button>
        </div>
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
    <ImportFileData
      :businessLine="businessLine"
      :visible.sync="importDataVisible"
      :uploadUrl="uploadUrl"
      :templateUrl="templateUrl"
      @close="handlePaginationChange({ page: 1 })"
    />
  </div>
</template>
<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  unref,
  watch,
} from "@vue/composition-api";

import moment from "moment";
import BasicTable from "@/components/table/basic-table";
import ImportFileData from "./_dialog/ImportFileData.vue";

const CHINESE = 1;
const ENGLISH = 2;

export default {
  components: {
    BasicTable,
    ImportFileData,
  },


  setup(props, { root }) {

    console.log("importClassPay--------------", root.$route.query.businessLine)
    const businessLine = root.$route.query.businessLine;

    const uploadUrl = `${process.env.VUE_APP_BASE_API}/opsapi/teachersalary/tutor/manual/fee/import/file`;
    const templateUrl = "https://s3.us-west-1.amazonaws.com/media.pplingo.com/templates/salary/uploadTemplate.xlsx";

    // watch(businessLine, () => queryTableData());

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
          { label: root.$t("名称"), prop: "name"},
          {
            width: "200",
            label: root.$t("上传时间"),
            render: (h, { row }) =>
              moment(row.createTime).format("YYYY-MM-DD HH:mm:ss"),
          },
          { label: root.$t("生效所属月份"), prop: "month"},
          { label: root.$t("操作人"), prop: "createUserName" },
          // {
          //   label: root.$t("操作结果"),
          //   render: (h, { row }) =>
          //     row.uploadResult === 1
          //       ? root.$t("成功") 
          //       : row.uploadResult === 2
          //       ? root.$t("导入中")
          //       : root.$t("失败"),
          // },
          {
            fixed: "right",
            label: root.$t("操作"),
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
        await root.$Api.tutorManagement.getSalaryImportInfo({
          businessLine: businessLine,
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
      Object.assign(tableState, { data: list || [], total: total || 0, loading: false });
    };

    onMounted(queryTableData);

    return {
      CHINESE,
      ENGLISH,
      businessLine,
      uploadUrl,
      templateUrl,
      tableState,
      importDataVisible,

      handlePaginationChange,
    };
  },
};
</script>
<style lang="scss" scoped>
.class-pay-config {
  padding: 24px;
  ::v-deep .el-tabs__content {
    min-height: calc(100vh - 200px);
  }
}

.class-pay {
  text-align: right;
  
}
</style>