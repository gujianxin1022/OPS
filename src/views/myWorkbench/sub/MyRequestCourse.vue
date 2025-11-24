<template>
  <div class="my-request-course-warp">
    <div class="filer-warp">
      <el-tabs
        tabPosition="top"
        v-model="screenData.tabType"
        @tab-click="handleClick"
      >
        <el-tab-pane :label="$t('自己提交')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('家长提交')" name="2"></el-tab-pane>
      </el-tabs>
      <el-form label-position="top" label-width="80px" :inline="true">
        <el-form-item :label="$t('申请时间')">
          <el-date-picker
            style="width: 370px"
            v-model="applyDate"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            size="small"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item :label="$t('家长ID')">
          <el-input
            v-model.trim="screenData.parentUserId"
            :placeholder="$t('请输入家长ID')"
            clearable
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item :label="$t('学生ID')">
          <el-input
            v-model.trim="screenData.studentUserId"
            :placeholder="$t('请输入学生ID')"
            clearable
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item :label="$t('老师ID')">
          <el-input
            v-model.trim="screenData.tutorUserId"
            clearable
            :placeholder="$t('请输入教师ID')"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item :label="$t('提交端口')">
          <el-select
            v-model="screenData.createUserRole"
            filterable
            style="width: 177px"
            clearable
            :collapse-tags="true"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="(item, index) in portOptionList"
              :key="index"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-select
            v-model="screenData.status"
            filterable
            style="width: 177px"
            clearable
            :collapse-tags="true"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="(item, index) in statusOptionList"
              :key="index"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-top: 32px">
          <el-button type="primary" style="width: 100px" @click="search">{{
            $t("搜索")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right"></div>
      <BasicTable
        v-loading="tableState.loading"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
        :pagination="true"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        @pagination="handlePaginationChange"
      />
    </custom-card>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('求课详情')"
      center
      :visible.sync="showDialog"
    >
      <el-form
        :model="requestCourseInfo"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-if="requestCourseInfo.virtualclassInfoList"
          :label="$t('上课时间')"
          prop="name"
        >
          {{
            DateTimeUtils.dateClockTime(
              requestCourseInfo.virtualclassInfoList[0].startTime
            )
          }}
          ~
          {{
            DateTimeUtils.dateClockTime(
              requestCourseInfo.virtualclassInfoList[0].endTime
            )
          }}
        </el-form-item>
        <el-form-item :label="$t('课程')" prop="name">
          {{
            isEn
              ? requestCourseInfo.lessonDescEN
              : requestCourseInfo.lessonDescZH
          }}
        </el-form-item>
        <el-form-item :label="$t('求课原因')" prop="name">
          {{ requestCourseInfo.reason || "-" }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import BasicTable from "@/components/table/basic-table";
import FilterByWorkOrderPriority from "@/components/FilterItem/WorkOrderFilter/FilterByWorkOrderPriority";

export default {
  components: {
    FilterByTimePeriod,
    BasicTable,
    FilterByWorkOrderPriority,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currStudentId = ref(root.$route.query.studentId);
    const currTeacherId = ref(root.$route.query.teacherId);
    const applyDate = ref([]);

    const portOptionList = [
      {
        label: "全部",
        value: "",
      },
      {
        label: "家长端",
        value: 1,
      },
      {
        label: "OPS",
        value: 5,
      },
    ];
    const statusOptionList = [
      {
        label: "待处理",
        value: 1,
      },
      {
        label: "已同意",
        value: 2,
      },
      {
        label: "已拒绝",
        value: 3,
      },
      {
        label: "已过期",
        value: 4,
      },
      {
        label: "已取消",
        value: 5,
      },
    ];
    const statusNameMap = {
      1: "待处理",
      2: "已同意",
      3: "已拒绝",
      4: "已过期",
      5: "已取消",
    };
    const expiredTypeNameMap = {
      1: "老师未处理",
      2: "学生时间被占",
      3: "学生课时不足",
      4: "学生每周约课量限制",
      5: "学生剩余课程内容不足",
    };
    const handleClick = () => {
      search();
    };
    const screenData = reactive({
      parentUserId: "",
      tutorUserId: currTeacherId.value || "",
      studentUserId: currStudentId.value || "",
      createUserRole: "",
      tabType: "1",
      status: "",
    });
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
            fixed: "left",
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            minWidth: "100",
            label: root.$t("家长ID"),
            prop: "parentUserId",
            render: (h, { row }) => <span>{row.parentUserId}</span>,
          },
          {
            minWidth: "100",
            label: root.$t("学生姓名"),
            prop: "studentRealName",
            render: (h, { row }) => <span>{row.studentRealName}</span>,
          },
          {
            minWidth: "100",
            label: root.$t("学生ID"),
            prop: "studentUserId",
            render: (h, { row }) => <span>{row.studentUserId}</span>,
          },
          {
            minWidth: "100",
            label: root.$t("老师姓名"),
            prop: "tutorRealName",
            render: (h, { row }) => <span>{row.tutorRealName}</span>,
          },
          {
            minWidth: "100",
            label: root.$t("老师ID"),
            prop: "tutorUserId",
            render: (h, { row }) => <span>{row.tutorUserId}</span>,
          },
          {
            minWidth: "200",
            label: root.$t("状态"),
            prop: "status",
            render: (h, { row }) =>
              row.status === 4 ? (
                <span>
                  {root.$t(statusNameMap[row.status])}
                  <div>{root.$t('过期类型')}：（{root.$t(expiredTypeNameMap[row.expiredType])}）</div>
                </span>
              ) : (
                <span>{root.$t(statusNameMap[row.status])}</span>
              ),
          },
          {
            minWidth: "100",
            label: root.$t("申请时间"),
            prop: "status",
            render: (h, { row }) => (
              <span>{root.DateTimeUtils.dateClockTime(row.createTime)}</span>
            ),
          },
          {
            fixed: "right",
            label: root.$t("操作"),
            width: isEn.value ? 180 : 120,
            render: (h, { row }) => (
              <div>
                <el-button
                  onClick={() => handelView(row)}
                  class="ml10"
                  type="text"
                >
                  {root.$t("查看详情")}
                </el-button>
                <span>
                  {row.showCancelButton ? (
                    <el-button
                      onClick={() => handelCancel(row)}
                      class="ml10"
                      type="text"
                    >
                      {root.$t("取消求课")}
                    </el-button>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            ),
          },
        ];
      }),
    });
    const search = () => {
      tableState.page = 1;
      reqList();
    };
    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [], total: 0 });
        const res = await root.$Api.classManagement.reqWorkRequestCourseList({
          pageNum: tableState.page,
          pageSize: tableState.limit,
          ...screenData,
          createTimeMin:
            applyDate.value && applyDate.value.length
              ? new Date(`${applyDate.value[0]}`)
              : "",
          createTimeMax:
            applyDate.value && applyDate.value.length
              ? new Date(`${applyDate.value[1]}`)
              : "",
        });
        Object.assign(tableState, {
          data: res?.data.list ?? [],
          total: res?.data.total - 0 ?? 0,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqList();
    };

    const showDialog = ref(false);
    const requestCourseInfo = ref({});
    const handelView = async (colum) => {
      const res = await root.$Api.classManagement.reqWorkRequestCourseInfo(
        colum.id
      );
      showDialog.value = true;
      requestCourseInfo.value = res;
    };

    const handelCancel = async (colum) => {
      await root.$confirm(root.$t("确认取消此求课申请吗？"), root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      const res = await root.$Api.classManagement.reqDoCancelRequestSingle(
        colum.id
      );
      root.$notify.success(root.$t("操作成功"));
      reqList();
    };
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      tableState,
      reqList,
      handlePaginationChange,
      currStudentId,
      portOptionList,
      statusOptionList,
      applyDate,
      search,
      handleClick,
      showDialog,
      requestCourseInfo,
    };
  },
};
</script>
<style lang="scss">
.my-request-course-warp {
  .filer-warp {
    padding: 20px;
    .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
