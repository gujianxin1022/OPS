<template>
  <div class="notification-list">
    <header>
      <el-form
        :model="formState"
        inline
        :label-width="isEn ? '150px' : ''"
      >
        <el-form-item :label="$t('消息名称')">
          <el-input
            clearable
            v-model="formState.name"
            :placeholder="$t('请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('用户角色')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.businessId"
          >
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="isEn ? getTranslateText(item.name, languageList) :item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('通知方式')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.channelId"
          >
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="isEn ? getTranslateText(item.name, languageList) :item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('通知时机')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.triggerType"
          >
            <el-option
              v-for="item in getSendTimes(isEn)"
              :key="item.value"
              :label="isEn ? getTranslateText(item.name, languageList) :item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('通知状态')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.status"
          >
            <el-option
              v-for="item in messageStatusList"
              :key="item.value"
              :label="isEn ? getTranslateText(item.label, languageList) :item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :style="{ marginLeft: isEn ? '80px' : '70px' }">
          <div class="search">
            <el-button @click="handlePaginationChange({ page: 1 })">
              {{ $t("查询") }}
            </el-button>
            <el-button
              type="primary"
              @click="handleNewMessage"
            >
              {{ $t("新建消息") }}
            </el-button>
            <el-button
              type="primary"
              @click="handleShowHistory('clearInfo')"
            >
              {{ $t("执行历史") }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </header>
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
    <TaskImplementData
      v-if="isShowTaskImplementDialog"
      :visible.sync="isShowTaskImplementDialog"
      :currentTask="currentTask"
      :languageList="languageList"
    />
    <InputUserDialog
      v-if="isShowTestUserDialog"
      :visible.sync="isShowTestUserDialog"
      :currentTask="currentTask"
      @showHistoryAllTask="handleShowTask"
    />
    <TaskAllData
      v-if="isShowAllTaskDialog"
      :visible.sync="isShowAllTaskDialog"
      :testMsgInfo="testMsgInfo"
    />
  </div>
</template>
<script>
import {
  reactive,
  computed,
  toRefs,
  unref,
  set,
  ref,
  onMounted,
  onActivated,
} from "@vue/composition-api";
import { MESSAGE_STATUS } from "./data/enum";
import {
  getTaskList,
  gerTargetUserTypes,
  auditTask,
  getChannelUIData,
} from "@/api/notificationManagement";

import BasicTable from "@/components/table/basic-table";
import constants from "./data/constants";
import TaskImplementData from './components/taskImplementData.vue'
import InputUserDialog from './components/testTaskDialog.vue'
import TaskAllData from './components/taskAllDataDialog.vue'
const {
  messageStatusColor,
  messageStatusList,
  getSendTimes,
  getTranslateText
} = constants;

const { username: opsUserName } = JSON.parse(localStorage.userInfo);
// 测试消息发送与消息查看
const msgTextAndCheck = (currentTask) => {
  const isShowTestUserDialog = ref(false)
  const isShowAllTaskDialog = ref(false)
  const testMsgInfo = reactive({
    disabled: null,
    id: null
  })
  const handleShowHistory = (type) => {
    // 重置状态
    if (type) {
      Object.assign(testMsgInfo, {
        disabled: null,
        id: null
      })
    }
    isShowAllTaskDialog.value = true
  }
  const handleTestSendMsg = async (row) => {
    currentTask.value = row
    isShowTestUserDialog.value = true
  }
  const handleShowTask = (data) => {
    Object.assign(testMsgInfo, data)
    console.log("🚀 ~ file: notificationList.vue ~ line 171 ~ handleShowTask ~ testMsgInfo", testMsgInfo)
    handleShowHistory()
  }

  return {
    testMsgInfo,
    isShowTestUserDialog,
    isShowAllTaskDialog,

    handleShowTask,
    handleTestSendMsg,
    handleShowHistory,
  }
}
export default {
  components: {
    BasicTable,
    TaskAllData,
    TaskImplementData,
    InputUserDialog,
  },
  setup (props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const optionsState = reactive({ businessList: [], channelList: [] });
    const currentTask = ref(null)
    const languageList = ref(null)

    const formState = reactive({
      name: "",
      businessId: void 0,
      channelId: void 0,
      triggerType: void 0,
      status: void 0,
    });

    const isShowTaskImplementDialog = ref(false)
    const {
      testMsgInfo,
      isShowTestUserDialog,
      isShowAllTaskDialog,
      handleShowTask,
      handleTestSendMsg,
      handleShowHistory
    } = msgTextAndCheck(currentTask)
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 50,
      total: 0,
      data: [],
      columns: computed(() => [
        { width: "80", label: "ID", prop: "id" },
        {
          label: root.$t("消息名称"),
          render: (_, { row }) => (
            <div
              class="text-overflow message-name"
              title={row.name}
              onClick={() => handleCheck(row)}
            >
              {row.name}
            </div>
          ),
        },
        {
          width: "100", label: root.$t("目标用户"), render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.targetUser, languageList.value) : row.targetUser}</span>)
          }
        },
        {
          width: "150", label: root.$t("通知方式"), render: (_, { row }) => {
            return (<span>{getMutiStr(row.channelName, unref(isEn))}</span>)
          }
        },
        {
          label: root.$t("通知时机"), render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.trigger, languageList.value) : row.trigger}</span>)
          }
        },
        {
          width: "200", label: root.$t("发送时间"), render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.sendTimeDesc, languageList.value) : row.sendTimeDesc}</span>)
          }
        },
        {
          width: "100",
          label: root.$t("状态"),
          render: (_, { row }) => {
            const color = messageStatusColor[row.status];
            return (
              <span class="message-status" style={{ color }}>
                <div class="circle" style={{ background: color }} />
                {root.$t(row.statusName)}
              </span>
            );
          },
        },
        { label: root.$t("更新人"), prop: "updateUser" },
        {
          width: unref(isEn) ? "230" : "200",
          fixed: "right",
          label: root.$t("操作"),
          render: (_, { row }) => renderOperation(row),
        },
      ]),
    });

    const renderOperation = (row) => {
      const { PENDING_REVIEW, TO_BE_SENT, IN_PROGRESS } = MESSAGE_STATUS;
      return [
        {
          status: [PENDING_REVIEW, TO_BE_SENT, IN_PROGRESS],
          element: (
            <span class="mr10">
              <el-button
                type="text"
                onClick={() => handleCancel(row)}
                loading={row.cancelLoading}
              >
                {root.$t("取消")}
              </el-button>
            </span>
          ),
        },
        {
          status: [PENDING_REVIEW, TO_BE_SENT],
          element: (
            <el-button type="text" onClick={() => handleEdit(row)}>
              {root.$t("编辑")}
            </el-button>
          ),
        },
        {
          status: [PENDING_REVIEW],
          element: (
            <el-button
              type="text"
              onClick={() => handlePass(row)}
              loading={row.passLoading}
            >
              {root.$t("通过")}
            </el-button>
          ),
        },
        {
          status: [PENDING_REVIEW, TO_BE_SENT, IN_PROGRESS],
          element: (
            <el-button
              type="text"
              onClick={() => handleTestSendMsg(row)}
              loading={row.sendLoading}
            >
              {root.$t("测试")}
            </el-button>
          ),
        },
        {
          status: [TO_BE_SENT],
          element: (
            <span>
              <el-button
                type="text"
                onClick={() => handleSend(row)}
                loading={row.sendLoading}
              >
                {root.$t("发送")}
              </el-button>
            </span>
          ),
        }
      ].reduce(
        (a, b) => (b.status.includes(row.status) ? [...a, b.element] : a),
        []
      ).concat([<el-button
        type="text"
        onClick={() => handleShowImplementDialog(row)}
        loading={row.sendLoading}
      >
        {root.$t('执行历史')}
      </el-button>]);
    };

    const handleCheck = (row) => {
      root.$router.push({
        name: "notification",
        query: { id: row.id, isRead: true, name: row.name },
      });
    };

    const handleCancel = async (row) => {
      await root.$confirm(
        root.$t("取消后，将暂停消息发送，已发送的消息无影响，禁用后不可恢复。"),
        root.$t("确认取消？"),
        { type: "warning", center: true }
      );
      set(row, "cancelLoading", true);
      await auditTask({ id: row.id, status: 30, opsUserName }).finally(() =>
        set(row, "cancelLoading", false)
      );
      handlePaginationChange({ page: 1 });
    };

    const handlePass = async (row) => {
      await root.$confirm(
        root.$t("通过后，将按配置的规则进行下发，是否继续？"),
        root.$t("审核通过？"),
        { type: "warning", center: true }
      );
      set(row, "passLoading", true);
      await auditTask({ id: row.id, status: 10, opsUserName }).finally(() =>
        set(row, "passLoading", false)
      );
      handlePaginationChange({ page: 1 });
    };

    const handleEdit = (row) => {
      root.$router.push({
        name: "notification",
        query: { id: row.id, triggerType: row.triggerType, name: row.name },
      });
    };

    const handleShowImplementDialog = (row) => {
      currentTask.value = row
      isShowTaskImplementDialog.value = true
    }
    const handleSend = async (row) => {
      await root.$confirm(
        root.$t("确认后，将把消息立即发送给用户，是否继续？"),
        root.$t("立即发送？"),
        { type: "warning", center: true }
      );
      set(row, "sendLoading", true);
      await auditTask({ id: row.id, status: 20, opsUserName }).finally(() =>
        set(row, "sendLoading", false)
      );
      handlePaginationChange({ page: 1 });
    };
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const handleNewMessage = () => {
      root.$router.push({ name: "notification" });
    };

    const queryTableData = async () => {
      const { page, limit } = tableState;
      tableState.loading = true;
      const { total, list } = await getTaskList(page, limit, formState);
      Object.assign(tableState, { total, data: list, loading: false });
    };

    const getChannelList = async () => {
      optionsState.channelList = await getChannelUIData();
    };

    const getBusinessList = async () => {
      optionsState.businessList = await gerTargetUserTypes();
    };

    const getMutiStr = (str, isEn) => {
      if (!str) return
      const arr = str.replaceAll(',', '，').split('，')
      return arr.map(t => isEn ? getTranslateText(t, languageList.value) : t).join(',')
    }

    onActivated(() => {
      const { isLoad } = root.$route.query
      if (isLoad) {
        queryTableData();
      }
    });

    const getLangList = () => {
      root.$Api.notificationManagement.getLanguageList().then(({ data: { code, data }, status }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        languageList.value = data
      }).catch(() => { })
    }

    onMounted(() => {
      getLangList();
      getBusinessList();
      getChannelList();
      queryTableData();
    });

    return {
      unref,

      isEn,
      languageList,
      currentTask,
      testMsgInfo,
      isShowTaskImplementDialog,
      isShowTestUserDialog,
      isShowAllTaskDialog,
      messageStatusList,
      getSendTimes,
      getTranslateText,
      getMutiStr,
      formState,
      ...toRefs(tableState),
      ...toRefs(optionsState),

      handlePaginationChange,
      handleNewMessage,
      handleShowTask,
      handleShowHistory,
      handleShowImplementDialog,

    };
  },
};
</script>
<style lang="scss" scoped>
.notification-list {
  padding: 24px;
  .el-input,
  .el-select {
    width: 190px;
  }
  ::v-deep .search {
    display: flex;
    width: 200px;
    padding-right: 10px;
    .el-button--default {
      width: 80px;
    }
    .el-button--primary {
      flex: 1;
    }
  }
  ::v-deep .message-name {
    color: #7580e5;
    cursor: pointer;
  }
  ::v-deep .message-status {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    .circle {
      margin-right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
  ::v-deep .el-table__row {
    .el-button {
      padding: 0;
    }
  }
}
</style>
