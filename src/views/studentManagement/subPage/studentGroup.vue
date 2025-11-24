<template>
  <div class="student-group-wrap" v-loading="loading">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        :label="$t('time')"
        width="180">
        <template slot-scope="scope">
          <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="str"
        :label="$t('信息')"
       >
        <template slot-scope="scope">
          <span>{{ scope.row.str }}</span>
          <el-tag v-if="scope.row.smallClassClassType == 1">{{$t('试听')}}</el-tag>
          <el-tag v-if="scope.row.smallClassClassType == 2" type="danger" >{{$t('正式')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createUserName"
        :label="$t('办理人')">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      loading: false,
      studentId: ''
    }
  },
  methods: {
    getTableData() {
      this.loading = true
      this.$Api.groupManagement.getStudentGroupDetailLog(this.studentId)
      .then(({ status, data }) => {
        if( status == 200 && data.code == 200 ) {
          this.tableData = data.data
          this.tableData.forEach( item => {
            if ( item.type == 0 ) {
              item.str = `${this.$t('报名班型')} ${item.classTypeName}`
            } else if( item.type == 1 ) {
              item.str = `${this.$t('加入班级')} ${item.className}`
            } else if( item.type == 3 ) {
              item.str = `${this.$t('撤销报名')} ${item.classTypeName}`
            } else if( item.type == 2 ) {
              item.str = `${this.$t('组班失败')} ${item.classTypeName}`
            }
          })
        }
        this.loading = false
      })
    }
  },
  created () {
    if( this.$route.query.studentId ) {
      window.sessionStorage.setItem('student', this.$route.query.studentId )
      this.studentId = this.$route.query.studentId
    } else {
      this.studentId = window.sessionStorage.getItem('student')
    }
    this.getTableData()
  }
}
</script>
<style lang="scss" scoped>
.student-group-wrap {
  width: 100%;
  height: 100%;
}
</style>
