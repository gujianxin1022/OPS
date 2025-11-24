<template>
  <div class="base-reason">
    <screen-wrapper @search="pageNum = 1; getReasonList()">
      <el-form inline :model="formData" :label-width="isZh ? '85px' : '125px'">
        <el-form-item label="id">
          <el-input clearable v-model="formData.id" :placeholder="$t('请输入')" />
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-select clearable v-model="formData.status" :placeholder="$t('请选择')">
            <el-option
              v-for="item in STATUS_LIST"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('类型')">
          <el-select clearable v-model="formData.type" :placeholder="$t('请选择')">
            <el-option
              v-for="item in costTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('使用方式')">
          <el-select clearable v-model="formData.classify" :placeholder="$t('请选择')">
            <el-option
              v-for="item in CLASSIFY_LIST"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('归属部门')">
          <el-select clearable v-model="formData.postId" :placeholder="$t('请选择')">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('成本中心')">
          <el-cascader
            clearable
            v-model="formData.costCenter"
            :props="{ checkStrictly: true }"
            :options="costList"
            :placeholder="$t('请选择')"
          />
        </el-form-item>
        <el-form-item :label="$t('创建人')">
          <el-input clearable v-model="formData.createUserName" :placeholder="$t('请输入')" />
        </el-form-item>
      </el-form>
    </screen-wrapper>
    <div class="tr m15">
      <el-button
        type="primary"
        @click="newReasonVsible = true"
        v-if="
          (type === COIN &&
            Per.handleButtonPer(
              'financeMT.costCenter.causeManagement.addCoinReason'
            )) ||
          (type === CLASS_HOUR &&
            Per.handleButtonPer(
              'financeMT.costCenter.causeManagement.addClassHoursReason'
            ))
        "
      >
        {{ $t("新增原因") }}
      </el-button>
    </div>
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column prop="id" label="id" />
      <el-table-column :label="$t('状态')">
        <template slot-scope="{ row }">
          <div :style="{ color: row.status === ON_LINE ? '#13ce66' : '#ff4949' }">
            {{ $t(STATUS_MAP[row.status]) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('类型')" :prop="`typeName${langSuffix}`" />
      <el-table-column :label="$t('使用方式')">
        <template slot-scope="{ row }">{{ $t(CLASSIFY_MAP[row.classify]) }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :label="$t('归属部门')" :prop="`postName${langSuffix}`" />
      <el-table-column show-overflow-tooltip :label="$t('一级成本')" :prop="`costFirstName${langSuffix}`" />
      <el-table-column show-overflow-tooltip :label="$t('二级成本')" :prop="`costSecondName${langSuffix}`" />
      <el-table-column :label="$t('原因详情')">
        <template slot-scope="{ row }">
          <el-button
            style="width: 100%"
            type="text"
            @click="reasonDetails = row; reasonDetailsVisible = true"
          >
            <div class="text-overflow">{{ row[`describe${langSuffix}`] }}</div>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" :label="$t('创建人')" />
      <el-table-column :label="$t('operation')" width="100">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            :loading="row.loading"
            :type="row.status === ON_LINE ? 'danger' : 'success'"
            @click="handleUpdateStatus(row)"
          >
            {{ $t(STATUS_MAP[row.status === ON_LINE ? OFF_LINE : ON_LINE]) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      @getCurrentPage="(val) => ((pageNum = val), getReasonList())"
      @getPerPage="(val) => ((pageNum = 1), (pageSize = val), getReasonList())"
    />
    <NewReason :visible.sync="newReasonVsible" :type="type" @ok="getReasonList" />
    <ReasonDetails :visible.sync="reasonDetailsVisible" :details="reasonDetails" />
  </div>
</template>

<script>
import {
  set,
  computed,
  onMounted,
  reactive,
  toRefs,
  unref,
} from "@vue/composition-api";
import {
  getCoinReasonList,
  getPoinReasonList,
  updateCoinReasonStatus,
  updatePoinReasonStatus,
} from "@/api/financeManagement";
import {
  ON_LINE,
  OFF_LINE,
  STATUS_MAP,
  STATUS_LIST,
  CLASSIFY_MAP,
  CLASSIFY_LIST,
  COIN,
  CLASS_HOUR,
} from "./constants";
import { useOptions } from "./useOptions";

import NewReason from "./NewReason.vue";
import ReasonDetails from "./ReasonDetails.vue";

const API_MAP = {
  [COIN]: {
    updateReasonStatus: updateCoinReasonStatus,
    getReasonList: getCoinReasonList
  },
  [CLASS_HOUR]: {
    updateReasonStatus: updatePoinReasonStatus,
    getReasonList: getPoinReasonList
  }
}
export default {
  name: "baseReason",
  components: { NewReason, ReasonDetails },
  props: {
    type: { type: String, default: null /* coin: 积分；classHour: 课时 */ },
  },
  setup(props, { root }) {
    const api = computed(() => API_MAP[props.type]);
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");
    const langSuffix = computed(() => unref(isZh) ? "Zh" : "En");

    const { departmentList, costList, costTypeList } = useOptions();

    const newReasonState = reactive({ newReasonVsible: false });
    const ReasonDetailsState = reactive({ reasonDetailsVisible: false, reasonDetails: {} });
    const formData = reactive({
      id: null,
      status: null,
      type: null,
      classify: null,
      postId: null,
      costCenter: [],
      createUserName: null,
    });
    const paginationState = reactive({ total: 0, pageNum: 1, pageSize: 50 });
    const tableState = reactive({ tableData: [], tableLoading: false });

    const handleUpdateStatus = async (row) => {
      try {
        await root.$confirm(
          root.$t(row.status === ON_LINE ? root.$t("确定要下线吗") : root.$t("确定要上线吗")),
          root.$t("提示"),
          {
            cancelButtonText: root.$t("取消"),
            confirmButtonText: root.$t("确定"),
            type: "warning",
          }
        );
        set(row, "loading", true)
        const { id, username } = JSON.parse(localStorage.userInfo);
        const futureStatus = row.status === ON_LINE ? OFF_LINE : ON_LINE;
        const { status, data: { code } } = await unref(api).updateReasonStatus({
          id: row.id,
          status: futureStatus,
          updateUserId: id,
          updateUserName: username,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        row.status = futureStatus;
        root.$message.success(root.$t('操作成功'))
      } finally {
        set(row, "loading", false)
      }
    };
    const getReasonList = async () => {
      tableState.tableLoading = true;
      const { costCenter: [costFirstId, costSecondId],createUserName, ...rest } = formData;
      const { status, data: { code, data: { list, total } } } = await unref(api).getReasonList({
        ...rest,
        createUserName: createUserName ? createUserName : null,
        costFirstId,
        costSecondId,
        pageNum: paginationState.pageNum,
        pageSize: paginationState.pageSize,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      paginationState.total = total;
      tableState.tableData = list;
      tableState.tableLoading = false;
    };

    onMounted(getReasonList);

    return {
      COIN,
      CLASS_HOUR,
      STATUS_MAP,
      CLASSIFY_MAP,
      STATUS_LIST,
      CLASSIFY_LIST,
      ON_LINE,
      OFF_LINE,

      isZh,
      langSuffix,
      costList,
      departmentList,
      costTypeList,
      formData,

      ...toRefs(newReasonState),
      ...toRefs(ReasonDetailsState),
      ...toRefs(paginationState),
      ...toRefs(tableState),

      getReasonList,
      handleUpdateStatus,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-reason {
  .el-form-item {
    margin-right: 0px;
  }
}
</style>
