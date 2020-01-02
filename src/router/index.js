import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    name: '登录',
    component: (resolve) => require(['../components/login/login'], resolve)
  }, {
    path: '/',
    name: '首页',
    component: (resolve) => require(['../components/home/home'], resolve)
  }, {
    path: '/home',
    name: '首页',
    component: (resolve) => require(['../components/home/home'], resolve)
  }, {
    path: '/monitor',
    name: '舆情监测',
    component: (resolve) => require(['../components/monitor/monitor'], resolve)
  }, {
    path: '/analysis',
    name: '舆情监测',
    component: (resolve) => require(['../components/analysis/analysis'], resolve),
    children: [{
      path: '',
      name: '舆情总体分析',
      component: (resolve) => require(['../components/analysis/totalityAnalysis'], resolve)
    }, {
      path: '/analysis/totality',
      name: '舆情总体分析',
      component: (resolve) => require(['../components/analysis/totalityAnalysis'], resolve)
    }, {
      path: '/analysis/recent',
      name: '近期风险分析',
      component: (resolve) => require(['../components/analysis/recentAnalysis'], resolve)
    }, {
      path: '/analysis/weiBo',
      name: '微博专项分析',
      component: (resolve) => require(['../components/analysis/weiboAnalysis'], resolve)
    }]
  }, {
    path: '/warning',
    name: '舆情预警',
    component: (resolve) => require(['../components/warning/warning'], resolve)
  }, {
    path: '/search',
    name: '中正云搜',
    component: (resolve) => require(['../components/search/search'], resolve)
  }, {
    path: '/report',
    name: '舆情报告',
    component: (resolve) => require(['../components/report/report'], resolve)
  }, {
    path: '/follow',
    name: '我的关注',
    component: (resolve) => require(['../components/follow/follow'], resolve)
  }, {
    path: '/myself',
    name: '个人中心',
    component: (resolve) => require(['../components/myself/myself'], resolve),
    children: [{
        path: 'themeSetting',
        name: '主题设置',
        component: (resolve) => require(['../components/myself/themeSetting.vue'], resolve)
      }, {
        path: 'accountAdd',
        name: '账号设置',
        component: (resolve) => require(['../components/myself/accountAdd'], resolve)
      }, {
        path: 'sourceAdd',
        name: '信源添加',
        component: (resolve) => require(['../components/myself/sourceAdd'], resolve)
      }, {
        path: 'basicInfomation',
        name: '基本信息-个人中心',
        component: (resolve) => require(['../components/myself/basicInfomation'], resolve)
      }, {
        path: 'changePassword',
        name: '密码修改',
        component: (resolve) => require(['../components/myself/changePassword'], resolve)
      }, {
        path: 'about',
        name: '关于中正',
        component: (resolve) => require(['../components/myself/about'], resolve)
      }
    ]
  }
]

let router = new Router({
  mode: 'history',
  routes: constantRouterMap
})

export default router
