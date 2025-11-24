<template>
  <div class="create-coupon-wrap">
    <div class="create-coupon-innerform">
      <el-form
        status-icon
        ref="form"
        :model="form"
        label-width="110px"
        width="300px"
        :rules="rules"
      >
        <el-form-item
          :label="$t('优惠券名称')"
          prop="couponName"
          :label-width="currentLang === 'en' ? '120px' : '110px'"
        >
          <el-input
            :placeholder="$t('请输入优惠券名称')"
            v-model="form.couponName"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('优惠码')"
          prop="code"
          :label-width="currentLang === 'en' ? '132px' : '110px'"
        >
          <el-input
            :placeholder="$t('请输入优惠码')"
            v-model="form.code"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('优惠券类型')" required>
          <el-radio-group v-model="form.couponType">
            <el-radio :label="1">{{ $t("折扣券") }}</el-radio>
            <el-radio :label="2">{{ $t("代金券") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="discount" v-if="form.couponType === 1" label="">
          <el-input style="width: 40%" v-model="form.discount"></el-input>
          <span>% OFF</span>
        </el-form-item>
        <el-form-item v-if="form.couponType === 2" label="" prop="couponAmount">
          <span>金额</span>
          <el-input style="width: 30%" v-model="form.couponAmount"></el-input>
          <el-select
            :loading="currencyOptionsLoading"
            style="width: 60%"
            v-model="form.currencyId"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currencyZh"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-if="form.couponType === 1" v-model="form.discount"></el-input><span v-if="form.couponType === 1">% OFF</span> -->
          <!-- <span v-if="form.couponType === 2">金额</span><el-input v-if="form.couponType === 2" v-model="form.couponAmount"> <el-select></el-select> -->
        </el-form-item>
        <!-- <el-form-item label="课时类型" required>
          <el-radio-group v-model="form.accountClass">
            <el-radio :label="1">标准课时</el-radio>
            <el-radio :label="2">定向课时</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item
          :label="$t('适用产品')"
          required
          prop="productId"
          :label-width="currentLang === 'en' ? '160px' : '110px'"
        >
          <el-select
            style="width: 60%"
            v-model="form.productId"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :value="item.id"
              :label="
                currentLang === 'zh' ? item.productName : item.productNameEn
              "
            >
              {{ currentLang === 'zh' ? item.productName : item.productNameEn }} （id:{{item.id}}）
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('最低充值课时')"
          prop="amount"
          :label-width="currentLang === 'en' ? '190px' : '110px'"
        >
          <el-input
            :placeholder="$t('请输入最低充值课时')"
            v-model.number="form.amount"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('最高充值课时')"
          prop="maxAmount"
          :label-width="currentLang === 'en' ? '194px' : '110px'"
        >
          <el-input
            :placeholder="$t('请输入最高充值课时')"
            v-model.number="form.maxAmount"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('有效期')" prop="applyDate">
          <el-date-picker
            v-model="form.applyDate"
            type="datetimerange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('student-info-Notes')">
          <el-input
            type="textarea"
            :placeholder="$t('请输入内容')"
            rows="7"
            v-model="form.remark"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCancel">{{ $t("取消") }}</el-button>
          <el-button
            type="primary"
            @click="onSubmit('form')"
            :loading="createLoading"
            >{{ $t("立即创建") }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "createCoupon",
  data() {
    var ruleOfCodeTest = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入数字或字母"));
      }
      return callback();
    };
    var ruleOfCouponAmountNumberTest = (rule, value, callback) => {
      if (value <= 0 || value > 999999) {
        return callback(new Error("范围0＜x≤999999"));
      } else if (value.indexOf(".") !== -1 && value.split(".")[1].length > 2) {
        return callback(new Error("最多两位小数"));
      } else if (this.form.currencyId === "" || this.form.currencyId == null) {
        return callback(new Error("请选择币种"));
      } else {
        return callback();
      }
    };
    // rules关于校验 Discount Number
    var ruleOfDiscountNumberTest = (rule, value, callback) => {
      if (value <= 0 || value > 100) {
        return callback(new Error("范围为大于0，小于等于100"));
      } else if (value.indexOf(".") !== -1 && value.split(".")[1].length > 2) {
        return callback(new Error("最多两位小数"));
      } else if (
        value.indexOf(".") !== -1 &&
        value.split(".")[1].length === 0
      ) {
        this.form.discount = `${this.form.discount}00`;
        return callback();
      } else {
        return callback();
      }
    };
    // rules关于校验Number
    var ruleOfintNumberTest = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          return callback(new Error("必须为正整数"));
        } else {
          if (value < 0) {
            return callback(new Error("必须为正整数"));
          } else {
            return callback();
          }
        }
      }, 1000);
    };
    return {
      currencyOptionsLoading: false,
      currencyList: [],
      productList: [],
      form: {
        couponName: "",
        code: "",
        couponType: 1,
        discount: "",
        currencyId: "",
        couponAmount: "",
        amount: "",
        maxAmount: "",
        validStartTime: "",
        validEndTime: "",
        remark: "",
        applyDate: [],
        productId: "",
      },
      createLoading: false,
      rules: {
        couponName: [
          { required: true, message: "请输入优惠券名称" },
          { min: 1, max: 32, message: "最短1位，最长32位" },
        ],
        code: [
          {
            required: true,
            message: "请输入优惠码，只能输入字母或数字，不区分大小写",
          },
          { min: 4, max: 20, message: "最短4位，最长20位" },
          { validator: ruleOfCodeTest },
        ],
        amount: [
          { required: true, message: "请输入最低充值课时" },
          { validator: ruleOfintNumberTest },
        ],
        productId: [{ required: true, message: "适用产品不能为空" }],
        maxAmount: [
          { required: true, message: "请输入最高充值课时" },
          { validator: ruleOfintNumberTest },
        ],
        applyDate: [{ required: true, message: "请选择有效期" }],
        discount: [
          { required: true, message: "不能为空" },
          { validator: ruleOfDiscountNumberTest, trigger: "blur" },
        ],
        couponAmount: [
          { required: true, message: "不能为空" },
          { validator: ruleOfCouponAmountNumberTest, trigger: "blur" },
        ],
      },
      spuParams: {
        all: true,
      },
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    // 提交创建优惠券
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createLoading = true;
          let {
            couponName,
            code,
            productId,
            couponType,
            discount,
            currencyId,
            couponAmount,
            amount,
            maxAmount,
            validStartTime,
            validEndTime,
            remark,
            applyDate,
          } = this.form;
          let params2 = {
            createUserId: JSON.parse(window.localStorage.getItem("userInfo"))
              .id,
            couponName,
            productId,
            code: code.toLocaleUpperCase(),
            couponType,
            currencyId,
            discount,
            couponAmount,
            amount,
            maxAmount,
            validStartTime: new Date(applyDate[0]).toISOString(),
            validEndTime: new Date(applyDate[1]).toISOString(),
            remark,
          };
          let params = {};
          for (var key in params2) {
            if (params2[key] !== "") {
              params[key] = params2[key];
            }
          }
          this.$Api.operateManagement
            .createCoupon(params)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: "创建成功",
                  type: "success",
                });
                this.$router.push(`/operateManagement/couponList`);
              } else {
                this.$notify({
                  message: data.message,
                  type: "error",
                });
              }
              this.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 取消创建优惠券
    onCancel() {
      this.$router.push(`/operateManagement/couponList`);
    },
    getRateList() {
      this.currencyOptionsLoading = true;
      this.$Api.operateManagement.getRateList().then(({ status, data }) => {
        this.currencyList = data.data;
        this.currencyOptionsLoading = false;
      });
    },
  },
  created() {
    this.getRateList();
    this.$Api.groupManagement
      .getProductSPUList(this.spuParams)
      .then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.productList = data.data;
          console.log(this.productList)
        }
      });
  },
};
</script>
<style lang="scss" scoped>
.create-coupon-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .create-coupon-innerform {
    width: 50%;
    height: 100%;
  }
}
</style>
