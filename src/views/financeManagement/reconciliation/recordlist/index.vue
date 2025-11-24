<template>
  <div>
    <screen-wrapper @search="search" :screenTitle="$t('核对记录')">
      <screen-item :label="$t('对账状态')" label-width="100" :part="4">
        <FilterByReconciliationStatus
          @changeSelect="
            (val) => {
              screenData.status = val;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('对账完成时间')" label-width="120" :part="2">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.startTime = timeArr[0];
              screenData.endTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('渠道')" label-width="120">
        <FilterByChannel
          @changeSelect="
            (channelArr) => {
              screenData.paymentChannel = channelArr[0];
              screenData.paymentSecondChannel = channelArr[1];
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('订单类型')" label-width="100" :part="4">
        <FilterByOrderType
          @changeSelect="
            (val) => {
              screenData.orderType = val;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('订单创建时间')" label-width="120" :part="2">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.orderCreateStartTime = timeArr[0];
              screenData.orderCreateEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('支付成功时间')" label-width="120" :part="2">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.paySuccessStartTime = timeArr[0];
              screenData.paySuccessEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('订单编号')" label-width="120" :part="2">
        <el-input
          v-model.trim="screenData.orderNo"
          clearable
          :placeholder="
            $t('glb-input') +
            (currentLang == 'en' ? ' ' + $t('glb-student') : '订单编号')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item :label="$t('流水类型')" label-width="120" :part="4">
        <FilterByPaymentType
          @changeSelect="
            (val) => {
              screenData.paymentType = val;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('流水号')" label-width="120" :part="2">
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
      <screen-item label="">
        <div>
          <el-checkbox v-model="screenData.difference"
            >{{ $t("对账差额补单") }}
          </el-checkbox>
        </div>
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper no-bottom-border">
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        class="attend-table"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column fixed align="center" :label="$t('序号')" :width="80">
          <template slot-scope="scope">{{
            (data.page - 1) * data.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 200 : 216"
          align="center"
          prop="paymentLogIdArr"
          :label="$t('流水号')"
        >
          <template slot-scope="{ row }">
            <div v-for="(item, i) in row.paymentLogIdArr" :key="i">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 200 : 200"
          align="center"
          prop="orderNo"
          :label="$t('订单编号')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          :label="$t('产品名称')"
        >
          <template slot-scope="scope">
            <span>{{
              currentLang == "en"
                ? scope.row.productNameEn
                : scope.row.productNameZh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="rechargeAmount"
          :label="$t('充值课时')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 80"
          align="center"
          prop="incentiveAmount"
          :label="$t('奖励课时')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="totalAmount"
          :label="$t('总课时(课时)')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 90"
          align="center"
          prop="pretaxPrice"
          :label="$t('课包金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 80"
          align="center"
          prop="orderCurrency"
          :label="$t('订单币种')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 90"
          align="center"
          prop="taxFee"
          :label="$t('税费金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 120"
          align="center"
          prop="totalPrice"
          :label="$t('订单实付总金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 140"
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
          :label="$t('订单支付渠道')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="paymentType"
          :label="$t('订单支付方式')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 240 : 130"
          align="center"
          prop="paymentLogAmount"
          :label="$t('支付金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="paymentLogFees"
          :label="$t('支付手续费')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="paymentLogCurrency"
          :label="$t('支付币种')"
        />

        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="amount"
          :label="$t('对账金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="currency"
          :label="$t('对账币种')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="paymentLogFinalAmount"
          :label="$t('最终入账金额')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="paymentLogFinalCurrency"
          :label="$t('最终入账币种')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          prop="channel"
          :label="$t('支付渠道')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 100"
          align="center"
          :label="$t('状态')"
        >
          <template slot-scope="scope">
            <span>{{ errorStatus[scope.row.errorStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="90" :label="$t('对账结果')">
          <template slot-scope="scope">
            <span>{{ resultStatus[scope.row.resultStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" :label="$t('是否人工处理')">
          <template slot-scope="scope">
            <span>{{ scope.row.isArtificial == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 200 : 90"
          align="center"
          prop="artificialUserName"
          :label="$t('人工处理人')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 200 : 150"
          align="center"
          :label="$t('对账完成时间')"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.reconciliationTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 200 : 140"
          align="center"
          prop=""
          :label="$t('创建时间')"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetails(scope.row)">{{
              $t("查看")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <custom-pagination
        :total="data.total"
        :current-page="data.page"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
  </div>
</template>

<script>
import tabledata from "../component/componentjs/table";
import { reactive, ref } from "@vue/composition-api";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByReconciliationStatus from "@/components/FilterItem/FinanceFilter/FilterByReconciliationStatus";
import FilterByChannel from "@/components/FilterItem/FinanceFilter/FilterByChannel";
import FilterByOrderType from "@/components/FilterItem/FinanceFilter/FilterByOrderType";
import FilterByPaymentType from "@/components/FilterItem/FinanceFilter/FilterByPaymentType";

export default {
  components: {
    FilterByTimePeriod,
    FilterByReconciliationStatus,
    FilterByChannel,
    FilterByOrderType,
    FilterByPaymentType,
  },
  setup(props, { root }) {
    const multipleSelection = ref([]);
    const errorStatus = {
      0: "正常",
      1: "订单单边",
      2: "支付单边",
    };
    const resultStatus = {
      1: "正常",
      2: "异常",
    };
    const {
      data,
      screenData,
      tableData,
      currentLang,
      getCurrentPage,
      getPerPage,
      search,
    } = tabledata(root, "核对");
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };
    const handleDetails = (row) => {
      root.$router.push({
        path: "/financeManagement/orderdetails",
        query: { name: "record", id: row.id },
      });
    };
    const recordtype = reactive([
      { label: "正常", value: 0 },
      { label: "订单单边", value: 1 },
      { label: "支付单边", value: 2 },
    ]);
    return {
      data,
      screenData,
      tableData,
      currentLang,
      handleSelectionChange,
      handleDetails,
      getCurrentPage,
      getPerPage,
      recordtype,
      search,
      errorStatus,
      resultStatus,
    };
  },
};
</script>
