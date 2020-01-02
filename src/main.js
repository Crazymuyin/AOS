
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './components/index'
import router from './router/index'
import Vuex from 'vuex'
import store from './vuex/store'
import bus from 'vue-bus'
import VueLoading from 'vue-loading-template'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
// 字符云
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
import china from 'echarts/map/json/china'
// import layer from 'vue2-layer-mobile'
import layer from 'vue-layer'
import noData from './components/component/vue-noData'
import filter from './common/js/service/filterService'
import axios from './common/js/service/axiosTool'
import dayjs from 'dayjs'
import VueParticles from 'vue-particles'
import {getCookie, setCookie} from './common/js/cookie'
import 'babel-polyfill'

echarts.registerMap('china', china)
Vue.use(Vuex)
// Vue.use(layer)
Vue.use(VueLoading)
Vue.use(noData)
Vue.use(VueParticles)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.component('VueLoading', VueLoading)
Vue.component('VueNoData', noData)
Vue.use(bus)
Vue.prototype.$layer = layer(Vue, {
  msgtime: 2
})
Vue.prototype.$dayjs = dayjs
Vue.prototype.$echarts = echarts
Vue.use(echarts)
Vue.prototype.globalClick = function(callback) {
  document.getElementById('body').onclick = function ($event) {
    callback($event)
  }
}
// false 阻止 vue 启动时生成生产提示
Vue.config.productionTip = false

// Vue.config.devtools = true
// vue-performance-devtool chrome插件 vue性能开发工具 创建 Vue 实例之前
// Vue.config.performance = process.env.NODE_ENV !== 'production'

// 中断未完成请求
let pending = []

router.beforeEach((to, from, next) => {
  let routeName = to.meta.name || to.name
  window.document.title = (routeName ? routeName + ' - ' : '') + 'AOS监测版'
  if (getCookie('auth')) {
    // console.log(getCookie('auth'))
    let dateTime = 1000 * 60 * 30
    setCookie('auth', getCookie('auth'), dateTime)
  }
  pending.forEach((item, index) => {
      item.Cancel() // 取消请求
      pending.splice(index, 1) // 移除当前请求记录
  })
  next()
})

Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
})
