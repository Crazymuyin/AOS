<template>
  <div class="wrapper-content">
    <div class="source-wrapper">
      <i class="fn-left" style="color: #f00; font-size: 30px">*</i>
      <span class="fn-left">信源名称</span>
      <span class="fn-left">：</span>
      <input class="fn-left" v-model="name" placeholder="请输入信源名称"/>
      <span class="fn-left">例如：新华网</span>
    </div>
    <div class="keyword-wrapper">
      <i class="fn-left" style="color: #f00; font-size: 30px">*</i>
      <span class="fn-left">信源链接</span>
      <span class="fn-left">：</span>
      <textarea class="fn-left" v-model="urls" placeholder="请输入信源链接地址"></textarea>
      <div class="fn-left">
        <i class="fn-left"></i>
        <textarea class="fn-left" readonly>信源链接之间请以回车分割  例如：
            https://www.baidu.com/
            https://www.sina.com.cn/
            http://www.taobao.com/
          </textarea>
      </div>
    </div>
    <div class="submit" @click="save()">提交</div>
  </div>
</template>

<script>
import {transSpaceToEnter} from '../../../common/js/common'
import { Base64 } from 'js-base64'
import {initFun, getLocalStorage} from '../../../common/js/cookie'

export default {
  name: 'addSourcePage',
  data() {
    return {
      initParams: {
        userId: '',
        userName: ''
      },
      name: '',
      urls: ''
    }
  },
  props: {
    model: Object
  },
  created() {
    if (initFun()) {
      if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId'] && JSON.parse(getLocalStorage('userInfo'))['userName']) {
        this.initParams.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        this.initParams.userName = JSON.parse(getLocalStorage('userInfo'))['userName']
      }
      JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])).menuList.forEach((item, index) => {
        if (item.name === '信源添加') {
          this.$emit('resetMenuIndex', index)
        }
      })
    } else {
      this.$router.replace({path: '/login', name: '登录'})
    }
  },
  methods: {
    save: function () {
      if (this.name) {
        if (this.urls) {
          let _this = this
          let urlArr = transSpaceToEnter(this.urls).split('\n')
          let len = urlArr.length
          urlArr.forEach(function (item) {
            if (item.match('^((https|http|ftp|rtsp|mms)?:\\/\\/)[^\\s]+') === null) {
              _this.$layer.msg(item + '不符合url标准，请遵循https|http|ftp|rtsp|mms://*的url格式！')
            } else {
              len--
            }
          })
          if (len === 0) {
            this.saveReq()
          }
        } else {
          this.$layer.msg('信源链接不能为空！')
        }
      } else {
        this.$layer.msg('信源名称不能为空！')
      }
    },
    saveReq: function () {
      let params = {}
      if (this.name) params['sourceName'] = this.name
      if (this.urls) params['sourceUrl'] = transSpaceToEnter(this.urls)
      if (this.initParams.userId) params['userId'] = this.initParams.userId
      if (this.initParams.userName) params['userName'] = this.initParams.userName
      let url = `${this.$store.state.url}theme/sourceInfo/addSourceInfo`
      this.$post(url, params).then(response => {
        let result = response
        if (result.status === 1) {
          this.name = ''
          this.urls = ''
          this.$emit('closeParent')
          this.$layer.msg(result.message)
        } else {
          this.$layer.msg(result.message)
        }
      }, error => {
        this.$layer.msg(error)
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper-content {
    position: relative;
    width: 900px;
    margin-top: 5px;
    border-bottom: 0;
    background: #ffffff;

    .source-wrapper {
      position: relative;
      height: 30px;
      margin-top: 44px;
      margin-right: 25px;
      margin-left: 20px;
      & i {
        padding-top: 11px;
        padding-right: 5px;
      }
      & span {
        padding-top: 11px;
      }
      & input {
        width: 520px;
        height: 20px;
        padding: 10px;
        font-size: 13px;
        resize: none;
        border: 1px solid #0068b7;
        outline: none;
      }
      & span:first-child {
        color: #333333;
      }
      & span:last-child {
        font-size: 12px;
        color: #333333;
        padding-left: 32px;
        background: url("../../../assets/myself/scripts_myself.png") no-repeat -49px -241px;
      }
    }

    .keyword-wrapper {
      position: relative;
      height: 300px;
      margin-top: 44px;
      margin-left: 20px;
      & i {
        padding-top: 11px;
        padding-right: 5px;
      }
      & span {
        padding-top: 11px;
      }
      & span:first-child {
        color: #333333;
      }
      & textarea {
        width: 520px;
        height: 278px;
        padding: 10px;
        font-size: 13px;
        resize: none;
        border: 1px solid #0068b7;
        outline: none;
      }

      & div {
        & i {
          margin: 10px;
          width: 12px;
          height: 12px;
          background: url("../../../assets/myself/scripts_myself.png") no-repeat -59px -251px;
          cursor: pointer;
        }

        & textarea {
          padding: 6px 0 0 0;
          width: 165px;
          height: 192px;
          line-height: 18px;
          font-size: 12px;
          color: #333333;
          resize: none;
          outline: none;
          border: 0;
        }
      }
    }

    .submit {
      margin-top: 90px;
      margin-left: 350px;
      width: 120px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: #fff;
      background: #0068b7;
      cursor: pointer;
    }
  }
</style>
