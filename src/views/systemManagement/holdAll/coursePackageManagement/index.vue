<template>
  <div class="course-package-management">
    <el-form inline :model="searchState">
      <el-form-item :label="$t('课包ID')">
        <el-input
          clearable
          v-model.trim="searchState.packageId"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
      <el-form-item :label="$t('课包名称')">
        <el-input
          clearable
          v-model.trim="searchState.packageName"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
      <el-form-item :label="$t('关联产品')">
        <el-select
          clearable
          v-model="searchState.productId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in searchState.productList"
            :key="item.id"
            :label="isZh ? item.productName : item.productNameEn"
            :value="item.id"
          />
        </el-select>
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
            Per.handleButtonPer(
              'system.toolkit.coursePackageManagement.newCoursePackage'
            )
          "
        >
          {{ $t("新增") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column prop="id" :label="$t('课包ID')" width="140" />
      <el-table-column prop="name" :label="$t('课包名称')" min-width="150" />
      <el-table-column
        prop="productName"
        :label="$t('关联产品')"
        min-width="130"
      />
      <el-table-column prop="amount" :label="$t('课时数量')" width="100" />
      <el-table-column prop="currency" :label="$t('货币')" width="100" />
      <el-table-column prop="unitPrice" :label="$t('课时单价')" width="140" />
      <el-table-column prop="price" :label="$t('总价')" width="100" />
      <el-table-column :label="$t('类型')" width="110">
        <template slot-scope="{ row }">
          {{ $t(TYPE_MAP[row.type]) }}
        </template>
      </el-table-column>
      <el-table-column prop="payUrl" :label="$t('购课链接')" width="150" />
      <el-table-column :label="$t('是否显示')" width="190">
        <template slot-scope="{ row: { isShow } }">
          <span :style="{ color: IS_SHOW_COLOR_MAP[isShow] }">
            {{ $t(IS_SHOW_MAP[isShow]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" width="110">
        <template slot-scope="{ row: { status } }">
          <span :style="{ color: STATUS_COLOR_MAP[status] }">
            {{ $t(STATUS_MAP[status]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="area" :label="$t('地区')" />
      <el-table-column :label="$t('操作')" fixed="right" width="180">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleModify(row)"
            v-if="
              Per.handleButtonPer(
                'system.toolkit.coursePackageManagement.modifyClassPackage'
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
                'system.toolkit.coursePackageManagement.viewOperationRecord'
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
    <CoursePackageModify
      :id="coursePackageInfo.id"
      :visible.sync="coursePackageInfo.visible"
      @ok="handleCurrentChange(1)"
    />
    <OperationRecord
      :id="operationRecordInfo.id"
      :type="COURSE_PACKAGE"
      :visible.sync="operationRecordInfo.visible"
    />
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  computed,
  markRaw,
} from "@vue/composition-api";
import {
  STATUS_MAP,
  STATUS_LIST,
  TYPE_MAP,
  IS_SHOW_MAP,
  COURSE_PACKAGE,
  STATUS_COLOR_MAP,
  IS_SHOW_COLOR_MAP,
} from "../constants";
import CoursePackageModify from "./components/CoursePackageModify";
import OperationRecord from "../components/OperationRecord";
export default {
  name: "coursePackageManagement",
  components: {
    CoursePackageModify,
    OperationRecord,
  },
  setup(props, { root }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");

    const coursePackageInfo = reactive({ id: null, visible: false });
    const operationRecordInfo = reactive({ visible: false, id: null });

    // search
    const searchState = reactive({
      packageId: null,
      packageName: null,
      productId: null,
      status: null,

      productList: [],
    });
    const getEffectiveProductList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getEffectiveProductList();
      if (status !== 200 || code !== 200) return Promise.reject();
      searchState.productList = markRaw(data);
    };
    const handleAdd = () =>
      void Object.assign(coursePackageInfo, { id: null, visible: true });

    // table
    const tableState = reactive({ tableLoading: false, tableData: [] });
    const queryTableData = async () => {
      try {
        tableState.tableLoading = true;
        const { total, ...paginationParams } = paginationState;
        const { productList, ...searchParams } = searchState;
        const {
          status,
          data: { code, data },
        } = await root.$Api.systemManagement.getCoursePackageList({
          ...paginationParams,
          ...searchParams,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        tableState.tableData = markRaw(data.list);
        paginationState.total = data.total;
      } finally {
        tableState.tableLoading = false;
      }
    };
    const handleModify = ({ id }) =>
      void Object.assign(coursePackageInfo, { visible: true, id });
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

    onMounted(() => {
      getEffectiveProductList();
      queryTableData();
    });

    return {
      STATUS_LIST,
      TYPE_MAP,
      IS_SHOW_MAP,
      STATUS_MAP,
      COURSE_PACKAGE,
      STATUS_COLOR_MAP,
      IS_SHOW_COLOR_MAP,

      isZh,
      operationRecordInfo,
      coursePackageInfo,
      searchState,
      ...toRefs(tableState),
      ...toRefs(paginationState),

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
.course-package-management {
  padding: 16px;
}
</style>
