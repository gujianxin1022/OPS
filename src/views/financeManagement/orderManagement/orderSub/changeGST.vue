<template>
  <div class="change-gst-wrap">
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :title="$t('消费税')"
      center
      :visible.sync="showChangeGst">
      <el-form :model="currentGstInfo" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item :label="$t('订单编号')" prop="name">
          {{ currentGstInfo.orderNo }}
        </el-form-item>
        <el-form-item :label="$t('订单创建时间')" prop="num">
          {{ DateTimeUtils.dateClockTime(currentGstInfo.createTime) }}
        </el-form-item>
        <el-form-item :label="$t('家长账号')" prop="startTime">
          {{ currentGstInfo.parentUsername }}
        </el-form-item>
        <el-form-item :label="$t('充值产品')" prop="country">
          {{ currentGstInfo.productName }}
        </el-form-item>
        <el-form-item :label="$t('充值课包')" prop="rules">
          {{ currentGstInfo.productPackageName }}
        </el-form-item>
        <el-form-item :label="$t('课程顾问')" prop="abc">
          {{ currentGstInfo.adviserUsername }}
        </el-form-item>
        <el-form-item :label="$t('学管老师')" prop="country">
          {{ currentGstInfo.xgUserName }}
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item :label="$t('消费税')" prop="gstId">
          <el-select v-model="gstId" :placeholder="$t('请选择')">
            <el-option
              v-for="item in gstOptions"
              :key="item.id"
              :label="item.realname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="handleSure">{{$t('确定修改')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    showChangeGst: {
      type: Boolean,
      default: false
    },
    currentGstInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      gstOptions: [
        { label: '无消费税', value: 1 }
      ],
      gstId: ''
    }
  },
  watch: {
    showChangeGst(newData) {
      if( newData ) {
        this.getGstList()
      }
    }
  },
  methods: {
    close() {
      this.$emit('closeChangeGst')
    },
    handleSure() {
      let orderId = this.currentGstInfo.id,
          params = {
            taxRateId: this.gstId
          }
      this.$Api.financeManagement.changeTheOrderGST( orderId, params )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.$notify({
            message: '修改消费税成功',
            type: 'success'
          })
          this.$emit('getData')
          this.close()
        }
      })
    },
    getGstList() {
      let searchTime = this.currentGstInfo.createTime, status = 1
      this.$Api.operateManagement.getGstList( 1, 100, { searchTime, status } )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          data.data.list.forEach( item => {
            item.realname = `${item.taxRateName} ${item.taxRate}%`
          })
          this.gstOptions = [{ realname: '无消费税', id: -1 }, ...data.data.list]
        }
      })
    }
  }
}
</script>
