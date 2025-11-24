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
      @pagination="handlePaginationChange"
    />
    <DataMigrationForm
      :visible.sync="visible"
      :balanceTotal="balanceTotal"
      v-bind="convertInfo"
      @ok="$emit('refresh')"
    />
    <CrossAccountMigration
      v-if="showCorssAccountMigrationDialog"
      :visible.sync="showCorssAccountMigrationDialog"
      :balanceTotal="balanceTotal"
      v-bind="convertInfo"
      @ok="$emit('refresh')"
    />
  </div>
</template>

<script>
import moment from "moment";
import BasicTable from "@/components/table/basic-table";
import DataMigrationForm from "../../dataMigration/DataMigrationForm";
import CrossAccountMigration from "../../dataMigration/CrossAccountMigration";

import HandlePermission from "@/utils/handlePermission";

const { handleButtonPer } = HandlePermission;

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
    DataMigrationForm,
    CrossAccountMigration,
  },
  props: {
    balanceTotal: {
      type: Number,
      default: null,
    },
    studentUserId: {
      type: String,
      default: null,
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root }) {
    const visible = ref(false);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const orderNo = ref("");
    const convertInfo = ref({
      balance: void 0,
      balanceId: void 0,
      parentUserName: void 0,
      coursePackageName: void 0,
      coursePackageNameEn: void 0,
      studentUserId: props.studentUserId,
      coursePackageId: props.coursePackageId,
    });
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      columns: computed(() => [
        { label: root.$t("剩余课时"), prop: "balance" },
        {
          label: root.$t("课时类型"),
          prop: "type",
          render: (h, { row }) => (
            <span class="text-wrap">
              {" "}
              {root.$t(root.Constants.classTypeMap[row.type])}
            </span>
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
        {
          label: root.$t("操作"),
          render: (h, { row }) => (
            <div>
              {handleButtonPer(
                "teach.studentMT.studentInfo.studentAccount.convertStudents"
              ) && (
                <el-button
                  type="text"
                  onClick={() => handleConvertStudents(row)}
                  disabled={
                    !props.balanceTotal ||
                    !row.balance ||
                    (props.balanceTotal > 0 ? row.balance < 0 : row.balance > 0)
                  }
                >
                  {root.$t("转换学员")}
                </el-button>
              )}
              {handleButtonPer(
                "teach.studentMT.studentInfo.studentAccount.transferToAnotherAccount"
              ) && (
                <el-button
                  type="text"
                  onClick={() => handleShowCorssDialog(row)}
                  disabled={
                    !props.balanceTotal ||
                    !row.balance ||
                    (props.balanceTotal > 0 ? row.balance < 0 : row.balance > 0)
                  }
                >
                  {root.$t("跨账号迁移")}
                </el-button>
              )}
            </div>
          ),
        },
      ]),
    });

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.queryStudentAccountBalanceList({
          studentUserId: props.studentUserId,
          pageNum: tableState.page,
          pageSize: tableState.limit,
          coursePackageId: props.coursePackageId,
          orderNo: orderNo.value,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.data = data.list ?? [];
        tableState.total = data.total;
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const handleConvertStudents = (row) => {
      Object.assign(convertInfo.value, {
        balance: row.balance,
        balanceId: row.balanceId,
        parentUserName: row.parentUserName,
        coursePackageName: row.coursePackageName,
        coursePackageNameEn:row.coursePackageNameEn
      });
      visible.value = true;
    };
    /* 跨账号迁移逻辑 */
    // visible
    const showCorssAccountMigrationDialog = ref(false);
    onMounted(queryTableData);
    const handleShowCorssDialog = (row) => {
      Object.assign(convertInfo.value, {
        balance: row.balance,
        balanceId: row.balanceId,
        parentUserName: row.parentUserName,
        coursePackageName: row.coursePackageName,
        coursePackageNameEn: row.coursePackageNameEn,
      });
      showCorssAccountMigrationDialog.value = true;
    };

    return {
      visible,
      convertInfo,
      orderNo,
      isEn,
      ...toRefs(tableState),
      queryTableData /* 课时转换成功刷新列表 */,
      handlePaginationChange,
      showCorssAccountMigrationDialog,
    };
  },
};
</script>
