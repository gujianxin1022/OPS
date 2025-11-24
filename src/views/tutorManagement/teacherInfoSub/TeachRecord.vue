<template>
  <div class="teach-record-wrap">
    <div class="class-classify mt20">
      <el-tabs
        v-model="activeClass"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          :label="labelOne"
          name="first"
        ></el-tab-pane>
        <el-tab-pane
          :label="labelSmall"
          name="second"
        ></el-tab-pane>
        <el-tab-pane
          :label="labelBig"
          name="third"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="teach-record-top mt20">
      <el-radio-group
        v-model="dateTime"
        @change="changeRadion"
      >
        <el-radio-button label="1">{{$t('本周')}}</el-radio-button>
        <el-radio-button label="2">{{$t('上周')}}</el-radio-button>
        <el-radio-button label="3">{{$t('本月')}}</el-radio-button>
        <el-radio-button label="7">{{$t('上月')}}</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="applyDate"
        style="margin-left:15px;width:200px;"
        type="daterange"
        value-format="yyyy-MM-dd"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        size="small"
        @change="timeChange"
      />
    </div>
    <div class="mt10">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :height="tableHeight"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <!-- 使用 v-if 会使字段列乱序，使用 key 属性可解决 -->
        <el-table-column
          key="num"
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template
            slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          key="startTime"
          :label="$t('上课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{DateTimeUtils.dateClockTime(scope.row.startTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="first-studentRealName"
          v-if="activeClass==='first'"
          :label="$t('学生名字')"
          prop="studentRealName"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{ path : `/studentManagement/studentInfo`, query:{ studentId:scope.row.studentUserId, studentName:scope.row.studentRealName }}"
              >
                {{ scope.row.studentRealName }}
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          key="first-parentUsername"
          v-if="activeClass==='first'"
          :label="$t('家长ID')"
          prop="parentUserId"
          width="180"
          align="center"
        ></el-table-column>
        <!-- 小班课家长学生 -->
        <el-table-column
          key="second-studentRealName"
          v-if="activeClass==='second'"
          :label="$t('学生名字')"
          prop="studentRealName"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-for="student in scope.row.classroomClassMemberInfoList"
              :key="student.studentUserId"
            >
              <router-link
                :to="{ path : `/studentManagement/studentInfo`, query:{ studentId:student.studentUserId ,studentName:student.realName}}"
              >
                {{ student.realName }}
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          key="second-parentUsername"
          v-if="activeClass==='second'"
          :label="$t('家长ID')"
          prop="parentUserId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-for="student in scope.row.classroomClassMemberInfoList"
              :key="student.studentUserId"
            >
              <router-link
                :to="{ path : `/studentManagement/parentInfo`, query:{ parentUserId: student.parentUserId }}"
              >
                {{ student.parentUserId }}
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <!-- 小班课家长学生 -->
        <el-table-column
          key="courseEditionId"
          :label="$t('my-home-Curriculum')"
          prop="courseEditionId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{currentLang === "zh" ? scope.row.editionNameOpsZh : scope.row.editionNameOpsEn}}
              level{{scope.row.courseLevel}} lesson{{scope.row.lessonNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="classTypeId"
          :label="$t('schedule-Class Size')"
          prop="classTypeId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.classTypeId | mapClassType}} </span>
          </template>
        </el-table-column>
        <el-table-column
          key="status"
          :label="$t('schedule-Class completion status')"
          prop="status"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.status | mapClassStatus}}</span>
          </template>
        </el-table-column>
        <!-- 1v1顾问学管 -->
        <el-table-column
          key="first-adviserUserName"
          v-if="activeClass==='first'"
          :label="$t('顾问&学管')"
          prop="adviserUserName"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <div>
                <p>{{$t('学管')}}：<span>{{scope.row.xgUserName}}</span> </p>
                <p>{{$t('顾问')}}：<span>{{scope.row.adviserUserName}}</span> </p>
              </div>
              <el-button
                type="text"
                slot="reference"
              >{{$t('点击查看')}}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 小班课顾问学管 -->
        <el-table-column
          key="second-adviserUserName"
          v-if="activeClass==='second'"
          :label="$t('顾问&学管')"
          prop="name"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <div>
                <p>{{$t('学管')}}：<span
                    v-for="(i,index) in scope.row.classroomClassMemberInfoList"
                    :key="index"
                  >{{i.xgUserName}}<span
                      v-if="index !==scope.row.classroomClassMemberInfoList.length - 1"
                    >、</span></span></p>
                <p>{{$t('顾问')}}：<span
                    v-for="(i,index) in scope.row.classroomClassMemberInfoList"
                    :key="index"
                  >{{i.adviserUserName}}<span
                      v-if="index !==scope.row.classroomClassMemberInfoList.length - 1"
                    >、</span></span> </p>
              </div>
              <el-button
                type="text"
                slot="reference"
              >{{$t('点击查看')}}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          key="Replay"
          :label="$t('课堂回放')"
          align="center"
          width="150"
          v-if="Per.handleButtonPer('teach.tutorMT.teachingRecord.trViewTeachingPlayback')"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.replayStatus !== PLAY_BACK_TYPES.DELETE && scope.row.replayStatus !== PLAY_BACK_TYPES.EMPTY"
              :disabled="scope.row.replayStatus === PLAY_BACK_TYPES.ACTIVING"
              @click="playback(scope.row)"
              type="text"
              size="small"
            >
              <span v-if="scope.row.replayStatus === PLAY_BACK_TYPES.TO_ACTIVE">{{$t('激活回放')}}</span>
              <span v-else-if="scope.row.replayStatus === PLAY_BACK_TYPES.ABLE">{{$t('课堂回放')}}</span>
              <span v-else-if="scope.row.replayStatus === PLAY_BACK_TYPES.ACTIVING">{{$t('激活中')}}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          key="checkFlag"
          :label="$t('课堂质检')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleQualityCheck(scope.row, 1)" v-if="scope.row.checkFlag === 0">{{$t('质检')}}</el-button>
            <span v-if="scope.row.checkFlag === 1">{{ scope.row.isQualified === 1 ? $t('不合格') : $t('合格')}}</span>
            <el-button type="text" size="small" @click="handleQualityCheck(scope.row, 2)" v-if="scope.row.checkFlag === 1">{{$t('修改')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          key="complainFlag"
          :label="$t('课堂投诉')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleTouch(scope.row, 1)" v-if="scope.row.complainFlag === 0">{{$t('投诉')}}</el-button>
            <span v-if="scope.row.complainFlag === 1">{{$t('已投诉')}}</span>
            <el-button type="text" size="small" @click="handleTouch(scope.row, 2)" v-if="scope.row.complainFlag === 1">{{$t('修正')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="currentPage"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div> 
    <ClassCallBack
      :classType="currentCBclassTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    ></ClassCallBack>
    <teacherDialog
      :visible="showDialog"
      :isQualityCheck="isQualityCheck"
      :isModify="isModify"
      :virtualclassId="currentClassId"
      :tutorUserId="screenData.tutorUserId"
      @close="handleCloseDialog"
      @submit="handleSubmit"
    ></teacherDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClassCallBack from '../../../components/ClassCallBack';
import { PLAY_BACK_TYPES } from "@/utils/constants";
import teacherDialog from './teacherDialog.vue';
export default {
  components: {
    ClassCallBack,
    teacherDialog
  },
  data () {
    return {
      dateTime: '1',
      applyDate: '',
      loading: false,
      pageSize: 50,
      total: 0,
      currentPage: 1,
      tableHeight: window.innerHeight - 200 || 300,
      tableData: [
        {
          name: '111'
        }
      ],
      screenData: {
        tutorUserId: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 50
      },
      labelOne: null,
      labelSmall: null,
      labelBig: null,
      activeClass: 'first',
      currentIndex: '',
      currentCallBackId: "",
      showCallBack: false,
      currentCBclassTypeId: 0,
      userId: JSON.parse(window.localStorage.getItem("userInfo")).id,
      PLAY_BACK_TYPES: PLAY_BACK_TYPES,
      currentClassId: "",
      showDialog: false,
      isQualityCheck: false,
      isModify: false
    }
  },
  computed: {
    ...mapGetters(['currentLang'])
  },
  methods: {
    initData () {
      this.labelOne = this.$t('1对1')
      this.labelSmall = this.$t('小班课')
      this.labelBig = this.$t('大班课')
    },
    showPlay ({ startTime }) {
      if (new Date(startTime) * 1 > new Date() * 1) {
        return false
      } else {
        return true
      }
    },
    changeRadion (val) {
      if (val == 1) {
        //上周
        this.screenData.startTime = this.DateTimeUtils.getWeekTime(0)
        this.screenData.endTime = this.DateTimeUtils.getWeekTime(-6)
      } else if (val == 2) {
        // 本周
        this.screenData.startTime = this.DateTimeUtils.getWeekTime(7)
        this.screenData.endTime = this.DateTimeUtils.getWeekTime(1)
      } else if (val == 3) {
        // 本月
        let day = new Date().setDate(1)
        let h = new Date(day).setHours(0)
        let m = new Date(h).setMinutes(0)
        let s = new Date(m).setSeconds(0)
        this.screenData.startTime = new Date(s).toISOString()
        this.screenData.endTime = new Date(this.DateTimeUtils.getLastDay(s)).toISOString()
      } else if (val == 7) {
        // 上月
        let mou = new Date().getMonth()
        let mouth = new Date().setMonth(mou - 1)
        let day = new Date(mouth).setDate(1)
        let h = new Date(day).setHours(0)
        let m = new Date(h).setMinutes(0)
        let s = new Date(m).setSeconds(0)
        this.screenData.startTime = new Date(s).toISOString()
        this.screenData.endTime = new Date(this.DateTimeUtils.getLastDay(s)).toISOString()
      }
      this.getData(this.currentIndex)
    },
    timeChange (val) {
      // 时间选择器
      this.dateTime = -1
      this.screenData.startTime = new Date(`${val[0]} 00:00`).toISOString()
      this.screenData.endTime = new Date(`${val[1]} 23:59`).toISOString()
      this.getData(this.currentIndex)
    },
    getCurrentPage (page) {
      this.screenData.pageNum = page
      this.getData(this.currentIndex)
    },
    getPerPage (perPage) {
      this.screenData.pageSize = perPage
      this.getData(this.currentIndex)
    },
    handleQualityCheck (scopeRow, type) {
      this.isQualityCheck = true
      this.isModify = type === 2
      this.showDialog = true
      this.currentClassId = scopeRow.virtualclassId
    },
    handleTouch (scopeRow, type) {
      this.isQualityCheck = false
      this.isModify = type === 2
      this.showDialog = true
      this.currentClassId = scopeRow.virtualclassId
    },
    handleSubmit () {
      this.getData(this.currentIndex)
      this.showDialog = false
    },
    handleCloseDialog () {
      this.showDialog = false
    },
    handleCloseCallBack () {
      this.showCallBack = false
    },
    isCurrentXgOrGw(row) {
      if(this.activeClass === 'first') {
        return this.userId === row.xgUserId || this.userId === row.adviserUserId
      } else if(this.activeClass === 'second') {
        return row.classroomClassMemberInfoList.find(t => t.xgUserId === this.userId || t.adviserUserId === this.userId)
      }
    },
    playback (scopeRow) {
      const {replayStatus} = scopeRow
      let classTypeId
      switch (this.activeClass) {
        case 'first':
          classTypeId = 1
          break;
        case 'second':
          classTypeId = 2
          break;
        case 'third':
          classTypeId = 3
          break;
        default:
          break;
      }
      if(replayStatus === PLAY_BACK_TYPES.ABLE) {
        this.currentCallBackId = scopeRow.virtualclassId
        this.currentCBclassTypeId = classTypeId
        this.showCallBack = true
      } else if (replayStatus === PLAY_BACK_TYPES.TO_ACTIVE){
        // const isCurrentXgOrGw = this.isCurrentXgOrGw(scopeRow)
        // if (!isCurrentXgOrGw) return this.$notify.warning(this.$t('您没有操作权限'))
        this.$Api.base.activeReplay(classTypeId, scopeRow.virtualclassId, this.userId, 5).then(({status, data:{data, code}}) => {
          if(status !== 200 || code !== 200) return Promise.reject()
          this.getData(this.currentIndex)
          return this.$notify.warning(this.$t('操作成功'))
        })
      } 
    },
    getData (tabIndex) {
      this.loading = true
      this.screenData.tutorUserId = this.$route.query.id
      let api;
      if (tabIndex == 1) {
        api = this.$Api.tutorManagement.smallClassRecord(this.screenData)
        // api = smallClassRecord
      } else if (tabIndex == 2) {
        api = this.$Api.tutorManagement.bigClassRecord(this.screenData)
        // api = bigClassRecord
      } else {
        api = this.$Api.tutorManagement.oneClassRecord(this.screenData)
        // api = oneClassRecord
      }

      // this.$Api.tutorManagement.teachRecordData(this.screenData)
      api
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list
            this.total = data.data.total
            this.loading = false
          }
        })
    },
    handleClick (tab, event) {
      this.currentIndex = tab.index
      this.getData(this.currentIndex)
    }
  },
  watch: {
    currentLang () {
      this.initData()
    }
  },
  created () {
    this.initData()
    this.screenData.startTime = this.DateTimeUtils.getWeekTime(0)
    this.screenData.endTime = this.DateTimeUtils.getWeekTime(-6)
    this.getData(this.currentIndex)
  }
}
</script>
