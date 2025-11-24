import Layout from "@/views/layout/Layout";
import { IFRAME_URL_LIST } from "@/views/operateManagement/iframe/constants";
const routerMap = [
  {
    path: "decemberActivity",
    component: (resolve) =>
      require(["@/views/operateManagement/DecemberActivity.vue"], resolve),
    name: "decemberActivity",
    meta: {
      title: {
        nameZh: "12月份拼团活动",
        nameEn: "DecemberActivity",
      },
    },
  },
  {
    path: "referralAudit",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "referralAudit",
    meta: {
      title: {
        nameZh: "转介绍审核",
        nameEn: "referralAudit",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.referralAudit,
    },
  },
  {
    path: "shareTimesModification",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "shareTimesModification",
    meta: {
      title: {
        nameZh: "转介绍分享次数批量修改",
        nameEn: "shareTimesModification",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.shareTimesModification,
    },
  },
  {
    path: "checkScreenshotManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "checkScreenshotManagement",
    meta: {
      title: {
        nameZh: "查看截图管理",
        nameEn: "Check Screenshot Management",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.checkScreenshotManagement,
    },
  },
  {
    path: "auditScreenshotManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "auditScreenshotManagement",
    meta: {
      title: {
        nameZh: "审核截图管理",
        nameEn: "auditScreenshotManagement",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.auditScreenshotManagement,
    },
  },
  {
    path: "zohoFailureClue",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "zohoFailureClue",
    meta: {
      title: {
        nameZh: "线索导入失败查询",
        nameEn: "zohoFailureClue",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.zohoFailureClue,
    },
  },
  {
    path: "groupPurchase",
    component: (resolve) =>
      require(["@/views/operateManagement/GroupPurchase.vue"], resolve),
    name: "groupPurchase",
    meta: {
      title: {
        nameZh: "小班课团购",
        nameEn: "GroupPurchase",
      },
    },
  },
  {
    path: "bigGroupLists",
    component: (resolve) =>
      require(["@/views/operateManagement/bigClassList.vue"], resolve),
    name: "bigGroupLists",
    meta: {
      title: {
        nameZh: "大班课列表",
        nameEn: "bigClassList",
      },
    },
  },
  {
    path: "bigclass",
    component: (resolve) =>
      require(["@/views/operateManagement/bigClass.vue"], resolve),
    name: "bigclass",
    meta: {
      title: {
        nameZh: "大班课活动",
        nameEn: "PublicClass",
      },
    },
  },
  {
    path: "creatActivityDetail",
    component: (resolve) =>
      require([
        "@/views/operateManagement/bigClassSub/creatActivityDetail.vue",
      ], resolve),
    name: "creatActivityDetail",
    meta: {
      title: {
        nameZh: "创建大班课活动",
        nameEn: "CreatPublicClass",
      },
    },
  },
  {
    path: "activityDetail",
    component: (resolve) =>
      require([
        "@/views/operateManagement/bigClassSub/activityDetail.vue",
      ], resolve),
    name: "activityDetail",
    meta: {
      title: {
        nameZh: "大班课活动详情",
        nameEn: "PublicClassDetail",
      },
    },
  },
  {
    path: "coinExchange",
    component: (resolve) =>
      require(["@/views/coinManagement/coinExchange.vue"], resolve),
    name: "coinExchange",
    meta: {
      title: {
        nameZh: "积分兑换",
        nameEn: "CoinExchange",
      },
    },
  },
  {
    path: "couponList",
    component: (resolve) =>
      require(["@/views/operateManagement/couponSub/couponList.vue"], resolve),
    name: "couponList",
    meta: {
      title: {
        nameZh: "优惠券",
        nameEn: "coupon",
      },
    },
  },
  {
    path: "couponDetail",
    component: (resolve) =>
      require([
        "@/views/operateManagement/couponSub/couponDetail.vue",
      ], resolve),
    name: "couponDetail",
    meta: {
      title: {
        nameZh: "优惠券详情",
        nameEn: "couponDetail",
      },
    },
  },
  {
    path: "createCoupon",
    component: (resolve) =>
      require([
        "@/views/operateManagement/couponSub/createCoupon.vue",
      ], resolve),
    name: "createCoupon",
    meta: {
      title: {
        nameZh: "创建优惠券",
        nameEn: "createCoupon",
      },
    },
  },
  {
    path: "couponRecord",
    component: (resolve) =>
      require([
        "@/views/operateManagement/couponSub/couponRecord.vue",
      ], resolve),
    name: "couponRecord",
    meta: {
      title: {
        nameZh: "发券记录",
        nameEn: "couponRecord",
      },
    },
  },
  {
    path: "effectAnalysis",
    component: (resolve) =>
      require([
        "@/views/operateManagement/couponSub/effectAnalysis.vue",
      ], resolve),
    name: "effectAnalysis",
    meta: {
      title: {
        nameZh: "效果分析",
        nameEn: "effectAnalysis",
      },
    },
  },
  {
    path: "gstManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/gstManagement.vue"], resolve),
    name: "gstManagement",
    meta: {
      title: {
        nameZh: "税率管理",
        nameEn: "GST",
      },
    },
  },
  {
    path: "createGST",
    component: (resolve) =>
      require(["@/views/operateManagement/gstSub/createGST.vue"], resolve),
    name: "createGST",
    meta: {
      title: {
        nameZh: "创建税率",
        nameEn: "createGST",
      },
    },
  },
  {
    path: "gstDetail",
    component: (resolve) =>
      require(["@/views/operateManagement/gstSub/gstDetail.vue"], resolve),
    name: "gstDetail",
    meta: {
      title: {
        nameZh: "税率详情",
        nameEn: "GSTDetail",
      },
    },
  },
  {
    path: "groupManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "groupManagement",
    meta: {
      title: {
        nameZh: "团管理",
        nameEn: "groupManagement",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.groupManagement,
    },
  },
  {
    path: "groupHeadManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "groupHeadManagement",
    meta: {
      title: {
        nameZh: "团长管理",
        nameEn: "groupHeadManagement",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.groupHeadManagement,
    },
  },
  {
    path: "leagueMemberManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "leagueMemberManagement",
    meta: {
      title: {
        nameZh: "团员管理",
        nameEn: "leagueMemberManagement",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.leagueMemberManagement,
    },
  },
  {
    path: "promotionAmbassador",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "promotionAmbassador",
    meta: {
      title: {
        nameZh: "推广大使",
        nameEn: "promotionAmbassador",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.promotionAmbassador,
    },
  },
  {
    path: "disposeIntegralCoursePackage",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "disposeIntegralCoursePackage",
    meta: {
      title: {
        nameZh: "积分课包配置",
        nameEn: "disposeIntegralCoursePackage",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.disposeIntegralCoursePackage,
    },
  },
  {
    path: "promotionWorkbench",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "promotionWorkbench",
    meta: {
      title: {
        nameZh: "推广大使订单管理",
        nameEn: "promotionWorkbench",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.promotionWorkbench,
    },
  },
  {
    path: "importLeadsManually",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "importLeadsManually",
    meta: {
      title: {
        nameZh: "手动导入线索",
        nameEn: "importLeadsManually",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.importLeadsManually,
    },
  },
  {
    path: "channelFormCreation",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "channelFormCreation",
    meta: {
      title: {
        nameZh: "ZA渠道表单创建",
        nameEn: "Create Form(RF/OT-ZA)",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.channelFormCreation,
    },
  },
  {
    path: "dealChangeOwner",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "dealChangeOwner",
    meta: {
      title: {
        nameZh: "用户顾问分配",
        nameEn: "Deal Change Owner",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.dealChangeOwner,
    },
  },
  {
    path: "serviceConfigManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "serviceConfigManagement",
    meta: {
      title: {
        nameZh: "外部服务配置",
        nameEn: "Service Config",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.externalServiceConfiguration,
    },
  },
  {
    path: "BDManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "BDManagement",
    meta: {
      title: {
        nameZh: "BD 管理",
        nameEn: "BD Management",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.BDManagement,
    },
  },
  {
    path: "BDActivityManagement",
    component: (resolve) =>
      require(["@/views/operateManagement/iframe/index.vue"], resolve),
    name: "BDActivityManagement",
    meta: {
      title: {
        nameZh: "BD 活动管理",
        nameEn: "BD Activity Management",
      },
    },
    props: {
      iframeUrl: IFRAME_URL_LIST.BDActivityManagement,
    },
  },
];
const operateManagement = {
  path: "/operateManagement",
  component: Layout,
  children: routerMap,
};
export default operateManagement;
