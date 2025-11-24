<template>
  <div class="groupListWrapper" v-if="Per.handleButtonPer('teach.groupMT.groupList.clViewClassList')">
    <!-- 搜索栏 -->
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <!-- <screen-item label="班级规模" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.classTypeId" :placeholder="$t('请选择')">
          <el-option
            v-for="item in classTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item label="收费标准" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.classCategory" placeholder="请选择">
          <el-option
            v-for="item in classCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item> -->
      <screen-item :label="$t('班级名称')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassStudentName')">
        <el-input v-model="screenData.className" :placeholder="$t('glb-input')+$t('班级名称')" />
      </screen-item>
      <screen-item :label="$t('班级编号')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassNumber')">
        <el-input v-model="screenData.classNo" :placeholder="$t('glb-input')+$t('班级编号')" />
      </screen-item>
      <screen-item :label="$t('是否结课')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clUserNumSearch')">
        <el-select v-model="screenData.status" :placeholder="$t('请选择')">
          <el-option
            v-for="(item,index) in classStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('版本')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassVersion')">
        <el-select v-model="screenData.courseEditionId" :placeholder="$t('请选择')">
          <el-option
            v-for="item in editionList"
            :key="item.editionId"
            :label="currentLang=='en'?item.editionNameEn:item.editionNameZh"
            :value="item.editionId"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('级别')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassLevel')">
        <el-select v-model="screenData.courseLevel" :placeholder="$t('请选择')">
          <el-option
            v-for="item in levelList"
            :label="item.courseName"
            :value="item.courseLevel"
            :key="item.courseName"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('单元')" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.unitNo" :placeholder="$t('请选择')">
          <el-option
            v-for="item in unitList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('下节课程')" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.lessonNo" :placeholder="$t('请选择')">
          <el-option v-for="(item, index) in lessonList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('创建人')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByCreator')">
        <el-input v-model="screenData.createUserName" :placeholder="$t('glb-input') + (currentLang == 'en' ? '...' : '创建人姓名')"/>
      </screen-item>
      <screen-item :label="$t('顾问/学管')" :part="4" :label-width="currentLang == 'en' ? 240 : 100" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByConsultants')">
        <el-select filterable v-model="screenData.xgUserId" :placeholder="$t('请选择')">
          <el-option v-for="(item, index) in xgAndGwListSet" :key="index" :label="item.nameEn+`${item.nameEn && item.nameZh?'-':''}`+item.nameZh" :value="item.id" />
        </el-select>
      </screen-item>
      <screen-item :label="$t('教师')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassTeacher')">
        <el-input v-model="screenData.tutorUserName" :placeholder="$t('glb-input')+$t('老师姓名')" />
      </screen-item>
      <screen-item :label="$t('班级学员')" :part="4" :label-width="currentLang == 'en' ? 140 : 100" v-if="Per.handleButtonPer('teach.groupMT.groupList.clFilterByClassStudentName')">
        <el-input v-model="screenData.studentUserName" :placeholder="$t('glb-input') + (currentLang == 'en' ? '...' : '班级学员姓名')" />
      </screen-item>
      <screen-item :label="$t('班级人数')" :part="4" :label-width="labelWidth" v-if="Per.handleButtonPer('teach.groupMT.groupList.clUserNumSearch')">
        <el-input v-model="screenData.userNum" :placeholder="$t('glb-input')+$t('班级人数')" />
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <el-button type="primary" slot="header-right" @click="jumpToCreateClass" v-if="Per.handleButtonPer('teach.groupMT.groupList.clCreateClass')">{{$t('创建班级')}}</el-button>
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @sort-change="sortChange"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column fixed align="center" :label="$t('序号')" :width="currentLang == 'en' ? 120 : 50">
          <template slot-scope="scope">{{ (currentPage - 1) * perPage + scope.$index + 1 }}</template>
        </el-table-column>

        <!-- <el-table-column fixed label="班级ID" width="130" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="jumpToClassInfo(scope.$index, tableData)"
              type="text"
              size="small">
              {{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column> -->
        <el-table-column fixed :label="$t('班级编号')" prop="class_no" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="Per.handleButtonPer('teach.groupMT.groupList.clViewClassDetails')"
              @click.native.prevent="jumpToClassInfo(scope.$index, tableData)"
              type="text"
              size="small">
              {{ scope.row.classNo }}
            </el-button>
            <el-button
              v-else
              disabled
              @click.native.prevent="jumpToClassInfo(scope.$index, tableData)"
              type="text"
              size="small">
              {{ scope.row.classNo }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed :label="$t('班级中文名称')" prop="classNameZh" :width="currentLang == 'en' ? 160 : 120" align="center"></el-table-column>
        <el-table-column :label="$t('班级英文名称')" prop="className" :width="currentLang == 'en' ? 160 : 120" align="center"></el-table-column>
        <!-- <el-table-column label="班级规模" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classTypeId | mapClassType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费标准" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classCategory | mapRechargeRule }}</span>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('班级下节课程')" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.courseEditionId | mapEdtion }} Level{{ scope.row.courseLevel==7?'5h':scope.row.courseLevel==8?'6h':scope.row.courseLevel }} Unit{{scope.row.courseUnitNo}} Lesson{{ scope.row.unitLessonNo }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('系统lesson')" align="center" :width="currentLang == 'en' ? 120 : 100">
          <template slot-scope="scope">
            <span>{{ scope.row.lessonNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('下节上课时间')"
          prop="startTime"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{DateTimeUtils.dateClockTime(scope.row.startTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('教师用户名')"
          prop="tutorRealName"
          :width="currentLang == 'en' ? 120 : 100"
          align="center"
        >
          <!-- <template slot-scope="scope">
            <div>
              <p v-for="(item, index) in scope.row.tutor_name" :key="index">{{item.tutor_user__real_name}}</p>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Name')"
          :width="currentLang == 'en' ? 120 : 100"
          prop="tutorIdentityName"
          align="center"
        >
        </el-table-column>
        <el-table-column :label="$t('班级人数')" prop="userNum" width="80" align="center"></el-table-column>
        <!-- <el-table-column label="班级学员" width="150" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.classroomClassMemberInfoList">
              <div v-for="(item, index) in scope.row.classroomClassMemberInfoList" :key="index">
                {{ item.realName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程顾问" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.classroomClassMemberInfoList">
              <div v-for="(item, index) in scope.row.classroomClassMemberInfoList" :key="index">
                {{ item.adviserUserName?item.adviserUserName:"--" }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学管老师" prop="name" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.classroomClassMemberInfoList">
              <div v-for="(item, index) in scope.row.classroomClassMemberInfoList" :key="index">
                {{ item.xgUserName?item.xgUserName:"--" }}
              </div>
            </div>
            <div v-else>

            </div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('已上/排课')" :width="currentLang == 'en' ? 180 : 80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.finishCourseNum}}/{{scope.row.scheduleCourseNum}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('课程状态')" :width="currentLang == 'en' ? 120 : 80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status == Constants.classStatus?$t('已完结'):$t('正在进行')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('实到人次/应到人次')" :width="currentLang == 'en' ? 350 : 140" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attendStudentNum}}/{{scope.row.courseStudentNum}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('总出勤率')" :width="currentLang == 'en' ? 180 : 80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.attendRate">{{(scope.row.attendRate * 100).toFixed(2)}}%</span>
            <span v-else>0%</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('创建人')" prop="createUserName" :width="currentLang == 'en' ? 100 : 80" align="center">
        </el-table-column>
        <el-table-column :label="$t('创建时间')" prop="createTime" width="150" align="center">
          <template slot-scope="scope">
            <span>{{DateTimeUtils.dateClockTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('班级操作')" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditGroupProgressDialog(scope.row)" v-if="Per.handleButtonPer('teach.groupMT.groupList.clAdjustClassProgress')">{{$t('调整班级进度')}}</el-button>
            <el-button type="text" @click="showEditGroupNameDialog(scope.row)" v-if="Per.handleButtonPer('teach.groupMT.groupList.clModifyClassName')">{{$t('修改班级名称')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <!-- 分页器 -->
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <el-dialog :close-on-click-modal="false" :title="$t('调整班级进度')" :visible.sync="editGroupProgress">
      <el-row>
        <div class="flex">
          <span>{{$t('版本')}}</span>
          <ul class="ul">
            <li
              :key="item.value"
              @click="changeEditBtnFlag(item.value)"
              :class="{'active':item.value === editionProgressData.edit}"
              v-for="(item) in editionListDialog"
            >{{ item.label }}</li>
          </ul>
        </div>
      </el-row>
      <el-row>
        <div class="flex">
          <span>{{$t('级别')}}</span>
          <ul class="ul">
            <li
              :key="item.value"
              @click="changeLevelBtnFlag(item.value)"
              :class="{'active': item.value === editionProgressData.level}"
              v-for="item in levelListDialog"
            >{{ item.label }}</li>
          </ul>
        </div>
      </el-row>
      <el-row>
        <el-col class="flex">
          <span>{{$t('进度')}}</span>
          <el-input v-model="editionProgressData.progress" />
        </el-col>
      </el-row>
      <el-row>
        <el-col class="flex jcc">
          <el-button class="mt20" type="primary" size="medium" @click="editGroupProgress = false">{{$t('取消')}}</el-button>
          <el-button class="mt20" type="primary" size="medium" @click="submitProgressResult">{{$t('提交')}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="$t('修改班级名称')" :visible.sync="editGroupName">
      <el-row>
        <el-col class="flex">
          <span style="width:100px;margin:10px 0">{{$t('班级名称')}}</span>
          <el-input v-model="editGroupNameData.newGroupName" :placeholder="$t('glb-input')+$t('新的班级名称')" />
        </el-col>
        <el-col class="flex">
          <span style="width:100px;margin:10px 0">{{$t('英文班级名称')}}</span>
          <el-input v-model="editGroupNameData.newGroupNameEn" :placeholder="$t('glb-input')+$t('新的英文班级名称')" />
        </el-col>
      </el-row>
      <el-row>
        <el-col class="flex jcc">
          <el-button class="mt20" type="primary" size="medium" @click="closeGroupNameDialog">{{$t('取消')}}</el-button>
          <el-button class="mt20" type="primary" size="medium" @click="submitGroupNameResult">{{$t('提交')}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupList,
  changeBigGroupProgress,
  changeGroupName
} from '@/api/groupManagement'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'bigGroupLists',
  data() {
    return {
      editionList:[],
      labelWidth: '100',
      tableHeight: window.innerHeight - 200 || 300,
      total: 0,
      currentPage: 1,
      perPage: 50,
      editGroupProgress: false,
      editGroupName: false,
      role: [],
      tableData: [],
      loading: '',
      screenData: {
        classNo: '',
        courseEditionId: '',
        courseLevel: '',
        className: '',
        createUserName: '',
        status: '',
        studentUserName: '',
        xgUserId: '',
        tutorUserName: '',
        userNum: '',
        lessonNo: '',
        classCategory: '',
        classTypeId: '',
        unitNo: ''
      },
      classCategoryList: [
      ],
      classTypeList: [
      ],
      classStatusList: [
      ],
      editionProgressData: {
        edit: '',
        level: '',
        progress: '',
        classId: ''
      },
      editGroupNameData: {
        newGroupName: '',
        newGroupNameEn: '',
        classId: ''
      },
      levelList: [],
      unitList: [],
      lessonList: []
    }
  },
  computed: {
    ...mapState({
      groupListSearchData: state => state.remberSearch.groupListSearchData,
      xgAndGwListSet: state => state.user.xgAndGwListSet,
    }),
    ...mapGetters([
      'currentLang'
    ]),
    editionListDialog() {
      let result = JSON.parse(JSON.stringify(this.editionList))
      result.shift()
      return result
    },
    levelListDialog() {
      let result = this.editionList.find( item => item.editionId == this.editionProgressData.edit)
      if (result != undefined) {
        return result.courseLevelInfoList||[]
      } else {
        this.screenData.courseLevel = "";
        return [];
      }
    },
    courseEditionId() {
      return this.screenData.courseEditionId
    },
    courseLevel() {
      return this.screenData.courseLevel
    },
    lessonNo() {
      return this.screenData.lessonNo
    },
    unitNo() {
      return this.screenData.unitNo
    },
  },
  watch: {
    courseEditionId(newData) {
      // 版本发生变化，清空后面的值
      this.levelList = []
      this.unitList = []
      this.lessonList = []
      this.screenData.courseLevel = ''
      this.screenData.unitNo = ''
      this.screenData.lessonNo = ''
      let result = this.editionList.find( item => item.editionId == newData)
      this.levelList = result.courseLevelInfoList ||[]
    },
    courseLevel(newData) {
    this.lessonList = []
    this.unitList = []
    this.screenData.unitNo = ''
    this.screenData.lessonNo = ''
    let result = this.levelList.find( item => item.courseLevel == newData)
      if( result != undefined ) {
        result.courseUnitList.forEach( item => {
          item.label = `Unit ${ item.unitNo }`
          item.value = item.unitNo
        })
        this.unitList = result.courseUnitList
      } else {
        this.unitList = []
      }
    },
    unitNo(newData) {
      this.lessonList = []
      this.screenData.lessonNo = ''
      if( this.courseEditionId == '' || this.courseLevel == '' || newData == '') return
      this.$Api.base.getLessonList( this.courseEditionId, this.courseLevel, newData )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 && data.data.length != 0 ) {
          data.data.forEach( item => {
            item.label = `lesson ${item.unitLessonNo}`
            item.value = item.lessonNo
          })
          this.lessonList = data.data
        } else {
          this.lessonList = []
        }
      })
    },
    currentLang(){
      this.initData()
    }
  },
  created() {
    this.reqCourseEdition()
    this.initData()
    if(Object.keys(this.groupListSearchData).length !== 0) {
      this.screenData = {...this.screenData, ...this.groupListSearchData}
    }
    this.getTableData()
  },
  methods: {
    ...mapMutations([
      'setGroupListSearchData'
    ]),
    // 获取课程版本
    reqCourseEdition() {
      this.$Api.base.courseEdition().then(({ data }) => {
        if (data.code === 200) {
          this.editionList = data.data || [];
          this.editionList.unshift({
            editionId:'',
            editionNameEn:'all',
            editionNameZh:'全部',
            courseLevelInfoList:[]
          })
        }
      });
    },
    initData() {
      this.classCategoryList = [
        {
          value: null,
          label: this.$t('全部')
        },
        {
          value: 1,
          label: this.$t('免费')
        },
        {
          value: 2,
          label: this.$t('新加坡')
        },
        {
          value: 3,
          label: this.$t('亚欧')
        }
      ]
      this.classTypeList = [
        {
          value: null,
          label: this.$t('全部')
        },
        {
          value: 3,
          label: this.$t('大班课')
        },
        {
          value: 2,
          label: this.$t('小班课')
        }
      ]
      this.classStatusList = [
        {
          value: 1,
          label: this.$t('进行中')
        },
        {
          value: 2,
          label: this.$t('已完结')
        }
      ]
    },
    /**
     * 跳班级详情
     */
    jumpToClassInfo(index, data) {
      // this.$router.push(`/groupManagement/classInfo?id=${data[index].classId}`)
      // window.sessionStorage.setItem('group', data[index].classId)
      this.$router.push({
        name:"classInfo",
    　　 query: {
          id: data[index].classId,
          type: 3
        }
      })
    },
    /**
     * 跳创建班级
     */
    jumpToCreateClass() {
      this.$router.push({
        name: 'createClass',
        query: {
          // 大班课
          type: 3
        }
      })
    },
    /**
     * 跳学生详情
     */
    goStudentDetail(id) {
      this.$router.push(`/studentManagement/studentInfo?studentId=${id}`)
    },
    /**
     * 提交修改班级中英文名称
     */
    submitGroupNameResult() {
      const { newGroupName, newGroupNameEn, classId, classTypeId} = this.editGroupNameData
      changeGroupName({
        classId: classId,
        classNameEn: newGroupNameEn,
        className: newGroupName,
        classTypeId: classTypeId
      }).then( res => {
        if ( res.data.code === 200 ) {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: 'success'
          })
          this.editGroupName = false
          this.getTableData()
        } else {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    submitProgressResult() {
      const { classId, edit, level, progress } = this.editionProgressData
      changeBigGroupProgress({
        classId,
        newEditionId: edit,
        newLessonNo: progress,
        newLevel: level
      }).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: 'success'
          })
          this.editGroupProgress = false
          this.getTableData()
        } else {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    showEditGroupProgressDialog(classObj) {
      this.editionProgressData = {
        edit: classObj.courseEditionId,
        level: classObj.courseLevel,
        progress: classObj.lessonNo,
        classId: classObj.classId
      }
      this.editGroupProgress = true
    },
    closeEditGroupProgressDialog() {
      this.editionProgressData = {
        edit: '',
        level: '',
        progress: '',
        id: ''
      }
      this.editGroupProgress = false
    },
    showEditGroupNameDialog(classObj) {
      this.editGroupNameData = {
        newGroupName: '',
        newGroupNameEn: '',
        classId: classObj.classId,
        classTypeId: classObj.classTypeId
      }
      this.editGroupName = true
    },
    closeGroupNameDialog() {
      this.editGroupNameData = {
        newGroupNameEn: '',
        newGroupName: '',
        classId: ''
      }
      this.editGroupName = false
    },
    changeEditBtnFlag(value) {
      this.editionProgressData.edit = value
      this.editionProgressData.level =1
    },
    changeLevelBtnFlag(value) {
      this.editionProgressData.level = value
    },
    search() {
      if(isNaN(this.screenData.userNum)) {
        this.$notify({
          message: '班级人数请输入有效数字',
          type: 'error'
        })
        return
      }
      this.setGroupListSearchData(this.screenData)
      this.searchFunc()
    },
    indexMethod(index) {
      return index + 1
    },
    sortChange(column) {
      if (column.prop === 'user_num' && column.order === 'ascending') {
        // 升序
        this.screenData.ordering = 'user_num'
      } else if (column.prop === 'user_num' && column.order === 'descending') {
        // 降序
        this.screenData.ordering = '-user_num'
      } else {
        return
      }
      this.getTableData()
    },
    getSortClass(key) {
      const sort = this.screenData.ordering
      return sort === `${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    },
    getCurrentPage(currentPage) {
      this.currentPage = currentPage
      this.getTableData()
    },
    getPerPage(perPage) {
      this.perPage = perPage
      this.currentPage = 1
      this.getTableData()
    },
    searchFunc() {
      this.loading = true
      this.currentPage = 1
      this.getTableData()
    },
    getTableData() {
      this.loading = true;
      this.$Api.operateManagement.getBigGroupList(this.currentPage, this.perPage, this.screenData)
      .then(({ status, data }) => {
        this.total = data.data.total
        this.tableData = data.data.list
        this.loading = false
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.groupListWrapper {
  .flex {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 !important;
    span {
      display: inline-block;
      width: 37px;
    }
  }
  .jcc {
    justify-content: center;
  }
  .ul {
    display: flex;
    padding: 0 !important;
    li {
      list-style-type: none;
      padding: 4px;
      border-radius: 4px;
      margin: 0 3px;
      border: 1px solid #ccc;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .active {
    background-color: #5cc2d0;
    border: 1px solid #5cc2d0;
    color: white;
  }
}

</style>
