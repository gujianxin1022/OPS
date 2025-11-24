<template>
  <div class="session-log-warp">
    <el-dialog
      :title="$t('关联记录')"
      :visible.sync="dialogVisible"
      width="800px"
      top="8vh"
      :fullscreen="true"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="false"
      :modal="false"
    >
      <div class="session-log">
        <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
          <screen-item :label="$t('日期')" :label-width="isEn ? 70 : 70">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('日期筛选按照北京时间，下方时间显示按照您当地时间')"
              placement="top-start"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            <FilterBySingleDate
              :defaultCurDate="true"
              @changeSelect="
                (timeArr) => {
                  params.startTimeStamp = new Date(timeArr[0]).getTime();
                  params.endTimeStamp = new Date(timeArr[1]).getTime();
                }
              "
            />
          </screen-item>
          <screen-item :label="$t('会话平台')" :label-width="isEn ? 200 : 70">
            <el-select
              v-model="params.platform"
              filterable
              clearable
              :placeholder="$t('请选择')+$t('会话平台')"
              @change="changePlatform"
            >
              <el-option
                v-for="item in sessionPlatform"
                :disabled="item.disabled"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </screen-item>
          <screen-item
            v-show="params.platform === 1"
            :label="$t('家长微信')"
            :label-width="isEn ? 120 : 70"
          >
            <el-select
              v-model="params.parentWxId"
              filterable
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in parentAccountList"
                :key="item.externalUserId"
                :label="item.nickName"
                :value="item.externalUserId"
              >
              </el-option>
            </el-select>
          </screen-item>
        </screen-wrapper>
        <div class="log-contain">
          <el-divider v-if="tableState.list.length">
            <el-button v-show="isMore" @click="getMoreMsg" type="text">{{
              $t("加载更多")
            }}</el-button>
            <span style="color: #ccc" v-show="!isMore">{{
              $t("没有更多了")
            }}</span>
          </el-divider>
          <div class="msg-contain" v-if="tableState.list.length">
            <el-checkbox
              class="checkAll"
              v-model="selectAll"
              @change="handleSelectAll"
              >{{ $t("全选") }}</el-checkbox
            >
            <div class="msg" v-for="msg in tableState.list" :key="msg.msgId">
              <el-row :gutter="10">
                <el-col :span="1" style="height: 100%">
                  <el-checkbox
                    class="checkbox"
                    v-model="msg.selected"
                  ></el-checkbox>
                </el-col>
                <el-col
                  :style="
                    msg.selected
                      ? 'background:#F9F9FF;margin-top:5px'
                      : 'margin-top:5px'
                  "
                  :span="22"
                >
                  <Message :msg="msg"
                /></el-col>
              </el-row>
            </div>
          </div>
          <Empty v-if="!tableState.list.length" />
        </div>
        <div v-show="loading" class="loading" v-loading="loading"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="handleSelectLog">{{
          $t("确定")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  computed,
  watch,
  ref,
  onMounted,
  reactive,
} from "@vue/composition-api";
import FilterBySingleDate from "@/components/FilterItem/CommodityFilter/FilterBySingleDate";
import Message from "./msgType/Message.vue";
import Empty from "@/components/Empty.vue";

export default {
  components: {
    FilterBySingleDate,
    Message,
    Empty,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    parentUserId: {
      type: Number,
      default: 0,
    },
    isShowAirCall: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const sessionPlatform = ref([
      { label: root.$t("企业微信"), value: 1, disabled: false },
      { label: root.$t("airCall"), value: 2, disabled: false },
      { label: root.$t("腾讯电话"), value: 4, disabled: false },
    ]);
    const dialogVisible = ref(false);
    const isMore = ref(true);
    const handleClose = () => {
      emit("update:show", false);
    };
    watch(
      () => props.show,
      (val) => {
        dialogVisible.value = props.show;
      },
      {
        immediate: true,
      }
    );

    /* 校验用户绑定状态 */
    const checkOPSUserBind = async () => {
      const isBindWechat =
        await root.$Api.taskManagement.reqCheckOPSUserBinding({
          platform: 1 /* 企业微信 */,
        });
      const isBindAirCall =
        await root.$Api.taskManagement.reqCheckOPSUserBinding({
          platform: 2 /* airCall */,
        });
      sessionPlatform.value[0].disabled = !isBindWechat;
      sessionPlatform.value[1].disabled = !isBindAirCall;
      if (!isBindWechat) {
        sessionPlatform.value[0].label = root.$t("未绑定企业微信 ");
      }
      if (!isBindAirCall) {
        sessionPlatform.value[1].label = root.$t("未绑定airCall账号 ");
      }
      !props.isShowAirCall && sessionPlatform.value.splice(1, 1);
    };
    const changePlatform = (val) => {
      if (val === 1 /* 切换到企业微信 */ && !parentAccountList.value.length) {
        root.$notify({
          message: root.$t("家长未绑定第三方账户"),
          type: "error",
        });
      }
    };
    const parentAccountList = ref([]);
    const reqParentExternalUserId = async () => {
      try {
        const res = await root.$Api.taskManagement.reqParentExternalUserId(
          props.parentUserId
        );
        if (res?.list?.length) {
          res.list.forEach((e) => {
            e.selected = false;
          });
        }
        parentAccountList.value = res || [];
        // if (res?.length) {
        //   params.value.parentWxId = res[0].externalUserId;
        // }
      } finally {
      }
    };
    const params = ref({
      parentWxId: "",
      pageSize: 10,
      pageNum: 1,
      parentUserId: props.parentUserId,
      platform: "",
      startTimeStamp: "",
      endTimeStamp: "",
    });
    const tableState = reactive({
      list: [],
    });
    const reqList = async () => {
      if(params.value.platform===''){
        return root.$message.warning(root.$t("请选择会话平台"));
      }
      loading.value = true;
      try {
        const res = await root.$Api.taskManagement.reqThirdPartyRecord(
          params.value
        );
        if (res.list?.length) {
          selectAll.value = false;
        }
        if (res.list && res.list.length >= 10) {
          isMore.value = true;
        } else {
          isMore.value = false;
        }
        // tableState.list = tableState.list.concat(res.list || []);
        tableState.list = res.list.reverse().concat(tableState.list);
      } finally {
        loading.value = false;
      }
    };
    const search = async () => {
      tableState.list = [];
      params.value.pageNum = 1;
      await reqList();
    };
    const getMoreMsg = async () => {
      params.value.pageNum++;
      await reqList();
    };

    /* 勾选消息 */
    const selectAll = ref(false);
    const handleSelectAll = (val) => {
      tableState.list.forEach((e) => {
        e.selected = val;
      });
    };
    const handleSelectLog = () => {
      let parentName =
        parentAccountList.value.filter((e) => {
          return e.externalUserId === params.value.parentWxId;
        })[0]?.nickName || root.$t("家长");
      const contactRecordReqList = [];
      tableState.list.forEach((e) => {
        if (e.selected) {
          contactRecordReqList.push({
            fromUser: e.fromUser,
            messageSender: e.messageSender,
            recordId: e.msgId,
            recordSource: params.value.platform,
            threePartyRecordTime: e.msgTime,
          });
        }
      });
      emit("getRecordList", contactRecordReqList, parentName);
      handleClose();
    };
    onMounted(async () => {
      await checkOPSUserBind();
      if (props.parentUserId) {
        reqParentExternalUserId();
      }
    });
    return {
      isEn,
      dialogVisible,
      parentAccountList,
      sessionPlatform,
      params,
      tableState,
      loading,
      selectAll,
      isShowAirCall: props.isShowAirCall,
      isMore,
      handleClose,
      search,
      reqList,
      getMoreMsg,
      handleSelectAll,
      handleSelectLog,
      changePlatform,
    };
  },
};
</script>
<style lang="scss" scoped>
.session-log-warp {
  .session-log {
    .el-icon-question {
      margin: 9px 8px 0 -7px;
    }
    .log-contain {
      height: calc(100vh - 310px);
      overflow: scroll;
      position: relative;
      .msg-contain {
        padding-top: 20px;
        min-height: 600px;
        .checkAll {
          margin-bottom: 20px;
        }
        .checkbox {
          vertical-align: middle;
          transform: translateY(50%);
        }
      }
    }
    .loading {
      width: 100%;
      position: absolute;
      left: 0;
      top: 216px;
      height: calc(100vh - 310px);
    }
  }
}
</style>
