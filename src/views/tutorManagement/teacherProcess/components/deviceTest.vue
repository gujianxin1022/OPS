<template>
  <el-dialog 
    :before-close="closeLastInterview"
    :close-on-click-modal="false" 
    :title="$t('设备检测')" 
    center
    :visible.sync="deviceDialogFlag">
		<el-form :model="deviceForm" :rules="deviceRules" ref="deviceForm" :label-width="currentLang === 'en' ? '190px' : '120px'" class="device-form">
      <el-form-item :label="$t('设备检测结果')" prop="isDevice">
        <el-radio-group v-model="deviceForm.isDevice">
          <el-radio :label="1">{{$t('通过')}}</el-radio>
          <el-radio :label="0">{{$t('未通过')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('设备检测备注')" prop="deviceRemark">
        <el-input
          type="textarea"
            maxlength="500"
          show-word-limit
          :rows="4"
          :placeholder="$t('glb-input')"
          v-model="deviceForm.deviceRemark">
        </el-input>
      </el-form-item>
		</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeLastInterview">{{$t('my-home-CCancel')}}</el-button>
      <el-button type="primary" @click="sure" :loading="sureLoading">{{$t('my-home-Confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    deviceDialogFlag: {
      type: Boolean,
      default: false
    },
    deviceObj: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      sureLoading: false,
      deviceForm: {
        isDevice: '',
        deviceRemark: ''
      },
      deviceRules: {
				isDevice: [{ required: true, message: '请选择设备检测结果', trigger: 'blur' }],
				deviceRemark: [{ required: true, message: '请输入设备检测备注', trigger: 'blur' }],
      }
    }
  },
  computed: {
    ...mapGetters(['currentLang'])
  },
  methods: {
    closeLastInterview() {
			this.$refs['deviceForm'].resetFields();
			this.deviceForm = this.$options.data().deviceForm
      this.$emit('closeDeviceTestDialog')
    },
    sure() {
      this.$refs['deviceForm'].validate(( valid ) => {
				if( valid ) {
          this.sureLoading = true
          this.$Api.tutorManagement.deviceTestApi(this.deviceObj.id, this.deviceForm)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.closeLastInterview()
              this.$emit('getTableData')
              this.$notify({
                message: '提交设备检测成功',
                type: 'success'
              })
            }else {
              this.$notify({
                message: data.message,
                type: 'error'
              })
            }
          this.sureLoading = false
          })
				}else {
					this.$notify({
						message: this.$t('缺少必填项'),
						type: 'warning'
					})
				}
			})
    }
  }
}
</script>