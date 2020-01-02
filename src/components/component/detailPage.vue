<template>
    <div v-if="warning.isShow" class="detail-page">
      <div class="wrapper">
        <div class="title">
          <div class="name">
            <i v-if="warning.fire"></i><span>{{warning.data.title | sliceFilter(30)}}</span>
            <i v-if="warning.score" v-for="(vo, index) of warning.data.appraise" :key="index" @click="editCurrent(warning.data, vo)" :class="warning.data.appraise.length === 1 ? {'positive': vo.name === '正面', 'neutral': vo.name === '中性', 'negative': vo.name === '负面'} : {'positiveHover': vo.name === '正面' && vo.status, 'positivePlus': vo.name === '正面' && !vo.status,
                          'neutralHover': vo.name === '中性' && vo.status, 'neutralPlus': vo.name === '中性' && !vo.status,
                          'negativeHover': vo.name === '负面' && vo.status, 'negativePlus': vo.name === '负面' && !vo.stauts}"></i>
            <i v-if="warning.data.appraise && warning.score" @click="editModel(warning.data)" title="我要修改"></i>
          </div>
          <div class="date">
            <span v-if="warning.data.publishDate">发布时间：</span><span>{{warning.data.publishDate}}</span>
            <span v-if="warning.data.author">作者：</span><span>{{warning.data.author}}</span>
            <span v-if="warning.data.url">【<a :href="warning.data.url" target="_blank">阅读原文</a>】</span>
          </div>
        </div>
        <div class="feature">
          <div class="number clearfix">
            <span class="fn-left"></span><span class="fn-left" title="浏览数">{{warning.data.click}}</span>
            <span class="fn-left"></span><span class="fn-left" title="评论数">{{warning.data.repeatTotal}}</span>
            <span class="fn-left"></span><span class="fn-left" title="转发数">{{warning.data.forward}}</span>
            <div class="fn-right" v-if="warning.follow">
              <span @click="collectMode(warning.data)" class="fn-left" :class="{'like': warning.data.follow === 1, 'dislike': warning.data.follow === 0}"></span>
              <span class="fn-left">
                {{warning.data.collectNumber}}
              </span>
            </div>
          </div>
        </div>
        <div class="keyWord" v-if="warning.data.matchKeys">
          <span>【<a>关键词</a>】</span>
          <span>{{ warning.data.matchKeys.replace(/,/g, '，') }}</span>
        </div>
        <div class="content">
          <span v-if="warning.data.source">【<a>{{warning.data.source}}</a>】</span>
          <span v-if="warning.data.content" v-html="warning.data.content"></span>
          <!--<div class="number clearfix">-->
            <!--<span class="fn-left"></span><span class="fn-left" title="浏览数">{{warning.data.click}}</span>-->
            <!--<span class="fn-left"></span><span class="fn-left" title="评论数">{{warning.data.repeatTotal}}</span>-->
            <!--<span class="fn-left"></span><span class="fn-left" title="转发数">{{warning.data.forward}}</span>-->
            <!--<div class="fn-right" v-if="warning.follow">-->
              <!--<span @click="collectMode(warning.data)" class="fn-left" :class="{'like': warning.data.follow === 1, 'dislike': warning.data.follow === 0}"></span><span class="fn-left">{{warning.data.collectNumber}}</span>-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="liner" v-if="Array.isArray(warning.similar) && warning.similar.length"></div>
        <div class="similar" v-if="Array.isArray(warning.similar) && warning.similar.length">
          <div>
            <span class="title">相似文章</span>
            <span v-if="warning.data.similarNum > 5" class="more fn-right" @click="viewMore(warning.data.id)">查看更多 ></span>
          </div>
          <ul class="link">
            <li v-for="(list,index) in warning.similar" :key="index">
              <div>
                <span>·</span>
                <div class="detail">
                  <span>【<a>{{list.sourceName}}</a>】</span>
                  <span :title="list.title"><a v-bind:href="list.url" target="_blank">{{list.title | sliceFilter(25)}}</a></span>
                  <span>{{list.publishDate}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="close" @click="closeDetail"></div>
      </div>
      <no-data v-if="warning.isShow" :toggle="detailLoading"></no-data>
      <similar-detail @closeDetail="closeSimilar" :similar="similarDetailView"></similar-detail>
    </div>
</template>

<script type="application/ecmascript">
  import noData from '../component/vue-noData'
  import { getLocalStorage, initFun } from '../../common/js/cookie'
  import similarDetail from '../../components/component/similarDetailPage'
export default {
  name: 'detail-page',
  components: {
    noData: noData,
    similarDetail: similarDetail
  },
  data () {
    return {
      handleFollowStatus: false,
      initParams: {
        taskId: ''
      },
      similarDetailView: {
        isShow: false,
        id: '',
        type: ''
      },
      detailLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
      defaultModel: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
      followScoreDefault: []
    }
  },
  props: {
    warning: Object
  },
  created () {
    if (initFun()) {
      if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
        this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
      }
    } else {
      this.$router.replace({path: '/login'})
    }
  },
  methods: {
    viewMore: function(id) {
      this.similarDetailView.isShow = true
      this.similarDetailView.id = id
    },
    closeDetail: function () {
      this.detailLoading.loading = false
      this.$emit('closeDetail', this.warning.data)
    },
    closeSimilar: function() {
      this.similarDetailView.isShow = false
    },
    // 新闻正中负修改请求
    editRequest: function(list, score, callback) {
      let params = {}
      if (list.id) params.id = list.id
      if (score) params.appraise = score['name']
      if (list.publishDate) params.year = list.publishDate.slice(0, 4)
        let url = this.$store.state.url + 'theme/collectData/updateAppraise'
        this.$post(url, params).then(res => {
        if (res.status === 1) {
          callback(res.data.appraise, 1)
        }
        if (res.status === 0) {
          this.$layer.msg(res.message)
          callback(score, 0)
        }
      }).catch(error => {
        if (error) callback(score, 0)
      })
    },
    editCurrent: function (list, appraise) {
      if (list.appraise.length === 3) {
        let _this = this
        this.editRequest(list, appraise, function (score, status) {
          if (status === 1) {
            list.appraise = [{ name: score, status: true }]
            _this.$layer.msg('修改成功')
          } else {
            list.appraise = _this.followScoreDefault
            _this.$layer.msg('修改失败')
          }
        })
      }
    },
    editModel: function (list) {
      this.followScoreDefault = list.appraise
      let tempList = []
      this.defaultModel.forEach(function (item) {
        if (item.name === list.appraise[0].name) {
          item.status = true
        } else {
          item.status = false
        }
        tempList.push(item)
      })
      list.appraise = tempList
    },
    // 关注
    collectMode: function (list) {
      if (!this.handleFollowStatus) {
        this.userFollowRequest(list, (obj) => {
          list.follow = obj.data
          this.$layer.msg(obj.message)
          this.$emit('changeMyFollow', obj.data)
        })
      } else {
        if (list.follow) {
          this.$layer.msg('取消关注操作正在进行中……')
        } else {
          this.$layer.msg('关注操作正在进行中……')
        }
      }
    },
    // 用户关注请求
    userFollowRequest: function (list, callback) {
      if (list.id) {
        let params = {}
        if (list.id) params.id = list.id
        if (list.publishDate) params.year = list.publishDate.slice(0, 4)
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        let url = this.$store.state.url + 'theme/dataSubject/addFollowById'
        this.handleFollowStatus = true
        this.$post(url, params).then(res => {
          if (res.status === 1) {
            callback(res)
            this.handleFollowStatus = false
          }
          if (res.status === 0) {
            this.$layer.msg(res.message)
            this.handleFollowStatus = false
          }
        }).catch(error => {
          this.$layer.msg(error)
          this.handleFollowStatus = false
        })
      } else {
        this.$layer.msg('文章ID无效')
      }
    }
  },
  watch: {
    warning: {
      handler(newValue, oldValue) {
        if (newValue.isShow) this.detailLoading.loading = newValue.isShow
        if (newValue.data) {
          if (newValue.isShow) this.detailLoading.loading = false
        }
        if (newValue.foucusClick) {
          if (Array.isArray(this.warning.data.appraise) && this.warning.data.appraise.length === 3) {
            this.warning.data.appraise = this.followScoreDefault
            newValue.foucusClick = !newValue.foucusClick
          }
        }
        if (newValue.type === 'warning') {
          this.similarDetailView.type = newValue.type
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
@import url('../../common/less/common');
.detail-page{
  position: fixed;
  left: 0;
  top: 73px;
  width: 100%;
  height: 93%;
  background: #fff;
  z-index: 100;
  overflow-y: auto;
  .wrapper{
    position: relative;
    width: 1136px;
    height: 100%;
    margin: 0 auto;
    .title{
      text-align: center;
      padding-bottom: 66px;
      .name{
        height: 30px;
        margin-top: 66px;
        & i{
          position: relative;
          display: inline-block;
          top: 2px;
          width: 19px;
          height: 23px;
          margin-top: -10px;
          margin-right: 6px;
          vertical-align: middle;
          cursor: pointer;
        }
        & i:first-child{
          .fire-icon(1);
        }
        & i:nth-child(2){
          margin-left: -6px;
        }
        & i:last-child{
          width: 15px;
          height: 14px;
          cursor: pointer;
          background: url("../../../src/assets/detail/img_Details_img.png") no-repeat -26px -57px;
        }
        .positive {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
        }
        .positivePlus {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
        }
        .positivePlus:hover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -221px;
        }
        .positiveHover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -221px;
        }
        .neutral {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
        }
        .neutralPlus {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
        }
        .neutralPlus:hover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -221px;
        }
        .neutralHover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -221px;
        }
        .negative {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
        }
        .negativePlus {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
        }
        .negativePlus:hover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -221px;
        }
        .negativeHover {
          background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -221px;
        }
        & span{
          font-size: 24px;
          line-height: 25px;
          padding: 0 12px;
        }
      }
      .date{
        margin-top: 16px;
        height: 15px;
        font-size: 14px;
        & span:nth-child(2){
          margin-right: 20px;
        }
        & span:nth-child(4){
          margin-right: 20px;
        }
        & span:last-child{
          & a{
            text-decoration: none;
            color: #00a0e9;
          }
        }
      }
    }
    .feature {
      font-size: 14px;
      line-height: 24px;
      text-indent: 2em;
      text-align: justify;
      text-justify: distribute-all-lines;
      text-align-last: left;
      .number{
        font-size: 12px;
        cursor: default;
        & span:first-child{
          position: relative;
          margin-top: 7px;
          width: 20px;
          height: 11px;
          background: url("../../../resource/design/img_monitor_img.png") no-repeat -12px -131px;
        }
        & span:nth-child(3){
          position: relative;
          margin-top: 7px;
          margin-left: 10px;
          width: 13px;
          height: 11px;
          background: url("../../../resource/design/img_monitor_img.png") no-repeat -82px -131px;
        }
        & span:nth-child(5){
          position: relative;
          margin-top: 7px;
          margin-left: 10px;
          width: 12px;
          height: 12px;
          background: url("../../../resource/design/img_monitor_img.png") no-repeat -143px -131px;
        }
        & div{
          & span:first-child{
            position: relative;
            margin-top: 7px;
            width: 13px;
            height: 12px;
            background: #fff;
          }
          & span:nth-child(2){
            margin-left: -20px;
          }
          & span.like{
            cursor: pointer;
            background: url("../../../resource/design/img_monitor_img.png") no-repeat -14px -79px;
          }
          & span.dislike{
            cursor: pointer;
            background: url("../../../resource/design/img_monitor_img.png") no-repeat -71px -79px;
          }
        }
        & span:nth-child(2),& span:nth-child(4),& span:nth-child(6){
          margin-left: -20px;
        }
      }
    }
    .keyWord{
      padding: 20px 30px;
      border: 1px dashed #7e8c8d;
      white-space: normal;
      word-break: break-all;
      font-size: 14px;
      color: #ff0000;
      line-height: 20px;
      & span:first-child{
        color: black;
        & a{
          text-decoration: none;
          color: #ff0000;
          font-weight: 600;
        }
      }
      & span:nth-child(2){
        & i{
          font-style: inherit;
          padding: 0 5px;
        }
      }
    }
    .content{
      margin-top: 50px;
      margin-bottom: 100px;
      font-size: 14px;
      line-height: 24px;
      text-indent: 2em;
      text-align: justify;
      text-justify: distribute-all-lines;
      text-align-last: left;
      & span:first-child{
        & a{
          text-decoration: none;
          color: #ff0000;
          font-weight: 600;
        }
      }
    }
    .liner{
      height: 3px;
      background: url("../../../src/assets/detail/xian_details_xian.png") no-repeat;
      background-size: 100%;
      margin-top: 60px;
    }
    .similar{
      .title{
        height: 48px;
        font-size: 16px;
        line-height: 48px;
        font-weight: 600;
      }
      .more {
        font-size: 12px;
        color: #666666;
        margin-left: 13px;
        cursor: pointer;
        line-height: 48px;
      }
      & ul{
        font-size: 14px;
        padding-bottom: 50px;
        & li{
          & div{
            & span{
              display: inline-block;
              font-size: 28px;
              vertical-align: middle;
            }
            & div{
              display: inline-block;
              & span{
                font-size: 14px;
                line-height: 28px;
                & a{
                  text-decoration: none;
                  color: red;
                }
              }
              & span:last-child{
                font-size: 12px;
                color: #666666;
              }
            }
          }
        }
      }
    }
    .close{
      position: absolute;
      top: -55px;
      right: -25px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      background: url("../../../src/assets/detail/img_Details_img.png") no-repeat 0 0;
    }
  }
}
</style>
