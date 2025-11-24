<template>
  <el-dialog
    :title="$t('对账信息')"
    :visible="diffVisible"
    @close="handleClose"
    width="1200px"
  >
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      :border="false"
      fit
      show-overflow-tooltip="true"
      style="width: 100%; margin-top: 10px"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column align="center" label="">
        <temlpate slot-scope="{ row }">
          {{ row.orderId ? $t("订单") : $t("流水") }}
        </temlpate>
      </el-table-column>
      <el-table-column align="center" :label="$t('订单号')" width="150">
        <template slot-scope="{ row }">
          <span class="red-col">{{ row.orderNo || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('流水号')" width="150">
        <template slot-scope="{ row }">
          <span class="red-col">{{ row.channelLogId || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('支付成功时间')" width="150">
        <template slot-scope="{ row }">
          <span v-if="row.orderId">{{ row.orderCreateTime }}</span>
          <span v-else>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('一级渠道')" width="150">
        <template slot-scope="{ row }">
          <span class="red-col">{{ row.paymentChannel || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('二级渠道')" width="150">
        <template slot-scope="{ row }">
          <span class="red-col">{{ row.paymentType || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('金额')" width="150">
        <template slot-scope="{ row }">
          <span :class="{ 'red-col': isDiffMoney }" v-if="row.orderId">{{
            row.totalPrice
          }}</span>
          <span :class="{ 'red-col': isDiffMoney }" v-else>{{
            row.finalAmount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('币种')">
        <template slot-scope="{ row }">
          <span v-if="row.orderId">{{ row.currency }}</span>
          <span v-else>{{ row.finalCurrency }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right" class="mt30">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button @click="handleSubmit" type="primary">{{
        $t("对账")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  unref,
} from "@vue/composition-api";
export default defineComponent({
  props: {
    diffVisible: {
      type: Boolean,
      default: false,
    },
    orderList: {
      type: Array,
      default: [],
    },
    waterList: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit, $ref }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const tableData = ref(null);
    const isDiffMoney = ref(false);
    let diffMoney = 0;
    const diffMap = {
      USD: 10,
      SGD: 14,
      EUR: 10,
      THB: 363,
      IDR: 148,
      HKD: 79,
    };
    const handleClose = () => {
      emit("update:diffVisible", false);
    };

    const sum = (arr) => {
      return arr.reduce((prev, next) => {
        return prev + next;
      });
    };

    const handleSubmit = () => {
      emit("submitReconciliation");
    };
    onMounted(() => {
      tableData.value = (props.orderList || []).concat(props.waterList || []);
      isDiffMoney.value =
        sum(props.orderList.map((t) => +t.totalPrice)) !==
        sum(props.waterList.map((t) => +t.amount));
      diffMoney =
        sum(props.orderList.map((t) => +t.totalPrice)) -
        sum(props.waterList.map((t) => +t.amount));
    });
    return {
      isEn,
      isDiffMoney,
      tableData,
      handleClose,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
.red-col {
  color: rgb(245, 46, 46);
}
</style>
