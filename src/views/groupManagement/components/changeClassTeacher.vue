<template>
  <div>
    <el-dialog
      width="1200px"
      custom-class="change-class-teacher"
      :title="$t('匹配老师')"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <section>
        <el-input
          v-model="queryState.tutorName"
          :placeholder="$t('请输入老师姓名')"
        />
        <el-select
          clearable
          v-model="queryState.hideStatus"
          :placeholder="$t('开放状态')"
        >
          <el-option
            v-for="item of Constants.openForTeacherList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="queryState.fullWork" :placeholder="$t('是否全职')">
          <el-option :label="$t('非全职')" value="0" />
          <el-option :label="$t('全职')" value="1" />
        </el-select>
        <el-select
          collapse-tags
          multiple
          filterable
          allow-create
          default-first-option
          v-model="queryState.languageList"
          :placeholder="$t('请选择语言标签')"
        >
          <el-option
            v-for="item of queryState.languageTagsList"
            :key="item.id"
            :label="item.typeKey"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <FilterByTeachingStyleNew
          ref="FilterByTeachingStyle"
          @changeStyleSelect="
            (styleIds) => {
              queryState.teachingStyle = styleIds;
            }
          "
          :placeholder="$t('教学风格')"
          :subjectType="subjectType"
        />
        <!-- <el-select
          collapse-tags
          multiple
          filterable
          allow-create
          default-first-option
          v-model="queryState.teachingStyle"
          :placeholder="$t('教学风格')"
        >
          <el-option
            v-for="item of queryState.teachStyleList"
            :key="item.id"
            :label="item.typeKey"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
        <el-button type="primary" @click="handlePaginationChange({ page: 1 })">
          {{ $t("搜索") }}
        </el-button>
      </section>
      <BasicTable
        height="60vh"
        v-loading="tableState.loading"
        :column="tableState.columns"
        :data="tableState.data"
        :page="paginationState.page"
        :total="paginationState.total"
        :limit="paginationState.limit"
        :pagination="true"
        @pagination="handlePaginationChange"
      />
    </el-dialog>
    <TeacherCard
      :showTeacherCard="teacherCardState.visible"
      @closeTeacherCardDialog="teacherCardState.visible = false"
      :tutorId="teacherCardState.tutorId"
      :realName="teacherCardState.realName"
    />
    <el-dialog
      width="1100px"
      append-to-body
      :title="$t('老师课表')"
      :visible.sync="teacherTimeTabelState.visible"
      :close-on-click-modal="false"
      @close="teacherTimeTabelState.visible = false"
    >
      <TeacherTimeTabel
        :teacherName="teacherTimeTabelState.teacherName"
        :teacherId="teacherTimeTabelState.teacherId"
        :startTimes="teacherTimeTabelState.startTimes"
        :isFromSmallClass="true"
        :showTeacherTimetable="teacherTimeTabelState.visible"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  watch,
  set,
  toRefs,
} from "@vue/composition-api";
import { getExamineDic } from "@/api/tutorManagement";
import {
  queryMatchTeacherList,
  updateClassTeacher,
} from "@/api/groupManagement";

import filters from "@/utils/filters";
import TeacherCard from "./teacherCard";
import BasicTable from "@/components/table/basic-table";
import TeacherTimeTabel from "@/views/tutorManagement/teacherInfoSub/TeacherTimetable";
import FilterByTeachingStyleNew from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyleNew";

