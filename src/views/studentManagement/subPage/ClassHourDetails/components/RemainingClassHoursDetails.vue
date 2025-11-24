<template>
  <div>
    <el-input
      :style="isEn ? 'width: 250px' : 'width: 220px'"
      :placeholder="$t('请输入订单编号')"
      v-model="orderNo"
      clearable
      class="input-with-select mb10 fr"
      @keyup.enter.native="queryTableData"
    >
      <el-button
        slot="append"
        @click="queryTableData"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <BasicTable
      border
      v-loading="loading"
      :column="columns"
      :data="data"
      :page="page"
      :total="total"
      :limit="limit"
      :pagination="true"
      :autoScroll="false"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import moment from "moment";
import BasicTable from "@/components/table/basic-table";

import {
  computed,
  onMounted,
  reactive,
  toRefs,
  ref,
} from "@vue/composition-api";

export default {
  name: "overview",
  components: {
    BasicTable,
  },
  props: ["coursePackageId", "parentUserId"],
  setup(props, { root }) {
    const orderNo = ref("");
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      columns: computed(() => [
        { label: root.$t("剩余课时"), prop: "balance" },
        { label: root.$t("课时归属"), prop: "ownerName" },
        {
          label: root.$t("课时类型"),
          prop: "type",
          render: (h, { row }) => (
            <span class="text-wrap"> {root.$t(root.Constants.classTypeMap[row.type])}</span>
          ),
        },
        {
          prop: "startTime",
          render: (h, { row }) =>
            row.startTime &&
            moment(row.startTime).format("YYYY-MM-DD HH:mm:ss"),
          renderHeader: (_, { row }) => {
            return (
              <div>
                {root.$t("入账时间")}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content={root.$t(
                    "入账时间：该笔课时最新到账时间，如课时转换或者迁移后，会按最新的变动时间来计算"
                  )}
                  placement="top-end"
                >
                  <i
                    class={"iconfont ppIcon-problem"}
                    style={"font-size:13px;margin-left:5px;cursor:pointer"}
                  ></i>
                </el-tooltip>
              </div>
            );
          },
        },
        {
          label: root.$t("订单编号"),
          prop: "orderNo",
          width: 255,
          render: (h, { row }) => row.orderNo || "-",
        },
        {
          label: root.$t("失效时间"),
          prop: "expiredTime",
          render: (h, { row }) =>
            row.balance < 0
              ? "--"
              : row.expiredTime &&
                moment(row.expiredTime).format("YYYY-MM-DD HH:mm:ss"),
        },
      ]),
    });
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const data =
          await root.$Api.studentManagement.getParentAccountBalanceList({
            pageNum: tableState.page,
            pageSize: tableState.limit,
            parentUserId: props.parentUserId,
            coursePackageId: props.coursePackageId,
            orderNo: orderNo.value,
          });
        tableState.data = data.list ?? [];
        tableState.total = data.total ?? 0;
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };
    onMounted(queryTableData);

    return {
      orderNo,
      isEn,
      ...toRefs(tableState),
      queryTableData,
      handlePaginationChange,
    };
  },
};
</script>
