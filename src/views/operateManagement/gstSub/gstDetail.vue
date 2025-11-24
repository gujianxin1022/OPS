<template>
  <div class="create-gst-wrap">
    <div class="create-gst-inner">
      <el-form :model="form" ref="ruleForm" :label-width="currentLang === 'en'? '164px' : '120px'" class="demo-ruleForm">
        <el-form-item :label="$t('税率名称')" prop="taxRateName">
          {{ form.taxRateName }}
        </el-form-item>
        <el-form-item :label="$t('税率')" prop="taxRate">
          {{ form.taxRate }}%
        </el-form-item>
        <el-form-item :label="$t('生效时间')" prop="validStartTime">
          {{ DateTimeUtils.dateClockTime( form.validStartTime ) }}
        </el-form-item>
        <el-form-item :label="$t('失效时间')" prop="validEndTime">
          <span v-if="!isEdit">
          {{ DateTimeUtils.dateClockTime( form.validEndTime ) }}
          </span>
          <el-date-picker
            :picker-options="pickerOptions"
            v-show="isEdit"
            v-model="form.validEndTime"
            type="datetime"
            :placeholder="$t('选择日期时间')">
          </el-date-picker>
          <el-button type="text" v-if="!isEdit && form.status !== 2" @click="isEdit = true">{{$t('修改失效时间')}}</el-button>
          <el-button type="text" v-if="isEdit" @click="cancelSubmit">{{$t('取消')}}</el-button>
          <el-button type="text" v-if="isEdit" @click="submitForm('ruleForm')">{{$t('确定修改')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('征税用户所在地')" prop="countryNameZh">
          {{ form.countryNameZh }}
        </el-form-item>
        <el-form-item :label="$t('status')" prop="country">
          {{ form.status | validStatusGstFilter }}
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item :label="$t('创建人')" prop="country">
          {{ form.createUserName }}
        </el-form-item>
        <el-form-item :label="$t('创建时间')" prop="country">
          {{ DateTimeUtils.dateClockTime( form.createTime ) }}
        </el-form-item>
        <el-form-item v-if="form.updateUserName" :label="$t('最近修改人')" prop="country">
          {{ form.updateUserName }}
        </el-form-item>
        <el-form-item v-if="form.updateTime" :label="$t('最近修改时间')" prop="country">
          {{ DateTimeUtils.dateClockTime( form.updateTime ) }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'gstDetail',
  data () {
    return {
      form: {
        taxRateName: '',
        taxRate: '',
        validStartTime: '',
        validEndTime: '',
        countryNameZh: ''
      },
      remberEndTime: '',
      isEdit: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ]),
    taxRateId() {
      return this.$route.query.taxRateId
    }
  },
  methods: {
    cancelSubmit() {
      this.form.validEndTime = this.remberEndTime
      this.isEdit = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let taxRateId = this.taxRateId,
              params = {
                validEndTime: this.form.validEndTime
              }
          this.$Api.operateManagement.editGst( taxRateId, params )
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$notify({
                type: 'success',
                message: '修改成功'
              })
              this.isEdit = false
              this.getGstInfo()
            }
          })
        } else {
          this.$notify({
            type: 'error',
            message: '请将必填项填写完整后重新提交'
          })
          return false;
        }
      });
    },
    getGstInfo() {
      this.$Api.operateManagement.getGstInfo(this.taxRateId)
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.form = data.data
          this.remberEndTime = data.data.validEndTime
        }
      })
    }
  },
  created () {
    this.getGstInfo()
  }
}
</script>
<style lang="scss" scoped>
.create-gst-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px;
  .create-gst-inner {
    width: 55%;
  }
}
</style>