<template>
  <el-dialog
    custom-class="operation-record"
    width="980px"
    :title="$t(`操作记录`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-table v-loading="tableLoading" :data="tableData" height="50vh">
      <el-table-column prop="createUserName" :label="$t('操作人')" />
      <el-table-column prop="createTime" :label="$t('操作时间')">
        <template slot-scope="{ row }">
          {{ moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="content" :label="$t('操作详情')" />
    </el-table>
    <custom-pagination
      :total="total"
      :disbaled="tableLoading"
      :page-size="pageSize"
      :current-page="pageNum"
      @getCurrentPage="handleCurrentChange"
      @getPerPage="handleSizeChange"
    />
  </el-dialog>
</template>

<script>
import moment from "moment";
import { reactive, toRefs, watch, markRaw } from "@vue/composition-api";
import { PRODUCT, COURSE_PACKAGE } from "../constants";

export default {
  props: {
    visible: { type: Boolean, default: false },
    id: { type: Number, default: null },
    type: {
      type: Number,
      validator: (v) => [COURSE_PACKAGE, PRODUCT].includes(v),
      default: null,
    },
  },
  setup(props, { root, emit }) {
    watch(
      () => props.visible,
      (val) => void (val && queryTableData())
    );

    // table
    const tableState = reactive({ tableLoading: false, tableData: [] });
    const queryTableData = async () => {
      try {
        tableState.tableLoading = true;
        const { type, id } = props;
        const { total, ...params } = paginationState;
        const {
          status,
          data: { code, data },
        } = await root.$Api.systemManagement.getCoursePackageOperationLog({
          id,
          type,
          ...params,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.tableData = markRaw(data.list);
        paginationState.total = data.total;
      } finally {
        tableState.tableLoading = false
      }
    };

    // pagination
    const paginationState = reactive({ total: 0, pageNum: 1, pageSize: 50 });
    const handleCurrentChange = (val = 1) => {
      paginationState.pageNum = val;
      queryTableData();
    };
    const handleSizeChange = (val) => {
      Object.assign(paginationState, { pageNum: 1, pageSize: val });
      queryTableData();
    };

    const handleClose = () => {
      emit("update:visible", false);
      Object.assign(tableState, { tableData: [], tableLoading: false });
      Object.assign(paginationState, { total: 0, pageNum: 1, pageSize: 50 });
    };

    return {
      ...toRefs(tableState),
      ...toRefs(paginationState),

      moment,

      handleSizeChange,
      handleCurrentChange,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .operation-record {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0 !important;
}
</style>
