<template>
  <div v-loading="loading" class="red-list-container">
    <el-form :model="formState" inline :label-width="isEn ? '150px' : '130px'">
      <el-form-item :label="$t('用户id')">
        <el-input
          style="width: 200px"
          :placeholder="$t('请输入')"
          maxlength="30"
          v-model="formState.userId"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('消息类型')">
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.msgType"
        >
          <el-option
            v-for="item in msgTypes"
            :key="item.id"
            :label="
              isEn ? getTranslateText(item.name, languageList) : item.name
            "
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('任务范围')">
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.taskRange"
          style="width: 300px"
        >
          <el-option
            v-for="item in taskmain"
            :key="item.id"
            :label="
              isEn ? getTranslateText(item.name, languageList) : item.name
            "
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formState.taskRange === -1"
        :label="$t('任务')"
        prop="taskId"
      >
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.taskId"
          style="width: 300px"
          filterable
        >
          <el-option
            v-for="item in task"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('状态')">
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.status"
          style="width: 300px"
        >
          <el-option
            v-for="item in getRedUserStatus(isEn)"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button
            type="primary"
            @click="
              () => {
                (page = 1), queryTableData();
              }
            "
          >
            {{ $t("查询") }}
          </el-button>
          <el-button type="primary" @click="handleAdd()">
            {{ $t("新增") }}
          </el-button>
        </el-space>
      </el-form-item>
    </el-form>
    <BasicTable
      v-loading="loading"
      :column="columns"
      :data="data"
      :page="page"
      :total="total"
      :limit="limit"
      :pagination="true"
      @pagination="handlePaginationChange"
    />
    <AddRedUserDialog
      v-if="showAddRedUserDialog"
      :visible.sync="showAddRedUserDialog"
      :channelList="channelList"
      :languageList="languageList"
      @addCb="handleRefresh"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  toRefs,
  set,
  unref,
  watch,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import AddRedUserDialog from "./components/addRedUserDialog.vue";

import {
  getChannelUIData,
  getTaskImplementStatus,
  getRedList,
  changeRedStatus,
  getMsgTypes,
  getTaskListForRedUSer,
} from "@/api/notificationManagement";
import constants from "./data/constants";
const {
  getTranslateText,
  getRedUserStatus,
  taskRangeList,
  messageStatusColor,
  msgTypeFilter,
} = constants;
import { MESSAGE_STATUS } from "./data/enum";

