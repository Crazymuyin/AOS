<template>
  <div class="wrapper">
    <div class="wrapper-left" :style="leftHeight">
      <div class="menu-title">
        <div class="icon-menu"></div>
        <span>个人中心</span>
      </div>
      <div class="menu-list">
        <ul v-for="(list, index) of menuList" :key="list.name">
          <li :class="{'active': index === menuCurrentIndex}" @click="toggleMenu(list, index)">
            <!--<router-link :to="list.path">{{list.name}}</router-link>-->
            {{ list.name }}
          </li>
        </ul>
      </div>
    </div>
    <router-view @resetMenuIndex="resetMenuIndex"></router-view>
  </div>
</template>

<script>
  import {
    Base64
  } from 'js-base64'
  import {
    getLocalStorage,
    initFun
  } from '../../common/js/cookie'

  export default {
    name: 'myself',
    data() {
      return {
        userInfo: { region: true },
        leftHeight: {
          'min-height': ((document.body.clientHeight - 138) > 810 ? (document.body.clientHeight - 138) : 810) + 'px'
        },
        contentHeight: {
          'min-height': ((document.body.clientHeight - 194) > 810 ? (document.body.clientHeight - 194) : 810) + 'px'
        },
        menuCurrentIndex: 0,
        menuList: []
      }
    },
    created() {
      if (initFun()) {
        let menuList = JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth']))['menuList']
        this.menuList = menuList
        this.defaultCurrentMenuIndex(menuList)
      } else {
        this.$router.push({ path: '/login', name: '登录' })
      }
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.leftHeight['min-height'] = `${(document.body.clientHeight - 138) > 810 ? (document.body.clientHeight - 138) : 810}px`
          this.$bus.emit('contentHeightEmit', `${(document.body.clientHeight - 194) > 810 ? (document.body.clientHeight - 194) : 810}px`)
        })()
      }
    },
    methods: {
      toggleMenu: function (list, index) {
        if (this.$store.state.themeInit) {
          this.$bus.emit('confirmSaveTheme', true, list.path)
          return false
        }
        this.menuCurrentIndex = index
        this.$router.replace({
          path: list.path
        })
      },
      resetMenuIndex: function (index) {
        this.menuCurrentIndex = index
        this.$bus.emit('setMyselfMenuIndex', index + 1)
      },
      msg: function (msg) {
        this.$layer.open({
          content: msg,
          skin: 'msg',
          time: 2,
          className: 'custom-class'
        })
      },
      defaultCurrentMenuIndex(menuList) {
        menuList.forEach((item, index) => {
          if (item.path === this.$route.path) {
            this.menuCurrentIndex = index
          }
        })
      }
    },
    watch: {
      $route: {
        handler: function (newValue, oldValue) {
          let menuList = JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth']))['menuList']
          menuList.forEach((item, index) => {
            if (item.path === newValue.path) {
              this.menuCurrentIndex = index
            }
          })
        },
        deep: true,
        immediate: true
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../common/less/common";

  .wrapper {
    width: 1200px;
    .flexRow(space-between, flex-start);

    .wrapper-left {
      background: #ffffff;
      width: 220px;
      /*height: 1418px;*/
      .flexColumn(flex-start, center);
      background: #ffffff;

      .menu-title {
        width: 220px;
        height: 46px;
        line-height: 46px;
        .flexRow(center, center);

        .icon-menu {
          width: 30px;
          height: 30px;
          background: url("../../assets/myself/scripts_myself.png") no-repeat -50px 0;
        }

        & span {
          font-size: 18px;
          color: #0068b7;
        }
      }

      .menu-list {
        width: 220px;
        height: 48px;

        & ul {
          & li {
            line-height: 48px;
            text-align: center;
            font-size: 16px;
          }

          & li:hover {
            background: #0068b7;
            color: #ffffff;
            cursor: pointer;

            & a {
              color: white;
              text-decoration: none;
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }

          & li.active {
            background: #0068b7;
            color: #ffffff;
            cursor: pointer;

            & a {
              color: white;
              text-decoration: none;
            }
          }
        }
      }
    }
  }

</style>
