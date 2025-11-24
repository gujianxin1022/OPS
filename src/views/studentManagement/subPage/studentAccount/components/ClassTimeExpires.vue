<template>
  <!-- 学生页面-失效课时 -->
  <div>
    <BasicTable
      border
      v-loading="loading"
      :column="columns"
      :data="data"
      :page="page"
      :total="total"
      :limit="limit"
      :pagination="true"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from "@vue/composition-api";

import moment from "moment";
import BasicTable from "@/components/table/basic-table";

export default {
  name: "overview",
  components: {
    BasicTable,
  },
  props: ["studentUserId", "coursePackageId"],
  setup(props, { root }) {
    const isEn = computed(() => root.$store.state.app.currentLang === "en");
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      columns: computed(() => [
        {
          label: root.$t("序号"),
          width: 80,
          render: (h, { $index }) =>
            (tableState.page - 1) * tableState.limit + $index + 1,
        },
        {
          label: root.$t("时间"),
          render: (h, { row }) =>
            row.createTime &&
            moment(row.createTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          label: root.$t("失效课时数"),
          width: isEn.value ? 210 : 90,
          prop: "amount",
        },
        {
          label: root.$t("课时类型"),
          prop: "type",
          render: (h, { row }) => (
            <span class="text-wrap"> {root.$t(root.Constants.classTypeMap[row.type])}</span>
          ),
        },
        {
          label: root.$t("订单编号"),
          prop: "orderNo",
          width: 255,
          render: (h, { row }) => row.orderNo || "-",
        },
        {
          label: root.$t("到期时间"),
          render: (h, { row }) =>
            row.expriesTime &&
            moment(row.expriesTime).format("YYYY-MM-DD HH:mm:ss"),
        },
      ]),
    });

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const data =
          await root.$Api.studentManagement.getParentAccountExpiresList({
            pageNum: tableState.page,
            pageSize: tableState.limit,
            studentUserId: props.studentUserId,
            coursePackageId: props.coursePackageId,
          });
        tableState.data = data.list || [];
        tableState.total = data.total;
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
    };

    onMounted(queryTableData);

    return {
      ...toRefs(tableState),
      isEn,
      queryTableData /* 课时转换成功刷新列表 */,
      handlePaginationChange,
    };
  },
};
</script>
