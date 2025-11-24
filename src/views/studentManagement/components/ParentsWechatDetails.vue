<template>
  <el-dialog
    center
    width="600px"
    :title="$t('家长微信详情')"
    :visible="visible"
    :before-close="handleCancel"
  >
    <span slot="title">
      <el-radio-group v-model="activeId">
        <el-radio-button
          :label="item.bindId"
          :key="item.bindId"
          v-for="(item, idx) of weChatList"
        >
          {{ `${$t("微信")}${idx + 1}` }}
        </el-radio-button>
      </el-radio-group>
    </span>
    <div class="content" v-loading="contentLoading">
      <template v-if="activeInfo">
        <h2>{{ $t("家长微信详情") }}</h2>
        <div>
          <label>{{ $t("微信头像") }}：</label>
          <el-image
            v-if="activeInfo.avatar"
            fit="cover"
            style="width: 100px; height: 100px"
            :src="activeInfo.avatar"
          />
          <span v-else>--</span>
        </div>
        <div>
          <label>{{ $t("微信备注名") }}：</label>
          <span>{{ activeInfo.remark || '--' }}</span>
        </div>
        <div>
          <label>{{ $t("微信昵称") }}：</label>
          <span>{{ activeInfo.nickName || '--' }}</span>
        </div>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="activeInfo"
        type="primary"
        @click="handleUnbind"
        :loading="cancelLoading"
        :disabled="contentLoading"
      >
        {{ $t("取消绑定") }}
      </el-button>
      <el-button v-if="isShowAdd" type="primary" @click="handleOk">
        {{ $t("新增家长微信") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from "@vue/composition-api";
import {
  getParentBindingWechatInfo,
  wechatCancelBind,
} from "@/api/studentManagement";

const { id } = JSON.parse(localStorage.userInfo);

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: String,
      default: void 0,
    },
    bindId: {
      type: Number,
      default: void 0,
    },
  },
  setup(props, { root, emit }) {
    const cancelLoading = ref(false);

    const contentLoading = ref(true);

    const weChatInfo = reactive({
      activeId: void 0,
      weChatList: [],
    });

    const activeInfo = computed(() =>
      weChatInfo.weChatList.find((item) => item.bindId === weChatInfo.activeId)
    );

    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          weChatInfo.activeId = void 0;
          weChatInfo.weChatList = [];
          return;
        }
        await queryWechatList();
        if (props.bindId) {
          weChatInfo.activeId = weChatInfo.weChatList.find(
            (item) => item.bindId === props.bindId
          )["bindId"];
          return;
        }
        weChatInfo.activeId = weChatInfo.weChatList[0]?.["bindId"];
      }
    );

    const isShowAdd = computed(() => weChatInfo.weChatList.length < 5);

    const handleCancel = () => {
      emit("update:visible", false);
    };

    const queryWechatList = async () => {
      contentLoading.value = true;
      weChatInfo.weChatList = await getParentBindingWechatInfo({
        userId: id,
        parentUserId: props.parentId,
      });
      contentLoading.value = false;
    };

    const handleOk = () => {
      handleCancel();
      root.$router.push({
        name: "parentWechatBinding",
        query: { parentId: props.parentId },
      });
    };

    const handleUnbind = async () => {
      await root.$confirm(
        root.$t("确定取消绑定该家长微信吗？"),
        root.$t("提示"),
        { type: "warning" }
      );
      try {
        cancelLoading.value = true;
        await wechatCancelBind({
          userId: id,
          bindId: weChatInfo.activeId,
        });
        const idx = weChatInfo.weChatList.findIndex((v) => {
          return v.bindId === weChatInfo.activeId
        })
        emit("update");
        weChatInfo.weChatList.splice(idx, 1);
        weChatInfo.activeId = weChatInfo.weChatList[0]?.["bindId"];
        if (!weChatInfo.weChatList.length) handleCancel();
      } finally {
        cancelLoading.value = false;
      }
    };

    return {
      contentLoading,
      cancelLoading,
      ...toRefs(weChatInfo),
      isShowAdd,
      activeInfo,

      handleCancel,
      handleOk,
      handleUnbind,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  display: block !important;
  text-align: left;
  height: auto;
  padding: 0;
  border-bottom: none;
  .el-radio-button__inner {
    padding: 12px 24px;
    border-radius: 0px !important;
  }
}
.content {
  min-height: 200px;
  text-align: center;
  h2 {
    margin-top: 0;
    margin-bottom: 26px;
  }
  div {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .el-image {
      margin-bottom: 0;
      border-radius: 4px;
    }
    label {
      width: 50%;
      text-align: right;
    }
  }
}
</style>