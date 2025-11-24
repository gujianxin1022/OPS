import Layout from '@/views/layout/Layout'
const routerMap = [
  {
    path: 'index',
    name: 'homepage',
    component: resolve => require(['@/views/homepage/index.vue'], resolve),
    meta: { title: {
      nameZh: '首页',
      nameEn: 'home'
    }}
  }
]
const homepage = {
  path: '/home',
  component: Layout,
  children: routerMap
}
export default homepage
