/* Layout */
import Layout from "@/views/layout/Layout";

// 常规路由（没有权限限制）
const baseRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: false,
  },
  {
    path: "/alternativeLogin",
    component: () => import("@/views/login/alternativeLogin"),
    hidden: false,
    meta: {
      title: {
        nameZh: "",
        nameEn: "",
      },
    },
  },
  {
    path: "/embedIframe",
    component: () => import("@/views/embedPage"),
  },
  {
    name: "customerService",
    path: "/customerService",
    component: () => import("@/components/CustomerService"),
  },
  {
    name: "wecome",
    path: "/wecome",
    component: () => import("@/views/h5/WeComeLayout.vue"),
    children: [
      {
        name: "wecome-myWorkOrder",
        path: "myWorkOrder",
        component: () => import("@/views/h5/workOrder/MyWorkOrder.vue"),
      },
      {
        name: "wecome-workOrderDetail",
        path: "workOrderDetail",
        component: () =>
          import("@/views/h5/workOrder/workOrderDetail/WorkOrderDetail.vue"),
      },
      {
        name: "wecome-im",
        path: "im",
        component: () => import("@/views/h5/IM.vue"),
      },
    ],
  },
  // 单独的企业微信绑定页面
  {
    name: "wecome-bind",
    path: "/wecome/bind",
    component: () => import("@/components/WeCome/BindWeCome.vue"),
    meta: {
      title: {
        nameZh: "",
        nameEn: "",
      },
      hidden: true,
    },
  },
  {
    path: "",
    component: Layout,
    children: [],
  },
];

export default baseRouterMap;
