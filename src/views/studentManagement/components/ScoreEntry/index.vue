<template>
  <!-- 学员成绩 -->
  <div class="sty-score-log-warp">
    <el-card :style="tableState.total > 0 ? 'height: 420px' : 'height: 180px'">
      <div class="common-title">
        {{ $t("成绩档案") }}
        <i
          title="Follow"
          v-if="
            Per.handleButtonPer(
              'teach.studentMT.studentInfo.sisfStudentFiles.updateScoreRecords'
            )
          "
          @click="
            () => {
              operationType = 'create';
              currentRowData = {};
              showDrawer = true;
            }
          "
          class="el-icon-edit-outline"
        ></i>
      </div>
      <div v-loading="loading">
        <BasicTable
          :autoScroll="false"
          border="true"
          height="300px"
          v-if="tableState.total > 0"
          v-loading="tableState.loading"
          header-cell-class-name="my-theme-color-header"
          :data="tableState.data"
          :column="tableState.columns"
          :pagination="true"
          :page="tableState.page"
          :total="tableState.total"
          :limit="tableState.limit"
          @pagination="handlePaginationChange"
        />
        <div class="no-data" v-else>
          {{ $t("暂无数据") }}
        </div>
      </div>
    </el-card>
    <el-drawer :title="$t('成绩录入')" :visible.sync="showDrawer">
      <div style="width: 600px; height: 100%">
        <ScoreEntryDrawer
          v-if="showDrawer"
          @refresh="
            (showDrawer = false), (tableState.pageNum = '1'), reqScoreList()
          "
          :studentId="studentId"
          :courseType="courseType"
          :parentUserId="parentUserId"
          @close="showDrawer = false"
          :currentRowData="currentRowData"
          :operationType="operationType"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  ref,
  watch,
} from "@vue/composition-api";
import ScoreEntryDrawer from "./ScoreEntryDrawer";
import BasicTable from "@/components/table/basic-table";

export default {
  name: "studentData",
  props: {
    courseType: {
      type: String,
      default: -1, // 0：中文 1：英文
    },
    studentId: {
      type: String,
      default: -1,
    },
    parentUserId: {
      type: Number,
      default: -1,
    },
  },
  components: { ScoreEntryDrawer, BasicTable },
  setup(props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const lang = computed(() => root.$store.getters.currentLang);
    const loading = ref(false);
    const showDrawer = ref(false);
    const operationType = ref("create");
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqScoreList();
    };
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
            fixed: true,
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("考试日期"),
            prop: "examDate",
            width: "100px",
            render: (_, { row }) => {
              return (
                <span>
                  {root.DateTimeUtils.dateClockTime(row.examDate).split(" ")[0]}
                </span>
              );
            },
          },
          {
            label: root.$t("考试类型"),
            prop: "examTypeName",
            minWidth: "220px",
          },
          { label: root.$t("总成绩"), prop: "score", width: "120px" },
          {
            label: root.$t("满分制"),
            prop: "fullMarks",
            width: "160px",
            render: (_, { row }) => {
              return row.fullMarks || "-";
            },
          },
          {
            label: root.$t("图片"),
            prop: "scoreImageUrls",
            minWidth: "180px",
            render: (_, { row }) => {
              return row.scoreImageUrls && row.scoreImageUrls.length ? (
                <span>
                  {row.scoreImageUrls.map((item, index) => (
                    <el-image
                      style="width: 100px; height: 100px"
                      src={item}
                      preview-src-list={row.scoreImageUrls}
                    ></el-image>
                  ))}
                </span>
              ) : (
                "-"
              );
            },
          },
          {
            label: root.$t("其他说明"),
            prop: "remarks",
            width: "180px",
            render: (_, { row }) => {
              return row.remarks || "-";
            },
          },
          {
            label: root.$t("最近操作时间"),
            prop: "updatedAt",
            width: "160px",
            render: (_, { row }) => {
              return (
                <span>{root.DateTimeUtils.dateClockTime(row.updatedAt)}</span>
              );
            },
          },
          { label: root.$t("最近操作人"), prop: "updaterName", width: "80px" },
          {
            label: root.$t("操作"),
            prop: "updaterName",
            width: "120px",
            fixed: "right",
            render: (h, { row }) => (
              <div>
                <el-button
                  onClick={() => handelEdit(row)}
                  class="ml10"
                  type="text"
                  disabled={
                    !root.Per.handleButtonPer(
                      "teach.studentMT.studentInfo.sisfStudentFiles.updateScoreRecords"
                    )
                  }
                >
                  {root.$t("编辑")}
                </el-button>
                <el-button
                  onClick={() => handelDelete(row)}
                  class="ml10"
                  type="text"
                  disabled={
                    !root.Per.handleButtonPer(
                      "teach.studentMT.studentInfo.sisfStudentFiles.deleteScoreRecords"
                    )
                  }
                >
                  {root.$t("删除")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });
    const params = reactive({
      studentId: props.studentId,
      subjectTypeId: props.courseType,
      lang: "",
    });
    const reqScoreList = async () => {
      loading.value = true;
      try {
        const res = await root.$Api.studentManagement.reqScoreRecordslist({
          studentId: props.studentId,
          subjectTypeId: props.courseType,
          lang: lang.value,
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
        tableState.total = res.total;
        if (res.list && res.list.length) {
          res.list.forEach((e) => {
            if (e.scoreImageUrls && e.scoreImageUrls !== "[]") {
              e.scoreImageUrls = JSON.parse(e.scoreImageUrls);
            } else {
              e.scoreImageUrls = [];
            }
          });
        }
        tableState.data = res.list || [];
      } finally {
        loading.value = false;
      }
    };
    const handleCurrentChange = (val) => {
      tableState.pageNum = val;
      reqScoreList();
    };
    const handleSizeChange = (val) => {
      tableState.pageSize = val;
      reqScoreList();
    };
    watch(
      () => props.courseType,
      () => {
        tableState.page = 1;
        reqScoreList();
      }
    );
    watch(
      () => isEn.value,
      () => {
        reqScoreList();
      }
    );
    const currentRowData = ref(null);
    const drawer = ref(false);
    const handelEdit = (row) => {
      operationType.value = "edit";
      currentRowData.value = row;
      showDrawer.value = true;
    };
    const handelDelete = async (row) => {
      await root.$confirm(
        root.$t("删除后无法恢复，是否确认操作"),
        root.$t("提示"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        }
      );
      await root.$Api.studentManagement.reqDeleScoreRecord(row.id);
      reqScoreList();
      root.$notify.success(root.$t("操作成功"));
    };

    onMounted(() => {
      {
        reqScoreList();
      }
    });
    return {
      isEn,
      params,
      loading,
      showDrawer,
      reqScoreList,
      tableState,
      handleCurrentChange,
      handleSizeChange,
      currentRowData,
      drawer,
      operationType,
      handlePaginationChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.sty-score-log-warp {
  margin-bottom: 20px;
  font-size: 14px;
  .common-title {
    width: 100%;
    position: relative;
    font-size: 20px;
    height: 40px;
    .el-icon-edit-outline {
      cursor: pointer;
      color: #7580e5;
    }
  }
  .no-data {
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #ccc;
  }
}
</style>
