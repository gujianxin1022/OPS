<template>
  <div class="parent-order-detail-warp">
    <div class="btn-group">
      <div class="top-wrap">
        <el-radio-group
          v-model="params.status"
          @change="(params.pageNum = 1), search()"
        >
          <el-radio-button label="0"
            >{{ $t("全部") }}({{ totalCount }})</el-radio-button
          >
          <el-radio-button label="1"
            >{{ $t("待支付") }}({{ waitPayCount }})</el-radio-button
          >
          <el-radio-button label="7"
            >{{ $t("处理中") }}({{ processingCount }})</el-radio-button
          >
          <el-radio-button label="2"
            >{{ $t("已支付") }}({{ paidCount }})</el-radio-button
          >
          <el-radio-button label="3"
            >{{ $t("已取消") }}({{ canceledCount }})</el-radio-button
          >
          <el-radio-button label="4"
            >{{ $t("已退款") }}({{ refundCount }})</el-radio-button
          >
        </el-radio-group>
        <el-input
          clearable
          v-model="params.orderNo"
          @change="(params.pageNum = 1), search()"
          style="width: 200px"
          :placeholder="$t('请输入订单编号')"
        ></el-input>
      </div>
      <el-button type="primary" @click="handlePlacementOrder">{{
        $t("创建订单")
      }}</el-button>
    </div>
    <div class="list">
      <el-table
        class="mt30"
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :key="theKey"
        :empty-text="$t('暂无数据')"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="isEn ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '0'"
          :width="isEn ? 120 : 80"
          align="center"
          prop="status"
          :label="$t('订单状态')"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status >= 0">
              <span v-if="scope.row.status === 0">{{ $t("待支付") }}</span>
              <span v-if="scope.row.status === 1">{{ $t("已支付") }}</span>
              <span v-if="scope.row.status === 5 || scope.row.status === 6">{{
                $t("已取消")
              }}</span>
              <span v-if="scope.row.status === 3 || scope.row.status === 4">{{
                $t("已退款")
              }}</span>
              <span v-if="scope.row.status === 7">{{ $t("处理中") }}</span>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          :width="isEn ? 125 : 80"
          align="center"
          prop="studentUserName"
          :label="$t('充值学生')"
        >
          <template slot-scope="scope">
            {{ scope.row.studentUserName || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          align="center"
          :label="$t('订单创建时间')"
          width="150"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.createTime) || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '1'"
          align="center"
          width="150"
          :label="$t('支付状态')"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.payStatus >= 0">
              {{ $t(payStatus[scope.row.payStatus]) }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '2' || params.status === '7'"
          align="center"
          :label="$t('发起支付时间')"
          width="155"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.paymentTime) || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下单人')"
          width="150"
          prop="createUserName"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          width="150"
          :label="$t('退款时间')"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.refundTime) || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          prop="refundReason"
          align="center"
          :label="$t('退款原因')"
          :width="isEn ? 125 : 80"
        >
          <template slot-scope="scope">
            {{ scope.row.refundReason || "-" }}
          </template>
        </el-table-column>

        <el-table-column
          :width="250"
          align="center"
          prop="orderNo"
          :label="$t('订单编号')"
        >
          <template slot-scope="scope">
            {{ scope.row.orderNo || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '2'"
          :width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.originOrderId">{{ $t("升舱订单") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :width="250"
          align="center"
          prop="payReference"
          :label="$t('流水号')"
        >
          <template slot-scope="scope">
            {{ scope.row.payReference || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          :width="isEn ? 125 : 80"
          :label="$t('退款编号')"
        >
          <template slot-scope="scope">
            {{ scope.row.refundOrderNo || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          :label="$t('产品名称(SPU)')"
        >
          <template slot-scope="scope">
            {{ isEn ? scope.row.spuNameEn : scope.row.spuNameCn }}
          </template>
        </el-table-column>
        <el-table-column width="150" align="center" :label="$t('课时包(SKU)')">
          <template slot-scope="scope">
            {{ isEn ? scope.row.skuNameEn : scope.row.skuNameCn }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeAmount"
          align="center"
          :width="isEn ? 120 : 80"
          :label="$t('订单课时')"
        >
          <template slot-scope="scope">
            {{ scope.row.rechargeAmount || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          :width="160"
          prop="incentiveAmount"
          align="center"
          :label="$t('赠品课时')"
        >
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="620"
              trigger="hover"
              v-if="
                scope.row.activityPolicyRespList &&
                scope.row.activityPolicyRespList.length
              "
            >
              <Gifts
                v-if="
                  scope.row.activityPolicyRespList &&
                  scope.row.activityPolicyRespList.length
                "
                :listData="scope.row.activityPolicyRespList"
                from="list"
                :showValidity="false"
              ></Gifts>
              <span
                slot="reference"
                style="cursor: pointer"
                class="text-overflow"
              >
                {{ scope.row.activityPolicyRespListStr }}
              </span>
            </el-popover>
            <span v-else>
              {{ scope.row.incentiveAmount || "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="originTotalPrice"
          :width="isEn ? 130 : 80"
          align="center"
          :label="$t('原价')"
        >
        </el-table-column>
        <el-table-column
          prop="savePrice"
          v-if="params.status !== '4'"
          :width="isEn ? 130 : 80"
          align="center"
          :label="$t('优惠金额')"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          :width="isEn ? 160 : 120"
          align="center"
        >
          <template slot-scope="scope" slot="header">
            {{ params.status === "2" ? $t("商品实付金额") : $t("商品金额") }}
            <el-tooltip
              v-if="params.status === '2'"
              effect="dark"
              :content="$t('商品实付金额=实付总额-消费税-手续费')"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{
              (
                scope.row.totalPrice -
                scope.row.taxFee -
                scope.row.feePrice
              ).toFixed(2)
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="taxFee"
          align="center"
          :label="$t('消费税')"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="fee"
          :width="150"
          align="center"
          :label="$t('手续费率')"
        >
          <template slot-scope="scope"> {{ scope.row.fee }}% </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="feePrice"
          :width="100"
          align="center"
          :label="$t('手续费')"
        >
        </el-table-column>
        <el-table-column
          prop="totalPrice"
          :width="isEn ? 130 : 80"
          v-if="params.status === '1' || params.status === '3'"
          align="center"
          :label="$t('应付金额')"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status === '0'"
          :width="isEn ? 134 : 80"
          prop="totalPrice"
          align="center"
          :label="$t('订单金额')"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status === '2' || params.status === '0'"
          align="center"
          :width="isEn ? 130 : 80"
          prop="totalPrice"
          :label="$t('实付总额')"
        >
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          align="center"
          width="150"
          :label="$t('币种')"
        >
          <template slot-scope="scope">
            {{ isEn ? scope.row.currencyEn : scope.row.currencyCn || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '2' || params.status === '0'"
          align="center"
          width="160"
          :label="$t('支付成功时间')"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.payTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '3'"
          align="center"
          width="150"
          :label="$t('订单取消时间')"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.cancelTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '3'"
          align="center"
          width="150"
          :label="$t('操作人')"
          prop="cancelUserName"
        >
        </el-table-column>
        <el-table-column
          prop="isDelay"
          width="150"
          align="center"
          :label="$t('支付类型')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isDelay === 0"> {{ $t("银行转账") }} </span>
            <span v-else-if="scope.row.isDelay === 1">
              {{ $t("普通支付") }}
            </span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="payChannel"
          width="150"
          align="center"
          :label="$t('支付通道')"
        >
          <template slot-scope="scope">
            {{ scope.row.payChannel || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status !== '4'"
          prop="payType"
          align="center"
          width="120"
          :label="$t('支付方式')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.payType">
              <span v-show="scope.row.payType === 'ach'">
                ACH Direct Debit
              </span>
              <span v-show="scope.row.payType !== 'ach'">
                {{ scope.row.payType }}
              </span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          prop="deductAmount"
          :width="isEn ? 100 : 80"
          :label="$t('扣除课时')"
        >
          <template slot-scope="scope">
            {{ scope.row.deductAmount || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          :width="isEn ? 120 : 80"
          prop="consumptionAmount"
          :label="$t('消耗课时')"
        >
          <template slot-scope="scope">
            {{ scope.row.consumptionAmount || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          prop="deductCoinPoints"
          :label="$t('扣除积分')"
        >
          <template slot-scope="scope">
            {{ scope.row.deductCoinPoints || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          prop="deductClockTimes"
          :label="$t('扣除打卡次数')"
          :width="isEn ? 132 : 100"
        >
          <template slot-scope="scope">
            {{ scope.row.deductClockTimes || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          prop="poundage"
          :width="isEn ? 120 : 100"
          :label="$t('退款手续费')"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.poundage">{{ scope.row.poundage * 100 }}%</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          :width="isEn ? 150 : 80"
          prop="containsFeeRefundMoney"
          :label="$t('退款金额（扣除手续费后）')"
        >
          <template slot-scope="scope">
            {{ scope.row.containsFeeRefundMoney || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status === '4'"
          align="center"
          width="150"
          :label="$t('币种')"
        >
          <template slot-scope="scope">
            {{ (isEn ? scope.row.currencyEn : scope.row.currencyCn) || "-" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          width="220"
          prop="parentName"
          fixed="right"
        >
          <template slot-scope="scope">
            <template>
              <el-button
                v-if="scope.row.status === 0"
                type="text"
                @click="handelCancelOrder(scope.row.orderId)"
                >{{ $t("取消订单") }}</el-button
              >
              <el-button
                v-if="scope.row.status === 0"
                type="text"
                @click="handleCopyLink(scope.row)"
                >{{ $t("复制支付链接") }}</el-button
              >
              <TransferInfo
                :rowData="scope.row"
                v-if="params.status == '1' && scope.row.isDelay === 0"
                @refreshList="(params.pageNum = 1), search()"
              />
              <el-button
                type="text"
                v-if="params.status === '2'"
                @click="handleShowInvoiceDialog(scope.row)"
                >{{ $t("收据") }}</el-button
              >
              <span v-if="params.status === '2'">
                <el-button
                  v-if="scope.row.isUpgrade"
                  @click="handleUpgrade(scope.row)"
                  type="text"
                  >{{ $t("升舱") }}</el-button
                >
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="$t('本订单暂不支持升舱')"
                  placement="top"
                >
                  <el-button disabled="" type="text">{{
                    $t("升舱")
                  }}</el-button>
                </el-tooltip>
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <custom-pagination
      :total="total"
      :current-page="params.pageNum"
      :pageSize="params.pageSize"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
      :pageSizes="[5, 10, 20, 50]"
    />
    <!-- 代下单 -->
    <OrderPlacementDialog
      v-if="showOrderPlacementDialog"
      :visible.sync="showOrderPlacementDialog"
      :parentUserName="parentUserName"
      :parentUserId="parentUserId"
      @refreshList="(params.pageNum = 1), search()"
      :currOrder="currOrder"
    />
    <InvoiceDialog
      @close="showInvoice = false"
      :show="showInvoice"
      :currentOrderForInvoice="currentOrderForInvoice"
    ></InvoiceDialog>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  toRefs,
  ref,
} from "@vue/composition-api";
import OrderPlacementDialog from "../components/orderPlacementDialog.vue";
import TransferInfo from "../components/TransferInfo";
import InvoiceDialog from "@/views/financeManagement/orderManagement/orderSub/invoiceDetail.vue";
import { deepClone } from "@/utils/handleData";
import Gifts from "../components/Gifts.vue";

export default {
  name: "couponDetail",
  props: {
    parentUserId: {
      type: [String, Number],
      default: -1,
    },
    parentUserName: {
      type: String,
      default: "",
    },
  },
  components: { OrderPlacementDialog, TransferInfo, InvoiceDialog, Gifts },
  setup(props, { root }) {
    const orderStatus = {
      0: "待支付",
      1: "已支付",
      2: "支付失败",
      3: "退款",
      4: "重复支付，支付取消退还",
      5: "用户取消订单",
      6: "系统设置订单已超时",
    };
    // 支付状态 0:待支付;1:支付成功;2:支付失败;3:支付超时;4:退款;5:取消;6:已扣款;7:processing
    const payStatus = {
      0: "待支付",
      1: "支付成功",
      2: "支付失败",
      3: "支付超时",
      4: "退款",
      5: "取消",
      6: "已扣款",
      7: "支付中",
    };
    const showOrderPlacementDialog = ref(false);
    const theKey = ref(0);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const params = reactive({
      parentUserId: props.parentUserId,
      orderNo: "",
      status: "0",
      pageNum: 1,
      pageSize: 5,
    });
    const total = ref(0);
    const tableState = reactive({ loading: false, tableData: [] });
    const numberState = reactive({
      totalCount: 0,
      processingCount: 0,
      waitPayCount: 0,
      paidCount: 0,
      canceledCount: 0,
      refundCount: 0,
    });
    const search = async () => {
      tableState.loading = true;
      theKey.value++;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.reqParentOrderList(params);
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.tableData = data.orderDetailds.list;
        tableState.tableData.forEach((e) => {
          let str = "";
          if (e.activityPolicyRespList && e.activityPolicyRespList.length) {
            e.activityPolicyRespList.forEach((row) => {
              str += `${
                isEn.value ? row.campaignTitleEn : row.campaignTitle
              } :  ${row.value}  ${isEn.value ? row.unitEn : row.unitZh};`;
            });
          }
          e.activityPolicyRespListStr = str;
        });
        total.value = data.orderDetailds.total;
        numberState.totalCount = data.totalCount || 0;
        numberState.processingCount = data.processingCount || 0;
        numberState.waitPayCount = data.waitPayCount || 0;
        numberState.paidCount = data.paidCount || 0;
        numberState.canceledCount = data.canceledCount || 0;
        numberState.refundCount = data.refundCount || 0;
      } finally {
        tableState.loading = false;
      }
    };
    const getCurrentPage = (page) => {
      params.pageNum = page;
      search();
    };
    const getPerPage = (perPage) => {
      params.pageSize = perPage;
      search();
    };
    const isHavePermission = async () => {
      const params = {
        parentUserId: props.parentUserId,
      };
      const res = await root.$Api.financeManagement.checkPermission(params);
      if (!res) {
        root.$message.warning(root.$t("您没有权限操作此功能"));
        return;
      }
      return res;
    };
    const handlePlacementOrder = async () => {
      /* 判断是否是家长下的学管或者cc或者是交易管理员角色 */
      currOrder.value = null;
      if (!(await isHavePermission())) return;
      showOrderPlacementDialog.value = true;
    };
    /* 取消订单 */
    const handelCancelOrder = async (orderId) => {
      /* 判断是否是家长下的学管或者cc或者是交易管理员角色 */
      if (!(await isHavePermission())) return;
      const params = {
        orderId: orderId,
        orderType: 1 /* ops固定传参1 */,
      };
      root
        .$confirm(root.$t("确认是否继续取消订单操作？"), root.$t("提示"), {
          confirmButtonText: root.$t("确定"),
          cancelButtonText: root.$t("取消"),
          type: "warning",
        })
        .then(async () => {
          await root.$Api.financeManagement.reqCancelOrder(params);
          root.$notify.success(root.$t("操作成功"));
          search();
        });
    };
    /* 收据 */
    const currentOrderForInvoice = ref({});
    const showInvoice = ref(false);
    const handleShowInvoiceDialog = (scopeRow) => {
      currentOrderForInvoice.value = deepClone(scopeRow);
      (currentOrderForInvoice.value.parentUserId =
        root.$route.query.parentUserId),
        (showInvoice.value = true);
    };
    /* 复制支付链接 */
    const handleCopyLink = (row) => {
      if (!row.paymentLink || !row.paymentLink.length) {
        return root.$notify({
          message: root.$t("暂无支付链接"),
          type: "warning",
        });
      }
      navigator.clipboard
        .writeText(row.paymentLink)
        .then(function () {
          root.$notify({
            message: root.$t("复制成功"),
            type: "success",
          });
        })
        .catch(function (error) {
          root.$notify({
            message: root.$t("复制失败"),
            type: "error",
          });
        });
    };
    const currOrder = ref({});
    const handleUpgrade = async (row) => {
      if (!(await isHavePermission())) return;
      showOrderPlacementDialog.value = true;
      currOrder.value = row;
    };
    onMounted(async () => {
      await search();
    });
    return {
      showOrderPlacementDialog,
      payStatus,
      orderStatus,
      isEn,
      params,
      total,
      search,
      ...toRefs(tableState),
      ...toRefs(numberState),
      getCurrentPage,
      getPerPage,
      handlePlacementOrder,
      theKey,
      handelCancelOrder,
      handleShowInvoiceDialog,
      currentOrderForInvoice,
      showInvoice,
      handleCopyLink,
      handleUpgrade,
      currOrder,
    };
  },
};
</script>

<style lang="scss" scoped>
.parent-order-detail-warp {
  .list {
    width: 100%;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
  }
}
</style>
