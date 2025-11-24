
import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'mathOrderList',
    component: resolve => require(['@/views/tianmaoManagement/mathOrderList.vue'], resolve),
    name: 'mathOrderList',
    meta: {
      title: {
        nameZh: '天猫数学订单',
        nameEn: 'tianmaoMathOrder'
      }
    }
  },
  {
    path: 'englishOrderList',
    component: resolve => require(['@/views/tianmaoManagement/englishOrderList.vue'], resolve),
    name: 'englishOrderList',
    meta: {
      title: {
        nameZh: '天猫英语订单',
        nameEn: 'tianmaoEnglishOrder'
      }
    }
  }
]
const tianmaoManagement = {
  path: '/tianmaoManagement',
  component: Layout,
  children: routerMap
}
export default tianmaoManagement
