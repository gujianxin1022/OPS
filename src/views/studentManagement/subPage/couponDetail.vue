<template>
  <div class="parent-coupon-detail-warp">
    <div class="btn-group">
      <el-radio-group v-model="params.status" @change="search">
        <el-radio-button label="0"
          >{{ $t("未使用") }}({{ notUsedCount }})
        </el-radio-button>
        <el-radio-button label="1"
          >{{ $t("已使用") }}({{ usedCount }})
        </el-radio-button>
        <el-radio-button label="3"
          >{{ $t("已占用") }}({{ occupiedCount }})
        </el-radio-button>
        <el-radio-button label="2"
          >{{ $t("已失效") }}({{ invalidCount }})
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="list">
      <el-table
        class="mt30"
        :data="tableData"
        :height="tableHeight"
        style="width: 100%"
        v-loading="loading"
        :key="theKey"
        :empty-text="$t('暂无数据')"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="isEn ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('发放/兑换时间')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.grantTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('适用产品')">
          <template slot-scope="scope">
            {{ isEn ? scope.row.applySpuNameEn : scope.row.applySpuNameCn }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('优惠券类型')">
          <template slot-scope="scope">
            {{ scope.row.couponType === "1" ? $t("折扣券") : $t("代金券") }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('优惠力度')">
          <template slot-scope="scope">
            {{ scope.row.preferentialStrength }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('币种')">
          <template slot-scope="scope">
            {{ (isEn ? scope.row.currencyEn : scope.row.currencyCn) || "-" }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('适用课时')">
          <template slot-scope="scope">
            {{ scope.row.applyAmount }}
          </template>
        </el-table-column>
        <el-table-column width="150" align="center" :label="$t('有效期')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.validStartTime) }} ~
            {{ DateTimeUtils.dateClockTime(scope.row.validEndTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="params.status != 0"
          align="center"
          :label="$t('使用时间')"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.usedTime) || "-" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, computed, toRefs } from "@vue/composition-api";
export default {
  name: "couponDetail",
  props: {
    parentUserId: {
      type: Number,
      default: -1,
    },
  },
  setup(props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    // const loading = ref(false)
    const params = reactive({
      parentUserId: props.parentUserId,
      code: "",
      status: "0",
    });
    const tableState = reactive({ loading: false, tableData: [] });
    const numberState = reactive({
      notUsedCount: 0,
      usedCount: 0,
      occupiedCount: 0,
      invalidCount: 0,
    });

    const search = async () => {
      console.log(params);
      tableState.loading = true;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.reqParentCouponList(params);
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.tableData = data.couponDetailds;
        numberState.notUsedCount = data.notUsedCount || 0;
        numberState.usedCount = data.usedCount || 0;
        numberState.occupiedCount = data.occupiedCount || 0;
        numberState.invalidCount = data.invalidCount || 0;
        console.log(numberState);
      } finally {
        tableState.loading = false;
      }
    };

    onMounted(async () => {
      await search();
    });
    return {
      isEn,
      params,
      search,
      ...toRefs(tableState),
      ...toRefs(numberState),
    };
  },
};
</script>

<style lang='scss' scoped>
.parent-coupon-detail-warp {
  .list {
    width: 100%;
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>