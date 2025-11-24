<template>
  <div class="task-device-check-warp" v-loading="tableState.loading">
    <div v-if="tableState.showDeviceResult">
      <div class="search-warp">
        <FilterByTimePeriod
          ref="datePicker"
          @changeSelect="
            (timeArr) => {
              params.startTime = timeArr[0];
              params.endTime = timeArr[1];
            }
          "
        />
        <el-button
          type="primary"
          @click="
            () => {
              params.pageNum = 1;
              reqList();
            }
          "
          >{{ $t("查询") }}</el-button
        >
      </div>
      <div class="table-wrap" v-if="tableState.list && tableState.list.length">
        <el-table
          :border="false"
          :data="tableState.list"
          v-loading="loading"
          tooltip-effect="dark"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          :height="tableHeight"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('检测日期')"
            prop="time"
            width="90"
          >
          </el-table-column>
          <el-table-column align="center" :label="$t('设备信息')" width="210">
            <template slot-scope="scope">
              <div>
                <p>
                  {{ $t("设备类型") }}：<span>{{ scope.row.model }}</span>
                </p>
                <p>
                  {{ $t("操作系统") }}：<span
                    >{{ scope.row.osDesc }}, {{ scope.row.osVersion }}</span
                  >
                </p>
                <p v-if="scope.row.app != 6">
                  {{ $t("app版本号") }}：<span>{{ scope.row.appVersion }}</span>
                </p>
                <p>
                  {{ $t("sdk版本号") }}：<span>{{ scope.row.sdkVersion }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('检测入口')"
            :min-width="150"
          >
            <template slot-scope="scope">
              <span>{{ $t(scope.row.sourceDesc) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="checkPass"
            :label="$t('检测结果')"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <span style="color: #08af45" v-if="scope.row.checkPass">{{
                $t("deviceTestPass")
              }}</span>
              <span style="color: #f17575" v-else>{{ $t("异常") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('操作')"
            width="120"
            prop="name"
            type="expand"
          >
            <template slot-scope="scope">
              <div>
                <DeviceCheckResult :data="scope.row" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          class="pagination"
          v-if="tableState.list && tableState.list.length"
          :total="tableState.total"
          :current-page="params.pageNum"
          :pageSize="params.pageSize"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </div>
      <Empty v-else />
    </div>
    <DeviceCheckEmpty v-else 
      :data="deviceResdata"
    />
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import DeviceCheckResult from "@/views/taskManagement/components/deviceCheckResult.vue";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import DeviceCheckEmpty from "@/views/taskManagement/components/deviceCheckEmpty.vue";
import Empty from "@/components/Empty.vue";


export default {
  components: {
    DeviceCheckResult,
    FilterByTimePeriod,
    DeviceCheckEmpty,
    Empty
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const params = reactive({
      endTime: "",
      startTime: "",
      pageNum: 1,
      pageSize: 10,
     
    });

    if (props.data.parentUserId) {
      params.parentId = props.data.parentUserId;
    }
    else {
      params.userId = props.data.userId;
    }

    const tableState = reactive({
      loading: false,
      list: [],
      total: 0,
      showDeviceResult: false,
    });

    const reqList = async () => {
      try {
        tableState.loading = true;
        let res = await root.$Api.taskManagement.reqUserDeviceCheckResult(
          params
        );
        console.log(res);
        tableState.list = res.data;
        tableState.total = res.total - 0;
        if (!tableState.showDeviceResult) {
          tableState.showDeviceResult = tableState.list && tableState.list.length > 0;
        }
      } finally {
        tableState.loading = false;
      }
    };
    const taskResultState = reactive({
      data: null,
      taskName: "",
      showTaskResult: false,
      loading: false,
    });

    const handleCollapse = async (val, isShow) => {
      if (!val) return;
      taskResultState.data = val;
      taskResultState.showTaskResult = isShow;
    };
    const getCurrentPage = (page) => {
      console.log('page')
      params.pageNum = page;
      reqList();
    };

    const getPerPage = (perPage) => {
      params.pageSize = perPage;
      reqList();
    };
    onMounted(async () => {
      await reqList();
    });
    return {
      isEn,
      tableState,
      taskResultState,
      params,
      reqList,
      handleCollapse,
      getCurrentPage,
      getPerPage,
      deviceResdata: props.data,
      tableHeight: window.innerHeight - 200 || 300,
    };
  },
};
</script>

<style scoped lang="scss">
.task-device-check-warp {
  width: 800px;
  height: 100%;
  padding: 0 20px 20px 20px;
  // position: relative;
  .search-warp {
    margin-bottom: 10px;
  }
  // .collapse-text {
  //   float: right;
  //   color: #333;
  //   font-weight: 400;
  //   margin-right: 10px;
  // }
}
</style>
