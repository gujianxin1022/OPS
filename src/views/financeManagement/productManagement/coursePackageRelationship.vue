<template>
  <div class="course-relations-warp">
    <screen-wrapper
      @search="(tableState.page = 1), reqList()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item :label="$t('SPU ID')" label-width="120">
        <el-input
          v-model.trim="screenData.courseProductId"
          :placeholder="$t('请输入')"
          :disabled="$route.query.spuId"
          clearable
          @input="
            () => {
              screenData.courseProductId = screenData.courseProductId.replace(
                /[^\d]/g,
                ''
              );
            }
          "
        />
      </screen-item>
      <screen-item
        v-show="!$route.query.spuId"
        :label="$t('原课包ID')"
        label-width="120"
      >
        <el-input
          v-model.trim="screenData.sourceCoursePackage"
          :placeholder="$t('请输入')"
          clearable
          @input="
            () => {
              screenData.sourceCoursePackage =
                screenData.sourceCoursePackage.replace(/[^\d]/g, '');
            }
          "
        />
      </screen-item>
      <screen-item
        v-show="!$route.query.spuId"
        :label="$t('关联课包ID')"
        label-width="120"
      >
        <el-input
          v-model.trim="screenData.targetCoursePackage"
          :placeholder="$t('请输入')"
          clearable
          @input="
            () => {
              screenData.targetCoursePackage =
                screenData.targetCoursePackage.replace(/[^\d]/g, '');
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
  </div>
</template>
<script>
import {
  onMounted,
  watch,
  ref,
  computed,
  reactive,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
export default {
  components: {
    BasicTable,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = reactive({
      courseProductId: root.$route.query.spuId || null,
      sourceCoursePackage: null,
      targetCoursePackage: null,
    });
    const statusOptionList = [
      { label: "全部", value: "" },
      { label: "未开始", value: 0 },
      { label: "生效中", value: 1 },
      { label: "已结束", value: 2 },
    ];
    const tableState = reactive({
      loading: false,
      total: 0,
      page: 1,
      limit: 10,
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
            fixed: true,
            minWidth: "80",
            label: root.$t("SPU ID"),
            prop: "courseProductId",
          },
          {
            fixed: true,
            minWidth: "200",
            label: root.$t("SPU名称"),
            prop: "courseProductName",
          },
          {
            minWidth: "200",
            label: root.$t("原课包ID"),
            prop: "sourceCoursePackage",
          },
          {
            minWidth: "200",
            label: root.$t("原课包名称"),
            prop: "sourceCoursePackageName",
          },
          {
            minWidth: "200",
            label: root.$t("可兑换课包ID"),
            prop: "targetCoursePackage",
          },
          {
            minWidth: "200",
            label: root.$t("可兑换课包名称"),
            prop: "targetCoursePackageName",
          },
          {
            minWidth: "200",
            label: root.$t("兑换比例"),
            prop: "scale",
          },
          {
            minWidth: "200",
            label: root.$t("特殊兑换比例"),
            prop: "specialSale",
            render: (_, { row }) => {
              return (
                <el-input-number
                  precision={2}
                  min={0}
                  max={9999}
                  style="margin-top:8px"
                  value={row.specialSale}
                  onInput={(val) => {
                    row.specialSale = val;
                  }}
                  onChange={() => reqChangeStatus(row)}
                ></el-input-number>
              );
            },
          },
          {
            minWidth: "200",
            label: root.$t("是否自动"),
            prop: "autoType",
            render: (_, { row }) => {
              return (
                <el-switch
                  onChange={() => reqChangeStatus(row)}
                  active-value={row.autoType != 0}
                  inactive-value={row.autoType == 0}
                  active-text={root.$t("是")}
                  inactive-text={root.$t("否")}
                ></el-switch>
              );
            },
          },

          {
            label: root.$t("最近修改时间"),
            width: 150,
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
            label: root.$t("创建时间"),
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
          },
        ];
      }),
    });

    const reqChangeStatus = async (row) => {
      console.log(row);
      try {
        await root.$Api.financeManagement.reqUpdateSpecialSale({
          id: row.id,
          autoType: row.autoType == 1 ? 0 : 1,
          specialSale: row.specialSale,
        });
        row.autoType = row.autoType == 1 ? 0 : 1;
        reqList();
        root.$notify.success(root.$t("操作成功"));
      } catch {
        reqList();
      }
    };

    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [], total: 0 });
        const res = await root.$Api.financeManagement.reqAllPackageMapping({
          pageNum: tableState.page,
          pageSize: tableState.limit,
          courseProductId: screenData.courseProductId,
          sourceCoursePackage: screenData.sourceCoursePackage,
          targetCoursePackage: screenData.targetCoursePackage,
        });
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
    };
    watch(
      () => tableState.limit,
      () => {
        tableState.page = 1;
        if (tableState.loading) return;
        reqList();
      }
    );
    watch(
      () => tableState.page,
      () => {
        reqList();
      }
    );
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      tableState,
      reqList,
      handlePaginationChange,
    };
  },
};
</script>
<style lang="scss">
.course-relations-warp {
  padding-bottom: 10px;
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 350px !important;
}
</style>
