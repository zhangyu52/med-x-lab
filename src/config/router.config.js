// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '图标展示页', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/test-work',
            name: 'TestWork',
            component: () => import('@/views/dashboard/TestWork'),
            meta: { title: '测试功能', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },
      // admin
      {
        path: '/admin',
        redirect: '/admin/user',
        component: PageView,
        meta: { title: '主数据维护', icon: 'appstore', permission: ['admin'] },
        children: [
          {
            path: '/admin/user',
            component: RouteView,
            meta: { title: '用户管理', icon: 'user', permission: ['admin'] },
            redirect: '/admin/user-management',
            children: [
              {
                path: '/admin/user-management',
                name: 'User',
                component: () => import('@/views/admin/User'),
                meta: { title: '用户管理', keepAlive: true, permission: ['admin'] }
              },
              {
                path: '/admin/usergroup',
                name: 'UserGroup',
                component: () => import('@/views/admin/UserGroup'),
                meta: { title: '用户组管理', keepAlive: true, permission: ['admin'] }
              }
            ]
          },
          {
            path: '/device/manage',
            component: RouteView,
            meta: { title: '设备管理', icon: 'laptop', permission: ['admin'] },
            redirect: '/device/manage/device',
            children: [
              {
                path: '/device/manage/device',
                name: 'Device',
                component: () => import('@/views/device/Device'),
                meta: { title: '设备管理', keepAlive: true, permission: ['admin'] }
              },
              {
                path: '/device/manage/devicetype',
                name: 'DeviceType',
                component: () => import('@/views/device/DeviceType'),
                meta: { title: '设备类型', keepAlive: false, permission: ['admin'] }
              },
              {
                path: '/device/manage/parameter',
                name: 'Parameter',
                component: () => import('@/views/device/Parameter'),
                meta: { title: '参数管理', keepAlive: true, permission: ['admin'] }
              }
            ]
          },
          {
            path: '/customer/manage',
            component: RouteView,
            meta: { title: '客户管理', icon: 'idcard', permission: ['admin'] },
            redirect: '/customer/manage/customer',
            children: [
              {
                path: '/customer/manage/customer',
                name: 'Customer',
                component: () => import('@/views/customer/Customer'),
                meta: { title: '客户管理', keepAlive: true, permission: ['admin'] }
              }
            ]
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true, permission: ['admin'] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
