<template>
  <div>
    <el-table :border="false" :data="tableData" v-loading="loading" tooltip-effect="dark" fit show-overflow-tooltip="true" style="width: 100%;margin-top:10px" stripe :header-cell-style="{background:'#f1f1f1',color:'#606266'}">
      <el-table-column align="center" :label="$t('序号')" :width="50">
        <template slot-scope="scope">{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('功能')" prop="consumeType" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.consumeType == 1">{{$t('积分兑换')}}</div>
          <div v-if="scope.row.consumeType == 2">{{$t('积分抵现')}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('适用商品数量')" prop="productNum" min-width="120"></el-table-column>
      <el-table-column align="center" :label="$t('功能状态')" prop="status" min-width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 1">{{$t('开启')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">{{$t('关闭')}}</el-tag>
          <el-tag type="info" v-if="scope.row.status == 3">{{$t('失效')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')" prop="op" min-width="120">
        <template slot-scope="scope">
          <!-- :disabled="scope.row.status == 3 -->
          <el-button type="text" @click="goToCoinExchange(scope.row)" :disabled="true">{{$t('设置')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination :total="total" :current-page="screenData.pageNum" @getCurrentPage="getCurrentPage" @getPerPage="getPerPage" />
  </div>
</template>
<script>
export default {

  components: {

  },

  data() {
    return {
      loading: false,
      total: 0,
      tableData: [],
      screenData: {
        pageNum: 1,
        pageSize: 50
      }
    }
  },

  watch: {

  },

  created() {
    this.getCoinConsumeList()
  },

  methods: {
    // 获取列表数据
    getCoinConsumeList() {
      this.loading = true
      this.$Api.coinManagement.getCoinConsume(this.screenData.pageNum, this.screenData.pageSize).then(({ status, data }) => {
        this.total = data.data.total
        this.tableData = data.data.list
        this.loading = false
      }, _ => {
        this.loading = false
      })
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page
      this.getCoinConsumeList()
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage
      this.getCoinConsumeList()
    },
    goToCoinExchange(item) {
      this.$router.push(`/operateManagement/coinExchange?id=${item.id}&name=${item.consumeType}&status=${item.status}`)
    }
  }

}

</script>
<style lang="scss" scoped></style>
