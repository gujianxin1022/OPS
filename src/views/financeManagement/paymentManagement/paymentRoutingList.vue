<template>
  <div class="payment-routing-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('方案版本')"
        :part="4"
        :label-width="isEn ? 120 : 80"
      >
        <FilterBySolutionVersion
          @changeSelect="
            (val) => {
              screenData.payVersion = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('发布状态')"
        :part="4"
        :label-width="isEn ? 120 : 80"
      >
        <el-select
          v-model="screenData.status"
          filterable
          clearable
          :collapse-tags="true"
          :placeholder="$t('请选择')"
          @change="changeSelect"
        >
          <el-option
            v-for="(item, index) in statusOptionList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button
          v-if="isOwner"
          style="width: 120px"
          class="fr"
          type="primary"
          @click="showDialog"
          >{{ $t("新建") }}</el-button
        >
      </div>
      <BasicTable
        :height="tableHeight"
        v-loading="tableState.loading"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
        :pagination="true"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        @pagination="handlePaginationChange"
      />
    </custom-card>
    <el-dialog
      :title="$t('新建支付路由方案')"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <RoutingPlan v-if="dialogVisible" ref="routingPlan" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("取消") }}</el-button>
        <el-button :loading="submiting" type="primary" @click="submit">{{
          $t("确认")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import FilterBySolutionVersion from "@/components/FilterItem/FinanceFilter/FilterBySolutionVersion";
import BasicTable from "@/components/table/basic-table";
import RoutingPlan from "./components/RoutingPlan.vue";
const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: { FilterBySolutionVersion, BasicTable, RoutingPlan },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const isOwner = [1020, 2696, 263, 3086, 1686, 1084].includes(
      id
    ); /* 产品要求只有肖赫,王婧,陈东旭有权限,恶心的硬编码 */
    const screenData = reactive({
      payVersion: "",
      status: "",
      sort: "desc",
      orderByColum: "startTime",
    });
    const statusOptionList = [
      { label: root.$t("全部"), value: "" },
      { label: root.$t("待发布"), value: 0 },
      { label: root.$t("已发布"), value: 1 },
    ];
    const tableState = reactive({
      loading: false,
      total: 0,
      page: 1,
      limit: 50,
      data: [{}],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            fixed: true,
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            fixed: true,
            minWidth: "220",
            label: root.$t("方案名称"),
            prop: "programName",
          },
          {
            prop: "group",
            width: 180,
            render: (_, { row }) => {
              return (
                <span>
                  {row.startTime
                    ? root.DateTimeUtils.dateClockTime(row.startTime)
                    : "-"}
                </span>
              );
            },
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("生效时间")}
                  <span
                    onClick={() => handelSort("startTime")}
                    class="caret-wrapper"
                  >
                    <i
                      class={
                        screenData.sort === "desc" &&
                        screenData.orderByColum === "startTime"
                          ? "el-icon-caret-top active"
                          : "el-icon-caret-top"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "asc" &&
                        screenData.orderByColum === "startTime"
                          ? "el-icon-caret-bottom active"
                          : "el-icon-caret-bottom"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
          {
            label: root.$t("失效时间"),
            width: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.endTime
                    ? root.DateTimeUtils.dateClockTime(row.endTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("状态"),
            width: isEn.value ? 300 : 200,
            render: (_, { row }) => {
              return isOwner ? (
                <el-switch
                  value={row.status}
                  onChange={(val) => reqChangeEnable(row, val)}
                  active-text={root.$t("已发布")}
                  inactive-text={root.$t("待发布")}
                  active-value={1}
                  inactive-value={0}
                ></el-switch>
              ) : (
                <span>
                  {row.status === 1 ? root.$t("已发布") : root.$t("待发布")}
                </span>
              );
            },
          },
          {
            label: root.$t("最近修改时间"),
            width: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.updateTime
                    ? root.DateTimeUtils.dateClockTime(row.updateTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("最近修改人"),
            width: 100,
            prop: "operationUserName",
          },
          {
            label: root.$t("创建时间"),
            width: 150,
            prop: "rate",
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.createTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("操作"),
            fixed: "right",
            minWidth: 180,
            render: (h, { row }) =>
              isOwner ? (
                <div>
                  <el-button
                    type="text"
                    onClick={() => toInfoPage("edit", row.id)}
                  >
                    {root.$t("编辑")}
                  </el-button>
                  <el-button type="text" onClick={() => handleCopy(row)}>
                    {root.$t("复制")}
                  </el-button>
                  <el-button
                    type="text"
                    disabled={row.status === 1}
                    onClick={() => handleDelete(row)}
                  >
                    {root.$t("删除")}
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => toInfoPage("view", row.id)}
                  >
                    {root.$t("查看")}
                  </el-button>
                </div>
              ) : (
                <span>{root.$t("暂无权限")}</span>
              ),
          },
        ];
      }),
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [], total: 0 });
        const res = await root.$Api.financeManagement.reqPaymentRoutingList({
          pageNum: tableState.page,
          pageSize: tableState.limit,
          payVersion: screenData.payVersion,
          status: screenData.status,
          orderByColum: screenData.orderByColum,
          sort: screenData.sort,
        });
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqList();
    };
    const toInfoPage = (type, id) => {
      root.$router.push({
        path: "/financeManagement/paymentRoutingInfo",
        query: { type, id },
      });
    };
    const dialogVisible = ref(false);
    const showDialog = () => {
      dialogVisible.value = true;
    };
    const handleClose = () => {
      dialogVisible.value = false;
    };
    const submiting = ref(false);
    const submit = async () => {
      try {
        submiting.value = true;
        await refs.routingPlan.submit("add");
        root.$message.success(root.$t("操作成功"));
        handleClose();
        reqList();
      } finally {
        submiting.value = false;
      }
    };
    const reqChangeEnable = async (row, val /* 1:发布;0:取消发布 */) => {
      let tips = "";
      if (val === 1) {
        tips = root.$t("是否确认发布此方案");
      }
      if (val === 0) {
        if (await root.$Api.financeManagement.reqCheckSameProgram(row.id)) {
          tips = root.$t("是否确认取消发布此方案");
        } else {
          tips = root.$t("已无其他已发布方案，此时取消将启用兜底方案");
        }
      }
      await root.$confirm(tips, root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      if (val === 1) {
        await root.$Api.financeManagement.reqPublishProgram(row.id);
        root.$message.success(root.$t("操作成功"));
        reqList();
      }
      if (val === 0) {
        await root.$Api.financeManagement.reqCancelPublishProgram(row.id);
        root.$message.success(root.$t("操作成功"));
        reqList();
      }
    };
    const handleCopy = async (row) => {
      await root.$Api.financeManagement.reqCopyProgram(row.id);
      root.$message.success(root.$t("操作成功"));
      reqList();
    };
    const handleDelete = async (row) => {
      let tips = "";
      if (await root.$Api.financeManagement.reqCheckDeleProgram(row.id)) {
        tips = root.$t("是否确认删除此方案");
      } else {
        tips = root.$t("已无其他已发布方案，此时删除将启用兜底方案");
      }
      await root.$confirm(tips, root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      await root.$Api.financeManagement.reqDeleteProgram(row.id);
      root.$message.success(root.$t("操作成功"));
      reqList();
    };
    const handelSort = (colum) => {
      screenData.orderByColum = colum;
      if (screenData.sort === "asc") {
        screenData.sort = "desc";
      } else {
        screenData.sort = "asc";
      }
      reqList();
    };
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      tableState,
      tableHeight: window.innerHeight - 355,
      dialogVisible,
      submiting,
      statusOptionList,
      reqList,
      handlePaginationChange,
      toInfoPage,
      showDialog,
      handleClose,
      submit,
      reqChangeEnable,
      isOwner,
    };
  },
};
</script>
<style lang="scss">
.payment-routing-warp {
  .caret-wrapper {
    padding-top: 4px;
    cursor: pointer;
    .el-icon-caret-top,
    .el-icon-caret-bottom {
      font-size: 14px;
      cursor: pointer;
      color: #c0c4cc;
      width: 14px;
      height: 10px;
    }
    .el-icon-caret-bottom {
      margin-top: -2px;
    }
    .active {
      color: #fff;
    }
  }
}
</style>
