<template>
  <div
    class="coupon-list-detail"
    v-loading="warpLoading"
  >
    <div class="stop-wrap">
      <el-button
        @click="handleStope"
        v-if="detailData.status !== 0"
      >停止兑换</el-button>
    </div>
    <ul>
      <li>
        <span class="label">{{$t('优惠券名称')}}</span>
        <span class="value">{{ detailData.couponName }}</span>
      </li>
      <li>
        <span
          class="label"
          :style="{width:currentLang === 'en'? '130px':'100px'}"
        >{{$t('优惠码')}}</span>
        <span class="value">{{ detailData.code }}</span>
      </li>
      <li>
        <span class="label">{{$t('优惠券类型')}}</span>
        <span
          class="value">{{ detailData.couponType | couponTypeFilters }}</span>
        <span v-if="detailData.couponType == 1">{{ detailData.discount }}%
          OFF</span>
        <span
          v-if="detailData.couponType == 2">{{ detailData.couponAmount }}{{detailData.currency}}</span>
      </li>
      <li>
        <span class="label">{{$t('使用产品')}}</span>
        <span class="value">{{ detailData.productName }}</span>
      </li>
      <li>
        <span
          class="label"
          :style="{width:currentLang === 'en'? '170px':'100px'}"
        >{{$t('最低充值课时')}}</span>
        <span class="value">{{ detailData.amount }}</span>
      </li>
      <li>
        <span
          class="label"
          :style="{width:currentLang === 'en'? '178px':'100px'}"
        >{{$t('最高充值课时')}}</span>
        <span class="value">{{ detailData.maxAmount }}</span>
      </li>
      <li>
        <span class="label">{{$t('有效期')}}</span>
        <span class="value">
          <span>{{ DateTimeUtils.dateClockTime(detailData.validStartTime) }}</span>
          <span>-</span>
          <span>{{ DateTimeUtils.dateClockTime(detailData.validEndTime) }}</span>
        </span>
      </li>
      <li>
        <span class="label">{{$t('student-info-Notes')}}</span>
        <span class="value">{{ detailData.remark }}</span>
      </li>
      <li>
        <span class="label">{{$t('创建人')}}</span>
        <span class="value">{{ detailData.createUserName }}</span>
      </li>
      <li>
        <span
          class="label"
          :style="{width:currentLang === 'en'? '170px':'100px'}"
        >{{$t('创建时间')}}</span>
        <span
          class="value">{{ DateTimeUtils.dateClockTime(detailData.createTime) }}</span>
      </li>
      <li>
        <span class="label">{{$t('最近修改人')}}</span>
        <span class="value">{{ detailData.update_user_name }}</span>
      </li>
      <li>
        <span class="label">{{$t('最近修改时间')}}</span>
        <span class="value">{{ detailData.update_time }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'couponDetail',
  data () {
    return {
      detailData: {},
      warpLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ])
  },
  methods: {
    handleStope () {
      this.$confirm('一旦停止兑换，将无法向用户发放该券，用户也无法主动兑换该券。已经发放或兑换的券不受影响。确定停止兑换吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Api.operateManagement.stopTheCoupon(
          this.$route.query.code,
          JSON.parse(window.localStorage.getItem('userInfo')).id
        )
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              this.$notify({
                message: '停用成功',
                type: 'success'
              })
              this.getDetailsData()
            }
          })
      })
    },
    getDetailsData () {
      this.warpLoading = true
      this.$Api.operateManagement.getCouponDetail(this.$route.query.code)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.detailData = data.data
          }
          this.warpLoading = false
        })
    }
  },
  created () {
    this.getDetailsData()
  }
}
</script>
<style lang="scss" scoped>
.coupon-list-detail {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  font-size: 15px;
  position: relative;
  .stop-wrap {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin: 20px 0;
      .label {
        display: inline-block;
        width: 100px;
        text-align: left;
      }
    }
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>