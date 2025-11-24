<template>
  <div class="audition-course">
    <section>
      <el-select
        clearable
        v-model="queryState.team"
        :placeholder="$t('请选择负责团队')"
      >
        <el-option
          v-for="item of Constants.responsiblieTeam(currentLang)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        clearable
        v-model="queryState.classTypeName"
        :placeholder="$t('请输入班型名称')"
      />
      <el-select
        clearable
        v-model="queryState.languageLabel"
        :placeholder="$t('请选择语言标签')"
      >
        <el-option
          v-for="item of Constants.langList(currentLang)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        clearable
        v-model="queryState.ageLabel"
        :placeholder="$t('请选择年龄标签')"
      >
        <el-option
          v-for="item of Constants.ageList(currentLang)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="queryState.startTime"
        type="date"
        :placeholder="$t('选择日期')"
      />
      <el-select
        clearable
        v-model="queryState.packageTreeId"
        :placeholder="$t('版本')"
        @change="handlePackageTreeChange"
      >
        <el-option
          v-for="item of queryState.packageTreeList"
          :key="item.packageTreeId"
          :label="
            currentLang === 'en' ? item.editionNameOpsEn : item.editionNameOpsZh
          "
          :value="item.packageTreeId"
        />
      </el-select>
      <el-select
        clearable
        v-model="queryState.levelId"
        :placeholder="$t('级别')"
        :loading="queryState.levelLodading"
      >
        <el-option
          v-for="item of queryState.levelList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        type="primary"
        @click="handlePaginationChange({ page: 1 })"
      >
        {{ $t("查询") }}
      </el-button>
    </section>
    <BasicTable
      height="50vh"
      v-loading="tableState.loading"
      :column="tableState.columns"
      :data="tableState.data"
      :page="paginationState.page"
      :total="paginationState.total"
      :limit="paginationState.limit"
      :pagination="true"
      :autoScroll="false"
      @pagination="handlePaginationChange"
    />
  </div>
</template>
<script>
import {
  reactive,
  computed,
  unref,
  onMounted,
  set,
} from "@vue/composition-api";
import {
  queryPackageTreeList,
  getCourseHierarchyData,
  getStudentCanApplyTryGroupTypeList,
  studentJoinTryGroupType,
} from "@/api/groupManagement";
import { ABNORMAL_CODE } from "@/utils/constants";

import moment from "moment";
import filters from "@/utils/filters";
import BasicTable from "@/components/table/basic-table";

