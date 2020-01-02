<template>
  <div class="wrapper-changePassword">
    <div class="wrapper-title">
      <span>密码修改</span>
    </div>
<!--    <div class="wrapper-content" :style="contentHeight">-->
    <div class="wrapper-content" style="height: 754px">
      <div>
        <ul class="myself_ul_pwd clearfix">
          <li>原始密码：</li>
          <li class="password">
            <input v-if="isDisplayPwd.oldStatus" type="password" placeholder="" name="oldpawd" v-model="userInfo.originalPassword">
            <input v-if="!isDisplayPwd.oldStatus" type="text" placeholder="" name="oldpawd" v-model="userInfo.originalPassword">
            <i class="bgImg" :class="{ 'bgImgClick': isDisplayPwd.oldStatus }" @click="passwordeye('old')"></i>
          </li>
          <li><p>{{ tips.originalTip }}</p></li>
        </ul>
        <ul class="myself_ul_pwd clearfix">
          <li>新密码：</li>
          <li class="password">
            <input v-if="isDisplayPwd.newStatus" type="password" placeholder="请输入新密码" name="NewPassword" v-model="userInfo.newPassword">
            <input v-if="!isDisplayPwd.newStatus" type="text" placeholder="请输入新密码" name="NewPassword" v-model="userInfo.newPassword">
            <i class="bgImg" :class="{ 'bgImgClick': isDisplayPwd.newStatus }" @click="passwordeye('new')"></i>
          </li>
          <li><p>{{ tips.newTip }}</p></li>
        </ul>
        <ul class="myself_ul_pwd clearfix">
          <li>确认密码：</li>
          <li class="password">
            <input v-if="isDisplayPwd.confirmStatus" type="password" placeholder="请输入确认密码" name="ConfirmPassword" v-model="userInfo.confirmPassword">
            <input v-if="!isDisplayPwd.confirmStatus" type="text" placeholder="请输入确认密码" name="ConfirmPassword" v-model="userInfo.confirmPassword">
            <i class="bgImg" :class="{ 'bgImgClick': isDisplayPwd.confirmStatus }" @click="passwordeye('confirm')"></i>
          </li>
          <li><p>{{ tips.confirmTip }}</p></li>
        </ul>
      </div>
      <div ng-show="passwordCont" class="updateClick">
        <button type="button" @click="updateClick()">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import { initFun, getLocalStorage } from '../../common/js/cookie'

  export default {
    name: 'changePassword',
    data () {
      return {
        // contentHeight: {
        //   'min-height': document.body.clientHeight - 194 + 'px'
        // },
        initParams: {
          account: ''
        },
        userInfo: {
          originalPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        tips: {
          originalTip: '',
          newTip: '',
          confirmTip: ''
        },
        isDisplayPwd: {
          oldStatus: true,
          newStatus: true,
          confirmStatus: true
        }
      }
    },
    created () {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['account']) {
          this.initParams.account = JSON.parse(getLocalStorage('userInfo'))['account']
        }
        JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])).menuList.forEach((item, index) => {
          if (item.name === '密码修改') {
            this.$emit('resetMenuIndex', index)
          }
        })
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    mounted() {
      this.$bus.on('contentHeightEmit', (height) => {
        this.contentHeight = `min-height: ${height}px`
      })
    },
    beforeDestroy() {
      this.$bus.off('contentHeightEmit')
    },
    methods: {
      passwordeye: function (type) {
        if (type === 'old') {
          this.isDisplayPwd.oldStatus = !this.isDisplayPwd.oldStatus
        }
        if (type === 'new') {
          this.isDisplayPwd.newStatus = !this.isDisplayPwd.newStatus
        }
        if (type === 'confirm') {
          this.isDisplayPwd.confirmStatus = !this.isDisplayPwd.confirmStatus
        }
      },
      updateClick: function () {
        let pattern = '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$'
        if (this.userInfo.originalPassword === '') {
          this.$layer.msg('原始密码不能为空！')
          this.tips.originalTip = '原始密码不能为空！'
        } else if (this.userInfo.newPassword === '') {
          this.$layer.msg('新密码不能为空！')
          this.tips.newTip = '新密码不能为空！'
        } else if (this.userInfo.confirmPassword === '') {
          this.$layer.msg('确认密码不能为空！')
          this.tips.confirmTip = '确认密码不能为空！'
        } else if (this.userInfo.newPassword !== this.userInfo.confirmPassword) {
          this.$layer.msg('确认密码与新密码不相同！')
        } else if (this.userInfo.newPassword.match(pattern) === null) {
          this.$layer.msg('新密码格式不正确！')
          this.tips.newTip = '请输入6-18位数字和字母的组合，不含特殊符号！'
        } else if (this.userInfo.confirmPassword.match(pattern) === null) {
          this.$layer.msg('确认密码格式不正确！')
          this.tips.confirmTip = '请输入6-18位数字和字母的组合，不含特殊符号！'
        } else {
          let params = {}
            if (this.initParams.account) params['username'] = this.initParams.account
            params['original'] = this.userInfo.originalPassword
            params['password'] = this.userInfo.newPassword
          let url = this.$store.state.url + 'auth/update/pwd'
          this.$post(url, params).then(response => {
            if (response.status === 1) {
              this.userInfo = { originalPassword: '', newPassword: '', confirmPassword: '' }
              this.tips = { originalTip: '', newTip: '', confirmTip: '' }
              this.isDisplayPwd = { oldStatus: true, newStatus: true, confirmStatus: true }
              this.$layer.confirm(response.message + '是否需要重新登录系统？', (index) => {
                this.$router.replace({path: '/login', name: '登录'})
                this.$layer.close(index)
              })
            } else {
              this.$layer.msg(response.message)
            }
          }, error => {
            this.$layer.msg(error)
          })
          this.tips = { originalTip: '', newTip: '', confirmTip: '' }
          this.userInfo = { originalPassword: '', newPassword: '', confirmPassword: '' }
          this.isDisplayPwd = { oldStatus: false, newStatus: false, confirmStatus: false }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/common";
  .wrapper-changePassword {
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
      /*密码修改*/
      .myself_ul_pwd:first-child {
        margin: 20px 0 0 80px;
      }

      .myself_ul_pwd {
        width: 90%;
        margin: 5px 0 0 80px;
        & li {
          width: 10%;
          margin: 0 0 8px 0;
          font-size: 14px;
          text-align: center;
          float: left;
        }
        & li:first-child {
          line-height: 32px;
          font-size: 14px;
          color: #333;
          text-align: right;
          padding-right: 15px;
        }
        & li.password {
          border: 1px solid #7d7d7d;
        }
        & li:nth-child(2) {
          width: 30%;
          text-align: left;
          padding: 0 10px;
          & input {
            width: 235px;
            height: 32px;
            line-height: 32px;
            border: none;
            outline: none;
            display: inline-block;
          }
          & i.bgImg {
            display: inline-block;
            width: 16px;
            height: 18px;
            background: url("../../assets/myself/allIcon.png") no-repeat 0 0;
            cursor: pointer;
          }
          & i.bgImgClick {
            display: inline-block;
            width: 16px;
            height: 18px;
            background: url("../../assets/myself/allIcon.png") no-repeat -30px 0;
            cursor: pointer;
          }
        }
        & li:last-child {
          width: 45%;
          line-height: 32px;
          text-align: left;
          & p {
            padding-left: 10px;
            color: #ba292f;
          }
        }
      }
      .updateClick {
        padding: 25px 0 15px 168px;
        text-align: left;
        & button {
          width: 265px;
          height: 35px;
          font-size: 16px;
          line-height: 35px;
          border: none;
          cursor: pointer;
          outline: none;
          color: #ffffff;
          background: #0168b7;
        }
      }
    }
  }
</style>
