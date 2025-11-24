<template>
  <div class="scheduling-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('课消明细')">
      <screen-item :label="$t('Date')" :part="2" label-width="60" v-if="Per.handleButtonPer('financeMT.employeePerformance.attendClassInfo.cdFilerByDate')">
        <el-radio-group v-model="screenData.month_query" @change="changeRadion">
          <el-radio-button label="before_month">{{ $t('上月') }}</el-radio-button>
          <el-radio-button label="this_month">{{ $t('本月') }}</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="applyDate"
          style="margin-left:10px;width:220px;"
          type="daterange"
          value-format="yyyy-MM-dd"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :default-time="['00:00:00', '23:59:59']"
          size="small"
          @change="timeChange"
        />
      </screen-item>
      <screen-item :label="$t('按员工查看')" label-width="120" :part="2" v-if="Per.handleButtonPer('financeMT.employeePerformance.attendClassInfo.cdFilerByAdviser')">
        <el-select clearable filterable v-model="screenData.cmsUserId" :placeholder="$t('请选择')">
          <el-option v-for="(item, index) in xgAndGwListSet" :key="index" :label="item.nameEn+`${item.nameEn && item.nameZh?'-':''}`+item.nameZh" :value="item.id" />
        </el-select>
      </screen-item>
      <screen-item :label="$t('glb-student')" label-width="100" :part="4" v-if="Per.handleButtonPer('financeMT.employeePerformance.attendClassInfo.cdFilerByStudentName')">
        <el-input v-model.trim="screenData.studentName" :placeholder="$t('glb-input')+(currentLang=='en'?' ' + $t('glb-student'):'学生用户名')" @keyup.enter.native="search" />
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper no-bottom-border">
      <div slot="header-right" class="slot-tit">
        <span>{{$t('统计期内新用户课消')}} {{ new_student_amount }}；{{$t('老用户课消')}} {{ old_student_amount }}</span>
        <!-- <el-button @click="showAddMoreHours">批量添加课时</el-button>
        <el-button @click="showAddHours">添加课时</el-button> -->
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @sort-change="sortChange"
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
        class="attend-table"
        stripe
      >
        <el-table-column fixed align="center" :label="$t('序号')" :width="120">
          <template slot-scope="scope">{{ (screenData.page - 1) * screenData.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column fixed align="center" width="150" prop="scheduledTime" sortable="custom" :class-name="getSortClass('virtualclass.scheduled_time')" :label="$t('上课时间')">
          <template slot-scope="scope">
            <span>{{DateTimeUtils.dateClockTime(scope.row.scheduledTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed align="center" :label="$t('glb-student')" width="120">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="{ path : `/studentManagement/studentInfo`, query:{ studentId:scope.row.studentId, studentName: scope.row.studentName}}">
                {{ scope.row.studentName }}
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :width="currentLang=='en'?200:100"  align="center" prop="coursePackageName" :label="$t('产品')" />
        <el-table-column :width="currentLang=='en'?200:100" align="center" prop="amount" :label="$t('消耗课时')" />
        <el-table-column :width="currentLang=='en'?200:100"  align="center" prop="lessonSum" :label="$t('第几次上课')" />
        <el-table-column :width="currentLang=='en'?180:120" align="center" :label="$t('schedule-Class Size')">
          <template slot-scope="scope">
            <span>{{ scope.row.classType == 1 ? $t('1对1') : $t('小班课') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('版本')">
          <template slot-scope="scope">
              {{ currentLang=='en'?scope.row.editionName:scope.row.editionNameZh}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('级别')">
          <template slot-scope="scope">
              Level {{ scope.row.courseLevel==7?'5h':scope.row.courseLevel==8?'6h':scope.row.courseLevel }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('schedule-课表')" :width="120">
          <template slot-scope="scope">Lesson {{ scope.row.lessonNo}}</template>
        </el-table-column>
        <el-table-column width="150" align="center" prop="teacherName" :label="$t('教师')" />
        <el-table-column align="center" prop="remark" :label="$t('student-info-Notes')" />
        <el-table-column width="130" align="center" prop="courseAdviser" :label="$t('本次课消课程顾问')" />
        <el-table-column width="130" align="center" prop="learnManager" :label="$t('本次课消学管老师')" />
      </el-table>
      <!-- 分页 -->
      <custom-pagination
        :total="total"
        :current-page="screenData.page"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <!-- 批量添加课时 start-->
    <el-dialog
    :before-close="closeAddMoreHours"
    :close-on-click-modal="false"
    :title="$t('批量添加课时')"
    center
    :visible.sync="addMoreHoursDialogFlag">
      <el-input
        type="textarea"
        :rows="10"
        :placeholder="$t('glb-input')+(currentLang=='en'?'...':'内容')"
        v-model="addMoreHoursValue">
      </el-input>
      <div class="warning-text">{{ $t('批量操作涉及数据量较大，请谨慎操作') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMoreHoursDialogFlag = false">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="sureAddMoreHours">{{$t('确定添加')}}</el-button>
      </div>
    </el-dialog>
    <!-- 批量添加课时 end-->
    <!-- 添加课时 start-->
    <el-dialog
    :before-close="closeAddHours"
    :close-on-click-modal="false"
    :title="$t('批量添加课时')"
    center
    :visible.sync="addHoursDialogFlag">
      <el-form
      ref="addHoursForm"
      :model="addHoursForm"
      label-width="100px">
        <el-form-item :label="$t('student-management-User Account')">
          <el-input v-model="addHoursForm.userName" :placeholder="$t('glb-input')+(currentLang=='en'?'...':'用户账号')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('添加课时')">
          <el-input v-model="addHoursForm.addHoursNun"  :placeholder="$t('glb-input')+(currentLang=='en'?'...':'课时数量')" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('my-home-Point Type')">
          <el-radio-group v-model="addHoursForm.classType">
            <el-radio :label="0">{{ $t('my-home-Standard Points') }}</el-radio>
            <el-radio :label="1">{{$t('SG课时')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('添课理由')">
          <el-select v-model="addHoursForm.addReson" :placeholder="$t('glb-input')">
            <el-option
              v-for="item in resonList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('详细理由')">
          <el-input
          type="textarea"
          :rows="4"
          :placeholder="$t('glb-input')+(currentLang=='en'?'...':'详细理由')"
          v-model="addHoursForm.resonDetail" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHoursDialogFlag = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="sureAddHours">{{ $t('确定添加') }}</el-button>
      </div>
    </el-dialog>
    <!-- 添加课时 end-->
  </div>
</template>

<script>
import { attendClassInfo, managerAdhoc } from '@/api/financeManagement';
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'attendClassInfo',
  data() {
    return {
      screenData: {
        month_query: 'before_month', // this_month 本月，before_month 上月
        startTime: '', // 时间段startTime  2019-07-24 12:00:00 endTime  2019-07-24 12:00:00
        endTime: '',
        cmsUserId: '',
        studentName: '',
        page: 1,
        pageSize: 50,
        ordering: 'desc'
      },
      learnmanagerrDate: [],
      applyDate: [],
      loading: true, // 加载loading
      total: 0,
      // 表格数据
      tableData: [],
      new_student_amount: 0, // 新用户消课
      old_student_amount: 0, // 老用户消课
      addHoursDialogFlag: false,
      addMoreHoursDialogFlag: false,
      addMoreHoursValue: '',
      addHoursForm: {
        userName: '',
        addHoursNum: '',
        classType: 0,
        addReson: 0,
        resonDetail: ''
      },
      resonList: [
        { label: '二次试听', value: 0 },
        { label: '转发朋友圈赠课', value: 1 },
        { label: '报名7天未成班补偿', value: 2 },
        { label: '试听后48小时内充值奖励', value: 3 },
        { label: '其他', value: 4 }
      ]
    }
  },
  computed: {
    ...mapState({
      xgAndGwListSet: state => state.user.xgAndGwListSet
    }),
    ...mapGetters([
      'currentLang'
    ]),
  },
  mounted() {
    this.getTableData()
    this.getAdhoc()
  },
  methods: {
    showAddMoreHours() {
      this.addMoreHoursDialogFlag = true
    },
    showAddHours() {
      this.addHoursDialogFlag = true
    },
    closeAddMoreHours() {
      this.addMoreHoursDialogFlag = false
    },
    closeAddHours() {
      this.addHoursDialogFlag = false
    },
    sureAddMoreHours() {

    },
    sureAddHours() {

    },
    // 筛选
    search() {
      this.screenData.page = 1
      this.getTableData()
      this.getAdhoc()
    },
    // 日期切换
    changeRadion(val) {
      this.applyDate = []
      this.screenData.startTime = ''
      this.screenData.endTime = ''
    },

    // 修改接口参数
    fixParams(){
      let year=new Date().getFullYear()
      let month=new Date().getMonth()+1
      // 参数更换
      if(this.screenData.month_query=='before_month'){
        this.screenData.endTime=new Date(`${year}-${month}-1 00:00:00`).toISOString()
        month=month-1
        if(month==0){
          year=year-1
          month=12
        }
       this.screenData.startTime=new Date(`${year}-${month}-1 00:00:00`).toISOString()
      } else if(this.screenData.month_query=='this_month'){
        this.screenData.startTime=new Date(`${year}-${month}-1 00:00:00`).toISOString()
        month=month+1
        if(month==13) {
          year=year+1
          month=1
        }
        this.screenData.endTime=new Date(`${year}-${month}-1 00:00:00`).toISOString()
      }

      // delete this.screenData.month_query
      return this.screenData
    },

    // 表格数据
    getTableData() {
      this.loading = true

      attendClassInfo(this.fixParams()).then(res => {
        this.loading = false
        this.total = res.data.data.total
        this.tableData = res.data.data.list
      })
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(`${this.applyDate[0]} 00:00`).toISOString()
        this.screenData.endTime = new Date(`${this.applyDate[1]} 23:59`).toISOString()
        this.screenData.month_query = ''
      } else {
        this.screenData.startTime = ''
        this.screenData.endTime = ''
        this.screenData.month_query = 1
      }
    },
    // 课消总数
    getAdhoc() {
      const { month_query, startTime, endTime, cmsUserId } = this.screenData
      const params = { month_query, startTime, endTime, cmsUserId }
      managerAdhoc(params).then(res => {
        this.new_student_amount = res.data.data.newStudentAmount
        this.old_student_amount = res.data.data.oldStudentAmount
      })
    },
    sortChange(column) {
      if (column.prop === 'virtualclass.scheduled_time' && column.order === 'ascending') { // 升序
        this.screenData.ordering = 'asc'
      } else if (column.prop === 'virtualclass.scheduled_time' && column.order === 'descending') { // 降序
        this.screenData.ordering = 'desc'
      } else {
        return
      }
      this.getTableData()
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.screenData.page = currentPage
      this.getTableData()
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.screenData.pageSize = perPage
      this.screenData.page = 1
      this.getTableData()
    },
    getSortClass: function(key) {
      const sort = this.screenData.ordering
      return sort === `${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .type-btn {
    padding: 20px 0 0 0;
  }
  .table-wrapper{
    margin-top:20px;
    padding: 0 15px;

    .slot-tit{
      color:#666;
      font-size:14px;
      span {
        margin-right: 10px;
      }
    }

    .attend-table {
      border: 1px solid #f1f1f1;
    }
  }
  .warning-text {
    width: 100%;
    text-align: center;
    margin-top: 18px;
    color: #f96
  }
</style>
