import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "detailedList",
    component: (resolve) =>
      require(["@/views/financeManagement/detailedList.vue"], resolve),
    name: "detailedList",
    meta: {
      title: {
        nameZh: "充值明细",
        nameEn: "Top-upDetails",
      },
    },
  },
  {
    path: "attendClassInfo",
    component: (resolve) =>
      require(["@/views/financeManagement/attendClassInfo.vue"], resolve),
    name: "attendClassInfo",
    meta: {
      title: {
        nameZh: "课消明细",
        nameEn: "ClassDetails",
      },
    },
  },
  {
    path: "handleByHuman",
    component: (resolve) =>
      require(["@/views/financeManagement/handleByHuman/index.vue"], resolve),
    name: "handleByHuman",
    meta: {
      title: {
        nameZh: "人工课时",
        nameEn: "Manualprocessing",
      },
    },
  },
  {
    path: "orderList",
    component: (resolve) =>
      require([
        "@/views/financeManagement/orderManagement/orderList.vue",
      ], resolve),
    name: "orderList",
    meta: {
      title: {
        nameZh: "订单列表",
        nameEn: "orderList",
      },
    },
  },
  {
    path: "mathOrderList",
    component: (resolve) =>
      require([
        "@/views/tianmaoManagement/mathOrderList.vue",
      ], resolve),
    name: "mathOrderList",
    meta: {
      title: {
        nameZh: "数学订单列表",
        nameEn: "MathOrderList",
      },
    },
  },
  {
    path: "englishOrderList",
    component: (resolve) =>
      require([
        "@/views/tianmaoManagement/englishOrderList.vue",
      ], resolve),
    name: "englishOrderList",
    meta: {
      title: {
        nameZh: "英语订单列表",
        nameEn: "EnglishOrderList",
      },
    },
  },
  {
    path: "subscription",
    component: (resolve) =>
      require([
        "@/views/financeManagement/subscriptionManagement/index.vue",
      ], resolve),
    name: "subscription",
    meta: {
      title: {
        nameZh: "订阅管理",
        nameEn: "SubscriptionManagement",
      },
    },
  },
  {
    path: "manualOrder",
    component: (resolve) =>
      require([
        "@/views/financeManagement/orderManagement/manualOrder.vue",
      ], resolve),
    name: "manualOrder",
    meta: {
      title: {
        nameZh: "人工订单",
        nameEn: "manualOrder",
      },
    },
  },
  {
    path: "bankcheckaccount",
    component: (resolve) =>
      require(["@/views/financeManagement/reconciliation/bankCPSops"], resolve),
    name: "bankcheckaccount",
    meta: {
      title: {
        nameZh: "银行对账",
        nameEn: "bankcheckaccount",
      },
    },
  },
  {
    path: "bankrecord",
    component: (resolve) =>
      require(["@/views/financeManagement/reconciliation/recordlist"], resolve),
    name: "bankrecord",
    meta: {
      title: {
        nameZh: "核对记录",
        nameEn: "bankrecord",
      },
    },
  },
  {
    path: "orderdetails",
    component: (resolve) =>
      require([
        "@/views/financeManagement/reconciliation/component/assembly/orderdetails",
      ], resolve),
    name: "orderdetails",
    meta: {
      title: {
        nameZh: "详情信息",
        nameEn: "details",
      },
    },
  },
  {
    path: "costControl",
    component: (resolve) =>
      require(["@/views/financeManagement/costCenter/costControl"], resolve),
    name: "costControl",
    meta: {
      title: {
        nameZh: "成本管理",
        nameEn: "Cost Control",
      },
    },
  },
  {
    path: "causeManagement",
    component: (resolve) =>
      require([
        "@/views/financeManagement/costCenter/causeManagement",
      ], resolve),
    name: "causeManagement",
    meta: {
      title: {
        nameZh: "原因管理",
        nameEn: "Cause Management",
      },
    },
  },
  {
    path: "coinManagement",
    component: (resolve) =>
      require(["@/views/financeManagement/costCenter/coinManagement"], resolve),
    name: "coinManagement",
    meta: {
      title: {
        nameZh: "积分管理",
        nameEn: "Coin Management",
      },
    },
  },
  {
    path: "revenueVoucher",
    component: (resolve) =>
      require([
        "@/views/financeManagement/revenueManagement/revenueVoucher/list.vue",
      ], resolve),
    name: "revenueVoucher",
    meta: {
      title: {
        nameZh: "收入凭证",
        nameEn: "Revenue Voucher",
      },
    },
  },
  {
    path: "paymentRouting",
    component: (resolve) =>
      require([
        "@/views/financeManagement/paymentManagement/paymentRoutingList.vue",
      ], resolve),
    name: "paymentRouting",
    meta: {
      title: {
        nameZh: "支付路由方案",
        nameEn: "Payment Routing",
      },
    },
  },
  {
    path: "paymentRoutingInfo",
    component: (resolve) =>
      require([
        "@/views/financeManagement/paymentManagement/paymentRoutingInfo.vue",
      ], resolve),
    name: "paymentRoutingInfo",
    meta: {
      title: {
        nameZh: "支付路由方案详情",
        nameEn: "Payment Routing Info",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "commodityManage",
    component: (resolve) =>
      require([
        "@/views/systemManagement/SKUManage/commodityManage.vue",
      ], resolve),
    name: "commodityManage",
    meta: {
      title: {
        nameZh: "课时商品",
        nameEn: "Session product",
      },
    },
  },
  {
    path: 'pointsMall',
    component: resolve => require(['@/views/coinManagement/pointsMall.vue'], resolve),
    name: 'pointsMall',
    meta: {
      title: {
        nameZh: '积分商城',
        nameEn: 'Points Mall'
      }
    }
  },
  {
    path: "handlingFee",
    component: (resolve) =>
      require([
        "@/views/financeManagement/paymentManagement/handlingFee.vue",
      ], resolve),
    name: "handlingFee",
    meta: {
      title: {
        nameZh: "支付手续费",
        nameEn: "Processing Fee",
      },
    },
  },
  {
    path: 'restrictionRuleList',
    component: resolve => require(['@/views/financeManagement/productManagement/productSalesRestrictions/restrictionRuleList.vue'], resolve),
    name: 'restrictionRuleList',
    meta: {
      title: {
        nameZh: '商品售卖限制',
        nameEn: 'Restriction Rules'
      }
    }
  },
  {
    path: 'restrictionRuleInfo',
    component: resolve => require(['@/views/financeManagement/productManagement/productSalesRestrictions/restrictionRuleInfo.vue'], resolve),
    name: 'restrictionRuleInfo',
    meta: {
      title: {
        nameZh: '限制规则',
        nameEn: 'restrictionRuleInfo'
      },
      noKeepAlive: true,
    }
  },
  {
    path: 'coursePackageRelationship',
    component: resolve => require(['@/views/financeManagement/productManagement/coursePackageRelationship.vue'], resolve),
    name: 'coursePackageRelationship',
    meta: {
      title: {
        nameZh: '课包映射关系',
        nameEn: 'Course Package Mapping'
      }
    }
  },
];
const financeManagement = {
  path: "/financeManagement",
  component: Layout,
  children: routerMap,
};
export default financeManagement;
