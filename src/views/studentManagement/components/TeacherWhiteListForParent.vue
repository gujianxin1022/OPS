<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="60%"
      top="10vh"
      :before-close="handleClose"
      center
    >
      <div slot="title">
        {{ $t("约课白名单教师") }}
        <el-tooltip>
          <div slot="content" style="padding: 0 10px; line-height: 20px">
            {{
              $t(
                "白名单中的老师，无论其时间段设置为试听、正式或其他限制类型，只要该时段已开放并未被其他学生预约，您都可自由预约课程。"
              )
            }}
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
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
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive } from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
export default {
  props: {
    dialogVisible: { type: Boolean, default: false },
    parentUserId: {
      type: Number,
      default: -1,
    },
  },
  components: {
    BasicTable,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const handleClose = () => {
      emit("update:dialogVisible", false);
    };
    onMounted(() => {
      reqList();
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        console.log(props.parentUserId);
        const res = await root.$Api.tutorManagement.reqBookTeacherWhiteList({
          parentUserId: props.parentUserId,
          pageNum: tableState.page,
          pageSize: tableState.limit,
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
    const tableState = reactive({
      loading: false,
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      columns: computed(() => {
        return [
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
            label: root.$t("添加日期"),
            prop: "createTime",
            minWidth: 100,
            render: (h, { row }) => (
              <span>{root.DateTimeUtils.dateClockTime(row.createTime)}</span>
            ),
          },
        ];
      }),
    });
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    /* 跳转 */
    const toTeacherPage = (row) => {
      const url = `/tutorManagement/teacherInfo?id=${
        row.tutorUserId
      }&realName=${row.tutorRealName || ""}&tabName=teacherTimetable`;
      window.open(url, "_blank");
    };
    return {
      handleClose,
      isEn,
      tableState,
      handlePaginationChange,
      toTeacherPage,
    };
  },
};
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 350px !important;
}
</style>
