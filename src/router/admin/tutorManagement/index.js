import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "searchTeacher",
    component: (resolve) =>
      require(["@/views/tutorManagement/searchTeacher.vue"], resolve),
    name: "searchTeacher",
    meta: {
      title: {
        nameZh: "查找老师",
        nameEn: "TeacherList",
      },
    },
  },
  {
    path: "teacherInfo",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherInfo.vue"], resolve),
    name: "teacherInfo",
    meta: {
      title: {
        nameZh: "老师信息",
        nameEn: "TeacherProfile",
      },
    },
  },
  {
    path: "teacherTimetable",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/teacherInfoSub/TeacherTimetable.vue",
      ], resolve),
    name: "teacherTimetable",
    meta: {
      title: {
        nameZh: "老师课表",
        nameEn: "TeacherSchedule",
      },
    },
  },
  {
    path: "teacherProcess",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherProcess/index.vue"], resolve),
    name: "teacherProcess",
    meta: {
      title: {
        nameZh: "老师流程",
        nameEn: "teacherProcess",
      },
    },
  },
  {
    path: "teacherWaitList",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherProcess/index2.vue"], resolve),
    name: "teacherWaitList",
    meta: {
      title: {
        nameZh: "教师待上岗列表",
        nameEn: "teacherWaitList",
      },
    },
  },
  {
    path: "classPayRules",
    component: (resolve) =>
      require(["@/views/tutorManagement/classPayRules/index.vue"], resolve),
    name: "classPayRules",
    meta: {
      title: {
        nameZh: "课酬规则",
        nameEn: "classPayRules",
      },
    },
  },
  {
    path: "partTimeClassPay",
    component: (resolve) =>
      require(["@/views/tutorManagement/partTimeClassPay.vue"], resolve),
    name: "partTimeClassPay",
    meta: {
      title: {
        nameZh: "兼职课酬",
        nameEn: "partTimeClassPay",
      },
    },
  },
  {
    path: "fullTimeClassPay",
    component: (resolve) =>
      require(["@/views/tutorManagement/fullTimeClassPay.vue"], resolve),
    name: "fullTimeClassPay",
    meta: {
      title: {
        nameZh: "全职课酬",
        nameEn: "fullTimeClassPay",
      },
    },
  },
  {
    path: "createClassPayRule",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPayRulesSub/createClassPayRule.vue",
      ], resolve),
    name: "createClassPayRule",
    meta: {
      title: {
        nameZh: "课酬标准配置表",
        nameEn: "createClassPayRule",
      },
    },
  },
  {
    path: "classPayDetail",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPayRulesSub/classPayDetail.vue",
      ], resolve),
    name: "classPayDetail",
    meta: {
      title: {
        nameZh: "课酬标准配置表",
        nameEn: "classPayDetail",
      },
    },
  },
  {
    path: "partTimeDetail",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPaySub/partTimeDetail.vue",
      ], resolve),
    name: "partTimeDetail",
    meta: {
      title: {
        nameZh: "课酬明细",
        nameEn: "partTimeDetail",
      },
    },
  },
  {
    path: "fullTimeDetail",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPaySub/fullTimeDetail.vue",
      ], resolve),
    name: "fullTimeDetail",
    meta: {
      title: {
        nameZh: "课酬明细",
        nameEn: "fullTimeDetail",
      },
    },
  },
  {
    path: "classPayDetailEn",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPaySub/classPayDetailEn.vue",
      ], resolve),
    name: "classPayDetailEn",
    meta: {
      title: {
        nameZh: "课酬明细",
        nameEn: "classPayDetail",
      },
    },
  },
  {
    path: "importClassPay",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPaySub/importClassPay.vue",
      ], resolve),
    name: "importClassPay",
    meta: {
      title: {
        nameZh: "导入课酬表格数据",
        nameEn: "importClassPay",
      },
    },
  },
  {
    path: "teacherIPAList",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherIPAList.vue"], resolve),
    name: "teacherIPAList",
    meta: {
      title: {
        nameZh: "教师IPA列表",
        nameEn: "Teacher IPA list",
      },
    },
  },
  {
    path: "detailsOfPayRules",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/classPayRuleDetails/index.vue",
      ], resolve),
    name: "detailsOfPayRules",
    meta: {
      title: {
        nameZh: "课酬规则详情",
        nameEn: "Details of pay rules",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "teacherRecommendConfig",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherRecommendConfig.vue"], resolve),
    name: "teacherRecommendConfig",
    meta: {
      title: {
        nameZh: "教师推荐配置",
        nameEn: "Teacher recommended configuration",
      },
    },
  },
  {
    path: "teachingPermissionConfiguration",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/teachingPermissionConfiguration.vue",
      ], resolve),
    name: "teachingPermissionConfiguration",
    meta: {
      title: {
        nameZh: "批量增加教学权限",
        nameEn: "Increase teaching permissions in batches",
      },
    },
  },
  {
    path: "teacherApplication",
    component: (resolve) =>
      require([
        "@/views/tutorManagement/teacherApplication/index.vue",
      ], resolve),
    name: "teacherApplication",
    meta: {
      title: {
        nameZh: "教师请假",
        nameEn: "Teacher's Leave",
      },
    },
  },
  {
    path: "teacherContract",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherContract/index.vue"], resolve),
    name: "teacherContract",
    meta: {
      title: {
        nameZh: "教师合同",
        nameEn: "Teacher's Contract",
      },
    },
  },
  {
    path: "teacherTask",
    component: (resolve) =>
      require(["@/views/taskManagement/teacherTask.vue"], resolve),
    name: "teacherTask",
    meta: {
      title: {
        nameZh: "教师任务",
        nameEn: "Teacher Task",
      },
    },
  },
  {
    path: "teacherTypeList",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherTypeList.vue"], resolve),
    name: "teacherTypeList",
    meta: {
      title: {
        nameZh: "教师类型设置",
        nameEn: "Teacher Type List",
      },
    },
  },
  {
    path: "teacherContractTemplate",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherContractTemplate.vue"], resolve),
    name: "teacherContractTemplate",
    meta: {
      title: {
        nameZh: "教师合同模版管理",
        nameEn: "Teacher Contract Template",
      },
    },
  },
  {
    path: "teacherRemunerationRule",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherRemunerationRule/index.vue"], resolve),
    name: "teacherRemunerationRule",
    meta: {
      title: {
        nameZh: "教师课酬规则管理",
        nameEn: "Teacher Remuneration Rule Management",
      },
    },
  },
  {
    path: "addSalaryRule",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherRemunerationRule/addSalaryRule.vue"], resolve),
    name: "addSalaryRule",
    meta: {
      title: {
        nameZh: "添加教师课酬规则",
        nameEn: "Add Teacher Remuneration Rule",
      },
    },
  },
  {
    path: "courseRuleDetail",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherRemunerationRule/courseRuleDetail.vue"], resolve),
    name: "courseRuleDetail",
    meta: {
      title: {
        nameZh: "课包关联规则明细",
        nameEn: "Course Package Association Rule Detail",
      },
    },
  },
  {
    path: "specialClassPay",
    component: (resolve) =>
      require(["@/views/tutorManagement/specialClassPay.vue"], resolve),
    name: "specialClassPay",
    meta: {
      title: {
        nameZh: "特殊薪酬处理",
        nameEn: "specialClassPay",
      },
    },
  },
  {
    path: "teacherComplaintData",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherComplaintData.vue"], resolve),
    name: "teacherComplaintData",
    meta: {
      title: {
        nameZh: "教师投诉数据",
        nameEn: "Teacher Complaint Data",
      },
    },
  },
  {
    path: "teacherSlotsTypeList",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherSlotsTypeList.vue"], resolve),
    name: "teacherSlotsTypeList",
    meta: {
      title: {
        nameZh: "Slots类型设置",
        nameEn: "Teacher Slots Type List",
      },
    },
  },
  {
    path: "teacherSlotsLogList",
    component: (resolve) =>
      require(["@/views/tutorManagement/teacherSlotsLogList.vue"], resolve),
    name: "teacherSlotsLogList",
    meta: {
      title: {
        nameZh: "设置记录",
        nameEn: "Batch Setting Records",
      },
    },
  },
];
const tutorManagement = {
  path: "/tutorManagement",
  component: Layout,
  children: routerMap,
};
export default tutorManagement;
