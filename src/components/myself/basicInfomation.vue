<template>
  <div class="wrapper-basicInfomation">
    <div class="wrapper-title">
      <span>基本信息</span>
    </div>
<!--    <div class="wrapper-content" :style="contentHeight">-->
    <div class="wrapper-content" style="height: 754px">
      <ul v-for="(list, index) of userInfo" :key="index">
        <li>
          <span>{{ list.name }}</span>
          <span>{{ list.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import { initFun, getLocalStorage } from '../../common/js/cookie'

  export default {
    name: 'basicInfomation',
    data () {
      return {
        // contentHeight: {
        //   'min-height': document.body.clientHeight - 194 + 'px'
        // },
        userInfo: [
          { name: '用户名：', value: '' },
          { name: '注册时间：', value: '' },
          { name: '停用时间：', value: '' }
        ]
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo')) {
          let userInfo = JSON.parse(getLocalStorage('userInfo'))
          this.userInfo[0].value = userInfo['userName']
          this.userInfo[1].value = userInfo['registerTime']
          this.userInfo[2].value = userInfo['endTime']
          JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])).menuList.forEach((item, index) => {
            if (item.name === '基本信息') {
              this.$emit('resetMenuIndex', index)
            }
          })
        } else {
          this.$layer.msg('浏览器本地存储数据获取失败或被恶意删除，请重新登录')
          this.$router.replace({path: '/login'})
        }
      } else {
        this.$router.replace({path: '/login'})
      }
    },
    mounted() {
      this.$bus.on('contentHeightEmit', (height) => {
        this.contentHeight = `min-height: ${height}px`
      })
    },
    beforeDestroy() {
      this.$bus.off('contentHeightEmit')
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/common";
  .wrapper-basicInfomation {
    width: 970px;
    .flexColumn(center, center);
    .wrapper-title {
      width: 968px;
      height: 48px;
      border: 1px solid #dcdcdc;
      background: #ffffff;
      .flexRow(flex-start, center);
      & span {
        height: 32px;
        line-height: 32px;
        font-size: 18px;
        color: #333333;
        padding-left: 10px;
        font-weight: 600;
        font-family: "Microsoft YaHei";
        border-left: 5px solid #0068b7;
      }
    }
    .wrapper-content {
      position: relative;
      width: 968px;
      height: 755px;
      margin-top: 5px;
      border: 1px solid #dcdcdc;
      border-bottom: 0;
      background: #ffffff;
      & ul {
        width: 90%;
        margin-top: 20px;
        margin-left: 80px;
        & li {
          width: 100%;
          height: 32px;
          margin: 8px 0;
          line-height: 32px;
          font-size: 14px;
          text-align: left;
          & span:first-child {
            width: 75px;
            float: left;
            text-align: right;
            padding-right: 5px;
          }
          & span:last-child {
            width: 340px;
            height: 32px;
            padding-left: 10px;
            line-height: 32px;
            display: block;
            float: left;
            background: #dff3fc;
          }
        }
      }
    }
  }
</style>
