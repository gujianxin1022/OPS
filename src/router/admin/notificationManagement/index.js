import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "notificationList",
    name: "notificationList",
    component: (resolve) =>
      require(["@/views/notificationManagement/notificationList.vue"], resolve),
    meta: {
      title: {
        nameZh: "通知管理",
        nameEn: "NotificationManagement",
      },
    },
  },
  {
    path: "notification",
    name: "notification",
    component: (resolve) =>
      require(["@/views/notificationManagement/notification.vue"], resolve),
    meta: {
      title: {
        nameZh: "新增消息",
        nameEn: "Add Notification",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "redList",
    name: "redList",
    component: (resolve) =>
      require(["@/views/notificationManagement/redList.vue"], resolve),
    meta: {
      title: {
        nameZh: "红名单",
        nameEn: "Red List",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "privateLog",
    name: "privateLog",
    component: (resolve) =>
      require(["@/views/notificationManagement/privateLog.vue"], resolve),
    meta: {
      title: {
        nameZh: "历史记录",
        nameEn: "HistoryLog",
      },
      noKeepAlive: true,
    },
  },
];
const notificationManagement = {
  path: "/notificationMt",
  component: Layout,
  children: routerMap,
};
export default notificationManagement;
