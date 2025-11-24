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
      <FilterByEditionInPackage
        @changeSelect="
          (val) => {
            queryState.packageTreeId = val;
            // handlePackageTreeChange();
            queryState.lessonIdList = [];
          }
        "
        :coursePackageId="coursePackageId"
      />
      <FilterByLevelInPackage
        @changeSelect="
          (val) => {
            levelId = val;
          }
        "
        :coursePackageId="coursePackageId"
        :packageTreeId="queryState.packageTreeId"
        @changeUnitOptions="
          (val) => {
            unitList = val;
          }
        "
      />
      <FilterByUnitInPackage
        @changeSelect="
          (val) => {
            unitId = val;
          }
        "
        :levelId="levelId"
        :unitList="unitList"
        @changeLessonOptions="
          (val) => {
            lessonOptionsList = val;
          }
        "
      />
      <FilterByLessonInPackage
        @changeSelect="
          (val) => {
            queryState.lessonIdList = val;
          }
        "
        :unitId="unitId"
        :lessonOptionsList="lessonOptionsList"
        :limit="10"
      />
      <!-- <el-cascader
        class="w200"
        v-model="queryState.courseHierarchyIds"
        :options="courseHierarchyList"
        :props="{ value: 'id', label: 'name' }"
        :placeholder="$t('级别、单元、lesson')"
      >
        <template slot-scope="{ data }">
          <span>{{ data.name }}</span>
        </template>
      </el-cascader> -->
      <!--  -->
      <el-button
        :disabled="!isFullParam"
        type="primary"
        @click="handlePageChange({ page: 1 })"
        >{{ $t("查询") }}</el-button
      >
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
      :autoScroll="false"
      @pagination="handlePageChange"
    />
    <TranslateClassConfirm
      v-if="showTranslateClassConfirm"
      :visible.sync="showTranslateClassConfirm"
      @confirmCb="handleConfirm"
      :refferInfo="refferInfo"
      :enterClassId="enterClassId"
      :leaveClassInfo="classInfo"
      :packageTreeId="choosePackageTreeId"
      :lessonId="chooseLessonId"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  toRaw,
  toRefs,
  watch,
} from "@vue/composition-api";
import { NOT_SAME_PROGRESS } from "@/utils/constants";
import BasicTable from "@/components/table/basic-table";
import filters from "@/utils/filters";
import moment from "moment";
import TranslateClassConfirm from "./translateClassConfirm.vue";
import FilterByEditionInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByEditionInPackage";
import FilterByLevelInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLevelInPackage";
import FilterByUnitInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByUnitInPackage";
import FilterByLessonInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLessonInPackage";

import { translateClassAfterCheck } from "@/api/groupManagement";

export default defineComponent({
  components: {
    BasicTable,
    TranslateClassConfirm,
    FilterByEditionInPackage,
    FilterByLevelInPackage,
    FilterByUnitInPackage,
    FilterByLessonInPackage,
  },
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
    const enterClassId = ref(null);
    const queryState = reactive({
      team: "",
      className: "",
      languageLabel: "",
      ageLabel: "",
      week: "",
      time: "",
      packageTreeId: "",
      lessonId: "",
      tutorRealName: "",
      courseHierarchyIds: [],
      lessonIdList: [],
    });

    const flagState = reactive({
      showTranslateClassConfirm: false,
      isFullParam: false,
    });

    const handleConfirm = async () => {
      flagState.showTranslateClassConfirm = false;
      emit("translateSuccess");
    };

    watch(
      queryState,
      (state) => {
        const { packageTreeId } = state;
        flagState.isFullParam =
          packageTreeId && queryState.lessonIdList?.length;
      },
      { deep: true }
    );

    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
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
            render: (h, { row }) =>
              filters.normalWeekListMap(
                row.weekList,
                currentLang.value === "en"
              ),
          },
          {
            width: "180",
            label: root.$t("已选择进度"),
            render: (h, { row }) =>
              currentLang.value === "en"
                ? row.chooseLessonDescEN
                : row.chooseLessonDescZH,
          },
          {
            width: "130",
            label: root.$t("该进度课程时间"),
            render: (h, { row }) =>
              moment(row.startTime).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            width: "100",
            label: root.$t("距离该节课节数"),
            prop: "lessonNum",
          },
          {
            width: "130",
            label: root.$t("班级老师"),
            prop: "tutorRealName",
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
              <el-button
                type="text"
                loading={row.loading}
                onClick={() => handletranslateClass(row)}
              >
                {root.$t("转班")}
              </el-button>
            ),
          },
        ];
      }),
    });
    const chooseLessonId = ref(-1);
    const choosePackageTreeId = ref(-1);
    const handletranslateClass = async (row) => {
      console.log(row);
      chooseLessonId.value = row.chooseLessonId;
      choosePackageTreeId.value = row.choosePackageTreeId;
      enterClassId.value = row.classId;
      const {
        refferInfo: { sid, classId, coursePackageId },
      } = props;
      const params = {
        coursePackageId: coursePackageId,
        packageTreeId: row.choosePackageTreeId,
        lessonId: row.chooseLessonId,
      };
      const {
        status,
        data: { code },
      } = await translateClassAfterCheck(sid, classId, row.classId, params);
      if (status !== 200 || code !== 200) return Promise.reject();
      flagState.showTranslateClassConfirm = true;
    };

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
      tableState.loading = true;
      const {
        refferInfo: { sid },
      } = props;
      const {
        classInfo: { coursePackageId, classId },
      } = props;
      const { page, limit } = tableState;
      const params = {
        studentUserId: sid,
        leaveClassId: classId,
        ...queryState,
        coursePackageId,
        pageNum: page,
        pageSize: limit,
      };
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

    const jumpTeacherDetail = (row) => {
      root.$router.push(
        `/tutorManagement/teacherInfo?id=${row.tutorUserId}&teacherName=${row.tutorRealName}`
      );
    };
    /* 级别,单元,课 */
    const levelId = ref(-1);
    const unitList = ref([]);
    const unitId = ref(-1);
    const lessonOptionsList = ref([]);
    watch(
      () => levelId.value,
      (levelId) => {
        if (levelId === "") {
          queryState.lessonIdList = [];
          return;
        }
        reqLessonIdsByLevel(levelId);
      }
    );
    const reqLessonIdsByLevel = async (levelId) => {
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.groupManagement.getLessonIdsByLevel({
          packageId: props.refferInfo.coursePackageId,
          packageTreeId: queryState.packageTreeId,
          levelId: levelId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        queryState.lessonIdList = data?.lessonIdList || [];
      } catch (err) {
        console.log(err);
      }
    };

    return {
      levelId,
      unitList,
      unitId,
      lessonOptionsList,
      currentLang,
      ...toRefs(flagState),
      ...toRefs(tableState),
      NOT_SAME_PROGRESS,
      queryState,
      enterClassId,
      coursePackageId: props.refferInfo.coursePackageId,
      chooseLessonId,
      choosePackageTreeId,
      handlePageChange,
      getTableData,
      handletranslateClass,
      handleConfirm,
      jumpTeacherDetail,
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
