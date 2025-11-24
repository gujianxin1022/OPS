<template>
  <!-- 请假 -->
  <div class="my-task-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('请假时间')"
        :part="4"
        :label-width="isEn ? 180 : labelWidth"
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.startCreateTime = timeArr[0];
              screenData.endCreateTime = timeArr[1];
              reqList();
            }
          "
          :isShowHotKey="true"
          :defaultTimeArr="defaultTimeArr"
        />
      </screen-item>
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.tutorMT.teacherApplication.filterByTmUserId'
          )
        "
        :label="$t('教师管理人员')"
        :part="4"
        :label-width="isEn ? 180 : labelWidth"
      >
        <FilterByTeachManager
          :isShowAll="false"
          @changeSelect="
            (val) => {
              screenData.tmUserId = val;
              (tableState.page = 1), reqList();
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('教师')"
        :part="5"
        :label-width="isEn ? 140 : labelWidth"
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
        :label="$t('请假类型')"
        :part="5"
        :label-width="isEn ? 140 : labelWidth"
      >
        <FilterByLeaveType
          @changeSelect="
            (val) => {
              screenData.type = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('审核状态')"
        :part="5"
        :label-width="isEn ? 140 : labelWidth"
      >
        <FilterByLeaveApprovalStatus
          @changeSelect="
            (val) => {
              screenData.examineStatus = val;
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
      <BasicTable
        :key="keyIndex"
        :height="tableHeight"
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
      v-if="visible"
      :visible.sync="visible"
      :title="
        handleCurrentRow.operationType === 'view' ? $t('查看') : $t('审核')
      "
      direction="ltr"
      :wrapperClosable="true"
    >
      <LeaveApplication
        @refresh="
          () => {
            reqList();
          }
        "
        @close="
          () => {
            visible = false;
          }
        "
        v-if="visible"
        :row="handleCurrentRow"
      />
    </el-drawer>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import FilterByLeaveType from "@/components/FilterItem/TeacherFilter/FilterByLeaveType";
import FilterByLeaveApprovalStatus from "@/components/FilterItem/TeacherFilter/FilterByLeaveApprovalStatus";
import LeaveApplication from "../components/LeaveApplication.vue";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
import { columnMap } from "../dataConfig";
export default {
  components: {
    BasicTable,
    FilterByTimePeriod,
    FilterByUserAccount,
    FilterByLeaveType,
    FilterByLeaveApprovalStatus,
    LeaveApplication,
    FilterByTeachManager,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const keyIndex = ref(1);
    watch(
      () => isEn.value,
      (val) => {
        keyIndex.value++;
      }
    );
    const currentLang = computed(() => root.$store.getters.currentLang);
    const userParams = ref({});
    const screenData = reactive({
      endCreateTime: "",
      examineStatus: "",
      startCreateTime: "",
      tmUserId: "",
      type: "",
    });
    const getSeleParams = (val, valName) => {
      if (valName === "postIdList") {
        //组id
        screenData.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        // 组员id
        screenData.userIdStr = val.join(",");
      } else if (valName === "clear") {
        //清空
        screenData.postIdStr = "";
        screenData.userIdStr = "";
      }
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
            label: root.$t("请假时间"),
            fixed: "left",
            prop: "createTime",
            width: isEn.value ? 250 : 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.createTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("教师ID"),
            prop: "parentUserId",
            fixed: "left",
            minWidth: 150,
            render: (h, { row }) => (
              <el-button type="text">
                <router-link
                  to={{
                    name: `teacherInfo`,
                    query: { id: row.tutorUserId, teacherName: row.realName },
                  }}
                >
                  {row.tutorUserId}
                </router-link>
              </el-button>
            ),
          },
          {
            fixed: "left",
            label: root.$t("姓名"),
            prop: "identityName",
            minWidth: 150,
          },
          {
            label: root.$t("请假类型"),
            prop: "type",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span class={"text-wrap"}>
                  {root.$t(columnMap.typeStatus[row?.type])}
                </span>
              );
            },
          },
          {
            label: root.$t("开始时间"),
            prop: "startTime",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.startTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("结束时间"),
            prop: "endTime",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.endTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("请假课堂数"),
            prop: "virtualclassNum",
            minWidth: 150,
          },
          {
            label: root.$t("审核状态"),
            prop: "examineStatus",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span class={"text-wrap"}>
                  {root.$t(columnMap.reviewStatus[row?.examineStatus])}
                </span>
              );
            },
          },
          {
            label: root.$t("操作人"),
            prop: "examineUserName",
            minWidth: 150,
          },
          {
            label: root.$t("操作"),
            minWidth: 180,
            render: (h, { row }) =>
              row.examineStatus === 1 ? (
                <div>
                  <el-button
                    type="text"
                    disabled={row.status === 1}
                    onClick={() => openDrawer("review", row)}
                  >
                    {root.$t("审核")}
                  </el-button>
                </div>
              ) : (
                <div>
                  <el-button
                    type="text"
                    onClick={() => openDrawer("view", row)}
                  >
                    {root.$t("查看")}
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
      try {
        const params = {
          ...screenData,
          ...userParams.value
        };
        const res = await root.$Api.tutorManagement.getTutorLeaveList(
          page,
          limit,
          params
        );
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    const handleCurrentRow = ref({});
    const defaultTimeArr = ref([]);
    const initDate = () => {
      const stamp1 = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
      const stamp2 = new Date(
        new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
      );
      defaultTimeArr.value = [new Date(stamp1), new Date(stamp2)];
      screenData.startCreateTime = defaultTimeArr.value[0];
      screenData.endCreateTime = defaultTimeArr.value[1];
    };
    /* 审核弹窗 */
    const visible = ref(false);
    const openDrawer = (type, row) => {
      handleCurrentRow.value = row;
      handleCurrentRow.value.operationType = type;
      visible.value = true;
    };

    onMounted(async () => {
      await initDate();
      reqList();
    });
    return {
      labelWidth: "100",
      currentLang,
      isEn,
      userParams,
      screenData,
      tableState,
      handleCurrentRow,
      defaultTimeArr,
      visible,
      keyIndex,
      reqList,
      handlePaginationChange,
      getSeleParams,
      tableHeight: window.innerHeight - 430,
    };
  },
};
</script>
<style lang="scss">
.my-task-warp {
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
