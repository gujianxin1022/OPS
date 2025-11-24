import { getIMSignature } from "@/api/im/index";
import { getStorage } from "@/utils/handleStorage";
// import TencentCloudChat from "@tencentcloud/chat";
import { createNotification } from "@/components/IM/util";

const state = {
  isLogin: false, // im登录状态
  unreadMessageCount: 0, // 未读消息数量
};
const getters = {
  enabled: (state, getters, rootState) => {
    const menuMap = rootState.tabs.menuMap;
    const teachMenu = (menuMap || []).find((item) => item.code === "teach");
    const teachSecondMenuList = teachMenu?.children || [];
    // 权限菜单里包含 我的消息 菜单，则启用IM
    return teachSecondMenuList.some((p) => p.code === "Messages");
  },
};

const mutations = {
  // 设置未读消息数
  setUnreadMessageCount(state, value) {
    state.unreadMessageCount = value;
  },
};

const actions = {
  async init({ state, commit }) {
    console.log("init im module:");
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      console.log('%c本地开发环境下不启用IM', 'color: red;');
      return;
    }
    try {
      // 动态引入IM模块
      const module = await import("@tencentcloud/chat");
      // console.log("module:", module);
      const TencentCloudChat = module.default;
      const userInfo = JSON.parse(getStorage("userInfo"));
      // 获取IM签名
      const param = {
        providerId: 1,
        userId: userInfo.id,
        roleCode: 5,
        nickName: userInfo.nickName || userInfo.realName || userInfo.username,
        avatar: userInfo.avatar,
      };
      const imInfo = await getIMSignature(param);
      // console.log("imInfo:", imInfo);
      const options = {
        SDKAppID: Number(imInfo.sdkAppId),
      };
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      const chat = TencentCloudChat.create(options); // SDK 实例通常用 chat 表示
      // chat.setLogLevel(isDev ? 0 : 1); // 普通级别，日志量较多，接入时建议使用
      chat.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
      chat.on(
        TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
        (event) => {
          // console.log("IM: TOTAL_UNREAD_MESSAGE_COUNT_UPDATED:", event);
          commit("setUnreadMessageCount", event.data);
        }
      );
      chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (event) => {
        // console.log("IM: MESSAGE_RECEIVED", event);
        // 过滤掉自己发送的消息和非聊天类型的消息
        const chatMsgList = (event.data || []).filter(
          (msg) =>
            msg.from !== imInfo.userId &&
            [
              TencentCloudChat.TYPES.CONV_C2C,
              TencentCloudChat.TYPES.CONV_GROUP,
            ].includes(msg.conversationType)
        );
        if (chatMsgList.length > 0) {
          const msg = chatMsgList[0];
          // 创建通知
          createNotification(msg);
        }
      });
      chat.on(TencentCloudChat.EVENT.KICKED_OUT, () => {
        state.isLogin = false;
      });
      const imResponse = await chat.login({
        userID: imInfo.userId,
        userSig: imInfo.userSig,
      });
      console.log("imResponse:", imResponse);
      state.isLogin = true;
    } catch (error) {
      console.error("init im error:", error);
    }
  },
};

export default { namespaced: true, state, mutations, actions, getters };
