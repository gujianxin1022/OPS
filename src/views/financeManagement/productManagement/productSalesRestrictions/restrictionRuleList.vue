<template>
  <div class="my-work-order">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item :label="$t('规则名称')" label-width="120">
        <el-input
          v-model.trim="screenData.ruleName"
          :placeholder="$t('请输入')"
          @keyup.enter.native="reqList"
        />
      </screen-item>
      <screen-item :label="$t('SKU ID')" label-width="120">
        <el-input
          clearable
          v-model.trim="screenData.skuId"
          :placeholder="$t('请输入')"
          @keyup.enter.native="reqList"
          @input="handleInput"
        />
      </screen-item>
      <screen-item :label="$t('规则状态')" label-width="120">
        <el-select
          v-model="screenData.status"
          filterable
          clearable
          :collapse-tags="true"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in statusOptionList"
            :key="index"
            :label="$t(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('新签/续费')" label-width="120">
        <FilterByTagContain
          @change="
            (type, value) => {
              screenData.tagContain = type;
              screenData.userChannel = value;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('渠道码')" label-width="120">
        <FilterByCodeContain
          @search="reqList"
          @change="
            (type, value) => {
              screenData.codeContain = type;
              screenData.channelCode = value;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('生效时间')" label-width="120">
        <FilterByTimePeriod
          v-if="defaultTimeArr"
          @changeSelect="
            (timeArr) => {
              screenData.startTime = timeArr[0];
              screenData.endTime = timeArr[1];
            }
          "
          :defaultTimeArr="defaultTimeArr"
        />
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button
          style="width: 120px"
          class="fr"
          type="primary"
          @click="handelCreate"
          >{{ $t("新建") }}</el-button
        >
      </div>
      <BasicTable
        v-loading="tableState.loading"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
        :pagination="true"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        @pagination="handlePaginationChange"
      />
    </custom-card>
  </div>
</template>
<script>
import {
  onMounted,
  watch,
  ref,
  computed,
  reactive,
} from "@vue/composition-api";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import BasicTable from "@/components/table/basic-table";
import { withNewSaleRule } from "./dataConfig/communicate";
import FilterByCodeContain from "./components/FilterByCodeContain.vue";
import FilterByTagContain from "./components/FilterByTagContain.vue";

export default {
  components: {
    FilterByTimePeriod,
    BasicTable,
    FilterByCodeContain,
    FilterByTagContain,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = reactive({
      ruleName: "",
      status: "",
      skuId: "",
      startTime: "",
      endTime: "",
      codeContain: "0",
      channelCode: "",
      tagContain: "0",
      userChannel: "",
    });
    const defaultTimeArr = ref([]);
    const statusOptionList = [
      { label: "全部", value: "" },
      { label: "未开始", value: 0 },
      { label: "生效中", value: 1 },
      { label: "已结束", value: 2 },
    ];
    const tableState = reactive({
      loading: false,
      total: 0,
      page: 1,
      limit: 10,
      data: [{}],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            fixed: true,
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            fixed: true,
            minWidth: "80",
            label: root.$t("规则ID"),
            prop: "id",
          },
          {
            fixed: true,
            minWidth: "280",
            label: root.$t("规则名称"),
            prop: "ruleName",
            render: (h, { row }) => (
              <el-button
                onClick={() => handelView(row.id)}
                class="ml10"
                type="text"
              >
                {row.ruleName}
              </el-button>
            ),
          },
          {
            minWidth: "200",
            label: root.$t("规则描述"),
            prop: "ruleDesc",
          },
          {
            minWidth: "200",
            label: root.$t("SKU ID"),
            prop: "skuIdList",
            render: (_, { row }) => {
              return row.skuIdList.join(",").length > 100 ? (
                <el-tooltip
                  style="width:300px"
                  content={row.skuIdList.join(",")}
                  placement="right"
                >
                  <span>
                    {row.skuIdList.join(",").substring(0, 100) + "..."}
                  </span>
                  ;
                </el-tooltip>
              ) : (
                <span>{row.skuIdList.join(",")}</span>
              );
            },
          },
          {
            label: root.$t("生效时间"),
            width: 140,
            render: (_, { row }) => {
              return (
                <span>
                  {root.DateTimeUtils.dateClockTime(row.startTime)} <br />~
                  <br />
                  {root.DateTimeUtils.dateClockTime(row.endTime)}
                </span>
              );
            },
          },
          {
            label: root.$t("状态"),
            width: 100,
            prop: "status",
            render: (_, { row }) => {
              return (
                <span style={row.status === 1 ? "color:#67C23A" : ""}>
                  {root.$t(
                    statusOptionList.filter((e) => {
                      return e.value === row.status;
                    })[0].label
                  )}
                </span>
              );
            },
          },
          {
            label: root.$t("最近修改时间"),
            width: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.updateTime &&
                  row.updateUserName &&
                  row.updateUserName.length
                    ? root.DateTimeUtils.dateClockTime(row.updateTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("最近修改人"),
            width: 100,
            prop: "updateUserName",
          },
          {
            label: root.$t("创建时间"),
            width: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.createTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("创建人"),
            width: 100,
            prop: "createUserName",
          },
          {
            label: root.$t("操作"),
            width: 150,
            fixed: "right",
            render: (h, { row }) => (
              <span>
                <el-button
                  onClick={() => handelEdit(row.id)}
                  class="ml10"
                  type="text"
                  disabled={row.status === 2}
                >
                  {root.$t("编辑")}
                </el-button>
                <el-button
                  onClick={() => handelCopy(row.id)}
                  class="ml10"
                  type="text"
                >
                  {root.$t("复制")}
                </el-button>

                <el-button
                  disabled={row.status === 1}
                  onClick={() => handleDele(row.id)}
                  class="ml10"
                  type="text"
                >
                  {root.$t("删除")}
                </el-button>
                <br />
                <el-button
                  disabled={row.status !== 0}
                  onClick={() => handelChangeRuleStatus(row.id, 1)}
                  class="ml10"
                  type="text"
                >
                  {root.$t("立即开始")}
                </el-button>
                <el-button
                  disabled={row.status !== 1}
                  onClick={() => handelChangeRuleStatus(row.id, 0)}
                  class="ml10"
                  type="text"
                >
                  {root.$t("立即结束")}
                </el-button>
              </span>
            ),
          },
        ];
      }),
    });
    watch(withNewSaleRule, (val) => {
      if (val) {
        tableState.page = 1;
        reqList();
      }
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [], total: 0 });
        const res = await root.$Api.financeManagement.reqSaleRuleList({
          pageNum: tableState.page,
          pageSize: tableState.limit,
          ruleName: screenData.ruleName,
          status: screenData.status,
          userChannel: screenData.userChannel,
          channelCode: screenData.channelCode,
          skuId: screenData.skuId,
          startTime: screenData.startTime,
          endTime: screenData.endTime,
          codeContain: screenData.codeContain,
          tagContain: screenData.tagContain,
        });
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        tableState.loading = false;
        withNewSaleRule.value = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
    };
    watch(
      () => tableState.limit,
      () => {
        tableState.page = 1;
        if (tableState.loading) return;
        reqList();
      }
    );
    watch(
      () => tableState.page,
      () => {
        reqList();
      }
    );
    const handelView = (id) => {
      root.$router.push({
        path: "/financeManagement/restrictionRuleInfo",
        query: { id: id, type: "view" },
      });
    };
    const handelCreate = () => {
      root.$router.push({
        path: "/financeManagement/restrictionRuleInfo",
        query: { type: "create" },
      });
    };
    const handelEdit = async (id) => {
      root.$router.push({
        path: "/financeManagement/restrictionRuleInfo",
        query: { id: id, type: "edit" },
      });
    };
    const handelCopy = async (id) => {
      root.$router.push({
        path: "/financeManagement/restrictionRuleInfo",
        query: { id: id, type: "copy" },
      });
    };
    const handelChangeRuleStatus = async (id, status) => {
      await root.$Api.financeManagement.reqSaleRuleStartOrEnd({
        id,
        status,
      });
      root.$notify.success(root.$t("操作成功"));
      reqList();
    };
    const handleDele = async (id) => {
      await root.$confirm(root.$t("是否确认删除此规则吗?"), root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      await root.$Api.financeManagement.reqSaleRuledelete({
        id,
      });
      root.$notify.success(root.$t("操作成功"));
      reqList();
    };
    const handleInput = () => {
      const skuId = screenData.skuId.replace(/[^\d]/g, "");
      screenData.skuId = skuId;
    };
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      defaultTimeArr,
      tableState,
      statusOptionList,
      reqList,
      handlePaginationChange,
      handelCreate,
      handleInput,
    };
  },
};
</script>
<style lang="scss">
.my-work-order {
  padding-bottom: 10px;
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 350px !important;
}
</style>
