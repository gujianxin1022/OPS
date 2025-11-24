<template>
  <div class="">
    <el-dialog
      title="操作详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <div>
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%; margin-top: 10px"
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        >
          <el-table-column
            prop="merchantId"
            width="80"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            prop="merchantName"
            width="180"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="操作详情"
          >
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="pageDto.total"
          :current-page="pageDto.pageNum"
          :pageSizes="[10, 20, 50, 100, 200]"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {type: Boolean, default: false}
  },
  data() {
    return {
      tableData: [],
      loading: false,
      pageDto: {
        pageNum: 0,
        pageSize: 0,
        total: 0
      },
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.pageDto.pageNum = currentPage;
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.pageDto.pageSize = perPage;
    },
  },
}
</script>

<style lang='scss' scoped>
</style>