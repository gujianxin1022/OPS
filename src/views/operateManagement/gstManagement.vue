<template>
  <div class="gst-management-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('税率状态')" :part="4" label-width="100">
        <el-select v-model="screenData.status" :placeholder="$t('请选择状态')">
          <el-option v-for="item in gstStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <el-button type="primary" slot="header-right" @click="goCreate">{{$t('新建税率')}}</el-button>
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
				<el-table-column align="center" :label="$t('税率名称')" prop="taxRateName"></el-table-column>
				<el-table-column align="center" :label="$t('税率')" prop="taxRate" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.taxRate }}%</span>
          </template>
        </el-table-column>
				<el-table-column align="center" :label="$t('征税用户所在地')" prop="countryNameZh" width="140"></el-table-column>
				<el-table-column align="center" :label="$t('生效时间')" prop="name" width="140">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.validStartTime) }}</span>
          </template>
        </el-table-column>
				<el-table-column align="center" :label="$t('失效时间')" prop="name" width="140">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.validEndTime) }}</span>
          </template>
        </el-table-column>
				<el-table-column align="center" :label="$t('status')" prop="name" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.status | validStatusGstFilter }}</span>
          </template>
        </el-table-column>
				<el-table-column align="center" :label="$t('创建人')" prop="createUserName" width="140"></el-table-column>
				<el-table-column align="center" :label="$t('创建时间')" prop="name" width="140">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goGSTDetail(scope.row)">{{$t('详情')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'gstManagement',
  data () {
    return {
      gstStatusOptions:[],
      screenData: {
        status: 1,
        pageSize: 50,
        pageNum: 1
      },
      total: 0,
      loading: true,
      tableData: [
        { name: 1 }
      ]
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
    initData(){
      this.gstStatusOptions = [
        { label: this.$t('生效中'), value: 1 },
        { label: this.$t('已失效'), value: 2 }
      ]
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
      this.loading = true
      let { pageNum, pageSize, status } = this.screenData
      this.$Api.operateManagement.getGstList( pageNum, pageSize, { status } )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.tableData = data.data.list
          this.total = data.data.total
        }
        this.loading = false
      })
    },
    goCreate() {
      this.$router.push('/operateManagement/createGST')
    },
    goGSTDetail(scopeRow) {
      this.$router.push(`/operateManagement/gstDetail?taxRateId=${scopeRow.id}`)
    }
  },
  created () {
    this.getTableData()
    this.initData()
  }
}
</script>
<style lang="scss" scoped>
.gst-management-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px;
}
</style>