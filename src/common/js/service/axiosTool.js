/**
 * Author: CH
 * Created by 2018-12-26
 * Address: http://www.sourcelovers.com
 */
import Vue from 'vue'
import axios from 'axios'
import router from '../../../router/index'
import {delCookie, getCookie} from '../cookie'

const qs = require('qs')
// 取消请求
let CancelToken = axios.CancelToken
let pending = []

// 设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest'
// }

// 请求超时的时间限制
axios.defaults.timeout = 20000

let cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (config) {
      if (item.UrlPath === config.url) {
        if (item.UrlPath.indexOf('getAnnular') === -1 && item.UrlPath.indexOf('getSourceName') === -1) {
          item.Cancel() // 取消请求
          pending.splice(index, 1) // 移除当前请求记录
        }
      }
    } else {
      if (item.UrlPath.indexOf('getAnnular') === -1 && item.UrlPath.indexOf('getSourceName') === -1) {
        item.Cancel() // 取消请求
        pending.splice(index, 1) // 移除当前请求记录
      }
    }
  })
}

// 开始设置请求 发起的拦截处理
axios.interceptors.request.use(config => {
  // console.log(config)
  if (config.url.indexOf('login') === -1) {
    if (getCookie('auth')) {
      if (typeof config.params !== 'undefined') {
        if (config.params.hasOwnProperty('taskId')) {
          if (config.params['taskId']) {
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          } else {
            router.push('/login')
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          }
        } else if (config.params.hasOwnProperty('userId')) {
          if (config.params['userId']) {
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          } else {
            router.push('/login')
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          }
        } else if (config.params.hasOwnProperty('username')) {
          if (config.params['username']) {
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          } else {
            router.push('/login')
            cancelPending(config)
            config.cancelToken = new CancelToken(res => {
              pending.push({UrlPath: config.url, Cancel: res})
            })
            return config
          }
        } else {
          cancelPending(config)
          config.cancelToken = new CancelToken(res => {
            pending.push({UrlPath: config.url, Cancel: res})
          })
          return config
        }
      } else {
        cancelPending(config)
        config.cancelToken = new CancelToken(res => {
          pending.push({UrlPath: config.url, Cancel: res})
        })
        return config
      }
      // cancelPending(config)
      // config.cancelToken = new CancelToken(res => {
      //   pending.push({UrlPath: config.url, Cancel: res})
      // })
      // return config
    } else {
      router.push('/login')
      cancelPending(config)
      config.cancelToken = new CancelToken(res => {
        pending.push({UrlPath: config.url, Cancel: res})
      })
      return config
    }
  } else {
    cancelPending(config)
    config.cancelToken = new CancelToken(res => {
      pending.push({UrlPath: config.url, Cancel: res})
    })
    return config
  }
}, error => {
  return Promise.reject(error)
})

// 请求到结果的拦截处理
axios.interceptors.response.use(config => {
  if (config.data.message === '身份验证失败' && config.data.status === 0) {
    delCookie('auth')
    router.push({path: '/login'})
  } else {
    return config.data
  }
}, error => {
  // console.log('interceptors===>' + error)
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break
      case 401:
        error.message = '未授权，请重新登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else if (String(error).indexOf('Network Error') !== -1) {
    error.message = 'Network Error'
  } else {
    error.message = ''
  }
  return Promise.reject(error.message)
})

Vue.prototype.$all = function (funArr) {
  if (getCookie('auth')) {
    return new Promise((resolve, reject) => {
      axios.all(funArr).then(axios.spread((total, just, well, loss) => {
        let arr = {total: [], just: [], well: [], loss: [], status: 0}
        if (total) if (total.status === 1 && Array.isArray(total.data) && total.data.length) arr.total = total.data
        if (just) if (just.status === 1 && Array.isArray(just.data) && just.data.length) arr.just = just.data
        if (well) if (well.status === 1 && Array.isArray(well.data) && well.data.length) arr.well = well.data
        if (loss) if (loss.status === 1 && Array.isArray(loss.data) && loss.data.length) arr.loss = loss.data
        arr.status = total.status
        arr.message = total.message
        resolve(arr)
      })).catch(error => {
        reject(error)
      })
    })
  } else {
    router.push({path: '/login'})
  }
}

Vue.prototype.$riskAll = function (urlArr) {
  if (getCookie('auth')) {
    return new Promise((resolve, reject) => {
      axios.all(urlArr).then(axios.spread((data, exPain) => {
        let arr = {data: [], exPain: '', status: 0}
        if (data) if (data.status === 1 && Array.isArray(data.data) && data.data.length) arr.data = data.data
        if (exPain) if (exPain.status === 1 && exPain.data) arr.exPain = exPain.data
        arr.status = data.status
        arr.message = data.message
        resolve(arr)
      })).catch(error => {
        reject(error)
      })
    })
  } else {
    router.push({path: '/login'})
  }
}

// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
Vue.prototype.$post = function (url, params) {
  if (getCookie('auth')) {
    params.auth = getCookie('auth')
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params)).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  } else {
    router.push({path: '/login'})
  }
}

// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
Vue.prototype.$get = function (url, params) {
  if (url.indexOf('login') !== -1) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(response => {
        resolve(response) // 返回请求成功的数据 data
      }).catch(error => {
        reject(error)
      })
    })
  } else if (getCookie('auth')) {
    params.auth = getCookie('auth')
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(response => {
        resolve(response) // 返回请求成功的数据 data
      }).catch(error => {
        reject(error)
      })
    })
  } else {
    router.push({path: '/login'})
  }
}

export default axios
