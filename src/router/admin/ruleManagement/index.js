import Layout from "@/views/layout/Layout";
const routerMap = [
    {
        path: "rule",
        component: (resolve) =>
          require(["@/views/ruleManagement/rule.vue"], resolve),
        name: "rule",
        meta: {
          title: {
            nameZh: "规则管理",
            nameEn: "rule",
          },
        },
    }
];
const ruleManagement = {
  path: "/ruleManagement",
  component: Layout,
  children: routerMap,
};
export default ruleManagement;