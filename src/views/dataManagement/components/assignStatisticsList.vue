<template>
  <div class="assign-statistics-list-container">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <div style="padding-top: 10px;">
        <el-radio-group
          @change="changeDateType"
          v-model="screenData.dateType"
        >
          <el-radio-button :label="1">{{ $t('上月') }}</el-radio-button>
          <el-radio-button :label="2">{{ $t('本月') }}</el-radio-button>
        </el-radio-group>
      </div>
      <screen-item
        label
        :part="4"
        label-width="0"
      >
        <el-date-picker
          v-model="screenData.time"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          @change="changeDatePicker"
        ></el-date-picker>
      </screen-item>
      <screen-item :label="$t('范围')">
        <CommonTree
          @get_seleParams="getUserData"
          ref="newCommonTree"
        >
        </CommonTree>
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
    >
      <div
        slot="header-right"
        class="tip-wrap"
      >
        <el-space>
          <span>{{$t('分配新生总数')}}: <span
              class="num mr10">{{getTotal('totalAllocationNum')}}</span></span>
          <span>{{$t('系统分配')}}: <span
              class="num mr10">{{getTotal('systemAllocationNum')}}</span></span>
          <span>{{$t('人工分配')}}: <span
              class="num mr10">{{getTotal('manualAllocationNum')}}</span></span>
        </el-space>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px; margin-bottom: 20px;"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        @sort-change="sortChange"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          width="50"
        >
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          :label="$t('员工')"
        >
          <template slot-scope="{row}">
            {{row.userInfoResp && row.userInfoResp.username}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          :label="$t('部门')"
          :width="200"
        >
          <template slot-scope="{row}">
            {{getDepart(row, isEn)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="totalAllocationNum"
          :label="$t('分配新生数')"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="systemAllocationNum"
          :label="$t('系统分配新生数')"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="manualAllocationNum"
          :label="$t('人工分配新生数')"
          sortable="custom"
        >
        </el-table-column>
      </el-table>
      <custom-pagination
        style="margin-bottom:20px"
        :total="total"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
  </div>
</template>
<script>
import { computed, defineComponent, reactive, toRefs, ref, onMounted, unref } from '@vue/composition-api'
import CommonTree from "@/views/reportManagement/commonTree";
import moment from "moment";

export default defineComponent({
  components: { CommonTree },
  setup (props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const screenData = reactive({
      dateType: 2,
      time: '',
      userIdStr: '',
      postIdStr: '',
      oderByColumn: ''
    })
    const pageData = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 50,
    });

    const loading = ref(false)
    const tableData = ref(null)

    const changeDateType = (type) => {
      if (type === 1) {
        screenData.startDate = getUtc(root.DateTimeUtils.getLastMonthStartDate())
        screenData.endDate = getUtc(root.DateTimeUtils.getLastMonthEndDate())
      } else {
        screenData.startDate = getUtc(root.DateTimeUtils.getMonthStartDate())
        screenData.endDate = getUtc(root.DateTimeUtils.getMonthEndDate())
      }
      screenData.time = [];
    }
    const changeDatePicker = () => {
      screenData.dateType = "";
    }
    const getUtc = (gmt) => {
      return new Date(gmt).toISOString()
    }

    const getDepart = (row, isEn) => {
      const { upPostNameEn, currentPostNameEn, upPostNameZh, currentPostNameZh, thirdPostNameEn, thirdPostNameZh } = row.postInfoResp
      let strZh = currentPostNameZh
      if (upPostNameZh) {
        strZh += '/' + upPostNameZh
      }
      if (thirdPostNameZh) {
        strZh += '/' + thirdPostNameZh
      }
      let strEn = currentPostNameEn
      if (upPostNameEn) {
        strEn += '/' + upPostNameEn
      }
      if (thirdPostNameEn) {
        strEn += '/' + thirdPostNameEn
      }
      return unref(isEn) ? strEn : strZh
    }
    const getUserData = (val, valName) => {
      if (valName === "postIdList") {
        screenData.userIdStr = "";
        screenData.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        screenData.postIdStr = "";
        screenData.userIdStr = val.join(",");
      } else if (valName === "clear") {
        screenData.postIdStr = "";
        screenData.userIdStr = "";
      }
    }

    const search = () => {
      pageData.pageNum = 1
      getTableData()
    }

    const getTableData = () => {
      loading.value = true;
      const params = { ...screenData, ...pageData }
      if (params.time.length) {
        params.startDate = params.time[0] ? new Date(params.time[0]).toISOString() : (params.startDate || '');
        params.endDate = params.time[1] ? new Date(params.time[1]).toISOString() : (params.endDate || '');
      }
      delete params.time
      delete params.dateType
      root.$Api.dataManagement.getAssignStatisticsList(params).then(({ status, data: { data, code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        tableData.value = data.list
        pageData.total = data.total
        loading.value = false;
      }).catch(() => {
        tableData.value = []
        pageData.total = 0
        loading.value = false;
      })
    }


    const getCurrentPage = (page) => {
      pageData.pageNum = page;
      getTableData();
    };

    const getPerPage = (perPage) => {
      pageData.pageSize = perPage;
      getTableData();
    };

    const getTotal = (key) => {
      if (!unref(tableData)?.length) return '-'
      function sum (arr) {
        return arr.reduce(function (prev, curr, idx, arr) {
          return prev + curr;
        });
      }
      return sum(unref(tableData).map(t => t[key]))
    }



    const sortChange = (column) => {
      if (!column.order) return
      const asc = column.order === "ascending" ? 'asc' : 'desc'
      if (column.prop === 'manualAllocationNum') {
        screenData.oderByColumn = 'manualAllocationNum'
      } else if (column.prop === 'systemAllocationNum') {
        screenData.oderByColumn = 'systemAllocationNum'
      } else if (column.prop === 'totalAllocationNum') {
        screenData.oderByColumn = 'totalAllocationNum'
      }
      screenData.asc = asc
      screenData.page = 1;
      getTableData();
    }

    onMounted(() => {
      changeDateType(2)
      setTimeout(() => {
        getTableData()
      }, 500)
    })

    return {
      isEn,
      screenData,
      tableData,
      loading,
      ...toRefs(pageData),

      changeDateType,
      changeDatePicker,
      getDepart,
      search,
      getUserData,
      getTotal,
      getCurrentPage,
      getPerPage,
      sortChange
    }
  },
})
</script>
<style lang="scss" scoped>
.assign-statistics-list-container {
  .tip-wrap {
    font-size: 14px;
    .num {
      display: inline-block;
      color: #7580e5;
    }
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
