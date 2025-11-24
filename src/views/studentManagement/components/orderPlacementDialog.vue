<template>
  <div class="order-placement-dialog">
    <el-dialog
      :title="$t('代下单-添加订单')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="handleClose"
      center
      width="1200px"
      top="5vh"
    >
      <div class="order-contain">
        <el-form
          :inline="true"
          ref="form"
          :model="form"
          :rules="rules"
          :label-width="isEn ? '200px' : '120px'"
          :disabled="isDisabled"
        >
          <el-form-item prop="studentUserId" :label="$t('选择学员')">
            <el-select
              :disabled="isUpgradeOrder"
              v-model="form.studentUserId"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in listData.studentList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item :label="$t('学科')" prop="subjectTypeId">
            <el-radio
              :disabled="isUpgradeOrder"
              v-for="item in listData.subjectTypeList"
              :key="item.typeCode"
              v-model="form.subjectTypeId"
              :label="item.typeCode"
              border
              @change="getQueryList"
              size="mini"
              >{{ !isEn ? item.typeNameCn : item.typeNameEn }}</el-radio
            >
          </el-form-item>
          <br />
          <el-form-item :label="$t('交易 - 上课形态')" prop="classTypeId">
            <el-radio
              :disabled="isUpgradeOrder"
              v-for="item in listData.classTypeList"
              :key="item.typeCode"
              v-model="form.classTypeId"
              :label="item.typeCode"
              border
              size="mini"
              @change="getQueryList"
              >{{ !isEn ? item.typeNameCn : item.typeNameEn }}</el-radio
            >
          </el-form-item>
          <br />
          <el-form-item :label="$t('课程时间')" prop="classTypeId">
            <el-radio
              :disabled="isUpgradeOrder"
              v-for="item in listData.classDurationList"
              :key="item.value"
              v-model="form.classDuration"
              :label="item.value"
              border
              size="mini"
              @change="getQueryList"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
          <br />
          <el-form-item prop="productId" :label="`${$t('选择产品')}(SPU)`">
            <el-select
              filterable
              :disabled="
                form.subjectTypeId === '' ||
                form.courseTypeId === '' ||
                form.classTypeId === '' ||
                form.classDuration === '' ||
                isUpgradeOrder
              "
              v-model="form.productId"
              :placeholder="$t('请选择')"
              @change="changeProduct"
            >
              <el-option
                v-for="item in listData.productList"
                :key="item.id"
                :label="isEn ? item.enName : item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item
            class="packageId"
            :label="`${$t('选择商品')}(SKU)`"
            prop="packageId"
          >
            <div
              class="search-warp"
              :style="'left:' + (isEn ? 200 : 120) + 'px'"
            >
              <el-input
                v-model="searchState.skuAmount"
                style="width: 120px"
                :placeholder="$t('SKU课时数')"
                clearable
              ></el-input>
              <el-input
                v-model="searchState.skuName"
                clearable
                style="width: 120px"
                :placeholder="$t('SKU名称')"
              ></el-input>
              <el-button @click="search" type="primary">{{
                $t("搜索")
              }}</el-button>
            </div>
            <el-table
              class="mt20"
              :data="resultSKUTable"
              v-loading="flagState.SKUTableDataLoading"
              max-height="300"
              border
              style="width: 1150px"
              header-cell-class-name="table_header_class"
            >
              <el-table-column
                v-for="item in SKUTableColumns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'radio'">
                    <el-radio
                      v-model="scope.row[item.prop]"
                      @change="handleRowChange(scope.row)"
                    />
                  </template>
                  <template v-else-if="item.prop === 'validType'">
                    {{ scope.row.validityTime || "--"
                    }}{{ changeValidityType(scope.row.validityType) }}
                  </template>
                  <template v-else-if="item.prop === 'subscribeCycle'">
                    {{ scope.row.subscribeCycle || "--"
                    }}{{
                      changeSubscribeCycleUnitType(scope.row.subscribeCycleUnit)
                    }}
                  </template>
                  <template v-else-if="item.prop === 'appShow'">
                    {{ getAppShow(scope.row.validityTime) }}
                  </template>
                  <template v-else-if="item.prop === 'expireType'">
                    {{ $t(expireTypeMap[scope.row.expireType]) }}
                  </template>
                  <template v-else>
                    <span class="text-wrap">
                      {{
                        scope.row[item.prop] === null ||
                        scope.row[item.prop] === undefined ||
                        scope.row[item.prop] === "" ||
                        scope.row[item.prop] === 0
                          ? "--"
                          : scope.row[item.prop]
                      }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <br />
          <el-form-item
            v-if="curSku.buyMultiple === 1 && !isUpgradeOrder"
            prop="buyNum"
            :label="$t('购买数量')"
          >
            <el-input-number
              :min="1"
              :max="999"
              v-model="form.buyNum"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
          <br />
          <el-form-item prop="currencyId" :label="$t('选择币种')">
            <el-radio-group v-model="form.currencyId">
              <el-radio
                @change="getChooseCurrency(item)"
                v-for="item in listData.currencyList"
                :key="item.id"
                :label="item.id"
                :disabled="item.disabled"
                >{{ isEn ? item.currency : item.currencyZh }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <br />
          <el-form-item prop="currencyId" :label="$t('是否使用优惠券')">
            <el-radio-group v-model="form.useCoupon">
              <el-radio
                @change="changeUseCoupon"
                v-for="item in listData.useCouponOptions"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="couponCode" :label="$t('选择优惠券')">
            <el-select
              :disabled="!form.useCoupon"
              clearable
              @change="previewOrderData = {}"
              v-model="form.couponCode"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in listData.couponList"
                :key="item.code"
                :label="item.myLable"
                :disabled="item.isAvailable == 0"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('添加优惠券')">
            <el-input
              :disabled="!form.useCoupon"
              :placeholder="$t('请输入要添加的优惠码')"
              v-model="addCouponCode"
              class="input-with-select"
            >
              <el-button
                :disabled="!form.useCoupon || !addCouponCode"
                slot="append"
                @click="reqAddCouponCode"
                icon="el-icon-circle-plus"
              ></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="taxRateId" :label="$t('是否有消费税')">
            <el-select v-model="form.taxRateId" :placeholder="$t('请选择')">
              <el-option
                v-for="item in listData.gstOptionsList"
                :key="item.id"
                :label="item.realname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item prop="isDelay" :label="$t('支付类型')">
            <el-radio-group
              style="vertical-align: middle; padding-top: 4px"
              v-model="form.isDelay"
            >
              <el-radio style="line-height: 26px" :label="1"
                >{{ $t("普通支付") }}
                <span class="icon-list">
                  <img
                    src="../../../assets/payment/icon_zhifubao_small@2x.png"
                    alt=""
                  />
                  <img
                    src="../../../assets/payment/icon_weixin_small@2x.png"
                    alt=""
                  />
                  <img
                    src="../../../assets/payment/Union pay icon (银联)@2x.png"
                    alt=""
                  />
                  <img src="../../../assets/payment/card@2x.png" alt="" />
                  <img src="../../../assets/payment/paynow@2x.png" alt="" />
                  <img src="../../../assets/payment/ACH@2x.png" alt="" />
                </span>
                <br v-show="isEn" />
                <span
                  >({{
                    $t("订单有效期为1小时，不同币种支持的支付方式不同")
                  }})</span
                >
              </el-radio>
              <br />
              <br />
              <el-radio
                style="line-height: 26px"
                :label="0"
                :disabled="form.currencyId === 19 || form.currencyId === 20"
                >{{ $t("银行转账") }}
                <span class="icon-list">
                  <img src="../../../assets/payment/bank@2x.png" alt="" />
                  <img src="../../../assets/payment/unnamed.png" alt="" />
                </span>
                <br v-show="isEn" />
                <span
                  >({{
                    $t(
                      "订单有效期为10天；Zelle仅美国银行可用；下单后在待支付可查看转账信息"
                    )
                  }})</span
                >
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 订单预览 -->
        <el-button
          :loading="loadingState.previewLoading"
          @click="handlePreviewOrder"
          :disabled="isDisabled"
          icon="el-icon-s-order"
          >{{ $t("预览订单") }}</el-button
        >
        <div class="preview-warp" v-if="previewOrderData.rechargeAmount">
          <div>
            <p v-if="previewOrderData.supportSubscribe === 1">
              <span>{{ $t("购买课时数") }}：</span>
              <span
                >{{ previewOrderData.rechargeAmount }}
                {{ previewOrderData.cycleUnitCommon }}</span
              >
            </p>
            <p v-else>
              <span>{{ $t("购买课时数") }}：</span>
              <span>{{ previewOrderData.rechargeAmount }}</span>
            </p>
          </div>
          <p>
            <span>{{ $t("课时到期日") }}：</span>
            <span>
              <span v-if="previewOrderData.expiresAt">{{
                DateTimeUtils.dateClockTime(previewOrderData.expiresAt)
              }}</span>
              <span v-else>-</span></span
            >
          </p>
          <p>
            <span>{{ $t("赠品") }}：</span>
            <span>
              <Gifts
                style="vertical-align: top"
                v-if="previewOrderData.activityPolicyRespList"
                :listData="previewOrderData.activityPolicyRespList"
              />
              <span v-else>-</span></span
            >
          </p>

          <p>
            <span>{{ $t("原价") }}：</span>
            <span
              >{{ previewOrderData.originTotalPrice || "-" }}
              {{ previewOrderData.currency }}</span
            >
          </p>
          <p
            v-if="
              previewOrderData.couponCode &&
              previewOrderData.couponCode.length > 0 &&
              previewOrderData.couponType === 1
            "
          >
            <span>{{ $t("折扣比例") }}：</span>
            <!-- 折扣券 -->
            <span>{{ previewOrderData.discount || "-" }} %</span>
            <!-- 代金券 -->
            <!-- <span v-if="previewOrderData.couponType === 2"
              >{{ previewOrderData.couponAmount || "-" }}
              {{ previewOrderData.currency }}</span
            > -->
          </p>

          <p>
            <span>{{ $t("优惠金额") }}：</span>
            <span
              >{{ previewOrderData.savePrice || "-" }}
              {{ previewOrderData.currency }}</span
            >
          </p>
          <p>
            <span>{{ $t("消费税") }}：</span>
            <span
              >{{ previewOrderData.taxFee || "-" }}
              {{ previewOrderData.currency }}</span
            >
          </p>
          <p>
            <span>{{ $t("应付金额") }}：</span>
            <span
              >{{ previewOrderData.totalPrice || "-" }}
              {{ previewOrderData.currency }}</span
            >
          </p>
        </div>
        <p class="text-wrap">
          {{
            $t(
              "注：请先与用户确定支付类型，创建订单后会邮件通知用户，所有信息都不能修改。请在有效期内完成支付。"
            )
          }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="isDisabled"
          type="primary"
          @click="handelSubmitOrder"
          :loading="loadingState.submitLoading"
          >{{ $t("立即下单") }}</el-button
        >
      </span>
    </el-dialog>
    <TransferMethod
      :dialogVisible.sync="showTransferMethodDialog"
      :orderInfo="orderInfo"
      @handleClose="handleClose"
    />
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  unref,
  watch,
} from "@vue/composition-api";
import DateTimeUtils from "@/utils/datetime_utils";
import { deepClone } from "@/utils/handleData";
import Gifts from "./Gifts.vue";
import TransferMethod from "./TransferMethod.vue";
import { sortBy } from "lodash-es";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parentUserName: {
      type: String,
      default: "",
    },
    parentUserId: {
      type: String,
      default: "",
    },
    currOrder: {
      type: Object,
      default: null,
    },
  },
  components: { Gifts, TransferMethod },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const isDisabled = ref(false);
    watch(isEn, () => {
      initData();
    });
    const loadingState = reactive({
      previewLoading: false,
      submitLoading: false,
    });

    const SKUTableColumns = computed(() => {
      return [
        { label: "", prop: "radio", width: 50 },
        { label: root.$t("skuID"), prop: "id", width: 80 },
        { label: root.$t("代下单 - 课时数量"), prop: "amount", width: 90 },
        { label: root.$t("中文名称"), prop: "nameCn", width: 150 },
        {
          label: root.$t("英文名称"),
          prop: "nameEn",
          width: 150,
        },
        { label: root.$t("订阅周期"), prop: "subscribeCycle", width: 92 },
        { label: root.$t("有效期"), prop: "validType", width: 90 },
        {
          label: root.$t("有效期计算方式"),
          width: 120,
          prop: "expireType",
        },
        { label: root.$t("总价") + "(SGD)", prop: "SGD", width: 85 },
        { label: root.$t("总价") + "(USD)", prop: "USD", width: 85 },
        { label: root.$t("总价") + "(HKD)", prop: "HKD", width: 85 },
        { label: root.$t("总价") + "(EUR)", prop: "EUR", width: 85 },
        { label: root.$t("总价") + "(THB)", prop: "THB", width: 85 },
        { label: root.$t("总价") + "(IDR)", prop: "IDR", width: 85 },
        { label: root.$t("总价") + "(AUD)", prop: "AUD", width: 85 },
        { label: root.$t("总价") + "(CNY)", prop: "CNY", width: 85 },
        { label: root.$t("总价") + "(JPY)", prop: "JPY", width: 85 },
      ];
    });
    const form = reactive({
      studentUserId: "",
      subjectTypeId: "",
      courseTypeId: 1 /*默认写死 */,
      classTypeId: "",
      productId: "",
      currencyId: "",
      packageId: "",
      couponCode: "",
      taxRateId: -1,
      isDelay: "",
      useCoupon: 1,
      classDuration: "",
      buyNum: 1,
    });
    watch(
      () => [
        form.productId,
        form.packageId,
        chooseCurrencyName.value,
        form.taxRateId,
        form.buyNum,
      ],
      ([productId, packageId, chooseCurrencyName]) => {
        previewOrderData.value = {};
        if (!productId || !packageId || chooseCurrencyName === "") return;
        reqUserCoupon();
      },
      {
        immediate: true,
      }
    );
    const rules = ref({});
    const listData = reactive({
      studentList: [],
      subjectTypeList: [],
      packageTypeList: [],
      classTypeList: [],
      productList: [],
      SKUTableData: [],
      couponList: [],
      currencyList: [],
      gstOptionsList: [],
      useCouponOptions: [
        {
          value: 1,
          label: root.$t("是"),
        },
        {
          value: 0,
          label: root.$t("否"),
        },
      ],
      classDurationList: [
        { label: "25min", value: 25 },
        { label: "55min", value: 55 },
        { label: "90min", value: 90 },
      ],
    });
    const flagState = reactive({
      SKUTableDataLoading: false,
    });
    const initData = () => {
      rules.value = {
        studentUserId: [
          { required: true, validator: rulesFun, trigger: "change" },
        ],
        subjectTypeId: [
          { required: true, validator: rulesFun, trigger: "change" },
        ],
        classTypeId: [
          { required: true, validator: rulesFun, trigger: "change" },
        ],
        productId: [{ required: true, validator: rulesFun, trigger: "change" }],
        packageId: [{ required: true, validator: rulesFun, trigger: "none" }],
        currencyId: [
          { required: true, validator: rulesFun, trigger: "change" },
        ],
        isDelay: [{ required: true, validator: rulesFun, trigger: "change" }],
      };
    };

    const getStudentsUnderParent = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getStudentListByParentAccount(
        props.parentUserName
      );
      if (status !== 200 || code !== 200) {
        return callback(new Error(root.$t("家长账号不存在")));
      }
      listData.studentList = data.studentInfoList;
      if (listData.studentList.length === 1) {
        form.studentUserId = listData.studentList[0].id;
      }
    };
    const rulesFun = (rule, value, callback) => {
      return value === "" ? callback(new Error(root.$t("请选择"))) : callback();
    };
    /* 选择sku */
    const curSku = ref({});
    const handleRowChange = async (val) => {
      setCurrencyList(val);
      form.buyNum = 1;
      form.couponCode = "";
      curSku.value = val;
      resultSKUTable.value.forEach((item) => {
        if (item.id !== val.id) {
          item.radio = false;
        }
      });
      form.packageId = val.id;
      await refs.form.validate();
    };
    /* 修改币种展示 */
    const setCurrencyList = (row) => {
      listData.currencyList.forEach((e) => {
        e.disabled = !row[e.currency] || row[e.currency] <= 0;
      });
      form.currencyId = "";
    };

    /* 获取选择币种 */
    const chooseCurrencyName = ref("USD");
    const getChooseCurrency = (e) => {
      form.couponCode = "";
      chooseCurrencyName.value = e.currency;
      form.isDelay = "";
    };
    /* 是否使用优惠券 */
    const changeUseCoupon = (e) => {
      form.couponCode = "";
      addCouponCode.value = "";
      previewOrderData.value = {};
    };
    const getSubjectClassTypeList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getSubjectClassTypeList();
      if (status === 200 && code === 200) {
        listData.subjectTypeList = data?.subjectTypeList ?? [];
        listData.packageTypeList = data?.packageTypeList ?? [];
        if (data?.classTypeList) {
          listData.classTypeList = data.classTypeList.filter((e) => {
            return e.typeCode < 4 || e.typeCode > 6;
          });
        } else {
          listData.classTypeList = [];
        }
      }
    };
    const getQueryList = async () => {
      form.productId = "";
      form.packageId = "";
      listData.SKUTableData = [];
      listData.productList = [];
      const { subjectTypeId, courseTypeId, classTypeId, classDuration } = form;
      if (
        subjectTypeId !== "" &&
        courseTypeId !== "" &&
        classTypeId !== "" &&
        classDuration !== ""
      ) {
        let params = {
          subjectTypeId,
          courseTypeId,
          classTypeId,
          classDuration,
        };
        const {
          status,
          data: { code, data },
        } = await root.$Api.financeManagement.getSPUOptionLits(params);
        if (status === 200 && code === 200) {
          listData.productList = data;
        }
      }
    };
    const changeSubscribeCycleUnitType = (val) => {
      switch (val) {
        case 0:
          return root.$t("日");
        case 1:
          return root.$t("周");
        case 2:
          return root.$t("月");
        case 3:
          return root.$t("年");
        default:
          return "--";
      }
    };
    const changeValidityType = (val) => {
      switch (val) {
        case 0:
          return root.$t("年");
        case 1:
          return root.$t("月");
        case 2:
          return root.$t("日");
        default:
          return "--";
      }
    };
    const getAppShow = (id) => {
      switch (id) {
        case 0:
          return unref(isEn) ? "no" : "不展示";
        case 1:
          return unref(isEn) ? "yes" : "展示";
        default:
          return "--";
      }
    };
    const changeProduct = (value, skuIds) => {
      form.couponCode = "";
      let params = {
        spuId: value,
        userType: 0 /* 0: ops用户, 1: C端用户 */,
        parentUserId: props.parentUserId,
      };
      if (isUpgradeOrder.value) {
        params.upgrade = 1;
      }
      root.$Api.financeManagement
        .getSKUListBySPU(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            curSku.value = {};
            form.buyNum = 1;
            if (data) {
              data.forEach((item) => {
                item.radio = false;
                item.currencyTotalPriceList &&
                  item.currencyTotalPriceList.forEach((e) => {
                    item[e.currency] = e.totalPrice;
                  });
              });
            }
            if (skuIds && skuIds.length) {
              data = data.filter((e) => {
                return skuIds.includes(e.id);
              });
            }

            listData.SKUTableData = data ?? [];
            resultSKUTable.value = sortBy(data, "amount");
          }
        });
      form.packageId = "";
    };
    const handleClose = () => {
      emit("update:visible", false);
      emit("refreshList");
    };
    // 获取币种列表
    const reqCurrencyList = async () => {
      const data = await root.$Api.systemManagement.getCurrency();
      listData.currencyList = data;
    };
    /* 获取用户优惠券列表 */
    const reqUserCoupon = async () => {
      listData.couponList = [];
      let params = {
        parentUserId: props.parentUserId,
        productId: form.productId,
        amount: curSku.value.amount,
        productPackageId: form.packageId,
        currency: chooseCurrencyName.value,
      };
      if (curSku.value.buyMultiple === 1 && !isUpgradeOrder.value) {
        params.amount = curSku.value.amount * form.buyNum;
      }
      const res = await root.$Api.financeManagement.getAllCoupon(params);
      res.forEach((e) => {
        let labelZh =
          e.couponType === 1
            ? `折扣券-${e.discount}%-${DateTimeUtils.dateClockTime(
                e.validEndTime
              )} 失效`
            : `代金券-${e.couponAmount}${
                e.currency
              }-${DateTimeUtils.dateClockTime(e.validEndTime)} 失效`;
        let labelEn =
          e.couponType === 1
            ? `Discount-${e.discount}%-${DateTimeUtils.dateClockTime(
                e.validEndTime
              )} invalid`
            : `Voucher-${e.couponAmount}${
                e.currency
              }-${DateTimeUtils.dateClockTime(e.validEndTime)} invalid`;
        e.myLable = isEn.value ? labelEn : labelZh;
      });
      listData.couponList = res || [];
    };
    /* 获取消费税列表 */
    const getGstList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.operateManagement.getGstList(1, 100, {
        status: 1,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      data.list.forEach((item) => {
        item.realname = `${item.taxRateName} ${item.taxRate}%`;
      });
      listData.gstOptionsList = [
        { realname: root.$t("无消费税"), id: -1 },
        ...data.list,
      ];
    };
    /* 预览订单 */
    const previewOrderData = ref({});
    const handlePreviewOrder = async () => {
      await refs.form.validate();
      const params = {
        confirmBill: form.couponCode.length > 0 ? 0 : 1,
        couponCode: form.couponCode,
        currencyId: form.currencyId,
        productPackageId: form.packageId,
        rechargeAmount: curSku.value.amount,
        studentUserId: form.studentUserId,
        taxRateId: form.taxRateId,
        orderType: 1 /* ops固定传参1 */,
        useCoupon: form.useCoupon,
        buyNum: form.buyNum,
      };
      if (isUpgradeOrder.value) {
        params.upgradeOrderId = props.currOrder.orderId;
        params.upgradeType = 1;
      }
      try {
        loadingState.previewLoading = true;
        const res = await root.$Api.financeManagement.getOrderBilling(
          props.parentUserId,
          params
        );
        previewOrderData.value = res || {};
        if (params.couponCode.length <= 0 && res.couponCode?.length > 0) {
          root.$notify({
            message: root.$t("系统已为您选择最合适的优惠券"),
            type: "warning",
          });
        }
        form.couponCode = res.couponCode || "";
      } finally {
        loadingState.previewLoading = false;
      }
    };
    /* 创建订单 */
    const showTransferMethodDialog = ref(false);
    const orderInfo = ref({});
    const handelSubmitOrder = async () => {
      await refs.form.validate();
      if (Object.keys(previewOrderData.value).length <= 0) {
        root.$notify({
          message: root.$t("请先预览订单"),
          type: "warning",
        });
        return;
      }
      const params = {
        confirmBill: form.couponCode.length > 0 ? 0 : 1,
        couponCode: form.couponCode,
        currencyId: form.currencyId,
        productPackageId: form.packageId,
        rechargeAmount: curSku.value.amount,
        studentUserId: form.studentUserId,
        taxRateId: form.taxRateId,
        rechargeType: 2,
        orderType: 1 /* ops固定传参1 */,
        isDelay: form.isDelay,
        buyNum: form.buyNum,
      };
      if (isUpgradeOrder.value) {
        params.upgradeOrderId = props.currOrder.orderId;
        params.upgradeType = 1;
      }
      try {
        loadingState.submitLoading = true;
        const res = await root.$Api.financeManagement.reqCreateOrder(
          props.parentUserId,
          params
        );
        orderInfo.value = res;
        isDisabled.value = true;
        if (params.isDelay === 0) {
          /* 银行转账 */
          showTransferMethodDialog.value = true;
        } else {
          handleClose();
        }
        root.$message.success(root.$t("下单成功"));
        emit("refreshList");
      } finally {
        loadingState.submitLoading = false;
      }
    };
    /* 手动添加优惠券 */
    const addCouponCode = ref("");
    const reqAddCouponCode = async () => {
      const res = await root.$Api.financeManagement.checkCouponCode({
        parentUserId: props.parentUserId,
        code: addCouponCode.value,
      });
      root.$message.success(root.$t("添加成功"));
      if (!form.productId || !form.packageId || chooseCurrencyName.value === "")
        return;
      reqUserCoupon();
    };
    const getUpgradeOrderDetail = async () => {
      if (!props.currOrder) return;
      const { studentUserId, spuId, subjectId, duration, skuIds, classTypeId } =
        await root.$Api.financeManagement.reqUpgradeOrderDetail({
          orderId: props.currOrder.orderId,
        });
      form.studentUserId = studentUserId;
      form.subjectTypeId = subjectId;
      form.classDuration = duration;
      form.classTypeId = classTypeId;
      await getQueryList();
      form.productId = spuId;
      await changeProduct(spuId, skuIds);
    };
    const isUpgradeOrder = ref(false);
    onMounted(async () => {
      isUpgradeOrder.value = !!props.currOrder;
      await initData();
      await getStudentsUnderParent();
      await getSubjectClassTypeList();
      await reqCurrencyList();
      await getGstList();
      await getUpgradeOrderDetail();
    });
    /* sku前端搜索功能 */
    const searchState = reactive({
      skuName: "",
      skuAmount: "",
    });
    const resultSKUTable = ref([]);
    const search = () => {
      const allSkuList = deepClone(listData.SKUTableData);
      if (searchState.skuName === "" && searchState.skuAmount === "") {
        resultSKUTable.value = allSkuList;
      } else {
        if (searchState.skuName !== "" && searchState.skuAmount === "") {
          resultSKUTable.value = allSkuList.filter((e) => {
            return (
              e.nameCn.includes(searchState.skuName) ||
              e.nameEn.includes(searchState.skuName)
            );
          });
        } else if (searchState.skuName === "" && searchState.skuAmount !== "") {
          resultSKUTable.value = allSkuList.filter((e) => {
            return e.amount == searchState.skuAmount;
          });
        } else {
          resultSKUTable.value = allSkuList.filter((e) => {
            return (
              e.amount == searchState.skuAmount &&
              (e.nameCn.includes(searchState.skuName) ||
                e.nameEn.includes(searchState.skuName))
            );
          });
        }
      }
      resultSKUTable.value = sortBy(resultSKUTable.value, "amount");
    };
    return {
      isUpgradeOrder,
      isEn,
      form,
      rules,
      listData,
      flagState,
      SKUTableColumns,
      previewOrderData,
      loadingState,
      addCouponCode,
      handleClose,
      initData,
      getQueryList,
      changeProduct,
      handleRowChange,
      changeSubscribeCycleUnitType,
      getAppShow,
      changeValidityType,
      getChooseCurrency,
      changeUseCoupon,
      handlePreviewOrder,
      handelSubmitOrder,
      reqAddCouponCode,
      searchState,
      search,
      resultSKUTable,
      showTransferMethodDialog,
      orderInfo,
      isDisabled,
      expireTypeMap: {
        0: "从当前有效期结束开始计算",
        1: "课时到账时开始计算",
      },
      curSku,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-placement-dialog {
  .order-contain {
    height: calc(100% - 300px);
    overflow: scroll;
  }
  .preview-warp {
    background-color: #f4e6fd;
    padding: 10px;
    margin-top: 20px;
  }
  .icon-list {
    margin-left: 20px;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin: 0 2px;
    }
  }
  .packageId {
    position: relative;
    .search-warp {
      position: absolute;
      top: -30px;
    }
  }
}
</style>
<style lang="scss">
.order-placement-dialog {
  .el-radio--mini.is-bordered {
    margin-right: 0px;
  }
}
</style>
