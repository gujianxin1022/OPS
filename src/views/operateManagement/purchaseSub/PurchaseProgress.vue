<template>
  <div class="purchase-progress-wrap">
    <screen-wrapper
      @search="handleSearch"
      :screenTitle="$t('小班拼团')"
    >
      <div class="search-wrap mt10">
        <el-select
          class="mr20"
          v-model="screenData.status"
          :placeholder="$t('团状态')"
          v-if="Per.handleButtonPer('operate.operateMT.groupPurchase.gbFilterByGroupStatus')"
        >
          <el-option
            v-for="item in groupStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          class="mr20"
          :class="{'input-width': currentLang === 'en'}"
          v-model="screenData.grantStatus"
          :placeholder="$t('团奖励是否发放')"
          v-if="Per.handleButtonPer('operate.operateMT.groupPurchase.gbFilterByIfBonusSend')"
        >
          <el-option
            v-for="item in payMoneyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          clearable
          class="mr20"
          :class="{'input-width': currentLang === 'en'}"
          filterable
          v-model="screenData.createUserId"
          :placeholder="$t('请选择团创建人')"
          v-if="Per.handleButtonPer('operate.operateMT.groupPurchase.gbFilterByGroupCreater')"
        >
          <el-option
            v-for="(item, index) in xgAndGwListSet"
            :key="index"
            :label="item.nameEn+`${item.nameEn && item.nameZh?'-':''}`+item.nameZh"
            :value="item.id"
          />
        </el-select>
        <div
          class="w200"
          v-if="Per.handleButtonPer('operate.operateMT.groupPurchase.gbFilterByUsername')"
        >
        </div>
        <!-- <el-button type="primary" class="w100" @click="handleSearch">查询</el-button> -->
      </div>
    </screen-wrapper>
    <div class="message-wrap mt15">
      <div class="message-inner">
        <p>
          <span
            v-if="topMessage">{{$t('拼团成功')}}：{{topMessage.statusNum.find( item => Object.keys(item)[0] == '2')['2']}}{{$t('团')}}</span>
          <span
            v-if="topMessage">{{$t('拼团中')}}：{{topMessage.statusNum.find( item => Object.keys(item)[0] == '1')['1']}}{{$t('团')}}</span>
          <span
            v-if="topMessage">{{$t('奖励已发放')}}：{{topMessage.statusNum.find( item => Object.keys(item)[0] == '3')['3']}}{{$t('团')}}</span>
          <span
            v-if="topMessage">{{$t('总充值课时')}}：{{topMessage.rechargeSum}}{{$t('课时')}}</span>
          <span
            v-if="topMessage">{{$t('总充值人数')}}：{{topMessage.parentUserCount}}{{$t('人')}}</span>
        </p>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @sort-change="sortChange"
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
        stripe
        class="attend-table"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 80"
        >
          <template
            slot-scope="scope">{{ (currentPage - 1) * perPage + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="name"
          :label="$t('团编号')"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="Per.handleButtonPer('operate.operateMT.groupPurchase.gbViewGroupTopDetails')"
              type="text"
              @click="handleGroupNumber(scope.row)"
            >{{scope.row.groupNo}}</el-button>
            <el-button
              v-else
              disabled
              type="text"
              @click="handleGroupNumber(scope.row)"
            >{{scope.row.groupNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="userName"
          :label="$t('团创建人')"
          :width="currentLang == 'en' ? 110 : 100"
        />
        <el-table-column
          align="center"
          :label="$t('团链接')"
          min-width="420"
        >
          <template slot-scope="scope">
            <span>{{scope.row.groupUrl}}</span>
            <!-- <el-button type="text" @click="openUrl(scope.row.group_url)">https://...</el-button> -->
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="name" label="充值课时" width="150" /> -->
        <el-table-column
          align="center"
          prop=""
          :label="$t('充值人数')"
          :width="currentLang == 'en' ? 180 : 150"
        >
          <template slot-scope="scope">
            <span>{{scope.row.groupRechargeInfoList?scope.row.groupRechargeInfoList.length:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          :label="$t('充值用户')"
          width="220"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.groupRechargeInfoList"
              :key="item.id"
            >{{item.parentUserId}}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          :label="$t('用户地区')"
          width="150"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.groupRechargeInfoList"
              :key="item.id"
            >{{item.countryOfResidence}}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          :label="$t('团状态')"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{scope.row.status | groupStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          sortable="custom"
          :label="$t('团创建时间')"
          :width="currentLang == 'en' ? 160 : 150"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          sortable="custom"
          prop="success_time"
          :label="$t('拼团成功时间')"
          :width="currentLang == 'en' ? 230 : 150"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.successTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="currentPage"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <el-dialog
      :title="groupNumber"
      :close-on-click-modal="false"
      :visible.sync="show"
      width="700px"
      :before-close="handleClose"
    >
      <el-table
        v-loading="groupLoading"
        :data="groupTable"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        height="300px"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column
          align="center"
          prop="parentUser.pid"
          :label="$t('家长ID')"
          width="200"
        />
        <el-table-column
          align="center"
          prop="parentUser.countryOfResidence"
          :label="$t('用户地区')"
          width="150"
        />
        <el-table-column
          align="center"
          prop="rechargeOrder.rechargeAmount"
          :label="$t('my-home-Top-up Points')"
          width="150"
        />
        <el-table-column
          align="center"
          prop="rechargeOrder.rechargeTime"
          :label="$t('充值时间')"
          width="150"
        />
        <el-table-column
          align="center"
          prop="orderNo"
          :label="$t('订单编号')"
          width="280"
        />
        <el-table-column
          align="center"
          prop="parentUser.adviserUserName"
          :label="$t('课程顾问')"
          width="150"
        />
        <el-table-column
          align="center"
          prop="parentUser.xgUserName"
          :label="$t('common-Learning Advisor')"
          width="150"
        />
        <el-table-column
          align="center"
          prop="rechargeOrder.currency"
          :label="$t('币种')"
          width="150"
        />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
export default {
  data () {
    return {
      groupNumber: '',
      groupStatus: [
      ],
      payMoneyList: [
      ],
      screenData: {
        grantStatus: '',
        status: '',
        createUserId: '',
        parentUserName: '',
        ordering: 'create_time desc',
        page: 1,
        pageSize: 50
      },
      tableData: [
        {
          name: 1
        }
      ],
      groupTable: [
        {
          name: 1
        }
      ],
      loading: false,
      groupLoading: false,
      tableHeight: window.innerHeight - 200 || 300,
      total: 0,
      currentPage: 1,
      perPage: 50,
      show: false,
      groupInfo: null,
      topMessage: null
    }
  },
  computed: {
    ...mapState({
      xgAndGwListSet: state => state.user.xgAndGwListSet
    }),
    ...mapGetters([
      'currentLang'
    ]),
  },
  watch: {
    currentLang () {
      this.initData()
    }
  },
  methods: {
    initData () {
      this.groupStatus = [
        {
          label: this.$t('全部'),
          value: 0
        },
        {
          label: this.$t('拼团成功'),
          value: 2
        },
        {
          label: this.$t('拼团中'),
          value: 1
        }
      ]
      this.payMoneyList = [
        {
          label: this.$t('全部'),
          value: 2
        },
        {
          label: this.$t('未发放'),
          value: 0
        },
        {
          label: this.$t('已发放'),
          value: 1
        }
      ]
    },
    openUrl (url) {
      // window.location.op
      window.open(url, "_blank");
    },
    handleSearch () {
      if (this.screenData.status == 0) {
        this.screenData.status = ''
      }
      if (this.screenData.grantStatus == 2) {
        this.screenData.grantStatus = ''
      }
      this.screenData.page = 1
      this.getData()
    },
    sortChange (column) {
      if (column.order === "ascending") {
        // 升序
        this.screenData.ordering = `${column.prop} asc`;
      } else if (column.order === "descending") {
        // 降序
        this.screenData.ordering = `${column.prop} desc`;
      } else {
        return;
      }
      this.getData()
    },
    handleGroupNumber (data) {
      this.show = true
      this.groupLoading = true
      let { id, groupNo } = data
      this.groupNumber = `${this.$t('团编号')} ${groupNo}`
      this.$Api.operateManagement.userActivityList(id)
        .then(res => {
          this.groupTable = res.data.data
          this.groupLoading = false
        })
    },
    handleClose () {
      this.show = false
    },
    getCurrentPage (page) {
      this.currentPage = page
      this.screenData.page = page
      this.getData()
    },
    getPerPage (perPage) {
      this.perPage = perPage
      this.screenData.pageSize = perPage
      this.getData()
    },
    getData () {
      this.loading = true
      let {
        grantStatus,
        status,
        createUserId,
        parentUserName,
        ordering,
        page,
        pageSize
      } = this.screenData
      let obj = {
        grantStatus,
        status,
        createUserId,
        parentUserName,
        ordering
      }, params = {}
      for (var key in obj) {
        if (obj[key] !== null && obj[key] !== '') {
          params[key] = obj[key]
        }
      }
      this.$Api.operateManagement.getGroupActivityListJava(page, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.list
          }
          this.loading = false
        })
    },
  },
  created () {
    this.initData()
    this.$Api.operateManagement.getTotalDataJava()
      .then(res => {
        this.topMessage = res.data.data
      })
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.search-wrap {
  padding: 0 15px 10px;
  display: flex;
  justify-content: space-between;
}
.message-wrap {
  width: 100%;
  color: #666;
  font-size: 14px;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;

  .message-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(242, 245, 248, 0.8);

    p {
      padding: 0 10px;
      span {
        display: inline-block;
        line-height: 20px;
        margin-right: 10px;
      }
    }
  }
}

.table-wrapper {
  margin-top: 20px;
  padding: 0 15px;

  .attend-table {
    border: 1px solid #f1f1f1;
  }
}
.input-width {
  .el-input__inner {
    width: 248px !important;
  }
}
</style>