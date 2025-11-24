<template>
  <div class="my-deal-wrap">
    <!-- 下拉 -->
    <div
      class="top-selsect mb10"
      v-if="Per.handleButtonPer('teach.myWorkbench.myDeal.wbmyDealScope')"
    >
      <!-- <el-select v-model="deptType" :placeholder="$t('请选择')">
        <el-option
          v-for="item in topSelectData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
      <CommonTree @get_seleParams="get_seleParams"></CommonTree>
    </div>
    <div class="my-deal-search-wrap">
      <el-input
        v-model="screenData.parentUserId"
        :placeholder="
      $t('请输入家长ID查询')
          "
      ></el-input>
      <el-button
        @click="search"
        class="ml10"
        type="primary"
      >{{ $t('查询') }}</el-button>
    </div>
    <div class="my-deal-table">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template
            slot-scope="scope">{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('支付成功时间')"
          prop="name"
          :width="currentLang == 'en' ? 180 : 180"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.paySuccessDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下单人')"
          prop="createUserName"
          :width="currentLang == 'en' ? 180 : 180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('家长id')"
          prop="id"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showCustomerDetailDialog( scope.row, scope.$index )"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Top-up Points')"
          :width="120"
          prop="rechargeAmount"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Bonus Points')"
          :width="120"
          prop="incentiveAmount"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('课包')"
          :min-width="100"
          prop="productPackageName"
        >
          <template slot-scope="scope">
            <span>{{currentLang === 'en' ? scope.row.productPackageNameEn : scope.row.productPackageNameZh}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang == 'en' ? 230 : 200"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('学管老师')"
          prop="xgUserName"
          :width="currentLang == 'en' ? 120 : 100"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          :width="currentLang == 'en' ? 180 : 120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleShowInvoiceDialog(scope.row)"
            >{{ $t('收据') }}</el-button>
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
    <CustomerDetail
      :showCustomerDetail="showCustomerDetail"
      :customerInfo="customerInfo"
      @closeCustomerDetailDialog="closeCustomerDetailDialog"
      @preUser="preUser"
      @nextUser="nextUser"
    ></CustomerDetail>
    <InvoiceDialog
      @close="handleCloseInvoiceDialog"
      :show="showInvoice"
      :currentOrderForInvoice="currentOrderForInvoice"
      :currentComponent="myDeal"
    ></InvoiceDialog>
  </div>
</template>
<script>
import CustomerDetail from "../components/customerDetail";
import InvoiceDialog from '@/views/financeManagement/orderManagement/orderSub/invoiceDetail.vue'
import { mapGetters } from 'vuex';
import { deepClone } from "../../../utils/handleData";
import CommonTree from '../../reportManagement/commonTree/index'
import { parentIdValidate } from '@/utils/reg.js'

export default {
  name: 'MyDeal',
  components: {
    CustomerDetail,
    InvoiceDialog,
    CommonTree
  },
  props: {},
  data () {
    return {
      myDeal: 'myDeal',
      tableData: [],
      loading: false,
      tableHeight: window.innerHeight - 200 || 300,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        parentUserId: '',
        searchType: "",
      },
      total: 0,
      showCustomerDetail: false,
      customerInfo: {},
      currentScopeIndex: -1,
      topSelectData: [],
      showInvoice: false,
      currentOrderForInvoice: {}
    };
  },
  computed: {
    nowUserInfo () {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(['currentLang'])
  },
  methods: {
    //获取范围组件的值
    get_seleParams (val, valName, searchType) {
      this.screenData.searchType = searchType
      if (valName === "postIdList") {
        this.screenData.userIdStr = ''
        this.screenData.postIdStr = val.join(',')
        this.getTableData()
      } else if (valName === "userIdList") {
        this.screenData.postIdStr = ''
        this.screenData.userIdStr = val.join(',')
        setTimeout(() => {
          this.getTableData();
        }, 500)
      }
    },
    search () {
      if (this.screenData && this.screenData.parentUserId && !parentIdValidate(this, this.screenData.parentUserId)) {
        return;
      }
      this.screenData.pageNum = 1
      this.getTableData()
    },
    // 关闭收据dialog
    handleCloseInvoiceDialog () {
      this.showInvoice = false
    },
    //弹出收据dialog
    handleShowInvoiceDialog (scopeRow) {
      this.currentOrderForInvoice = deepClone(scopeRow)
      this.showInvoice = true
    },
    initData () {
      this.topSelectData = [
        { label: this.$t('my-home-My Desk'), value: 0 },
        { label: this.$t('my-home-My Team'), value: 1 }
      ]
    },
    showCustomerDetailDialog (scoprRow, scopeIndex) {
      this.currentScopeIndex = scopeIndex;
      this.customerInfo = JSON.parse(JSON.stringify(scoprRow));
      this.showCustomerDetail = true;
    },
    preUser () {
      if (this.currentScopeIndex == 0) {
        this.$notify({
          message: this.$t('Already the first customer on this page'),
          type: "warning"
        });
        return;
      }
      this.currentScopeIndex -= 1;
      this.customerInfo = JSON.parse(
        JSON.stringify(this.tableData[this.currentScopeIndex])
      );
    },
    nextUser () {
      if (this.currentScopeIndex == this.tableData.length - 1) {
        this.$notify({
          message: this.$t('Already the last customer on this page'),
          type: "warning"
        });
        return;
      }
      this.currentScopeIndex += 1;
      this.customerInfo = JSON.parse(
        JSON.stringify(this.tableData[this.currentScopeIndex])
      );
    },
    closeCustomerDetailDialog () {
      this.showCustomerDetail = false;
    },
    getTableData () {
      this.loading = true;
      let { pageNum, pageSize, parentUserId } = this.screenData;
      let params = {}
      for (var key in this.screenData) {
        if (this.screenData[key] !== '') {
          params[key] = this.screenData[key]
        }
      }
      this.$Api.workBench
        .getMyDealList(this.nowUserInfo.id, pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    getCurrentPage (page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage (perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    }
  },
  created () {
    this.initData()
    this.getTableData();
  }
};
</script>
<style lang="scss" scope>
.my-deal-wrap {
  // margin-top: -10px;
  padding: 10px 0 0 10px;
}

.my-deal-search-wrap {
  width: 500px;
  display: flex;

  .check-box {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
