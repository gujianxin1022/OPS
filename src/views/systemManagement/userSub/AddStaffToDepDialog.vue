<template>
  <el-dialog 
    :before-close="closeAddStaffToDepDialog"
    :close-on-click-modal="false" 
    :title="$t('添加员工')" 
    :visible.sync="showAddStaffToDepDialog">
    <div class="top">
      <el-input
        clearable
        :placeholder="$t('请输入员工名字，按下 enter 查找')"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getTableData"
        v-model="staffName">
      </el-input>
    </div>
    <el-table
      v-loading="loading"
      :border="false"
      height="310"
      style="width: 100%"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :data="userList"
      class="mt10"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column fixed align="center" :label="$t('序号')" :width="50">
        <template slot-scope="scope">{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" width="130" prop="userCode" :label="$t('员工编号')" ></el-table-column>
      <el-table-column align="center" width="120" prop="username" :label="$t('username')" ></el-table-column>
      <el-table-column align="center" width="120" prop="email" :label="$t('电子邮箱')" ></el-table-column>
      <el-table-column align="center" width="140" prop="phone" :label="$t('电话号码')" ></el-table-column>
      <el-table-column align="center" width="120" prop="realName" :label="$t('真实姓名')" ></el-table-column>
      <el-table-column align="center" width="120" prop="name" :label="$t('my-home-Gender')" >
        <template slot-scope="scope">
          <span>{{ Filters.mapGender(scope.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" prop="nameZh" :label="$t('中文名称')" ></el-table-column>
      <el-table-column align="center" width="120" prop="nameEn" :label="$t('英文名称')" ></el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :current-page="pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeAddStaffToDepDialog">{{$t('my-home-CCancel')}}</el-button>
      <el-button type="primary" :loading="btnloading" @click="sure">{{$t('my-home-CConfirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    showAddStaffToDepDialog: {
      type: Boolean,
      default: false
    },
    nodeObj: {
      type: Object,
      default: () => {}
    },
    pageNumParent: {
      type: Number,
      default: 1
    },
    pageSizeParent: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      pageNum: 1,
      pageSize: 50,
      staffName: '',
      total: 0,
      loading: false,
      btnloading: false,
      userList: [],
      multipleSelection: []
    }
  },
  watch: {
    showAddStaffToDepDialog( newData ) {
      if( newData ) {
        this.getTableData()
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getTableData() {
      this.loading = true
      this.$Api.systemManagement
      .getNotUserList( this.nodeObj.id, this.pageNum, this.pageSize, {
        realName: this.staffName
      } )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.userList = data.data.list
          this.total = data.data.total
        }
      this.loading = false
      })
    },
    closeAddStaffToDepDialog() {
      this.$emit('closeAddStaffToDepDialog')
    },
    getCurrentPage( page ) {
      this.pageNum = page
      this.getTableData()
    },
    getPerPage( perPage ) {
      this.pageSize = perPage
      this.getTableData()
    },
    sure() {
      this.btnloading = true
      let userIds = []
      this.multipleSelection.forEach( item => {
        userIds.push(item.userId)
      })
      this.$Api.systemManagement
      .relationJobAndUser( this.nodeObj.id, userIds,JSON.parse(window.localStorage.getItem("userInfo"))?.id )
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.$notify({
            message: '添加用户到部门成功',
            type: 'success'
          })
          this.$emit('getUserSingle',this.nodeObj.id, this.pageNumParent, this.pageSizeParent )
          this.closeAddStaffToDepDialog()
        }
      this.btnloading = false
      })
    }
  }
}
</script>