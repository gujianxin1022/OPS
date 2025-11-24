<template>
  <div class="coupon-list-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item
        :label="$t('订单状态')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.status"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in tradeStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('订单号')" :part="4" :label-width="labelWidth">
        <el-input :placeholder="$t('请输入')" clearable v-model="screenData.tid"></el-input>
      </screen-item>
      <screen-item
        :label="$t('交易时间')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-date-picker
          style="width: 220px"
          v-model="applyDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator=""
          :start-placeholder="$t('开始日期')"
          @change="timeChange"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </screen-item>
    </screen-wrapper>
    <div class="coupon-table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('用户手机号')"
          width="140"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('PID')"
          width="140"
          prop="parentUserId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('天猫订单名称')"
          width="140"
          prop="orderName"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('订单金额')"
          width="140"
          prop="orderPrice"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('创建时间')"
          :width="currentLang === 'en' ? 150 : 140"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.orderTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('渠道码')"
          width="140"
          prop="channel"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售ID')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="ccUserId"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售姓名')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="ccUserId"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售组别')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="ccUserId"
        ></el-table-column>

        <el-table-column align="center" :label="$t('是否新用户')" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.newUser ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('订单状态')" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.orderStatusMsg }}</span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CustomUpload from "@/components/Upload/CustomUpload";

export default {
  name: "couponList",
  data() {
    return {
      showBathCreateCoupons: false,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        tid: "",
        orderStartTime: "",
        orderEndTime: "",
        status: "",
        subjectType:2
      },
      applyDate: [],
      tableData: [],
      total: 0,
      loading: false,
      labelWidth: 100,
      tradeStatusOptions: [],
    };
  },
  components: { CustomUpload },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {

    initData() {
      this.tradeStatusOptions = [
        { label: this.$t("等待买家付款"), value: "WAIT_BUYER_PAY" },
        { label: this.$t("等待卖家发货"), value: "WAIT_SELLER_SEND_GOODS" },
        { label: this.$t("卖家部分发货"), value: "SELLER_CONSIGNED_PART" },
        { label: this.$t("等待买家确认收货"), value: "WAIT_BUYER_CONFIRM_GOODS" },
        { label: this.$t("买家已签收（货到付款专用）"), value: "TRADE_BUYER_SIGNED" },
        { label: this.$t("交易成功"), value: "TRADE_FINISHED" },
        { label: this.$t("交易关闭"), value: "TRADE_CLOSED" },
        { label: this.$t("交易被淘宝关闭"), value: "TRADE_CLOSED_BY_TAOBAO" },
        { label: this.$t("没有创建外部交易（支付宝交易）"), value: "TRADE_NO_CREATE_PAY" },
        { label: this.$t("余额宝0元购合约中"), value: "WAIT_PRE_AUTH_CONFIRM" },
        { label: this.$t("外卡支付付款确认中"), value: "PAY_PENDING" },
        { label: this.$t("所有买家未付款的交易（包含：WAIT_BUYER_PAY、TRADE_NO_CREATE_PAY）"), value: "ALL_WAIT_PAY" },
        { label: this.$t("所有关闭的交易（包含：TRADE_CLOSED、TRADE_CLOSED_BY_TAOBAO）"), value: "ALL_CLOSED" },
        { label: this.$t("该状态代表订单已付款但是处于禁止发货状态"), value: "PAID_FORBID_CONSIGN" }
      ];
    },
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    timeChange () {
      if (this.applyDate) {
        this.screenData.orderStartTime = new Date(`${this.applyDate[0]} 00:00:00`).toISOString()
        this.screenData.orderEndTime = new Date(`${this.applyDate[1]} 23:59:59`).toISOString()
      } else {
        this.screenData.orderStartTime = ''
        this.screenData.orderEndTime = ''
      }

    },
    getTableData() {
      this.loading = true;
      let params = {};
      console.log(this.screenData)
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.tianmaoManagement
        .getOrderList(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.getTableData();
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
.coupon-list-wrap {
  .create-coupon-wrap {
    width: 100%;
    text-align: right;
    margin-top: 10px;
  }
  .coupon-table-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .top {
    width: 100%;
    display: flex;
  }
  .textarea {
    width: 100%;
  }
}
</style>
