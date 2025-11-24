<template>
  <div class="teacher-slots-type-list">
    <header>
      <el-radio-group v-model="businessLine" @change="resetSearch">
        <el-radio-button :label="1">{{ $t("中文") }}</el-radio-button>
        <el-radio-button :label="2">{{ $t("英文") }}</el-radio-button>
        <el-radio-button :label="3">{{ $t("数学") }}</el-radio-button>
      </el-radio-group>
    </header>
    <div class="filter-warp mt20">
      <el-form label-position="top" label-width="80px" :inline="true">
        <el-form-item :label="$t('日期')">
          <FilterByTimePeriod
            v-if="defaultTimeArr"
            @changeSelect="
              (timeArr) => {
                reqParams.minCreateTime = timeArr[0];
                reqParams.maxCreateTime = timeArr[1];
                resetSearch();
              }
            "
            :defaultTimeArr="defaultTimeArr"
          />
        </el-form-item>
        <el-form-item :label="$t('操作人')">
          <FilterByOPSAccount
            @change="
              (user) => {
                reqParams.createUserId = user.userInfo.id;
                resetSearch();
              }
            "
          />
        </el-form-item>
      </el-form>
    </div>
    <el-tabs
      tabPosition="top"
      v-model="reqParams.type"
      @tab-click="resetSearch"
    >
      <el-tab-pane :label="$t('单一设置')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('批量设置')" name="2"></el-tab-pane>
    </el-tabs>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
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
import { ref, reactive, computed, onMounted } from "@vue/composition-api";
import FilterByTeacherKey from "@/components/FilterItem/TeacherFilter/FilterByTeacherKey";
import BasicTable from "@/components/table/basic-table";
import FilterByWeek from "@/components/FilterItem/CommodityFilter/FilterByWeek.vue";
import FilterByOPSAccount from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccount";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";

