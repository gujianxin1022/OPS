<template>
  <div>
    <div class="d-wrapper scroll-cp-container">
      <screen-wrapper @search="orderSearch" :screenTitle="$t('业务订单')">
        <screen-item :label="$t('对账状态')" label-width="100" :part="2">
          <FilterByReconciliationStatus
            @changeSelect="
              (val) => {
                opsscreenData.errorStatus = val;
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('SPU')" label-width="100" :part="4">
          <FilterBySpu
            @changeSelect="
              (val) => {
                opsscreenData.spuIdList = val;
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('订单类型')" label-width="100" :part="4">
          <FilterByOrderType
            @changeSelect="
              (val) => {
                opsscreenData.orderType = val;
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('订单创建时间')" label-width="100" :part="4">
          <FilterByTimePeriod
            @changeSelect="
              (timeArr) => {
                opsscreenData.orderCreateStartTime = timeArr[0];
                opsscreenData.orderCreateEndTime = timeArr[1];
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('订单编号')" label-width="100" :part="4">
          <el-input
            v-model.trim="opsscreenData.orderNo"
            clearable
            :placeholder="
              $t('glb-input') +
              (currentLang == 'en' ? ' ' + $t('glb-student') : '订单编号')
            "
            @keyup.enter.native="search"
          />
        </screen-item>
        <screen-item :label="$t('渠道')" label-width="100" :part="4">
          <FilterByChannel
            @changeSelect="
              (channelArr) => {
                opsscreenData.paymentChannel = channelArr[0];
                opsscreenData.paymentType = channelArr[1];
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('流水号')" label-width="100" :part="2">
          <el-input
            v-model.trim="opsscreenData.channelLogId"
            clearable
            :placeholder="
              $t('glb-input') +
              (currentLang == 'en' ? ' ' + $t('glb-student') : '第三方流水号')
            "
            @keyup.enter.native="search"
          />
        </screen-item>

        <screen-item
          :label="$t('支付成功时间（订单）')"
          label-width="100"
          :part="4"
        >
          <FilterByTimePeriod
            @changeSelect="
              (timeArr) => {
                opsscreenData.paySuccessStartTime = timeArr[0];
                opsscreenData.paySuccessEndTime = timeArr[1];
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('币种')" label-width="100" :part="4">
          <FilterByCurrency
            :multiple="false"
            @changeSelect="
              (val) => {
                opsscreenData.currency = val;
              }
            "
          />
        </screen-item>
      </screen-wrapper>
      <screen-wrapper @search="search" :screenTitle="$t('银行对账')">
        <screen-item :label="$t('对账状态')" label-width="100" :part="2">
          <FilterByReconciliationStatus
            @changeSelect="
              (val) => {
                screenData.errorStatus = val;
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('流水类型')" label-width="100" :part="4">
          <FilterByPaymentType
            @changeSelect="
              (val) => {
                screenData.paymentType = val;
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('渠道')" label-width="100" :part="4">
          <FilterByChannel
            @changeSelect="
              (channelArr) => {
                screenData.paymentChannel = channelArr[0];
                screenData.paymentSecondChannel = channelArr[1];
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('流水号')" label-width="100" :part="2">
          <el-input
            v-model.trim="screenData.channelLogId"
            clearable
            :placeholder="
              $t('glb-input') +
              (currentLang == 'en' ? ' ' + $t('glb-student') : '银行流水号')
            "
            @keyup.enter.native="search"
          />
        </screen-item>
        <screen-item
          :label="$t('支付成功时间（流水）')"
          label-width="100"
          :part="4"
        >
          <FilterByTimePeriod
            @changeSelect="
              (timeArr) => {
                screenData.paySuccessStartTime = timeArr[0];
                screenData.paySuccessEndTime = timeArr[1];
              }
            "
          />
        </screen-item>
        <screen-item :label="$t('币种')" label-width="100" :part="4">
          <FilterByCurrency
            :multiple="true"
            @changeSelect="
              (val) => {
                screenData.currency = val.join(',');
              }
            "
          />
        </screen-item>
      </screen-wrapper>
    </div>
    <div class="tables">
      <!-- 订单表格-->
      <custom-card :title="$t('')" class="table-wrapper no-bottom-border">
        <div slot="header-right" class="slot-tit">
          <el-button @click="downloadOrder">{{ $t("下载订单") }}</el-button>
          <el-button
            :disabled="!opsscreenData.selectedRows.length"
            @click="revise"
            >{{ $t("修正流水号") }}</el-button
          >
        </div>
        <el-table
          v-loading="opsscreenData.loading"
          :data="opstableData"
          tooltip-effect="dark"
          :border="false"
          style="width: 100%"
          height="80%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @sort-change="sortChange"
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          class="my-table-left"
          stripe
          @row-click="singleElection"
          ref="multipleTableOrder"
        >
          <el-table-column label="" width="30">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="select.ops" :label="scope.$index"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('序号')" :width="50">
            <template slot-scope="scope">{{
              (data.opspage - 1) * data.opspageSize + scope.$index + 1
            }}</template>
          </el-table-column>
          <el-table-column
            width="300"
            align="center"
            prop="orderNo"
            :label="$t('订单编号')"
          />
          <el-table-column
            align="center"
            :width="currentLang == 'en' ? 300 : 230"
            prop="reference"
            :label="$t('流水号')"
          >
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.referenceArr && scope.row.referenceArr.length > 0
                "
              >
                <el-button
                  type="text"
                  v-for="(item, index) in scope.row.referenceArr"
                  :key="index"
                  >{{ item.reference }}</el-button
                >
              </div>
              <el-button v-else type="text">{{
                scope.row.reference
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="ccName"
            label="CC"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="ccPostInfo"
            :label="$t('部门')"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.ccPostInfo"
                effect="dark"
                :content="scope.row.ccPostInfo.fullDeptName"
                placement="top"
              >
                <el-button type="text">{{
                  scope.row.ccPostInfo.lastDeptName
                }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="laName"
            label="LA"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="laPostInfo"
            :label="$t('部门')"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.laPostInfo"
                effect="dark"
                :content="scope.row.laPostInfo.fullDeptName"
                placement="top"
              >
                <el-button type="text">{{
                  scope.row.laPostInfo.lastDeptName
                }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 300 : 140"
            align="center"
            :label="$t('支付成功时间（订单）')"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.paymentSuccessTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="paymentChannel"
            :label="$t('一级渠道')"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="paymentType"
            :label="$t('二级渠道')"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 110"
            align="center"
            prop="totalPrice"
            :label="$t('金额')"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 60"
            align="center"
            prop="currency"
            :label="$t('币种')"
          />
          <el-table-column align="center" :label="$t('对账状态')">
            <template slot-scope="scope">
              <span>{{ $t(errorStatus[scope.row.errorStatus]) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" align="center" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="nullifyOrder(scope.row, 'left')"
              >
                {{ $t("作废") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <custom-pagination
          :total="data.opstotal"
          :current-page="data.opspage"
          @getCurrentPage="opsgetCurrentPage"
          @getPerPage="opsgetPerPage"
        />
      </custom-card>
      <!-- 流水表格-->
      <custom-card :title="$t('')" class="table-wrapper no-bottom-border">
        <div slot="header-right" class="slot-tit">
          <el-button @click="uploadPipeline">{{ $t("上传流水") }}</el-button>
          <el-button @click="downloadPayment">{{ $t("下载流水") }}</el-button>
          <el-button @click="openRecon">{{ $t("手动对账") }} </el-button>
          <el-button @click="jumprecord">{{ $t("核对记录") }} </el-button>
        </div>
        <el-table
          v-loading="screenData.loading"
          :data="tableData"
          tooltip-effect="dark"
          :border="false"
          style="width: 100%"
          height="80%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @sort-change="sortChange"
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          class="my-table-right"
          stripe
          ref="multipleTableWater"
          @selection-change="
            (e) => {
              screenData.selectedRows = e;
            }
          "
        >
          <el-table-column label="" width="30">
            <el-table-column type="selection" width="50" fixed />
          </el-table-column>
          <el-table-column align="center" :label="$t('序号')" :width="50">
            <template slot-scope="scope">{{
              (data.page - 1) * data.pageSize + scope.$index + 1
            }}</template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 300 : 230"
            align="center"
            :label="$t('流水号')"
          >
            <template slot-scope="scope">
              <span>
                <router-link
                  :to="{
                    path: `/financeManagement/orderdetails`,
                    query: { id: scope.row.id, name: 'bank' },
                  }"
                >
                  <el-button type="text">{{
                    scope.row.channelLogId
                  }}</el-button>
                </router-link>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :width="currentLang == 'en' ? 300 : 140"
            align="center"
            :label="$t('支付成功时间（流水）')"
          >
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.payTime) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column  align="center" prop="channel" :label="$t('渠道')" /> -->
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="channel"
            :label="$t('一级渠道')"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="channelSecond"
            :label="$t('二级渠道')"
          />
          <el-table-column align="center" prop="amount" :label="$t('金额')" />
          <el-table-column align="center" prop="currency" :label="$t('币种')" />
          <el-table-column align="center" prop="fees" :label="$t('手续费')" />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="finalAmount"
            :label="$t('最终入账金额')"
          />
          <el-table-column
            :width="currentLang == 'en' ? 200 : 100"
            align="center"
            prop="finalCurrency"
            :label="$t('最终入账币种')"
          />
          <el-table-column align="center" :label="$t('对账状态')">
            <template slot-scope="scope">
              <span>{{ $t(errorStatus[scope.row.errorStatus]) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" align="center" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="nullifyOrder(scope.row, 'right')"
              >
                {{ $t("作废") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <custom-pagination
          :total="data.banktotal"
          :current-page="data.page"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </custom-card>
    </div>
    <el-dialog
      :title="$t('作废原因')"
      :visible.sync="showNullifyDialog"
      width="30%"
      :before-close="handelCloseNullifyDialog"
      :close-on-click-modal="false"
      center
    >
      <div>
        <el-form ref="ruleForm" class="demo-form-inline" label-width="80px">
          <el-form-item :label="$t('原因')">
            <FilterByNullifyReason
              @changeSelect="
                (val) => {
                  nullifyParams.cnReason = val;
                }
              "
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handelCloseNullifyDialog">{{
          $t("取消")
        }}</el-button>
        <el-button type="primary" @click="handleNullify">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备注"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="
        () => {
          formInline.textarea = '';
          dialogVisible = false;
        }
      "
      :close-on-click-modal="false"
      center
    >
      <div>
        <el-form ref="ruleForm" :model="formInline" class="demo-form-inline">
          <el-form-item prop="textarea">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="formInline.textarea"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manualaccount">{{ $t("跳过") }}</el-button>
        <el-button type="primary" @click="manualaccount">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
    <ImportPipelineDialog :dialogVisible.sync="importPipelineVisible" />
    <RevisePaymentID
      v-if="revisePaymentIDVisible"
      :dialogVisible.sync="revisePaymentIDVisible"
      :orderId="orderId"
      @updateTable="orderSearch"
      :selectRow="opsscreenData.selectedRows"
    />
    <!-- 对账弹窗 -->
    <ReconciliationInfoDialog
      v-if="showDiffVisible"
      :diffVisible.sync="showDiffVisible"
      :orderList="opsscreenData.selectedRows"
      :waterList="screenData.selectedRows"
      @submitReconciliation="
        () => {
          dialogVisible = true;
        }
      "
    />
  </div>
</template>

<script>
import { onMounted, reactive, ref, unref } from "@vue/composition-api";
import tabledata from "../component/componentjs/table";
import ImportPipelineDialog from "./components/importPipelineDialog";
import RevisePaymentID from "./components/revisePaymentID.vue";
import { downloadFile } from "@/utils/handleData";
import ReconciliationInfoDialog from "./components/reconciliationDiffDialog.vue";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByReconciliationStatus from "@/components/FilterItem/FinanceFilter/FilterByReconciliationStatus";
import FilterBySpu from "@/components/FilterItem/FinanceFilter/FilterBySpu";
import FilterByOrderType from "@/components/FilterItem/FinanceFilter/FilterByOrderType";
import FilterByPaymentType from "@/components/FilterItem/FinanceFilter/FilterByPaymentType";
import FilterByCurrency from "@/components/FilterItem/FinanceFilter/FilterByCurrency";
import FilterByChannel from "@/components/FilterItem/FinanceFilter/FilterByChannel";
import FilterByNullifyReason from "@/components/FilterItem/FinanceFilter/FilterByNullifyReason";

export default {
  components: {
    ImportPipelineDialog,
    RevisePaymentID,
    ReconciliationInfoDialog,
    FilterByTimePeriod,
    FilterByReconciliationStatus,
    FilterBySpu,
    FilterByOrderType,
    FilterByPaymentType,
    FilterByCurrency,
    FilterByChannel,
    FilterByNullifyReason,
  },
  setup(props, { root, refs }) {
    const {
      getData,
      search,
      opssearch,
      data,
      tableData,
      opstableData,
      screenData,
      opsscreenData,
      currentLang,
      opsgetCurrentPage,
      opsgetPerPage,
      getCurrentPage,
      getPerPage,
    } = tabledata(root, "银行对账");
    const select = reactive({
      ops: null,
      bank: null,
      orderRow: {},
      paymentRow: {},
    });
    //ops业务订单 单选
    const singleElection = (row) => {
      opsscreenData.selectedRows = [row];
      select.ops = tableData.value.indexOf(row);
    };
    const formInline = reactive({
      textarea: "",
    });
    const showNullifyDialog = ref(false);
    const showDiffVisible = ref(false);
    const errorStatus = {
      0: "无",
      1: "订单单边",
      2: "支付单边",
      3: "金额不一致",
    };
 
    const importPipelineVisible = ref(false);
    const revisePaymentIDVisible = ref(false);
    const nullifyPipeline = () => {
      if (!screenData.selectedRows.length)
        return root.$notify.warning("未选择银行对账单数据");
    };
    const nullifyParams = ref({
      orderSyncId: "",
      paymentLogSyncId: "",
      cnReason: "",
      enReason: "",
    });
    const nullifyOrder = (row, type) => {
      switch (type) {
        case "left":
          nullifyParams.value.orderSyncId = row.id;
          break;
        case "right":
          nullifyParams.value.paymentLogSyncId = row.id;
          break;
      }
      showNullifyDialog.value = true;
    };

    const handleNullify = async () => {
      await root.$Api.financeManagement.reqNullifyOrderOrPayment(
        nullifyParams.value
      );
      root.$notify.success(root.$t("操作成功"));
      handelCloseNullifyDialog();
      orderSearch();
    };
    const handelCloseNullifyDialog = () => {
      showNullifyDialog.value = false;
      nullifyParams.value = {};
    };
    const dialogVisible = ref(false);
    //  手动对账弹窗
    const openRecon = () => {
      if (!opsscreenData.selectedRows.length)
        return root.$notify.warning("未选择ops业务订单数据");
      if (!screenData.selectedRows.length)
        return root.$notify.warning("未选择银行对账单数据");
      showDiffVisible.value = true;
    };
    // 手动对账
    const manualaccount = async () => {
      let paymentLogSyncId = [];
      screenData.selectedRows.forEach((e) => {
        paymentLogSyncId.push(e.id);
      });
      let params = {
        mark: formInline.textarea,
        orderSyncId: opsscreenData.selectedRows[0].id,
        paymentLogSyncId: paymentLogSyncId,
      };
      try {
        const {
          status,
          data: { code, message },
        } = await root.$Api.financeManagement.businessArtificial(params);
        if (status == 200 && code == 200) {
          root.$notify.success({
            message: message,
          });
          getData("银行对账");
        }
      } finally {
        showDiffVisible.value = false;
        dialogVisible.value = false;
      }
    };
    // 核对记录
    const jumprecord = () => {
      root.$router.push("/financeManagement/bankrecord");
    };
    const uploadPipeline = () => {
      importPipelineVisible.value = true;
    };
    const orderId = ref(null);
    const revise = () => {
      if (opsscreenData.selectedRows.length !== 1) {
        return root.$notify.warning("只能选择一个订单");
      }
      orderId.value = opsscreenData.selectedRows[0].id;
      revisePaymentIDVisible.value = true;
    };

    const downloadOrder = () => {
      let {
        channelLogId: opschannelLogId,
        currency: opscurrency,
        orderNo: opsorderNo,
        paymentChannel,
        orderType,
        spuIdList,
        errorStatus
      } = opsscreenData;
      let params = {
        channelLogId: opschannelLogId,
        currency: opscurrency,
        orderNo: opsorderNo,
        paymentChannel:paymentChannel,
        orderType,
        spuIdList,
        errorStatus
      };
      params.paySuccessStartTime = opsscreenData.paySuccessStartTime;
      params.paySuccessEndTime = opsscreenData.paySuccessEndTime;
      let paramsStr = "";
      for (var key in params) {
        if (params[key] !== "") {
          paramsStr += `&${key}=${params[key]}`;
        }
      }
      console.log(paramsStr)
      // return
      downloadFile(
        paramsStr.length
          ? `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/order/undo/export?${paramsStr}`
          : `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/order/undo/export`,
        "Orders"
      );
    };

    const downloadPayment = () => {
      let { channelLogId, currency } = screenData;
      let params = { channelLogId, currency };
      params.paySuccessStartTime = screenData.paySuccessStartTime || "";
      params.paySuccessEndTime = screenData.paySuccessEndTime || "";
      let paramsStr = "";
      for (var key in params) {
        if (params[key] !== "") {
          paramsStr += `&${key}=${params[key]}`;
        }
      }
      downloadFile(
        paramsStr.length
          ? `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/business/export/reference?${paramsStr}`
          : `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/business/export/reference`,
        "BankFlows"
      );
    };

    const orderSearch = () => {
      opssearch();
    };
    onMounted(() => {});

    return {
      data,
      showDiffVisible,
      showNullifyDialog,
      tableData,
      opstableData,
      screenData,
      opsscreenData,
      currentLang,
      nullifyParams,
      handelCloseNullifyDialog,
      manualaccount,
      jumprecord,
      search,
      orderSearch,
      opsgetCurrentPage,
      opsgetPerPage,
      getCurrentPage,
      getPerPage,
      openRecon,
      formInline,
      errorStatus,
      downloadOrder,
      downloadPayment,
      uploadPipeline,
      importPipelineVisible,
      orderId,
      revise,
      revisePaymentIDVisible,
      nullifyPipeline,
      nullifyOrder,
      handleNullify,
      select,
      singleElection,
      dialogVisible,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-card-wrapper {
  width: 50%;
  overflow: visible !important;
  height: 100%;
}
.custom-card-wrapper .custom-card-header .custom-header-title {
  background: #7580e5;
}
.tables {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
  .table-wrapper {
    height: calc(100vh - 60px);
  }
  /* 设置滚动条宽度和高度 */
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px; /* 横向滚动条 */
    height: 8px; /* 纵向滚动条 必写 */
  }
  /* 设置滚动条样式 */
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dde;
    border-radius: 3px;
  }
}
.d-wrapper {
  width: 100%;
  display: flex;
}
</style>
