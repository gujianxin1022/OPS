<template>
  <div class="product-management">
    <el-form :inline="true" :model="searchState">
      <el-form-item :label="$t('产品ID')">
        <el-input
          clearable
          v-model.trim="searchState.productId"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
      <el-form-item :label="$t('产品名称')">
        <el-input
          clearable
          v-model.trim="searchState.productName"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
      <el-form-item :label="$t('状态')">
        <el-select
          clearable
          v-model="searchState.status"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in STATUS_LIST"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)">
          {{ $t("查询") }}
        </el-button>
        <el-button
          type="primary"
          @click="handleAdd"
          v-if="
            Per.handleButtonPer('system.toolkit.productManagement.newProducts')
          "
        >
          {{ $t("新增") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column prop="id" :label="$t('产品ID')" width="100" />
      <el-table-column
        prop="productName"
        :label="$t('产品名称(中文)')"
        min-width="160"
      />
      <el-table-column
        prop="productNameEn"
        :label="$t('产品名称(英文)')"
        min-width="160"
      />
      <el-table-column :label="$t('班级类型')" width="100">
        <template slot-scope="{ row }">
          {{ $t(CLASS_TYPE_MAP[row.classTypeId]) }}
        </template>
      </el-table-column>
      <el-table-column prop="currency" :label="$t('货币')" width="100" />
      <el-table-column prop="unitPrice" :label="$t('单价')" width="100" />
      <el-table-column prop="duration" :label="$t('时长')" width="100" />
      <el-table-column :label="$t('状态')" width="110">
        <template slot-scope="{ row: { status } }">
          <span :style="{ color: STATUS_COLOR_MAP[status] }">
            {{ $t(STATUS_MAP[status]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('是否显示')" width="190">
        <template slot-scope="{ row: { isShow } }">
          <span :style="{ color: IS_SHOW_COLOR_MAP[isShow] }">
            {{ $t(IS_SHOW_MAP[isShow]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('生效时间')" width="150">
        <template slot-scope="{ row }">
          {{ moment(row.validStartTime).format("YYYY-MM-DD HH:mm:ss") }} -
          {{ moment(row.validEndTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateUserName"
        :label="$t('最后操作人')"
        width="120"
      />
      <el-table-column :label="$t('更新时间')" width="140">
        <template slot-scope="{ row }">
          {{ moment(row.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="180" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleModify(row)"
            v-if="
              Per.handleButtonPer(
                'system.toolkit.productManagement.modifyProduct'
              )
            "
          >
            {{ $t("修改") }}
          </el-button>
          <el-button
            type="text"
            @click="handleViewRecord(row)"
            v-if="
              Per.handleButtonPer(
                'system.toolkit.productManagement.viewOperationRecord'
              )
            "
          >
            {{ $t("操作记录") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :disabled="tableLoading"
      :page-size="pageSize"
      :current-page="pageNum"
      @getCurrentPage="handleCurrentChange"
      @getPerPage="handleSizeChange"
    />
    <ProductModify
      :id="producInfo.id"
      :visible.sync="producInfo.visible"
      @ok="handleCurrentChange(1)"
    />
    <OperationRecord
      :id="operationRecordInfo.id"
      :type="PRODUCT"
      :visible.sync="operationRecordInfo.visible"
    />
  </div>
</template>

<script>
import moment from "moment";
import { onMounted, reactive, toRefs, markRaw } from "@vue/composition-api";
import {
  STATUS_MAP,
  STATUS_LIST,
  CLASS_TYPE_MAP,
  PRODUCT,
  IS_SHOW_MAP,
  STATUS_COLOR_MAP,
  IS_SHOW_COLOR_MAP,
} from "../constants";
import ProductModify from "./components/ProductModify";
import OperationRecord from "../components/OperationRecord";
export default {
  name: "productManagement",
  components: {
    ProductModify,
    OperationRecord,
  },
  setup(props, { root }) {
    const producInfo = reactive({ visible: false, id: null });
    const operationRecordInfo = reactive({ visible: false, id: null });

    // search
    const searchState = reactive({
      productId: null,
      productName: null,
      status: null,
    });
    const handleAdd = () =>
      void Object.assign(producInfo, { visible: true, id: null });

    // table
    const tableState = reactive({ tableLoading: false, tableData: [] });
    const queryTableData = async () => {
      try {
        tableState.tableLoading = true;
        const { total, ...paginationParams } = paginationState;
        const {
          status,
          data: { code, data },
        } = await root.$Api.systemManagement.getProductList({
          ...paginationParams,
          ...searchState,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.tableData = markRaw(data.list);
        paginationState.total = data.total;
      } finally {
        tableState.tableLoading = false;
      }
    };
    const handleModify = ({ id }) =>
      void Object.assign(producInfo, { visible: true, id });
    const handleViewRecord = ({ id }) =>
      void Object.assign(operationRecordInfo, { visible: true, id });

    // pagination
    const paginationState = reactive({ total: 0, pageNum: 1, pageSize: 50 });
    const handleCurrentChange = (val) => {
      paginationState.pageNum = val;
      queryTableData();
    };
    const handleSizeChange = (val) => {
      Object.assign(paginationState, { pageNum: 1, pageSize: val });
      queryTableData();
    };

    onMounted(queryTableData);

    return {
      STATUS_MAP,
      STATUS_LIST,
      CLASS_TYPE_MAP,
      IS_SHOW_MAP,
      STATUS_COLOR_MAP,
      IS_SHOW_COLOR_MAP,
      PRODUCT,
      producInfo,
      operationRecordInfo,
      searchState,
      ...toRefs(tableState),
      ...toRefs(paginationState),

      moment,
      handleAdd,
      handleModify,
      handleViewRecord,
      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.product-management {
  padding: 16px;
  .el-select,
  .el-input {
    width: 180px;
  }
}
</style>
