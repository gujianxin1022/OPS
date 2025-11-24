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
            {{ $t("任务说明") }}:
            <span v-html="taskFormState.taskDesc"></span>
          </div>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-tabs
                class="userinfo-tabs"
                type="card"
                v-model="tabsState.leftTabsName"
              >
                <el-tab-pane :label="$t('用户信息')" name="userInfo"
                  ><div
                    class="left-tab-content"
                    :style="`height:${tabHeight - 100}px`"
                  >
                    <UserInfo
                      v-if="tabsState.taskId == item.id"
                      :taskId="tabsState.taskId"
                    /></div
                ></el-tab-pane>
                <el-tab-pane :label="$t('参考话术')" name="speechcraft"
                  ><div
                    class="left-tab-content"
                    :style="`height:${tabHeight - 100}px`"
                  >
                    <div
                      v-html="taskFormState.speechcraft"
                    ></div></div></el-tab-pane></el-tabs
            ></el-col>
            <el-col :span="14">
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
                      @setUploading="setUploading"
                      ref="taskContent"
                      v-if="
                        tabsState.taskId == item.id &&
                        taskFormState.id &&
                        taskFormState
                      "
                      :taskData="taskFormState"
                      :disabled="!isTaskOwner"
                    />
                    <p v-else>按照任务说明部分完成任务后提交</p>
                  </div>
                  <el-button
                    @click="changeTheFinish"
                    v-show="
                      taskFormState.completeConfigRespList.length >= 2 &&
                      isTaskOwner
                    "
                    type="text"
                    >{{ $t("异常完成") }}</el-button
                  >
                  <el-button
                    v-if="isTaskOwner"
                    :loading="submitLoading || uploading"
                    @click="submit()"
                    class="submit-btn"
                    type="primary"
                    >{{ uploading ? $t("上传中...") : $t("提交") }}</el-button
                  >
                </el-tab-pane>
              </el-tabs></el-col
            >
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { reactive, watch, ref, onMounted } from "@vue/composition-api";
import TaskContent from "./TaskContent.vue";
import UserInfo from "./UserInfo.vue";
import { deepClone } from "@/utils/handleData";
export default {
  components: { UserInfo, TaskContent },
  props: {
    rowData: {
      type: Object,
      default: {},
    },
    isTaskOwner: {
      type: Boolean,
      default: false,
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
      if (props.isTaskOwner) {
        const params = {
          pageNum: 1,
          pageSize: 100,
          parentUserId: props.rowData.parentUserId,
          statusProcess: 1,
          orderByColum: "createTime",
          sort: "asc",
        };
        try {
          const res = await root.$Api.taskManagement.reqMyTaskList(params);
          tabsState.tabList = res.list;
        } finally {
          tabsState.loading = false;
        }
      }
    };
    const taskFormState = ref(null);
    const reqTaskForm = async (taskId) => {
      tabsState.loading = true;
      taskFormState.value = null;
      try {
        const res = await root.$Api.taskManagement.reqTaskForm(taskId);
        taskFormState.value = res;
        if (!props.isTaskOwner && res) {
          tabsState.tabList = [
            {
              id: taskId,
              taskName: res.taskName,
            },
          ];
        }
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
    const submitLoading = ref(false);
    const submit = async () => {
      // 增加代码容错性
      const taskContentRef = refs.taskContent[0];
      if (!taskContentRef) {
        return;
      }
      // 引用组件内部的表单不一定存在
      const taskFormRef = taskContentRef.$refs.taskForm;
      if (taskFormRef) {
        await taskFormRef.validate();
      }
      const params = deepClone(taskContentRef.taskFormState);
      params.taskId = tabsState.taskId;
      const imgList = deepClone(taskContentRef.imgList);
      const recordList = deepClone(taskContentRef.recordList);
      params.contactRecordReqList = recordList.concat(imgList);
      if (params.contactRecordReqList && params.contactRecordReqList.length) {
        params.associatedRecord = 1;
      } else {
        params.associatedRecord = 2;
      }
      params.taskFollowReqList.forEach((e) => {
        delete e.fieldList;
        delete e.itemName;
        delete e.itemType;
        delete e.required;
        if (!Array.isArray(e.valueList)) {
          e.valueList = [e.valueList];
        }
      });

      try {
        submitLoading.value = true;
        await root.$Api.taskManagement.reqSubmitTask(params);
        root.$message.success(root.$t("操作成功"));
        emit("closeDrawer");
        emit("refresh");
      } finally {
        submitLoading.value = false;
      }
    };
    const changeTheFinish = async () => {
      refs.taskContent[0].setAbnormalFinish();
    };

    onMounted(() => {
      reqTabList();
    });
    const uploading = ref(false);
    const setUploading = (flag) => {
      uploading.value = flag;
    };
    return {
      tabsState,
      tabHeight: window.innerHeight - 150,
      taskFormState,
      submitLoading,
      uploading,
      submit,
      changeTheFinish,
      setUploading,
    };
  },
};
</script>

<style lang="scss">
.task-info-page {
  width: 1000px;
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
    .submit-btn {
      width: 100px;
      margin-top: 10px;
      float: right;
    }
  }
}
</style>
<style lang="scss">
.userinfo-tabs {
  .el-tabs__item {
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>
