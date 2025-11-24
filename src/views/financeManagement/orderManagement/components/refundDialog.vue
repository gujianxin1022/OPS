<template>
  <div>
    <el-dialog
      :title="
        orderStatus === order_status.paymentDone
          ? $t('申请退款')
          : $t('退款详情')
      "
      :visible.sync="visible"
      top="5vh"
      width="80%"
      close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="order_box" v-loading="refundDialogLoading">
        <section>
          <mian class="info-content">
            <dl
              v-for="(item, index) in orderInfo"
              :key="index"
              class="info-box"
            >
              <dt>{{ item.label }}:</dt>
              <!-- v-if="item.key !== 'giftMsg'" -->
              <dd>
                {{ item.value }}
                <!-- currency 用来判断是否需要展示货币字段 -->
                <span v-if="item.currency">（{{ orderObj.currency }}）</span>
              </dd>
              <!-- <dd v-else>{{`课时: ${item.aaa}/积分: ${item.bbb}`}}</dd> -->
            </dl>
          </mian>
          <footer>
            <dt class="table-title">
              {{ $t("订单关联剩余课时") }}: （{{
                $t("退款审批通过之后将被扣除")
              }}）
            </dt>
            <el-table
              :data="
                orderStatus === order_status.paymentDone
                  ? orderObj.accountBalances
                  : orderObj.deductOrderAccountsBalances
              "
              border
              style="width: 600px"
            >
              <el-table-column
                v-for="item in accountBalancesTableColumn"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="item.prop === 'type'">
                    {{ Constants.classTypeMap[scope.row.type] }}
                  </span>
                  <span v-else>
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </footer>
        </section>
        <hr />
        <section>
          <div>
            <span>{{ $t("补充其他扣除信息") }}</span>
            <dl>
              <span>{{ $t("退款 - 积分") }}: </span>
              <span v-if="orderStatus === order_status.paymentDone">
                {{ $t("账户积分") }}: {{ orderObj.coinPoints }},
                {{ $t("申请扣除积分") }}:
                <el-input
                  style="width: 200px"
                  v-model="formData.deductCoinPoints"
                  :placeholder="$t('请输入')"
                  @input="
                    formData.deductCoinPoints =
                      formData.deductCoinPoints.replace(/[^\d]|^[0]/g, '')
                  "
                />
              </span>
              <span v-else>
                {{ $t("扣除积分") }}: {{ formData.deductCoinPoints }}
              </span>
            </dl>
            <dl>
              <span>{{ $t("退款 - 打卡次数") }}: </span>
              <span v-if="orderStatus === order_status.paymentDone">
                {{ $t("退款 - 剩余打卡次数") }}: {{ orderObj.clockTimes }},
                {{ $t("申请扣除次数") }}:
                <el-input
                  style="width: 200px"
                  v-model="formData.deductClockTimes"
                  :placeholder="$t('请输入')"
                  @input="
                    formData.deductClockTimes =
                      formData.deductClockTimes.replace(/[^\d]|^[0]/g, '')
                  "
                />
              </span>
              <span v-else>
                {{ $t("扣除次数") }}: {{ formData.deductClockTimes }}
              </span>
            </dl>
          </div>
          <template>
            <span class="class_hour_title">{{ $t("课时") }}: </span>
            <!-- !refundDialogLoading: 用来控制组件的加载时间，当订单信息接口请求完成在加载该组件 -->
            <ClassHourList
              v-if="
                orderStatus === order_status.paymentDone && !refundDialogLoading
              "
              :clssHourArray="clssHourArray"
              :parentUserId="orderObj.parentUserId"
            />
            <el-table
              v-else
              :data="deductionClssHour"
              border
              style="width: 600px"
            >
              <el-table-column
                v-for="item in classHourTableColumn"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                align="center"
              />
            </el-table>
          </template>
        </section>
        <hr />
        <section>
          <div class="calculation_box">
            <div>
              <span>{{ $t("实际消耗课时") }}: </span>
              <el-input
                style="width: 150px"
                v-model="formData.consumptionAmount"
                :disabled="orderStatus === order_status.refunded"
                :placeholder="$t('请输入')"
                @input="
                  (value) => {
                    let newValue = value;
                    newValue = newValue.replace(/[^\d.]/g, '');
                    newValue = newValue.replace(/^\./g, '');
                    newValue = newValue.replace(/\.{2,}/g, '.');
                    newValue = newValue
                      .replace('.', '$#$')
                      .replace(/\./g, '')
                      .replace('$#$', '.');
                    newValue = newValue.replace(
                      /^(\-)*(\d+)\.(\d\d).*$/,
                      '$1$2.$3'
                    );
                    formData.consumptionAmount = newValue;
                  }
                "
              />
            </div>
            <div>
              <span>{{ $t("实际退费金额") }}: </span>
              <el-input
                style="width: 150px"
                v-model="formData.refundAmount"
                :placeholder="$t('请输入')"
                :disabled="orderStatus === order_status.refunded"
                @input="
                  (value) => {
                    let newValue = value;
                    newValue = newValue.replace(/[^\d.]/g, '');
                    newValue = newValue.replace(/^\./g, '');
                    newValue = newValue.replace(/\.{2,}/g, '.');
                    newValue = newValue
                      .replace('.', '$#$')
                      .replace(/\./g, '')
                      .replace('$#$', '.');
                    newValue = newValue.replace(
                      /^(\-)*(\d+)\.(\d\d).*$/,
                      '$1$2.$3'
                    );
                    if (newValue > refundAmountLimit) {
                      newValue = refundAmountLimit;
                    }
                    formData.refundAmount = newValue;
                  }
                "
              />
            </div>
            <!-- <div>
              {{ $t("退款金额") }}({{ $t("不含手续费") }}):
              {{ orderFefundObj.refundMoney }}（{{ orderFefundObj.currency }}）
            </div>
            <div>
              {{ $t("退款金额") }}（{{ $t("含手续费")
              }}{{ orderFefundObj.refundFee }}）:
              {{ orderFefundObj.containsFeeRefundMoney }}（{{
                orderFefundObj.currency
              }}）
            </div> -->
          </div>
          <div class="refund_reason">
            <span class="label">{{ $t("用户退款原因") }}: </span>
            <el-input
              v-model="formData.deductReason"
              :disabled="orderStatus === order_status.refunded"
              :placeholder="$t('请输入')"
              type="textarea"
              style="width: 80%"
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </div>
          <div class="upload_file">
            <el-upload
              accept="image/jpg, image/png, image/jpeg"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="uploadImage"
              :disabled="
                imgList.length >= 10 ||
                uploadLoading ||
                orderStatus === order_status.refunded
              "
            >
              <el-button
                size="mini"
                type="primary"
                :loading="uploadLoading"
                :disabled="
                  imgList.length >= 10 ||
                  uploadLoading ||
                  orderStatus === order_status.refunded
                "
              >
                {{ $t("上传附件") }}
              </el-button>
            </el-upload>
            <section class="img_list">
              <div
                class="img_box"
                v-for="(item, index) in imgList"
                :key="index"
              >
                <!-- <img class="imgs" :src="item" /> -->
                <el-image
                  style="width: 150px; height: 150px"
                  :src="item"
                  fit="contain"
                  :preview-src-list="[item]"
                />
                <span
                  v-if="orderStatus === order_status.paymentDone"
                  class="del"
                  @click="deleteImg(index)"
                  >{{ $t("删除") }}</span
                >
              </div>
            </section>
          </div>
        </section>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="orderStatus === order_status.paymentDone"
          :disabled="
            formData.consumptionAmount === '' ||
            formData.deductReason === '' ||
            formData.refundAmount === ''
          "
          :loading="submitLoading"
          type="primary"
          @click="confirm"
        >
          {{ $t("确认退款并扣除") }}
        </el-button>
        <el-button @click="handleClose">{{ $t("关闭") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
  set,
  unref,
} from "@vue/composition-api";
import ClassHourList from "./classHourList.vue";
import { ORDER_STATUS } from "../constants";
import { uploadVideoFun } from "@/views/teacherManagement/videoResources/components/uploadVideoFun";

export default {
  props: {
    visible: { type: Boolean, default: false },
    orderStatus: { type: Number, default: -1 },
    orderId: { type: Number, default: -1 },
  },
  components: { ClassHourList },
  setup(props, { root, emit }) {
    const {
      currentLang,
      orderInfo,
      accountBalancesTableColumn,
      classHourTableColumn,
    } = constantFun(props, root);
    const order_status = ORDER_STATUS;
    const refundDialogLoading = ref(false);
    const formData = reactive({
      deductCoinPoints: "",
      deductClockTimes: "",
      consumptionAmount: "",
      deductReason: "",
      refundAmount: "",
    });
    // 接口返回数据 - 订单编号 & 关联剩余课时 & 补充其他扣除信息 的数据
    const orderObj = reactive({});
    // 退款金额
    const orderFefundObj = reactive({
      refundMoney: "--",
      containsFeeRefundMoney: "--",
      currency: "--",
      refundFee: "--",
    });
    const imgList = ref([]);
    const deductionClssHour = ref([]);

    const handleClose = () => {
      emit("update:visible", false);
    };

    const refundAmountLimit = ref(0);
    // 获取订单信息
    const getOrderInfo = async () => {
      refundDialogLoading.value = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getOrderRefund({
        orderId: props.orderId,
      });
      if (status !== 200 || code !== 200) return; //Promise.reject('接口错误');
      // 全部的订单信息和账户余额
      refundAmountLimit.value = data.totalPrice;
      Object.assign(orderObj, data);
      setOrderInfo(data);
      refundDialogLoading.value = false;
    };
    // 退款详情
    const getFefundDetail = async () => {
      refundDialogLoading.value = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.fefundDetail({
        orderId: props.orderId,
      });
      if (status !== 200 || code !== 200) return;
      setOrderInfo(data);
      Object.assign(orderObj, data);
      Object.assign(orderFefundObj, data.refundMoney);
      Object.assign(formData, {
        deductCoinPoints: data.deductCoinPoints ?? "--",
        deductClockTimes: data.deductClockTimes ?? "--",
        consumptionAmount: data.spentClassTimes ?? "--",
        refundAmount:data.refundMoney.refundMoney ?? "--",
        deductReason: data.deductReason ?? "--",
      });
      deductionClssHour.value = data?.deductOtherAccountsBalances ?? [];
      imgList.value = data?.attachmentPaths ?? [];
      refundDialogLoading.value = false;
    };
    // 处理数据 - 用作循环渲染订单信息
    const setOrderInfo = (data) => {
      orderInfo.forEach((item) => {
        Object.keys(data).forEach((key) => {
          if (unref(item.key) === key) {
            set(item, "value", data[key] ? data[key] : "--");
          }
        });
      });
    };
    // 计算退款金额
    // const getOrderFefund = async () => {
    //   await root.$Api.financeManagement
    //     .getCalculation({
    //       orderId: props.orderId,
    //       consumptionAmount: formData.consumptionAmount,
    //     })
    //     .then(({ status, data: { code, data } }) => {
    //       if (status === 200 && code === 200) {
    //         Object.assign(orderFefundObj, data);
    //       }
    //     });
    // };

    // 课时列表数组
    const clssHourArray = ref([]);

    // 图片上传校验
    const beforeImageUpload = async (file) => {
      const { validateFileType, validateFileSize } = uploadVideoFun(root);
      await validateFileType(file.name, ["jpeg", "jpg", "png"]);
      await validateFileSize(file.size, 3);
    };
    const uploadLoading = ref(false);
    const uploadImage = ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", 2); // 1-sku上传; 2-订单退款上传
      uploadLoading.value = true;
      root.$Api.systemManagement
        .uploadFileInterface(formData)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            imgList.value.push(data);
          }
        }) // 更新校验状态
        .finally(() => (uploadLoading.value = false));
    };
    // 删除图片
    const deleteImg = (index) => {
      imgList.value.splice(index, 1);
    };
    // 确认
    const submitLoading = ref(false);
    const confirm = () => {
      if (uploadLoading.value) return root.$message.error("图片上传中");
      submitLoading.value = true;
      let deductStudentInfos = [];
      clssHourArray.value.forEach((item) => {
        let itemOBJ = {
          studentUserId: item.studentUserId,
          coursePackageId: item.coursePackageId,
          deductAccountsBalances: [],
        };
        if (item?.tableData) {
          item?.tableData.forEach((itm) => {
            itemOBJ.deductAccountsBalances.push({
              balanceId: itm.id,
              deductAmount: itm.deductAmount,
            });
          });
        }
        deductStudentInfos.push(itemOBJ);
      });
      let params = {
        orderId: props.orderId,
        deductStudentInfos,
        attachmentPaths: imgList.value,
        ...formData,
      };
      root.$Api.financeManagement
        .confirmFefund(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            handleClose();
            emit("getTable");
          }
        })
        .finally(() => (submitLoading.value = false));
    };

    const initData = () => {
      props.orderStatus === order_status.paymentDone
        ? getOrderInfo()
        : getFefundDetail();
    };

    onMounted(() => {
      initData();
    });

    return {
      orderInfo,
      currentLang,
      clssHourArray,
      deductionClssHour,
      accountBalancesTableColumn,
      classHourTableColumn,
      imgList,
      order_status,
      formData,
      uploadLoading,
      orderObj,
      refundDialogLoading,
      orderFefundObj,
      handleClose,
      // getOrderFefund,
      beforeImageUpload,
      uploadImage,
      deleteImg,
      confirm,
      submitLoading,
      refundAmountLimit,
    };
  },
};

