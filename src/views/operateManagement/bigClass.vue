<template>
    <div class="big-class-wrap">
        <div class="bigclass-search-wrap">
            <div class="bigclass-search-left-wrap">
              <el-button @click="goCreate">{{$t('创建大班课活动')}}</el-button>
            </div>
            <div class="bigclass-search-right-wrap">
							<el-select v-model="activityStatus" :placeholder="$t('活动状态')" :class="{'input-width': currentLang === 'en'}">
								<el-option
									v-for="(item,index) in bigClassStatusOptions"
									:key="index"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<el-input v-model="activityName" class="bigclass-search-right-input" :placeholder="$t('glb-input')"></el-input>
              <el-button type="primary" @click="search">{{$t('my-home-Search')}}</el-button>
            </div>
        </div>
				<div class="bigclass-table-wrap">
					<el-table
						:border="false"
						:data="tableData"
						v-loading="loading"
						tooltip-effect="dark"
						fit
						show-overflow-tooltip="true"
						style="width: 100%;margin-top:40px"
						stripe
						:header-cell-style="{background:'#f1f1f1',color:'#606266'}"
					>
						<el-table-column fixed align="center" :label="$t('序号')" :width="currentLang == 'en' ? 120 : 50">
							<template
								slot-scope="scope"
							>{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}
							</template>
						</el-table-column>
						<el-table-column fixed align="center" :label="$t('活动编号')" prop="name" width="140">
							<template slot-scope="scope">
								<el-button type="text" @click="goDetail(scope.row.id)">{{ scope.row.activityType + '' + scope.row.id }}</el-button>
							</template>
						</el-table-column>
						<el-table-column fixed align="center" :label="$t('活动名称')" prop="activityName" width="140"></el-table-column>
						<el-table-column align="center" :label="$t('开始报名时间')" :width="currentLang == 'en' ? 160 : 140">
							<template slot-scope="scope">
								<span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('截止报名时间')" :width="currentLang == 'en' ? 160 : 140">
							<template slot-scope="scope">
								<span>{{ DateTimeUtils.dateClockTime(scope.row.endTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('活动关联班级')" prop="name" width="210">
							<template slot-scope="scope">
								<p
								v-for="( item, index ) in scope.row.classroomClassInfoList" 
								:key="index"
								>
								<el-button 
									type="text"
									@click="goClassDetail(item.classId)">{{ item.classNameZh }} <span v-if="item.studentArea">({{ item.studentArea }})</span></el-button>
								</p>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('总报名人数')" prop="totalApplyNum" :width="currentLang == 'en' ? 180 : 140">
							<template slot-scope="scope">
								<span>{{ Number(scope.row.totalApplyNum).toLocaleString() }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('活动状态')" prop="name" width="140">
							<template slot-scope="scope">
								<span>{{ scope.row.status | activityStatus }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('最近修改人')" prop="updateUserName" width="140"></el-table-column>
						<el-table-column align="center" :label="$t('最近修改时间')" prop="" width="140">
							<template slot-scope="scope">
								<span>{{ DateTimeUtils.dateClockTime(scope.row.updateTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="$t('创建人')" prop="createUserName" width="140"></el-table-column>
						<el-table-column align="center" :label="$t('创建时间')" prop="name" :width="currentLang == 'en' ? 160 : 140">
							<template slot-scope="scope">
								<span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
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
import { mapGetters } from "vuex";
export default {
	name: 'bigclass',
  data () {
		return {
			bigClassStatusOptions: [
			],
			tableData: [],
			loading: false,
			activityName: '',
			activityStatus: '',
			total: 0,
			screenData: {
				pageSize: 50,
				pageNum: 1
			}
		}
	},
	computed: {
		...mapGetters([
      'currentLang'
    ])
	},
	watch:{
		currentLang(){
			this.initData()
		}
	},
	methods: {
		initData() {
			this.bigClassStatusOptions = [
				{ label: this.$t('my-home-4-All'), value: -1 },
				{ label: this.$t('未开始'), value: 4 },
				{ label: this.$t('进行中'), value: 5 },
				{ label: this.$t('暂停'), value: 6 },
				{ label: this.$t('已结束'), value: 7 }
			]
		},
		getCurrentPage( page ) {
			this.screenData.pageNum = page
			this.getTableData()
		},
		getPerPage( perPage ) {
			this.screenData.pageSize = perPage
			this.getTableData()
		},
		goCreate() {
			this.$router.push({
				path: '/operateManagement/creatActivityDetail'
			})
		},
		goDetail( id ) {
			this.$router.push({
				path: `/operateManagement/activityDetail?id=${ id }`
			})
		},
		goClassDetail( id ) {
			this.$router.push({
				path: `/groupManagement/classInfo?id=${ id }&type=3`
			})
		},
		search() {
			this.screenData.pageNum = 1
			this.screenData.pageSize = 50
			this.getTableData()
		},
		getTableData() {
			this.loading = true
			let { pageNum, pageSize } = this.screenData
			let { activityName, activityStatus } = this
			let status = activityStatus == -1 ? '' : activityStatus
			let obj = {
				activityName,
				status
			}, params = {}
			for( var key in obj ) {
				if(obj[key] !== '') {
					params[key] = obj[key]
				}
			}
			this.$Api.operateManagement.getBigClassActivityList(
				pageNum,
				pageSize,
				params
			)
			.then(({ status, data }) => {
				if ( status == 200 && data.code == 200 ) {
					this.tableData = data.data.list
					this.total = data.data.total
				}
			this.loading = false
			})
		}
	},
	created () {
		this.initData()
		this.getTableData()
	}
}
</script>
<style lang="scss">
.big-class-wrap {
    width: 100%;
    height: 100%;
		padding: 5px 10px;
		.bigclass-search-wrap {
			padding: 10px 0;
			display: flex;
			position: relative;
			.bigclass-search-right-wrap {
				position: absolute;
				right: 0;
				display: flex;
				.bigclass-search-right-input {
					margin: 0 10px;
				}
			}
			.bigclass-search-left-wrap {
				position: absolute;
				left: 0;
				display: flex;
			}
		}
}
.input-width {
  .el-input__inner {
    width: 160px !important;
  }
}
</style>