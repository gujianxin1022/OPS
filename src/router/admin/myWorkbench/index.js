import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "wordPractice",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/WordPractice.vue"], resolve),
    name: "wordPracticeClass",
    meta: {
      title: {
        nameZh: "单词陪练课堂",
        nameEn: "AceVocab Classes",
      },
    },
  },
  {
    path: "myClass",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyClass.vue"], resolve),
    name: "myClass",
    meta: {
      title: {
        nameZh: "我的课堂",
        nameEn: "myClass",
      },
    },
  },
  {
    path: "MyCustomer",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyCustomer.vue"], resolve),
    name: "MyCustomer",
    meta: {
      title: {
        nameZh: "我的客户",
        nameEn: "MyCustomer",
      },
    },
  },
  {
    path: "contactDashboard",
    component: (resolve) =>
      require(["@/views/myWorkbench/contactDashboard/index.vue"], resolve),
    name: "contactDashboard",
    meta: {
      title: {
        nameZh: "建联看板",
        nameEn: "Connection Dashboard",
      },
    },
  },
  {
    path: "myStudent",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyStudent.vue"], resolve),
    name: "MyStudent",
    meta: {
      title: {
        nameZh: "我的学员",
        nameEn: "MyStudent",
      },
    },
  },
  {
    path: "unAssigned",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/unAssigned.vue"], resolve),
    name: "unAssigned",
    meta: {
      title: {
        nameZh: "待分配进度",
        nameEn: "unAssigned",
      },
    },
  },
  {
    path: "MyDeal",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyDeal.vue"], resolve),
    name: "MyDeal",
    meta: {
      title: {
        nameZh: "我的成交",
        nameEn: "MyDeal",
      },
    },
  },
  {
    path: "MyTeacher",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyTeacher.vue"], resolve),
    name: "MyTeacher",
    meta: {
      title: {
        nameZh: "我的教师",
        nameEn: "MyTeacher",
      },
    },
  },
  {
    path: "myStudent/new",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyStudentNew.vue"], resolve),
    name: "MyStudent-new",
    meta: {
      title: {
        nameZh: "我的学员(新)",
        nameEn: "MyStudent-new",
      },
    },
  },
  {
    path: "assign/newStuMt",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/assignNewStudentMt.vue"], resolve),
    name: "assignNewStuMt",
    meta: {
      title: {
        nameZh: "新生分配管理",
        nameEn: "Assignment Settings",
      },
    },
  },
  {
    path: "assign/addRule",
    component: (resolve) =>
      require([
        "@/views/myWorkbench/components/assignManagement/ruleConfigPage.vue",
      ], resolve),
    name: "AssignRuleConfig",
    meta: {
      title: {
        nameZh: "规则配置",
        nameEn: "Assignment Rule",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "myEvaluationManagement",
    component: (resolve) =>
      require(["@/views/myWorkbench/iframe/index.vue"], resolve),
    name: "MyEvaluationManagement",
    meta: {
      title: {
        nameZh: "我的测评管理",
        nameEn: "My Evaluation Management",
      },
    },
  },
  {
    path: "myHighlight",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyHighlight.vue"], resolve),
    name: "myHighlight",
    meta: {
      title: {
        nameZh: "精彩瞬间",
        nameEn: "My Highlight",
      },
    },
  },
  {
    path: "MyWorkOrder",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyWorkOrder.vue"], resolve),
    name: "MyWorkOrder",
    meta: {
      title: {
        nameZh: "我的工单",
        nameEn: "My ticket",
      },
    },
  },
  {
    path: "WorkOrderDetail",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/WorkOrderDetail.vue"], resolve),
    name: "WorkOrderDetail",
    meta: {
      title: {
        nameZh: "工单详情",
        nameEn: "Ticket details",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "MyRequestCourse",
    component: (resolve) =>
      require(["@/views/myWorkbench/sub/MyRequestCourse.vue"], resolve),
    name: "MyRequestCourse",
    meta: {
      title: {
        nameZh: "课程邀约",
        nameEn: "Course Invitation",
      },
    },
  },
];
const myWorkbench = {
  path: "/work",
  component: Layout,
  children: routerMap,
};
export default myWorkbench;
