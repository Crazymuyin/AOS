<template>
  <div class="warning">
    <div class="menu-wrapper">
      <ul class="clearfix">
        <li class="menu-name fn-left">
          今日更新
        </li>
      </ul>
    </div>
    <div class="content-wrapper">
      <ul v-if="followList.length">
        <li v-for="(list, index) in followList" :key="index">
          <div class="content">
            <div class="news-title clearfix">
              <span class="fn-left" v-if="list.sourceName">【<a :title="list.sourceName">{{list.sourceName | sliceFilter(15)}}</a>】</span>
              <span class="fn-left" :title="list.title" @click="detailPageClick(list.id, list.publishDate)">{{list.title | sliceFilter(40)}}</span>
              <div class="newsModel clearfix fn-left">
                <span  v-for="(appraise, number) of list.appraise" :key="number" class="fn-left" :class="list.appraise.length === 1 ? {'positive': appraise.name === '正面', 'neutral': appraise.name === '中性', 'negative': appraise.name === '负面'} : {'positiveHover': appraise.name === '正面' && appraise.status, 'positivePlus': appraise.name === '正面' && !appraise.status,
                          'neutralHover': appraise.name === '中性' && appraise.status, 'neutralPlus': appraise.name === '中性' && !appraise.status,
                          'negativeHover': appraise.name === '负面' && appraise.status, 'negativePlus': appraise.name === '负面' && !appraise.stauts}" @click="editCurrent(list, appraise, $event)"></span>
                <span class="edit fn-left" @click="editModel(list, $event)" title="我要修改"></span>
            </div>
              <span class="fn-right">{{list.publishDate}}</span>
            </div>
            <div class="news-content">
              <p @click="detailPageClick(list.id, list.publishDate)">{{list.content | replacePFilter(140)}}</p>
            </div>
            <div class="news-hot clearfix">
              <span class="fn-left">关键词：</span>
              <span class="fn-left" style="color: red"><i v-for="(item,index) of list.matchKeys" :key="index">{{item}}</i></span>
              <span class="fn-left" @click="toggleFollowSimilar(list.id)" v-show="list.similarNum > 0">【<a>{{list.similarNum}}</a>篇相似】</span>
              <div class="numberView clearfix fn-left">
                <span class="fn-left"></span><span class="fn-left" title="浏览数">{{list.click}}<a style="text-decoration: none; color: red" title="">+{{list.readAddNum}}</a></span>
                <span class="fn-left"></span><span class="fn-left" title="评论数">{{list.repeatTotal}}<a style="text-decoration: none; color: red" title="">+{{list.rattingAddNum}}</a></span>
                <span class="fn-left"></span><span class="fn-left" title="转发数">{{list.forward}}<a style="text-decoration: none; color: red" title="">+{{list.transmitAddNum}}</a></span>
              </div>
              <span @click="cancelFollow(list, $event)" class="like fn-right" title="取消关注"></span>
            </div>
          </div>
          <div class="similarList" v-if="followSimilarIndex === list.id" v-show="followSimilarShow">
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
      <no-data :toggle="followLoading"></no-data>
      <div class="pagination" v-show="pageInfo.total > 0">
        <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
      </div>
    </div>
    <detail-page :warning="detailPageView" @closeDetail="closeDetail"></detail-page>
    <similar-detail @closeDetail="closeDetail" :similar="similarDetailView"></similar-detail>
  </div>
</template>

