import Layout from "@/views/layout/Layout";
import { ALLOW_LIST_TYPE } from "@/views/systemManagement/allowList/constants";
const routerMap = [
  {
    path: "userManagement",
    component: (resolve) =>
      require(["@/views/systemManagement/UserManagement.vue"], resolve),
    name: "userManagement",
    meta: {
      title: {
        nameZh: "全部员工",
        nameEn: "UserManagement",
      },
    },
  },
  {
    path: "leaveHandoverEmployees",
    component: (resolve) =>
      require(["@/views/systemManagement/leaveHandoverEmployees/index.vue"], resolve),
    name: "leaveHandoverEmployees",
    meta: {
      title: {
        nameZh: "离职待交接员工",
        nameEn: "Pending Handover Employees",
      },
    },
  },
  {
    path: "roleManagement",
    component: (resolve) =>
      require(["@/views/systemManagement/RoleManagement.vue"], resolve),
    name: "roleManagement",
    meta: {
      title: {
        nameZh: "角色管理",
        nameEn: "RoleManagement",
      },
    },
  },
  {
    path: "jobPositionManagement",
    component: (resolve) =>
      require(["@/views/systemManagement/JobPositionManagement.vue"], resolve),
    name: "jobPositionManagement",
    meta: {
      title: {
        nameZh: "岗位管理",
        nameEn: "JobPositionManagement",
      },
    },
  },
  {
    path: "powerManagement",
    component: (resolve) =>
      require(["@/views/systemManagement/ProwerManagement.vue"], resolve),
    name: "powerManagement",
    meta: {
      title: {
        nameZh: "权限管理",
        nameEn: "PowerManagement",
      },
    },
  },
  {
    path: "loginJournal",
    component: (resolve) =>
      require(["@/views/systemManagement/LoginJournal.vue"], resolve),
    name: "loginJournal",
    meta: {
      title: {
        nameZh: "登录日志",
        nameEn: "LoginJournal",
      },
    },
  },
  {
    path: "operationJournal",
    component: (resolve) =>
      require(["@/views/systemManagement/OperationJournal.vue"], resolve),
    name: "operationJournal",
    meta: {
      title: {
        nameZh: "操作日志",
        nameEn: "OperationJournal",
      },
    },
  },
  {
    path: "userInfo",
    component: (resolve) =>
      require(["@/views/systemManagement/userSub/UserInfo.vue"], resolve),
    name: "userInfo",
    meta: {
      title: {
        nameZh: "用户角色",
        nameEn: "User Role",
      },
    },
  },
  {
    path: "classChangeJournal",
    component: (resolve) =>
      require([
        "@/views/systemManagement/connversionJournal/index.vue",
      ], resolve),
    name: "classChangeJournal",
    meta: {
      title: {
        nameZh: "课时转换日志",
        nameEn: "Points Operation log",
      },
    },
  },
  {
    path: "deleteWeChatData",
    component: (resolve) =>
      require(["@/views/systemManagement/deleteWeChatData.vue"], resolve),
    name: "deleteWeChatData",
    meta: {
      title: {
        nameZh: "微信数据删除",
        nameEn: "Delete WeChat Data",
      },
    },
  },
  {
    path: "fixedClassroomJournal",
    component: (resolve) =>
      require([
        "@/views/systemManagement/fixedClassroom/fixedClassroomJournal.vue",
      ], resolve),
    name: "fixedClassroomJournal",
    meta: {
      title: {
        nameZh: "固定教室日志",
        nameEn: "fixedClassroomJournal",
      },
    },
  },
  {
    path: "changeClassroomJournal",
    component: (resolve) =>
      require([
        "@/views/systemManagement/fixedClassroom/changeClassroomJournal.vue",
      ], resolve),
    name: "changeClassroomJournal",
    meta: {
      title: {
        nameZh: "切换教室日志",
        nameEn: "changeClassroomJournal",
      },
    },
  },
  {
    path: "deleteWeChatDataLogs",
    component: (resolve) =>
      require(["@/views/systemManagement/deleteWeChatDataLogs.vue"], resolve),
    name: "deleteWeChatDataLogs",
    meta: {
      title: {
        nameZh: "微信数据删除日志",
        nameEn: "WeChat Data Deletion",
      },
    },
  },
  {
    path: "cancelAppointmentAllowlist",
    component: (resolve) =>
      require(["@/views/systemManagement/allowList/index.vue"], resolve),
    name: "cancelAppointmentAllowlist",
    meta: {
      title: {
        nameZh: "取消约课白名单",
        nameEn: "CancelAppointmentAllowlist",
      },
    },
    props: {
      allowListType: ALLOW_LIST_TYPE.cancel,
    },
  },
  {
    path: "multipleAppointmentsAllowlist",
    component: (resolve) =>
      require(["@/views/systemManagement/allowList/index.vue"], resolve),
    name: "multipleAppointmentsAllowlist",
    meta: {
      title: {
        nameZh: "多次约课白名单",
        nameEn: "MultipleAppointmentsAllowlist",
      },
    },
    props: {
      allowListType: ALLOW_LIST_TYPE.multiple,
    },
  },
  {
    path: "handoverAllowlist",
    component: (resolve) =>
      require(["@/views/systemManagement/allowList/index.vue"], resolve),
    name: "handoverAllowlist",
    meta: {
      title: {
        nameZh: "交接白名单",
        nameEn: "HandoverAllowlist",
      },
    },
    props: {
      allowListType: ALLOW_LIST_TYPE.handover,
    },
  },
  {
    path: "imWhiteList",
    component: (resolve) =>
      require(["@/views/systemManagement/im/WhiteList.vue"], resolve),
    name: "imWhiteList",
    meta: {
      title: {
        nameZh: "IM白名单",
        nameEn: "IM Allowlist",
      },
    },
  },
  {
    path: "replayValidityPeriodWhiteList",
    component: (resolve) =>
      require(["@/views/systemManagement/replayValidityPeriodWhiteList.vue"], resolve),
    name: "replayValidityPeriodWhiteList",
    meta: {
      title: {
        nameZh: "回放有效期白名单",
        nameEn: "Playback Validity Allowlist",
      },
    },
  },
  {
    path: "coursePackageManagement",
    component: (resolve) =>
      require([
        "@/views/systemManagement/holdAll/coursePackageManagement/index.vue",
      ], resolve),
    name: "coursePackageManagement",
    meta: {
      title: {
        nameZh: "课包管理",
        nameEn: "Course package management",
      },
    },
  },
  {
    path: "resoluteSwitchPkgList",
    component: (resolve) =>
      require(["@/views/systemManagement/switchPkg/index.vue"], resolve),
    name: "resoluteSwitchPkgList",
    meta: {
      title: {
        nameZh: "拒切版本白名单",
        nameEn: "resoluteSwitchPkg List",
      },
    },
  },
  {
    path: "productManagement",
    component: (resolve) =>
      require([
        "@/views/systemManagement/holdAll/productManagement/index.vue",
      ], resolve),
    name: "productManagement",
    meta: {
      title: {
        nameZh: "产品管理",
        nameEn: "Product Management",
      },
    },
  },
  {
    path: "LaAllocationSettings",
    component: (resolve) =>
      require([
        "@/views/systemManagement/LaAllocationSettings/index.vue",
      ], resolve),
    name: "LaAllocationSettings",
    meta: {
      title: {
        nameZh: "学管分配设置",
        nameEn: "LA Settings",
      },
    },
  },
  {
    path: "SKUManage",
    component: (resolve) =>
      require(["@/views/systemManagement/SKUManage/SKUManage.vue"], resolve),
    name: "SKUManage",
    meta: {
      title: {
        nameZh: "SKU管理",
        nameEn: "SKUManage",
      },
      noKeepAlive: true,
    },
  },
  {
    path: "fixedClassroomType",
    component: (resolve) =>
      require(["@/views/systemManagement/fixedClassroom/index.vue"], resolve),
    name: "fixedClassroomType",
    meta: {
      title: {
        nameZh: "固定教室类型",
        nameEn: "fixedClassroomType",
      },
    },
  },
  {
    path: "deleteParentAccount",
    component: (resolve) =>
      require([
        "@/views/systemManagement/deleteParentAccount/index.vue",
      ], resolve),
    name: "deleteParentAccount",
    meta: {
      title: {
        nameZh: "家长账户删除",
        nameEn: "deleteParentAccount",
      },
    },
  },
  {
    path: "searchParentID",
    component: (resolve) =>
      require(["@/views/systemManagement/searchParentID/index.vue"], resolve),
    name: "searchParentID",
    meta: {
      title: {
        nameZh: "查询家长ID",
        nameEn: "searchParentID",
      },
    },
  },
  {
    path: "clientVersionUpgrade",
    component: (resolve) =>
      require(["@/views/systemManagement/clientVersionUpgrade/index.vue"], resolve),
    name: "clientVersionUpgrade",
    meta: {
      title: {
        nameZh: "客户端版本升级",
        nameEn: "Client Version Upgrade",
      },
    },
  },
];
const systemManagement = {
  path: "/system",
  component: Layout,
  children: routerMap,
};
export default systemManagement;