const constantFun = (props, root) => {
  const currentLang = computed(() => root.$store.getters.currentLang);
  const orderInfo = reactive([
    { label: root.$t("退款 - 订单编号"), key: "orderNo" },
    { label: root.$t("订单ID"), key: "orderId" },
    {
      label: root.$t("充值课程包（产品）"),
      key: computed(
        () =>
          `${
            currentLang.value === "zh"
              ? "coursePackageNameCn"
              : "coursePackageNameEn"
          }`
      ),
    },
    {
      label: root.$t("SKU名称"),
      key: computed(
        () => `${currentLang.value === "zh" ? "skuNameCn" : "skuNameEn"}`
      ),
    },
    { label: root.$t("充值数量"), key: "amount" },
    { label: root.$t("赠品信息"), key: "orderGift" }, // giftMsg
    { label: root.$t("家长ID"), key: "parentUserId" },
    { label: root.$t("退款 - 学生用户名"), key: "studentUserName" },
    { label: root.$t("SKU单价"), key: "unitPrice", currency: true },
    { label: root.$t("SKU原价"), key: "originTotalPrice", currency: true },
    { label: root.$t("用户实付"), key: "totalPrice", currency: true },
  ]);
  const accountBalancesTableColumn = computed(() => [
    { label: root.$t("退款 - 学生用户名"), prop: "studentName" },
    {
      label: root.$t("课时类型"),
      prop: "type",
    },
    {
      label: root.$t("课程包（产品名称）"),
      prop:
        currentLang.value === "zh"
          ? "coursePackageNameCn"
          : "coursePackageNameEn",
    },
    { label: root.$t("剩余数量"), prop: "amount" },
  ]);
  const classHourTableColumn = computed(() => [
    { label: root.$t("学生信息"), prop: "studentName" },
    {
      label: root.$t("课程包名称"),
      prop:
        currentLang.value === "zh"
          ? "coursePackageNameCn"
          : "coursePackageNameEn",
    },
    { label: root.$t("扣减课时"), prop: "amount" },
  ]);
  return {
    currentLang,
    orderInfo,
    accountBalancesTableColumn,
    classHourTableColumn,
  };
};
</script>

<style lang="scss" scoped>
.info-content {
  display: flex;
  flex-wrap: wrap;
  .info-box {
    display: flex;
    margin: 0 20px 15px 0;
    min-width: 200px;
    dt {
      font-weight: 600;
    }
    dd {
      margin: 0 0 0 10px;
    }
  }
}
.table-title {
  margin: 10px 0;
}
.calculation_box {
  display: flex;
  flex-wrap: wrap;
  & > div {
    height: 32px;
    line-height: 32px;
    margin: 0 30px 0 0;
  }
}
.class_hour_title {
  display: inline-block;
  margin: 0 0 10px;
}
.refund_reason {
  margin: 20px 0;
  & > .label {
    float: left;
    margin: 0 10px 0 0;
  }
}
.img_list {
  display: flex;
  flex-wrap: wrap;
  .img_box {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 10px 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($color: #000000, $alpha: 0.3);
    .imgs {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
    .del {
      position: absolute;
      bottom: -20px;
      &:hover {
        color: #7580e5;
        cursor: pointer;
      }
    }
  }
}
::v-deep .el-dialog {
  min-width: 850px;
  &__body {
    // min-height: 500px;
    // max-height: 650px;
    height: 600px;
    overflow: auto;
  }
}
</style>
