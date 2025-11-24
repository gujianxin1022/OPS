import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "wechatInheritedData",
    name: "wechatInheritedData",
    component: (resolve) =>
      require(["@/views/dataManagement/wechatInheritedData.vue"], resolve),
    meta: {
      title: {
        nameZh: "微信继承数据",
        nameEn: "Wechat inherited data",
      },
    },
  },
  {
    path: "wechatBindingData",
    name: "wechatBindingData",
    component: (resolve) =>
      require(["@/views/dataManagement/wechatBindingData.vue"], resolve),
    meta: {
      title: {
        nameZh: "微信绑定数据",
        nameEn: "Wechat binding data",
      },
    },
  },
  {
    path: "la/assignData",
    name: "learnerManagerAssignData",
    component: (resolve) =>
      require(["@/views/dataManagement/learnerManagerAssignData.vue"], resolve),
    meta: {
      title: {
        nameZh: "学管分配数据",
        nameEn: "LA Assign Data",
      },
    },
  },
];
const dataManagement = {
  path: "/dataManagement",
  component: Layout,
  children: routerMap,
};
export default dataManagement;
