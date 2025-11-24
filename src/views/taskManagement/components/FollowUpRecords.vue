<template>
  <div class="follow-up-warp" v-loading="tableState.loading">
    <div class="search-warp">
      <FilterByTimePeriod
        ref="datePicker"
        @changeSelect="
          (timeArr) => {
            params.completionTimeStart = timeArr[0];
            params.completionTimeEnd = timeArr[1];
          }
        "
      />
      <FilterByLaAccount
        @change="
          (user) => {
            params.operatorId = user.id;
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
    <div class="list" v-if="tableState.list && tableState.list.length">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item
          v-for="item in tableState.list"
          :key="item.id"
          :name="item.id"
        >
          <template slot="title">
            <div class="top-info">
              <el-tag class="mr10" type="success" effect="plain">
                {{ item.taskName }}
              </el-tag>
              <span class="ml10">{{ item.studentName }}</span>
              <span class="ml10">{{ item.coursePackageName }}</span>
              <span class="ml10">
                {{ DateTimeUtils.dateClockTime(item.timeProcessed) }}
              </span>
              <span class="ml10">{{ item.processorName }}</span>
            </div>
          </template>
          <div v-loading="taskResultState.loading">
            <CompletedTaskResult
              v-if="taskResultState.showTaskResult && taskResultState.data"
              :data="taskResultState.data"
              :visible.sync="taskResultState.showTaskResult"
              :taskName="taskResultState.taskName"
            />
            <div v-else class="no-data">{{ $t("暂无数据") }}</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <Empty v-else />
    <div class="pagination" v-if="tableState.list && tableState.list.length">
      <custom-pagination
        :total="tableState.total"
        :current-page="params.pageNum"
        :pageSize="10"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import CompletedTaskResult from "@/views/taskManagement/components/CompletedTaskResult.vue";
import Empty from "@/components/Empty.vue";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByLaAccount from "@/components/FilterItem/UserDimensionFilter/FilterByLaAccount";

export default {
  components: {
    CompletedTaskResult,
    Empty,
    FilterByTimePeriod,
    FilterByLaAccount,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const params = reactive({
      completionTimeEnd: "",
      completionTimeStart: "",
      operatorId: "",
      pageNum: 1,
      pageSize: 10,
      parentUserId: root.$route.query.parentUserId,
      studentUserId: root.$route.query.studentId,
    });
    const tableState = reactive({
      loading: false,
      list: [],
      total: 0,
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        const res = await root.$Api.taskManagement.reqUserCompletedTaskResult(
          params
        );
        tableState.list = res.list;
        tableState.total = res.total;
      } finally {
        tableState.loading = false;
      }
    };
    const activeNames = ref("1");
    const taskResultState = reactive({
      data: null,
      taskName: "",
      showTaskResult: false,
      loading: false,
    });

    const handleChange = async (val) => {
      if (!val) return;
      try {
        taskResultState.data = null;
        taskResultState.loading = true;
        const res = await root.$Api.taskManagement.reqCompletedTaskResult({
          taskId: val,
        });
        taskResultState.data = res;
        taskResultState.showTaskResult = true;
      } finally {
        taskResultState.loading = false;
      }
    };
    const getCurrentPage = (page) => {
      params.pageNum = page;
      reqList();
    };

    const getPerPage = (perPage) => {
      params.pageSize = perPage;
      reqList();
    };
    onMounted(async () => {
      await reqList();
      /* 默认展开第一个任务 */
      if (tableState.list.length) {
        activeNames.value = tableState.list[0].id;
        handleChange(activeNames.value);
      }
    });
    return {
      isEn,
      activeNames,
      tableState,
      taskResultState,
      params,
      reqList,
      handleChange,
      getCurrentPage,
      getPerPage,
    };
  },
};
</script>

<style scoped lang="scss">
.follow-up-warp {
  width: 800px;
  height: 100%;
  padding: 0 20px;
  position: relative;
  .search-warp {
    margin-bottom: 10px;
  }
  .list {
    overflow-y: scroll;
    height: calc(100% - 160px);
  }
  .top-info {
    font-size: 14px;
    width: 100%;
  }
  .bottom-text {
    line-height: 20px;
  }
  .collapse-text {
    float: right;
    color: #333;
    font-weight: 400;
    margin-right: 10px;
  }
  .no-data {
    color: #ccc;
    text-align: center;
  }
  .pagination {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
