import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'courseList',
    component: resolve => require(['@/views/teacherManagement/courseList.vue'], resolve),
    name: 'courseList',
    meta: {
      title: {
        nameZh: '课程列表',
        nameEn: 'CourseList'
      }
    }
  },
  {
    path: 'lessonInfo',
    component: resolve => require(['@/views/teacherManagement/courseSub/lessonInfo.vue'], resolve),
    name: 'lessonInfo',
    meta: {
      title: {
        nameZh: '课程详情',
        nameEn: 'lessonInfo'
      }
    }
  },
  {
    path: 'unitDetails2',
    component: resolve => require(['@/pages/teacher/course/UnitDetails/index.vue'], resolve),
    name: 'unitDetails2',
    meta: {
      title: {
        nameZh: '单元详情',
        nameEn: 'unitDetails'
      }
    }
  },
  {
    path: 'englishUnitDetails',
    component: resolve => require(['@/pages/teacher/course/EnglishUnitDetails/index.vue'], resolve),
    name: 'englishUnitDetails',
    meta: {
      title: {
        nameZh: '单元详情',
        nameEn: 'unitDetails'
      }
    }
  },
  {
    path: 'unitDetails',
    component: resolve => require(['@/views/teacherManagement/courseSub/unitDetails.vue'], resolve),
    name: 'unitDetails',
    meta: {
      title: {
        nameZh: '单元详情',
        nameEn: 'unitDetails'
      }
    }
  },
  {
    path: 'uploadMore',
    component: resolve =>
      require(['@/views/teacherManagement/coursewareSub/uploadMore.vue'], resolve),
    name: 'uploadMore',
    meta: {
      title: {
        nameZh: '批量上传课件',
        nameEn: 'uploadMore'
      }
    }
  },
  {
    path: 'homeworkBank',
    component: resolve => require(['@/views/teacherManagement/homeworkBank.vue'], resolve),
    name: 'homeworkBank',
    meta: {
      title: {
        nameZh: '题库',
        nameEn: 'HomeworkBank'
      }
    }
  },
  {
    path: 'recordVideoClass',
    component: resolve =>
      require(['@/views/teacherManagement/videoResources/recordVideoClass.vue'], resolve),
    name: 'recordVideoClass',
    meta: {
      title: {
        nameZh: '录播视频',
        nameEn: 'RecordVideoClass'
      }
    }
  },
  {
    path: 'themeManagement',
    component: resolve =>
      require(['@/views/teacherManagement/videoResources/themeManagement.vue'], resolve),
    name: 'themeManagement',
    meta: {
      title: {
        nameZh: '主题管理',
        nameEn: 'ThemeManagement'
      }
    }
  },
  {
    path: 'makeHomework',
    component: resolve => require(['@/views/teacherManagement/makeHomework.vue'], resolve),
    name: 'makeHomework',
    meta: {
      title: {
        nameZh: '题目',
        nameEn: 'topic'
      }
    }
  },
  {
    path: 'discoveryPageWhitelist',
    component: resolve => require(['@/views/teacherManagement/whitelist.vue'], resolve),
    name: 'discoveryPageWhitelist',
    meta: {
      title: {
        nameZh: '发现页白名单',
        nameEn: 'DiscoveryPageWhitelist'
      }
    }
  },
]
const teacherManagement = {
  path: '/teacherManagement',
  component: Layout,
  children: routerMap
}
export default teacherManagement
