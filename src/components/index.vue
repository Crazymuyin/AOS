<template>
  <div class="mainClass">
    <div v-bind:class="classObject"></div>
    <v-header v-if="headerBox" @openLogoutDialog="openLogoutDialog()"></v-header>
    <div class="main" :style="height">
      <router-view></router-view>
    </div>
    <v-footer v-if="headerBox"></v-footer>
    <div class="mask-layer" v-if="isShowMaskLayer"></div>
    <div class="logout" v-if="isShowMaskLayer">
      <div class="header">
        <span>退出登录</span>
        <i class="el-icon-circle-close" @click="handleCancel()"></i>
      </div>
      <div class="content">
        <span>您确定要退出登录吗？</span>
      </div>
      <div class="footer">
        <el-button type="info" @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleLogout()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
import Header from './component/header'
import Footer from './component/foot'

export default {
  name: 'index',
  data() {
    return {
      isShowMaskLayer: false,
      headerBox: false,
      classObject: 'login-bg',
      height: {
        'min-height': document.body.clientHeight - 137 + 'px'
      }
    }
  },
  created() {
    if (this.$route.path === '/login' || this.$route.path === '/search') {
      this.classHide()
    } else {
      this.classShow()
    }
  },
  mounted() {
    const _this = this
    window.onresize = () => {
      return (() => {
        _this.height['min-height'] = `${document.body.clientHeight - 137}px`
      })()
    }
  },
  methods: {
    openLogoutDialog() {
      this.isShowMaskLayer = true
    },
    handleCancel() {
      this.isShowMaskLayer = false
    },
    /**
     * * 退出登录
     * ! 因退出登录接口低概率下会报错
     * ? 目前采取方案 关闭遮罩层-跳转至登录页-发送清空token的请求
     * TODO 异常处理
     */
    async handleLogout() {
      try {
        this.isShowMaskLayer = false
        this.$router.replace({ path: '/login' })
        let url = this.$store.state.url + 'auth/logout'
        await this.$get(url, {})
      } catch (error) {
        // I don't know what should I do.
        // this.$layer.msg('token清空失败')
      }
    },
    classShow: function() {
      this.headerBox = true
      this.classObject = 'home-bg'
    },
    classHide: function() {
      this.headerBox = false
      this.classObject = 'login-bg'
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/login' || to.path === '/search') {
        this.classHide()
      } else {
        this.classShow()
      }
    }
  },
  components: {
    'v-header': Header,
    'v-footer': Footer
  }
}
</script>

<style scoped lang="less">
.mainClass {
  width: 100%;
  height: auto;
  background: #eeeeee;
  .main {
    width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
    padding-top: 85px;
  }
  .mask-layer {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    background: #000;
    opacity: 0.29;
  }
  .logout {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 200px;
    background: #fff;
    z-index: 1000;
    border: 1px solid #ccc;
    .header {
      width: 100%;
      height: 32px;
      line-height: 32px;
      background: #f8f8f8;
      & span {
        padding-left: 20px;
      }
      & i {
        float: right;
        margin-top: 8px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 109px;
      line-height: 130px;
      text-align: center;
    }
    .footer {
      width: 100%;
      height: 60px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      & button:first-child {
        margin-right: 50px;
      }
    }
  }
}
</style>
