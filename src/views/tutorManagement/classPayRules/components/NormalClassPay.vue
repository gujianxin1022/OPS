<template>
  <div class="normal-class-pay">
    <section>
      <template>
        <label>{{ $t("课程包名称") }}</label>
        <el-select
          class="mr20"
          :placeholder="$t('请选择')"
          v-model="queryState.packageId"
        >
          <el-option
            v-for="item of queryState.coursePackageList"
            :key="item.packageId"
            :label="isEn ? item.nameEn : item.nameZh"
            :value="item.packageId"
          />
        </el-select>
      </template>
      <template>
        <label>{{ $t("状态") }}</label>
        <el-select v-model="queryState.ruleStatus" :placeholder="$t('请选择')">
          <el-option
            v-for="item in queryState.statusList"
            :label="$t(item.label)"
            :key="item.value"
            :value="item.value"
          />
        </el-select>
      </template>
      <el-button type="primary" @click="handlePaginationChange({ page: 1 })">
        {{ $t("查询") }}
      </el-button>
      <el-button @click="handleReset">{{ $t("重置") }}</el-button>
      <el-button type="primary" @click="handleAddRule">
        {{ $t("新增规则") }}
      </el-button>
    </section>
    <BasicTable
      v-loading="tableState.loading"
      :column="tableState.columns"
      :data="tableState.data"
      :page="paginationState.page"
      :total="paginationState.total"
      :limit="paginationState.limit"
      :pagination="true"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import { reactive, watch, computed, unref } from "@vue/composition-api";

import moment from "moment";
import BasicTable from "@/components/table/basic-table";

const RULE_STATUS = { 0: "有效的", 1: "无效的" };

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default {
  components: {
    BasicTable,
  },
  props: ["subjectType"],
  setup(props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const { queryState, ...events } = useQuery(props, { root });

    const tableState = reactive({
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = paginationState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          { width: "180", label: root.$t("规则名称"), prop: "ruleName" },
          {
            width: "150",
            label: root.$t("生效时间"),
            render: (h, { row }) =>
              moment(row.effectiveTime).format(TIME_FORMAT),
          },
          {
            width: "150",
            label: root.$t("失效时间"),
            render: (h, { row }) => moment(row.expireTime).format(TIME_FORMAT),
          },
          {
            width: "160",
            label: root.$t("包含课程包"),
            prop: unref(isEn) ? "packageNameEn" : "packageNameZh",
          },
          {
            width: "120",
            label: root.$t("规则状态"),
            render: (h, { row: { ruleStatus } }) =>
              root.$t(RULE_STATUS[ruleStatus]),
          },
          {
            width: "120",
            label: root.$t("最近修改人"),
            prop: "updateUserName",
          },
          {
            width: "150",
            label: root.$t("最近修改时间"),
            render: (h, { row: { updateTime } }) =>
              updateTime && moment(updateTime).format(TIME_FORMAT),
          },
          { width: "120", label: root.$t("创建人"), prop: "createUserName" },
          {
            width: "150",
            label: root.$t("创建时间"),
            render: (h, { row }) => moment(row.createTime).format(TIME_FORMAT),
          },
          {
            fixed: "right",
            label: root.$t("操作"),
            render: (h, { row }) => (
              <div>
                <el-button type="text" onClick={() => handleViewDetails(row)}>
                  {root.$t("详情")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });

    const paginationState = reactive({ page: 1, limit: 50, total: 0 });

    const handlePaginationChange = (info) => {
      Object.assign(paginationState, info);
      queryTableData();
    };

    const handleViewDetails = (row) => {
      root.$router.push({
        name: "detailsOfPayRules",
        query: {
          effectiveTime: row.effectiveTime,
          expireTime: row.expireTime,
          ruleName: row.ruleName,
          packageId: row.packageId,
          ruleId: row.ruleId,
          subjectType: row.subjectType,
        },
      });
    };

    const queryCoursePackageList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryClassPackageList({
        subjectType: props.subjectType,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      queryState.coursePackageList = data.map((v) => {
        let nameZh, nameEn;
        v.coursePackageNameList?.forEach(({ languageCode, name }) => {
          if (languageCode === "CN") nameZh = name;
          if (languageCode === "EN") nameEn = name;
        });
        return { ...v, nameZh, nameEn };
      });
    };

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        tableState.data = [];
        const { statusList, coursePackageList, ...params } = queryState;
        const res = await root.$Api.tutorManagement.getPackageRuleList({
          ...params,
          subjectType: props.subjectType,
          pageNum: paginationState.page,
          pageSize: paginationState.limit,
        });
        tableState.data = res?.list ?? [];
        paginationState.total = res?.total ?? 0;
      } finally {
        tableState.loading = false;
      }
    };

    watch(
      () => props.subjectType,
      () => {
        queryState.packageId = void 0;
        queryTableData();
        queryCoursePackageList();
      }
    );

    return {
      queryState,
      tableState,
      paginationState,

      ...events,
      queryCoursePackageList,
      handlePaginationChange,
    };
  },
};

const useQuery = (props, { root }) => {
  const queryState = reactive({
    packageId: void 0,
    ruleStatus: void 0,

    statusList: [
      { label: "全部", value: void 0 },
      ...Object.keys(RULE_STATUS).map((key) => ({
        label: RULE_STATUS[key],
        value: key,
      })),
    ],
    coursePackageList: [],
  });

  const handleReset = () => {
    Object.assign(queryState, { ruleStatus: void 0, packageId: void 0 });
  };

  const handleAddRule = () => {
    root.$router.push({
      name: "detailsOfPayRules",
      query: { subjectType: props.subjectType },
    });
  };

  return {
    queryState,

    handleReset,
    handleAddRule,
  };
};
</script>

<style lang="scss" scoped>
.normal-class-pay {
  section {
    margin-bottom: 16px;
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 16px;
    label {
      font-weight: 500;
      font-size: 14px;
      margin-right: 8px;
      color: #606266;
    }
    .el-button--primary {
      margin-left: 10px;
    }
    .el-button {
      &:last-child {
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
