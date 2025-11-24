import Layout from "@/views/layout/Layout";

const imManagement = {
  path: "/im",
  component: Layout,
  children: [
    {
      path: "",
      name: "im",
      component: () =>
        import("@/views/im/IM.vue"),
      meta: {
        title: {
          nameZh: "我的消息", // 会显示在 tag-view 中
          nameEn: "Messages",
        },
      },
    },
    {
      path: "conversation",
      name: "conversation",
      component: () =>
        import("@/views/im/conversation/ConversationManagement.vue"),
      meta: {
        title: {
          nameZh: "会话审计", // 会显示在 tag-view 中
          nameEn: "Conversation Audit",
        },
      },
    },
  ],
};
export default imManagement;
