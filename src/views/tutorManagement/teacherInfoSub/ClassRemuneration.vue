<template>
  <div class="class-remuneraton-wrap" v-loading="classReWrapLoading">
    <div class="edit-button-wrap">
      <el-button
        @click="handleEdit"
        type="primary"
        class="edit-button"
        v-show="notIsEditing"
        v-if="Per.handleButtonPer('teach.tutorMT.teacherMoney.editTeachMoneyBtn')"
      >{{$t('编辑老师课酬')}}</el-button>
    </div>
    <ul>
      <li>
        <span class="label">{{$t('薪酬标签')}}：</span>
        <el-select
          v-model="salaryLabel"
          clearable
          :placeholder="$t('请选择')"
          :disabled="notIsEditing"
        >
          <el-option
            v-for="item in salaryLabelList"
            :key="item.code"
            :label="item.description"
            :value="item.code"
          />
        </el-select>
      </li>
      <li>
        <span class="label">{{$t('老师类型')}}：</span>
        <el-radio-group :disabled="notIsEditing" v-model="fullWork" @change="changeFullwork">
          <el-radio :label="0">{{$t('兼职老师')}}</el-radio>
          <el-radio :label="1">{{$t('全职老师')}}</el-radio>
        </el-radio-group>
      </li>
      <li>
        <span class="label">{{$t('老师地域')}}：</span>
        <el-radio-group :disabled="notIsEditing" v-model="localArea" @change="changeLocalArea">
          <el-radio :label="2">{{$t('非新加坡老师')}}</el-radio>
          <el-radio :label="1">{{$t('新加坡老师')}}</el-radio>
        </el-radio-group>
      </li>
      <li v-if="localArea == 2 && fullWork == 0">
        <span class="label">{{$t('是否凌晨补助')}}：</span>
        <el-radio-group :disabled="notIsEditing" v-model="earlyMorningSubsidy" @change="changeMorningSubsidy">
          <el-radio :label="1">{{$t('是')}}</el-radio>
          <el-radio :label="0">{{$t('否')}}</el-radio> 
        </el-radio-group>
      </li>
      <!-- <li>
        <span class="label">{{$t('老师课酬等级')}}：</span>
        <div class="teacher-level-wrap">
          <div v-if="fullWork !== 1">
            <div class="radio-line" v-for="( item, index ) in salaryRules" :key="index">
              <span class="mr10 wid">{{ item.coursePackageName }}</span>
              <el-radio-group :disabled="notIsEditing" v-model="item.currentUserLevelId">
                <el-radio @click.native.prevent="onRadioChange(item, ite.userLevelId)"  v-for="ite in item.salaryInfos" :key="ite.userLevelId" :label="ite.userLevelId">{{ite.salaryDetail}}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div v-else>
            {{$t('暂不支持配置全职老师课酬')}}
          </div>
        </div>
      </li> -->
    </ul>
    <div class="button-wrap" v-if="!notIsEditing">
      <el-button style="width:8%" @click="cancelEdit">{{$t('取消')}}</el-button>
      <el-button style="width:8%" type="primary" @click="showReasonDialog">{{$t('确定修改')}}</el-button>
    </div>
    <el-dialog
      :before-close="closeReasonDialog"
      :close-on-click-modal="false"
      :title="$t('修改理由')"
      center
      :visible.sync="reasonDialog">
      <el-input
        type="textarea"
        :placeholder="$t('请输入内容，修改理由最少10个字')"
        v-model="changeReason"
        rows="10"
        maxlength="500"
        minlength="10"
        show-word-limit
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeReasonDialog">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitAndSureEdit" :loading="submitAndSureEditLoading">{{$t('提交并完成修改')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remberSalaryRules: [],
      salaryRules: [],
      tutorSalaryRules: [],
      salaryLabel: '',
      businessLine:'',
      fullWork: -1,
      localArea: -1,
      earlyMorningSubsidy:-1,
      classReWrapLoading: false,
      notIsEditing: true,
      reasonDialog: false,
      changeReason: '',
      submitAndSureEditLoading: false,
      tutorInfo: null,
      isFirstRender: true,
      salaryLabelChangeRowData: null,
      salaryLabelList: []
    }
  },
  methods: {
    // 获取薪酬标签数据
    getSalaryLabelList() {
      this.$Api.tutorManagement.getSalaryLabelsList(this.businessLine).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.salaryLabelList = data.data
        }
      })
    },
    onRadioChange(item, value) {
      if(!this.notIsEditing) {
        item.currentUserLevelId === value ? item.currentUserLevelId = -1 : item.currentUserLevelId = value
      }
    },
    changeFullwork( value ) {
      this.getData(true)
    },
    changeLocalArea( value ) {
      this.getData(true)
    },
    changeMorningSubsidy(value){
      this.getData(true)
    },
    handleEdit() {
      this.notIsEditing = false
    },
    cancelEdit() {
      this.notIsEditing = true
      this.getData(false)
    },
    showReasonDialog() {
      this.reasonDialog = true
    },
    closeReasonDialog() {
      this.changeReason = ''
      this.reasonDialog = false
    },
    submitAndSureEdit() {
      if( this.changeReason === '' ) {
        this.$notify({
          message: '修改理由不能为空',
          type: 'error'
        })
        return
      } else if( this.changeReason.length < 10 ) {
        this.$notify({
          message: '修改理由必须最少10个字',
          type: 'error'
        })
        return
      }
      this.submitAndSureEditLoading = true
      let finalLevels = [], updateLogs = [], theLocalStorage = JSON.parse(window.localStorage.getItem('userInfo'))
      this.salaryRules.forEach( item => {
        let params = {
          coursePackageId: item.coursePackageId,
          userLevelId: item.currentUserLevelId,
          createUserId: theLocalStorage.id
        }
        if( params.userLevelId !== -1 ) {
          finalLevels.push(params)
        }
      })
      // this.remberSalaryRules 初始数据
      // this.salaryRules 修改过后的数据
      // 处理updateLogs
      this.remberSalaryRules.forEach( item => {
        let productItem = this.salaryRules.find( ite => ite.coursePackageId === item.coursePackageId), obj = {}
        if( productItem ) {
          if( productItem.currentUserLevelId === item.currentUserLevelId ) {
             // 没有改变
          } else {
            // 发生改变
            let b = item.salaryInfos.find( sitem => sitem.userLevelId === item.currentUserLevelId ),
                a = productItem.salaryInfos.find( sitem => sitem.userLevelId === productItem.currentUserLevelId )
            b !== undefined ? obj.beforeInfo = b.salaryDetail : obj.beforeInfo = ''
            a !== undefined ? obj.afterInfo = a.salaryDetail : obj.afterInfo = ''
            obj.coursePackageName = productItem.coursePackageName
          }
        }
        if( JSON.stringify(obj) !== '{}') {
          updateLogs.push(obj)
        }
      })
      if(this.localArea == 1 || this.fullWork == 1){
        this.earlyMorningSubsidy = 0
      }
      let { fullWork, localArea, earlyMorningSubsidy } = this
      let params = {
        salaryLabel: this.salaryLabel || '',
        createUserId: JSON.parse(window.localStorage.getItem('userInfo')).id,
        finalLevels,
        fullWork,
        earlyMorningSubsidy,
        localArea,
        reason: this.changeReason,
        tutorUserId: this.$route.query.id,
        updateLogs
      }
      this.$Api.tutorManagement.changeTutorCourseSalary( params )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.$notify({
            message: '修改老师课酬成功',
            type: 'success'
          })
          this.closeReasonDialog()
          this.notIsEditing = true
        }
        this.submitAndSureEditLoading = false
      })
    },
    getTutorInfo() {
      return new Promise(( resolve, reject ) => {
        this.classReWrapLoading = true
        this.$Api.tutorManagement.getTutorInfo( { id: this.$route.query.id } )
        .then(({ status, data }) => {
          if( status === 200 && data.code === 200 ) {
            this.tutorInfo = data.data
            resolve('success')
          }
        })
      })
    },
    /**
     * isChange boolean 是否为修改fullwork || 修改localArea
     */
    getData(isChange) {
      this.classReWrapLoading = true
      let fullWork, localArea, earlyMorningSubsidy
      if( this.tutorInfo && !isChange) {
        fullWork = this.tutorInfo.fullWork
        localArea = this.tutorInfo.localArea
        earlyMorningSubsidy = this.tutorInfo.earlyMorningSubsidy
      } else {
        fullWork = this.fullWork
        localArea = this.localArea
        earlyMorningSubsidy = this.earlyMorningSubsidy
      }
      let params = {
        fullWork,
        localArea,
        earlyMorningSubsidy,
        tutorUserId: this.$route.query.id
      }
      this.$Api.tutorManagement.getTutorClassPaysRules( params )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          // 获取薪酬标签code
          this.salaryLabel = data.data.salaryLabel
          this.businessLine = data.data.businessLine
          this.getSalaryLabelList()
          this.fullWork = data.data.fullWork
          this.localArea = data.data.localArea
          this.earlyMorningSubsidy = data.data.earlyMorningSubsidy
          this.salaryRules = data.data.salaryRules || []
          this.tutorSalaryRules = data.data.tutorSalaryRules || []
          this.salaryRules.forEach( item => {
            this.$set(item, 'currentUserLevelId', -1)
            let currentLevel = this.tutorSalaryRules.find( ite => ite.coursePackageId === item.coursePackageId)
            currentLevel ?  item.currentUserLevelId = currentLevel.userLevelId : null
          })
          this.remberSalaryRules = JSON.parse(JSON.stringify(this.salaryRules))
        }
        this.classReWrapLoading = false
      })
    },
    getTutorInfoAndData() {
      Promise.all([this.getTutorInfo()])
      .then( res => {
        this.getData(false)
      })
    }
  },
  created() {
    this.getTutorInfoAndData()
  }
}
</script>
<style lang='scss' scoped>
.radio-line {
  margin-top: 20px;
}
.wid {
  width: 100px;
  display: inline-block;
}
.class-remuneraton-wrap {
  width: 100%;
  height: 100%;
  .edit-button-wrap {
    width: 100%;
    height: 100%;
    text-align: right;
    margin-top: 10px;
    .edit-button {
      // position: absolute;
      right: 2%;
      // top: -2%;
    }
  }
  ul {
    list-style: none;
    margin: 10px 0 0 0;
    padding: 0;
    li {
      margin: 10px 0;
      >span {
        font-size: 14px;
        margin-left: 20px;
        margin-right: 10px;
      }
      .teacher-level-wrap {
        font-size: 14px;
        margin-top: 10px;
        padding-left: 40px;
        >div{
          margin-top: 10px;
        }
      }
    }
  }
  .button-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
