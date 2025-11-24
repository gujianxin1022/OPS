/* error */
import Layout from '@/views/layout/Layout'

// 常规路由（没有权限限制）
const errorRouterMap = [
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/page',
    component: Layout,
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'page401'
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'page404'
      }
    ]
  },
  { path: '*', title: '404', redirect: '/page/404', hidden: true }
]

export default errorRouterMap