export default {
  components: {
    BasicTable,
    TeacherCard,
    TeacherTimeTabel,
    FilterByTeachingStyleNew,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    classId: {
      type: Number,
      default: null,
    },
    subjectType: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const { queryState } = useQuery();

    const tableState = reactive({
      data: [],
      loading: false,
      columns: computed(() => {
        return [
          {
            fixed: true,
            width: "150",
            label: root.$t("教师ID"),
            render: (h, { row, $index }) => (
              <span
                type="text"
                style="color: #7580E5"
                onClick={() => handleClickTeacherName(row)}
              >
                {row.tutorUserId}
              </span>
            ),
          },
          {
            fixed: true,
            width: "150",
            label: root.$t("老师姓名"),
            prop: "identityName",
          },
          { width: "150", label: root.$t("老师昵称"), prop: "realName" },
          {
            width: "180",
            label: root.$t("是否全职"),
            render: (h, { row: { fullWork } }) =>
              fullWork == 0
                ? root.$t("否")
                : fullWork == 1
                ? root.$t("是")
                : "",
          },
          { width: "100", label: root.$t("1v1学生"), prop: "studentCount" },
          { width: "100", label: root.$t("小班班级"), prop: "smallClassCount" },
          { width: "130", label: root.$t("教师电话"), prop: "phone" },
          {
            width: "140",
            label: root.$t("开放状态"),
            render: (h, { row }) => filters.getOpenTxt(row.hide),
          },
          {
            width: "180",
            label: root.$t("语言标签"),
            render: (h, { row: { languages } }) => languages,
          },
          {
            width: "180",
            label: root.$t("教学风格"),
            render: (h, { row: { teachStyles } }) => teachStyles,
          },
          {
            width: "150",
            fixed: "right",
            label: root.$t("操作"),
            render: (h, { row }) => (
              <div>
                <el-button
                  type="text"
                  loading={row.loading}
                  onClick={() => handleArrangeTeachers(row)}
                >
                  {root.$t("安排老师")}
                </el-button>
                <el-button type="text" onClick={() => handleOpenTimetable(row)}>
                  {root.$t("课表")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });

    const paginationState = reactive({ page: 1, limit: 50, total: 0 });

    const teacherTimeTabelState = reactive({
      visible: false,
      teacherName: null,
      teacherId: null,
      startTimes: new Date(),
    });

    const queryTableData = async () => {
      const { fullWork, hideStatus, tutorName, languageList, teachingStyle } =
        queryState;
      const { page, limit } = paginationState;
      try {
        tableState.loading = true;
        const {
          status,
          data: { code, data },
        } = await queryMatchTeacherList(page, limit, {
          classId: props.classId,
          fullWork,
          hideStatus,
          tutorName: tutorName || null,
          languageList: languageList?.length ? languageList.toString() : null,
          teachingStyle: teachingStyle?.length
            ? teachingStyle.toString()
            : null,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        data.list.forEach((e) => {
          if (e.teachStyleList) {
            e.teachStyles = e.teachStyleList
              .map((v) => {
                return v.configValue;
              })
              .join(",");
          }
          if (e.languageList) {
            e.languages = e.languageList
              .map((v) => {
                return v.configValue;
              })
              .join(",");
          }
        });
        console.log(data.list);

        tableState.data = data.list ?? [];
        paginationState.total = data.total;
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(paginationState, info);
      queryTableData();
    };

    const teacherCardState = reactive({
      visible: false,
      tutorId: "",
      realName: "",
    });

    const handleClickTeacherName /* 点击教师用户名 */ = (row) => {
      teacherCardState.tutorId = row.tutorUserId;
      teacherCardState.realName = row.realName;
      console.log(teacherCardState);
      teacherCardState.visible = true;
    };

    const handleArrangeTeachers /* 安排老师 */ = async (row) => {
      try {
        set(row, "loading", true);
        const {
          status,
          data: { code },
        } = await updateClassTeacher(props.classId, row.tutorUserId);
        if (status !== 200 || code !== 200) return;
        root.$message.success(root.$t("安排老师成功"));
        handleClose();
        emit("ok");
      } finally {
        set(row, "loading", false);
      }
    };

    const handleOpenTimetable /* 打开课表 */ = ({ tutorUserId, realName }) => {
      Object.assign(teacherTimeTabelState, {
        visible: true,
        teacherName: realName,
        teacherId: tutorUserId,
      });
    };

    const handleClose = () => {
      emit("update:visible", false);
    };

    watch(
      () => props.visible,
      (val) => val && queryTableData()
    );

    return {
      tableState,
      queryState,
      paginationState,
      teacherCardState,
      teacherTimeTabelState,
      handlePaginationChange,
      handleClose,
    };
  },
};

const useQuery = () => {
  const queryState = reactive({
    tutorName: null,
    hideStatus: null,
    fullWork: null,
    languageList: [],
    teachingStyle: [],

    languageTagsList: [],
    teachStyleList: [],
  });

  const queryLanguageTags = async () => {
    const {
      status,
      data: { code, data },
    } = await getExamineDic(5);
    if (status !== 200 || code !== 200) return Promise.reject();
    queryState.languageTagsList = data;
  };

  const queryTeachStyle = async () => {
    const {
      status,
      data: { code, data },
    } = await getExamineDic(4);
    if (status !== 200 || code !== 200) return Promise.reject();
    queryState.teachStyleList = data;
  };

  onMounted(() => {
    queryLanguageTags();
    queryTeachStyle();
  });

  return {
    queryState,
  };
};
</script>

<style lang="scss" scoped>
::v-deep .change-class-teacher {
  margin-top: 0px !important;
  top: 50%;
  transform: translateY(-50%);
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr) 80px;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    margin-bottom: 10px;
  }
}
</style>
