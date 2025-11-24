<template>
  <div>
    <el-dialog @close="beforeCloseDialog" :before-close="close" :close-on-click-modal="false" :title="currentTask.description" center :visible.sync="dialogVisiable">
      <div class="dialog-item">
        <span class="key">{{$t('任务状态')}}</span>
        <el-radio v-model="taskStatusRadio" :label="1">{{$t('开启')}}</el-radio>
        <el-radio v-model="taskStatusRadio" :label="2">{{$t('关闭')}}</el-radio>
      </div>
      <div v-if="taskStatusRadio == 1">
        <div class="dialog-item">
          <span class="key">{{$t('奖励数量')}}</span>
          <el-input-number v-model="currentTask.rewardCoin" @change="toInteger" :min="1" :max="10000" :label="$t('请输入老用户积分')"></el-input-number>
          <span>{{$t('积分')}}</span>
        </div>
        <div class="dialog-item">
          <span class="key">{{$t('任务有效期')}}</span>
          <span>
            <el-date-picker :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd hh:mm:ss" v-model="taskDateValid" type="datetimerange" range-separator="-" :start-placeholder="$t('开始日期')" :end-placeholder="$t('结束日期')">
            </el-date-picker>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiable = false">{{$t('my-home-CCancel')}}</el-button>
        <el-button :loading="btnLoading" type="primary" @click="confirmDialog()">{{$t('确定')}}</el-button>
      </span>
    </el-dialog>
    <el-table :border="false" :data="tableData" v-loading="loading" tooltip-effect="dark" fit show-overflow-tooltip="true" style="width: 100%;margin-top:10px" stripe :header-cell-style="{background:'#f1f1f1',color:'#606266'}">
      <el-table-column align="center" :label="$t('序号')" :width="50">
        <template slot-scope="scope">{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('任务')" prop="description" min-width="240"></el-table-column>
      <el-table-column align="center" :label="$t('奖励积分')" prop="rewardCoin" min-width="120"></el-table-column>
      <el-table-column align="center" :label="$t('任务状态')" prop="status" min-width="80">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 1">{{$t('开启')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 2">{{$t('关闭')}}</el-tag>
          <el-tag type="info" v-if="scope.row.status == 3">{{$t('失效')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('有效时间')" prop="taskTimer" min-width="220">
        <template slot-scope="scope">
          {{DateTimeUtils.dateClockTime(scope.row.validStartTime)}} ~ {{DateTimeUtils.dateClockTime(scope.row.validEndTime)}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')" prop="op" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialogVisiable(scope.row)" :disabled="scope.row.status == 3">{{$t('设置')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination :total="total" :current-page="screenData.pageNum" @getCurrentPage="getCurrentPage" @getPerPage="getPerPage" />
  </div>
</template>
<script>
import moment from "moment"
export default {

  components: {

  },

  data() {
    return {
      coinInputCount: null,
      taskDateValid: [],
      dialogVisiable: false,
      currentTask: {},
      taskStatusRadio: 1,
      loading: false,
      btnLoading: false,
      tableData: [],
      total: 0,
      screenData: {
        pageNum: 1,
        pageSize: 50
      }
    }
  },

  watch: {

  },

  created() {
    this.getCoinProductList()
  },

  methods: {
    getCoinProductList() {
      this.loading = true
      this.$Api.coinManagement.getCoinBaseTask(this.screenData.pageNum, this.screenData.pageSize).then(({ status, data }) => {
        this.total = data.data.total
        this.tableData = data.data.list
        this.loading = false
      }, _ => {
        this.loading = false
      })
    },

    beforeCloseDialog() {
      this.coinInputCount = null
    },
    confirmDialog() {
      this.btnLoading = true
      let params = {
        id: this.currentTask.id,
        rewardCoin: this.currentTask.rewardCoin,
        status: this.taskStatusRadio,
        validStartTime: Array.isArray(this.taskDateValid) && this.taskDateValid.length != 0 ? moment(`${this.taskDateValid[0]}`).toISOString() : '',
        validEndTime: Array.isArray(this.taskDateValid) && this.taskDateValid.length != 0 ? moment(`${this.taskDateValid[1]}`).toISOString() : '',
      }
      this.$Api.coinManagement.putCoinBaseTask(params).then(res => {
        this.btnLoading = false
        if (res.data.code == 200) {
          this.$notify({
            message: '设置成功',
            type: 'success'
          })
          this.dialogVisiable = false
          this.getCoinProductList()
        } else {
          this.$notify({
            message: `设置失败 ${res.data.message}`,
            type: 'error'
          })
        }
      })
    },
    openDialogVisiable(item) {
      this.currentTask = item
      this.taskStatusRadio = item.status == 1 ? 1 : 2
      this.taskDateValid = [this.DateTimeUtils.dateClockTime(item.validStartTime), this.DateTimeUtils.dateClockTime(item.validEndTime)]
      this.dialogVisiable = true
    },
    getCurrentPage(currentPage) {
      this.screenData.pageNum = page
      this.getCoinProductList()
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage
      this.getCoinProductList()
    },
    toInteger() {
      let reg = /^[0-9]+$/
      if (!reg.test(this.currentTask.rewardCoin)) {
        this.$notify({
          message: '请输入1-99999的整数',
          type: 'warning'
        })
        // 用以在dom渲染挂载后重新触发dom渲染挂载
        this.$nextTick(() => {
          this.currentTask.rewardCoin = parseInt(this.currentTask.rewardCoin)
        })
      }
    }

  }

}

</script>
<style lang="scss" scoped>
.dialog-item {
  margin-bottom: 30px;

  .key {
    width: 120px;
    display: inline-block;
    margin-right: 20px;
  }
}

</style>
