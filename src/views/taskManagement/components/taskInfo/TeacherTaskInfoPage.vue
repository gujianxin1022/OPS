<template>
  <!-- 我的任务详情 -->
  <div class="task-info-page">
    <el-tabs
      v-model="tabsState.taskId"
      type="border-card"
      v-loading="tabsState.loading"
    >
      <el-tab-pane
        v-for="item in tabsState.tabList"
        :key="item.id"
        :label="item.taskName"
        :name="`${item.id}`"
      >
        <div
          class="tab-content"
          v-if="taskFormState"
          :style="`height:${tabHeight}px`"
        >
          <div class="desc">
            {{ $t("任务说明") }}:<span v-html="taskFormState.taskDesc"></span>
          </div>
          <div class="time fr">
            {{ $t("任务创建时间") }}:
            {{ DateTimeUtils.dateClockTime(taskFormState.createTime) }}
          </div>
          <el-tabs type="card" v-model="tabsState.rightTabsName">
            <el-tab-pane :label="$t('任务内容')" name="taskInfo"
              ><div
                class="left-tab-content"
                :style="`height:${tabHeight - 100}px`"
              >
                <TaskContent
                  ref="taskContent"
                  v-if="
                    tabsState.taskId == item.id &&
                    taskFormState.id &&
                    taskFormState
                  "
                  :taskData="taskFormState"
                  :disabled="true"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { reactive, watch, ref, onMounted } from "@vue/composition-api";
import TaskContent from "./TaskContent.vue";
export default {
  components: { TaskContent },
  props: {
    rowData: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit, refs }) {
    const tabsState = reactive({
      loading: false,
      tabList: [],
      taskId: `${props.rowData.id}`,
      leftTabsName: "userInfo",
      rightTabsName: "taskInfo",
    });
    const reqTabList = async () => {
      const params = {
        pageNum: 1,
        pageSize: 100,
        tutorRealName: props.rowData.assignee.id,
        searchType: 2,
        statusProcess: 1,
        orderByColum: "createTime",
        sort: "asc",
      };
      try {
        const res = await root.$Api.taskManagement.reqTeacherTaskList(params);
        tabsState.tabList = res.list;
      } finally {
        tabsState.loading = false;
      }
    };
    const taskFormState = ref(null);
    const reqTaskForm = async (taskId) => {
      tabsState.loading = true;
      taskFormState.value = null;
      try {
        const res = await root.$Api.taskManagement.reqTaskForm(taskId);
        taskFormState.value = res;
      } finally {
        tabsState.loading = false;
      }
    };
    watch(
      () => tabsState.taskId,
      (taskId) => {
        reqTaskForm(taskId);
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      reqTabList();
    });
 
    return {
      tabsState,
      tabHeight: window.innerHeight - 150,
      taskFormState,
    };
  },
};
</script>

<style lang="scss" scoped>
.task-info-page {
  width: 800px;
  padding: 20px;
  border-radius: 8px;
  .tab-content {
    margin-top: 20px;
    .desc {
      color: #666666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .time {
      margin-top: 12px;
      font-size: 13px;
      color: #666666;
    }
    .left-tab-content {
      border: 1px solid #dfe4ed;
      border-top: none;
      border-radius: 0 0 4px 4px;
      padding: 20px;
      overflow: scroll;
    }
  }
}
</style>
