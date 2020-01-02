<template>
  <div class="headerBg">
    <div class="header">
      <div class="nav">
        <div class="logo fn-left">
          <img src="../../assets/public/logo.png" />
          <span>中正{{ userInfo.industry }}舆情云AI平台</span>
        </div>
        <ul class="fn-left">
          <li
            v-for="(list, index) of menuList"
            :key="index"
            @click="navClick(list, index)"
            @mouseover="navHover(index)"
            @mouseleave="navLeave"
          >
            <span
              v-if="(currentIndex === index && list.path !== '/search') || (hoverIndex === index && list.path !== '/search')"
              v-bind:class="list.path === '/home' ? 'shortHoverBg' : 'longHoverBg'"
            ></span>
            <router-link :to="list.path" :target="list.target">{{list.name}}</router-link>
          </li>
        </ul>
        <div class="download">
          <i class="app-download" @mouseenter="qcodeShow" @mouseleave="qcodeHide"></i>
          <div class="qcode" v-if="showCode"></div>
        </div>
        <div
          class="mySelf fn-right"
          @mouseover="showMyselfMenu('over')"
          @mouseout="showMyselfMenu('out')"
        >
          <span class="centerIcon fn-left"></span>
          <div class="userInfo fn-left">
            <p :title="userInfo.username">{{userInfo.username | sliceFilter(8)}}</p>
            <p>—&nbsp;用户：{{userInfo.userId}}&nbsp;—</p>
          </div>
          <div class="nav-myself" v-show="isShowMyselfMenu">
            <ul>
              <li
                :class="{'active': index === myselfMenuCurrentIndex, 'region': userInfo.region === 1}"
                v-for="(menu, index) of myselfMenu"
                :key="index"
                @click="toggleMyselfMenu(menu, index)"
                @mouseover="showMyselfMenu('over')"
                @mouseout="showMyselfMenu('out')"
              >
                <i></i>
                <span>{{ menu.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
import { Base64 } from 'js-base64'
import { getLocalStorage, initFun } from '../../common/js/cookie'

export default {
  data() {
    return {
      currentIndex: 0,
      hoverIndex: '',
      showCode: false,
      userInfo: {
        username: '',
        userId: '',
        region: '',
        industry: ''
      },
      myselfMenu: [],
      myselfMenuCurrentIndex: 0,
      isShowMyselfMenu: false,
      menuList: [],
      menuIndex: [],
      screenWidth: document.body.clientWidth,
      myselfMenuRight: 340
    }
  },
  created() {
    if (initFun()) {
      let menuObj = {}
      if (
        getLocalStorage('userInfo') &&
        JSON.parse(getLocalStorage('userInfo'))['userName']
      ) {
        this.userInfo.username = JSON.parse(getLocalStorage('userInfo'))['userName']
      }
      if (
        getLocalStorage('userInfo') &&
        JSON.parse(getLocalStorage('userInfo'))['userId']
      ) {
        this.userInfo.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
      }
      if (
        getLocalStorage('userInfo') &&
        JSON.parse(getLocalStorage('userInfo'))['region']
      ) {
        this.userInfo.region = JSON.parse(getLocalStorage('userInfo'))['region']
      }
      if (
        getLocalStorage('userInfo') &&
        JSON.parse(getLocalStorage('userInfo'))['industry']
      ) {
        this.userInfo.industry = JSON.parse(getLocalStorage('userInfo'))['industry']
      }
      if (
        getLocalStorage('userInfo') &&
        JSON.parse(getLocalStorage('userInfo'))['menuAuth']
      ) {
        menuObj = JSON.parse(
          Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])
        )
      }
      menuObj['menuList'].unshift({ name: '个人中心', path: '' })
      menuObj['menuList'].push({ name: '退出登录', path: '/login' })
      this.myselfMenu = menuObj['menuList']
      this.menuIndex = menuObj['menuAuth']
      let path = this.$route.path
      this.currentRouter(path)
      this.menuResolve(menuObj['menuAuth'])
    } else {
      this.$router.replace({
        path: '/login'
      })
    }
  },
  mounted() {
    this.$bus.on('setMyselfMenuIndex', index => {
      this.myselfMenuCurrentIndex = index
    })
  },
  beforeDestroy() {
    this.$bus.off('setMyselfMenuIndex')
  },
  methods: {
    menuResolve: function(list) {
      let _this = this
      list.forEach(function(item) {
        switch (item) {
          case 'home':
            _this.menuList.push({
              name: '首页',
              path: '/home'
            })
            break
          case 'monitor':
            _this.menuList.push({
              name: '舆情监测',
              path: '/monitor'
            })
            break
          case 'analysis':
            _this.menuList.push({
              name: '舆情分析',
              path: '/analysis'
            })
            break
          case 'warning':
            _this.menuList.push({
              name: '舆情预警',
              path: '/warning'
            })
            break
          case 'search':
            _this.menuList.push({
              name: '中正云搜',
              path: '/search',
              target: '_blank'
            })
            break
          case 'report':
            _this.menuList.push({
              name: '舆情报告',
              path: '/report'
            })
            break
          case 'follow':
            _this.menuList.push({
              name: '我的关注',
              path: '/follow'
            })
            break
          default:
            break
        }
      })
    },
    navClick: function(list, index) {
      if (list.path.indexOf('search') === -1) {
        this.currentIndex = index
      }
    },
    navHover: function(index) {
      this.hoverIndex = index
    },
    navLeave: function() {
      this.hoverIndex = ''
    },
    qcodeShow: function () {
      this.showCode = true
    },
    qcodeHide: function () {
      this.showCode = false
    },
    myselfClick: function() {
      this.$router.push({
        path: '/myself/themeSetting',
        name: '主题设置-个人中心'
      })
      this.currentIndex = ''
    },
    showMyselfMenu: function(type) {
      if (type === 'over') {
        this.isShowMyselfMenu = true
      } else {
        this.isShowMyselfMenu = false
      }
    },
    toggleMyselfMenu: function(menu, index) {
      if (menu.name !== '退出登录') {
        this.$router.push({
          path: menu.path
        })
        this.myselfMenuCurrentIndex = index
        this.currentIndex = ''
      } else {
        this.$emit('openLogoutDialog')
      }
    },
    currentRouter: function(pathStr) {
      if (pathStr === '/') {
        this.currentIndex = 0
        return
      }
      let path = pathStr.split('/')[1]
      this.currentIndex = this.menuIndex.indexOf(path)
      if (path !== 'myself') {
        this.myselfMenuCurrentIndex = 0
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.currentRouter(val.path)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../common/less/common";
.headerBg {
  width: 100%;
  height: 73px;
  margin-bottom: 10px;
  background: #eeeeee;
  position: fixed;
  z-index: 20;

  .header {
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
    background: #033d69;

    & div.nav {
      width: 1200px;
      height: 100%;
      margin: 3px auto;

      & div.logo {
        & img {
          margin-top: 8px;
          margin-left: 21px;
        }

        & span {
          display: block;
          margin-top: 4px;
          font-family: "SimHei", "Microsoft YaHei", serif;
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
        }
      }

      & ul {
        width: auto;
        height: 100%;
        line-height: 70px;
        margin-left: 36px;
        font-size: 18px;

        & li {
          text-align: center;
          float: left;
          position: relative;
          margin-left: -33px;

          & a:focus {
            outline: none;
          }

          & span.shortHoverBg {
            position: absolute;
            top: -2px;
            left: 0;
            width: 112px;
            height: 75px;
            display: inline-block;
            background: url("../../assets/menu/img_homepage_chect_short.png")
              no-repeat -8px -4px;
          }

          & span.longHoverBg {
            position: absolute;
            top: -2px;
            left: 0;
            width: 150px;
            height: 75px;
            display: inline-block;
            background: url("../../assets/menu/img_homepage_chect_long.png")
              no-repeat -8px -4px;
          }

          & a {
            width: auto;
            height: auto;
            color: white;
            text-decoration: none;
            display: inline-block;
            position: relative;
            padding: 0 40px;
          }
        }
      }
      .download {
        position: relative;
        float: left;
        width: 24px;
        height: 29px;
        margin-left: 10px;
        margin-top: 20px;
        .app-download {
          width: 100%;
          height: 100%;
          display: block;
          background: url("../../assets/menu/APP.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        .qcode {
          position: absolute;
          top: 50px;
          left: -10px;
          width: 143px;
          height: 164px;
          background: url("../../assets/menu/download.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      & div.mySelf {
        min-width: 196px;
        line-height: 70px;
        color: white;

        & span.centerIcon {
          display: inline-block;
          width: 40px;
          height: 70px;
          background: url("../../assets/search/img_user.png") no-repeat 0 16px;
        }

        & div.userInfo {
          margin-top: 15px;
          padding-left: 10px;
          font-size: 13px;

          & p {
            line-height: 20px;
            text-align: center;
          }
        }

        .nav-myself {
          position: relative;
          margin-top: 71px;
          width: 194px;
          z-index: 10;

          & ul {
            position: absolute;
            top: 0;
            left: -50px;

            & li {
              padding: 0;
              margin: 0;
              width: 194px;
              line-height: 48px;
              height: 48px;
              text-align: center;
              font-size: 14px;
              background: #ffffff;
              color: #000;
              border-left: 1px solid #d2d2d2;
              border-right: 1px solid #d2d2d2;
            }

            & li:first-child {
              font-size: 18px;
              color: #0068b7;
              border-bottom: 1px solid #e5e5e5;

              & i {
                position: absolute;
                top: 9px;
                left: 42px;
                display: block;
                width: 30px;
                height: 30px;
                background: url("../../assets/myself/scripts_myself.png")
                  no-repeat -50px 0;
              }

              & span {
                padding-left: 20px;
              }
            }

            & li:last-child {
              border-bottom: 1px solid #d2d2d2;
            }

            & li:nth-child(4).region {
              border-bottom: 1px solid #e5e5e5;
            }

            & li:nth-child(7).region {
              border-bottom: 1px solid #e5e5e5;
            }

            & li:nth-child(4) {
              border-bottom: 0;
            }

            & li:nth-child(7) {
              border-bottom: 0;
            }

            & li:nth-child(3).region {
              border-bottom: 0;
            }

            & li:nth-child(6).region {
              border-bottom: 0;
            }

            & li:nth-child(3) {
              border-bottom: 1px solid #e5e5e5;
            }

            & li:nth-child(6) {
              border-bottom: 1px solid #e5e5e5;
            }

            & li:nth-child(2):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(2).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(3):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(3).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(4):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(4).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(5):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(5).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(6):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(6).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(7):hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:nth-child(7).active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:last-child:hover {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }

            & li:last-child.active {
              background: #0068b7;
              color: #ffffff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
