<template>
    <div  class="big-group-dialog-wrapper">
    <el-dialog
    :title="$t('批量加入学生')"
    :close-on-click-modal="false"
    :visible.sync="show"
    width="720px"
    :before-close="handleClose">
      <div>
        <p>{{$t('请先将Excel导出为CSV格式，字段间英文逗号隔开。再将CSV中的内容粘贴到下方输入框。')}}</p>
      </div>
      <div>
        <el-input
          type="textarea"
          :rows="10"
          :placeholder="$t('+6512345678,NANA,女孩,12,Arno刘-刘金同,Lucky路-路达')"
          v-model="textarea">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('my-home-CCancel')}}</el-button>
        <el-button type="primary" :loading="loading" @click="sure">{{$t('my-home-CConfirm')}}</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    groupDetailsInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      textarea: '',
      loading: false
    }
  }, 
  methods: {
    handleClose() {
      this.$emit('close')
    },
    sure() {
      this.loading = true
      this.$Api.groupManagement.bigGroupJoinStudents(this.textarea, this.groupDetailsInfo.classNo)
      .then( res => {
        if(res.data.message == 'success' && res.data.data.return_data.code == 200) {
          this.$notify({
            message: this.$t('批量加入成功'),
            type: 'success'
          })
          this.$emit('close')
          this.$emit('getGroupInfo')
          this.textarea = ''
        }else {
          this.$notify({
            message: this.$t('批量加入失败'),
            type: 'error'
          })
        }
      this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.big-group-dialog-wrapper {
  .el-dialog__body {
    padding: 10px
  }
}
</style>
