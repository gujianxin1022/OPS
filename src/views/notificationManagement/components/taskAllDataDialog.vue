<template>
  <el-dialog
    @close="handleClose"
    :title="$t('发送用户列表')"
    :visible.sync="visible"
    center
    width="1200px"
    :top="'5vh'"
    append-to-body
  >
    <header>
      <el-form :model="formState" inline :label-width="isEn ? '120px' : '100px'">
        <el-form-item :label="$t('用户id')">
          <el-input
            type="text"
            :placeholder="$t('请输入内容')"
            v-model="formState.userId"
            :disabled="testMsgInfo.disabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('模版ID')">
          <el-input
            type="text"
            :placeholder="$t('请输入内容')"
            v-model="formState.templateId"
            :disabled="testMsgInfo.disabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('任务id')">
          <el-input
            type="text"
            :placeholder="$t('请输入内容')"
            v-model="formState.taskId"
            :disabled="testMsgInfo.disabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('消息ID')">
          <el-input
            type="text"
            :placeholder="$t('请输入内容')"
            v-model="formState.id"
            :disabled="testMsgInfo.disabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('日期')">
          <el-date-picker
            style="width: 192px"
            v-model="formState.time"
            type="date"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.status"
          >
            <el-option
              v-for="item in statusList"
              :key="item.code"
              :label="
                isEn ? getTranslateText(item.name, languageList) : item.name
              "
              :value="item.code"
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
              :label="
                isEn ? getTranslateText(item.name, languageList) : item.name
              "
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mq消息ID')">
          <el-input
            type="text"
            :placeholder="$t('请输入内容')"
            v-model.trim="formState.eventMsgId"
            :disabled="testMsgInfo.disabled"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            @click="handlePaginationChange({ page: 1 })"
          >
            {{ $t("搜索") }}
          </el-button>
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
  </el-dialog>
</template>

<script>
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
} from "@vue/composition-api";
import {
  getTaskAllList,
  getChannelUIData,
  getTaskImplementStatus,
} from "@/api/notificationManagement";
import BasicTable from "@/components/table/basic-table";
import constants from "../data/constants";
import { handleLanguageList } from "../hook";
const { languageList } = handleLanguageList();
const { getTranslateText } = constants;
// 获取任务发送状态
const handleGetTaskStatus = () => {
  const statusList = ref([]);
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
  return {
    statusList,
    getStatusList,
  };
};
// 获取通知方式渠道来源
const handleGetChannel = () => {
  const channelList = ref([]);
  const getChannelList = async () => {
    channelList.value = await getChannelUIData();
  };
  return {
    channelList,
    getChannelList,
  };
};
// 表单信息
const handleTableInfo = (root, formState, isEn) => {
  function getTime(date) {
    return +new Date(new Date(date).toLocaleDateString());
  }
  const getId = (id) => {
    id = (id + "").substring(0, 6) + "...";
    return id;
  };
  const handleJump = (url) => {
    window.open(`/notificationMt/privateLog?uri=${url}`, "__blank");
  };
  const tableState = reactive({
    loading: false,
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    columns: computed(() => [
      {
        width: "80",
        label: "ID",
        prop: "_id",
        render: (_, { row }) => (
          <el-popover placement="top-start" trigger="hover">
            <span>{row._id}</span>
            <el-button
              slot="reference"
              type="text"
              onClick={() => handleJump(row.logUrl)}
            >
              {getId(row._id)}
            </el-button>
          </el-popover>
        ),
      },
      {
        label: root.$t("标题"),
        width: "180",
        render: (_, { row }) => {
          return <span>{row.title ? row.title : row.content}</span>;
        },
      },
      { label: root.$t("用户角色"), prop: "businessName" },
      { label: root.$t("任务id"), prop: "taskId" },
      { label: root.$t('模版ID'), prop: "templateId" },
      { label: root.$t("接收人ID"), prop: "userId" },
      {
        label: root.$t("类型&通道"),
        render: (_, { row }) => {
          return (
            <span>
              <span style={{ display: "inline-block" }}>
                {unref(isEn)
                  ? getTranslateText(row.pushTypeName, languageList)
                  : row.pushTypeName}
              </span>
              <span style={{ display: "inline-block" }}>
                {row.channelName}
              </span>
            </span>
          );
        },
      },
      {
        label: root.$t("发送时间"),
        render: (_, { row }) => {
          return (
            <span>
              <span style={{ display: "inline-block" }}>
                {row.sendDate.split(" ")[0]}
              </span>
              <span style={{ display: "inline-block" }}>
                {row.sendDate.split(" ")[1]}
              </span>
            </span>
          );
        },
      },
      {
        label: root.$t("状态"),
        render: (_, { row }) => {
          return (
            <span>
              {unref(isEn)
                ? getTranslateText(row.statusName, languageList)
                : row.statusName}
            </span>
          );
        },
      },
      {
        label: root.$t("第三方回调时间"),
        render: (_, { row }) => {
          return (
            <span>
              <span style={{ display: "inline-block" }}>
                {row.callbackTime.split(" ")[0]}
              </span>
              <span style={{ display: "inline-block" }}>
                {row.callbackTime.split(" ")[1]}
              </span>
            </span>
          );
        },
      },
      {
        label: root.$t("用户点击时间"),
        render: (_, { row }) => {
          return (
            <span>
              <span style={{ display: "inline-block" }}>
                {row.clickTime.split(" ")[0]}
              </span>
              <span style={{ display: "inline-block" }}>
                {row.clickTime.split(" ")[1]}
              </span>
            </span>
          );
        },
      },
    ]),
  });
  // 获取数据
  const queryTableData = async () => {
    const { page, limit } = tableState;
    tableState.loading = true;
    Object.assign(formState, {
      searchTime: getTime(formState.time) ? getTime(formState.time) : "",
    });
    const { total, list } = await getTaskAllList(page, limit, formState);
    Object.assign(tableState, { total, data: list || [], loading: false });
  };
  // 请求数据
  const handlePaginationChange = (info) => {
    Object.assign(tableState, info);
    queryTableData();
  };

  return {
    tableState,
    queryTableData,
    handlePaginationChange,
  };
};
export default {
  name: "taskAllData",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    testMsgInfo: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BasicTable,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const { statusList, getStatusList } = handleGetTaskStatus();
    const { channelList, getChannelList } = handleGetChannel();
    const formState = reactive({
      searchTime: "",
      userId: "",
      status: "",
      id: "",
      time: new Date(),
      channelId: "",
      taskId: "",
      templateId: "",
      eventMsgId:""
    });
    const { tableState, handlePaginationChange, queryTableData } =
      handleTableInfo(root, formState, isEn);
    const handleClose = () => {
      emit("update:visible", false);
    };

    if (props.testMsgInfo?.id) {
      formState.id = props.testMsgInfo?.id;
    }
    onMounted(() => {
      getStatusList();
      getChannelList();
      queryTableData();
    });

    return {
      isEn,
      formState,
      statusList,
      ...toRefs(tableState),
      channelList,
      getStatusList,
      handleClose,
      getTranslateText,
      handlePaginationChange,
    };
  },
};
</script>
