<template>
  <div class="classpay-rule-detail" v-loading="loading">
    <div class="edit-button-wrap">
      <el-button 
        type="primary" 
        v-show="notIsEdit" 
        v-if="Per.handleButtonPer('teach.tutorMT.classPayRules.changeRuleBtn')"
        @click="handleEdit"
      >修改</el-button>
    </div>
    <div class="form-wrap">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="130px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input maxlength="20" show-word-limit :disabled="notIsEdit" style="width:100%" v-model="form.ruleName"></el-input>
        </el-form-item>
        <el-form-item label="课程包（产品)" prop="coursePackageId">
          <el-select :disabled="true" :loading="coursePackageLoading" style="width:100%" v-model="form.coursePackageId">
            <el-option
              v-for="item in coursePackageList"
              :key="item.packageId"
              :label="item.packageName"
              :value="item.packageId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课酬等级" prop="userLevelId">
          <el-select :disabled="true" style="width:100%" v-model="form.userLevelId">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教师地域" prop="ruleType">
          <el-select :disabled="true" style="width:100%" v-model="form.ruleType">
            <el-option
              v-for="item in tutorAreaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课酬单位" prop="currencyId">
          <el-select :disabled="true" style="width:100%" v-model="form.currencyId">
            <el-option
              v-for="item in rateList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础课酬" required prop="baseSalaryMoney">
          <el-input :disabled="true" style="width:100%" v-model="form.baseSalaryMoney"></el-input>
        </el-form-item>
        <el-form-item label="生效时间" prop="validStartTime">
          <el-date-picker
            :disabled="true"
            style="width:100%"
            v-model="form.validStartTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" prop="validEndTime">
          <el-date-picker
            :disabled="notIsEdit"
            style="width:100%"
            v-model="form.validEndTime"
            type="datetime"
            placeholder="选择日期时间">
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
            <el-input :disabled="true" v-model="scope.row.minCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maxCount" label="最大课节" >
          <template slot-scope="scope">
            <el-input :disabled="true" v-model="scope.row.maxCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="阶梯奖励课酬">
          <template slot-scope="scope">
            <el-input :disabled="true" v-model="scope.row.money"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="bottom-wrap" v-if="!notIsEdit">
      <el-button style="width:10%" @click="cancel">取消</el-button>
      <el-button style="width:10%" type="primary" @click="sureSubmit" :loading="sureSubmitLoading">确定修改</el-button>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'classPayDetail',
  data () {
    var testBaseSalaryMoney = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('基础课酬不能为空'));
      } else {
        if( (value*1) < 0 || (value*1) > 999 ) {
          return callback(new Error('基础课酬范围为 0 - 999'))
        }
        if( (value+'').indexOf('.') !== -1 ) {
          return callback(new Error('基础课酬不能为小数'))
        }
      }
      return callback()
    }
    return {
      form: {},
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
      loading: false,
      tutorSalaryDetailRules: [],
      coursePackageList: [],
      coursePackageLoading: false,
      levelList: [],
      levelListLoading: false,
      rateList: [],
      rateListLoading: false,
      tutorAreaOptions: [
        { label: '新加坡', value: 1 },
        { label: '非新加坡', value: 2 }
      ],
      notIsEdit: true,
      sureSubmitLoading: false
    }
  },
  computed: {
    ...mapState({
      routesMemoryList: state => state.tabs.routesMemoryList
    })
  },
  methods: {
    cancel() {
      this.notIsEdit = true
      this.getDetailData()
    },
    handleEdit() {
      this.notIsEdit = false
    },
    sureSubmit() {
      this.$refs['ruleForm'].validate(val => {
        if(val) {
          this.sureSubmitLoading = true
          this.form.validEndTime = new Date(this.form.validEndTime).toISOString()
          this.$Api.tutorManagement.editSalaryRulesDetail(this.form)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$notify({
                message: '修改成功',
                type: 'success'
              })
              let item, index
              this.routesMemoryList.forEach( ( routeItem, routeIndex ) => {
                if( routeItem.name === 'classPayDetail' ) {
                  item = routeItem
                  index = routeIndex
                }
              })
              this.$store.commit('DELETE_ROUTE', [item, index])
              this.$router.push(`/tutorManagement/classPayRules`)
              this.notIsEdit = true
            }
          this.sureSubmitLoading = false
          })
        }
      })
    },

    // 获取课程包下拉数据
    getPackageList() {
      return new Promise(( resolve, reject ) => {
        this.coursePackageLoading = true
        this.$Api.groupManagement.queryClassPackageList({})
        .then(({ status, data }) => {
          if( status == 200 && data.code == 200 ) {
            this.coursePackageList = data.data
            this.coursePackageLoading = false
            resolve('success')
          }
        })
      })
    },
    getClassPayLevelList() {
      return new Promise(( resolve, reject ) => {
        this.levelListLoading = true
        this.$Api.tutorManagement.getClassPayLevelList()
        .then(({ status, data }) => {
          this.levelList = data.data
          this.levelListLoading = false
          resolve('success')
        })
      })
    },
    getRateList() {
      return new Promise(( resolve, reject ) => {
        this.rateListLoading = true
        this.$Api.operateManagement.getRateList()
        .then(({ status, data }) => {
          if( status == 200 && data.code == 200 ) {
            this.rateList = data.data.filter( item => item.id === 1 || item.id === 2)
            this.rateListLoading = false
            resolve('success')
          }
        })
      })
    },
    getDetailData() {
      this.loading = true
      this.$Api.tutorManagement.getSalaryRulesDetail({ id: this.$route.query.id })
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.form = data.data
          this.tutorSalaryDetailRules = data.data.tutorSalaryDetailRules
        }
        this.loading = false
      })
    }
  },
  created () {
    Promise.all([this.getPackageList(), this.getClassPayLevelList(), this.getRateList() ])
    .then( res => {
      this.getDetailData()
    })
  }
}
</script>
<style lang="scss" scoped>
.classpay-rule-detail {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .edit-button-wrap {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .form-wrap {
    width: 30%;
  }
  .bottom-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>