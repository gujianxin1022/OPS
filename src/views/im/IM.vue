<template>
  <iframe v-show="visible" class="im-iframe" :src="imUrl"></iframe>
</template>

<script>
import { getStorage } from "@/utils/handleStorage";

export default {
  props: {
    // 是否显示IM
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      userInfo: JSON.parse(getStorage("userInfo")),
      // 用于刷新iframe。组件每次隐藏的时候，都刷新一下 iframe，用于重置 IM 内部的会话聊天窗口到未打开状态
      refreshKey: 0,
    };
  },
  computed: {
    language() {
      return this.$i18n.locale;
    },
    // IM SDK 是否处于登录状态
    imIsLogin() {
      return this.$store.state.im.isLogin;
    },
    imOrigin() {
      return process.env.VUE_APP_IM_URL;
    },
    // 目标群聊ID
    groupId() {
      return this.$route.query.groupId || "";
    },
    // 地址栏传递的角色编码
    roleCode() {
      return this.$route.query.roleCode || 5;
    },
    imUrl() {
      const userInfo = this.userInfo;
      const { id, jwtToken } = userInfo;
      const avatar = userInfo.avatar || "";
      const nickName =
        userInfo.nickName || userInfo.realName || userInfo.username || "";
      let url = `${this.imOrigin}/?source=ops&lang=${this.language}&userId=${id}&roleCode=${this.roleCode}&nickName=${nickName}&avatar=${avatar}&token=${jwtToken}`;
      const groupId = this.groupId;
      if (groupId) {
        // 如果有指定聊天对象，则加上。IM内的会话窗口会自动打开
        url += `&groupId=${groupId}`;
      }
      return url;
    },
    iframeKey() {
      return `${this.imUrl}-${this.refreshKey}`;
    },
  },
  watch: {
    visible(val) {
      if (!val) {
        // 隐藏的时候，刷新 iframe。（这是为了离开聊天页面时，使iframe中的聊天窗口关闭，否则不会产生未读消息通知）
        this.refreshKey++;
      }
    },
  },
  created() {
    window.addEventListener("message", this.onMessage);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onMessage);
  },
  methods: {
    // 和 IM Iframe 的通信
    onMessage(event) {
      if (event.origin !== this.imOrigin) {
        return;
      }
      // console.log("event:", event);
      const data = event.data;
      switch (data.type) {
        case "TOTAL_UNREAD_MESSAGE_COUNT_UPDATED":
          // 如果已经集成了 IM SDK，不再需要从 iframe 中获取未读消息数量
          if (!this.imIsLogin) {
            const count = data.unreadMessageCount;
            this.$store.commit("im/setUnreadMessageCount", count);
          }
          break;
        // 到学生信息页面
        case "TO_STUDENT_PAGE":
          const url = `/studentManagement/studentInfo?studentId=${data.studentId}&studentName=${data.studentName}`;
          // 使用新标签页打开
          // window.open(url, 'student');
          this.$router.push(url);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.im-iframe {
  border: none;
  width: 100%;
}
</style>
