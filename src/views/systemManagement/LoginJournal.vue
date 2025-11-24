<template>
  <div class="login-journal-container">
    <screen-wrapper
      @search="reSubmitOperatInfo"
      :screenTitle="$t('登录日志')"
    >
      <el-form
        :inline="true"
        :model="checkOperationInfo"
        class="form-inline"
      >
        <el-form-item
          :label="$t('登录时间')"
          style="padding-left: 20px"
          v-if="Per.handleButtonPer('system.journal.loginJournal.llFilterByLoginDate')"
        >
          <el-date-picker
            v-model="checkOperationInfo.date"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('登录人')">
          <el-input
            v-model="checkOperationInfo.user"
            :placeholder="$t('请输入登录人')"
          ></el-input>
        </el-form-item>
      </el-form>
    </screen-wrapper>

    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper mt10 no-bottom-border"
    >
      <el-table
        :data="operationJournalData"
        v-loading="operationJournalLoading"
        :border="false"
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
        fit
        stripe
        class="attend-table"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          prop="id"
          width="80"
        ></el-table-column>
        <el-table-column
          :label="$t('操作时间')"
          prop="startTime"
          width="240"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('操作人')"
          prop="username"
          width="200"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="部门" prop="email" width="150" align="center"></el-table-column> -->
        <el-table-column
          :label="$t('行为')"
          prop="action"
          width="240"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="对象类型" prop="email" width="150" align="center"></el-table-column>
        <el-table-column label="对象名" prop="email" width="150" align="center"></el-table-column> -->
        <el-table-column
          label="IP"
          prop="ip"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('设备')"
          prop="device"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label=""
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="viewDetail(scope)"
            >{{$t('查看详情')}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="地点" prop="ip" width="100" align="center"></el-table-column> -->
      </el-table>
    </custom-card>

    <el-pagination
      :page-size="pageSize"
      :total="total"
      :current-page="pageNum"
      @current-change="handleCurrentChange"
      @prev-click="getCurrentPage"
      @next-click="getPerPage"
      class="pt10 pb10"
    ></el-pagination>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewDetailFlag"
    >
      <div style="height: 400px; overflow: auto">
        <pre>{{logDetail}}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'loginJournal',
  props: {

  },
  data () {
    return {
      checkOperationInfo: {
        user: '',
        date: [
          new Date(new Date().setDate(new Date().getDate() - 7)),
          new Date()
        ],
        behaviorValue: '用户登录'
      },
      pageNum: 1,
      pageSize: 20,
      total: 0,
      allBehaviorObj: [],
      operationJournalData: [],
      operationJournalLoading: false,
      tableHeight: window.innerHeight - 200 || 300,
      logDetail: null,
      viewDetailFlag: false
    };
  },
  mounted () {
    this.submitOperatInfo();
  },
  methods: {
    ...mapActions([
      'getOperationLog',
      'getAllOperationBehavior'
    ]),
    reSubmitOperatInfo () {
      this.pageNum = 1;
      this.submitOperatInfo();
    },
    async submitOperatInfo () {
      this.operationJournalLoading = true;
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        action: '',
        actions: '退出登录',
        startTime: this.checkOperationInfo.date[0] ? this.checkOperationInfo.date[0].toISOString() : '',
        endTime: this.checkOperationInfo.date[1] ? this.checkOperationInfo.date[1].toISOString() : '',
        username: this.checkOperationInfo.user
      }
      let operationData = await this.getOperationLog(data);
      this.operationJournalData = operationData.list;
      this.total = operationData.total;
      this.operationJournalData.forEach((item, index) => {
        this.$set(this.operationJournalData[index], 'startTime', `${new Date(item.startTime).toLocaleDateString()}${new Date(item.startTime).toLocaleTimeString()}`)
        this.$set(this.operationJournalData[index], 'id', `${index + 1}`)
      })
      this.operationJournalLoading = false;
    },
    getCurrentPage () {

    },
    getPerPage () {

    },
    handleCurrentChange (val) {
      this.pageNum = val;
      this.submitOperatInfo()
    },
    viewDetail (scope) {
      this.viewDetailFlag = true;
      this.logDetail = scope.row
    }
  },
  components: {

  },
};
</script>

<style lang="scss" scoped>
.form-inline {
  padding: 10px 15px 0;
}
.table-wrapper {
  padding: 0 15px;

  .attend-table {
    border: 1px solid #f1f1f1;

    table {
      width: 100%;
    }
  }
}
</style>
