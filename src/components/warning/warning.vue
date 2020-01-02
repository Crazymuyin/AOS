<template>
  <div class="warning">
    <div class="menu-wrapper">
      <ul class="clearfix">
        <li class="menu-name fn-left">
          最新预警信息
        </li>
      </ul>
    </div>
    <div class="content-wrapper">
      <ul>
        <li v-for="(list, index) in warningList" :key="index">
          <div class="content">
            <div class="news-title clearfix">
              <span class="fn-left" :class="{'one': list.warnLevel == 0, 'two': list.warnLevel == 1, 'three': list.warnLevel == 2}">
                <div class="warning-grade">{{list.warnLevel == 0 ? '一级预警' : list.warnLevel == 1 ? '二级预警' : list.warnLevel == 2 ? '三级预警' : ''}}</div>
              </span>
              <span class="fn-left" v-if="list.source">【<a :title="list.source">{{list.source | sliceFilter(15)}}</a>】</span>
              <span class="fn-left" @click="detailPageClick(list.id, list.publishDate)">{{list.title | sliceFilter(40)}}</span>
              <span class="fn-right">{{list.publishDate}}</span>
            </div>
            <div class="news-content">
              <p @click="detailPageClick(list.id, list.publishDate)">{{list.content | replacePFilter(140)}}</p>
            </div>
            <div class="news-hot clearfix">
              <span class="fn-left" v-show="list.warnType.length > 0">预警类别：</span>
              <span class="fn-left" style="color: red"><i v-for="(key, index) of list.warnType" :key="index" v-show="list.warnType.length > 0">{{key}}</i></span>
              <span class="fn-left" v-show="list.matchKeys.length > 0">关键词：</span>
              <span class="fn-left" style="color: red"><i v-for="(key, index) of list.matchKeys" :key="index" v-show="list.matchKeys.length > 0">{{key}}</i></span>
              <span class="fn-left" @click="toggleWarningSimilar(list.id)" v-show="list.similarNum > 0">【<a>{{list.similarNum}}</a>篇相似】</span>
              <span class="fn-left"></span><span class="fn-left" title="浏览数">{{list.repeatTotal}}</span>
              <span class="fn-left"></span><span class="fn-left" title="评论数">{{list.repeatTotal}}</span>
              <span class="fn-left"></span><span class="fn-left" title="转发数">{{list.forward}}</span>
              <span @click="followMode(list, $event)" class="fn-right" :class="{'like': list.follow == 1, 'dislike': list.follow == 0}" title="添加关注"></span>
            </div>
          </div>
          <div class="similarList" v-if="warningSimilarIndex === list.id" v-show="warningSimilarShow">
            <div class="similar">
              <div>
                <span class="title">相似文章</span>
                <span class="more fn-right" @click="viewMore(list.id)" v-if="list.similarNum > 5">查看更多 ></span>
              </div>
              <ul class="link">
                <li v-for="(item, i) of list.similarEntityList" :key="i">
                  <div>
                    <div class="detail">
                      <span>【<a style="color: red">{{item.sourceName}}</a>】</span>
                      <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(50)}}</a></span>
                      <span>{{item.publishDate}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <div class="mark"></div>
      </ul>
      <no-data :toggle="warningLoading"></no-data>
      <div class="pagination" v-if="warningList.length">
        <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
      </div>
    </div>
    <detail-page class="page" :warning="detailPageView" @closeDetail="closeDetail"></detail-page>
    <similar-detail @closeDetail="closeDetail" :similar="similarDetailView"></similar-detail>
  </div>
</template>

<script type="application/ecmascript">
  import page from '../../components/component/pagination'
  import { initFun, getLocalStorage } from '../../common/js/cookie'
  import noData from '../component/vue-noData'
  import detailPage from '../../components/component/detailPage'
  import similarDetail from '../../components/component/similarDetailPage'
  import {addKeyStyleForContent, editBody} from '../../common/js/common'
  export default {
    name: 'warning',
    components: {
      'v-pagination': page,
      'detailPage': detailPage,
      'noData': noData,
      'similar-detail': similarDetail
    },
    data() {
      return {
        handleFollowStatus: false,
        initParams: {
          taskId: ''
        },
        warningList: [],
        warningSimilarShow: false,
        warningSimilarIndex: '',
        similarDetailView: {
          isShow: false,
          id: '',
          type: 'warning'
        },
        pageInfo: { total: 0, display: 7, currentPage: 1, pageGroup: 11 },
        warningLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
        detailPageView: { foucusClick: false, fire: false, score: false, follow: true, isShow: false, data: {}, similar: [], type: 'warning' }
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        }
        this.init()
      } else {
        this.$router.replace({path: '/login'})
      }
    },
    methods: {
      pageChange: function (currentPage) {
        if (currentPage) {
          this.pageInfo.currentPage = currentPage
          this.init()
        }
        this.warningSimilarShow = false
      },
      // 初始化列表请求
      init: function () {
        let params = {}
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        if (this.pageInfo.currentPage) params.pageNum = this.pageInfo.currentPage
        if (this.pageInfo.display) params.pageSize = this.pageInfo.display
        let url = this.$store.state.url + 'warns/warn/findOneMonthWarn'
        this.warningList = []
        this.warningLoading = {loading: true, noData: false, errorWork: false, tooltip: ''}
        this.$get(url, params).then(res => {
          if (res.status === 1) {
            if (JSON.stringify(res.data) !== '{}' && res.data.hasOwnProperty('todayWarnData')) {
              this.warningLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
              res.data.todayWarnData.forEach(function (item) {
                item.matchKeys = item.matchKeys.split(',')
                item.warnType = item.warnType.split(',')
              })
              this.pageInfo.total = res.data.total
              this.warningList = res.data.todayWarnData
            } else {
              this.warningLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
            }
          }
          if (res.status === 0) {
            this.warningLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
          }
        }).catch(error => {
          this.warningLoading = {loading: false, noData: false, errorWork: true, tooltip: error.message}
          this.$layer.msg(error)
        })
      },
      // 关注
      followMode: function (list, e) {
        e.stopPropagation()
        if (!this.handleFollowStatus) {
          let _this = this
          this.userFollowRequest(list, function (obj) {
            list.follow = obj.data
            _this.$layer.msg(obj.message)
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
          if (this.initParams.taskId) params.taskId = this.initParams.taskId
          if (list.publishDate) params.year = list.publishDate.slice(0, 4)
          let url = this.$store.state.url + 'theme/dataSubject/addFollowById'
          this.handleFollowStatus = true
          this.$post(url, params).then(res => {
            if (res.status === 1) {
              callback(res)
            }
            if (res.status === 0) {
              this.$layer.msg(res.message)
            }
            this.handleFollowStatus = false
          }).catch(error => {
            this.handleFollowStatus = false
            this.$layer.msg(error)
          })
        } else {
          this.$layer.msg('文章ID无效')
        }
      },
      // 展开相似文章列表
      toggleWarningSimilar: function(index) {
        if (this.warningSimilarIndex === index) {
          this.warningSimilarIndex = ''
          this.warningSimilarShow = false
        } else {
          this.warningSimilarIndex = index
          this.warningSimilarShow = true
        }
      },
      // 查看更多相似文章
      viewMore: function(id) {
        this.similarDetailView.isShow = true
        this.similarDetailView.id = id
      },
      // 详情页数据请求
      detailPageClick: function(dataId, time) {
        this.warningSimilarShow = false
        if (this.warningSimilarIndex === dataId) {
          this.warningSimilarShow = true
        }
        let params = {}
        let url = this.$store.state.url + 'search/publicSentiment/details'
        if (dataId && time) {
          params.dataId = dataId
          params.time = time
        }
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        this.detailPageView.isShow = true
        editBody('open')
        this.$get(url, params).then(response => {
          if (response.status === 1) {
            response.data.publicSentimentData.appraise = [response.data.publicSentimentData.appraise]
            this.detailPageView.data = response.data.publicSentimentData
            this.detailPageView.data.content = addKeyStyleForContent(response.data.publicSentimentData.content, response.data.publicSentimentData.matchKeys)
            this.detailPageView.similar = response.data.similarList
          }
          if (response.status === 0) {
            alert(response.message)
          }
        })
      },
      closeDetail: function (obj) {
        this.detailPageView = { foucusClick: false, fire: false, score: false, follow: true, isShow: false, data: {}, similar: [] }
        editBody('detailClose')
        this.init()
        this.similarDetailView.isShow = false
        // this.updateFollow(obj)
      },
      updateFollow: function (obj) {
        this.warningList.forEach((item) => {
          if (item.id === obj.id) {
            item.follow = obj.follow
          }
        })
      },
      beforeDestroy() {
        editBody('close', 0)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/common";
.warning {
  width: 100%;
  height: 1020px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  .menu-wrapper {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 48px;
    background: white;
    font-size: 16px;
    line-height: 35px;
    border-radius: 5px;
    & ul{
      height: 100%;
    }
    & li{
      height: 94%;
      text-align: center;
      border-bottom: 3px solid #0068B7;
      padding: 0 23px;
      line-height: 45px;
    }
  }
  .content-wrapper{
    width: 99.7%;
    height: 92%;
    margin-top: 1%;
    border: 2px solid #DCDCDC;
    background: #fff;
    & ul{
      height: 868px;
      position: relative;
      overflow: auto;
      & li{
        .content{
          width: 1091px;
          height: 112px;
          padding: 12px 50px 0 50px;
          cursor: pointer;
          .news-title{
            height: 32px;
            line-height: 32px;
            font-size: 13px;
            & span:first-child{
              position: relative;
              display: inline-block;
              top: 6px;
              width: 20px;
              height: 20px;
              cursor: pointer;
              .warning-grade{
                position: absolute;
                left: 25px;
                top: -30px;
                width: 100px;
                height: 34px;
                background: rgba(153,153,153,0.9);
                color: #fff;
                font-size: 13px;
                text-align: center;
                border-radius: 3px;
                display: none;
              }
            }
            & span:first-child:hover{
              .warning-grade{
                display: block;
              }
            }
            & span:nth-child(2){
              margin-left: 3px;
              cursor: pointer;
              & a{
                text-decoration: none;
                color: red;
              }
            }
            & span:nth-child(3){
              cursor: pointer;
            }
            & span.one{
              .fire-icon(1)
            }
            & span.two{
              .fire-icon(2)
            }
            & span.three{
              .fire-icon(3)
            }
          }
          .news-content{
            height: 40px;
            font-size: 13px;
            color: #7e7e7e;
            line-height: 20px;
          }
          .news-hot{
            font-size: 13px;
            color: #7e7e7e;
            line-height: 25px;
            & span:nth-child(2){
              max-width: 360px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              & i {
                margin: 0 5px 0 0;
                font-style: normal;
              }
            }
            & span:nth-child(4){
              max-width: 360px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              & i {
                margin: 0 5px 0 0;
                font-style: normal;
              }
            }
            & span:nth-child(5){
              margin-left: 50px;
              & a{
                text-decoration: none;
                padding: 0 3px;
                color: #72b4f0;
              }
            }
            & span:nth-child(6){
              position: relative;
              top: 7px;
              margin-left: 45px;
              width: 20px;
              height: 11px;
              background: url("../../../resource/design/img_monitor_img.png") no-repeat -12px -131px;
            }
            & span:nth-child(7){
              margin-left: 6px;
            }
            & span:nth-child(8){
              position: relative;
              top: 7px;
              margin-left: 10px;
              width: 13px;
              height: 11px;
              background: url("../../../resource/design/img_monitor_img.png") no-repeat -82px -131px;
            }
            & span:nth-child(9){
              margin-left: 6px;
            }
            & span:nth-child(10){
              position: relative;
              top: 7px;
              margin-left: 10px;
              width: 12px;
              height: 12px;
              background: url("../../../resource/design/img_monitor_img.png") no-repeat -143px -131px;
            }
            & span:nth-child(11){
              margin-left: 6px;
            }
            & span:nth-child(12){
              position: relative;
              top: 7px;
              width: 13px;
              height: 12px;
              cursor: pointer;
            }
            & span.like{
              background: url("../../../resource/design/img_monitor_img.png") no-repeat -14px -79px;
            }
            & span.dislike{
              background: url("../../../resource/design/img_monitor_img.png") no-repeat -71px -79px;
            }
          }
        }
        .similar{
          padding: 10px 50px;
          background-color: #f0f0f0;
          .title{
            height: 30px;
            font-size: 12px;
            font-weight: bold;
            line-height: 30px;
          }
          .more {
            font-size: 12px;
            color: #666666;
            margin-top: 10px;
            cursor: pointer;
          }
          & ul{
            font-size: 12px;
            padding: 0 20px;
            cursor: unset;
            height: auto;
            & li{
              padding: 0;
              margin: 0;
              list-style: disc;
              & div{
                & span{
                  display: inline-block;
                  font-size: 28px;
                  vertical-align: middle;
                }
                & div{
                  display: inline-block;
                  & span{
                    font-size: 12px;
                    line-height: 20px;
                    & a{
                      text-decoration: none;
                      color: #000;
                    }
                  }
                  & span:last-child{
                    font-size: 12px;
                    color: #666666;
                    margin-left: 10px;
                  }
                }
              }
            }
            & li:nth-child(2) {
              color: #000;
              line-height: 20px;
            }
          }
          & ul:hover {
            background: none;
          }
        }
      }
      & li:hover{
        background: #F6F6F6;
      }
      .mark{
        position: absolute;
        top: 15px;
        left: 0;
        width: 5px;
        height: 27px;
        background: #0068B7;
      }
    }
  }
}
</style>
