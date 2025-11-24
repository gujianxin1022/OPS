<template>
  <div class="order-detail">
    <el-dialog
      :before-close="close"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="showOrderDetailDialog"
      width="40%"
      center
    >
      <div
        class="detail-content"
        v-loading="loading"
      >
        <p class="content-item">
          <span class="label">{{$t('家长ID')}}: </span>
          <span class="value">{{ orderInfo.parentUserId }}</span>
        </p>
        <p class="content-item">
          <span class="label">{{$t('充值产品(SPU)')}}: </span>
          <span class="value">ID: {{orderInfo.productId}}, {{$t('名称')}}:
            {{ orderInfo.productName }}</span>
        </p>
        <p class="content-item">
          <span class="label">{{$t('充值商品(SKU)')}}: </span>
          <span class="value">ID: {{orderInfo.productPackageId}}, {{$t('名称')}}:
            {{ orderInfo.productPackageName }}</span>
        </p>
        <p class="content-item">
          <span class="label">{{$t('赠品信息')}}: </span>
        <section
          class="Multiline-value"
          v-if="orderInfo.orderGiftItemRespList && orderInfo.orderGiftItemRespList.length"
        >
          <div
            v-for="item in orderInfo.orderGiftItemRespList"
            :key="item.id"
          >
            {{
                  (item.giftType === 1 || item.giftType === 2 || item.giftType === 3)
                  ? `SKU: ${item.sku_id} ${item.skuName}`
                  : `${$t('打卡次数')}: ${item.amount ? item.amount : '--'}`
                }}
          </div>
        </section>
        </p>
        <div
          class="normal-content"
          v-if="type !== 3 && titleProp !== $t('退款') && titleProp !== $t('已退款')"
        >
          <p class="content-item">
            <span class="label">{{$t('my-home-Bonus Points')}}: </span>
            <span class="value">{{ orderInfo.incentiveAmount }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('my-home-Point Type')}}:</span>
            <span class="value">{{ orderInfo.sgClassId?'SG':$t('标准') }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付' || type === 0 || titleProp === '待支付'"
          >
            <span class="label">{{ $t('商品原价') }}:</span>
            <span class="value">{{ orderInfo.originTotalPrice }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付' || type === 0 || titleProp === '待支付'"
          >
            <span class="label">{{$t('优惠金额')}}:</span>
            <span class="value">{{ orderInfo.savePrice }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付' || type === 0 || titleProp === '待支付'"
          >
            <span class="label">{{$t('优惠码')}}:</span>
            <span class="value">{{ orderInfo.code?orderInfo.code:'无' }}</span>
          </p>
          <p
            class="content-item"
            v-if="orderInfo.taxRateId"
          >
            <span class="label">{{$t('消费税')}}: </span>
            <span class="value">{{ orderInfo.taxRateName }}</span>
          </p>
          <p
            class="content-item"
            v-if="orderInfo.taxRateId"
          >
            <span class="label">{{$t('消费税率')}}: </span>
            <span class="value">{{ orderInfo.taxRate }}%</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('支付金额')}}: </span>
            <span class="value">{{ orderInfo.totalPrice }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付'"
          >
            <span class="label">{{$t('订单编号')}}:</span>
            <span class="value">{{ orderInfo.orderNo }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('订单创建时间')}}:</span>
            <span
              class="value">{{ DateTimeUtils.dateClockTime(orderInfo.createTime) }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付'"
          >
            <span class="label">{{$t('支付成功时间')}}:</span>
            <span
              class="value">{{ DateTimeUtils.dateClockTime(orderInfo.successTime) }}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 1 || titleProp === '已支付'"
          >
            <span class="label">{{$t('支付方式')}}:</span>
            <span class="value">{{orderInfo.payType}}</span>
          </p>
          <p
            class="content-item"
            v-if="type === 5 || titleProp === '订单取消' "
          >
            <span class="label">{{$t('订单取消时间')}}:</span>
            <span
              class="value">{{ DateTimeUtils.dateClockTime( orderInfo.updateTime	) }}</span>
          </p>
        </div>
        <div v-if="type === 3 || titleProp === $t('退款') || titleProp ===$t('已退款') ">
          <p class="content-item">
            <span class="label">{{$t('退款金额')}}: </span>
            <span class="value">{{ orderInfo.refundMoney }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('币种')}}: </span>
            <span class="value">{{ orderInfo.currency }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('退款到账时间')}}: </span>
            <span
              class="value">{{ DateTimeUtils.dateClockTime( orderInfo.refundTime	) }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('本订单已消耗付费课时')}}: </span>
            <span class="value">{{ orderInfo.consumeNum }}</span>
          </p>
          <p class="content-item">
            <span class="label">{{$t('收回剩余付费课时')}}: </span>
            <span class="value">{{ orderInfo.collectionNum }}</span>
          </p>
          <div class="order-record">
            <p class="content-item-record">
              <span class="label">{{$t('my-home-Top-up Points')}}: </span>
              <span class="value">{{ orderInfo.rechargeAmount }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('my-home-Bonus Points')}}: </span>
              <span class="value">{{ orderInfo.incentiveAmount }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('my-home-Point Type')}}:</span>
              <span class="value">{{ orderInfo.sgClassId?'SG':$t('标准') }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('优惠金额')}}:</span>
              <span class="value">{{ orderInfo.savePrice }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('实付金额')}}:</span>
              <span class="value">{{ orderInfo.totalPrice }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('订单编号')}}:</span>
              <span class="value">{{ orderInfo.orderNo }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('订单创建时间')}}:</span>
              <span
                class="value">{{ DateTimeUtils.dateClockTime(orderInfo.createTime) }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('支付成功时间')}}:</span>
              <span
                class="value">{{ DateTimeUtils.dateClockTime(orderInfo.updateTime	) }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('支付方式')}}:</span>
              <!-- <span class="value">{{ orderInfo.rechargeType | rechargeTypeFilter }}</span> -->
              <span class="value">{{ orderInfo.payType }}</span>
            </p>
          </div>
        </div>
        <div
          v-if="orderInfo.taxRateLogList && orderInfo.taxRateLogList.length !== 0"
        >
          <el-divider content-position="left">消费税</el-divider>
          <div
            v-for="(item,index) in orderInfo.taxRateLogList"
            :key="index"
          >
            <p class="content-item-record">
              <span class="label">{{$t('修改前')}}:</span>
              <span
                v-if="item.taxRateNamePre"
                class="value"
              >{{ item.taxRateNamePre }}{{ item.taxRatePre }}</span>
              <span v-else>无消费税</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('修改后')}}:</span>
              <span
                v-if="item.taxRateName"
                class="value"
              >{{ item.taxRateName }}{{ item.taxRate }}</span>
              <span v-else>无消费税</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('修改时间')}}:</span>
              <span
                class="value">{{ DateTimeUtils.dateClockTime(item.updateTime) }}</span>
            </p>
            <p class="content-item-record">
              <span class="label">{{$t('修改人')}}:</span>
              <span class="value">{{ item.updateUserName }}</span>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    showOrderDetailDialog: {
      default: false,
      type: Boolean
    },
    orderDetailId: {
      default: -1,
      type: Number
    },
    type: {
      type: Number
    },
    titleProp: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      orderInfo: {},
      title: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentLang'])
  },
  watch: {
    orderDetailId (newData) {
      this.loading = true
      // 0 待支付 
      switch (this.type) {
        case 0:
          this.title = this.$t('待支付')
          break;
        case 1:
          this.title = this.$t('已支付')
          break;
        case 5:
          this.title = this.$t('已取消')
          break;
        case 3:
          this.title = this.$t('已退款')
          break;
        case -1:
          this.title = this.titleProp
          break;
        default:
          break;
      }
      this.$Api.financeManagement.getOrderDetailData(newData)
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            this.orderInfo = data.data || {}
          }
          this.loading = false
        })
    }
  },
  methods: {
    close () {
      this.$emit('closeOrderDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-content {
  .content-item {
    display: flex;
    .label {
      min-width: 98px;
      text-align: right;
      margin: 0 5px 0 0;
    }
    .value,
    .Multiline-value {
      font-weight: 600;
      flex-wrap: wrap;
    }
  }
}
.order-record {
  width: 100%;
  background-color: #f6f6f6;
  padding: 20px;
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>