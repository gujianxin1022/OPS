<template>
  <div class="december-activity-wrap">
    <div class="tab-box">
      <el-tabs v-model="activeName" class="tab-box" @tab-click="changeStatus">
        <el-tab-pane :label="$t('拼团活动数据概览')" name="tab1">
          <div class="table-wrapper">
            <el-table :data="tableData" v-loading="loading" tooltip-effect="dark" :border="false" fit show-overflow-tooltip="true" style="width: 100%;margin-top:10px" stripe :header-cell-style="{background:'#f1f1f1',color:'#606266'}" class="attend-table">
              <el-table-column min-width="100" align="center" :label="$t('Date')" prop="date"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页A访问PV')" prop="pageAPV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页A访问UV')" prop="pageAUV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页B访问PV')" prop="pageBPV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页B访问UV')" prop="pageBUV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页A-支付弹层UV')" prop="pageAPayUV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页A-支付人数')" prop="pageAPayNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页B-支付弹层UV')" prop="pageBPayUV"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页B-支付人数')" prop="pageBPayNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页A支付转化率')" prop="pageARate"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('拼团详情页B支付转化率')" prop="pageBRate"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('海报曝光数')" prop="postNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('海报扫码次数')" prop="qrcodeNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('新注册人数')" prop="newUserNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('参团支付人数')" prop="otherNum"></el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('开团支付人数')" prop="leaderNum"></el-table-column>
            </el-table>
          </div>
          <!-- <custom-pagination :total="total" :current-page="pageObj.pageNum" @getCurrentPage="getCurrentPage" @getPerPage="getPerPage" /> -->
        </el-tab-pane>
        <el-tab-pane :label="$t('拼团用户列表')" name="tab2">
          <!-- <p style="text-align: right"><el-button type="primary" @click="getTableData">查询</el-button></p>  -->
          <div class="filter pt20">
            <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
              <el-select clearable v-model="params.status" :placeholder="$t('请选择拼团状态')" class="mr20">
                <el-option v-for="item in groupStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
              <el-select clearable v-model="params.userStatus" :placeholder="$t('请选择用户状态')" class="mr20">
                <el-option v-for="item in userStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
              <el-select clearable v-model="params.payStatus" :placeholder="$t('请选择充值状态')" class="mr20">
                <el-option v-for="item in payStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
              
            </screen-wrapper>
          </div>
          <p style="text-align: right"><el-button type="primary" :loading="downloadLoading" @click="handleDownload">{{$t('export')}}</el-button></p> 
          <div class="data-view"><span class="mr10">{{$t('拼团成功')}}：{{activityDataView.groupSuccess}}{{$t('团')}}</span> <span class="mr10">{{$t('拼团中')}}：{{activityDataView.groupJoining}}{{$t('团')}}</span> <span class="mr10">{{$t('新注册人数')}}：{{activityDataView.newUserNumber}}</span> <span class="mr10">{{$t('参团总人数')}}：{{activityDataView.allUserNumber}}</span></div>
          <div class="table-wrapper">
            <el-table :data="tableData" v-loading="loading" tooltip-effect="dark" :border="false" fit show-overflow-tooltip="true" style="width: 100%;" stripe :header-cell-style="{background:'#f1f1f1',color:'#606266'}" class="attend-table">
              <el-table-column min-width="100" align="center" :label="$t('团ID')" prop="groupDetailId"></el-table-column>
              <el-table-column min-width="130" align="center" :label="$t('家长ID')" prop="userParentId"></el-table-column>
              <el-table-column min-width="150" align="center" :label="$t('用户邮箱')" prop="email"></el-table-column>
              <el-table-column min-width="100" align="center" :label="$t('国家')" prop="userCountry"></el-table-column>
              <el-table-column min-width="100" align="center" :label="$t('拼团状态')" prop="status">
                <template slot-scope="scope">
                  {{scope.row.status === 1? $t('进行中') : $t('已成团')}}
                </template>
              </el-table-column>
              <el-table-column min-width="100" align="center" :label="$t('用户状态')" prop="userStatus">
                <template slot-scope="scope">
                  {{scope.row.userStatus === 1? $t('新用户') : $t('老用户')}}
                </template>
              </el-table-column>
              <el-table-column min-width="110" align="center" :label="$t('充值状态')" prop="payStatus">
                <template slot-scope="scope">
                  {{scope.row.payStatus === 1? $t('Recharged') : $t('未充值')}}
                </template>
              </el-table-column>
              <el-table-column min-width="100" align="center" :label="$t('拼团身份')" prop="leader">
                <template slot-scope="scope">
                  {{scope.row.leader === 1? $t('团长') : $t('团员')}}
                </template>
              </el-table-column>
              <el-table-column min-width="120" align="center" :label="$t('支付方式')" prop="payType"></el-table-column>
              <el-table-column min-width="150" align="center" :label="$t('my-home-Registration Date')" prop="createTime">
                <template slot-scope="scope">
                  {{DateTimeUtils.dateClockTime(scope.row.createTime)}}
                </template>
              </el-table-column>
              <el-table-column min-width="150" align="center" :label="$t('拼团时间')" prop="startTime">
                <template slot-scope="scope">
                  {{DateTimeUtils.dateClockTime(scope.row.startTime)}}
                </template>
              </el-table-column>
              <el-table-column min-width="150" align="center" :label="$t('成团时间')" prop="endTime">
                <template slot-scope="scope">
                  {{DateTimeUtils.dateClockTime(scope.row.endTime)}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <custom-pagination :total="total" :current-page="pageObj.pageNum" :pageSizes="[50, 100, 200]" @getCurrentPage="getCurrentPage" @getPerPage="getPerPage" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: 'decemberActivity',
  data() {
    return {
      activeName: 'tab1',
      tableData: [],
      screenData: {
        parentUserName: '',
        referenceUserName: '',
        registryTime: [],
        adviserUserId: '',
        xgUserId: ''
      },
      pageObj: {
        pageNum: 1,
        pageSize: 50
      },
      total: 0,
      loading: false,
      params: {
        status: null,
        userStatus: null,
        payStatus: null
      },
      activityDataView: {},
      groupStatus:[],
      userStatus:[],
      payStatus:[],
      id2KeyData: {
        1: ['pageAPV', 'pvNum'],
        101: ['pageAUV', 'uvNum'],
        3: ['pageBPV', 'pvNum'],
        103: ['pageBUV', 'uvNum'],
        105: ['pageAPayUV', 'uvNum'],
        106: ['pageAPayNum', 'uvNum'],
        107: ['pageBPayUV', 'uvNum'],
        108: ['pageBPayNum', 'uvNum'],
        9: ['postNum', 'pvNum'],
        10: ['qrcodeNum', 'pvNum']
      }
    }
  },
  watch: {
    activeName() {
      this.getTableData()
    },
    currentLang(){
      this.initData()
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ])
  },
  methods: {
    initData() {
      (this.groupStatus = [
        {
          label: this.$t('拼团中'),
          id: 1
        },
        {
          label: this.$t('成功拼团'),
          id: 2
        }
      ]),(
        this.userStatus = [
        {
          label: this.$t('新注册用户'),
          id: 1
        },
        {
          label: this.$t('老注册用户'),
          id: 2
        }
      ]),(
        this.payStatus = [
        {
          label: this.$t('Recharged'),
          id: 1
        },
        {
          label: this.$t('未充值'),
          id: 2
        }
      ])
    },
    search() {
      this.pageObj.pageNum = 1
      this.getTableData()
    },
    getCurrentPage(page) {
      this.pageObj.pageNum = page
      this.getTableData()
    },
    getPerPage(perPage) {
      this.pageObj.pageSize = perPage
      this.getTableData()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['团ID', '家长ID', '用户邮箱', '国家', '拼团状态', '用户状态', '充值状态', '拼团身份', '支付方式', '注册时间', '拼团时间', '成团时间']
        const filterVal = ['groupDetailId', 'userParentId', 'email', 'userCountry', 'status', 'userStatus', 'payStatus', 'leader', 'payType', 'createTime', 'startTime', 'endTime']

        let list = JSON.parse(JSON.stringify(this.tableData))
        list.forEach(item => {
          item.status = item.status === 1? '进行中' : '已成团'
          item.userStatus = item.userStatus === 1? '新用户' : '老用户'
          item.payStatus = item.payStatus === 1? '已充值' : '未充值'
          item.leader = item.leader === 1? '团长' : '团员'
          item.createTime = this.DateTimeUtils.dateClockTime(item.createTime)
          item.startTime = this.DateTimeUtils.dateClockTime(item.startTime)
          item.endTime = this.DateTimeUtils.dateClockTime(item.endTime)
        })
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '12月份拼团活动用户数据',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    dealData(data) {
      this.tableData.length = 0
      let arr = []
      Object.keys(data).forEach(dayIndex => {
        let dayData = data[dayIndex] 
        let obj = {
          'pageAPV': 0, 
          'pageAUV': 0, 
          'pageBPV': 0, 
          'pageBUV': 0, 
          'pageAPayUV': 0, 
          'pageAPayNum': 0, 
          'pageBPayUV': 0, 
          'pageBPayNum': 0, 
          'postNum': 0, 
          'qrcodeNum': 0,
          'pageARate': 0,
          'pageBRate': 0,
          'leaderNum': 0,
          'otherNum': 0,
          'newUserNum': 0
        }
        obj['date'] = dayIndex
        dayData.forEach((dataItem, dataIndex) => {
          if (dataItem.visitType !== null) {
            if (Object.keys(this.id2KeyData).includes(String(dataItem.visitType))) {
              // let visitKeyArr = ['pageAPV', 'pageAUV', 'pageBPV', 'pageBUV', 'pageAPayUV', 'pageAPayNum', 'pageBPayUV', 'pageBPayNum', 'postNum', 'qrcodeNum']
              obj[this.id2KeyData[dataItem.visitType][0]] = dataItem[this.id2KeyData[dataItem.visitType][1]]
            } else {
              if (dataItem.visitType === -1) {
                obj['pageARate'] = dataItem.rateA + '%'
              } else {
                obj['pageBRate'] = dataItem.rateB + '%'
              }
            }
          } else if (dataItem.leader !== null) {
            let groupKeyArr = ['leaderNum', 'otherNum']
            obj[groupKeyArr[dataItem.leader-1]] = dataItem.num
          } else if (dataItem.activityCode === 'group') {
            obj['newUserNum'] = dataItem.num
          }
        })
        arr.push(obj)
      })
      let totalObj = {
        'pageAPV': 0, 
        'pageAUV': 0, 
        'pageBPV': 0, 
        'pageBUV': 0, 
        'pageAPayUV': 0, 
        'pageAPayNum': 0, 
        'pageBPayUV': 0, 
        'pageBPayNum': 0, 
        'postNum': 0, 
        'qrcodeNum': 0,
        'pageARate': 0,
        'pageBRate': 0,
        'leaderNum': 0,
        'otherNum': 0,
        'newUserNum': 0,
        'date': '合计'
      }
      arr.forEach((dayItem, dayIndex) => {
        totalObj.pageAPV += dayItem['pageAPV']
        totalObj.pageAUV += dayItem['pageAUV']
        totalObj.pageBPV += dayItem['pageBPV']
        totalObj.pageBUV += dayItem['pageBUV']
        totalObj.pageAPayUV += dayItem['pageAPayUV']
        totalObj.pageAPayNum += dayItem['pageAPayNum']
        totalObj.pageBPayUV += dayItem['pageBPayUV']
        totalObj.pageBPayNum += dayItem['pageBPayNum']
        totalObj.postNum += dayItem['postNum']
        totalObj.qrcodeNum += dayItem['qrcodeNum']
        totalObj.leaderNum += dayItem['leaderNum']
        totalObj.otherNum += dayItem['otherNum']
        totalObj.newUserNum += dayItem['newUserNum']
      })
      totalObj.pageARate = totalObj.pageAPayNum === 0 ? 0 : (totalObj.pageAPayNum / totalObj.pageAUV).toFixed(2)*100 + '%'
      totalObj.pageBRate = totalObj.pageBPayNum === 0 ? 0 : (totalObj.pageBPayNum / totalObj.pageBUV).toFixed(2)*100 + '%'
      arr.unshift(totalObj)
      this.tableData = arr
    },
    getTableData() {
      this.loading = true
      this.tableData.length = 0
      if (this.activeName === 'tab1') {
        this.$Api.operateManagement.getdouble12DataList()
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            this.loading = false
            this.$set(this.pageObj, 'pageNum', 1)
            this.dealData(data.data)
          }
        })
      } else {
        this.$Api.operateManagement.getdouble12UserDataView()
        .then(({ status, data}) => {
          if (status === 200 && data.code === 200) {
            this.activityDataView = data.data
          }
        })
        this.$Api.operateManagement.getdouble12UserDataList(this.pageObj, this.params)
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            this.loading = false
            if (data.data) {
              this.tableData = data.data.list
              this.total = data.data.total
            } else {
              this.tableData = []
            }
          }
        })
      }
    }
  },
  created() {
    this.getTableData()
    this.initData()
  }
}

</script>
<style lang="scss" scoped>
.tab-box {
  padding: 5px 10px 0 10px;
}

.data-view {
  font-size: 14px;
  color: #666;
  background: rgb(241, 241, 241);
  padding: 10px;
}

.table-wrapper {
  margin-top: 20px;

  .attend-table {
    border: 1px solid #f1f1f1;

    table {
      width: 100%;
    }
  }
}

</style>
