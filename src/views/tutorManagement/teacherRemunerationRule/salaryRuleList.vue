<template>
  <div class="salary-rule-list">
    <section>
        <template>
            <label>{{ $t("规则名称") }}</label>
            <el-input class="w200 mr10" v-model="ruleList.ruleName" :placeholder="$t('搜索规则名称')"/>
        </template>
        <template>
            <label>{{ $t("状态") }}</label>
            <el-select class="mr10" clearable v-model="ruleList.ruleStatus" :placeholder="$t('请选择')">
                <el-option v-for="item in ruleStatus" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
        </template>
        <template>
            <label>{{ $t("规则类型") }}</label>
            <el-select clearable v-model="ruleList.ruleType" :placeholder="$t('请选择')">
                <el-option v-for="item in ruleType" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
        </template>
        <el-button type="primary" @click="handleSearch(1)">{{ $t("查询") }}</el-button>
        <el-button type="primary" @click="handleAddRule">+{{ $t("添加规则") }}</el-button>
    </section>
    <BasicTable
      v-loading="tableState.loading"
      border
      :column="tableState.columns"
      :data="tableState.data"
      :pagination="true"
      :limit="paginationState.limit"
      :page="paginationState.page"
      :total="paginationState.total"
      @pagination="handlePaginationChange"
    />
    <related-course-tree v-if="dialogVisible" :visible="dialogVisible" :subjectType="subjectType" :salaryLabel="salaryLabel" :activeType="activeType" :ruleInfo="ruleInfo" :ruleId="ruleInfo.ruleId" @confirm="handleConfirmDialog" @cancel="handleCancelDialog"/>
  </div>
</template>