export default {
  components: {
    FilterByTeacherKey,
    BasicTable,
    FilterByWeek,
    FilterByOPSAccount,
    FilterByTimePeriod,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const businessLine = ref(1);
    const resetSearch = () => {
      tableState.page = 1;
      reqList();
    };
    const reqParams = ref({
      type: "1",
      minCreateTime: "",
      maxCreateTime: "",
      createUserId: "",
    });
    const handleCalendarChange = (val) => {
      reqParams.value.minCreateTime = val[0];
      reqParams.value.maxCreateTime = val[1];
      resetSearch();
    };
    const reqList = async () => {
      let params = {
        ...reqParams.value,
        pageNum: tableState.page,
        pageSize: tableState.limit,
        businessLine: businessLine.value,
      };
      try {
        tableState.loading = true;
        let reqFun =
          params.type === "1"
            ? root.$Api.tutorManagement.reqQuerySlotConfigSingleLogList
            : root.$Api.tutorManagement.reqQuerySlotConfigBatchLogList;
        delete params.type;
        const res = await reqFun(params);
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const typeMap = {
      1: "仅试听",
      2: "仅正式",
      3: "全部可教",
    };
    const tableState = reactive({
      loading: false,
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      columns: computed(() => {
        return reqParams.value.type === "1"
          ? [
              {
                label: root.$t("序号"),
                fixed: "left",
                width: "50",
                render: (h, { $index }) =>
                  (tableState.page - 1) * tableState.limit + $index + 1,
              },
              {
                label: root.$t("真实姓名"),
                prop: "tutorIdentityName",
                minWidth: 100,
              },
              {
                label: root.$t("昵称"),
                prop: "tutorRealName",
                minWidth: 100,
              },
              {
                label: root.$t("教师ID"),
                prop: "tutorUserId",
                fixed: "left",
                minWidth: 130,
                render: (h, { row }) => (
                  <a
                    style={"color: #7580e5"}
                    onClick={() => {
                      toTeacherPage(row);
                    }}
                  >
                    {row.tutorUserId}
                  </a>
                ),
              },
              {
                label: root.$t("Slot类型"),
                prop: "slotType",
                minWidth: 100,
                render: (h, { row }) => (
                  <span>{root.$t(typeMap[row.slotType])}</span>
                ),
              },
              {
                label: root.$t("Slot时段"),
                minWidth: 400,
                render: (h, { row }) =>
                  row.slotTimeMon ? (
                    <div>
                      <div>
                        {row.slotTimeMon.length ? (
                          <span>
                            {root.$t("周一")}：{row.slotTimeMon.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeTue.length ? (
                          <span>
                            {root.$t("周二")}：{row.slotTimeTue.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeWed.length ? (
                          <span>
                            {root.$t("周三")}：{row.slotTimeWed.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeThu.length ? (
                          <span>
                            {root.$t("周四")}：{row.slotTimeThu.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeFri.length ? (
                          <span>
                            {root.$t("周五")}：{row.slotTimeFri.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeSat.length ? (
                          <span>
                            {root.$t("周六")}：{row.slotTimeSat.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        {row.slotTimeSun.length ? (
                          <span>
                            {root.$t("周日")}：{row.slotTimeSun.join("；")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  ),
              },
              {
                label: root.$t("操作日期"),
                prop: "createTime",
                minWidth: 100,
                render: (h, { row }) => (
                  <span>
                    {root.DateTimeUtils.dateClockTime(row.createTime)}
                  </span>
                ),
              },
              {
                label: root.$t("操作人"),
                prop: "createUserName",
                minWidth: 100,
              },
            ]
          : [
              {
                label: root.$t("序号"),
                fixed: "left",
                width: "50",
                render: (h, { $index }) =>
                  (tableState.page - 1) * tableState.limit + $index + 1,
              },
              {
                label: root.$t("文件名"),
                prop: "fileName",
                minWidth: 100,
              },
              {
                label: root.$t("上传教师数"),
                prop: "tutorNum",
                minWidth: 100,
              },
              {
                label: root.$t("操作日期"),
                prop: "createTime",
                minWidth: 100,
                render: (h, { row }) => (
                  <span>
                    {root.DateTimeUtils.dateClockTime(row.createTime)}
                  </span>
                ),
              },
              {
                label: root.$t("操作人"),
                prop: "createUserName",
                minWidth: 100,
              },
              {
                label: root.$t("操作"),
                width: isEn.value ? 200 : 150,
                render: (h, { row }) => (
                  <el-button
                    class="ml10"
                    type="text"
                    onClick={() => handelDownload(row)}
                  >
                    {root.$t("下载查看")}
                  </el-button>
                ),
              },
            ];
      }),
    });
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    const defaultTimeArr = ref([]);
    onMounted(() => {
      defaultTimeArr.value = [
        new Date(root.DateTimeUtils.getMonthStartDate()),
        new Date(root.DateTimeUtils.getMonthEndDate()),
      ];
      reqParams.value.minCreateTime = defaultTimeArr.value[0];
      reqParams.value.maxCreateTime = defaultTimeArr.value[1];
      reqList();
    });
    const handelDownload = (row) => {
      location.href = row.fileUrl;
    };

    /* 跳转 */
    const toTeacherPage = (row) => {
      const url = `/tutorManagement/teacherInfo?id=${
        row.tutorUserId
      }&teacherName=${row.tutorRealName || ""}&tabName=changeRecord`;
      window.open(url, "_blank");
    };

    return {
      businessLine,
      isEn,
      reqParams,
      handleCalendarChange,
      reqList,
      tableState,
      resetSearch,
      handlePaginationChange,
      defaultTimeArr,
    };
  },
};
</script>
<style lang="scss" scoped>
.teacher-slots-type-list {
  padding: 20px;
  .el-form-item__label {
    padding: 0;
  }
  .my-calendar {
    border: null;
    border-color: #ccc;
    border-width: 1px;
    border-radius: 4px;
    padding: 6px;
    color: #4a5568;
    overflow: hidden;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
}
</style>
