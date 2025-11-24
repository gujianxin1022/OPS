
import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'groupList',
    component: resolve => require(['@/views/groupManagement/groupList.vue'], resolve),
    name: 'groupList',
    meta: {
      title: {
        nameZh: '班级列表',
        nameEn: 'GroupList'
      }
    }
  },
  {
    path: 'createClass',
    component: resolve => require(['@/views/groupManagement/createClass.vue'], resolve),
    name: 'createClass',
    meta: {
      title: {
        nameZh: '创建班级',
        nameEn: 'CreateClass'
      }
    }
  },{
    path: 'groupTypeList',
    component: resolve => require(['@/views/groupManagement/groupTypeList.vue'], resolve),
    name: 'groupTypeList',
    meta: {
      title: {
        nameZh: '班型列表',
        nameEn: 'GroupTypeList'
      }
    }
  },{
    path: 'groupTypeDetail',
    component: resolve => require(['@/views/groupManagement/groupTypeSub/groupTypeDetail.vue'], resolve),
    name: 'groupTypeDetail',
    meta: {
      title: {
        nameZh: '班型信息',
        nameEn: 'groupTypeDetail'
      }
    }
  },
  {
    path: 'groupStudents',
    component: resolve => require(['@/views/groupManagement/groupStudents.vue'], resolve),
    name: 'groupStudents',
    meta: {
      title: {
        nameZh: '小班学生',
        nameEn: 'groupStudents'
      }
    }
  },
  {
    path: 'createGroupType',
    component: resolve => require(['@/views/groupManagement/groupTypeSub/createGroupType.vue'], resolve),
    name: 'createGroupType',
    meta: {
      title: {
        nameZh: '创建班型',
        nameEn: 'createGroupType'
      }
    }
  },
  {
    path: 'classInfo',
    component: resolve => require(['@/views/groupManagement/classInfo.vue'], resolve),
    name: 'classInfo',
    meta: { 
      title: {
        nameZh: '班级信息',
        nameEn: 'ClassInfo'
      },
    }
  },
]
const groupManagement = {
  path: '/groupManagement',
  component: Layout,
  children: routerMap
}
export default groupManagement
