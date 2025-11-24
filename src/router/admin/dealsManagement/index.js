import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "dealsList",
    name: "dealsList",
    component: (resolve) =>
      require(["@/views/dealsManagement/dealsList.vue"], resolve),
    meta: {
      title: {
        nameZh: "商机管理",
        nameEn: "DealsManagement",
      },
    },
  },
];
const dealsManagement = {
  path: "/dealsManagement",
  component: Layout,
  children: routerMap,
};
export default dealsManagement;
