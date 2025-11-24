<template>
  <div class="coupon-list-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('优惠类型')" :part="4" :label-width="currentLang == 'en' ? 120 : labelWidth">
        <el-select v-model="screenData.couponType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in couponTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('家长id')" :part="4" :label-width="labelWidth">
        <el-input v-model="screenData.parentUserId"></el-input>
      </screen-item>
      <screen-item :label="$t('优惠券名称')" :part="4" :label-width="labelWidth">
        <el-input v-model="screenData.couponName"></el-input>
      </screen-item>
      <screen-item :label="$t('优惠券码')" :part="4" :label-width="labelWidth">
        <el-input v-model="screenData.code"></el-input>
      </screen-item>
      <screen-item :label="$t('发券人员')" :part="4" :label-width="labelWidth">
        <el-input v-model="screenData.createUserName"></el-input>
      </screen-item>
      <screen-item :label="$t('发券日期')" :part="4" :label-width="labelWidth">
        <el-date-picker
          style="width:220px"
          v-model="applyDate"
          type="daterange"
          range-separator=""
          :start-placeholder="$t('开始日期')"
          @change="timeChange"
          :end-placeholder="$t('结束日期')">
        </el-date-picker>
      </screen-item>
    </screen-wrapper>
    <div class="coupon-table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column fixed align="center" :label="$t('序号')" :width="currentLang == 'en' ? 110 : 50">
          <template
            slot-scope="scope"
          >{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('发券时间')" width="140" prop="couponName">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('家长ID')" :width="currentLang == 'en' ? 156 : 140">
          <template slot-scope="scope">
            <router-link :to="{ path : `/studentManagement/parentInfo`, query:{ parentUserId:scope.row.parentUserId }}">
              <el-button type="text">{{ scope.row.parentUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('优惠券类型')" width="140" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.couponType | couponTypeFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('优惠券名称')" width="140" prop="couponName"></el-table-column>
        <el-table-column align="center" :label="$t('优惠码')" width="140" prop="name">
          <template slot-scope="scope">
            <el-button @click="goDetail(scope.row)" type="text">{{ scope.row.code }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('有效期')" width="340">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.validStartTime) }}</span>
            <span>-</span>
            <span>{{ DateTimeUtils.dateClockTime(scope.row.validEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('使用状态')" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.used | couponUsedStatusFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('发券人员')" width="140" prop="createUserName"></el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <el-dialog
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :title="$t('发放优惠券')"
      center
      :visible.sync="sendCouponDialog">
      <div class="top">
        <p>{{$t('优惠券名称')}}：{{ currentCoupon.couponName }}</p>
        <p>{{$t('优惠')}}：{{ currentCoupon.discount }}</p>
      </div>
      <div class="textarea">
        <el-input
          type="textarea"
          :rows="16"
          maxlength="501"
          :placeholder="$t('请输入接收优惠券的用户账号并以换行分隔，如 \npatent@gmail.com \nuser@qq.com')" 
          v-model="sendUsers"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="sureSends" :loading="sureSendsLoading">{{$t('确定')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: 'couponRecord',
  data () {
    return {
      screenData: {
        pageNum: 1,
        pageSize: 50,
        couponName: '',
        code: '',
        parentUserId: '',
        couponType: '',
        startTime: '',
        endTime: '',
        createUserName: ''
      },
      applyDate: [],
      tableData: [
        {name: 1}
      ],
      total: 0,
      loading: false,
      labelWidth: 100,
      sendCouponDialog: false,
      sendUsers: '',
      sureSendsLoading: false,
      statusOptions: [
        {label: '允许发券', value: 1},
        {label: '停止发券', value: 0}
      ],
      couponTypeOptions:[],
      currentCoupon: {}
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
      this.couponTypeOptions = [
        {label: this.$t('折扣券'), value: 1},
        {label: this.$t('代金券'), value: 2}
      ]
    },
    search() {
      this.screenData.pageNum = 1
      this.getTableData()
    },
    goDetail(scopeRow) {
      this.$router.push(`/operateManagement/couponDetail?code=${scopeRow.code}`)
    },
    showDialog(scopeRow) {
      this.currentCoupon = scopeRow
      this.sendCouponDialog = true
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    getTableData() {
      if (this.screenData && this.screenData.parentUserId && !parentIdValidate(this, this.screenData.parentUserId)) {
        return;
      }
      
      this.loading = true
      let params = {}
      for (var key in this.screenData) {
        if (this.screenData[key] !== '') {
          params[key] = this.screenData[key]
        }
      }
      this.$Api.operateManagement.getCouponRecoedList(params)
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.list
          }
          this.loading = false
        })
    },
    closeDialog() {
      this.sendCouponDialog = false
    },
    sureSends() {
      let str = this.sendUsers.replace(/，/ig, ',')
      let importData = str.split("\n")
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(`${new Date(this.applyDate[0]).toLocaleDateString()} 00:00`).toISOString()
        this.screenData.endTime = new Date(`${new Date(this.applyDate[1]).toLocaleDateString()} 23:59`).toISOString()
      } else {
        this.screenData.startTime = ''
        this.screenData.endTime = ''
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
.coupon-list-wrap {
  .top {
    width: 100%;
    display: flex;
  }

  .textarea {
    width: 100%;
  }
}
</style>