<script>
import { ruleStatus, ruleType, ruleColumns } from "./data";
import { computed, reactive, watch, ref, onMounted, onUnmounted } from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table/table.vue";
import relatedCourseTree from "./relatedCourseTree.vue";
import eventBus from "@/utils/eventBus";
export default {
  name: "salaryRuleList",
  components: {
    BasicTable,
    relatedCourseTree,
  },
  props: {
    subjectType: {
      type: Number,
      required: true
    },
    salaryLabel: {
      type: String,
      required: true
    },
  },
  setup(props, { root }) {
    const ruleList = reactive({
      ruleName: "",
      ruleStatus: void 0,
      ruleType: void 0,
    });
    const dialogVisible = ref(false);
    const activeType = ref(1);
    const ruleInfo = ref({});
    const tableState = reactive({
      loading: false,
      data:[],
      columns: computed(() => {
        const { page, limit } = paginationState;
        return [
          {
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          ...ruleColumns(currencyList.value),
          {
            label: root.$t("关联课包"),
            render: (h, { row }) => (
              (row.ruleType === 1 || row.ruleType === 4) ? (
                <div>
                      <el-button type="text" onClick={() => handleViewPackage(row, 1)}>
                        {row.packageTreeCount}
                      </el-button>
                    {row.ruleStatus !== 1 && (
                      <el-button type="text" onClick={() => handleViewPackage(row, 2)}>
                        {root.$t("关联课包")}
                      </el-button>
                    )}</div>
              ) : (<span>——</span>)
            ),
          },
          {
            label: root.$t("操作"),
            render: (h, { row }) => (
              <div>
                {row.ruleStatus !== 1 && (
                  <el-button type="text" onClick={() => handleRule(row, 0)}>
                    {root.$t("编辑")}
                  </el-button>
                )}
                {row.ruleStatus === 1 && (
                  <el-button type="text" onClick={() => handleRule(row, 1)}>
                    {root.$t("查看")}
                  </el-button>
                )}
              </div>
            ),
          },
        ]
      }),
    });
    const paginationState = reactive({  
      page: 1,
      limit: 50,
      total: 0,
    });
    const currencyList = ref([]);
    const getCurrencyList = async () => {
        const data = await root.$Api.systemManagement.getCurrency();
        currencyList.value = data.filter(item => item.currency === "CNY" || item.currency === "USD");
    };
    const handleSearch = async (type) => {
      let params = {
        subjectType: props.subjectType,
        label: props.salaryLabel,
        ...ruleList,
        pageNum: type === 2 ? paginationState.page : 1,
        pageSize: type === 2 ? paginationState.limit : 50,
      }; 
      if(ruleList.ruleStatus === void 0 || ruleList.ruleStatus === ""){
        delete params.ruleStatus;
      }
      if(ruleList.ruleType === void 0 || ruleList.ruleType === ""){
        delete params.ruleType;
      }
      if(ruleList.ruleName === ""){
        delete params.ruleName;
      }
      await getTableData(params);
    };
    const handlePaginationChange = (info) => {
      Object.assign(paginationState, info);
      handleSearch(2);
    };
    const handleViewPackage = (row, type) => {
      dialogVisible.value = true;
      ruleInfo.value = row;
      activeType.value = type;
    };
    const handleRule = (row, type) => {
      root.$router.push({
        path: "/tutorManagement/addSalaryRule",
        query: {
          subjectType: props.subjectType,
          salaryLabel: props.salaryLabel,
          ruleId: row.ruleId,
          disabledForm: type === 0 ? 0 : 1,
          disabledPart: row.ruleStatus === 0 ? 1 : 0,
        },
      });
    };
    const handleAddRule = () => {
      window.open(root.$router.resolve({
        path: "/tutorManagement/addSalaryRule",
        query: {
          subjectType: props.subjectType,
          salaryLabel: props.salaryLabel,
          disabledForm: 0,
          disabledPart: 0,
        },
      }).href, "_newTab");
    };
    const handleConfirmDialog = async (checkedNodes) => {
      console.log("checkedNodes",checkedNodes);
      const params = {
        ruleId: ruleInfo.value.ruleId,
        packageInfoList: checkedNodes[1],
      };
      const res = await root.$Api.tutorManagement.bindPackageTree({...params});
      console.log("res",res);
      dialogVisible.value = false;
      getNewData();
    };
    const handleCancelDialog = () => {
      dialogVisible.value = false;
    };
    const getTableData = async (params) => {
      const res= await root.$Api.tutorManagement.getSalaryRuleList({
        ...params
      });
      tableState.data = res?.list || [];
      paginationState.total = res?.total || 0;
    }
    const getNewData = async () => {
      let params = {
        subjectType: props.subjectType,
        label: props.salaryLabel,
        pageNum: paginationState.page,
        pageSize: paginationState.limit,
      };
      await getTableData(params);
    };
    watch([() => props.subjectType, () => props.salaryLabel], () => {
      console.log(props.subjectType, props.salaryLabel);
      getNewData();
    },{
      immediate: true,
    });
    
    // 监听事件总线，当从addSalaryRule页面返回时刷新数据
    const handleUpdateSalaryRuleList = () => {
      getNewData();
    };
    onMounted(() => {
      getCurrencyList();
      // 监听事件总线
      eventBus.$on("updateSalaryRuleList", handleUpdateSalaryRuleList);
      // 设置subjectType的默认值
      eventBus.$on("infoList",(basicInfo) => {
        if(basicInfo.ruleId){
          props.subjectType = basicInfo.subjectType;
          props.salaryLabel = basicInfo.salaryLabel;
          getNewData();
        }
      })
    });
    onUnmounted(() => {
      eventBus.$off("updateSalaryRuleList", handleUpdateSalaryRuleList);
    });
    return { 
      ruleList, 
      tableState, 
      paginationState, 
      ruleStatus, 
      ruleType,
      dialogVisible,
      activeType,
      ruleInfo,
      handleSearch, 
      handlePaginationChange,
      handleViewPackage,
      handleRule,
      handleAddRule,
      handleConfirmDialog,
      handleCancelDialog,
    };
  }
};
</script>

<style lang="scss" scoped>
.salary-rule-list {
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