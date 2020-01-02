import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let accountIp = document.location.origin + '/aos/'
accountIp = 'https://aosm.lanjicloud.com/aos/'
// 192.168.10.215
const store = new Vuex.Store({
  state: {
    url: accountIp,
    userName: '',
    roleName: '',
    perms: '',
    userSn: '',
    user_id: '',
    taskInfo: {
      taskName: '',
      remark: '',
      keyWord: '',
      sourceInit: '',
      sourceList: []
    },
    themeInit: ''
  },
  mutations: {
    newUrl(state, msg) {
      state.url = msg
    },
    newUserName(state, msg) {
      state.userName = msg
    },
    newRoleName(state, msg) {
      state.roleName = msg
    },
    newPerms(state, msg) {
      state.perms = msg
    },
    newUserSn(state, msg) {
      state.userSn = msg
    },
    newUserId(state, msg) {
      state.user_id = msg
    },
    newTaskInfo(state, msg) {
      state.taskInfo[msg.key] = msg.value
    },
    newThemeInit(state, msg) {
      state.themeInit = msg
    }
  }
})

export default store
