<template>
  <!-- 公共字段配置 -->
  <div class="public-field-warp">
    <div class="title">
      {{ $t("公共字段设置") }}
      <el-button class="fr" type="primary" @click="show">{{
        $t("新增字段")
      }}</el-button>
    </div>
    <div class="mb20">
      <el-input
        v-model="screenData.formItemName"
        style="width: 200px"
        :placeholder="$t('请输入')"
        @keyup.enter.native="(tableState.page = 1), reqList()"
      ></el-input>
      <el-button type="primary" @click="(tableState.page = 1), reqList()">{{
        $t("my-home-Search")
      }}</el-button>
    </div>
    <BasicTable
      :height="tableHeight"
      v-loading="tableState.loading"
      header-cell-class-name="my-theme-color-header"
      border
      :data="tableState.data"
      :column="tableState.columns"
      :page="tableState.page"
      :total="tableState.total"
      :limit="tableState.limit"
      :pagination="true"
      @pagination="handlePaginationChange"
    />
    <EditField
      v-if='editFieldVisible'
      :operationType="operationType"
      :visible.sync="editFieldVisible"
      :operateFieldId="operateFieldId"
      :operateItemType="operateItemType"
      @ok="reqList()"
    />
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import EditField from "./components/editField.vue";

export default {
  components: {
    BasicTable,
    EditField,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = reactive({
      formItemName: "",
      sort: "desc",
    });
    const editFieldVisible = ref(false);
    const fieldTypeMap = {
      SelectMultiple: "多选",
      Select: "单选",
      Radio: "单选",
      TextArea: "文本",
    };
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
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
            label: root.$t("字段名称-中文"),
            fixed: "left",
            minWidth: "150",
            prop: "itemNameMap",
            render: (_, { row }) => {
              return <span>{row.itemNameMap.zh}</span>;
            },
          },
          {
            label: root.$t("字段名称-英文"),
            minWidth: "150",
            prop: "itemNameMap",
            render: (_, { row }) => {
              return <span class={'text-wrap'}>{row.itemNameMap.en}</span>;
            },
          },
          {
            label: root.$t("字段类型"),
            minWidth: "120",
            prop: "itemType",
            render: (_, { row }) => {
              return <span>{root.$t(fieldTypeMap[row.itemType])}</span>;
            },
          },
          {
            label: root.$t("字段值-中文"),
            minWidth: "140",
            prop: "itemValueCn",
            render: (_, { row }) => {
              return <span>{row.itemValueCn || "-"}</span>;
            },
          },
          {
            label: root.$t("字段值-英文"),
            minWidth: "140",
            prop: "itemValueEn",
            render: (_, { row }) => {
              return <span class={'text-wrap'}>{row.itemValueEn || "-"}</span>;
            },
          },
          {
            label: root.$t("创建时间"),
            width: "150",
            prop: "createTime",
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
            render: (_, { row }) => {
              return (
                <span>{root.DateTimeUtils.dateClockTime(row.createTime)}</span>
              );
            },
          },
          {
            label: root.$t("创建人"),
            prop: "createUser",
            minWidth: "100",
            render: (_, { row }) => {
              return <span>{row.createUser.userName}</span>;
            },
          },
          {
            fixed: "right",
            width: "150",
            label: root.$t("操作"),
            render: (h, { row }) => (
              <div>
                <el-button
                  type="text"
                  loading={row.loading}
                  onClick={() => handelEdit(row)}
                >
                  {root.$t("编辑")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });
    const handelSort = (sort) => {
      if (screenData.sort === "asc") {
        screenData.sort = "desc";
      } else {
        screenData.sort = "asc";
      }
      reqList();
    };
    const reqList = async () => {
      tableState.loading = true;
      const { page, limit } = tableState;
      const params = {
        formItemName: screenData.formItemName,
        pageNum: page,
        pageSize: limit,
        sort: screenData.sort,
      };
      try {
        const res = await root.$Api.taskManagement.reqPublicFieldList(params);
        res.list.forEach((e) => {
          if (e?.itemValueCn?.length > 120) {
            e.itemValueCn = e.itemValueCn.substr(0, 120) + "...";
          }
          if (e?.itemValueEn?.length > 120) {
            e.itemValueEn = e.itemValueEn.substr(0, 120) + "...";
          }
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
    const operationType = ref("");

    const show = () => {
      operationType.value = "新增字段";
      operateItemType.value = "";
      operateFieldId.value = null;
      editFieldVisible.value = true;
    };
    const operateFieldId = ref(null);
    const operateItemType = ref("");
    const handelEdit = (row) => {
      operateItemType.value = row.itemType;
      operateFieldId.value = row.id;
      operationType.value = "编辑字段";
      editFieldVisible.value = true;
    };
    const handlePaginationChange = (info) => {
      console.log(info)
      Object.assign(tableState, info);
      reqList();
    };
    onMounted(() => {
      reqList();
    });
    return {
      isEn,
      screenData,
      tableState,
      editFieldVisible,
      operationType,
      operateFieldId,
      operateItemType,
      show,
      reqList,
      handlePaginationChange,
      tableHeight: window.innerHeight - 355,
    };
  },
};
</script>
<style lang="scss" scoped>
.public-field-warp {
  padding: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
  }
}
</style>
<style lang="scss">
.public-field-warp {
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
