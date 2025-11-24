<template>
  <div class="create-classpay-rule">
    <div class="form-wrap">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="130px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input placeholder="请输入规则名称" maxlength="20" show-word-limit style="width:100%" v-model="form.ruleName"></el-input>
        </el-form-item>
        <el-form-item label="课程包（产品)" prop="coursePackageId">
          <el-select placeholder="选择本规则关联的产品" :loading="coursePackageLoading" style="width:100%" v-model="form.coursePackageId">
            <el-option
              v-for="item in coursePackageList"
              :key="item.packageId"
              :label="item.packageName"
              :value="item.packageId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课酬等级" prop="userLevelId">
          <el-select placeholder="选择课酬等级" style="width:100%" v-model="form.userLevelId">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教师地域" prop="ruleType">
          <el-select placeholder="选择教师地域" style="width:100%" v-model="form.ruleType">
            <el-option
              v-for="item in tutorAreaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课酬单位" prop="currencyId">
          <el-select placeholder="选择课酬单位" style="width:100%" v-model="form.currencyId">
            <el-option
              v-for="item in rateList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item required label="基础课酬" prop="baseSalaryMoney">
          <el-input placeholder="请输入基础课酬" style="width:100%" v-model="form.baseSalaryMoney"></el-input>
        </el-form-item>
        <el-form-item label="生效时间" prop="validStartTime">
          <el-date-picker
            style="width:100%"
            v-model="form.validStartTime"
            type="datetime"
            placeholder="请设置规则开始生效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" required prop="validEndTime">
          <el-date-picker
            style="width:100%"
            v-model="form.validEndTime"
            type="datetime"
            placeholder="请设置规则失效时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <el-card style="width:60%" shadow="hover">
      <el-table
      :data="tutorSalaryDetailRules"
      style="width: 100%"
      max-height="250">
        <el-table-column align="center" prop="minCount" label="最小课节" >
          <template slot-scope="scope">
            <el-input placeholder="最小课节数" v-model="scope.row.minCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maxCount" label="最大课节" >
          <template slot-scope="scope">
            <el-input placeholder="最大课节数" v-model="scope.row.maxCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="阶梯奖励课酬">
          <template slot-scope="scope">
            <el-input placeholder="课酬" v-model="scope.row.money"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.$index === tutorSalaryDetailRules.length - 1" @click="addLine">添加</el-button>
            <el-button size="mini" type="danger" v-else @click="deleteLine(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="bottom-wrap">
      <el-button style="width:10%" @click="handleCancel">取消</el-button>
      <el-button style="width:10%" type="primary" @click="sureSubmit" :loading="sureSubmitLoading" >确定添加</el-button>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'createClassPayRule',
  data () {
    var testBaseSalaryMoney = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('基础课酬不能为空'));
      } else {
        if( (value*1) < 0 || (value*1) > 999 ) {
          return callback(new Error('基础课酬范围为 0 - 999'))
        }
        if( value.indexOf('.') !== -1 ) {
          return callback(new Error('基础课酬不能为小数'))
        }
      }
      return callback()
    }
    return {
      form: {
        ruleName: '',
        coursePackageId: '',
        userLevelId: '',
        ruleType: '',
        currency: '',
        currencyId: '',
        baseSalaryMoney: '',
        validStartTime: '',
        validEndTime: ''
      },
      rules: {
        ruleName: [{ required: true, message: '规则名称不能为空'}],
        coursePackageId: [{ required: true, message: '关联产品不能为空'}],
        userLevelId: [{ required: true, message: '课酬等级不能为空'}],
        ruleType: [{ required: true, message: '教师地域不能为空'}],
        currencyId: [{ required: true, message: '课酬单位不能为空'}],
        baseSalaryMoney: [
          { validator: testBaseSalaryMoney }
        ],
        validStartTime: [{ required: true, message: '生效时间不能为空'}],
        validEndTime: [{ required: true, message: '失效时间不能为空'}]
      },
      tutorAreaOptions: [
        { label: '新加坡', value: 1 },
        { label: '非新加坡', value: 2 }
      ],
      tutorSalaryDetailRules: [
        { minCount: 6, maxCount: 20, money: '' },
        { minCount: 21, maxCount: 999999, money: '' }
      ],
      coursePackageList: [],
      coursePackageLoading: false,
      levelList: [],
      levelListLoading: false,
      rateList: [],
      rateListLoading: false,
      sureSubmitLoading: false
    }
  },
  computed: {
    currentPage() {
      return this.$route.fullPath
    },
    ...mapState({
      routesMemoryList: state => state.tabs.routesMemoryList
    })
  },
  methods: {
    handleCancel() {
      let item, index
      this.routesMemoryList.forEach( ( routeItem, routeIndex ) => {
        if( routeItem.name === 'createClassPayRule' ) {
          item = routeItem
          index = routeIndex
        }
      })
      this.$store.commit('DELETE_ROUTE', [item, index])
      this.$router.push(`/tutorManagement/classPayRules`)
    },
    addLine() {
      this.tutorSalaryDetailRules.push({ minCount: '', maxCount: '', money: '' })
    },
    deleteLine(index) {
      this.tutorSalaryDetailRules.splice(index,1)
    },
    sureSubmit() {
      let rule1 = this.tutorSalaryDetailRules.some( item => item.minCount == '' || item.maxCount == '' || item.money == '' )
      if( rule1 ) {
        this.$notify({
          message: this.$t('信息不完善'),
          type: 'error'
        })
        return
      }
      let rule2 = this.tutorSalaryDetailRules.find( (item,index) => index !== 0  && (item.minCount <= this.tutorSalaryDetailRules[index-1].maxCount ))
      if( rule2 ) {
        this.$notify({
          message: '每个梯度间的课节数不可以交叉',
          type: 'error'
        })
        return
      }
      let rule3 = this.tutorSalaryDetailRules.some( item => item.minCount <= 0 || item.maxCount <=0 )
      if( rule3 ) {
        this.$notify({
          message: '最大课节与最小课节不能小于等于0',
          type: 'error'
        })
        return
      }
      this.$refs['ruleForm'].validate(val => {
        if(val) {
          this.sureSubmitLoading = true
          let currencyInfo = this.rateList.find( item => item.id === this.form.currencyId )
          this.form.validStartTime = new Date(this.form.validStartTime).toISOString()
          this.form.validEndTime = new Date(this.form.validEndTime).toISOString()
          this.form.tutorSalaryDetailRules = this.tutorSalaryDetailRules
          this.form.createUserId = JSON.parse(window.localStorage.getItem('userInfo')).id
          this.form.currency = currencyInfo? currencyInfo.currency : ''
          this.$Api.tutorManagement.addSalaryRuleConfig(this.form)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$notify({
                type: 'success',
                message: '新增规则成功'
              })
              this.handleCancel()
            }
            this.sureSubmitLoading = false
          })
        }
      })

    },
    // 获取课程包下拉数据
    getPackageList() {
      this.coursePackageLoading = true
      this.$Api.groupManagement.queryClassPackageList({})
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.coursePackageList = data.data
          this.coursePackageLoading = false
        }
      })
    },
    getClassPayLevelList() {
      this.levelListLoading = true
      this.$Api.tutorManagement.getClassPayLevelList()
      .then(({ status, data }) => {
        this.levelList = data.data
        this.levelListLoading = false
      })
    },
    getRateList() {
      this.rateListLoading = true
      this.$Api.operateManagement.getRateList()
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.rateList = data.data.filter( item => item.id === 1 || item.id === 2)
          this.rateListLoading = false
        }
      })
    }
  },
  created () {
    this.getPackageList()
    this.getClassPayLevelList()
    this.getRateList()
  }
}
</script>
<style lang="scss" scoped>
.create-classpay-rule {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .form-wrap {
    width: 30%;
  }
  .class-times-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .class-times-top-message {
      display: flex;
    }
    .class-times-form-wrap {
      display: flex;
    }
  }
  .bottom-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
