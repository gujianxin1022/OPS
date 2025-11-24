<template>
  <div class="client-version-upgrade-warp p20">
    <custom-card :title="$t('客户端版本升级列表')">
      <div slot="header-right">
        <el-button
          type="primary"
          @click="
            () => {
              operationType = 'create';
              drawer = true;
            }
          "
        >
          {{ $t("创建") }}
        </el-button>
      </div>
      <BasicTable
        v-loading="loadingList"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
        :pagination="true"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        @pagination="handlePaginationChange"
        :pageSizes="[10, 20, 30, 50, 100, 200]"
      />
    </custom-card>
    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose"
      :wrapperClosable="false"
      :close-on-press-escape="false"
    >
      <AppUpgradeForm
        :rowInfo="currentRow"
        :operationType="operationType"
        @refresh="reqAppVersionList"
        :visible.sync="drawer"
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
  unref,
  toRefs,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import { filterPlatformType } from "./dataConfig";
import { copyLink } from "@/utils/file";
import AppUpgradeForm from "./AppUpgradeForm";

export default {
  components: {
    BasicTable,
    AppUpgradeForm,
  },
  props: {
    myClassName: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loadingState = reactive({
      loadingList: false,
    });
    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 50,
      data: [],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            fixed: true,
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("ID"),
            fixed: true,
            prop: "id",
            minWidth: 80,
          },
          {
            label: root.$t("版本"),
            prop: "versionType",
            width: isEn.value ? 150 : 80,
            render: (_, { row }) => {
              return <span>{row.versionNew}</span>;
            },
          },
          {
            label: root.$t("版本描述"),
            minWidth: 150,
            render: (_, { row }) => {
              return <span>{isEn.value ? row.detailEn : row.detailCn}</span>;
            },
          },
          {
            label: root.$t("app类型"),
            minWidth: 150,
            render: (_, { row }) => {
              return <span>{row.appType === 1 ? "学生端" : "家长端"}</span>;
            },
          },
          {
            label: root.$t("平台类型"),
            prop: "versionType",
            width: isEn.value ? 150 : 80,
            render: (_, { row }) => {
              return <span>{filterPlatformType(row.platformType)}</span>;
            },
          },

          {
            label: root.$t("包大小"),
            prop: "appSize",
            width: 80,
          },
          {
            label: root.$t("发布时间"),
            prop: "putAwayTime",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.publicTime
                    ? root.DateTimeUtils.dateClockTime(row.publicTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("更新时间"),
            prop: "soldOutTime",
            width: "150",
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
            label: root.$t("上下架状态"),
            prop: "status",
            width: isEn.value ? 220 : 180,
            render: (_, { row }) => {
              return (
                <span style={row.status === 1 ? "color:red" : ""}>
                  {row.status === 1 ? "上架" : "下架"}
                </span>
              );
            },
          },
          {
            label: root.$t("操作"),
            width: isEn.value ? 200 : 150,
            render: (h, { row }) => (
              <div>
                <el-button
                  onClick={() => handelEdit(row)}
                  class="ml10"
                  type="text"
                  disabled={row.status !== 1}
                >
                  {root.$t("编辑")}
                </el-button>
                <el-button
                  slot="append"
                  type="text"
                  onClick={() => onCopyLink(row.detailOther1)}
                >
                  {root.$t("复制链接")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });
    const reqAppVersionList = async () => {
      try {
        Object.assign(tableState, { data: [], total: 0 });
        loadingState.loadingList = true;
        const res = await root.$Api.systemManagement.reqAppVersionUpgradeList(
          tableState.page,
          tableState.limit
        );
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        loadingState.loadingList = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqAppVersionList();
    };
    const onCopyLink = async (link) => {
      await copyLink(link)
        .then(
          () => {
            root.$notify({
              message: root.$t("复制成功"),
              type: "success",
            });
          },
          () => {
            root.$notify({
              message: root.$t("复制失败"),
              type: "error",
            });
          }
        )
        .finally(() => {});
    };
    /* 抽屉逻辑 */
    const currentRow = ref(null);
    const drawer = ref(false);
    const operationType = ref("");
    const handelEdit = (row) => {
      operationType.value = "edit";
      currentRow.value = row;
      drawer.value = true;
    };
    onMounted(() => {
      reqAppVersionList();
    });
    return {
      isEn,
      tableState,
      drawer,
      currentRow,
      ...toRefs(loadingState),
      reqAppVersionList,
      handlePaginationChange,
      operationType,
      currentRow,
    };
  },
};
</script>
