<template>
  <div class="my-work-order">
    <div class="flex-end">
      <SetupLanguage />
    </div>
    <screen-wrapper @search="(tableState.page = 1), reqList()" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('家长ID')" v-if="!currStudentId" label-width="120">
        <el-input v-model.trim="screenData.parentId" :placeholder="$t('请输入家长ID')" @keyup.enter.native="search" />
      </screen-item>
      <screen-item :label="$t('工单ID')" label-width="120">
        <el-input clearable v-model.trim="screenData.thirdTicketId" :placeholder="$t('请输入工单ID')"
          @keyup.enter.native="search" />
      </screen-item>
      <screen-item :label="$t('工单预警')" label-width="120">
        <el-select v-model="screenData.alertPriority" filterable clearable :collapse-tags="true"
          :placeholder="$t('请选择')">
          <el-option v-for="(item, index) in warningOptionList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('工单状态')" label-width="120">
        <el-select v-model="screenData.status" filterable clearable :collapse-tags="true" :placeholder="$t('请选择')">
          <el-option v-for="(item, index) in statusOptionList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('工单优先级')" label-width="120">
        <FilterByWorkOrderPriority @changeSelect="(val) => {
        screenData.priority = val;
      }
      " />
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper" style="margin-top: 20px">
      <BasicTable v-loading="tableState.loading" header-cell-class-name="my-theme-color-header" border
        :data="tableState.data" :column="tableState.columns" :pagination="true" :page="tableState.page"
        :total="tableState.total" :limit="tableState.limit" @pagination="handlePaginationChange" />
    </custom-card>
  </div>
</template>
<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import BasicTable from "@/components/table/basic-table";
import FilterByWorkOrderPriority from "@/components/FilterItem/WorkOrderFilter/FilterByWorkOrderPriority";
import SetupLanguage from '../components/SetupLanguage.vue';

export default {
  components: {
    FilterByTimePeriod,
    BasicTable,
    FilterByWorkOrderPriority,
    SetupLanguage,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currStudentId = ref(root.$route.query.studentId);
    const screenData = reactive({
      parentId: "",
      thirdTicketId: "",
      alertPriority: "",
      status: "",
      priority: "",
      studentId: currStudentId.value || "",
    });
    const defaultTimeArr = ref([]);
    const warningOptionList = [
      { label: root.$t("低"), value: 1 },
      { label: root.$t("中"), value: 2 },
      { label: root.$t("紧急"), value: 3 },
    ];

    const statusOptionList = [
      { label: root.$t("工单-新建"), value: 0 },
      { label: root.$t("工单-已分配"), value: 1 },
      { label: root.$t("工单-处理中"), value: 2 },
      { label: root.$t("工单-已解决"), value: 3 },
      { label: root.$t("工单-重新打开"), value: 4 },
      { label: root.$t("工单-已关闭"), value: 5 },
    ];
    const isMobile = true;
    const columnFixed = !isMobile;
    const tableState = reactive({
      loading: false,
      total: 0,
      page: 1,
      limit: 20,
      data: [{}],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            fixed: columnFixed,
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            fixed: columnFixed,
            minWidth: "100",
            label: root.$t("工单预警"),
            prop: "alertPriority",
            render: (h, { row }) => (
              <el-tag
                effect="dark"
                type={alertPriorityColorMap[row.alertPriority]}
              >
                {root.$t("预警")}
              </el-tag>
            ),
          },
          {
            fixed: columnFixed,
            minWidth: "100",
            label: root.$t("工单编号"),
            prop: "thirdTicketId",
          },
          {
            fixed: columnFixed,
            minWidth: "200",
            label: root.$t("标题"),
            prop: "title",
            render: (h, { row }) => (
              <el-button
                onClick={() => handelView(row)}
                class="ml10"
                type="text"
              >
                {row.title}
              </el-button>
            ),
          },
          {
            minWidth: "100",
            label: root.$t("优先级"),
            prop: "status",
            render: (h, { row }) => (
              <span>{root.$t(alertPriorityNameMap[row.priority])}</span>
            ),
          },
          {
            minWidth: "100",
            label: root.$t("工单状态"),
            prop: "status",
            render: (h, { row }) => (
              <el-tag
                class={statusColorMAp[row.status]}
                type={statusColorMAp[row.status]}
              >
                {root.$t(statusNameMap[row.status])}
              </el-tag>
            ),
          },
          {
            label: root.$t("处理人"),
            width: 100,
            prop: "businessUserName",
          },
          {
            label: root.$t("创建人"),
            width: 100,
            prop: "createUserName",
          },
          {
            label: root.$t("创建时间"),
            width: 150,
            prop: "createTime",
          },
          {
            label: root.$t("已解决时间"),
            width: 150,
            prop: "solvedTime",
          },
          {
            fixed: isMobile ? false : "right",
            label: root.$t("操作"),
            width: 100,
            render: (h, { row }) => (
              <el-button
                onClick={() => handelView(row)}
                class="ml10"
                type="text"
              >
                {root.$t("查看")}
              </el-button>
            ),
          },
        ];
      }),
    });

    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [], total: 0 });
        const res = await root.$Api.workBench.reqWorkOrderList({
          pageNum: tableState.page,
          pageSize: tableState.limit,
          ...screenData,
        });
        Object.assign(tableState, {
          data: res?.data ?? [],
          total: res?.total - 0 ?? 0,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqList();
    };
    const handelView = (colum) => {
      root.$router.push({
        path: '/wecome/workOrderDetail',
        query: { id: colum.ticketId },
      });
    };
    const alertPriorityColorMap = {
      1: "info",
      2: "warning",
      3: "danger",
    };
    const statusNameMap = {
      0: "工单-新建",
      1: "工单-已分配",
      2: "工单-处理中",
      3: "工单-已解决",
      4: "工单-重新打开",
      5: "工单-已关闭",
    };
    const warningNameMap = {
      1: "低",
      2: "中",
      3: "紧急",
    };
    const alertPriorityNameMap = {
      10: "低",
      20: "中",
      30: "高",
      40: "紧急",
    };
    const statusColorMAp = {
      0: "primary",
      1: "purple",
      2: "warning",
      3: "success",
      4: "danger",
      5: "info",
    };
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      defaultTimeArr,
      tableState,
      warningOptionList,
      statusOptionList,
      reqList,
      handlePaginationChange,
      currStudentId,
    };
  },
};
</script>
<style lang="scss" scoped>
.my-work-order {
  min-height: 100vh;
  background-color: #fff;
  padding: 10px 0;

  .el-tag--purple {
    color: rgb(196, 10, 196);
    background: rgb(239, 207, 239);
  }
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
</style>
