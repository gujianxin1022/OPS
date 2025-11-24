<template>
  <div class="group-student-try-wrap">
    <div class="search-wrap mt10">
      <el-select style="width:17%" clearable v-model="screenData.team" :placeholder="$t('请选择负责团队')">
        <el-option
          v-for="item in Constants.responsiblieTeam(currentLang)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select filterable style="width:17%" clearable v-model="screenData.applyUserId" :placeholder="$t('请选择申请人')">
        <el-option v-for="(item, index) in xgAndGwListSet" :key="index" :label="item.nameEn+`${item.nameEn && item.nameZh?'-':''}`+item.nameZh" :value="item.id" />
      </el-select>
      <el-select style="width:17%" clearable v-model="screenData.status" :placeholder="$t('请选择组班状态')">
        <el-option
          v-for="item in makeGroupStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input style="width:17%" v-model="screenData.classTypeNameZh" :placeholder="$t('glb-input')+' '+$t('班型名字')" ></el-input>
      <el-input style="width:17%" v-model="screenData.parentUserId" :placeholder="$t('glb-input')+' ' + $t('家长ID')" ></el-input>
      <el-input style="width:17%" v-model="screenData.studentName" :placeholder="$t('glb-input')+' '+$t('学生名字')" ></el-input>
      <el-date-picker
        style="width:35%"
        class="mt10"
        v-model="applyDate"
        type="daterange"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        @change="timeChange"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button type="primary" @click="search">{{$t('my-home-Search')}}</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column align="center" :label="$t('序号')" :width="currentLang === 'en' ? 110 : 50">
          <template
            slot-scope="scope"
          >{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('my-home-Student')" prop="name" width="120">
          <template slot-scope="scope">
            <router-link :to="{ path : `/studentManagement/studentInfo`, query:{ studentId:scope.row.studentUserId, studentName:scope.row.studentRealName }}">
              <el-button type="text">{{ scope.row.studentRealName }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('家长ID')" prop="name" width="150">
          <template slot-scope="scope">
            <span>
              <router-link :to="{ path : `/studentManagement/parentInfo`, query:{ parentUserId:scope.row.parentUserId }}">
                <el-button type="text">{{ scope.row.parentUserId }}</el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('报名班型')" prop="name" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.classTypeNameZh }}</span>
            <el-tag type="success" v-if="scope.row.languageLabel">{{ scope.row.languageLabel | languageLabelFilter }}</el-tag>
            <el-tag type="danger" v-if="scope.row.ageLabel">{{ scope.row.ageLabel | ageLabelFilter }}</el-tag>
            <!-- <el-button type="text">
              <span>[试]{{ scope.row.classTypeNameZh }}</span>
              <el-tag type="success" v-if="scope.row.languageLabel">{{ scope.row.languageLabel | languageLabelFilter }}</el-tag>
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('班型负责团队')" prop="name" :width="currentLang === 'en' ? 130 : 120">
          <template slot-scope="scope">
            <span>{{ Filters.teamFilter( scope.row.team,currentLang==="en") }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('加入班级')" prop="name" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.className }}</span>
            <!-- <router-link :to="{ path : `/groupManagement/classInfo`, query:{ id:scope.row.classId }}">
              <el-button type="text">{{ scope.row.className }}</el-button>
            </router-link> -->
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('my-home-Gender')" prop="name" width="120">
          <template slot-scope="scope">
            <span>{{Filters.mapGender(scope.row.gender,currentLang)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('my-home-Age')" prop="age" width="120">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.birthdayMapToAge(scope.row.birthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('母语')" prop="motherTongue" width="120"></el-table-column>
        <el-table-column align="center" :label="$t('my-home-3-Country of Residence')" prop="studentLocation" :width="currentLang === 'en' ? 150 : 120"></el-table-column>
        <el-table-column align="center" :label="$t('my-home-Payment Status')" prop="name" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pay == 0?$t('my-home-non-Paid'):scope.row.pay==1?$t('my-home-Paid'):'' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('status')" prop="status" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapGroupStudentsStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('申请人')" prop="createUserName" width="120"></el-table-column>
        <el-table-column align="center" :label="$t('申请时间')" prop="name" width="140">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="130" align="center">
          <template slot-scope="scope">
            <el-button
            type="text"
            v-if="scope.row.status == 0"
            size="mini"
            @click="rollback(scope.row.id)">{{$t('撤销报名')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { parentIdValidate } from "@/utils/reg.js";
export default {
  data () {
    return {
      applyDate: [],
      total: 0,
      loading: false,
      tableData: [{name:1}],
      makeGroupStatusList: [
      ],
      screenData: {
        applyUserId: '',
        classTypeNameZh: '',
        studentName: '',
        team: '',
        status: '',
        pageNum: 1,
        pageSize: 50,
        startTime: '',
        endTime: '',
        parentUserId: ''
      }
    }
  },
  computed: {
    ...mapState({
      xgAndGwListSet: state => state.user.xgAndGwListSet,
    }),
    ...mapGetters(['currentLang'])
  },
  watch: {
    currentLang() {
      this.initData()
    }
  },
  methods: {
    initData() {
      this.makeGroupStatusList = [
        { label: this.$t('等待组班'), value: 0},
        { label: this.$t('组班成功'), value: 1},
        { label: this.$t('组班失败'), value: 2},
        { label: this.$t('撤销报名'), value: 3}
      ]
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(this.applyDate[0]).toISOString()
        this.screenData.endTime = new Date(this.applyDate[1]).toISOString()
      } else {
        this.screenData.startTime = null;
        this.screenData.endTime = null;
      }
    },
    rollback(id) {
      this.$confirm(this.$t('此操作将撤销学生报名, 是否继续?'), this.$t('警告'), {
        confirmButtonText: this.$t('my-home-Confirm'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
      .then(() => {
        this.$Api.groupManagement.cancelStudentCancel(id)
        .then(({ status, data }) => {
          if( status == 200 && data.code == 200 ) {
            this.$notify({
              message: this.$t('撤销成功'),
              type: 'success'
            })
            this.getTableData()
          } else {
            this.$notify({
              message: data.message,
              type: 'error'
            })
          }
        }).catch(_ => {})
      })
    },
    search() {
      this.screenData.pageNum = 1
      this.getTableData()
    },
    getCurrentPage( page ) {
      this.screenData.pageNum = page
      this.getTableData()
    },
    getPerPage( perPage ) {
      this.screenData.pageSize = perPage
      this.getTableData()
    },
    getTableData() {
      if (this.screenData && this.screenData.parentUserId && !parentIdValidate(this, this.screenData.parentUserId)) {
        return;
      }
      this.loading = true
      let {
        pageNum,
        pageSize,
        team,
        status,
        classTypeNameZh,
        studentName,
        applyUserId,
        startTime,
        endTime,
        parentUserId
      } = this.screenData
      let params = {
        team,
        status,
        classTypeNameZh,
        studentName,
        applyUserId,
        startTime,
        endTime,
        parentUserId
      }
      this.$Api.groupManagement.getGroupStudentsList(1, pageNum, pageSize, params)
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.tableData = data.data.list
          this.total = data.data.total
        }
      this.loading = false
      })
    }
  },
  created () {
    this.initData()
    // this.getTableData()
  }
}
</script>
<style lang="scss" scoped>
.group-student-try-wrap {
  width: 100%;
}
</style>