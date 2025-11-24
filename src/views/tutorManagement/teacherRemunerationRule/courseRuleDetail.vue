<template>
  <div class="course-rule-detail">
    <section>
        <template>
            <label>{{ $t('课包') }}</label>
            <el-select v-model="courseDetail.courseName" class="mr20" clearable>
                <el-option v-for="item in courseList" :key="item.packageId" :label="courseName(item.coursePackageNameList)" :value="item.packageName" />
            </el-select>
        </template>
        <template>
            <label>{{ $t('关联规则') }}</label>
            <el-select v-model="courseDetail.ruleName" class="mr20" clearable>
                <el-option v-for="item in ruleList" :key="item" :label="item" :value="item" />
            </el-select>
        </template>
        <template>
            <label>{{ $t('状态') }}</label>
            <el-select v-model="courseDetail.status" class="mr50" clearable>
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </template>
        <el-button type="primary" @click="handleSearch">{{ $t("查询") }}</el-button>
        <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
    </section>
    <BasicTable
        v-loading="tableState.loading"
        border
        :column="tableState.columns"
        :data="tableState.data"
        :page="paginationState.page"
        :total="paginationState.total"
        :limit="paginationState.limit"
        :pagination="true"
        @pagination="handlePaginationChange"
    />
    <ruleDetailDialog :ruleId="ruleId" :dialogVisible="dialogVisible" :ruleName="ruleName" @close="handleClose"/>
  </div>
</template>

<script>
import { reactive, computed, onMounted, ref, provide } from "@vue/composition-api";
import { ruleStatus, courseRuleDetailColumns } from "./data";
import BasicTable from "@/components/table/basic-table/table.vue";
import ruleDetailDialog from "./ruleDetailDialog.vue";
export default {
  name: "courseRuleDetail",
  components: {
    BasicTable,
    ruleDetailDialog,
  },
  setup(props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const courseList = ref ([]);
    const ruleList = ref([]);
    const rootData = ref({});
    const dialogVisible = ref(false);
    const ruleId = ref("");
    const ruleName = ref("");
    const courseName = (coursePackageNameList) => {
      return isEn.value ? coursePackageNameList.find(item => item.languageCode === "EN").name : coursePackageNameList.find(item => item.languageCode === "CN").name;
    }
    const statusList = reactive([
        {
            label: root.$t("全部"),
            value: ''
        },
        ...ruleStatus
    ]);
    const courseDetail = reactive({
      courseName: "",
      ruleName: "",
      status: "",
    });
    const paginationState = reactive({
        page: 1,
        limit: 50,
        total: 0,
    });
    const openRuleDetailDialog = (row) => {
      dialogVisible.value = true;
      ruleId.value = row.ruleId;
      ruleName.value = row.ruleName;
    };
    const tableState = reactive({
        loading: false,
        data: [],
        columns: computed(() => {
            const { page, limit } = paginationState;
            return [
                {
                    label: root.$t("序号"),
                    render: (h, { $index }) => (page - 1) * limit + $index + 1,
                },
                ...courseRuleDetailColumns(openRuleDetailDialog),
            ]
        })
    });
    const handlePaginationChange = (info) => {
      Object.assign(paginationState, info);
      handleSearch();
    };
    const handleSearch = () => {
      const params = {
        subjectType: rootData.value.subjectType,
        salaryLabel: rootData.value.salaryLabel,
        pageSize: paginationState.limit,
        pageNum: paginationState.page,
      };
      if (courseDetail.courseName) {
        params.packageName = courseDetail.courseName;
      }
      if (courseDetail.ruleName) {
        params.ruleName = courseDetail.ruleName;
      }
      if (courseDetail.status !== "") {  
        params.ruleStatus = courseDetail.status;
      }
      queryTableData(params);
    };
    const handleCancel = () => {
      console.log(courseDetail.value);
    };
    const getCourseList = async (params) => {
        const res = await root.$Api.groupManagement.queryClassPackageList(params);
        if (res.status === 200 && res.data.code === 200) {
            courseList.value = res.data?.data || [];
        }
    };
    const getRuleList = async (params) => {
        const res = await root.$Api.tutorManagement.getRuleNameList(params);
        ruleList.value = res;
    };
    const queryTableData = async (params) => {
        tableState.loading = true
        const res = await root.$Api.tutorManagement.getCourseList(params);
        tableState.data = res.list;
        tableState.loading = false
        paginationState.total = res.total;
    };
    const salaryLabelList = ref([]);
    const getsalaryLabelList = async (subjectType) => {
        let businessLine = Number(subjectType) + 1;
        const res = await root.$Api.tutorManagement.getSalaryLabelsList(businessLine);
        if (res.status === 200 && res.data.code === 200) {
            salaryLabelList.value = res.data?.data || [];
        }
    };
    const currencyList = ref([]);
    const getCurrencyList = async () => {
        const data = await root.$Api.systemManagement.getCurrency();
        currencyList.value = data.filter(item => item.currency === "CNY" || item.currency === "USD");
    };
    provide("salaryLabelList", salaryLabelList);
    provide("currencyList", currencyList);
    onMounted(() => {
      rootData.value = root.$route.query;
      getCourseList({...rootData.value});
      getRuleList({...rootData.value});
      let params = {
        subjectType: rootData.value.subjectType,
        salaryLabel: rootData.value.salaryLabel,
        pageSize: paginationState.limit,
        pageNum: paginationState.page,
      };
      queryTableData(params);
      getsalaryLabelList(rootData.value.subjectType);
      getCurrencyList();
    });
    const handleClose = (newVal) => {
      dialogVisible.value = newVal;
    };
    return { 
        courseDetail,
        courseList,
        ruleList,
        statusList,
        tableState,
        paginationState,
        dialogVisible,
        ruleId,
        ruleName,
        handleSearch, 
        handleCancel,
        queryTableData,
        handlePaginationChange,
        courseName,
        handleClose,
        openRuleDetailDialog,
        salaryLabelList,
        currencyList,
    };
  },
};
</script>

<style lang="scss" scoped>
.course-rule-detail {
  padding: 20px;
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
  }
}
</style>