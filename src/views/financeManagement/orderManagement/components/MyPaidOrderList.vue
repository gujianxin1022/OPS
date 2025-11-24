<template>
  <div v-loading="loading" style="height: 450px">
    <el-table
      class="mt30"
      :data="optionList"
      style="width: 100%"
      :empty-text="$t('暂无数据')"
      height="400"
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
      <el-table-column
        :width="isEn ? 125 : 80"
        align="center"
        prop="studentUserName"
        :label="$t('充值学生')"
      >
        <template slot-scope="scope">
          {{ scope.row.studentUserName || "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('订单创建时间')" width="150">
        <template slot-scope="scope">
          {{ DateTimeUtils.dateClockTime(scope.row.createTime) || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('下单人')"
        width="150"
        prop="createUserName"
      >
      </el-table-column>

      <el-table-column
        :width="250"
        align="center"
        prop="orderNo"
        :label="$t('订单编号')"
      >
        <template slot-scope="scope">
          {{ scope.row.orderNo || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        :width="250"
        align="center"
        prop="payReference"
        :label="$t('流水号')"
      >
        <template slot-scope="scope">
          {{ scope.row.payReference || "-" }}
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('产品名称(SPU)')">
        <template slot-scope="scope">
          {{ isEn ? scope.row.spuNameEn : scope.row.spuNameCn }}
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('课时包(SKU)')">
        <template slot-scope="scope">
          {{ isEn ? scope.row.skuNameEn : scope.row.skuNameCn }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rechargeAmount"
        align="center"
        :width="isEn ? 120 : 80"
        :label="$t('订单课时')"
      >
        <template slot-scope="scope">
          {{ scope.row.rechargeAmount || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        :width="160"
        prop="incentiveAmount"
        align="center"
        :label="$t('赠品课时')"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="620"
            trigger="hover"
            v-if="
              scope.row.activityPolicyRespList &&
              scope.row.activityPolicyRespList.length
            "
          >
            <Gifts
              v-if="
                scope.row.activityPolicyRespList &&
                scope.row.activityPolicyRespList.length
              "
              :listData="scope.row.activityPolicyRespList"
              from="list"
            ></Gifts>
            <span
              slot="reference"
              style="cursor: pointer"
              class="text-overflow"
            >
              {{ scope.row.activityPolicyRespListStr }}
            </span>
          </el-popover>
          <span v-else>
            {{ scope.row.incentiveAmount || "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="originTotalPrice"
        :width="isEn ? 130 : 80"
        align="center"
        :label="$t('原价')"
      >
      </el-table-column>
      <el-table-column
        prop="savePrice"
        :width="isEn ? 130 : 80"
        align="center"
        :label="$t('优惠金额')"
      >
      </el-table-column>
      <el-table-column :width="isEn ? 160 : 120" align="center">
        <template slot-scope="scope" slot="header">
          {{ $t("商品实付金额") }}
          <el-tooltip
            effect="dark"
            :content="$t('商品实付金额=实付总额-消费税-手续费')"
            placement="top"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          {{
            (
              scope.row.totalPrice -
              scope.row.taxFee -
              scope.row.feePrice
            ).toFixed(2)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="taxFee" align="center" :label="$t('消费税')">
      </el-table-column>
      <el-table-column
        prop="fee"
        :width="150"
        align="center"
        :label="$t('手续费率')"
      >
        <template slot-scope="scope"> {{ scope.row.fee }}% </template>
      </el-table-column>
      <el-table-column
        prop="feePrice"
        :width="100"
        align="center"
        :label="$t('手续费')"
      >
      </el-table-column>

      <el-table-column
        align="center"
        :width="isEn ? 130 : 80"
        prop="totalPrice"
        :label="$t('实付总额')"
      >
      </el-table-column>
      <el-table-column align="center" width="150" :label="$t('币种')">
        <template slot-scope="scope">
          {{ isEn ? scope.row.currencyEn : scope.row.currencyCn || "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" :label="$t('支付成功时间')">
        <template slot-scope="scope">
          {{ DateTimeUtils.dateClockTime(scope.row.payTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDelay"
        width="150"
        align="center"
        :label="$t('支付类型')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isDelay === 0"> {{ $t("银行转账") }} </span>
          <span v-else-if="scope.row.isDelay === 1">
            {{ $t("普通支付") }}
          </span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payChannel"
        width="150"
        align="center"
        :label="$t('支付通道')"
      >
        <template slot-scope="scope">
          {{ scope.row.payChannel || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payType"
        align="center"
        width="120"
        :label="$t('支付方式')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.payType">
            <span v-show="scope.row.payType === 'ach'"> ACH Direct Debit </span>
            <span v-show="scope.row.payType !== 'ach'">
              {{ scope.row.payType }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" :label="$t('币种')">
        <template slot-scope="scope">
          {{ (isEn ? scope.row.currencyEn : scope.row.currencyCn) || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作')"
        width="220"
        prop="parentName"
        fixed="right"
      >
        <template slot-scope="scope">
          <template>
            <span>
              <el-button
                v-if="scope.row.isUpgrade"
                @click="handleUpgrade(scope.row)"
                type="text"
                >{{ $t("升舱") }}</el-button
              >
              <el-tooltip
                v-else
                class="item"
                effect="dark"
                :content="$t('本订单暂不支持升舱')"
                placement="top"
              >
                <el-button disabled="" type="text">{{ $t("升舱") }}</el-button>
              </el-tooltip>
            </span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      v-show="total > 1"
      :page-size="5"
      class="fr mt10"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
export default {
  props: ["parentUserId", "studentUserId"],
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const loading = ref(true);
    const total = ref(0);
    const pageNum = ref(1);
    const reqOptionList = async () => {
      try {
        loading.value = true;
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.reqParentOrderList({
          parentUserId: props.parentUserId,
          studentUserId: props.studentUserId,
          status: 2,
          pageNum: pageNum.value,
          pageSize: 5,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        optionList.value = data.orderDetailds.list;
        total.value = data.orderDetailds.total;
      } finally {
        loading.value = false;
      }
    };
    const handleCurrentChange = (val) => {
      pageNum.value = val;
      reqOptionList();
    };
    const handleUpgrade = async (row) => {
      // const { studentUserId, spuId, subjectId, duration, skuIds, classTypeId } =
      const upgradeOrderDetail =
        await root.$Api.financeManagement.reqUpgradeOrderDetail({
          orderId: row.orderId,
        });
      console.log(upgradeOrderDetail);
      emit("getUpgradeOrder", upgradeOrderDetail,row.orderId);
    };
    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      loading,
      total,
      handleCurrentChange,
      handleUpgrade,
    };
  },
};
</script>
