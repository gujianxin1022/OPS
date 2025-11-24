<template>
  <div class="">
    <el-dialog 
      :before-close="closeReasonDialog"
      :close-on-click-modal="false" 
      :title="$t('修改理由')" 
      center
      :visible.sync="dialogVisible"
    >
      <el-input
        type="textarea"
        :placeholder="$t('请输入内容，修改理由最少10个字')"
        v-model="changeReason"
        rows="10"
        maxlength="500"
        minlength="10"
        show-word-limit
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeReasonDialog">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitAndSureEdit" :loading="btnLoading">{{$t('提交并完成修改')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    btnLoading: {type: Boolean, default: false},
  },
  data() {
    return {
      changeReason: '',
      submitAndSureEditLoading: false,
    }
  },
  mounted() {},
  methods: {
    submitAndSureEdit() {
      if (this.changeReason === '') { return this.$message.error('修改理由不能为空')} 
      else if( this.changeReason.length < 10 ) { return this.$message.error('修改理由必须最少10个字')}
      this.$emit('submitEdit', this.changeReason);
    },
    // 关闭弹框
    closeReasonDialog() { 
      this.changeReason = ''
      this.$emit('update:dialogVisible', false);
    },
  },
}
</script>
<style lang='scss' scoped>
</style>
