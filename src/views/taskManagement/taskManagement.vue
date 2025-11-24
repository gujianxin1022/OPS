<template>
  <!-- 任务管理 -->
  <div class="task-management-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('任务名称')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <el-input
          clearable
          v-model.trim="screenData.templateName"
          :placeholder="$t('请输入')"
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('适用区域')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByRegion
          @changeSelect="
            (val) => {
              screenData.regionList = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('启/停用')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByEnabledStatus
          @changeSelect="
            (val) => {
              screenData.enable = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('执行类型')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByExecutionType
          @changeSelect="
            (val) => {
              screenData.executionType = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('执行状态')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByExecutionStatus
          @changeSelect="
            (val) => {
              screenData.executionStatus = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('任务执行对象')"
        :part="4"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByLAorCC
          :initVal="screenData.roleType"
          @change="
            (val) => {
              screenData.roleType = val;
            }
          "
        />
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button
          style="width: 120px"
          class="fr"
          type="primary"
          @click="toTaskTemplatePage"
          >{{ $t("新建") }}</el-button
        >
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
  </div>
</template>

<script>
import {
  onMounted,
  watch,
  reactive,
  computed,
  ref,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import EditField from "./components/editField.vue";
import FilterByRegion from "@/components/FilterItem/CommodityFilter/FilterByRegion";
import FilterByExecutionStatus from "@/components/FilterItem/TaskFilter/FilterByExecutionStatus	";
import FilterByEnabledStatus from "@/components/FilterItem/TaskFilter/FilterByEnabledStatus";
import FilterByExecutionType from "@/components/FilterItem/TaskFilter/FilterByExecutionType";
import { withNewTaskTemplate } from "./dataConfig/communicate";
import FilterByLAorCC from "@/components/FilterItem/UserDimensionFilter/FilterByLAorCC";

export default {
  components: {
    BasicTable,
    EditField,
    FilterByRegion,
    FilterByEnabledStatus,
    FilterByExecutionStatus,
    FilterByExecutionType,
    FilterByLAorCC,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = reactive({
      templateName: "",
      regionList: [],
      enable: "",
      executionType: "",
      executionStatus: [],
      sort: "desc",
      roleType: "",
    });
    watch(withNewTaskTemplate, (val) => {
      if (val) {
        tableState.page = 1;
        reqList();
      }
    });

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
            fixed: true,
            render: (h, { $index }) =>
              (tableState.page - 1) * tableState.limit + $index + 1,
          },
          {
            label: root.$t("ID"),
            fixed: true,
            prop: "id",
          },
          {
            label: root.$t("任务名称"),
            minWidth: "250",
            render: (_, { row }) => {
              return isEn.value ? (
                <span>{row.taskNameEn}</span>
              ) : (
                <span>{row.taskNameCn}</span>
              );
            },
          },
          {
            label: root.$t("适用区域"),
            prop: "regionList",
            width: "150",
            render: (_, { row }) => {
              return row.shortRegionList ? (
                <el-tooltip effect="light" placement="top-start">
                  <div style="width:200px" slot="content">
                    {row.regionList}
                  </div>
                  <span>{row.shortRegionList || "-"}</span>;
                </el-tooltip>
              ) : (
                <span>{row.regionList}</span>
              );
            },
          },
          {
            label: root.$t("任务执行对象"),
            width: isEn.value ? "140" : "100",
            render: (_, { row }) => {
              return (
                <span>
                  {row.roleType
                    ? root.$t(columnMap.roleTypeStatus[row.roleType])
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("特殊条件"),
            width: "150",
            prop: "specialConditionList",
            render: (_, { row }) => {
              return row.shortRegionList ? (
                <el-tooltip effect="light" placement="top-start">
                  <div style="width:200px" slot="content">
                    {row.specialConditionList}
                  </div>
                  <span>{row.shortSpecialConditionList || "-"}</span>;
                </el-tooltip>
              ) : (
                <span>{row.specialConditionList || "-"}</span>
              );
            },
          },
          {
            label: root.$t("最近修改时间"),
            width: "150",
            prop: "updateTime",
            render: (_, { row }) => {
              return (
                <span>
                  {row.updateTime
                    ? root.DateTimeUtils.dateClockTime(row.updateTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("最近修改人"),
            width: "150",
            prop: "updateUser",
            render: (_, { row }) => {
              return <span>{row?.updateUser?.username || "-"}</span>;
            },
          },
          {
            label: root.$t("创建时间"),
            prop: "createTime",
            width: "150",
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
                  <span onClick={() => handelSort()} class="caret-wrapper">
                    <i
                      class={
                        screenData.sort === "asc"
                          ? "el-icon-caret-top"
                          : "el-icon-caret-top active"
                      }
                    />
                    <i
                      class={
                        screenData.sort === "desc"
                          ? "el-icon-caret-bottom"
                          : "el-icon-caret-bottom active"
                      }
                    />
                  </span>
                </div>
              );
            },
          },
          {
            label: root.$t("创建人"),
            prop: "createUser",
            width: 120,
            render: (_, { row }) => {
              return <span>{row?.createUser?.username || "-"}</span>;
            },
          },
          {
            label: root.$t("执行类型"),
            prop: "executionType",
            width: isEn.value ? "150" : "80",
            render: (_, { row }) => {
              return (
                <span>
                  {root.$t(columnMap.executionType[row?.executionType])}
                </span>
              );
            },
          },
          {
            label: root.$t("执行状态"),
            prop: "executionStatus",
            render: (_, { row }) => {
              return (
                <span>
                  {root.$t(columnMap.executionStatus[row?.executionStatus])}
                </span>
              );
            },
          },
          {
            label: root.$t("启用"),
            render: (_, { row }) => {
              return (
                <el-switch
                  disabled={row.enable === 1}
                  value={row.enable}
                  onChange={(val) => reqChangeEnable(row, val)}
                  active-value={0}
                  inactive-value={1}
                ></el-switch>
              );
            },
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
                  disabled={row.enable != 0}
                  onClick={() => handleEdit(row)}
                >
                  {root.$t("编辑")}
                </el-button>
                <el-button
                  type="text"
                  loading={row.loading}
                  onClick={() => handleCopy(row)}
                >
                  {root.$t("复制")}
                </el-button>
                <el-button
                  disabled={row.enable == 0 || row.remove == 1}
                  type="text"
                  loading={row.loading}
                  onClick={() => handleInvalid(row)}
                >
                  {row.remove == 1 ? root.$t("已作废") : root.$t("作废")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });

    const reqList = async () => {
      tableState.loading = true;
      const { page, limit } = tableState;
      screenData.pageNum = page;
      screenData.pageSize = limit;
      try {
        const res = await root.$Api.taskManagement.reqTaskTemplateList(
          screenData
        );
        res.list.forEach((e) => {
          e.specialConditionList = e.specialConditionList
            ?.map((e) => {
              return e.templateName;
            })
            .join(",");
          e.regionList = e?.regionList?.join(",") || "-";
          /* 数据太多,部分展示 */
          if (e?.regionList?.length > 50) {
            e.shortRegionList = e.regionList.substr(0, 50) + "...";
          }
          if (e?.specialConditionList?.length > 50) {
            e.shortSpecialConditionList =
              e.specialConditionList.substr(0, 50) + "...";
          }
        });
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
        withNewTaskTemplate.value = false;
      }
    };
    const handelSort = () => {
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
    const toTaskTemplatePage = () => {
      root.$router.push({
        path: `/task/taskTemplate`,
        query: {
          type: "add",
        },
      });
    };

    const handleEdit = (row) => {
      root.$router.push({
        path: `/task/taskTemplate`,
        query: {
          id: row.id,
          type: "edit",
        },
      });
    };
    const handleCopy = (row) => {
      root.$router.push({
        path: `/task/taskTemplate`,
        query: {
          id: row.id,
          type: "copy",
        },
      });
    };
    const handleInvalid = async (row) => {
      await root.$confirm(
        root.$t(
          "任务模板作废后，该任务模板下的“未完成”的任务节点变更为“已作废”状态，无需再完成,是否确认作废?"
        ),
        root.$t("提示"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        }
      );
      await root.$Api.taskManagement.reqDeleteTaskTemplate(row.id);
      root.$message.success(root.$t("操作成功"));
      reqList();
    };
    const columnMap = reactive({
      executionType: {
        1: "长期执行",
        2: "一次执行",
      },
      executionStatus: {
        0: "待执行",
        1: "执行中",
        2: "已执行",
        3: "已取消",
      },
      roleTypeStatus: {
        1: "学管",
        2: "销售",
        3: "教师",
      },
    });
    const reqChangeEnable = async (row, val) => {
      await root.$confirm(
        root.$t("任务模板停用后无法再次启用，是否确认停用"),
        root.$t("提示"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        }
      );
      const params = {
        enable: val,
        templateId: row.id,
      };
      await root.$Api.taskManagement.reqTaskTemplateEnable(params);
      root.$message.success(root.$t("操作成功"));
      reqList();
    };

    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      tableState,
      columnMap,
      reqList,
      handlePaginationChange,
      toTaskTemplatePage,
      tableHeight: window.innerHeight - 430,
    };
  },
};
</script>
<style lang="scss">
.task-management-warp {
  padding: 10px;
  font-family: PingFangSC-Semibold, PingFang SC;
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
