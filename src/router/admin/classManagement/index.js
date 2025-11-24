import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'scheduling',
    name: 'scheduling',
    component: resolve => require(['@/views/classManagement/scheduling.vue'], resolve),
    meta: { title: {
      nameZh: '上课安排',
      nameEn: 'ClassSchedule'
    }}
  }
]
const classManagement = {
  path: '/classManagement',
  component: Layout,
  children: routerMap
}
export default classManagement