export default defineComponent({
  components: {
    BasicTable,
    AddRedUserDialog,
  },
  setup(_, { root }) {
    const userName = JSON.parse(
      window.localStorage.getItem("userInfo")
    ).username;
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const showAddRedUserDialog = ref(false);
    const channelList = ref(null);
    const languageList = ref(null);
    const statusList = ref([]);
    const taskListObj = reactive({
      taskmain: [],
      task: [],
    });

    const formState = reactive({
      msgType: void 0,
      userId: void 0,
      taskRange: void 0,
      taskId: void 0,
      status: void 0,
    });
    const msgTypes = ref(null);

    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      data: [],
      columns: computed(() => [
        { width: "80", label: "ID", prop: "id" },
        { label: root.$t("用户id"), prop: "userId" },
        {
          label: root.$t("消息类型"),
          prop: "msgType",
          render: (_, { row }) => {
            return (
              <span>
                {msgTypeFilter(row.msgType, isEn.value, msgTypes.value)}
              </span>
            );
          },
        },
        {
          width: "200",
          label: root.$t("任务范围"),
          prop: "taskName",
          render: (_, { row }) => {
            return (
              <span>
                {unref(isEn)
                  ? getTranslateText(row.taskName, unref(languageList))
                  : row.taskName}
              </span>
            );
          },
        },
        {
          width: "150",
          label: root.$t("任务状态"),
          prop: "taskStatus",
          render: (_, { row }) => {
            return (
              <span>
                {unref(isEn)
                  ? getTranslateText(row.taskStatus, unref(languageList))
                  : row.taskStatus}
              </span>
            );
          },
        },
        { label: root.$t("创建人"), prop: "createUser" },
        {
          width: "150",
          label: root.$t("创建时间"),
          prop: "createTime",
          render: (_, { row }) => {
            return (
              <span>{root.DateTimeUtils.dateClockTime(row.createTime)}</span>
            );
          },
        },
        {
          label: root.$t("状态"),
          prop: "status",
          render: (_, { row }) => {
            const color =
              row.status === 1
                ? messageStatusColor[MESSAGE_STATUS.IN_PROGRESS]
                : messageStatusColor[MESSAGE_STATUS.CANCELLED];
            return (
              <span class="message-status" style={{ color }}>
                <div class="circle" style={{ background: color }} />
                {row.status === 1 ? root.$t("启用") : root.$t("禁用")}
              </span>
            );
          },
        },
        { label: root.$t("更新人"), prop: "updateUser" },
        {
          width: "150",
          label: root.$t("更新时间"),
          prop: "updateTime",
          render: (_, { row }) => {
            return (
              <span>{root.DateTimeUtils.dateClockTime(row.updateTime)}</span>
            );
          },
        },
        {
          width: "200",
          label: root.$t("操作"),
          fixed: "right",
          render: (_, { row }) => renderOperation(row),
        },
      ]),
    });

    const renderOperation = (row) => {
      return [
        row.status === 0 ? (
          <el-button
            type="text"
            onClick={() => handleRestart(row)}
            loading={row.reStartLoading}
          >
            {root.$t("启用")}
          </el-button>
        ) : (
          <el-button
            type="text"
            onClick={() => handleStop(row)}
            loading={row.stopLoading}
          >
            {root.$t("禁用")}
          </el-button>
        ),
      ];
    };

    const gettaskListObj = async () => {
      Object.assign(taskListObj, await getTaskListForRedUSer());
    };

    const getChannelList = async () => {
      channelList.value = await getChannelUIData();
    };

    const getLangList = () => {
      root.$Api.notificationManagement
        .getLanguageList()
        .then(({ data: { code, data }, status }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          languageList.value = data;
        })
        .catch(() => {});
    };

    const getStatusList = () => {
      getTaskImplementStatus()
        .then(({ status, data: { data, code } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          statusList.value = data;
        })
        .catch(() => {
          statusList.value = [];
        });
    };

    const queryTableData = async () => {
      if (formState.userId && isNaN(formState.userId)) {
        root.$notify.error(root.$t("用户id只能输入数字"));
        return;
      }
      const { page, limit } = tableState;
      tableState.loading = true;
      const params = {
        ...formState,
        taskId:
          formState.taskRange === -1 ? formState.taskId : formState.taskRange,
      };
      delete params.taskRange;
      const {
        status,
        data: { data, code },
      } = await getRedList(page, limit, params);
      if (status !== 200 || code !== 200) return Promise.reject();
      Object.assign(tableState, {
        data: data.list || [],
        total: data.total,
        loading: false,
      });
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const handleAdd = () => {
      showAddRedUserDialog.value = true;
    };

    const handleRefresh = () => {
      queryTableData();
      showAddRedUserDialog.value = false;
    };
    const handleRestart = async (row) => {
      await root.$confirm(root.$t("确定启用?"), root.$t("提示"), {
        type: "warning",
        center: true,
      });
      set(row, "reStartLoading", true);
      await changeRedStatus({
        id: row.id,
        updateUser: userName,
        status: row.status === 0 ? 1 : 0,
      }).finally(() => set(row, "reStartLoading", false));
      handlePaginationChange({ page: 1 });
    };
    const handleStop = async (row) => {
      await root.$confirm(root.$t("确定禁用?"), root.$t("提示"), {
        type: "warning",
        center: true,
      });
      set(row, "stopLoading", true);
      await changeRedStatus({
        id: row.id,
        updateUser: userName,
        status: row.status === 0 ? 1 : 0,
      }).finally(() => set(row, "stopLoading", false));
      handlePaginationChange({ page: 1 });
    };
    const getMsgTypeList = async () => {
      msgTypes.value = await getMsgTypes();
    };
    onMounted(() => {
      getLangList();
      getChannelList();
      getStatusList();
      queryTableData();
      getMsgTypeList();
      gettaskListObj();
    });

    return {
      isEn,
      ...toRefs(taskListObj),
      showAddRedUserDialog,
      handleRefresh,
      msgTypes,
      languageList,
      getRedUserStatus,
      ...toRefs(tableState),
      formState,
      getTranslateText,
      queryTableData,
      handlePaginationChange,
      handleAdd,
      handleRestart,
      handleStop,
      taskRangeList,
      msgTypeFilter,
    };
  },
});
</script>
<style lang="scss" scoped>
.red-list-container {
  padding: 10px 20px;
}
</style>