<script>
  import page from '../../components/component/pagination'
  import detailPage from '../../components/component/detailPage'
  import similarDetail from '../../components/component/similarDetailPage'
  import noData from '../component/vue-noData'
  import { initFun, getLocalStorage } from '../../common/js/cookie'
  import {addKeyStyleForContent, editBody} from '../../common/js/common'
  export default {
    name: 'follow',
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
          userId: ''
        },
        followList: [],
        followSimilarShow: false,
        followSimilarIndex: '',
        similarDetailView: {
          isShow: false,
          data: []
        },
        defaultModel: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
        followScoreDefault: [],
        pageInfo: { total: 0, display: 7, currentPage: 1, pageGroup: 11 },
        followLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
        detailPageView: {
          foucusClick: false,
          score: true,
          follow: true,
          fire: false,
          isShow: false,
          data: {},
          similar: []
        }
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
          this.initParams.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        }
        this.init(true)
      } else {
        this.$router.replace({path: '/login'})
      }
    },
    mounted () {
      this.globalClick(this.appraiseDefault)
    },
    methods: {
      pageChange: function(currentPage) {
        if (currentPage) {
          this.pageInfo.currentPage = currentPage
          this.init()
        }
        this.followSimilarShow = false
      },
      editCurrent: function (list, appraise, e) {
        e.stopPropagation()
        if (list.appraise.length === 3) {
          let _this = this
          this.editRequest(list, appraise, function (score, status) {
            if (status === 1) {
              list.appraise = [score]
              _this.$layer.msg('修改成功')
            } else {
              list.appraise = _this.followScoreDefault
              _this.$layer.msg('修改失败')
            }
          })
        }
      },
      editModel: function (list, e) {
        e.stopPropagation()
        this.followList.forEach(item => {
          if (item.appraise.length === this.defaultModel.length) {
            item.appraise = this.followScoreDefault
          }
        })
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
      appraiseDefault: function(e) {
        let _this = this
        e.stopPropagation()
        e = e || window.event
        let className = e.target.className
        if (className !== 'edit fn-left' && className !== 'fn-left positive' && className !== 'fn-left negative' && className !== 'fn-left neutral') {
          this.followList.forEach(function (item) {
            if (Array.isArray(item.appraise) && item.appraise.length === 3) {
              item.appraise = _this.followScoreDefault
            }
          })
        }
        if (className === 'title' || className === 'detail-page' || className === 'wrapper') {
          _this.detailPageView.foucusClick = true
        }
      },
      // 今日更新请求
      init: function (state) {
        let params = {}
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        if (this.pageInfo.currentPage) params.page = this.pageInfo.currentPage
        if (this.pageInfo.display) params.pageSize = this.pageInfo.display
        let url = this.$store.state.url + 'theme/dataSubject/list'
        this.followList = []
        this.pageInfo.total = 0
        this.followLoading = {loading: true, noData: false, errorWork: false, tooltip: ''}
        this.$get(url, params).then(res => {
          if (res.status === 1) {
            this.followLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
            res.data.forEach(function (item) {
              item.appraise = [{ name: item.appraise, status: true }]
              item.matchKeys = item.matchKeys.split(',')
            })
            this.followList = res.data.slice(0, 7)
            this.pageInfo.total = res.total
            this.handleFollowStatus = false
          }
          if (res.status === 0) {
            this.followLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
            this.handleFollowStatus = false
          }
        }).catch(error => {
          this.followLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
          this.handleFollowStatus = false
        })
      },
      // 展开相似文章列表
      toggleFollowSimilar: function(index) {
        if (this.followSimilarIndex === index) {
          this.followSimilarIndex = ''
          this.followSimilarShow = false
        } else {
          this.followSimilarIndex = index
          this.followSimilarShow = true
        }
      },
      // 查看更多相似文章
      viewMore: function(id) {
        this.similarDetailView.isShow = true
        this.similarDetailView.id = id
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
            let tempAppraise = { name: res.data.appraise, status: true }
            callback(tempAppraise, 1)
          }
          if (res.status === 0) {
            this.$layer.msg(res.message)
            callback(score, 0)
          }
        }).catch(error => {
          if (error) callback(score, 0)
        })
      },
      // 详情页数据请求
      detailPageClick: function(dataId, time) {
        this.followSimilarShow = false
        if (this.followSimilarIndex === dataId) {
          this.followSimilarShow = true
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
            response.data.publicSentimentData.appraise = [{ name: response.data.publicSentimentData.appraise, status: true }]
            this.detailPageView.data = response.data.publicSentimentData
            this.detailPageView.data.content = addKeyStyleForContent(response.data.publicSentimentData.content, response.data.publicSentimentData.matchKeys)
            this.detailPageView.similar = response.data.similarList
          }
          if (response.status === 0) {
            this.$layer.msg(response.message)
          }
        })
      },
      // 取消关注
      cancelFollow: function(list, e) {
        e.stopPropagation()
        let _this = this
        if (!this.handleFollowStatus) {
          let params = {}
          if (list.id) params.id = list.id
          if (this.initParams.taskId) params.taskId = this.initParams.taskId
          if (list.publishDate) params.year = list.publishDate.slice(0, 4)
          let url = this.$store.state.url + 'theme/dataSubject/addFollowById'
          this.handleFollowStatus = true
          this.$post(url, params).then(res => {
            if (Number(res.status) === 1) {
              this.$layer.msg(res.message)
              setTimeout(() => {
                if (parseInt(_this.pageInfo.total / _this.pageInfo.display) === (_this.pageInfo.currentPage - 1)) {
                  if (_this.pageInfo.total % _this.pageInfo.display === 1) { // 尾页只有1条数据
                    if (_this.pageInfo.total === 1) {
                      _this.pageInfo.currentPage = 1
                      _this.init()
                    } else {
                      _this.pageInfo.currentPage = _this.pageInfo.currentPage - 1
                      _this.init()
                    }
                  } else {
                    _this.init()
                  }
                } else {
                  _this.init()
                }
              }, 500)
            } else {
              _this.$layer.msg(res.message)
              _this.handleFollowStatus = false
            }
          }).catch(error => {
            this.handleFollowStatus = false
            this.$layer.msg(error)
          })
        } else {
          if (list.follow) {
            this.$layer.msg('取消关注操作正在进行中……')
          } else {
            this.$layer.msg('关注操作正在进行中……')
          }
        }
      },
      closeDetail: function () {
        let _this = this
        this.detailPageView.isShow = false
        this.detailPageView.foucusClick = false
        this.detailPageView.data = {}
        this.detailPageView.similar = []
        editBody('detailClose', '', function (state) {
          if (state) {
            if (_this.pageInfo.total % _this.pageInfo.display === 1) { // 尾页只有1条数据
              _this.pageChange(_this.pageInfo.currentPage - 1)
            }
          } else {
            _this.init()
          }
        })
        this.similarDetailView.isShow = false
        // this.updateScore(obj)
        // setTimeout(() => {
        //   if (this.pageInfo.total % this.pageInfo.display === 1) { // 尾页只有1条数据
        //     this.pageChange(this.pageInfo.currentPage - 1)
        //   } else {
        //     this.init()
        //   }
        // }, 1000)
      },
      updateScore: function (obj) {
        this.followList.forEach((item) => {
          if (item.id === obj.id) {
            item.appraise = [{ name: obj.appraise, status: true }]
            return false
          }
        })
      }
    },
    beforeDestroy() {
      editBody('close', 0)
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
          cursor: pointer;
          .content{
            width: 1091px;
            height: 112px;
            padding: 12px 50px 0 50px;
            .news-title{
              position: relative;
              height: 32px;
              line-height: 32px;
              font-size: 13px;
              & span:first-child{
                cursor: pointer;
                & a{
                  text-decoration: none;
                  color: red;
                }
              }
              & span:nth-child(2){
                cursor: pointer;
              }
              .newsModel{
                margin-left: 20px;
                top: 16px;
                & span{
                  cursor: pointer;
                  position: relative;
                  top: 7px;
                  width: 19px;
                  height: 23px;
                  margin-right: 15px;
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
                .edit {
                  margin-left: -7px;
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -151px -188px;
                }
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
                  margin: 0 5px;
                  font-style: normal;
                }
              }
              & span:nth-child(3){
                margin-left: 50px;
                & a{
                padding: 0 3px;
                text-decoration: none;
                color: #72b4f0;
                }
              }
              .numberView{
                margin-left: 50px;
                & span:first-child{
                  position: relative;
                  top: 7px;
                  width: 20px;
                  height: 11px;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -12px -131px;
                }
                & span:nth-child(2){
                  margin-left: 6px;
                  width: 72px;
                }
                & span:nth-child(3){
                  position: relative;
                  top: 7px;
                  margin-left: 15px;
                  width: 13px;
                  height: 11px;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -82px -131px;
                }
                & span:nth-child(4){
                  margin-left: 6px;
                  width: 72px;
                }
                & span:nth-child(5){
                  position: relative;
                  top: 7px;
                  margin-left: 15px;
                  width: 12px;
                  height: 12px;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -143px -131px;
                }
                & span:last-child{
                  margin-left: 6px;
                  width: 72px;
                }
                & span {
                  & a{
                    margin-left: 6px;
                  }
                }
              }
              & span.like{
                position: relative;
                top: 7px;
                width: 13px;
                height: 12px;
                cursor: pointer;
                background: url("../../../resource/design/img_monitor_img.png") no-repeat -14px -79px;
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
          .mark{
            display: block;
          }
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
