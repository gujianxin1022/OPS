<template>
  <!-- 我的任务 -->
  <div class="my-task-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList(), reqTaskGroup()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item :label="$t('教管')" :label-width="labelWidth">
        <FilterByTeachManager
          @changeSelect="
            (val) => {
              screenData.tmUserId = val;
              (tableState.page = 1), reqList(), reqTaskGroup();
            }
          "
        />
      </screen-item>
      <screen-item
        v-if="screenData.tmUserId !== ''"
        :label="$t('在岗状态')"
        :label-width="labelWidth"
      >
        <el-select
          v-model="screenData.working"
          :placeholder="$t('请选择')"
          @change="search"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('教师')"
        :label-width="currentLang == 'en' ? 140 : labelWidth"
      >
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
          />
        </span>
      </screen-item>
      <screen-item
        :label="$t('任务状态')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByTaskStatus
          @changeSelect="
            (val) => {
              screenData.statusProcess = val;
              if (val == '1') {
                reqTaskGroup();
              }
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('用户')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByUserKey
          @changeSearchValue="
            (val, delKeyArr) => {
              screenData[val.type] = val.value;
              screenData[delKeyArr[0]] = '';
              screenData[delKeyArr[1]] = '';
              screenData[delKeyArr[2]] = '';
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('任务名称')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
        v-if="screenData.statusProcess > 1"
      >
        <FilterByTaskName
          @change="
            (val) => {
              screenData.taskTypes = val;
              (tableState.page = 1), reqList(), reqTaskGroup();
            }
          "
        />
      </screen-item>
    </screen-wrapper>
    <screen-item
      v-if="screenData.statusProcess <= 1"
      :label="$t('快捷筛选')"
      :label-width="currentLang == 'en' ? 120 : 155"
    >
      <div class="quick-filter">
        <div v-loading="taskGroupLoading">
          <el-checkbox-group
            style="width: 100%"
            @change="handelSelect"
            v-model="checkboxGroup"
          >
            <el-checkbox
              border
              v-for="taskType in taskGroupList"
              :label="`${taskType.typeId}_${taskType.typeSource}`"
              :key="taskType.typeId"
              >{{ isEn ? taskType.typeNameEn : taskType.typeNameCn }}
              {{ taskType.taskCount }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
    </screen-item>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button
          :loading="exportLoading"
          @click="handelExportExcel"
          type="primary"
        >
          {{ $t("导出") }}
        </el-button>
      </div>
      <BasicTable
        header-cell-class-name="my-theme-color-header"
        border
        v-loading="tableState.loading"
        :data="tableState.data"
        :column="tableState.columns"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        :pagination="true"
        @pagination="handlePaginationChange"
      />
    </custom-card>
    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose"
      :wrapperClosable="true"
    >
      <TaskInfoPage
        @refresh="reqList(), reqTaskGroup()"
        @closeDrawer="drawer = false"
        :rowData="currentTaskRow"
      />
    </el-drawer>
    <el-dialog
      v-if="taskResultState.showTaskResult"
      :visible.sync="taskResultState.showTaskResult"
      width="720px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :title="$t(taskResultState.taskName)"
      top="10vh"
    >
      <CompletedTaskResult
        v-if="taskResultState.showTaskResult"
        :data="taskResultState.data"
        :visible.sync="taskResultState.showTaskResult"
        :taskName="taskResultState.taskName"
      />
    </el-dialog>
  </div>
</template>
<script>
import CommonTree from "@/views/reportManagement/commonTree/index.vue";
import FilterByTaskStatus from "@/components/FilterItem/TaskFilter/FilterByTaskStatus";
import FilterByUserKey from "@/components/FilterItem/CommodityFilter/FilterByUserKey";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";

import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import TaskInfoPage from "./components/taskInfo/TeacherTaskInfoPage.vue";
import CompletedTaskResult from "./components/CompletedTaskResult.vue";
import moment from "moment";
import FilterByTaskName from "@/components/FilterItem/TaskFilter/FilterByTaskName";
import { parentIdValidate, studentIdValidate } from "@/utils/reg.js";

export default {
  components: {
    CommonTree,
    FilterByTaskStatus,
    FilterByUserKey,
    BasicTable,
    TaskInfoPage,
    CompletedTaskResult,
    // AssignStudents,
    FilterByTaskName,
    FilterByUserAccount,
    FilterByTeachManager,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const userParams = ref({});
    const screenData = reactive({
      sort: "asc",
      orderByColum: "timeToWarn",
      studentName: "",
      studentUserId: "",
      parentUserName: "",
      parentUserId: "",
      statusProcess: "1",
      taskTypes: null,
      working: "",
      tmUserId: "",
    });
    const statusList = [
      { label: "全部", value: "" },
      ...root.Constants.workingForTeacherList,
    ];
    const changeSort = (val) => {
      switch (val) {
        case "1":
          screenData.orderByColum = "timeToWarn";
          screenData.sort = "asc";
          break;
        case "2":
          screenData.orderByColum = "timeProcessed";
          screenData.sort = "desc";
          break;
        case "3":
          screenData.orderByColum = "timeToComplete";
          screenData.sort = "desc";
          break;
        case "4":
          screenData.orderByColum = "createTime";
          screenData.sort = "desc";
          break;
      }
      reqList();
    };
    const tableState = reactive({
      loading: false,
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            label: root.$t("序号"),
            fixed: "left",
            render: (h, { $index }) =>
              (tableState.page - 1) * tableState.limit + $index + 1,
          },
          {
            label: root.$t("任务名称"),
            minWidth: "250",
            fixed: "left",
            render: (_, { row }) => {
              return (
                <el-button
                  type="text"
                  onClick={() => {
                    showDrawer(row);
                  }}
                >
                  {row.taskName}
                </el-button>
              );
            },
          },
          {
            label: root.$t("学生姓名"),
            prop: "studentName",
            minWidth: 150,
            render: (h, { row }) => (
              <el-button type="text">
                <router-link
                  to={{
                    name: `studentInfo`,
                    query: {
                      studentId: row.studentUserId,
                      studentName: row.studentName,
                    },
                  }}
                >
                  {row.studentName}
                </router-link>
              </el-button>
            ),
          },
          {
            label: root.$t("学生id"),
            minWidth: 150,
            render: (h, { row }) => (
              <span type="text">{row.studentUserId || "-"}</span>
            ),
          },
          {
            label: root.$t("家长ID"),
            prop: "parentUserId",
            minWidth: 150,
            render: (h, { row }) => (
              <el-button type="text">
                <router-link
                  to={{
                    name: `parentInfo`,
                    query: { parentUserId: row.parentUserId },
                  }}
                >
                  {row.parentUserId}
                </router-link>
              </el-button>
            ),
          },
          {
            label: root.$t("任务归属人"),
            width: "150",
            prop: "assignee",
            render: (_, { row }) => {
              return (
                <el-button type="text">
                  <router-link
                    to={{
                      name: `teacherInfo`,
                      query: {
                        id: row.assignee?.id,
                        teacherName: row.assignee?.realName,
                      },
                    }}
                  >
                    {row.assignee?.realName}
                  </router-link>
                </el-button>
              );
            },
          },
          {
            label: root.$t("教师ID"),
            minWidth: 150,
            render: (h, { row }) => (
              <span type="text">{row.assignee.id || "-"}</span>
            ),
          },
          {
            label: root.$t("教师姓名"),
            minWidth: 150,
            render: (h, { row }) => (
              <span type="text">{row.assignee.identityName || "-"}</span>
            ),
          },
          {
            label: root.$t("教管"),
            width: "152",
            prop: "assignee",
            render: (_, { row }) => {
              return <span>{row.assignee.tmUserName || "-"}</span>;
            },
          },
          {
            label: root.$t("在岗状态"),
            width: "150",
            prop: "assignee",
            render: (_, { row }) => {
              return (
                <span>
                  {root.$t(root.Filters.getWorkingTxt(row.assignee.working))}
                </span>
              );
            },
          },
          {
            label: root.$t("完成方式"),
            width: "150",
            prop: "contactInformation",
            render: (_, { row }) => {
              return (
                <span class={"text-wrap"}>
                  {row?.contactInformationStr || "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("任务状态"),
            width: isEn.value ? "200" : "150",
            prop: "tagStatus",
            render: (_, { row }) => {
              return row?.statusProcess === 2 ? (
                <span class={"text-wrap"}>
                  {root.$t(columnMap.taskStatus[row?.statusProcess])}
                  {root.$t(columnMap.tagStatus[row?.tagStatus])}
                  {/* <el-button onClick={() => handelView(row)} type="text">
                    {root.$t("查看")}
                  </el-button> */}
                </span>
              ) : (
                <span class={"text-wrap"}>
                  {root.$t(columnMap.taskStatus[row?.statusProcess])}
                  {root.$t(columnMap.tagStatus[row?.tagStatus])}
                </span>
              );
            },
          },
          {
            prop: "createTime",
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
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("创建时间")}
                  <span
                    onClick={() => handelSort("createTime")}
                    class="caret-wrapper"
                  >
                    <i
                      class={
                        screenData.sort === "asc" &&
                        screenData.orderByColum === "createTime"
                          ? "el-icon-caret-top active"
                          : "el-icon-caret-top"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "desc" &&
                        screenData.orderByColum === "createTime"
                          ? "el-icon-caret-bottom active"
                          : "el-icon-caret-bottom"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
          {
            prop: "timeToWarn",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.timeToWarn && row.taskTypeId != 2
                    ? root.DateTimeUtils.dateClockTime(row.timeToWarn)
                    : "-"}
                  <div
                    class="text-wrap"
                    style={
                      calcTimeout(row.timeToWarn, row, true).includes("剩余") ||
                      calcTimeout(row.timeToWarn, row, true).includes("left")
                        ? `color:#f19536`
                        : `color:#f56c6c`
                    }
                  >
                    {row.timeToWarn &&
                    row.taskTypeId != 2 &&
                    row.statusProcess === 1
                      ? calcTimeout(row.timeToWarn, row, true)
                      : ""}
                  </div>
                </span>
              );
            },
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("超时时间")}
                  <span
                    onClick={() => handelSort("timeToWarn")}
                    class="caret-wrapper"
                  >
                    <i
                      class={
                        screenData.sort === "asc" &&
                        screenData.orderByColum === "timeToWarn"
                          ? "el-icon-caret-top active"
                          : "el-icon-caret-top"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "desc" &&
                        screenData.orderByColum === "timeToWarn"
                          ? "el-icon-caret-bottom active"
                          : "el-icon-caret-bottom"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
          {
            label: root.$t("失效时间"),
            prop: "timeToComplete",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.timeToComplete && row.taskTypeId != 2
                    ? root.DateTimeUtils.dateClockTime(row.timeToComplete)
                    : "-"}
                  <div
                    class="text-wrap"
                    style={
                      calcTimeout(row.timeToComplete, row, true).includes(
                        "剩余"
                      ) ||
                      calcTimeout(row.timeToComplete, row, true).includes(
                        "left"
                      )
                        ? `color:#f19536`
                        : `color:#f56c6c`
                    }
                  >
                    {row.timeToComplete &&
                    row.taskTypeId != 2 &&
                    row.statusProcess === 1
                      ? calcTimeout(row.timeToComplete, row, false)
                      : ""}
                  </div>
                </span>
              );
            },
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("失效时间")}
                  <span
                    onClick={() => handelSort("timeToComplete")}
                    class="caret-wrapper"
                  >
                    <i
                      class={
                        screenData.sort === "asc" &&
                        screenData.orderByColum === "timeToComplete"
                          ? "el-icon-caret-top active"
                          : "el-icon-caret-top"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "desc" &&
                        screenData.orderByColum === "timeToComplete"
                          ? "el-icon-caret-bottom active"
                          : "el-icon-caret-bottom"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
          {
            prop: "timeProcessed",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.timeProcessed
                    ? root.DateTimeUtils.dateClockTime(row.timeProcessed)
                    : "-"}
                </span>
              );
            },
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("完成时间")}
                  <span
                    onClick={() => handelSort("timeProcessed")}
                    class="caret-wrapper"
                  >
                    <i
                      class={
                        screenData.sort === "asc" &&
                        screenData.orderByColum === "timeProcessed"
                          ? "el-icon-caret-top active"
                          : "el-icon-caret-top"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "desc" &&
                        screenData.orderByColum === "timeProcessed"
                          ? "el-icon-caret-bottom active"
                          : "el-icon-caret-bottom"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
        ];
      }),
    });
    const reqList = async () => {
      if (
        screenData &&
        screenData.parentUserId &&
        !parentIdValidate(root, screenData.parentUserId)
      ) {
        return;
      }
      if (
        screenData &&
        screenData.studentUserId &&
        !studentIdValidate(root, screenData.studentUserId)
      ) {
        return;
      }
      tableState.loading = true;
      const { page, limit } = tableState;
      screenData.pageNum = page;
      screenData.pageSize = limit;
      try {
        const params = {
          ...screenData,
          ...userParams.value
        };
        const res = await root.$Api.taskManagement.reqTeacherTaskList(
          params
        );
        res.list.forEach((e) => {
          let contactInformationArr = [];
          e.contactInformation &&
            e.contactInformation.split(",").forEach((c) => {
              contactInformationArr.push(
                root.$t(columnMap.completionStatus[c])
              );
            });
          e.contactInformationStr = contactInformationArr.join("/");
        });
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const taskGroupList = ref([]);
    const checkboxGroup = ref([]);
    const taskGroupLoading = ref(false);
    const reqTaskGroup = async () => {
      if (screenData.statusProcess !== "1") return;
      if (
        screenData &&
        screenData.parentUserId &&
        !parentIdValidate(root, screenData.parentUserId)
      ) {
        return;
      }
      if (
        screenData &&
        screenData.studentUserId &&
        !studentIdValidate(root, screenData.studentUserId)
      ) {
        return;
      }
      const { page, limit } = tableState;
      screenData.pageNum = page;
      screenData.pageSize = limit;
      taskGroupLoading.value = true;
      try {
        const params = {
          ...screenData,
          ...userParams.value
        };
        const res = await root.$Api.taskManagement.reqTeacherTaskTypeGroup(
          params
        );
        taskGroupList.value = res;
      } finally {
        taskGroupLoading.value = false;
      }
    };
    const handelSelect = (list) => {
      let taskTypes = [];
      list.forEach((e) => {
        taskTypes.push({
          typeId: e.split("_")[0],
          typeSource: e.split("_")[1],
        });
      });
      screenData.taskTypes = taskTypes;
      tableState.page = 1;
      reqList();
    };
    watch(
      () => screenData.statusProcess,
      (newVal, oldVal) => {
        if (newVal === "1" || oldVal === "1") {
          screenData.taskTypes = null;
          checkboxGroup.value = [];
        }
        tableState.page = 1;
        changeSort(newVal);
      }
    );
    const handelSort = (colum) => {
      screenData.orderByColum = colum;
      if (screenData.sort === "asc") {
        screenData.sort = "desc";
      } else {
        screenData.sort = "asc";
      }
      reqList();
    };
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    const drawer = ref(false);
    const currentTaskRow = ref({});
    const showDrawer = (row) => {
      currentTaskRow.value = row;
      if (row.statusProcess === 2 /* 已完成 */) {
        handelView(row);
        return;
      }
      if (row.statusProcess !== 1 /* 不是未完成状态 */) return;
      drawer.value = true;
    };

    const columnMap = reactive({
      taskStatus: {
        1: "未完成",
        2: "已完成",
        3: "已失效",
        4: "已作废",
      },
      tagStatus: {
        1: "(未超时)",
        2: "(已超时)",
        3: "(按时完成)",
        4: "(超时完成)",
        5: "(失效)",
      },
      completionStatus: {
        1: "打电话",
        2: "发消息",
        3: "发邮件",
      },
    });
    const taskResultState = reactive({
      data: null,
      taskName: "",
      showTaskResult: false,
    });
    const handelView = async (row) => {
      taskResultState.taskName = row.taskName;
      const res = await root.$Api.taskManagement.reqCompletedTaskResult({
        taskId: row.id,
      });
      taskResultState.data = res;
      taskResultState.showTaskResult = true;
    };
    /* 分配学生 */
    const calcTimeout = (timeToComplete, task, showTimeOut) => {
      const currentDate = moment().utc().format();
      const completeTime = timeToComplete;
      const isDelay =
        moment(currentDate).diff(moment(completeTime), "minutes") > 0;
      task.isDelay = isDelay;
      const days = Math.abs(
        moment(currentDate).diff(moment(completeTime), "days")
      );
      const hours = Math.abs(
        moment(currentDate).diff(moment(completeTime), "hours") % 24
      );
      const minutes = Math.abs(
        moment(currentDate).diff(moment(completeTime), "minutes") % 60
      );
      if (isDelay) {
        if (showTimeOut) {
          return days > 0
            ? root
                .$t("已超时$D天$H时$M分")
                .replace(`$D`, days)
                .replace(`$H`, hours)
                .replace(`$M`, minutes)
            : root
                .$t("已超时$H时$M分")
                .replace(`$H`, hours)
                .replace(`$M`, minutes);
        } else {
          return "";
        }
      }
      return days > 0
        ? root
            .$t("剩余$D天$H时$M分")
            .replace(`$D`, days)
            .replace(`$H`, hours)
            .replace(`$M`, minutes)
        : root.$t("剩余$H时$M分").replace(`$H`, hours).replace(`$M`, minutes);
    };
    const exportLoading = ref(false);

    const handelExportExcel = async () => {
      const {
        statusProcess,
        studentUserId,
        studentName,
        parentUserId,
        parentUserName,
        taskTypes,
        orderByColum,
        sort,
        working,
        tmUserId,
      } = screenData;
      if (!taskTypes || taskTypes.length !== 1) {
        root.$notify({
          message: root.$t("请选择一个任务类型"),
          type: "warning",
        });
        return;
      }
      try {
        exportLoading.value = true;
        await root.$Api.taskManagement.reqDownloadTeacherTaskDate({
          statusProcess,
          studentUserId,
          studentName,
          parentUserId,
          parentUserName,
          taskTypes: taskTypes,
          orderByColum,
          sort,
          working,
          tmUserId,
          ...userParams.value,
        });
        root.$notify({
          message: root.$t("数据将发送至您的邮箱，请及时查收"),
          type: "success",
        });
      } finally {
        exportLoading.value = false;
      }
    };

    onMounted(() => {
      reqList();
      reqTaskGroup();
    });
    return {
      isEn,
      userParams,
      screenData,
      tableState,
      columnMap,
      drawer,
      currentTaskRow,
      taskResultState,
      taskGroupList,
      checkboxGroup,
      taskGroupLoading,
      exportLoading,
      reqList,
      handlePaginationChange,
      handelView,
      changeSort,
      reqTaskGroup,
      handelSelect,
      handelExportExcel,
      tableHeight: window.innerHeight - 430,
      labelWidth: 140,
      statusList,
    };
  },
};
</script>
<style lang="scss" scoped>
.my-task-warp {
  padding: 10px;
  font-family: PingFangSC-Semibold, PingFang SC;
}
</style>
<style lang="scss">
.quick-filter {
  .el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner {
    display: none;
  }
  .el-checkbox__label {
    padding-left: 0px;
  }
  .is-bordered {
    color: #7e8ae7;
    border-color: #7e8ae7;
    padding: 5px 10px !important;
    border-radius: 4px;
  }
  .is-checked {
    background: #f1f2fb;
  }
  .el-checkbox {
    margin-left: 0 !important;
    margin-right: 10px !important;
  }
}
.my-task-warp {
  .caret-wrapper {
    padding-top: 4px;
    cursor: pointer;
    .el-icon-caret-top,
    .el-icon-caret-bottom {
      font-size: 14px;
      cursor: pointer;
      color: #c0c4cc;
      width: 14px;
      height: 10px;
    }
    .el-icon-caret-bottom {
      margin-top: -2px;
    }
    .active {
      color: #fff;
    }
  }
}
</style>
