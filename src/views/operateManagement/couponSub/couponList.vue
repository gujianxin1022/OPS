<template>
  <div class="coupon-list-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item
        :label="$t('优惠类型')"
        :part="4"
        :label-width="currentLang === 'en' ? 120 : labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.couponType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in couponTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('允许发券')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.status"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('优惠券名称')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input clearable v-model="screenData.couponName"></el-input>
      </screen-item>
      <screen-item :label="$t('优惠券码')" :part="4" :label-width="labelWidth">
        <el-input clearable v-model="screenData.code"></el-input>
      </screen-item>
      <screen-item :label="$t('创建人员')" :part="4" :label-width="labelWidth">
        <el-input clearable v-model="screenData.createUserName"></el-input>
      </screen-item>
      <screen-item
        :label="$t('创建时间')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-date-picker
          style="width: 220px"
          v-model="applyDate"
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
      <div class="create-coupon-wrap">
        <el-button type="primary" @click="showBathCreateCoupons = true">{{
          $t("批量创建优惠券")
        }}</el-button>
        <el-button type="primary" @click="goCreate">{{
          $t("创建优惠券")
        }}</el-button>
      </div>
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
          :label="$t('优惠券名称')"
          width="140"
          prop="couponName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠码')"
          width="140"
          prop="name"
        >
          <template slot-scope="scope">
            <el-button @click="goDetail(scope.row)" type="text">{{
              scope.row.code
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠券类型')"
          width="140"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.couponType | couponTypeFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠力度')"
          width="140"
          prop="name"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.couponType == 1"
              >{{ scope.row.discount }}% OFF</span
            >
            <span v-if="scope.row.couponType == 2"
              >{{ scope.row.couponAmount }}{{ scope.row.currency }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('适用产品')"
          width="140"
          prop="productName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('最低课时')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="amount"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('最高课时')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="maxAmount"
        ></el-table-column>
        <el-table-column align="center" :label="$t('有效期')" width="300">
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.validStartTime)
            }}</span>
            <span>-</span>
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.validEndTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('创建人员')"
          width="140"
          prop="createUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('创建时间')"
          :width="currentLang === 'en' ? 150 : 140"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('status')" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.status | couponStatusFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          fixed="right"
          width="140"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showDialog(scope.row)"
              :disabled="scope.row.status === 0"
              >{{ $t("发券") }}</el-button
            >
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
    <el-dialog
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :title="$t('发放优惠券')"
      center
      :visible.sync="sendCouponDialog"
    >
      <div class="top">
        <p class="mr10">
          {{ $t("优惠券名称") }}：{{ currentCoupon.couponName }}
        </p>
        <p v-if="currentCoupon.couponType == 1">
          {{ $t("优惠") }}：<span>{{ currentCoupon.discount }}% OFF</span>
        </p>
        <p v-if="currentCoupon.couponType == 2">
          {{ $t("优惠") }}：<span
            >{{ currentCoupon.couponAmount }}{{ currentCoupon.currency }}</span
          >
        </p>
      </div>
      <div class="textarea">
        <el-input
          type="textarea"
          :rows="16"
          maxlength="100000"
          :placeholder="
            $t(
              '请输入接收优惠券的用户ID并以换行分隔，如 \n6128899959852783 \n1774533401611699'
            )
          "
          v-model="sendUsers"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t("取消") }}</el-button>
        <el-button
          type="primary"
          @click="sureSends"
          :loading="sureSendsLoading"
          >{{ $t("确定") }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :before-close="closeBathCreateCouponsDialog"
      :close-on-click-modal="false"
      :title="$t('批量创建优惠券')"
      width="400px"
      center
      :visible.sync="showBathCreateCoupons"
    >
      <div>
        <CustomUpload
          v-if="showBathCreateCoupons"
          ref="CustomUpload"
          :config="{
            url: '/opsapi/trading/center/common/coupon/import/excel',
          }"
          @ok="handelBathCreateSuccess"
        />
        <br />
        <br />
        <span>{{ $t("仅支持xls、xlsx格式,最多1000条") }}</span>
        <el-button type="text">
          <a
            href="https://priv.cdn.lingoace.com/OPS/Coupon Upload Template.xlsx"
            >{{ $t("下载模板") }}</a
          >
        </el-button>
      </div>
    </el-dialog>
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
        couponName: "",
        code: "",
        createUserName: "",
        couponType: "",
        startTime: "",
        endTime: "",
        status: "",
      },
      applyDate: [],
      tableData: [],
      total: 0,
      loading: false,
      labelWidth: 100,
      sendCouponDialog: false,
      sendUsers: "",
      sureSendsLoading: false,
      statusOptions: [],
      couponTypeOptions: [],
      currentCoupon: {},
    };
  },
  components: { CustomUpload },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    handelBathCreateSuccess(val) {
      setTimeout(() => {
        this.$notify({
          message: this.$t("已成功创建$个优惠券".replace("$", val)),
          type: "success",
        });
      }, 600);
      this.showBathCreateCoupons = false;
      this.search();
    },
    closeBathCreateCouponsDialog() {
      this.showBathCreateCoupons = false;
    },
    initData() {
      this.couponTypeOptions = [
        { label: this.$t("折扣券"), value: 1 },
        { label: this.$t("代金券"), value: 2 },
      ];
      this.statusOptions = [
        { label: this.$t("允许发券"), value: 1 },
        { label: this.$t("停止发券"), value: 0 },
      ];
    },
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    goCreate() {
      this.$router.push(`/operateManagement/createCoupon`);
    },
    goDetail(scopeRow) {
      this.$router.push(
        `/operateManagement/couponDetail?code=${scopeRow.code}`
      );
    },
    showDialog(scopeRow) {
      this.currentCoupon = scopeRow;
      this.sendCouponDialog = true;
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.operateManagement
        .getCouponList(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
          }
          this.loading = false;
        });
    },
    closeDialog() {
      this.sendUsers = "";
      this.sendCouponDialog = false;
    },
    sureSends() {
      this.sureSendsLoading = true;
      let str = this.sendUsers.replace(/，/gi, ",");
      let importData = str.split("\n");
      if (importData.length > Array.from(new Set(importData)).length) {
        this.$notify({
          message: "同一个用户不允许重复发券",
          type: "error",
        });
        this.sureSendsLoading = false;
        return;
      }
      let params = {
        code: this.currentCoupon.code,
        createUserId: JSON.parse(window.localStorage.getItem("userInfo")).id,
        users: importData,
      };
      this.$Api.operateManagement
        .sendCoupon(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: "发放优惠券成功",
              type: "success",
            });
            this.closeDialog();
          } else {
            if (data.data) {
              importData.forEach((item, index) => {
                let f = data.data.find((ite) => ite.userName === item);
                f ? (importData[index] = `${item} (${f.failReason})`) : null;
              });
              this.sendUsers = importData.join(";").replace(/\;/g, "\n");
            }
            this.$notify({
              message: data.message,
              type: "error",
            });
            // 处理某一行错误的情况
          }
          this.sureSendsLoading = false;
        });
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(
          `${new Date(this.applyDate[0]).toLocaleDateString()} 00:00`
        ).toISOString();
        this.screenData.endTime = new Date(
          `${new Date(this.applyDate[1]).toLocaleDateString()} 23:59`
        ).toISOString();
      } else {
        this.screenData.startTime = "";
        this.screenData.endTime = "";
      }
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