export default {
  components: {
    BasicTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    progressInfo: {
      type: Object,
      default: () => ({
        packageId: "",
        scheduleInfo: [] /* packageTreeId, levelId, unitId, lessonId */,
      }),
    },
  },
  setup (props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);

    const { queryState, queryPackageTree, handlePackageTreeChange } =
      useQueryPart(props);

    const tableState = reactive({
      data: [],
      loading: true,
      columns: computed(() => {
        const { page, limit } = paginationState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            width: "130",
            label: root.$t("负责团队"),
            render: (h, { row }) => filters.teamFilter(row.team),
          },
          {
            label: root.$t("班型名称"),
            render: (h, { row }) => (
              <div onClick={() => goGroupTypeDetail(row.classTypeId)}>
                <div style="color: #9199ea">{row.classtypeNameZh}</div>
                {!!row.languageLabel && (
                  <el-tag type="success" class="mr5">
                    {filters.languageLabelFilter(row.languageLabel)}
                  </el-tag>
                )}
                {!!row.ageLabel && (
                  <el-tag type="danger">
                    {filters.ageLabelFilter(row.ageLabel)}
                  </el-tag>
                )}
              </div>
            ),
          },
          {
            label: root.$t("试听课程"),
            prop: unref(currentLang) === "en" ? "lessonDescEN" : "lessonDescZH",
          },
          {
            label: root.$t("上课时间"),
            render: (h, { row }) => {
              console.log(row.startTime);
              return moment(row.startTime).format("YYYY-MM-DD HH:mm:ss");
            },
          },
          { width: "130", label: root.$t("剩余名额"), prop: "remainNum" },
          {
            width: "130",
            label: root.$t("操作"),
            render: (h, { row }) => (
              <el-button
                type="text"
                loading={row.loading}
                onClick={() => handleSignUp(row)}
                disabled={!row.remainNum}
              >
                {root.$t("报名课程")}
              </el-button>
            ),
          },
        ];
      }),
    });

    const paginationState = reactive({ page: 1, limit: 10, total: 0 });

    const queryTableData = async () => {
      const { packageTreeList, levelList, levelLodading, ...params } =
        queryState;
      const { packageTreeId } = params;
      try {
        tableState.loading = true;
        const {
          status,
          data: { code, data },
        } = await getStudentCanApplyTryGroupTypeList(
          root.$route.query.studentId,
          props.progressInfo.packageId,
          paginationState.page,
          paginationState.limit,
          {
            ...params,
            packageTreeId: packageTreeId === "" ? null : packageTreeId,
          }
        );
        if (status !== 200 || code !== 200) return;
        tableState.data = data.list ?? [];
        paginationState.total = data.total;
      } finally {
        tableState.loading = false;
      }
    };

    const goGroupTypeDetail = (groupTypeId) => {
      emit("cancel");
      root.$router.push({ name: "groupTypeDetail", query: { groupTypeId } });
    };

    const handleSignUp = async (row) => {
      const title = root
        .$t("确定将当前学生报名$试听班型吗")
        .replace("$", row.classtypeNameZh);
      await root.$confirm(title, root.$t("报名班型"), {
        confirmButtonText: root.$t("确定"),
        cancelButtonText: root.$t("取消"),
        type: "warning",
      });
      set(row, "loading", true);
      const {
        status,
        data: { code },
      } = await studentJoinTryGroupType(
        root.$route.query.studentId,
        row.timetableId
      ).finally(() => {
        set(row, "loading", false);
      });
      if (code === ABNORMAL_CODE.classTypeApplyFaildAge) {
        return root.$notify({
          message: root.$t("学员年龄与课程要求不符，请选择其他课程报名"),
          type: "error",
        });
      }
      if (code === ABNORMAL_CODE.classTypeApplyFaildCapacity) {
        return root.$notify({
          message: root.$t("课程名额不足，报名失败"),
          type: "error",
        });
      }
      if (code === ABNORMAL_CODE.repeatRegistrationShuttleBus) {
        return root.$notify({
          message: root.$t("已报名该班车"),
          type: "error",
        });
      }
      if (status !== 200 || code !== 200) return;
      root.$notify({ message: root.$t("报名课程成功"), type: "success" });
      emit("ok");
    };

    const handlePaginationChange = (info) => {
      Object.assign(paginationState, info);
      queryTableData();
    };

    onMounted(async () => {
      const [packageTreeId, levelId] = props.progressInfo.scheduleInfo;
      packageTreeId ? await queryPackageTree() : queryPackageTree();
      if (packageTreeId && levelId) {
        queryState.packageTreeId = packageTreeId;
        await handlePackageTreeChange();
        queryState.levelId = levelId;
      }
      queryTableData();
    });

    return {
      currentLang,
      queryState,
      tableState,
      paginationState,

      handleSignUp,
      handlePaginationChange,
      handlePackageTreeChange,
    };
  },
};

const useQueryPart = (props) => {
  const queryState = reactive({
    team: null,
    classTypeName: null,
    languageLabel: null,
    ageLabel: null,
    startTime:new Date(
      new Date(new Date().toLocaleDateString()).getTime()
    ).toISOString(),

    packageTreeId: null,
    levelId: null,

    levelLodading: false,
    packageTreeList: [],
    levelList: [],
  });

  const queryPackageTree = async () => {
    const {
      status,
      data: { code, data },
    } = await queryPackageTreeList({
      packageId: props.progressInfo.packageId,
    });
    if (status !== 200 || code !== 200) return;
    queryState.packageTreeList = data;
  };

  const handlePackageTreeChange = async () => {
    try {
      Object.assign(queryState, {
        levelId: null,
        levelLodading: true,
        levelList: [],
      });
      if (!queryState.packageTreeId) return;
      const {
        status,
        data: { code, data },
      } = await getCourseHierarchyData({
        packageId: props.progressInfo.packageId,
        packageTreeId: queryState.packageTreeId,
      });
      if (status !== 200 || code !== 200) return;
      queryState.levelList = data;
    } finally {
      queryState.levelLodading = false;
    }
  };

  return {
    queryState,

    queryPackageTree,
    handlePackageTreeChange,
  };
};
</script>
<style lang="scss">
.audition-course {
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    margin: 10px 0;
  }
}
</style>
