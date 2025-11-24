<template>
  <div class="coupon-list-wrap">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('优惠类型')"
        :part="4"
        :label-width="currentLang === 'en' ? 120 : labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.type"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in couponTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('投放状态')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.status"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('优惠券名称')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input
          clearable
          v-model="screenData.name"
        ></el-input>
      </screen-item>
      <screen-item
        :label="$t('优惠券码')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input
          clearable
          v-model="screenData.code"
        ></el-input>
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
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template
            slot-scope="scope">{{ (screenData.page - 1) * screenData.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠券名称')"
          width="140"
          prop="coupon_name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠券类型')"
          width="140"
          prop="coupon_type_name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('优惠码')"
          width="140"
          prop="coupon_code"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('总投放量')"
          width="140"
          prop="delivery_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('总使用量')"
          width="140"
          prop="used_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('总使用率')"
          width="140"
          prop="used_ratio"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.used_ratio | numberPercentage }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('费效比')"
          width="140"
          prop="cost_effectiveness_ratio"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cost_effectiveness_ratio | numberPercentage }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('系统投放量')"
          width="140"
          prop="system_delivery_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('系统投放使用量')"
          width="140"
          prop="system_delivery_used_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('系统投放使用率')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="system_delivery_used_ratio"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.system_delivery_used_ratio | numberPercentage }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('用户兑换量')"
          width="140"
          prop="parent_draw_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('用户兑换使用量')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="parent_draw_used_num"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('用户兑换使用率')"
          :width="currentLang === 'en' ? 170 : 140"
          prop="parent_draw_used_ratio"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.parent_draw_used_ratio | numberPercentage }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('创建时间')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="create_time"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('status')"
          width="140"
          prop="coupon_status_name"
        ></el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.page"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'effectAnalysis',
  data () {
    return {
      screenData: {
        page: 1,
        size: 50,
        name: '',
        code: '',
        type: '',
        status: ''
      },
      tableData: [],
      total: 0,
      loading: false,
      labelWidth: 100,
      statusOptions: [],
      couponTypeOptions: [],
      currentCoupon: {}
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ])
  },
  watch: {
    currentLang () {
      this.initData()
    }
  },
  methods: {
    initData () {
      this.couponTypeOptions = [
        { label: this.$t('折扣券'), value: 1 },
        { label: this.$t('代金券'), value: 2 }
      ]
      this.statusOptions = [
        { label: this.$t('允许投放'), value: 1 },
        { label: this.$t('停止投放'), value: 0 }
      ]
    },
    search () {
      this.screenData.page = 1
      this.getTableData()
    },
    getCurrentPage (page) {
      this.screenData.page = page;
      this.getTableData();
    },
    getPerPage (perPage) {
      this.screenData.size = perPage;
      this.getTableData();
    },
    getTableData () {
      this.loading = true
      let params = {}
      for (var key in this.screenData) {
        if (this.screenData[key] !== '') {
          params[key] = this.screenData[key]
        }
      }
      this.$Api.operateManagement.getEffectAnalysisList(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 0) {
            this.tableData = data.data
            this.total = data.total
          }
          this.loading = false
        })
    }
  },
  created () {
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
