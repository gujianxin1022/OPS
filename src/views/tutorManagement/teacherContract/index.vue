<template>
  <!-- 请假 -->
  <div class="my-task-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        :label="$t('签约时间')"
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
        />
      </screen-item>
      
      <screen-item
        :label="$t('重签时间')"
        :part="4"
        :label-width="isEn ? 180 : labelWidth"
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.startResignTime = timeArr[0];
              screenData.endResignTime = timeArr[1];
              reqList();
            }
          "
          :isShowHotKey="true"
        />
      </screen-item>
      <screen-item
        :label="$t('签署状态')"
        :part="5"
        :label-width="isEn ? 140 : labelWidth"
      >
        <FilterBySignStatus
          @changeSelect="
            (val) => {
              screenData.resignStatus = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('教师管理人员')"
        :part="4"
        :label-width="isEn ? 180 : labelWidth"
      >
        <FilterByTeachManager
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
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
  set,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import FilterBySignStatus from "@/components/FilterItem/TeacherFilter/FilterBySignStatus";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
export default {
  components: {
    BasicTable,
    FilterByTimePeriod,
    FilterByUserAccount,
    FilterBySignStatus,
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
    const userParams = ref({});
    const screenData = reactive({
      startCreateTime: "",
      endCreateTime: "",
      startResignTime: "",
      endResignTime: "",
      resignStatus: "",
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
            label: root.$t("签约时间"),
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
            label: root.$t("合同编码"),
            prop: "contractNo",
            minWidth: 150,
          },
          {
            label: root.$t("生效时间"),
            width: 180,
            render: (_, { row }) => {
              return (
                <span>
                  {row.startTime
                    ? root.DateTimeUtils.dateClockTime(row.startTime).split(
                        " "
                      )[0]
                    : "-"}
                  ~
                  {row.endTime
                    ? root.DateTimeUtils.dateClockTime(row.endTime).split(
                        " "
                      )[0]
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("教师ID"),
            prop: "parentUserId",
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
            label: root.$t("教师昵称"),
            prop: "realName",
            minWidth: 150,
          },
          {
            label: root.$t("签署状态"),
            prop: "resignStatus",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span class={"text-wrap"}>
                  {root.$t(resignStatus[row?.resignStatus])}
                </span>
              );
            },
          },
          {
            label: root.$t("重签时间"),
            prop: "resignTime",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.resignTime)
                    : "-"}
                </span>
              );
            },
          },
          
          {
            label: root.$t("合同状态"),
            prop: "resignStatus",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span class={"text-wrap"}>
                  {root.$t(contractStatus[row?.status])}
                </span>
              );
            },
          },
          {
            label: root.$t("教师管理人员"),
            prop: "tmUserName",
            minWidth: 150,
          },
          {
            label: root.$t("操作"),
            minWidth: 180,
            render: (h, { row }) =>
              [0, 2].includes(row.status /* 0-生效中 1-已过期 2-未生效  */) &&
              row.resignStatus /* 状态:0-已完成,1-待重签 */ !== 1 ? (
                <div>
                  <el-button type="text" onClick={() => handleResign(row)}>
                    {root.$t("重签")}
                  </el-button>
                  <el-button
                    type="text"
                    onClick={() => {
                      window.open(row.agreementUrl, "__blank");
                    }}
                  >
                    {root.$t("查看")}
                  </el-button>
                </div>
              ) : (
                <div>
                  <el-button
                    type="text"
                    onClick={() => {
                      window.open(row.agreementUrl, "__blank");
                    }}
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
        const res = await root.$Api.tutorManagement.reqTutorContactList(
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
    const handleResign = async (row) => {
      await root.$confirm(root.$t("是否确定让教师重签?"), root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      await root.$Api.tutorManagement.reqTutorContactExamineOperate(row.id);
      root.$message.success(root.$t("操作成功"));
      reqList();
    };

    const resignStatus = {
      0: "已完成",
      1: "待重签",
    };
    const contractStatus = {
      0: "生效中",
      1: "已过期",
      2: "未生效",
    };


    onMounted(async () => {
      reqList();
    });
    return {
      labelWidth: "100",
      isEn,
      userParams,
      screenData,
      tableState,
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
