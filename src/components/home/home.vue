<template>
  <div class="homeClass">
    <div class="tagClass">
      <ul class="clearfix">
        <li class="clearfix" @click="realMore()">
          <i></i>
          <span class="radius"></span>
          <span class="number">
              <p>{{tagNumber.totalNum}}</p>
              <p>今日舆情总量</p>
            </span>
        </li>
        <li class="clearfix" @click="negativeMore()">
          <i></i>
          <span class="radius"></span>
          <span class="number">
              <p>{{tagNumber.negativeNum}}</p>
              <p>今日负面舆情</p>
            </span>
        </li>
        <li class="clearfix" @click="toDayMore">
          <i></i>
          <span class="radius"></span>
          <span class="number">
              <p>{{tagNumber.waringNum}}</p>
              <p>今日预警</p>
            </span>
        </li>
        <li class="clearfix" @click="followRouter">
          <i></i>
          <span class="radius"></span>
          <span class="number">
              <p>{{tagNumber.followNum}}</p>
              <p>我的关注</p>
              <i v-if="tagNumber.followNum > 0"></i>
            </span>
        </li>
      </ul>
    </div>
    <div class="content clearfix">
      <div class="toDayClass fn-left">
        <div class="warningClass">
          <div class="title">
            <span>今日预警</span>
            <span @click="toDayMore">MORE>></span>
          </div>
          <div class="warningList">
            <div v-if="warningList.length">
              <ul v-for="(list, index) of warningList" :key="index" @click="detailPageClick(list.id, list.publishDate, 'warning')">
                <li>
                  <span v-bind:class="{'classA': list.warnLevel == 0, 'classB': list.warnLevel == 1, 'classC': list.warnLevel == 2}"><div class="warning-grade">{{list.warnLevel == 0 ? '一级预警' : list.warnLevel == 1 ? '二级预警' : list.warnLevel == 2 ? '三级预警' : ''}}</div></span>
                  {{list.title | replacePFilter(15)}}
                </li>
                <li>{{list.content | replacePFilter(30)}}</li>
                <li class="clearfix">
                  <span class="fn-left" v-if="list.publishDate" v-bind:class="{'colorA': list.warnLevel == 0, 'colorB': list.warnLevel == 1, 'colorC': list.warnLevel == 2}">{{list.publishDate}}</span>
                  <span class="fn-right" v-if="list.source" :title="list.source">【{{list.source | sliceFilter(7)}}】</span>
                </li>
              </ul>
            </div>
            <no-data :toggle="loadingArr.opinionTodayLoading"></no-data>
          </div>
        </div>
        <div class="spreadClass">
          <div class="title">
            <span>今日平台舆情</span>
            <span></span>
          </div>
          <div class="spreadList">
            <div v-show="spreadList.length" id="spreadChart" class="spreadChart"></div>
            <div v-if="spreadList.length" class="infoList">
              <ul class="infoTag clearfix">
                <li>全部消息</li>
                <li>负面消息</li>
              </ul>
              <ul class="infoType">
                <li class="clearfix" v-for="(list, index) of spreadList" :key="index">
                  <span class="fn-left" v-bind:class="list.type">{{list.name}}</span>
                  <span class="fn-left" v-bind:class="{'message': list.name === '留言板'}">{{list.total}}</span>
                  <span class="fn-left">{{list.negative}}</span>
                </li>
              </ul>
            </div>
            <no-data :toggle="loadingArr.spreadLoading"></no-data>
          </div>
        </div>
      </div>
      <div class="optionClass fn-left">
        <div class="themeTrendChart">
          <div class="title">
            <span>实时舆情趋势</span>
          </div>
          <div class="themeChart" id="themeChart"></div>
          <no-data :toggle="loadingArr.themeLoading"></no-data>
        </div>
        <div class="negativeList">
          <div class="title">
            <span>负面舆情</span>
            <span @click="negativeMore()">MORE>></span>
          </div>
          <div class="negativeListClass">
            <div v-if="negativeList.length">
              <div class="ul-wrapper" v-for="(list, index) of negativeList" :key="index">
                <ul>
                  <li class="clearfix">
                    <span class="type" v-if="list.source">【<i :title="list.source">{{list.source | sliceFilter(10)}}</i>】</span>
                    <span class="title" :title="list.title" @click="detailPageClick(list.id, list.publishDate, 'negative')">{{list.title | sliceFilter(40)}}</span>
                    <span class="dateTime fn-right">{{list.publishDate}}</span>
                  </li>
                  <li @click="detailPageClick(list.id, list.publishDate, 'negative')">{{list.content | replacePFilter(100)}}</li>
                  <li class="clearfix">
                    <span class="keys" v-if="list.matchKeys.length" :title="list.matchKeys.join(' ')">关键词：<i v-for="(key, num) of list.matchKey" :key="num">{{key}}</i></span>
                    <span class="author" v-if="list.author">作者：{{list.author | sliceFilter(8)}}</span>
                    <span class="bothNum" @click="toggleSimilar(list.id)" v-show="list.similarNum > 0">【<i>{{list.similarNum}}</i>篇相似】</span>
                    <span class="readNum" title="浏览数">{{list.click}}</span>
                    <span class="rattingNum" title="评论数">{{list.repeatTotal}}</span>
                    <span class="transmitNum" title="转发数">{{list.forward}}</span>
                    <span @click="collectClick(list, $event)" class="collect fn-right" v-bind:class="list.follow  === 1 ? 'collect' : 'dislike'" title="添加关注"></span>
                  </li>
                </ul>
                <div class="similarList" v-if="negativeSimilarIndex === list.id" v-show="negativeSimilarShow">
                  <div class="similar">
                    <div>
                      <span class="title">相似文章</span>
                      <span class="more fn-right" @click="viewMore(list.id)" v-if="list.similarNum > 5">查看更多 ></span>
                    </div>
                    <ul class="link">
                      <li v-for="(item, i) of list.similarEntityList" :key="i">
                        <div>
                          <div class="detail">
                            <span>【<a style="color: red">{{item.sourceName | sliceFilter(14)}}</a>】</span>
                            <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(35)}}</a></span>
                            <span>{{item.publishDate}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <no-data :toggle="loadingArr.negativeOpinionLoading"></no-data>
          </div>
        </div>
        <div class="realDataList">
          <div class="title">
            <span>实时舆情</span>
            <span @click="realMore">MORE>></span>
          </div>
          <div class="realDataListClass">
            <div v-if="realList.length">
              <div v-for="(list, index) of realList" :key="index">
                <ul>
                  <li class="clearfix">
                    <span class="type" v-if="list.source">【<i :title="list.source">{{list.source | sliceFilter(10)}}</i>】</span>
                    <span class="title" :title="list.title" @click="detailPageClick(list.id, list.publishDate, 'real')">{{list.title | sliceFilter(28)}}</span>
                    <span class="score">
                        <i v-for="(score, number) of list.appraise" :key="number" :class="list.appraise.length === 1 ? {'positive': score.name === '正面', 'neutral': score.name === '中性', 'negative': score.name === '负面'} : {'positiveHover': score.name === '正面' && score.status, 'positivePlus': score.name === '正面' && !score.status,
                              'neutralHover': score.name === '中性' && score.status, 'neutralPlus': score.name === '中性' && !score.status,
                              'negativeHover': score.name === '负面' && score.status, 'negativePlus': score.name === '负面' && !score.stauts}" @click="editScore(list, score, $event)"></i>
                        <i class="edit" @click="editClick(list, $event)" title="我要修改"></i>
                      </span>
                    <span class="dateTime fn-right">{{list.publishDate}}</span>
                  </li>
                  <li @click="detailPageClick(list.id, list.publishDate, 'real')">{{list.content | replacePFilter(100)}}</li>
                  <li class="clearfix">
                    <span class="keys" v-if="list.matchKeys.length" :title="list.matchKeys.join(' ')">关键词：<i v-for="(key, num) of list.matchKey" :key="num">{{key}}</i></span>
                    <span class="author" v-if="list.author">作者：{{list.author | sliceFilter(8)}}</span>
                    <span class="bothNum" @click="toggleRealSimilar(list.id)" v-show="list.similarNum > 0">【<i>{{list.similarNum}}</i>篇相似】</span>
                    <span class="readNum" title="浏览数">{{list.click}}</span>
                    <span class="rattingNum" title="评论数 ">{{list.repeatTotal}}</span>
                    <span class="transmitNum" title="转发数">{{list.forward}}</span>
                    <span @click="collectClick(list, $event)" class="collect fn-right" v-bind:class="list.follow === 1 ? 'collect' : 'dislike'" title="添加关注"></span>
                  </li>
                </ul>
                <div class="similarList" v-if="realSimilarIndex === list.id" v-show="realSimilarShow">
                  <div class="similar">
                    <div>
                      <span class="title">相似文章</span>
                      <span class="more fn-right" @click="viewMore(list.id)" v-if="list.similarNum > 5">查看更多 ></span>
                    </div>
                    <ul class="link">
                      <li v-for="(item, i) of list.similarEntityList" :key="i">
                        <div>
                          <div class="detail">
                            <span>【<a style="color: red">{{item.sourceName | sliceFilter(14)}}</a>】</span>
                            <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(35)}}</a></span>
                            <span>{{item.publishDate}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <no-data :toggle="loadingArr.realDataLoading"></no-data>
          </div>
        </div>
      </div>
    </div>
    <detail-page :warning="detailPageView" @closeDetail="closeDetail" @changeMyFollow="changeMyFollow"></detail-page>
    <similar-detail @closeDetail="closeDetail" :similar="similarDetailView"></similar-detail>
  </div>
</template>

<script type="application/ecmascript">
  import noData from '../component/vue-noData'
  import detailPage from '../component/detailPage'
  import charts from '../../common/js/echartsService'
  import similarDetail from '../../components/component/similarDetailPage'
  import { initFun, getLocalStorage, setLocalStorage } from '../../common/js/cookie'
  import {addKeyStyleForContent, editBody} from '../../common/js/common'
  export default {
    name: 'home',
    components: {
      noData: noData,
      detailPage: detailPage,
      similarDetail: similarDetail
    },
    data() {
      return {
        handleFollowStatus: false,
        initParams: {
          userId: '',
          taskId: ''
        },
        loadingArr: {
          opinionTodayLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
          spreadLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
          themeLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
          negativeOpinionLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
          realDataLoading: {loading: true, noData: false, errorWork: false, tooltip: ''}
        },
        negativeSimilarShow: false,
        negativeSimilarIndex: '',
        realSimilarShow: false,
        realSimilarIndex: '',
        similarDetailView: {
          isShow: false,
          data: []
        },
        tagNumber: {totalNum: 0, negativeNum: 0, waringNum: 0, followNum: 0},
        warningList: [],
        spreadList: [],
        negativeList: [],
        realList: [],
        realDefaultValue: [],
        defaultScore: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
        detailPageView: { foucusClick: false, fire: false, score: true, follow: true, isShow: false, data: {}, similar: [] }
      }
    },
    mounted() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
          this.initParams.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        }
        this.spreadRequest()
        this.themeRequest()
        this.toDayOptionRequest()
        this.toDayOpinionRequest()
        this.negativeDataRequest()
        this.realDataRequest()
        this.globalClick(this.appraiseDefault)
      } else {
        this.$router.replace({path: '/login'})
      }
      // 定时器
      this._minuteTimeOut = setInterval(() => {
        this.toDayOptionRequest()
        this.spreadRequest()
        this.themeRequest()
      }, 60000)
      this._tenSecondsTimeOut = setInterval(() => {
        this.toDayOpinionRequest()
        this.negativeDataRequest()
      }, 10000)
      this._realDataTimeOut = setInterval(() => {
        this.realDataRequest()
      }, 10000)
    },
    methods: {
      // 今日舆情总量、负面舆情、预警推送、我的关注
      toDayOptionRequest: function() {
        let params = {}
        if (this.initParams.userId) params.userId = this.initParams.userId
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        let url = this.$store.state.url + 'theme/countData/count'
        // dataCacheTotal
        this.$get(url, params).then(response => {
          if (response.status === 1) {
            response = response.data
            this.tagNumber = {
              totalNum: response.dataCacheAll,
              negativeNum: response.dataCacheNegative,
              waringNum: response.warnCount,
              followNum: response.followCount
            }
          }
        }).catch(error => {
          this.$layer.msg(error)
        })
      },
      // 今日预警数据请求
      toDayOpinionRequest: function() {
        let params = {}
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        let url = this.$store.state.url + 'warns/warn/todayWarn'
        this.$get(url, params).then(response => {
          if (response.status === 1 && Array.isArray(response.data) && response.data.length) {
            this.loadingArr.opinionTodayLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
            this.warningList = response.data
          } else {
            this.warningList = []
            this.loadingArr.opinionTodayLoading = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          this.loadingArr.opinionTodayLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      // 今日平台舆情
      spreadRequest: function() {
        let _this = this
        let params = {}
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        let url = this.$store.state.url + 'theme/userCache/listData'
        _this.$get(url, params).then(response => {
          if (response.status === 1) {
            _this.spreadList = []
            response = response.data
            if (response.dataPositive && response.dataNeutral && response.dataNegative) {
              let dataList = [response.dataPositive, response.dataNeutral, response.dataNegative, response.total]
              _this.loadingArr.spreadLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
              response = _this.dataCalculation(dataList)
              _this.dataRecombination(response)
              let chartsData = _this.chartDataRecombination(_this.spreadList)
              _this.spreadCharts(chartsData)
            } else {
              _this.loadingArr.spreadLoading = {loading: false, noData: true, errorWork: false, tooltip: ''}
            }
          }
          if (response.status === 0) {
            _this.spreadList = []
            _this.spreadCharts()
            _this.loadingArr.spreadLoading = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          this.spreadList = []
          this.spreadCharts()
          this.loadingArr.spreadLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      spreadCharts: function(data) {
        let index = 0
        // let app = {currentIndex: -1}
        let spreadChart = this.$echarts.init(document.getElementById('spreadChart'))
        spreadChart.clear()
        if (data) {
          let option = charts.homeSpreadPie(data)
          spreadChart.setOption(option)
          // setInterval(function () {
          //   let dataLen = data.legend.length
          //   spreadChart.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: app.currentIndex})
          //   app.currentIndex = (app.currentIndex + 1) % dataLen
          //   spreadChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: app.currentIndex})
          //   spreadChart.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: app.currentIndex})
          // }, 1000)
          spreadChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0})
          spreadChart.on('mouseover', function(e) {
            if (e.dataIndex !== index) {
              spreadChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index })
            }
          })
          spreadChart.on('mouseout', function(e) {
            index = e.dataIndex
            spreadChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex })
          })
        }
      },
      // 实时舆情趋势请求
      themeRequest: function() {
        let params = {}
        if (this.initParams.userId) params.userId = this.initParams.userId
        let url = this.$store.state.url + 'theme/countData/theme'
        this.$get(url, params)
          .then(response => {
            if (response.status === 1) {
              this.loadingArr.themeLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
              if (!Array.isArray(response.data[0]) && response.data[0].length) {
                response.data[0] = response.data[0].split(',')
              }
              let data = {
                legend: response.data[0],
                xAxis: response.data[1],
                data: response.data[2]
              }
              this.themeChart(data)
            }
            if (response.status === 0) {
              this.loadingArr.themeLoading = {loading: false, noData: true, errorWork: false, tooltip: response.message}
              this.themeChart()
            }
          }).catch(error => {
          this.loadingArr.themeLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
          this.themeChart()
        })
      },
      themeChart: function(data) {
        let theme = this.$echarts.init(document.getElementById('themeChart'))
        theme.clear()
        if (data) {
          let option = charts.homeThemeCharts(data)
          theme.setOption(option)
        }
      },
      // 负面舆情数据请求
      negativeDataRequest: function() {
        let _this = this
        let params = {}
        let url = this.$store.state.url + 'search/publicSentiment/negative'
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        this.$get(url, params)
          .then(response => {
            if (response.status === 1 && Array.isArray(response.data) && response.data.length) {
              this.loadingArr.negativeOpinionLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
              response.data.forEach(function (item) {
                item.matchKeys = item.matchKeys.split(',').slice(0, 8)
                item.matchKey = item.matchKeys.slice(0, 8)
              })
              _this.negativeList = response.data.slice(0, 5)
            } else {
              _this.negativeList = []
              this.loadingArr.negativeOpinionLoading = {loading: false, noData: true, errorWork: false, tooltip: response.message}
            }
          }).catch(error => {
          _this.negativeList = []
          this.loadingArr.negativeOpinionLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      // 负面舆情相似文章列表展开
      toggleSimilar: function(index) {
        if (this.negativeSimilarIndex === index) {
          this.negativeSimilarIndex = ''
          this.negativeSimilarShow = false
          this._tenSecondsTimeOut = setInterval(() => {
            this.toDayOpinionRequest()
            this.negativeDataRequest()
          }, 10000)
        } else {
          this.negativeSimilarIndex = index
          this.negativeSimilarShow = true
          clearInterval(this._tenSecondsTimeOut)
        }
      },
      // 详情页数据请求
      detailPageClick: function(dataId, time, type) {
        if (type === 'real') {
          this.detailPageView.score = true
          this.realSimilarShow = false
          if (this.realSimilarIndex === dataId) {
            this.realSimilarShow = true
          }
        } else {
          this.detailPageView.score = false
          this.negativeSimilarShow = false
          if (this.negativeSimilarIndex === dataId) {
            this.negativeSimilarShow = true
          }
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
          } else {
            this.$layer.msg(response.message)
          }
        })
      },
      // 实时数据数据请求
      realDataRequest: function() {
        let params = {}
        let url = this.$store.state.url + 'search/publicSentiment/realTime'
        if (this.initParams.taskId) params.taskId = this.initParams.taskId
        this.$get(url, params)
          .then(response => {
            if (response.status === 1 && Array.isArray(response.data) && response.data.length) {
              this.realList = []
              this.loadingArr.realDataLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
              response.data.forEach(function (item) {
                item.matchKeys = item.matchKeys.split(',')
                item.matchKey = item.matchKeys.slice(0, 8)
                item.appraise = [{ name: item.appraise, status: true }]
              })
              this.realList = response.data
            } else {
              this.realList = []
              this.loadingArr.realDataLoading = {loading: false, noData: true, errorWork: false, tooltip: response.message}
            }
          }).catch(error => {
          this.realList = []
          this.loadingArr.realDataLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      // 实时舆情相似文章列表展开
      toggleRealSimilar: function(index) {
        if (this.realSimilarIndex === index) {
          this.realSimilarIndex = ''
          this.realSimilarShow = false
          this._tenSecondsTimeOut = setInterval(() => {
            this.toDayOpinionRequest()
            this.negativeDataRequest()
          }, 10000)
        } else {
          this.realSimilarIndex = index
          this.realSimilarShow = true
          clearInterval(this._tenSecondsTimeOut)
        }
      },
      // 查看更多相似文章
      viewMore: function(id) {
        this.similarDetailView.isShow = true
        this.similarDetailView.id = id
      },
      // 我的关注
      followRouter: function() {
        this.$router.push({path: '/follow'})
      },
      // 今日预警
      toDayMore: function() {
        this.$router.push({path: '/warning'})
      },
      // 负面舆情More；负面舆情总量
      negativeMore: function() {
        setLocalStorage('monitorEmotion', '负面')
        this.$router.push({path: '/monitor'})
      },
      // 实时舆情More；今日舆情总量
      realMore: function() {
        setLocalStorage('monitorEmotion', '全部')
        this.$router.push({path: '/monitor'})
      },
      // 添加关注
      collectClick: function (list, e) {
        e.stopPropagation()
        if (!this.handleFollowStatus) {
          let _this = this
          this.userFollowRequest(list, function (obj) {
            list.follow = obj.data
            _this.tagNumber.followNum = list.follow === 1 ? _this.tagNumber.followNum + 1 : _this.tagNumber.followNum - 1
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
      // 情感属性编辑
      editClick: function (list, e) {
        e.stopPropagation()
        this.realList.forEach(item => {
          if (item.appraise.length === this.defaultScore.length) {
            item.appraise = this.realDefaultValue
          }
        })
        this.realDefaultValue = list.appraise
        let tempList = []
        this.defaultScore.forEach(function (item) {
          if (item.name === list.appraise[0].name) {
            item.status = true
          } else {
            item.status = false
          }
          tempList.push(item)
        })
        list.appraise = tempList
      },
      // 修改情感属性
      editScore: function (list, appraise, e) {
        e.stopPropagation()
        if (list.appraise.length === 3) {
          let _this = this
          this.editScoreRequest(list, appraise, function (score, status) {
            if (status === 1) {
              list.appraise = [score]
                _this.negativeDataRequest()
              if (list.appraise[0].name === '负面') {
                _this.tagNumber.negativeNum = _this.tagNumber.negativeNum + 1
              }
              _this.$layer.msg('修改成功', {offset: '150px'})
            } else {
              list.appraise = _this.realDefaultValue
              _this.$layer.msg('修改失败')
            }
          })
        }
      },
      appraiseDefault: function(e) {
        let _this = this
        e.stopPropagation()
        e = e || window.event
        let className = e.target.className
        if (className !== 'edit' && className !== 'positive' && className !== 'neutral' && className !== 'negative') {
          this.realList.forEach(function (item) {
            if (Array.isArray(item.appraise) && item.appraise.length === 3) {
              item.appraise = _this.realDefaultValue
            }
          })
        }
        if (className === 'title' || className === 'detail-page' || className === 'wrapper' || className === 'keyWord' || className === 'content') {
          _this.detailPageView.foucusClick = true
        }
      },
      // 新闻正中负修改请求
      editScoreRequest: function(list, score, callback) {
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
      closeDetail: function(data) {
        editBody('detailClose')
        this.detailPageView = { foucusClick: false, fire: false, score: true, follow: true, isShow: false, data: {}, similar: [] }
        this.negativeDataRequest()
        this.realDataRequest()
        this.similarDetailView.isShow = false
      },
      changeMyFollow: function(isFollow) {
        this.tagNumber.followNum = isFollow === 1 ? this.tagNumber.followNum + 1 : this.tagNumber.followNum - 1
      },
      // 计算今日平台舆情数据
      dataCalculation: function (arr) {
        let _this = this
        if (Array.isArray(arr) && arr.length) {
          arr.forEach(function (item, index) {
            for (let key in item) {
              switch (key) {
                case 'news':
                  if (index === 0) _this.spreadList.push({name: '新闻', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'bbs':
                  if (index === 0) _this.spreadList.push({name: '论坛', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'microBlog':
                  if (index === 0) _this.spreadList.push({name: '微博', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'msgBoard':
                  if (index === 0) _this.spreadList.push({name: '留言板', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'printMedia':
                  if (index === 0) _this.spreadList.push({name: '平媒', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'search':
                  if (index === 0) _this.spreadList.push({name: '云搜', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'tieba':
                  if (index === 0) _this.spreadList.push({name: '贴吧', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                case 'wechat':
                  if (index === 0) _this.spreadList.push({name: '微信', positive: 0, neutral: 0, total: 0, negative: 0, type: key})
                  break
                default:
                  break
              }
            }
          })
        }
        return arr
      },
      // 数据重写
      dataRecombination: function (list) {
        let _this = this
        if (Array.isArray(_this.spreadList) && _this.spreadList.length) {
          if (Array.isArray(list) && list.length) {
            list.forEach(function (item, index) {
              _this.spreadList.forEach(function (vo) {
                if (item.appraise === '正面') {
                  vo.positive = item[vo.type]
                }
                if (item.appraise === '中性') {
                  vo.neutral = item[vo.type]
                }
                if (item.appraise === '负面') {
                  vo.negative = item[vo.type]
                }
                if (item.appraise === '总数') {
                  vo.total = item[vo.type]
                }
              })
            })
          }
        }
      },
      chartDataRecombination: function (list) {
        let legend = []
        let data = []
        list.forEach(function (item) {
          legend.push(item.name)
          data.push({value: item.total, name: item.name})
        })
        return {
          legend: legend,
          data: data
        }
      }
    },
    beforeDestroy() {
      clearInterval(this._minuteTimeOut)
      clearInterval(this._tenSecondsTimeOut)
      clearInterval(this._realDataTimeOut)
      clearInterval(this._pieTimeOut)
      editBody('close', 0)
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/common";
  @borderColor: #ebebeb;
  .homeClass {
    width: 100%;
    .tagClass {
      width: 100%;
      & ul {
        & li {
          width: 292px;
          height: 92px;
          line-height: 50px;
          text-align: center;
          border: 2px solid #DBDBDB;
          border-radius: 5px;
          float: left;
          margin-right: 10px;
          position: relative;
          background: white;
          box-sizing: border-box;
          cursor: pointer;
          & i{
            position: absolute;
            width: 5px;
            height: 32px;
            top: 8px;
            left: 0;
          }
          & span.radius{
            width: 70px;
            height: 70px;
            margin: 13px 0 0 35px;
            display: block;
            float: left;
          }
          & span.number{
            display: block;
            margin-top: 20px;
            line-height: 26px;
            & p:first-child{
              font-size: 18px;
            }
          }
        }
        & li:first-child{
          & i {
            .border-left(5px, #AE09E1);
          }
          & span.radius{
            background: url("../../assets/home/img_homepage_date.png") no-repeat 0 0;
          }
          & span.number{
            & p:first-child {
              color: #AE09E1;
            }
          }
        }
        & li:nth-child(2){
          & i {
            .border-left(5px, #E10835);
          }
          & span.radius{
            background: url("../../assets/home/img_homepage_date.png") no-repeat -301px 0;
          }
          & span.number{
            & p:first-child {
              color: #E10835;
            }
          }
        }
        & li:nth-child(3){
          & i {
            .border-left(5px, #EDB307);
          }
          & span.radius{
            background: url("../../assets/home/img_homepage_date.png") no-repeat -605px 0;
          }
          & span.number{
            & p:first-child {
              color: #EDB307;
            }
          }
        }
        & li:last-child{
          margin-right: 0;
          & i {
            .border-left(5px, #06BCE3);
          }
          & span.radius{
            background: url("../../assets/home/img_homepage_date.png") no-repeat -900px 0;
          }
          & span.number{
            & p:first-child {
              color: #06BCE3;
            }
            & i {
              position: absolute;
              background: rgba(225, 0, 0, 1);
              width: 10px;
              height: 10px;
              padding: 0;
              margin: 0;
              border: 0;
              border-radius: 5px;
              left: 78%;
              top: 55%;
            }
          }
        }
      }
    }
    .content {
      width: 100%;
      margin-top: 10px;
      .toDayClass {
        width: 320px;
        height: auto;
        .warningClass {
          width: 318px;
          height: 673px;
          border: 2px solid #dcdcdc;
          padding-top: 5px;
          background: white;
          & div.title {
            & span:first-child{
              font-size: 16px;
              .border-left(5px, #0068b7)
            }
            & span:last-child {
              font-size: 12px;
              color: #999999;
              float: right;
              margin: 10px;
              cursor: pointer;
            }
          }
          & div.warningList{
            width: auto;
            height: 595px;
            position: relative;
            & ul {
              padding: 18px 15px;
              background: url("../../assets/home/line.png") no-repeat 30px 0;
              cursor: pointer;
              & li{
                font-size: 13px;
                padding-left: 30px;
              }
              & li:first-child {
                width: auto;
                height: 25px;
                line-height: 25px;
                font-size: 14px;
                position: relative;
                & span {
                  display: inline-block;
                  position: absolute;
                  top: 1px;
                  left: 0;
                  width: 20px;
                  height: 20px;
                  cursor: pointer;
                }
                & span:hover {
                  & div.warning-grade {
                    display: inline-block;
                  }
                }
                & span.classA {
                  .fire-icon(1);
                }
                & span.classB {
                  .fire-icon(2);
                }
                & span.classC {
                  .fire-icon(3);
                }
                .warning-grade{
                  position: absolute;
                  left: 25px;
                  top: -45px;
                  width: 100px;
                  height: 50px;
                  line-height: 50px;
                  background: rgba(153,153,153,0.9);
                  color: #fff;
                  font-size: 12px;
                  text-align: center;
                  border-radius: 3px;
                  display: none;
                }
              }
              & li:nth-child(2) {
                width: auto;
                line-height: 20px;
                color: #666666;
              }
              & li:last-child {
                margin-top: 5px;
                & span {
                  color: #666;
                }
                & span.colorA {
                  color: #e20836;
                }
                & span.colorB {
                  color: #ff450d;
                }
                & span.colorC {
                  color: #ff7f0d;
                }
              }
            }
            & ul:hover {
              background: #f6f6f6;
            }
            /*& ul:first-child {*/
            /*background: none;*/
            /*}*/
          }
        }
        .spreadClass {
          width: 318px;
          height: 865px;
          border: 2px solid #dcdcdc;
          margin-top: 10px;
          padding-top: 5px;
          background: white;
          & div.title {
            & span:first-child{
              font-size: 16px;
              .border-left(5px, #0068b7)
            }
            & span:last-child {
              font-size: 12px;
              color: #999999;
              float: right;
              margin: 10px;
              cursor: pointer;
            }
          }
          & div.spreadList {
            width: 290px;
            height: 789px;
            margin: 0 auto;
            position: relative;
            & div.spreadChart {
              width: 290px;
              height: 310px;
              margin: 15px auto 0;
            }
            & div.infoList {
              width: auto;
              & ul.infoTag {
                width: 140px;
                margin: 40px auto 0;
                & li {
                  float: left;
                  font-size: 14px;
                  text-align: center;
                  padding: 4px 4px;
                  border-radius: 2px;
                }
                & li:first-child {
                  border: 1px solid #2885dd;
                  color: #2885dd;
                  margin-right: 8px;
                }
                & li:last-child {
                  border: 1px solid #ed1f41;
                  color: #ed1f41;
                }
              }
              & ul.infoType {
                width: 90%;
                margin: 25px auto 0;
                & li {
                  width: 100%;
                  height: 50px;
                  line-height: 50px;
                  box-sizing: border-box;
                  border-bottom: 1px solid @borderColor;
                  font-size: 14px;
                  & span:first-child {
                    padding: 0 0 0 45px;
                  }
                  & span:nth-child(2) {
                    width: 66px;
                    height: 24px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 1px solid #2885dd;
                    color: #2885dd;
                    margin: 13px 8px 0 30px;
                    text-align: center;
                    line-height: 24px;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                  }
                  & span:last-child {
                    width: 66px;
                    height: 24px;
                    font-size: 12px;
                    border: 1px solid #ed1f41;
                    color: #ed1f41;
                    margin: 13px 8px 0 0;
                    text-align: center;
                    line-height: 24px;
                    border-top-right-radius: 12px;
                    border-bottom-right-radius: 12px;
                  }
                  & span.news {
                    .source-icon('news');
                  }
                  & span.bbs {
                    .source-icon('bbs');
                  }
                  & span.search {
                    .source-icon('blog')
                  }
                  & span.microBlog {
                    .source-icon('microBlog')
                  }
                  & span.tieba {
                    .source-icon('postBar')
                  }
                  & span.wechat {
                    .source-icon('weChat')
                  }
                  & span.printMedia {
                    .source-icon('media')
                  }
                  & span.msgBoard {
                    .source-icon('messageBoard')
                  }
                  & span.search {
                    .source-icon('search')
                  }
                  & span.message {
                    margin-left: 15px;
                  }
                }
                & li:last-child {
                  border-bottom: none;
                }
              }
            }
          }
        }
      }
      .optionClass {
        width: 868px;
        margin-left: 10px;
        box-sizing: border-box;
        .themeTrendChart {
          width: 866px;
          height: 240px;
          border: 2px solid #dcdcdc;
          padding-top: 5px;
          margin-bottom: 10px;
          background: white;
          position: relative;
          & div.title {
            & span:first-child {
              font-size: 16px;
              .border-left(5px, #0068b7)
            }
          }
          & div.themeChart {
            width: auto;
            height: 210px;
          }
        }
        .negativeList {
          width: 866px;
          height: 650px;
          padding-top: 5px;
          margin-bottom: 10px;
          background: white;
          border: 2px solid #dcdcdc;
          & div.title {
            & span:first-child {
              font-size: 16px;
              .border-left(5px, #0068b7)
            }
            & span:last-child {
              font-size: 12px;
              color: #999999;
              float: right;
              margin: 10px;
              cursor: pointer;
            }
          }
          & div.negativeListClass {
            overflow-y: auto;
            position: relative;
            .list();
            height: 580px;
            & ul {
              cursor: pointer;
            }
            & ul:hover {
              background: #f6f6f6;
            }
          }
        }
        .realDataList {
          width: 866px;
          height: 632px;
          border: 2px solid #dcdcdc;
          padding-top: 5px;
          background: white;
          & div.title {
            & span:first-child {
              font-size: 16px;
              .border-left(5px, #0068b7)
            }
            & span:last-child {
              font-size: 12px;
              color: #999999;
              float: right;
              margin: 10px;
              cursor: pointer;
            }
          }
          & div.realDataListClass {
            position: relative;
            overflow-y: auto;
            .list();
            height: 580px;
            & ul {
              cursor: pointer;
              & li:first-child {
                position: relative;
                & span.score {
                  position: absolute;
                  top: 9px;
                  & i {
                    display: inline-block;
                    width: 19px;
                    height: 23px;
                    cursor: pointer;
                    margin-right: 15px;
                  }
                  & i:first-child {
                    margin-left: 19px;
                  }
                  & i.positive {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
                  }
                  & i.positivePlus {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
                  }
                  & i.positivePlus:hover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -221px;
                  }
                  & i.positiveHover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -221px;
                  }
                  & i.neutral {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
                  }
                  & i.neutralPlus {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
                  }
                  & i.neutralPlus:hover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -221px;
                  }
                  & i.neutralHover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -221px;
                  }
                  & i.negative {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
                  }
                  & i.negativePlus {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
                  }
                  & i.negativePlus:hover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -221px;
                  }
                  & i.negativeHover {
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -221px;
                  }
                  & i.edit {
                    margin-left: -7px;
                    background: url("../../assets/public/img_monitor_img.png") no-repeat -151px -188px;
                  }
                }
              }
            }
            & ul:hover {
              background: #f6f6f6;
            }
          }
        }
      }
    }
  }
</style>
