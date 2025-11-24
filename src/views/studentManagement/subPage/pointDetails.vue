<template>
  <div class="potin-details-wrap">
    <div class="potin-total">
      {{ $t('剩余可用积分') }}
      <el-tag type="danger">{{ totalCoinRemain | thousandthPercentile }}</el-tag>&nbsp;&nbsp;
      {{ $t('累计获得积分') }}
      <el-tag type="success">{{ totalCoinGive | thousandthPercentile }}</el-tag>&nbsp;&nbsp;
      {{ $t('累计消耗积分') }}
      <el-tag type="warning">{{ totalCoinPay | thousandthPercentile }}</el-tag>&nbsp;&nbsp;
      {{ $t('累计失效积分') }}
      <el-tag type="info">{{ totalCoinExpire | thousandthPercentile }}</el-tag>&nbsp;&nbsp;
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('积分获得')" name="got">
        <el-table
          :data="potinGotTableData"
          tooltip-effect="dark"
          :border="false"
          style="width: 100%"
        >
          <el-table-column align="center" :label="$t('序号')" :width="currentLang == 'en' ? 110 : 50">
            <template slot-scope="scope">{{
                (gotPageObj.pageNum - 1) * gotPageObj.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('获得时间')" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('获得积分')" prop="coin" align="center"></el-table-column>
          <el-table-column :label="$t('获得原因')" prop="describe" align="center">
            <template slot-scope="scope">
              <span>{{ currentLang == 'en' ? scope.row.describeEn : scope.row.describeZh }}</span>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="total"
          :current-page="gotPageObj.pageNum"
          :pageSize="gotPageObj.pageSize"
          @getCurrentPage="getCurrentPageGot"
          @getPerPage="getPerPageGot"
          :pageSizes="[10, 20, 50, 100, 200]"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('积分消耗')" name="lose">
        <el-table
          :data="potinLoseTableData"
          tooltip-effect="dark"
          :border="false"
          style="width: 100%"
        >
          <el-table-column align="center" :label="$t('序号')" :width="currentLang == 'en' ? 110 : 50">
            <template slot-scope="scope">{{
                (losePageObj.pageNum - 1) * losePageObj.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('消耗时间')" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('消耗积分')" prop="coin" align="center"></el-table-column>
          <el-table-column :label="$t('消耗原因')" prop="describe" align="center">
            <template slot-scope="scope">
              <span>{{ currentLang == 'en' ? scope.row.describeEn : scope.row.describeZh }}</span>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="total"
          :current-page="losePageObj.pageNum"
          :pageSize="losePageObj.pageSize"
          @getCurrentPage="getCurrentPageLose"
          @getPerPage="getPerPageLose"
          :pageSizes="[10, 20, 50, 100, 200]"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('失效积分')" name="outtime">
        <el-table
          :data="potinOutTimeTableData"
          tooltip-effect="dark"
          :border="false"
          style="width: 100%"
        >
          <el-table-column align="center" :label="$t('序号')" :width="currentLang == 'en' ? 110 : 50">
            <template slot-scope="scope">{{
                (outtimePageObj.pageNum - 1) * outtimePageObj.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('失效时间')" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('失效积分')" prop="coin" align="center"></el-table-column>
          <el-table-column :label="$t('失效原因')" prop="describe" align="center">
            <template slot-scope="scope">
              <span>{{ currentLang == 'en' ? scope.row.describeEn : scope.row.describeZh }}</span>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="total"
          :current-page="outtimePageObj.pageNum"
          :pageSize="outtimePageObj.pageSize"
          @getCurrentPage="getCurrentPageOuttime"
          @getPerPage="getPerPageOutTime"
          :pageSizes="[10, 20, 50, 100, 200]"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      totalCoinExpire: 0,
      totalCoinGive: 0,
      totalCoinPay: 0,
      totalCoinRemain: 0,
      activeName: '',
      potinGotTableData: [],
      potinLoseTableData: [],
      potinOutTimeTableData: [],
      total: 0,
      gotPageObj: {
        pageNum: 1,
        pageSize: 50
      },
      losePageObj: {
        pageNum: 1,
        pageSize: 50
      },
      outtimePageObj: {
        pageNum: 1,
        pageSize: 50
      }
    }
  },
  computed: {
    parentId() {
      return this.$route.query.parentUserId
    },
    ...mapGetters(['currentLang'])
  },
  watch: {
    activeName(newData) {
      this.getTableData(newData)
    }
  },
  methods: {
    getCurrentPageGot(page) {
      this.gotPageObj.pageNum = page
      this.getTableData('got')
    },
    getPerPageGot(perPage) {
      this.gotPageObj.pageSize = perPage
      this.getTableData('got')
    },
    getCurrentPageLose(page) {
      this.losePageObj.pageNum = page
      this.getTableData('lose')
    },
    getPerPageLose(perPage) {
      this.losePageObj.pageSize = perPage
      this.getTableData('lose')
    },
    getCurrentPageOuttime(page) {
      this.outtimePageObj.pageNum = page
      this.getTableData('outtime')
    },
    getPerPageOutTime(perPage) {
      this.outtimePageObj.pageSize = perPage
      this.getTableData('outtime')
    },
    getTableData(type) {
      switch (type) {
        case 'got':
          this.$Api.coinManagement
            .getParentGiveList(this.parentId, this.gotPageObj.pageNum, this.gotPageObj.pageSize)
            .then(({status, data}) => {
              if (status == 200 && data.code == 200) {
                this.potinGotTableData = data.data.list
                this.total = data.data.total
              }
            })
          break;
        case 'lose':
          this.$Api.coinManagement
            .getParentPayList(this.parentId, this.losePageObj.pageNum, this.losePageObj.pageSize)
            .then(({status, data}) => {
              if (status == 200 && data.code == 200) {
                this.potinLoseTableData = data.data.list
                this.total = data.data.total
              }
            })
          break;
        case 'outtime':
          this.$Api.coinManagement
            .getParentExpireList(this.parentId, this.outtimePageObj.pageNum, this.outtimePageObj.pageSize)
            .then(({status, data}) => {
              if (status == 200 && data.code == 200) {
                this.potinOutTimeTableData = data.data.list
                this.total = data.data.total
              }
            })
          break;
        default:
          break;
      }
    },
    getParentCoinTotal() {
      this.$Api.coinManagement.getParentCoinTotal(this.parentId)
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            let {
              totalCoinExpire,
              totalCoinGive,
              totalCoinPay,
              totalCoinRemain
            } = data.data
            this.totalCoinExpire = totalCoinExpire
            this.totalCoinGive = totalCoinGive
            this.totalCoinPay = totalCoinPay
            this.totalCoinRemain = totalCoinRemain
          }
        })
    }
  },
  created() {
    this.activeName = 'got'
    this.getParentCoinTotal()
  }
}
</script>
<style lang="scss" scoped>
.potin-details-wrap {
  position: relative;

  .potin-total {
    position: absolute;
    right: 0;
    font-size: 12px;
  }
}
</style>
