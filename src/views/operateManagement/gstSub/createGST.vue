<template>
  <div class="create-gst-wrap">
    <div class="create-gst-inner">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="currentLang === 'en'? '160px' : '120px'" class="demo-ruleForm">
        <el-form-item :label="$t('税率名称')" prop="taxRateName">
          <el-input maxlength="20" show-word-limit clearable v-model.trim="form.taxRateName"
                    :placeholder="$t('请输入税率名称，不超过20字')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('税率')" prop="taxRate">
          <el-input clearable v-model.trim="form.taxRate" :placeholder="$t('请输入税率，支持小数点')">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('生效时间')" prop="validStartTime">
          <el-date-picker
            clearable
            :picker-options="pickerOptions"
            v-model="form.validStartTime"
            type="datetime"
            :placeholder="$t('选择日期时间')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('失效时间')" prop="validEndTime">
          <el-date-picker
            clearable
            :picker-options="pickerOptionsEnd"
            v-model="form.validEndTime"
            type="datetime"
            :placeholder="$t('选择日期时间')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('征税用户所在地')" prop="countryCode">
          <el-select clearable filterable v-model="form.countryCode" :placeholder="$t('请选择')">
            <el-option
              v-for="item in countryOptions"
              :key="item.nameZh"
              :label="item.nameZh"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">{{$t('立即创建')}}</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'createGST',
  data () {
    var testTaxRateNumber = ( rule, value, callback  ) => {
      
      if( value.indexOf('.') !== -1 && value.split('.')[1].length > 3 ) {
        return callback( new Error('仅能有3位小数') )
      }
      if (value * 1 <= 0) {
        return callback(new Error('必须大于0'))
      }
      return callback()
    }
    let taxRateName = ( rule, value, callback  ) => {
      if(!value){
        return callback( new Error(this.$t('请输入税率名称')) )
      }else{
        return callback();
      }
    }
    let taxRate = (rule, value, callback) => {
      if(!value){
        return callback(new Error(this.$t('请输入税率')))
      }else{
        return callback()
      }
    }
    let validStartTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error(this.$t('请选择生效时间')))
      }else{
        return callback()
      }
    }
    let validEndTime = (rule, value, callback) => {
      if(!value){
        return callback(new Error(this.$t('请选择失效时间')))
      }else{
        return callback()
      }
    }
    let countryCode = (rule, value, callback) => {
      if(!value){
        return callback(new Error(this.$t('请选择征税用户所在地')))
      }else{
        return callback()
      }
    }
    return {
      form: {
        taxRateName: '',
        taxRate: '',
        validStartTime: '',
        validEndTime: '',
        countryNameZh: '',
        countryCode: ''
      },
      submitLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      pickerOptionsEnd: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      rules: {
        taxRateName: [
          {validator: taxRateName, trigger: 'blur'}
        ],
        taxRate: [
          {validator: taxRate, trigger: 'blur'},
          {validator: testTaxRateNumber, trigger: 'blur'}
        ],
        validStartTime: [
          {validator: validStartTime, trigger: 'blur'}
        ],
        validEndTime: [
          {validator: validEndTime, trigger: 'blur'}
        ],
        countryCode: [
          {validator: validEndTime, trigger: 'blur'}
        ]
      },
      countryOptions: [],
      countryNameZh: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ]),
    countryCode() {
      return this.form.countryCode
    },
    validStartTime() {
      return this.form.validStartTime
    }
  },
  watch: {
    countryCode(newData) {
      let flag = this.countryOptions.find(item => item.code === newData)
      this.countryNameZh = flag.nameZh
    },
    validStartTime(newData) {
      this.pickerOptionsEnd = {
        disabledDate(time) {
          if (time.getTime() <= (new Date(newData) * 1) - 3600 * 1000 * 24) {
            return true
          }
          if (time.getTime() < Date.now() - 3600 * 1000 * 24) return true
          return false
        }
      }
    },
    currentLang(){
      this.initData()
    }
  },
  methods: {
    initData(){
      this.rules = {
        taxRateName: [
          {required: true, message: this.$t('请输入税率名称'), trigger: 'blur'}
        ],
        taxRate: [
          {required: true, message: this.$t('请输入税率'), trigger: 'blur'},
          {validator: testTaxRateNumber, trigger: 'blur'}
        ],
        validStartTime: [
          {required: true, message: this.$t('请选择生效时间'), trigger: 'blur'}
        ],
        validEndTime: [
          {required: true, message: this.$t('请选择失效时间'), trigger: 'blur'}
        ],
        countryCode: [
          {required: true, message: this.$t('请选择征税用户所在地'), trigger: 'blur'}
        ]
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.countryNameZh = this.countryNameZh
          // this.form.validStartTime = new Date(this.form.validStartTime).toISOString
          // this.form.validEndTime = new Date(this.form.validEndTime).toISOString
          let {
            taxRateName,
            taxRate,
            validStartTime,
            validEndTime,
            countryNameZh,
            countryCode
          } = this.form
          let params = {
            taxRateName,
            taxRate: taxRate * 1,
            validStartTime: new Date(validStartTime).toISOString(),
            validEndTime: new Date(validEndTime).toISOString(),
            countryNameZh,
            countryCode
          }
          this.submitLoading = true
          this.$Api.operateManagement.addGst(params)
            .then(({status, data}) => {
              this.submitLoading = false
              if (status == 200 && data.code == 200) {
                this.$router.push(`/operateManagement/gstDetail?taxRateId=${data.data.id}`)
                this.$notify({
                  message: '新增消费税成功',
                  type: 'success'
                })
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCountryList() {
      this.$Api.operateManagement.getCountryList(1, 500)
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            this.countryOptions = data.data.list
          }
        })
    }
  },
  created() {
    this.getCountryList()
    this.initData()
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
    width: 40%;
  }
}
</style>
