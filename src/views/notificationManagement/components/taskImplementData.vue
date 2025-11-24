<template>
  <el-dialog
    @close="handleClose"
    :title="$t('执行历史记录')"
    :visible.sync="visible"
    center
    width="1200px"
  >
    <header>
      <el-form
        :model="formState"
        inline
        :label-width="150"
      >
        <el-form-item :label="$t('任务名称')">
          {{currentTask.name}}
        </el-form-item>
        <el-form-item :label="$t('发送时间')">
          <el-date-picker
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formState.time"
            type="datetimerange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('渠道')">
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
        <el-form-item :label="$t('点击截止时间')">
          <el-date-picker
            v-model="formState.innerTime"
            type="datetime"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="queryTableData()"
            :disabled="!validate"
          >
            {{ $t("查询") }}
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
    <SendUserListData
      :visible.sync="isShowSendUserListDialog"
      v-if="isShowSendUserListDialog"
      :currentImlpete="currentImlpete"
      :languageList="languageList"
    />
  </el-dialog>
</template>
<script>
import {
  reactive,
  computed,
  toRefs,
  ref,
  unref,
  onMounted,
} from "@vue/composition-api";
import {
  getDataList,
  getChannelUIData,
} from "@/api/notificationManagement";

import BasicTable from "@/components/table/basic-table";
import constants from "../data/constants";
import SendUserListData from './sendUsersData.vue'

const {
  messageStatusList,
  getSendTimes,
  getTranslateText,
} = constants;

export default {
  components: {
    BasicTable,
    SendUserListData
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentTask: {
      type: Object,
      default: {}
    },
    languageList: {
      type: Array,
      default: []
    }
  },
  setup (props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionsState = reactive({ channelList: [] });
    const isShowSendUserListDialog = ref(false)
    const currentImlpete = ref(null)
    const validate = computed(() => {
      return formState.time?.length && formState.innerTime
    })

    const formState = reactive({
      startTime: "",
      endTime: '',
      channelId: '',
      innerTime: new Date(),
      time: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)],
      startTime: '',
      endTime: ''
    });

    const pickerMinDate = ref('')

    const pickerOptions = reactive({
      onPick: obj => {
        pickerMinDate.value = new Date(obj.minDate).getTime();
      },
      disabledDate: time => {
        if (pickerMinDate.value) {
          const day = 31 * 24 * 3600 * 1000;
          let maxTime = pickerMinDate.value + day;
          let minTime = pickerMinDate.value - day;
          return time.getTime() > maxTime || time.getTime() === maxTime || time.getTime() < minTime;
        }
      }
    })

    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      data: [],
      columns: computed(() => [
        {
          width: "80", label: "ID", prop: "id", render: (_, { row }) => (
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <span>{row.id}</span>
              <el-button
                slot="reference"
                type="text"
                onClick={() => handleJump(row.logUrl)}
              >
                {getId(row.id)}
              </el-button>
            </el-popover>
          ),
        },
        { width: "200", label: root.$t("发送时间"), prop: "createDate" },
        { label: root.$t("人群版本"), prop: "tagSystemTable" },
        { label: root.$t('应发'), prop: "shouldUserCount" },
        { label: root.$t('实发'), prop: "actualUserCount" },
        { label: root.$t('发送成功'), prop: "successCount" },
        {
          label: root.$t('成功率'), prop: "successPercent"
        },
        { label: root.$t('用户响应'), prop: "responseUserCount" },
        {
          label: root.$t('响应率'), prop: "responsePercent",
        },
        {
          label: root.$t('发送明细'), prop: "updateUser",
          render: (_, { row }) => (
            <el-button
              type="text"
              onClick={() => handleCheck(row)}
            >
              {root.$t('查看')}
            </el-button>
          ),
        },
        {
          label: root.$t('渠道'), width: "150", render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.channelName, props.languageList) : row.channelName}</span>)
          }
        },
        {
          label: root.$t('历史id'), prop: "historyId", render: (_, { row }) => (
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <span>{row.historyId}</span>
              <el-button
                slot="reference"
                type="text"
                onClick={() => handleJump(row.logUrl)}
              >
                {getId(row.historyId)}
              </el-button>
            </el-popover>

          ),
        },
      ]),
    });

    const getId = (id) => {
      id = (id + '').substring(0, 6) + '...'
      return id
    }
    const handleJump = (url) => {
      window.open(`/notificationMt/privateLog?uri=${url}`, "__blank");
    }

    const handleCheck = (row) => {
      currentImlpete.value = Object.assign({}, row, {
        taskName: props.currentTask.name,
      })
      isShowSendUserListDialog.value = true
    };

    const queryTableData = async () => {
      function getTime (date) {
        return new Date(date).getTime()
      }
      const { page, limit } = tableState;
      let submitData = { ...formState, innerTime: getTime(formState.innerTime) ? getTime(formState.innerTime) : '' }
      tableState.loading = true;
      if (formState.time?.length) {
        submitData = { ...submitData, startTime: getTime(formState.time[0]), endTime: getTime(formState.time[1]) }
      }
      delete submitData.time
      const { status, data: { data, code } } = await getDataList(props.currentTask.id, page, limit, submitData);
      if (status !== 200 || code !== 200) return Promise.reject()
      Object.assign(tableState, { data: data.list || [], total: data.total, loading: false });
    };

    const getChannelList = async () => {
      optionsState.channelList = await getChannelUIData();
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const handleClose = () => {
      emit('update:visible', false)
    }

    onMounted(() => {
      getChannelList();
      queryTableData()
    });

    return {
      ...toRefs(tableState),
      ...toRefs(optionsState),
      pickerOptions,
      validate,
      isEn,
      currentImlpete,
      messageStatusList,

      getTranslateText,
      getSendTimes,
      handleJump,
      formState,
      isShowSendUserListDialog,
      queryTableData,
      handleClose,
      handlePaginationChange,

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
