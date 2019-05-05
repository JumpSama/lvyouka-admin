import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-person',
      title: '用户管理',
      access: ['user', 'role', 'site']
    },
    component: Main,
    children: [
      {
        path: 'user_list',
        name: 'user_list',
        meta: {
          icon: 'md-list',
          title: '用户列表',
          access: ['user']
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: 'role_list',
        name: 'role_list',
        meta: {
          icon: 'logo-buffer',
          title: '角色管理',
          access: ['role']
        },
        component: () => import('@/view/user/role.vue')
      },
      {
        path: 'site_list',
        name: 'site_list',
        meta: {
          icon: 'md-apps',
          title: '场所管理',
          access: ['site']
        },
        component: () => import('@/view/user/site.vue')
      }
    ]
  },
  {
    path: '/member',
    name: 'member',
    meta: {
      icon: 'md-people',
      title: '会员管理',
      access: ['member', 'temp_member', 'card', 'use_card']
    },
    component: Main,
    children: [
      {
        path: 'member_list',
        name: 'member_list',
        meta: {
          icon: 'md-list',
          title: '会员列表',
          access: ['member']
        },
        component: () => import('@/view/member/index.vue')
      },
      {
        path: 'member_approve',
        name: 'member_approve',
        meta: {
          icon: 'md-checkmark-circle',
          title: '虚拟卡审核',
          access: ['temp_member']
        },
        component: () => import('@/view/member/approve.vue')
      },
      {
        path: 'card_list',
        name: 'card_list',
        meta: {
          icon: 'md-card',
          title: '卡片管理',
          access: ['card']
        },
        component: () => import('@/view/member/card.vue')
      },
      {
        path: 'use_card',
        name: 'use_card',
        meta: {
          icon: 'md-checkmark-circle-outline',
          title: '刷卡',
          access: ['use_card']
        },
        component: () => import('@/view/member/useCard.vue')
      }
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    meta: {
      icon: 'md-star',
      title: '积分商城',
      access: ['commodity', 'order']
    },
    component: Main,
    children: [
      {
        path: 'commodity',
        name: 'commodity',
        meta: {
          icon: 'md-pricetag',
          title: '商品管理',
          access: ['commodity']
        },
        component: () => import('@/view/shop/commodity.vue')
      },
      {
        path: 'order',
        name: 'order',
        meta: {
          icon: 'md-appstore',
          title: '订单管理',
          access: ['order']
        },
        component: () => import('@/view/shop/order.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      access: ['config', 'log']
    },
    component: Main,
    children: [
      {
        path: 'config',
        name: 'config',
        meta: {
          icon: 'md-construct',
          title: '系统设置',
          access: ['config']
        },
        component: () => import('@/view/system/config.vue')
      },
      {
        path: 'log',
        name: 'log',
        meta: {
          icon: 'md-list',
          title: '操作日志',
          access: ['log']
        },
        component: () => import('@/view/system/log.vue')
      }
    ]
  },
  {
    path: '/distribution',
    name: 'distribution',
    meta: {
      icon: 'ios-people',
      title: '分销管理',
      access: ['distribution', 'withdraw', 'withdraw_approve']
    },
    component: Main,
    children: [
      {
        path: 'distribution_list',
        name: 'distribution_list',
        meta: {
          icon: 'logo-buffer',
          title: '分销',
          access: ['distribution']
        },
        component: () => import('@/view/distribution/list.vue')
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        meta: {
          icon: 'logo-usd',
          title: '提现',
          access: ['withdraw']
        },
        component: () => import('@/view/distribution/withdraw.vue')
      },
      {
        path: 'withdraw_approve',
        name: 'withdraw_approve',
        meta: {
          icon: 'md-checkmark-circle',
          title: '提现审核',
          access: ['withdraw_approve']
        },
        component: () => import('@/view/distribution/approve.vue')
      }
    ]
  },
  {
    path: '/stats',
    name: 'stats',
    meta: {
      icon: 'md-stats',
      title: '统计',
      access: ['card_stats', 'wechat_stats', 'total_stats', 'used_list', 'used_stats']
    },
    component: Main,
    children: [
      {
        path: 'card_stats',
        name: 'card_stats',
        meta: {
          icon: 'md-card',
          title: '线下开卡续费详情',
          access: ['card_stats']
        },
        component: () => import('@/view/stats/card.vue')
      },
      {
        path: 'wechat_stats',
        name: 'wechat_stats',
        meta: {
          icon: 'ios-at-outline',
          title: '线上开卡续费详情',
          access: ['wechat_stats']
        },
        component: () => import('@/view/stats/wechat.vue')
      },
      {
        path: 'total_stats',
        name: 'total_stats',
        meta: {
          icon: 'md-stats',
          title: '开卡续费统计',
          access: ['total_stats']
        },
        component: () => import('@/view/stats/total.vue')
      },
      {
        path: 'used_list',
        name: 'used_list',
        meta: {
          icon: 'md-checkmark-circle-outline',
          title: '刷卡详情',
          access: ['used_list']
        },
        component: () => import('@/view/stats/usedList.vue')
      },
      {
        path: 'used_stats',
        name: 'used_stats',
        meta: {
          icon: 'md-stats',
          title: '刷卡统计',
          access: ['used_stats']
        },
        component: () => import('@/view/stats/used.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
