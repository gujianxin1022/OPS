<template>
  <div class="formal-course">
    <el-tabs
      v-model="queryState.isStart"
      type="card"
    >
      <el-tab-pane
        v-for="item of Constants.getClassType(currentLang)"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
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
      <el-select
        clearable
        v-model="queryState.week"
        :placeholder="$t('请选择周几')"
      >
        <el-option
          v-for="item of Constants.weekList(currentLang)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-time-select
        :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
        v-model="queryState.time"
        :placeholder="$t('选择时间')"
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
      >{{
        $t("查询")
      }}</el-button>
    </section>
    <BasicTable
      v-loading="tableState.loading"
      :height="hideTableBody? '' : '50vh'"
      :class="{ hideTableBody: hideTableBody }"
      :column="tableState.columns"
      :data="tableState.data"
      :page="paginationState.page"
      :total="paginationState.total"
      :limit="paginationState.limit"
      :pagination="true"
      :autoScroll="false"
      @pagination="handlePaginationChange"
    />
    <div
      class="empty"
      v-if="hideTableBody"
    >
      {{ $t("暂无可报名的新班车, 请查看") }}
      <el-button
        type="text"
        @click="queryState.isStart = DEPARTURE_CLASS_TYPE"
      >
        {{ $t("已发班车") }}
      </el-button>
      {{ currentLang === 'en' ? '' : $t("是否有可插班班级") }}
    </div>
  </div>
</template>
<script>
import {
  unref,
  reactive,
  computed,
  onMounted,
  watch,
  set,
} from "@vue/composition-api";
import {
  queryPackageTreeList,
  getCourseHierarchyData,
  getStudentCanApplyNormalGroupTypeList,
  studentJoinNormalGroupType,
} from "@/api/groupManagement";
import {
  DEPARTURE_CLASS_TYPE,
  NO_DEPARTURE_CLASS_TYPE,
  ABNORMAL_CODE,
} from "@/utils/constants";

import filters from "@/utils/filters";
import moment from "moment";
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

    const hideTableBody = computed(
      () =>
        queryState.isStart === NO_DEPARTURE_CLASS_TYPE &&
        !tableState.data.length &&
        !tableState.loading
    );

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
          {
            width: "130",
            label: root.$t("负责团队"),
            render: (h, { row }) => filters.teamFilter(row.team),
          },
          {
            label: root.$t("班型名称"),
            render: (h, { row }) => (
              <div onClick={() => goGroupTypeDetail(row.id)}>
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
            label: root.$t("上课周期(北京)"),
            render: (h, { row }) => filters.normalWeekListMap(row.weekList),
          },
          {
            width: "130",
            label: root.$t("下节课日期"),
            render: (h, { row }) =>
              moment(row.nextLessonTime).format("YYYY-MM-DD"),
          },
          {
            label: root.$t("下节课程"),
            prop:
              unref(currentLang) === "en"
                ? "nextLessonDescEN"
                : "nextLessonDescZH",
          },
          {
            width: "130",
            label: root.$t("剩余名额"),
            prop: "remainNum",
          },
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
      const { packageTreeList, levelList, levelLodading, isStart, ...params } =
        queryState;
      const { packageTreeId } = params;
      try {
        tableState.loading = true;
        tableState.data = [];
        const {
          status,
          data: { code, data },
        } = await getStudentCanApplyNormalGroupTypeList(
          root.$route.query.studentId,
          props.progressInfo.packageId,
          isStart,
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
        .$t("确定将当前学生报名$正式班型吗")
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
      } = await studentJoinNormalGroupType(
        root.$route.query.studentId,
        row.id
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

    watch(
      () => queryState.isStart,
      () => queryTableData()
    );

    onMounted(async () => {
      const [packageTreeId, levelId] = props.progressInfo.scheduleInfo;
      packageTreeId ? await queryPackageTree() : queryPackageTree();
      if (packageTreeId && levelId) {
        queryState.packageTreeId = packageTreeId
        await handlePackageTreeChange();
        queryState.levelId = levelId;
      }
      queryTableData();
    });

    return {
      DEPARTURE_CLASS_TYPE,

      currentLang,
      hideTableBody,
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
    isStart: NO_DEPARTURE_CLASS_TYPE,
    team: "",
    classTypeName: "",
    languageLabel: "",
    ageLabel: "",
    week: "",
    time: "",
    packageTreeId: "",
    levelId: "",

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
        levelId: "",
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
.formal-course {
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    margin: 10px 0;
  }
  .hideTableBody {
    .el-table__empty-block {
      display: none;
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30vh;
  }
}
</style>
