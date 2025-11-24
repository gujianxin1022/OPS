import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'newStudentList',
    component: resolve => require(['@/views/studentManagement/newStudentList.vue'], resolve),
    name: 'newStudentList',
    meta: {
      title: {
        nameZh: '用户列表',
        nameEn: 'Users'
      }
    }
  },
  {
    path: 'studentInfo',
    component: resolve => require(['@/views/studentManagement/subPage/studentInfo.vue'], resolve),
    name: 'studentInfo',
    meta: {
      title: {
        nameZh: '学生信息',
        nameEn: 'StudentProfile'
      }
    }
  },
  {
    path: 'parentInfo',
    component: resolve => require(['@/views/studentManagement/subPage/parentInfo.vue'], resolve),
    name: 'parentInfo',
    meta: {
      title: {
        nameZh: '家长信息',
        nameEn: 'ParentProfile'
      }
    }
  },
  {
    path: 'homeworkView',
    component: resolve => require(['@/views/studentManagement/subPage/homeworkView.vue'], resolve),
    name: 'homeworkView',
    meta: {
      title: {
        nameZh: '作业查看',
        nameEn: 'homeworkView'
      }
    }
  },
  {
    path: 'parentWechatBinding',
    component: resolve => require(['@/views/studentManagement/subPage/parentWechatBinding.vue'], resolve),
    name: 'parentWechatBinding',
    meta: {
      title: {
        nameZh: '家长微信绑定',
        nameEn: 'Parent Wechat Binding'
      }
    }
  },
  {
    path: 'studentDashboard',
    component: resolve => require(['@/views/studentManagement/dashboard/studentDashboard.vue'], resolve),
    name: 'studentDashboard',
    meta: {
      title: {
        nameZh: '学情看板',
        nameEn: 'Student Dashboard'
      }
    }
  },
  {
    path: 'studentHealthList',
    component: resolve => require(['@/views/studentManagement/dashboard/studentHealthList.vue'], resolve),
    name: 'studentHealthList',
    meta: {
      title: {
        nameZh: '用户健康度列表',
        nameEn: 'Student Health List'
      }
    }
  },
  {
    path: 'studentIndicatorDetails',
    component: resolve => require(['@/views/studentManagement/dashboard/studentIndicatorDetails.vue'], resolve),
    name: 'studentIndicatorDetails',
    meta: {
      title: {
        nameZh: '用户健康度详情',
        nameEn: 'Student Indicator Details'
      }
    }
  },
  
]
const studentManagement = {
  path: '/studentManagement',
  component: Layout,
  children: routerMap
}
export default studentManagement
