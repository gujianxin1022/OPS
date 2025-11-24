<template>
  <!-- 添加字段 -->
  <div class="choose-field-warp">
    <el-button @click="dialogVisible = true" style="width: 108px">{{
      $t("添加字段")
    }}</el-button>
    <el-dialog
      :title="$t('选择Follow Up字段')"
      :visible.sync="dialogVisible"
      width="660px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <BasicTable
          height="400px"
          ref="chooseTable"
          header-cell-class-name="my-theme-color-header"
          border
          v-loading="tableState.loading"
          :data="tableState.data"
          :column="tableState.columns"
          :page="tableState.page"
          :limit="tableState.limit"
          @selection-change="
            (list) => {
              fieldList = list;
            }
          "
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="(dialogVisible = false), changeSelect()"
          >{{ $t("确定") }}</el-button
        >
      </span>
    </el-dialog>
    <div
      :class="`selected-table-warp ${myClassName}`"
      v-show="fieldList.length && !dialogVisible"
    >
      <el-table
        height="400px"
        header-cell-class-name="my-theme-color-header"
        :data="selectTableState.data"
        row-key="id"
        tooltip-effect="dark"
        :border="false"
        show-overflow-tooltip="true"
        stripe
      >
        <el-table-column
          align="center"
          :label="$t('顺序')"
          width="100"
          prop="row"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('字段名称')"
          prop="user"
          min-width="150"
        >
          <template slot-scope="{ row }">
            {{ isEn ? row.itemNameMap.en : row.itemNameMap.zh }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="150"
          :label="$t('是否必填')"
          prop="status"
        >
          <template slot-scope="{ row }">
            <el-radio-group @change="handleEmit()" v-model="row.required">
              <el-radio :label="1">{{ $t("是") }} </el-radio>
              <el-radio :label="2">{{ $t("否") }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" :width="200">
          <template slot-scope="{ row }">
            <el-space>
              <el-button @click="deleteField(row)" type="text">{{
                $t("删除")
              }}</el-button>
              <span class="handle-target-wrap ml10">
                <img src="../../../assets/drag.png" class="handle-target"
              /></span>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  unref,
  watch,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import { deepClone } from "@/utils/handleData";
import Sortable from "sortablejs";

export default {
  components: {
    BasicTable,
  },
  props: {
    myClassName: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const dialogVisible = ref(false);
    const fieldList = ref([]);
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 1000,
      data: [],
      columns: computed(() => {
        return [
          {
            type: "selection",
          },
          {
            label: root.$t("字段名称"),
            prop: "itemNameMap",
            render: (_, { row }) => {
              return isEn.value ? (
                <span>{row.itemNameMap.en}</span>
              ) : (
                <span>{row.itemNameMap.zh}</span>
              );
            },
          },

          {
            label: root.$t("字段类型"),
            prop: "itemType",
            render: (_, { row }) => {
              return <span>{root.$t(fieldTypeMap[row.itemType])}</span>;
            },
          },
          {
            label: root.$t("选项"),
            prop: "itemValueEn",
            render: (_, { row }) => {
              return isEn.value ? (
                <span>{row.itemValueEn || "-"}</span>
              ) : (
                <span>{row.itemValueCn || "-"}</span>
              );
            },
          },
        ];
      }),
    });
    const selectTableState = reactive({
      data: [],
    });
    const changeSelect = () => {
      selectTableState.data = deepClone(fieldList.value);
      if (selectTableState.data.length) createRowDrop();
      handleEmit();
    };
    const reqList = async () => {
      tableState.loading = true;
      const { page, limit } = tableState;
      const params = {
        pageNum: page,
        pageSize: limit,
        sort: "desc",
      };
      try {
        const res = await root.$Api.taskManagement.reqPublicFieldList(params);
        res.list.forEach((e) => {
          e.required = 1;
          if (e?.itemValueCn?.length > 120) {
            e.itemValueCn = e.itemValueCn.substr(0, 120) + "...";
          }
          if (e?.itemValueEn?.length > 120) {
            e.itemValueEn = e.itemValueEn.substr(0, 120) + "...";
          }
        });
        Object.assign(tableState, {
          data: res.list || [],
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const handleEmit = () => {
      let list = deepClone(selectTableState.data);
      list.forEach((e) => {
        e.formItemId = e.id;
      });
      emit("changeSelect", list);
    };
    const createRowDrop = () => {
      try {
        const tbody = document.querySelector(
          `.${props.myClassName} .el-table__body-wrapper tbody`
        );
        Sortable.create(tbody, {
          handle: ".handle-target",
          animation: 150,
          onEnd({ newIndex, oldIndex }) {
            if (newIndex === oldIndex) return;
            const copyTableData = deepClone(unref(selectTableState.data));
            const currentRow = copyTableData.splice(oldIndex, 1)[0];
            copyTableData.splice(newIndex, 0, currentRow);
            selectTableState.data = copyTableData;
            handleEmit();
          },
        });
      } catch (e) {
        console.log(e);
      }
    };
    const handelClearSelect = () => {
      refs.chooseTable?.$children[0]?.clearSelection();
    };
    const setSelectedTable = (list) => {
      if (list.length) {
        let selectedList = deepClone(list);
        selectedList.forEach((e) => {
          tableState.data.some((t) => {
            if (e.formItemId === t.id) {
              t.required = e.required;
              selectTableState.data.push(t);
            }
            return e.formItemId === t.id;
          });
        });
        fieldList.value = deepClone(selectTableState.data);
      }
    };
    watch(
      () => dialogVisible.value,
      (flag) => {
        if (flag) {
          let selectedIds = [];
          selectTableState.data.forEach((e) => {
            selectedIds.push(e.id);
          });
          setTimeout(() => {
            refs["chooseTable"].$children[0].clearSelection();
          }, 100);
          tableState.data.forEach((e) => {
            if (selectedIds.includes(e.id)) {
              setTimeout(() => {
                refs["chooseTable"].$children[0].toggleRowSelection(e);
              }, 100);
            }
          });
        }
      }
    );
    const deleteField = (row) => {
      selectTableState.data = selectTableState.data.filter((e) => {
        return e.id !== row.id;
      });
      handleEmit();
    };
    const fieldTypeMap = {
      SelectMultiple: "多选",
      Select: "单选",
      Radio: "单选",
      TextArea: "文本",
    };
    onMounted(() => {
      reqList();
      createRowDrop()
    });
    return {
      isEn,
      dialogVisible,
      fieldList,
      tableState,
      selectTableState,
      myClassName: props.myClassName,
      changeSelect,
      handleEmit,
      handelClearSelect,
      setSelectedTable,
      deleteField,
    };
  },
};
</script>
<style lang="scss" scoped>
.choose-field-warp {
  padding-top: 10px;

  .selected-table-warp {
    width: 660px;
    padding: 20px;
    background: #fff;
    margin-top: 20px;
    border-radius: 4px;
    .handle-target-wrap {
      vertical-align: middle;
      background: #fff;
      .handle-target {
        display: inline-block;
        width: 20px;
        height: 15px;
        position: relative;
        top: 3px;
        cursor: pointer;
        .el-icon-s-operation {
          color: #333;
        }
      }
    }
  }
}
</style>
