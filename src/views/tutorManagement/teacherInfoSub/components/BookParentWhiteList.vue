<template>
  <div class="book-parent-white-list-warp">
    <el-dialog
      :title="$t('约课白名单家长')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="60%"
      top="10vh"
      :before-close="handleClose"
      center
    >
      <div style="line-height: 32px" class="mb10 clearfix">
        <span>{{ $t("教师") }}：{{ $route.query.realName||$route.query.teacherName }}</span>
        <el-input
          style="width: 240px"
          :placeholder="$t('请输入家长ID')"
          v-model="parentUserId"
          clearable
          class="fr"
        >
          <el-button @click="reqAddWhiteList" type="primary" slot="append">{{
            $t("添加")
          }}</el-button>
        </el-input>
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
import { parentIdValidate } from "@/utils/reg.js";

export default {
  props: {
    dialogVisible: { type: Boolean, default: false },
    tutorUserId: {
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
        const res = await root.$Api.tutorManagement.reqBookParentWhiteList({
          tutorUserId: props.tutorUserId,
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
            label: root.$t("家长id"),
            prop: "parentUserId",
            minWidth: 120,
            render: (h, { row }) => (
              <a
                style={"color: #7580e5"}
                onClick={() => {
                  toUserPage(row);
                }}
              >
                {row.parentUserId}
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
          {
            label: root.$t("添加人"),
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
                onClick={() => handelRemove(row)}
              >
                {root.$t("移除")}
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
    /* 白名单操作 */
    const parentUserId = ref("");
    const reqAddWhiteList = async () => {
      if (!parentIdValidate(root, parentUserId.value + "")) return;
      try {
        await root.$Api.tutorManagement.reqAddBookParentWhiteList({
          tutorUserId: props.tutorUserId,
          parentUserId: parentUserId.value,
        });
        root.$notify.success(root.$t("操作成功"));
        tableState.page = 1;
        reqList();
        parentUserId.value = "";
      } finally {
      }
    };
    const handelRemove = async (row) => {
      await root.$confirm(
        root.$t("确定要把该家长移出白名单吗"),
        root.$t("提示"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        }
      );
      await root.$Api.tutorManagement.reqDelBookParentWhiteList({
        id: row.id,
      });
      root.$notify.success(root.$t("操作成功"));
      tableState.page = 1;
      reqList();
    };
    const toUserPage = (row) => {
      handleClose();
      root.$router.push(
        `/studentManagement/parentInfo?parentUserId=${row.parentUserId}`
      );
    };
    return {
      handleClose,
      isEn,
      tableState,
      handlePaginationChange,
      parentUserId,
      reqAddWhiteList,
    };
  },
};
</script>
