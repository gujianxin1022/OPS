<template>
  <el-dialog
    @close="handleClose"
    :title="$t('发送用户列表')"
    :visible.sync="visible"
    center
    width="1200px"
    append-to-body
  >
    <header>
      <el-form
        :model="formState"
        inline
        :label-width="isEn ? '150px' : ''"
      >
        <el-form-item :label="$t('任务Id')">
          {{currentImlpete.taskId}}
        </el-form-item>
        <el-form-item :label="$t('任务名称')">
          {{currentImlpete.taskName}}
        </el-form-item>
        <el-form-item :label="$t('历史ID')">
          {{currentImlpete.historyId}}
        </el-form-item>
        <el-form-item :label="$t('发送时间')">
          {{currentImlpete.createDate}}
        </el-form-item>
        <el-form-item :label="$t('用户id')">
          <el-input
            type="text"
            v-model="formState.userId"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.status"
            style="width:300px"
          >
            <el-option
              v-for="item in statusList"
              :key="item.code"
              :label="isEn ? getTranslateText(item.name, languageList) :item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="queryTableData()"
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
  getSendUserDataList,
  getTaskImplementStatus
} from "@/api/notificationManagement";

import BasicTable from "@/components/table/basic-table";
import constants from "../data/constants";
const {
  getTranslateText,
} = constants;
export default {
  components: {
    BasicTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentImlpete: {
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

    const statusList = ref([]);

    const formState = reactive({
      userId: '',
      status: ''
    });

    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      data: [],
      columns: computed(() => [
        {
          width: "80", label: "ID", prop: "_id", render: (_, { row }) => (
            <el-popover
              placement="top-start"
              trigger="hover"
            >
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
        { width: "80", label: root.$t('标题'), prop: "title", width: "150" },
        { width: "80", label: root.$t('用户角色'), prop: "businessName" },
        { width: "80", label: root.$t('接收人ID'), prop: "userId" },
        {
          width: "80", label: root.$t('触达类型'), width: "150", render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.pushTypeName, props.languageList) : row.pushTypeName}</span>)
          }
        },
        { width: "80", label: root.$t('触达通道'), prop: "channelName", width: "150" },
        { width: "120", label: root.$t('发送时间'), prop: "sendDate", width: "150" },
        {
          width: "120", label: root.$t('状态'), render: (_, { row }) => {
            return (<span>{unref(isEn) ? getTranslateText(row.statusName, props.languageList) : row.statusName}</span>)
          },
        },
        { width: "120", label: root.$t('第三方回调时间'), prop: "callbackTime" },
        { width: "120", label: root.$t('用户点击时间'), prop: "clickTime" },
      ]),
    });


    const queryTableData = async () => {
      const { page, limit } = tableState;
      tableState.loading = true;
      const { channelId, taskId, historyId, createTs } = props.currentImlpete
      const params = {
        channelId, taskId, historyId, searchTime: createTs, userId: formState.userId, status: formState.status
      }
      const { status, data: { data, code } } = await getSendUserDataList(page, limit, params);
      if (status !== 200 || code !== 200) return Promise.reject()
      Object.assign(tableState, { data: data.list || [], total: data.total, loading: false });
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };


    const handleClose = () => {
      emit('update:visible', false)
    }

    const getId = (id) => {
      id = (id + '').substring(0, 6) + '...'
      return id
    }

    const handleJump = (url) => {
      window.open(`/notificationMt/privateLog?uri=${url}`, "__blank");
    }

    const getStatusList = () => {
      getTaskImplementStatus().then(({ status, data: { data, code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        statusList.value = data
      }).catch(() => {
        statusList.value = []
      })
    }

    onMounted(() => {
      queryTableData();
      getStatusList()
    });

    return {
      statusList,
      isEn,
      formState,
      queryTableData,
      ...toRefs(tableState),

      handleClose,
      handlePaginationChange,
      getTranslateText
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
