<template>
  <div class="translate-class-wrap">
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
        v-model="queryState.className"
        clearable
        :placeholder="$t('请输入班级名称')"
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
      <el-input
        v-model="queryState.tutorRealName"
        clearable
        :placeholder="$t('请输入老师名称')"
      />
      <el-button type="primary" @click="handlePageChange({ page: 1 })">{{
        $t("查询")
      }}</el-button>
    </section>
    <BasicTable
      v-loading="loading"
      height="50vh"
      :column="columns"
      :data="data"
      :page="page"
      :total="total"
      :limit="limit"
      :pagination="true"
      @pagination="handlePageChange"
    />
    <TranslateClassConfirm
      v-if="showTranslateClassConfirm"
      :visible.sync="showTranslateClassConfirm"
      @confirmCb="handleConfirm"
      :refferInfo="refferInfo"
      :enterClassId="enterClassId"
      :leaveClassInfo="classInfo"
      :packageTreeId="classInfo.packageTreeId"
      :lessonId="classInfo.lessonId"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  computed,
  toRaw,
  toRefs,
  watch,
  onActivated,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import filters from "@/utils/filters";
import TranslateClassConfirm from "./translateClassConfirm.vue";
import moment from "moment";

import { translateClassAfterCheck } from "@/api/groupManagement";

export default defineComponent({
  components: { BasicTable, TranslateClassConfirm },
  props: {
    refferInfo: {
      type: Object,
      default: {
        sid: null,
        classId: null,
        studentName: "",
        coursePackageId: null,
      },
    },
    classInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const queryState = reactive({
      team: "",
      className: "",
      languageLabel: "",
      ageLabel: "",
      week: "",
      time: "",
      tutorRealName: "",
    });
    const enterClassId = ref(null);

    const flagState = reactive({
      showTranslateClassConfirm: false,
    });

    watch(
      () => props.classInfo,
      (info) => {
        if (info.classId) {
          getTableData();
        }
      },
      { deep: true }
    );

    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            width: "130",
            label: root.$t("负责团队"),
            render: (h, { row }) =>
              filters.teamFilter(row.team, currentLang.value === "en"),
          },
          {
            label: root.$t("班级名称"),
            width: "150",
            render: (h, { row }) => (
              <span>
                {currentLang.value === "en" ? row.className : row.classNameZh}
                {row.languageLabel ? (
                  <el-tag type="success" class="mr5">
                    {filters.languageLabelFilter(
                      row.languageLabel,
                      currentLang === "en"
                    )}
                  </el-tag>
                ) : (
                  ""
                )}
                {row.ageLabel ? (
                  <el-tag type="danger">
                    {filters.ageLabelFilter(row.ageLabel)}
                  </el-tag>
                ) : (
                  ""
                )}
              </span>
            ),
          },
          {
            label: root.$t("下节课进度"),
            width: "150",
            render: (h, { row }) => (
              <span>
                {currentLang.value === "en"
                  ? row.nextLessonDescEN
                  : row.nextLessonDescZH}
              </span>
            ),
          },
          {
            label: root.$t("上课周期"),
            width: "150",
            render: (h, { row }) => (
              <span class="cell">
                {filters.normalWeekListMap(
                  row.weekList,
                  currentLang.value === "en"
                )}
              </span>
            ),
          },
          {
            width: "130",
            label: root.$t("该进度课程时间"),
            render: (h, { row }) =>
              moment(row.startTime).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            width: "130",
            label: root.$t("距离该节课节数"),
            prop: "lessonNum",
          },
          {
            width: "130",
            label: root.$t("班级老师"),
            render: (h, { row }) => (
              <el-button type="text" onClick={() => jumpTeacherDetail(row)}>
                {row.tutorRealName}
              </el-button>
            ),
          },
          {
            width: "130",
            label: root.$t("已有学生"),
            prop: "userNum",
          },
          {
            width: "130",
            label: root.$t("学员信息"),
            render: (h, { row }) => (
              <el-popover
                onShow={() => reqStudentofClass(row.classId)}
                placement="right"
                width="200"
                trigger="click"
              >
                <div v-loading={loadingStudentsInfo.value}>
                  {studentsInfoList.value.map((x) => (
                    <p key={x.id}>
                      <span class="mr10">{x.realName}</span>
                      <span class="mr10">
                        {root.Filters.mapGender(x.gender, currentLang)}
                      </span>
                      {x.age}岁
                    </p>
                  ))}
                </div>
                <el-button slot="reference" type="text">
                  {root.$t("点击查看")}
                </el-button>
              </el-popover>
            ),
          },
          {
            width: "130",
            label: root.$t("剩余位置"),
            prop: "userRemain",
          },
          {
            width: "130",
            label: root.$t("操作"),
            render: (h, { row }) => (
              <el-button type="text" onClick={() => handletranslateClass(row)}>
                {root.$t("转班")}
              </el-button>
            ),
          },
        ];
      }),
    });

    const studentsInfoList = ref([]);
    const loadingStudentsInfo = ref(false);
    const reqStudentofClass = async (id) => {
      try {
        loadingStudentsInfo.value = true;
        const {
          status,
          data: { data, code },
        } = await root.$Api.groupManagement.getGroupStudentInfo(id);
        if (status !== 200 || code !== 200) return Promise.reject();
        studentsInfoList.value = data || [];
      } finally {
        loadingStudentsInfo.value = false;
      }
    };

    const handlePageChange = (obj) => {
      Object.assign(tableState, obj);
      getTableData();
    };

    const getTableData = () => {
      const {
        refferInfo: { sid },
      } = props;
      const {
        classInfo: { coursePackageId, packageTreeId, lessonId, classId },
      } = props;
      const { page, limit } = tableState;
      const params = {
        studentUserId: sid,
        leaveClassId: classId,
        coursePackageId,
        packageTreeId,
        lessonIdList: [lessonId],
        ...queryState,
        pageNum: page,
        pageSize: limit,
      };
      tableState.loading = true;
      root.$Api.groupManagement
        .getTransferInClasses(params)
        .then(({ status, data: { data, code } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          tableState.data = data.list;
          tableState.total = data.total;
          tableState.loading = false;
        })
        .catch(() => {
          tableState.data = [];
          tableState.total = 0;
          tableState.loading = false;
        });
    };

    const handletranslateClass = async (row) => {
      enterClassId.value = row.classId;
      const {
        refferInfo: { sid },
      } = props;
      const { coursePackageId, packageTreeId, lessonId } = props.classInfo;
      const params = {
        coursePackageId,
        packageTreeId,
        lessonId,
      };
      const {
        status,
        data: { code },
      } = await translateClassAfterCheck(
        sid,
        props.classInfo.classId,
        row.classId,
        params
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      flagState.showTranslateClassConfirm = true;
    };

    const jumpTeacherDetail = (row) => {
      root.$router.push(
        `/tutorManagement/teacherInfo?id=${row.tutorUserId}&teacherName=${row.tutorRealName}`
      );
    };

    const handleConfirm = async () => {
      emit("translateSuccess");
      flagState.showTranslateClassConfirm = false;
      // getTableData()
    };

    onMounted(() => {
      tableState.loading = true;
    });

    return {
      currentLang,
      ...toRefs(flagState),
      ...toRefs(tableState),
      queryState,
      enterClassId,

      handlePageChange,
      getTableData,
      handletranslateClass,
      handleConfirm,
    };
  },
});
</script>
<style lang="scss" scoped>
.translate-class-wrap {
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    margin: 10px 0;
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30vh;
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
