<template>
  <el-card v-loading="loading" class="box-card-class" shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{$t('大班课活动详情')}}</span>
    </div>
    <div class="activity-wrap">
      <div class="create-activity">
        <div @click="handleEdit" class="edit-btn" v-if="!isEditStatus">
          <i class="el-icon-edit"></i>
        </div>
        <ul>
          <li>
            <span class="label">{{$t('活动编号')}}</span>
            <span v-if="!loading" class="value">{{ activityInfo.activityType + '' + activityInfo.id }}</span>
          </li>
          <li>
            <span class="label">{{$t('活动中文名称')}}</span>
            <div class="value">
              <span v-if="!isEditStatus">{{ activityInfo.activityName }}</span>
              <el-input
                v-if="isEditStatus"
                style="width:400px"
                v-model="editInfo.activityName"
                :placeholder="$t('glb-input')+currentLang=='en'?'...':'活动中文名称'"
              ></el-input>
            </div>
          </li>
          <li>
            <span class="label">{{$t('活动英文名称')}}</span>
            <div class="value">
              <span v-if="!isEditStatus">{{ activityInfo.activityNameEn }}</span>
              <el-input
                v-if="isEditStatus"
                style="width:400px"
                v-model="editInfo.activityNameEn"
                :placeholder="$t('glb-input')+currentLang=='en'?'...':'活动英文名称'"
              ></el-input>
            </div>
          </li>
          <li>
            <span class="label">{{$t('活动报名时间')}}</span>
            <div class="value">
              <span v-if="!isEditStatus && !loading">{{ DateTimeUtils.dateClockTime(activityInfo.startTime) }} - {{ DateTimeUtils.dateClockTime(activityInfo.endTime) }}</span>
              <el-date-picker
								:disabled="editInfo.status == 5 || editInfo.status == 6 || editInfo.status == 7"
                v-if="isEditStatus"
                style="width:190px"
                v-model="editInfo.startTime"
                type="datetime"
                :placeholder="$t('开始时间')"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <span v-if="isEditStatus" class="span-word">{{currentLang=='en'?'-':'至'}}</span>
              <el-date-picker
								:disabled="editInfo.status == 7"
                :picker-options="pickerOptions"
                v-if="isEditStatus"
                style="width:190px"
                v-model="editInfo.endTime"
                type="datetime"
                :placeholder="$t('结束时间')"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <span class="label">{{$t('关联大班班级')}}</span>
            <div class="value">
              <el-button v-if="isEditStatus" style="width:400px" @click="handleShowDialog">+{{$t('编辑活动班级')}}</el-button>
            </div>
          </li>
          <li>
            <div class="li-table">
              <el-table
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
                <el-table-column align="center" :label="$t('序号')" :width="currentLang == 'en' ? 120 : 80">
                  <template
                    slot-scope="scope"
                  >{{ (dialogScreenData.pageNum - 1) * dialogScreenData.pageSize + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column align="center" :label="$t('班级编号')" prop="classNo" width="120">
									<template slot-scope="scope">
										<el-button type="text" @click="goClassDetail(scope.row.classId)">{{ scope.row.classNo }}</el-button>
									</template>
								</el-table-column>
                <el-table-column align="center" :label="$t('班级名称')" prop="classNameZh" width="120"></el-table-column>
                <el-table-column align="center" :label="$t('招生地区')" prop="studentArea" width="140"></el-table-column>
                <el-table-column align="center" :label="$t('报名人数/班级报名容量')" prop="name" :width="currentLang == 'en' ? 340 : 150">
									<template slot-scope="scope">
										<span>{{ scope.row.userNum }} / {{ scope.row.userMax }}</span>
									</template>
								</el-table-column>
                <el-table-column align="center" :label="$t('已上/排课')" prop="name" :width="currentLang == 'en' ? 180 : 140">
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
										<el-button v-show="!isEditStatus" type="text" @click="handleCancelAddForPage( scope.row )">{{$t('取消关联')}}</el-button>
									</template>
								</el-table-column>
              </el-table>
            </div>
          </li>
          <li>
            <span class="label">{{$t('引导文章链接')}}</span>
            <el-button type="text" @click="openUrl(activityInfo.url)" v-if="!isEditStatus">{{activityInfo.url}}</el-button>
              <el-input
                v-if="isEditStatus"
                style="width:400px"
                v-model="editInfo.url"
                :placeholder="$t('glb-input')+currentLang=='en'?'...':'引导文章链接'"
              ></el-input>
          </li>
          <li>
            <span class="label">{{$t('活动状态')}}</span>
            <div class="value">
              <span v-if="!isEditStatus">{{ activityInfo.status | activityStatus }}</span>
              <el-radio-group v-if="isEditStatus" v-model="editInfo.status">
                <el-radio :label="4" :disabled="activityInfo.status != 4">{{$t('未开始')}}</el-radio>
                <el-radio :label="5">{{$t('进行中')}}</el-radio>
                <el-radio :label="6">{{$t('暂停')}}</el-radio>
                <el-radio :label="7">{{$t('已结束')}}</el-radio>
              </el-radio-group>
            </div>
          </li>
        </ul>
        <div class="create-activety-btns" v-if="isEditStatus">
          <el-button @click="cancelEdit">{{$t('取消更改')}}</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">{{$t('保存更改')}}</el-button>
        </div>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :before-close="handleClose"
        :title="$t('编辑活动班级')"
        :visible.sync="showEditActivityClass"
      >
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
  name: 'activityDetail',
  data() {
    return {
			saveLoading: false,
      isEditStatus: false,
      showEditActivityClass: false,
      activityInfo: {
        activityNameZh: "",
        activityNameEn: "",
        activityStatus: "",
        startTime: "",
        endTime: "",
        url: ""
			},
			pageTable: [],
      dialogTableData: [],
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
			editInfo: {},
			loading: false
    };
	},
	computed: {
		activityId() {
			return this.$route.query.id || ''
    },
    ...mapGetters([
      'currentLang'
    ])
  },
  watch: {
    showEditActivityClass(newData) {
      this.dialogTableData = []
      if( newData ) {
        this.getTableData()
      }
    }
  },
  methods: {
    openUrl( url ) {
      window.open( url, '__blank')
    },
		showAdd( row ) {
			let flag = this.pageTable.find( item => item.classId == row.classId)
			if( flag ) {
				return false
			} else {
				return true
			}
		},
		handleAddActiveiy( row ) {
			this.pageTable.push( row )
			this.$notify({
				message: this.$t('添加成功'),
				type: 'success'
			})
		},
		handleCancelAdd( row ) {
			let i = this.pageTable.findIndex( item => item.classId == row.classId )
			if( i != undefined ) {
				this.pageTable.splice( i, 1 )
				this.$notify({
					message: this.$t('移除成功'),
					type: 'success'
				})
			}
		},
    handleSave() {
			this.saveLoading = true
			let classIds = []
			this.pageTable.forEach( item => {
				classIds.push(item.classId)
			})
			let {
				id,
				activityName,
				activityNameEn,
				endTime,
				startTime,
        status,
        url
			} = this.editInfo
			let params = {
				id,
				activityName,
				activityNameEn,
				endTime,
				startTime,
				status,
        classIds,
        url
			}
			this.$Api.operateManagement.updateBigClassActivity(params)
			.then(({ status, data }) => {
				if( status == 200 && data.code == 200 ) {
					this.$notify({
						message: this.$t('更改成功'),
						type: 'success'
					})
					this.getAllData()
      		this.cancelEdit();
				}else {
					this.$notify({
						message: data.message,
						type: 'error'
					})
				}
			this.saveLoading = false
			})
    },
    handleShowDialog() {
      this.showEditActivityClass = true
    },
    handleClose() {
      this.showEditActivityClass = false
    },
    handleEdit() {
      this.isEditStatus = true
    },
    cancelEdit() {
			let { classroomClassInfoList } = this.activityInfo
			this.editInfo = JSON.parse(JSON.stringify(this.activityInfo))
			this.pageTable = JSON.parse(JSON.stringify(classroomClassInfoList || [])) 
      this.isEditStatus = false
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
		},
		goClassDetail( id ) {
			this.$router.push({
				path: `/groupManagement/classInfo?id=${ id }&type=3`
			})
		},
		getAllData() {
			this.loading = true
			if( this.activityId == '' ) return;
			this.$Api.operateManagement.getBigClassDetails( this.activityId )
			.then(({ status, data }) => {
					// this.getTableData()
				if( status == 200 && data.code == 200 ) {
					Object.assign(this.activityInfo, data.data)
					this.pageTable = JSON.parse(JSON.stringify(this.activityInfo.classroomClassInfoList || []))
					this.editInfo = JSON.parse(JSON.stringify(this.activityInfo))
					this.loading = false
				}
			})  
		},
		handleCancelAddForPage( scopeRow ) {
			this.$confirm(this.$t('此操作将取消关联此班级，是否继续？'), this.$t('提示'), {
        confirmButtonText: this.$t('my-home-Confirm'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
				this.$Api.operateManagement.cancelRelateClass(this.activityId, scopeRow.classId)
				.then(({ status, data }) => {
					if ( status == 200 && data.code == 200 ) {
						this.getAllData()
					}else {
						this.$notify({
							message: data.message,
							type: 'error'
						})
					}
				})
      }).catch(_ => {})
		}
	},
	created () {
		this.getAllData()
	}
};
</script>
<style lang="scss" scoped>
.activity-wrap {
  width: 100%;
  height: 100%;
  padding: 5px 30px;
  position: relative;
  .edit-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 14px;
    li {
      display: flex;
      margin: 25px 0;
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
        width: 1100px;
      }
    }
  }
  .create-activity {
    width: 100%;
    height: 100%;
    position: relative;
    // .create-activety-btns {
      // position: absolute;
      // left: 0;
      // bottom: -100px;
      // width: 100%;
      // text-align: center;
    // }
  }
}
</style>