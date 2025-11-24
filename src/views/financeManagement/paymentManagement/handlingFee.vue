<template>
  <div class="payment-handling-fee-warp">
    <custom-card
      :title="$t('支付手续费配置')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <BasicTable
        v-loading="tableState.loading"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
      />
    </custom-card>
    <el-drawer
      v-if="drawerVisible"
      :visible.sync="drawerVisible"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose"
      :wrapperClosable="false"
      :close-on-press-escape="false"
    >
      <div class="fee-list-warp p20">
        <BasicTable
          header-cell-class-name="my-theme-color-header"
          border
          :data="currentRow.processingFeeDetailList"
          :column="feeDetailListColumns"
        />
        <span slot="footer" class="drawer-footer">
          <el-button @click="handleClose">{{ $t("取消") }}</el-button>
          <el-button type="primary" :loading="submiting" @click="submit">{{
            $t("确定")
          }}</el-button>
        </span>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: { BasicTable },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const isOwner = [1020, 2696, 263, 3086, 1686, 1084].includes(
      id
    ); /* 产品要求只有肖赫,王婧,陈东旭有权限,恶心的硬编码 */
    const tableState = reactive({
      loading: false,
      data: [],
      columns: computed(() => {
        return [
          {
            fixed: true,
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => $index + 1,
          },
          {
            fixed: true,
            minWidth: "220",
            label: root.$t("币种"),
            prop: "currency",
          },
          {
            minWidth: "220",
            label: root.$t("最近修改人"),
            prop: "lastUpdateUserName",
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
            label: root.$t("操作"),
            minWidth: 180,
            render: (h, { row }) =>
              isOwner ? (
                <div>
                  <el-button
                    type="text"
                    disabled={row.status === 1}
                    onClick={() => showDrawer(row)}
                  >
                    {root.$t("编辑")}
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
        Object.assign(tableState, { data: [] });
        const res = await root.$Api.financeManagement.reqPaymentFeeList();
        console.log(res);
        Object.assign(tableState, {
          data: res ?? [],
        });
      } finally {
        tableState.loading = false;
      }
    };
    const drawerVisible = ref(false);
    const currentRow = ref(null);
    const feeDetailListColumns = computed(() => {
      const { page, limit } = tableState;
      return [
        {
          width: "50",
          label: root.$t("序号"),
          render: (h, { $index }) => $index + 1,
        },
        { label: root.$t("支付方式"), prop: "payMethodName" },
        {
          label: root.$t("手续费率"),
          prop: "studentNums",
          width: "180",
          render: (h, { row }) => {
            return (
              <span>
                <el-input-number
                  precision={1}
                  min={-100}
                  max={100}
                  style="margin-top:8px"
                  value={row.fee}
                  onInput={(val) => {
                    row.fee = val;
                  }}
                ></el-input-number>{" "}
                %
              </span>
            );
          },
        },
      ];
    });
    const showDrawer = (row) => {
      currentRow.value = row;
      drawerVisible.value = true;
    };
    const handleClose = () => {
      drawerVisible.value = false;
      reqList();
    };
    const submiting = ref(false);
    const submit = async () => {
      try {
        submiting.value = true;
        await root.$Api.financeManagement.reqUpdatePaymentFee(
          currentRow.value.processingFeeDetailList
        );
        root.$notify.success(root.$t("操作成功"));
        handleClose();
        reqList();
      } finally {
        submiting.value = false;
      }
    };

    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      tableState,
      drawerVisible,
      submiting,
      currentRow,
      feeDetailListColumns,
      reqList,
      showDrawer,
      handleClose,
      submit,
      isOwner,
    };
  },
};
</script>
<style lang="scss">
.payment-handling-fee-warp {
  .fee-list-warp {
    width: 400px;
    .drawer-footer {
      position: fixed;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>
