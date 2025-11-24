<template>
  <div>
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('订阅创建时间')" :part="2" label-width="120">
        <FilterByTimePeriod
          v-if="defaultTimeArr.length"
          @changeSelect="
            (timeArr) => {
              screenData.startTime = timeArr[0];
              screenData.endTime = timeArr[1];
            }
          "
          :defaultTimeArr="defaultTimeArr"
        />
      </screen-item>
      <screen-item :label="$t('新账单时间')" :part="2" label-width="120">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.billingStartTime = timeArr[0];
              screenData.billingEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('家长id')" label-width="80" :part="2">
        <el-input
          style="width: 170px"
          clearable
          v-model.trim="screenData.parentUserId"
          :placeholder="$t('请输入家长ID')"
        />
      </screen-item>
      <screen-item :label="$t('订阅状态')" :part="4" label-width="80">
        <el-select
          v-model="screenData.status"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>

    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <!-- <div slot="header-right"></div> -->
      <el-table
        v-loading="loading"
        tooltip-effect="dark"
        :data="tableList"
        style="width: 100%; margin-top: 20px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column fixed align="center" :label="$t('序号')" width="60">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :width="item.width ? item.width : 'auto'"
        >
          <template slot-scope="scope">
            <span v-if="item.prop === 'createTime'">{{
              DateTimeUtils.dateClockTime(scope.row[item.prop])
            }}</span>
            <span v-else-if="item.prop === 'subscribeCycle'">
              {{ scope.row[item.prop] || "--" }}
              {{ getSubscribeCycleUnit(scope.row.subscribeCycleUnit) }}
            </span>
            <span v-else-if="item.prop === 'subscribeStatus'">{{
              getSubscribeStatus(scope.row[item.prop])
            }}</span>
            <span v-else-if="item.prop === 'subscribeEndTime'">{{
              DateTimeUtils.dateClockTime(scope.row[item.prop])
            }}</span>
            <template v-else>{{ scope.row[item.prop] || "--" }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('操作')"
          align="center"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.orderManagement.subscription.Operation'
                )
              "
              type="text"
              size="small"
              @click="openOperationRecord(scope.row)"
            >
              {{ $t("操作记录") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.orderManagement.subscription.cancelSubscription'
                )
              "
              :disabled="scope.row.subscribeStatus === 2"
              type="text"
              size="small"
              @click="openCancelSubscription(scope.row)"
            >
              {{ $t("终止订阅 btn") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.orderManagement.subscription.resetBllingCycle'
                )
              "
              :disabled="scope.row.subscribeStatus === 2"
              type="text"
              size="small"
              @click="openResetPeriod(scope.row)"
            >
              {{ $t("重置账期") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :pageSizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <!-- 操作记录 -->
    <OperationRecordDialog
      v-if="operationRecordVisible"
      :dialogVisible.sync="operationRecordVisible"
      :subscriptionId="subscriptionId"
    />
    <!-- 终止订阅 -->
    <CancelSubscriptionDialog
      :dialogVisible.sync="cancelSubscriptionVisible"
      :subscriptionId="subscriptionId"
      @updateTable="getTableData"
    />
    <!-- 重置账期 -->
    <ResetPeriodDialog
      :dialogVisible.sync="resetPeriodVisible"
      :subscriptionId="subscriptionId"
      :subscribeEndTime="subscribeEndTime"
      @updateTable="getTableData"
    />
  </div>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  watch,
  computed,
  onMounted,
} from "@vue/composition-api";
import CommonTree from "@/views/reportManagement/commonTree";
import OperationRecordDialog from "./components/operationRecordDialog.vue";
import CancelSubscriptionDialog from "./components/cancelSubscriptionDialog.vue";
import ResetPeriodDialog from "./components/resetPeriodDialog.vue";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  components: {
    CommonTree,
    OperationRecordDialog,
    CancelSubscriptionDialog,
    ResetPeriodDialog,
    FilterByTimePeriod,
  },
  setup(props, { root, emit, refs }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const screenData = reactive({
      parentUserId: "",
      status: "",
      startTime: "",
      endTime: "",
      billingStartTime: "",
      billingEndTime: "",
    });

    const tableObj = reactive({
      tableList: [],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      loading: false,
      tableColumn: computed(() => [
        { label: root.$t("订阅创建时间"), prop: "createTime", width: "150px" },
        { label: root.$t("订阅卡号"), prop: "subscribeId", width: "220px" },
        { label: root.$t("家长ID"), prop: "parentUserId", width: "130px" },
        { label: root.$t("学生姓名"), prop: "studentName", width: "150px" },
        { label: root.$t("SPU_ID"), prop: "spuId", width: "120px" },
        {
          label: root.$t("交易 - SPU名称"),
          prop: currentLang.value === "en" ? "spuNameEn" : "spuNameCn",
          width: "150px",
        },
        { label: root.$t("SKU_ID"), prop: "skuId", width: "150px" },
        {
          label: root.$t("交易 - SKU名称"),
          prop: currentLang.value === "en" ? "skuNameEn" : "skuNameCn",
          width: "250px",
        },
        { label: root.$t("订阅周期"), prop: "subscribeCycle", width: "120px" },
        {
          label: root.$t("新账单时间"),
          prop: "subscribeEndTime",
          width: "150px",
        },
        { label: root.$t("订阅状态"), prop: "subscribeStatus", width: "100px" },
      ]),
    });
    const subscriptionId = ref(null);
    const subscribeEndTime = ref(null);
    const operationRecordVisible = ref(false);
    const cancelSubscriptionVisible = ref(false);
    const resetPeriodVisible = ref(false);
    const statusList = computed(() => [
      { value: 1, label: root.$t("订阅成功") },
      { value: 2, label: root.$t("取消订阅") },
    ]);

    const getCurrentPage = (val) => {
      tableObj.pageNum = val;
      getTableData();
    };

    const getPerPage = (val) => {
      tableObj.pageSize = val;
      getTableData();
    };

    const search = () => {
      tableObj.pageNum = 1;
      tableObj.pageSize = 50;
      getTableData();
    };

    const getTableData = () => {
      if (screenData && screenData.parentUserId && !parentIdValidate(root, screenData.parentUserId)) {
        return;
      }
      tableObj.loading = true;
      let params = Object.assign(screenData, {
        pageNum: tableObj.pageNum,
        pageSize: tableObj.pageSize,
      });
      root.$Api.financeManagement
        .getSubscribeList(params)
        .then(({ status, data: { code, data } }) => {
          if (status == 200 && code == 200) {
            tableObj.tableList = data.list;
            tableObj.total = data.total;
          }
        })
        .finally(() => (tableObj.loading = false));
    };

    const openOperationRecord = (row) => {
      operationRecordVisible.value = true;
      subscriptionId.value = row.id;
    };
    const openCancelSubscription = (row) => {
      cancelSubscriptionVisible.value = true;
      subscriptionId.value = row.id;
    };
    const openResetPeriod = (row) => {
      resetPeriodVisible.value = true;
      subscriptionId.value = row.id;
      subscribeEndTime.value = row.subscribeEndTime;
    };

    const getSubscribeStatus = (val) => {
      switch (val) {
        case 0:
          return root.$t("待付款");
        case 1:
          return root.$t("订阅成功");
        case 2:
          return root.$t("取消订阅");
        default:
          return "--";
      }
    };

    const getSubscribeCycleUnit = (val) => {
      switch (val) {
        case 0:
          return root.$t("日");
        case 2:
          return root.$t("月");
        case 3:
          return root.$t("年");
        default:
          return "--";
      }
    };
    const defaultTimeArr = ref([]);

    onMounted(() => {
      defaultTimeArr.value = [
        new Date(root.DateTimeUtils.getMonthStartDate()),
        new Date(root.DateTimeUtils.getMonthEndDate()),
      ];
      screenData.startTime = defaultTimeArr.value[0];
      screenData.endTime = defaultTimeArr.value[1];
      getTableData();
    });

    return {
      screenData,
      operationRecordVisible,
      cancelSubscriptionVisible,
      resetPeriodVisible,
      statusList,
      subscriptionId,
      subscribeEndTime,
      defaultTimeArr,
      ...toRefs(tableObj),
      search,
      getCurrentPage,
      getPerPage,
      openOperationRecord,
      openCancelSubscription,
      openResetPeriod,
      getSubscribeStatus,
      getSubscribeCycleUnit,
      getTableData,
    };
  },
};
</script>
