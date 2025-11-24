<template>
    <el-card class="box-card-class" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{$t('创建大班课活动')}}</span>
      </div>
      <div class="activity-wrap">
        <div class="create-activity">
            <ul>
                <li>
                    <span class="label">{{$t('活动中文名称')}}</span>
                    <div class="value">
                      <el-input style="width:400px" v-model="createInfo.activityNameZh" :placeholder="$t('glb-input')+(currentLang=='en'?'...':'活动中文名称')"></el-input>
                    </div>
                </li>
                <li>
                    <span class="label">{{$t('活动英文名称')}}</span>
                    <div class="value"><el-input style="width:400px" v-model="createInfo.activityNameEn" :placeholder="$t('glb-input')+(currentLang=='en'?'...':'活动英文名称')"></el-input></div>
                </li>
                <li>
                    <span class="label">{{$t('活动报名时间')}}</span>
                    <div class="value">
                        <el-date-picker
                          style="width:184px"
                          v-model="createInfo.startTime"
                          type="datetime"
                          :picker-options="pickerOptions"
                          :default-time="nowTime"
                          :placeholder="$t('开始时间')">
                        </el-date-picker>
                        <span class="span-word">{{currentLang=='en'?'-':'至'}}</span>
                        <el-date-picker
                          style="width:184px"
                          v-model="createInfo.endTime"
                          :picker-options="pickerOptions"
                          type="datetime"
                          :placeholder="$t('结束时间')">
                        </el-date-picker>
                    </div>
                </li>
                <li>
                    <span class="label">{{$t('关联大班班级')}}</span>
                    <div class="value">
                        <el-button style="width:400px" @click="handleShowDialog">+{{$t('编辑活动班级')}}</el-button>
                    </div>
                </li>
                <li>
                  <div class="li-table">
                    <el-table
                      v-if="pageTable.length != 0"
                      :border="false"
                      :data="pageTable"
                      v-loading="dialogLoading"
                      tooltip-effect="dark"
                      fit
                      show-overflow-tooltip="true"
                      style="width: 100%"
                      stripe
                      :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
                    >
                      <el-table-column align="center" :label="$t('序号')" :width="50">
                        <template
                          slot-scope="scope"
                        >{{ (dialogScreenData.pageNum - 1) * dialogScreenData.pageSize + scope.$index + 1 }}
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('班级编号')" prop="classNo" width="120">
                        <template slot-scope="scope">
                          <el-button type="text" @click="goClassDetail(scope.row.classId)">{{ scope.row.classNo }}</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('班级名称')" prop="name" width="120">
                        <template slot-scope="scope">
                          <span>{{ scope.row.classNameZh }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('招生地区')" prop="studentArea" width="140"></el-table-column>
                      <el-table-column align="center" :label="$t('报名人数/班级报名容量')" prop="name" width="150">
                        <template slot-scope="scope">
                          <span>{{ scope.row.userNum }} / {{ scope.row.userMax }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('已上/排课')" prop="name" width="140">
                        <template slot-scope="scope">
                          <span>{{ scope.row.finishCourseNum }} / {{ scope.row.scheduleCourseNum }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" :label="$t('上课时间 bj')" prop="name" width="240">
                        <template slot-scope="scope">
							            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime).split(' ')[0]}} - {{ DateTimeUtils.dateClockTime(scope.row.endTime).split(' ')[0]}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </li>
                <li>
                  <span class="label">{{$t('引导文章链接')}}</span>
                  <div class="value">
                      <el-input style="width:400px" v-model="createInfo.url" :placeholder="$t('glb-input')+(currentLang=='en'?'...':'引导文章链接，以https://或者http://开头')"></el-input>
                  </div>
                </li>
                <li>
                    <span class="label">{{$t('活动状态')}}</span>
                    <div class="value">
                        <el-radio-group v-model="createInfo.activityStatus">
                            <el-radio :label="4">{{$t('未开始')}}</el-radio>
                            <el-radio :label="5" :disabled="true">{{$t('进行中')}}</el-radio>
                            <el-radio :label="6" :disabled="true">{{$t('暂停')}}</el-radio>
                            <el-radio :label="7" :disabled="true">{{$t('已结束')}}</el-radio>
                        </el-radio-group>
                    </div>
                </li>
            </ul>
            <div class="create-activety-btns">
              <el-button @click="handleCancelCreate">{{$t('取消')}}</el-button>
              <el-button :loading="addLoading" type="primary" @click="handleCreate">{{$t('创建')}}</el-button>
            </div>
        </div>
        <el-dialog 
          :close-on-click-modal="false" 
          :before-close="handleClose"
          :title="$t('编辑活动班级')" 
          :visible.sync="showEditActivityClass">
            <el-table
              :border="false"
              :data="dialogTableData"
              v-loading="dialogLoading"
              tooltip-effect="dark"
              fit
              show-overflow-tooltip="true"
              style="width: 100%"
              stripe
              height="400"
              :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
            >
              <el-table-column align="center" :label="$t('序号')" :width="50">
                <template
                  slot-scope="scope"
                >{{ (dialogScreenData.pageNum - 1) * dialogScreenData.pageSize + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('班级编号')" prop="classNo" width="140">
                <template slot-scope="scope">
                  <el-button type="text" @click="goClassDetail(scope.row.classId)">{{ scope.row.classNo }}</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('班级名称')" prop="name" width="140">
                <template slot-scope="scope">
                  <span>{{ scope.row.classNameZh }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('招生地区')" prop="studentArea" width="140"></el-table-column>
              <el-table-column align="center" :label="$t('报名人数/班级报名容量')" prop="name" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.userNum }} / {{ scope.row.userMax }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('已上/排课')" prop="name" width="140">
                <template slot-scope="scope">
                  <span>{{ scope.row.finishCourseNum }} / {{ scope.row.scheduleCourseNum }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('上课时间 bj')" prop="name" width="240">
                <template slot-scope="scope">
							    <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime).split(' ')[0]}} - {{ DateTimeUtils.dateClockTime(scope.row.endTime).split(' ')[0]}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" align="center" :label="$t('操作')" prop="name" width="140">
                <template slot-scope="scope">
                  <el-button type="text" v-if="showAdd(scope.row)" @click="handleAddActiveiy( scope.row )">{{$t('关联活动')}}</el-button>
                  <el-button type="text" @click="handleCancelAdd( scope.row )" v-else>{{$t('取消关联')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-dialog>
      </div>
    </el-card>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'creatActivityDetail',
  data () {
      return {
        showEditActivityClass: false,
        addLoading: false,
        nowTime: new Date().toLocaleString().split(" ")[1].slice(2),
        createInfo: {
            activityNameZh: '',
            activityNameEn: '',
            activityStatus: 4,
            startTime: '',
            endTime: '',
            url: ''
        },
        dialogTableData: [
          { name: 1, id: 1 }
        ],
        pageTable: [],
        dialogLoading: false,
        dialogScreenData: {
          pageNum: 1,
          pageSize: 50
        },
        pickerOptions: {
          disabledDate(time) {
              return time.getTime() < Date.now() - 3600 * 1000 * 24;
          }
        },//data中定义
      }
  },
  methods: {
    // 关联
    showAdd( row ) {
      let flag = this.pageTable.find( item => item.classId == row.classId)
      if( flag ) {
        return false
      } else {
        return true
      }
    },
    handleCancelAdd( row ) {
      let i = this.pageTable.findIndex( item => item.classId == row.classId )
      if( i != undefined ) {
        this.pageTable.splice( i, 1 )
        this.$notify({
          message: '移除成功',
          type: 'success'
        })
      }
    },
    handleAddActiveiy( row ) {
      this.pageTable.push( row )
      this.$notify({
        message: '添加成功',
        type: 'success'
      })
    },
    handleCancelCreate() {
      this.$router.push({
        path: '/operateManagement/bigclass'
      })
    },
    handleCreate() {
      this.addLoading = true
      let {
        activityNameZh,
        activityNameEn,
        activityStatus,
        startTime,
        endTime,
        url
      } = this.createInfo
      let classIds = []
      this.pageTable.forEach( item => {
        classIds.push( item.classId )
      })
      let params = {
        activityName: activityNameZh,
        activityNameEn: activityNameEn,
        classIds,
        endTime: new Date(endTime).toISOString(),
        startTime:new Date(startTime).toISOString(),
        status: activityStatus,
        url
      }
      this.$Api.operateManagement.createBigClassActivity(params)
      .then(({ status, data }) => {
        if ( status == 200 && data.code == 200 ) {
          this.$notify({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({
            path: `/operateManagement/activityDetail?id=${ data.data }`
          })
        }
      this.addLoading = false
      })
    },
    handleShowDialog() {
      this.showEditActivityClass = true
    },
    handleClose() {
      this.showEditActivityClass = false
    },
    goClassDetail( id ) {
      this.$router.push({
        path: `/groupManagement/classInfo?id=${ id }&type=3`
      })
    },
      getTableData() {
      this.dialogLoading = true
      this.$Api.operateManagement.getBigClassList()
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.dialogTableData = data.data
          this.dialogLoading = false
        }
      })
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ])
  }
}
</script>
<style lang="scss" scoped>
.activity-wrap {
    width: 100%;
    height: 100%;
    padding: 5px 30px;
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 14px;
        li {
            display: flex;
            margin: 20px 0;
            align-items: center;
            .label {
                margin-right: 10px;
                // width: 84px;
                color: #666;
            }
            // .value {
            .span-word {
              color: #666666;
              margin: 0 5px;
              font-size: 14px;
            }
            // }
            .li-table {
              width: 900px;
            }
        }
    }
    .create-activity {
      width: 100%;
      height: 100%;
      position: relative;
      .create-activety-btns {
        position: absolute;
        left: 0;
        bottom: -100px;
        width: 100%;
        text-align: center;
      }
    }
}
</style>