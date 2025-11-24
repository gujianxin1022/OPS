<template>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="closeWithdrawu"
      :title="$t('确定撤回')"
      :visible.sync="showWithdrawu"
      width="30%"
      center>
      <div class="withdrawu-context">
        <p>{{$t('确定撤回本报告吗？', {reportType: reportType == 'unit'?$t('报告'):$t('反馈')})}}</p>
        <p>{{$t('撤回的报告将进入到待审核状态', {reportType: reportType == 'unit'?$t('报告'):$t('反馈')})}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeWithdrawu">{{$t('取消')}}</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="sureWithdrawReport"
        >{{$t('my-home-Confirm')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {
  props: {
    showWithdrawu: {
      type: Boolean,
      default: false
    },
    withdrawuData: {
      type: Object,
      default: () => {}
    },
    reportType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    closeWithdrawu() {
      this.$emit('closeWithdrawu')
    },
    sureWithdrawReport() {
      this.loading = true
      let { id, firstReportId } = this.withdrawuData
      if( this.reportType === 'unit' ) {
        // 点开的是单元报告
        this.$Api.unitReportManagement.withdrawUnitReport( id )
        .then(({ status, data }) => {
          if( data.code == 200 ) {
            this.$notify({
              message: this.$t('已撤回到待提交列表'),
              type: 'success'
            })
          }else {
            this.$notify({
              message: this.$t('撤回失败'),
              type: 'error'
            })
          }
          this.loading = false
          this.closeWithdrawu()
        this.$emit('getUnitReportList')
        })
      } else if ( this.reportType === 'first' ) {
        // 点开的是首课反馈
        this.$Api.unitReportManagement.withdrawFirstClass( firstReportId )
        .then(({ status, data }) => {
          if( data.code === 200 ) {
            this.$notify({
              message: this.$t('已撤回到待提交列表'),
              type: 'success'
            })
          } else {
            this.$notify({
              message: this.$t('撤回失败'),
              type: 'error'
            })
          }
        })
        this.loading = false
        this.closeWithdrawu()
        this.$emit('getFirstClassList')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.withdrawu-context {
  width: 100%;
  text-align: center;
}
</style>