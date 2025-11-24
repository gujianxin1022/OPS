<template>
  <div class="examine-order-dialog-wrap">
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :title="showDetail ? $t('审批单') : $t('审批')"
      center
      top="5vh"
      width="72%"
      :visible.sync="show"
    >
      <div class="examin-order-inner">
        <div class="top-content">
          <el-form
            :model="orderInfo"
            :label-width="currentLang === 'en' ? '180px' : '120px'"
          >
            <el-form-item :label="$t('家长ID')">
              <span>{{ orderInfo.parentUserId || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('充值产品(SPU)')">
              <span>{{ orderInfo.productName || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('一级支付渠道')">
              <span>{{ orderInfo.rechargeChannel || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('消费税')">
              <span v-if="orderInfo.financeTaxRateResp"
                >{{ orderInfo.financeTaxRateResp.taxRateName }}
                {{ `${orderInfo.financeTaxRateResp.taxRate}%` }}</span
              >
              <span v-else>--</span>
            </el-form-item>
            <el-form-item :label="$t('减收金额')">
              <span>{{ orderInfo.reductionAmount || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('增收金额')">
              <span>{{ orderInfo.increaseAmount || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('实收金额')">
              <span
                >{{ orderInfo.totalPrice || "--" }}
                {{ orderInfo.currency }}</span
              >
            </el-form-item>
          </el-form>
          <el-form
            :model="orderInfo"
            :label-width="currentLang === 'en' ? '180px' : '120px'"
          >
            <el-form-item :label="$t('学生姓名')">
              <span>{{ orderInfo.studentUserName || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('充值商品(SKU)')">
              <span>{{ orderInfo.rechargeAmount || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('二级支付渠道')">
              <span>{{ orderInfo.payType || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('优惠码')">
              <span>{{ orderInfo.code || "--" }} </span>
            </el-form-item>
            <el-form-item :label="$t('减收原因')">
              <span>{{ orderInfo.reductionReason || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('增收原因')">
              <span>{{ orderInfo.increaseReason || "--" }}</span>
            </el-form-item>
            <el-form-item :label="$t('收据链接')">
              <span>{{ orderInfo.receiptUrl || "--" }}</span>
            </el-form-item>
          </el-form>
          <el-form
            :model="orderInfo"
            :label-width="currentLang === 'en' ? '180px' : '120px'"
          >
            <el-form-item :label="$t('订单创建时间')">
              <span>{{
                DateTimeUtils.dateClockTime(orderInfo.createTime)
              }}</span>
            </el-form-item>
            <el-form-item :label="$t('支付成功时间')">
              <span>{{
                DateTimeUtils.dateClockTime(orderInfo.rechargeDate)
              }}</span>
            </el-form-item>
            <el-form-item :label="$t('Payment ID')">
              <span>{{ orderInfo.reference || "--" }}</span>
            </el-form-item>
          </el-form>
        </div>
        <mian class="el-form-item el-form-item--small">
          <label
            class="el-form-item__label"
            :style="[{ width: currentLang === 'en' ? '155px' : '120px' }]"
            >{{ $t("支付凭证") }}</label
          >
          <section
            v-if="
              orderInfo.paymentVoucherPathList &&
              orderInfo.paymentVoucherPathList.length
            "
            class="img_list"
          >
            <div
              class="img_box"
              v-for="(item, index) in orderInfo.paymentVoucherPathList"
              :key="index"
            >
              <el-image
                style="width: 80px; height: 80px"
                :src="item"
                fit="contain"
                :preview-src-list="[item]"
              />
            </div>
          </section>
          <span v-else class="el-form-item__content">--</span>
        </mian>
        <mian class="el-form-item el-form-item--small">
          <label
            class="el-form-item__label"
            :style="[{ width: currentLang === 'en' ? '155px' : '120px' }]"
            >{{ $t("赠品") }}</label
          >
          <section
            v-if="
              orderInfo.activityPolicyRespList &&
              orderInfo.activityPolicyRespList.length
            "
            class="img_list"
          >
            <Gifts :listData="orderInfo.activityPolicyRespList" />
          </section>
          <span v-else class="el-form-item__content">--</span>
        </mian>
        <div v-if="referenceAdditions.length">
          <el-divider>{{ $t("补充流水") }}</el-divider>
          <div v-for="item in referenceAdditions">
            <el-form
              :inline="true"
              :label-width="currentLang === 'en' ? '180px' : '120px'"
            >
              <el-form-item :label="$t('一级支付渠道')">
                <span>{{ item.rechargeChannel || "--" }}</span>
              </el-form-item>
              <el-form-item :label="$t('二级支付渠道')">
                <span>{{ item.paymentType || "--" }}</span>
              </el-form-item>
              <el-form-item :label="$t('PaymentID')">
                <span>{{ item.reference || "--" }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-divider><i class="el-icon-document"></i></el-divider>
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            :label-width="currentLang === 'en' ? '155px' : '100px'"
            :rules="rules"
          >
            <el-form-item prop="status" :label="$t('审批结论')">
              <el-radio-group v-model="form.status">
                <el-radio :disabled="showDetail" :label="3">{{
                  $t("通过")
                }}</el-radio>
                <el-radio :disabled="showDetail" :label="2">{{
                  $t("驳回")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="advice" :label="$t('审批意见')">
              <el-input
                type="textarea"
                rows="6"
                :placeholder="$t('请输入')"
                v-model="form.advice"
                maxlength="500"
                show-word-limit
                :disabled="showDetail"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span v-if="!showDetail" slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t("取消") }}</el-button>
        <el-button @click="sure" :loading="loading" type="primary">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Gifts from "@/views/studentManagement/components/Gifts.vue";
export default {
  props: {
    show: { type: Boolean, default: false },
    orderInfo: { type: Object, default: () => ({}) },
    showDetail: { type: Boolean, default: false },
  },
  components: { Gifts },
  data() {
    let testRemarkLength = (rule, value, callback) => {
      if (value.length < 10) {
        callback(new Error("最少10个字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        status: 3,
        advice: "",
      },
      rules: {},
      loading: false,
      testRemarkLength,
      referenceAdditions: [],
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    initData() {
      this.rules = {
        status: [
          { required: true, message: this.$t("请选择"), trigger: "blur" },
        ],
      };
      this.showDetail
        ? (this.form = {
            status: this.orderInfo.status,
            advice: this.orderInfo.remark,
          })
        : (this.form = {});
      if (this.orderInfo.referenceAdditions) {
        this.referenceAdditions = JSON.parse(this.orderInfo.referenceAdditions);
      }
    },
    close() {
      this.form = this.$options.data().form;
      this.$emit("close");
    },
    sure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let { manualOrderId } = this.orderInfo;
          let params = {
            examineStatus: this.form.status,
            manualOrderId,
            remark: this.form.advice,
          };
          this.$Api.financeManagement
            .examineManualPaymentOrder(params)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("操作成功"),
                  type: "success",
                });
                this.$emit("getTableData");
                this.close();
              }
              this.loading = false;
            });
        }
      });
    },
  },
  created() {
    this.initData();
    console.log(this.orderInfo);
  },
};
</script>
<style lang="scss" scoped>
.examin-order-inner {
  width: 100%;
  height: 100%;

  .top-content {
    width: 100%;
    display: flex;
  }
}
.img_list {
  display: flex;
  flex-wrap: wrap;
  .img_box {
    width: 80px;
    height: 80px;
    margin: 10px 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($color: #000000, $alpha: 0.3);
  }
}
</style>
