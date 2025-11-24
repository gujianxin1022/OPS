import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "clearingList",
    name: "clearingList",
    component: (resolve) =>
      require(["@/views/appealManagement/clearingList.vue"], resolve),
    meta: {
      title: {
        nameZh: "课堂结算",
        nameEn: "ClassClearing",
      },
    },
  },
  {
    path: "appealList",
    name: "appealList",
    component: (resolve) =>
      require(["@/views/appealManagement/appealList.vue"], resolve),
    meta: {
      title: {
        nameZh: "课堂申诉",
        nameEn: "ClassAppeal",
      },
    },
  },
  {
    path: "alterCost",
    name: "alterCost",
    component: (resolve) =>
      require(["@/views/appealManagement/alterCost.vue"], resolve),
    meta: {
      title: {
        nameZh: "修正费用",
        nameEn: "alterCost",
      },
    },
  },
  {
    path: "dealAppeal",
    name: "dealAppeal",
    component: (resolve) =>
      require(["@/views/appealManagement/dealAppeal.vue"], resolve),
    meta: {
      title: {
        nameZh: "处理申诉",
        nameEn: "dealAppeal",
      },
    },
  },
  {
    path: "levelAppeal",
    name: "levelAppeal",
    component: (resolve) =>
      require(["@/views/appealManagement/levelAppeal.vue"], resolve),
    meta: {
      title: {
        nameZh: "等级申诉",
        nameEn: "levelAppeal",
      },
    },
  },
  {
    path: "dealLevelAppeal",
    name: "dealLevelAppeal",
    component: (resolve) =>
      require(["@/views/appealManagement/dealLevelAppeal.vue"], resolve),
    meta: {
      title: {
        nameZh: "处理等级申诉",
        nameEn: "dealLevelAppeal",
      },
    },
  },
];
const appealManagement = {
  path: "/appealManagement",
  component: Layout,
  children: routerMap,
};
export default appealManagement;
