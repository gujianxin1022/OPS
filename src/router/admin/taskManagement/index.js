import Layout from "@/views/layout/Layout";
const routerMap = [
  {
    path: "taskManagement",
    component: (resolve) =>
      require(["@/views/taskManagement/taskManagement.vue"], resolve),
    name: "taskManagement",
    meta: {
      title: {
        nameZh: "任务管理",
        nameEn: "Task Management",
      }
    },
  },
  {
    path: "publicField",
    component: (resolve) =>
      require(["@/views/taskManagement/publicField.vue"], resolve),
    name: "publicField",
    meta: {
      title: {
        nameZh: "公共字段设置",
        nameEn: "Task Fields",
      },
    },
  },
  {
    path: "taskTemplate",
    component: (resolve) =>
      require(["@/views/taskManagement/taskTemplate.vue"], resolve),
    name: "taskTemplate",
    meta: {
      title: {
        nameZh: "任务模板配置",
        nameEn: "Task template settings",
      },
      noKeepAlive: true,
    },
  },
  {
    path: 'myTask',
    component: resolve => require(['@/views/taskManagement/myTask.vue'], resolve),
    name: 'myTask',
    meta: {
      title: {
        nameZh: '我的任务',
        nameEn: 'My Task'
      }
    }
  },
];
const taskManagement = {
  path: "/task",
  component: Layout,
  children: routerMap,
};
export default taskManagement;
