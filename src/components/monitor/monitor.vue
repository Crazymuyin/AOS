<template>
  <div>
    <div class="wrapper">
      <div class="wrapper-left">
        <div class="theme-title">
          <div class="icon-theme"></div>
          <span>主题列表</span>
        </div>
        <!--<div class="theme-list" v-if="returnStatus(runStatus.themeRunStatus)">-->
          <!--<ul v-for="(list, index) of themeList" :key="index">-->
            <!--<li :class="{'active': currentIndex.themeIndex === index}" @click="toggleTheme(list, index)"-->
                <!--:title="list.name" v-if="runStatus.themeRunStatus">{{list.name | sliceFilter(14)}}-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
        <my-tree :model="model" @menuSearch="toggleTheme"></my-tree>
        <no-data :toggle="runStatus.themeRunStatus"></no-data>
      </div>
      <div class="wrapper-right">
        <div class="wrapper-top">
          <div class="condition">
            <div>
              <span class="fn-left">条件筛选</span>
            </div>
            <div>
              <span class="fn-left">媒体来源：</span>
              <ul v-for="(list, index) of sourceList" :key="index">
                <li class="fn-left" :class="{'active': currentIndex.sourceIndex === index}"
                    @click="toggleSource(list, index)">{{list.name}}
                </li>
              </ul>
            </div>
            <div>
              <span class="fn-left">情感属性：</span>
              <ul v-for="(list, index) of emotionList" :key="index">
                <li class="fn-left" :class="{'active': currentIndex.emotionIndex === index}"
                    @click="toggleEmotion(list, index)">{{list.name}}
                </li>
              </ul>
            </div>
            <div>
              <span class="fn-left">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</span>
              <ul v-for="(list, index) of dateList" :key="index">
                <li class="fn-left" :class="{'active': currentIndex.dateIndex === index}"
                    @click="toggleDate(list, index)">{{list.name}}
                </li>
              </ul>
              <div class="date-wrap" v-if="currentIndex.dateIndex === 3">
                <!-- <myDatepicker class="fn-left" :date="customDate.startTime" :option="startOption" :limit="limit"></myDatepicker>
                <span class="fn-left">至</span>
                <myDatepicker class="fn-left" :date="customDate.endTime" :option="endOption" :limit="limit"></myDatepicker> -->
                <el-date-picker :editable="false" v-model="customDateTime" type="datetimerange" align="left" unlink-panels range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '00:00:00']" :picker-options="pickerOptions" @change="customDateChange()">
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="wrapper-bottom">
          <div v-if="returnStatus(runStatus.monitorRunStatus)">
            <div class="icon-left"></div>
            <div class="list-content">
              <div v-for="(list, index) of monitorList " :key="index">
                <ul>
                  <li class="clearfix">
                    <span class="type" v-if="list.newsName.length">【<i :title="list.newsName">{{list.newsName | sliceFilter(10)}}</i>】</span>
                    <span class="title" :title="list.newsTitle" @click="expandDetail(list)">{{ list.newsTitle | replacePFilter(33)}}</span>
                    <span class="appraise">
                        <i v-for="(appraise, number) of list.appraise" :key="number"
                           :class="list.appraise.length === 1 ? {'positive': appraise.name === '正面', 'neutral': appraise.name === '中性', 'negative': appraise.name === '负面'} : {'positiveHover': appraise.name === '正面' && appraise.status, 'positivePlus': appraise.name === '正面' && !appraise.status,
                            'neutralHover': appraise.name === '中性' && appraise.status, 'neutralPlus': appraise.name === '中性' && !appraise.status,
                            'negativeHover': appraise.name === '负面' && appraise.status, 'negativePlus': appraise.name === '负面' && !appraise.stauts}" @click="editappraise(list, appraise, $event)"></i>
                        <i class="edit" @click="editClick(list, $event)" title="我要修改"></i>
                      </span>
                    <span class="dateTime fn-right">{{list.newsDate}}</span>
                  </li>
                  <li @click="expandDetail(list)">{{ list.newsContent | replacePFilter(105) }}</li>
                  <li class="clearfix">
                    <span class="keys" v-if="list.keyWords.length" :title="list.keyWords">关键词：<i v-for="(vo, index) of list.keyWords" :key="index">{{vo}}&nbsp;&nbsp;</i></span>
                    <span class="author" v-if="list.author">作者：{{list.author | sliceFilter(8)}}</span>
                    <span class="similarNum" @click="toggleMonitorSimilar(list.id)" v-if="list.similarNum > 0">【<i>{{list.similarNum}}</i>篇相似】</span>
                    <span class="readNum" title="浏览数">{{list.readNum}}</span>
                    <span class="commentsNum" title="评论数">{{list.commentsNum}}</span>
                    <span class="forwardNum" title="转发数">{{list.forwardNum}}</span>
                    <span @click="followClick(list, $event)" class="follow fn-right" :class="list.follow === 1 ? 'follow' : 'disfollow'" title="添加关注"></span>
                  </li>
                </ul>
                <div class="similarList" v-if="monitorSimilarIndex === list.id" v-show="monitorSimilarShow">
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
                            <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(40)}}</a></span>
                            <span>{{item.publishDate}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="page">
              <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
            </div>
          </div>
          <no-data :toggle="runStatus.monitorRunStatus"></no-data>
        </div>
      </div>
      <v-detail :warning="detailPageView" @closeDetail="closeDetail"></v-detail>
      <similar-detail @closeDetail="closeDetail" :similar="similarDetailView"></similar-detail>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  import page from '../../components/component/pagination'
  import detail from '../../components/component/detailPage'
  import similarDetail from '../../components/component/similarDetailPage'
  import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
  import noData from '../component/vue-noData'
  import myTree from '../myTree/myTree'
  import {initFun, getLocalStorage, delLocalStorage} from '../../common/js/cookie'
  import {addKeyStyleForContent, editBody} from '../../common/js/common'

  export default {
    name: 'monitor',
    components: {
      'v-pagination': page,
      'v-detail': detail,
      'myDatepicker': myDatepicker,
      'no-data': noData,
      'my-tree': myTree,
      'similar-detail': similarDetail
    },
    data() {
      return {
        handleFollowStatus: false,
        initParams: {
          userId: '',
          taskId: ''
        },
        model: {
          isShow: false,
          themeRunStatus: true,
          menuList: []
        },
        sourceList: [{name: '全部', status: true}, {name: '新闻', status: false}, { name: '论坛', status: false }, {name: '新浪微博', status: false}, {name: '微信', status: false}, {name: '平媒', status: false}, { name: '贴吧', status: false
        }, {name: '留言板', status: false}, {name: '中正云搜', status: false}],
        emotionList: [{name: '全部', status: true}, {name: '正面', status: false}, {name: '中性', status: false}, { name: '负面', status: false }],
        dateList: [{name: '今天', status: true}, {name: '一周', status: false}, { name: '15天', status: false }, {name: '自定义', status: false}],
        runStatus: {
          themeRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          monitorRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
        },
        themeList: [],
        monitorList: [],
        monitorSimilarShow: false,
        monitorSimilarIndex: '',
        currentIndex: { themeIndex: 0, sourceIndex: 0, emotionIndex: 0, dateIndex: 0 },
        defaultAppraise: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
        realDefaultValue: [],
        condition: { themeId: '', source: '全部', emotion: '全部', date: '今天' },
        pageInfo: { total: 0, display: 7, currentPage: 1, pageGroup: 11 },
        detailPageView: { foucusClick: false, fire: false, score: true, isShow: false, follow: true, data: {}, similar: [] },
        similarDetailView: {
          isShow: false,
          id: ''
        },
        // customDate: { startTime: { time: '' }, endTime: { time: '' } },
        pickerOptions: {
          disabledDate(time) {
            let curDate = (new Date()).getTime()
            let three = 3600 * 1000 * 24 * 90
            let threeMonths = curDate - three
            return time.getTime() > Date.now() || time.getTime() < threeMonths
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
          // {
          //   text: '时间不限',
          //   onClick(picker) {
          //     picker.$emit('pick', ['', ''])
          //   }
          // }
          ]
        },
        customDateTime: ''
        // startOption: {
        //   type: 'day', // min, day , multi-day
        //   week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        //   month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        //   format: 'YYYY-MM-DD', // YYYY-MM-DD 日期
        //   inputStyle: { // input 样式
        //     'display': 'inline-block',
        //     'padding': '6px',
        //     'line-height': '22px',
        //     'text-align': 'center',
        //     'width': '112px',
        //     'height': '12px',
        //     'font-size': '16px',
        //     'border': '2px solid #fff',
        //     'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        //     'border-radius': '2px',
        //     'color': '#5F5F5F',
        //     'margin': '0',
        //     'cursor': 'pointer'
        //   },
        //   color: { // 字体颜色
        //     header: '#35acff', // 头部
        //     headerText: '#fff' // 头部文案
        //   },
        //   buttons: { // button 文案
        //     ok: '确定',
        //     cancel: '取消'
        //   },
        //   overlayOpacity: 0.5, // 遮罩透明度
        //   placeholder: '请选择开始时间', // 提示日期
        //   dismissible: true // 默认true  待定
        // },
        // endOption: {
        //   type: 'day',
        //   week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        //   month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        //   format: 'YYYY-MM-DD',
        //   inputStyle: {
        //     'display': 'inline-block',
        //     'padding': '6px',
        //     'line-height': '22px',
        //     'text-align': 'center',
        //     'width': '112px',
        //     'height': '12px',
        //     'font-size': '16px',
        //     'border': '2px solid #fff',
        //     'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        //     'border-radius': '2px',
        //     'color': '#5F5F5F',
        //     'margin': '0',
        //     'cursor': 'pointer'
        //   },
        //   color: { // 字体颜色
        //     header: '#35acff', // 头部
        //     headerText: '#fff' // 头部文案
        //   },
        //   buttons: { // button 文案
        //     ok: '确定',
        //     cancel: '取消'
        //   },
        //   placeholder: '请选择结束时间',
        //   dismissible: true
        // },
        // limit: [
        //   {
        //     type: 'weekday',
        //     available: [1, 2, 3, 4, 5, 6, 0]
        //   },
        //   {
        //     type: 'fromto',
        //     from: '1949-10-01',
        //     to: '2049-10-01'
        //   }
        // ]
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        }
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
          this.initParams.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        if (getLocalStorage('monitorEmotion') === '负面') {
          this.currentIndex = { themeIndex: 0, sourceIndex: 0, emotionIndex: 3, dateIndex: 0 }
        } else {
          this.currentIndex = { themeIndex: 0, sourceIndex: 0, emotionIndex: 0, dateIndex: 0 }
        }
        // let _this = this
        // this.limit.forEach(function (item) {
        //   if (item.type === 'fromto') {
        //     // 开始时间：最多保留3个月，且大于注册时间 结束时间：当前时间
        //     // let threeMonthBefore = _this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
        //     // if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['registerTime']) {
        //     //   let registerTime = _this.$dayjs(JSON.parse(getLocalStorage('userInfo'))['registerTime'])
        //     //   let currentTime = _this.$dayjs()
        //     //   if (currentTime.diff(registerTime, 'month') > 3) {
        //     //     item.from = threeMonthBefore
        //     //   } else {
        //     //     item.from = registerTime.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        //     //   }
        //     // } else {
        //     //   _this.$layer.msg('初始化注册时间获取失败，请重新登录。')
        //     //   _this.$router.replace({path: '/login'})
        //     // }
        //     // item.to = _this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        //     item.from = _this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
        //     item.to = _this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        //   }
        // })
        this.getThemeList()
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    mounted() {
      this.globalClick(this.appraiseDefault)
    },
    methods: {
      returnStatus: function (statusObj) {
        return statusObj.loading === false && statusObj.noData === false && statusObj.errorWork === false
      },
      getThemeList: function () {
        const self = this
        let params = {}
        if (this.initParams.taskId) params['taskId'] = this.initParams.taskId
        let url = `${this.$store.state.url}theme/task/monitor/list`
        this.$get(url, params).then(response => {
          let list = response.data
          if (response.status === 1 && list.length) {
            let tempList = []
            if (list[0].value.length) {
              list.map(item => {
                if (item.name === '区域主题' && item.value.length) {
                  let tempVal = []
                  item.value.map((val, index) => {
                    if (index === 0) {
                      val.isActive = true
                    } else {
                      val.isActive = false
                    }
                    tempVal.push(val)
                  })
                  tempList.push({name: item.name, toggleShow: true, value: tempVal})
                  console.log(tempList)
                }
                if ((item.name === '特殊主题' || item.name === '单位主题') && item.value.length) { // 特殊主题 || 单位主题
                  let tempVal = []
                  item.value.map(val => {
                    val.isActive = false
                    tempVal.push(val)
                  })
                  tempList.push({name: item.name, toggleShow: false, value: tempVal})
                }
              })
            } else if (list[1].value.length) {
              list.map(item => {
                if (item.name === '单位主题' && item.value.length) {
                  let tempVal = []
                  item.value.map((val, index) => {
                    if (index === 0) {
                      val.isActive = true
                    } else {
                      val.isActive = false
                    }
                    tempVal.push(val)
                  })
                  tempList.push({name: item.name, toggleShow: true, value: tempVal})
                }
                if (item.name === '特殊主题' && item.value.length) { // 特殊主题 || 单位主题
                  let tempVal = []
                  item.value.map(val => {
                    val.isActive = false
                    tempVal.push(val)
                  })
                  tempList.push({name: item.name, toggleShow: false, value: tempVal})
                }
              })
            } else if (list[2].value.length) {
              list.map(item => {
                if (item.name === '特殊主题' && item.value.length) {
                  let tempVal = []
                  item.value.map((val, index) => {
                    if (index === 0) {
                      val.isActive = true
                    } else {
                      val.isActive = false
                    }
                    tempVal.push(val)
                  })
                  tempList.push({name: item.name, toggleShow: true, value: tempVal})
                }
              })
            }
            this.model.menuList = tempList
            if (Array.isArray(self.model.menuList[0].value) && self.model.menuList[0].value.length) {
              self.toggleTheme(self.model.menuList[0].value[0], 0)
            } else if (Array.isArray(this.model.menuList[1].value) && self.model.menuList[1].value.length) {
              self.toggleTheme(this.model.menuList[1].value[0], 0)
            } else {
              this.model.menuList = [{name: '暂未获取到主题', toggleShow: false, value: [{id: '', name: ''}]}]
              this.model.isShow = true
              this.runStatus.themeRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
              this.monitorList = []
              this.runStatus.monitorRunStatus = { loading: false, noData: true, errorWork: false, tooltip: '暂无数据' }
            }
            this.model.isShow = true
            this.runStatus.themeRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
          } else {
            // this.themeList = [{ id: '', name: '暂未获取到主题', status: true }]
            this.model.menuList = [{name: '暂未获取到主题', toggleShow: false, value: [{id: '', name: ''}]}]
            this.model.isShow = true
            this.runStatus.themeRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
            this.monitorList = []
            this.runStatus.monitorRunStatus = { loading: false, noData: true, errorWork: false, tooltip: '暂无数据' }
          }
        }, error => {
          // this.themeList = [{ id: '', name: '暂未获取到主题', status: true }]
          this.model.menuList = [{name: '暂未获取到主题', toggleShow: false, value: [{id: '', name: ''}]}]
          this.model.isShow = true
          this.runStatus.themeRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
          this.monitorList = []
          this.runStatus.monitorRunStatus = { loading: false, noData: true, errorWork: false, tooltip: '暂无数据' }
          if (error) {}
        })
      },
      // 获取列表请求
      getMonitorList: function () {
        if (getLocalStorage('monitorEmotion')) delLocalStorage('monitorEmotion')
        this.runStatus.monitorRunStatus = { loading: true, noData: false, errorWork: false, tooltip: '' }
        if (this.condition.themeId) {
          let params = {}
          if (this.condition.themeId) params['taskId'] = this.condition.themeId
          if (this.condition.source) params['type'] = this.condition.source === '全部' ? 'all' : this.condition.source
          if (this.condition.emotion) params['appraise'] = this.condition.emotion === '全部' ? 'all' : this.condition.emotion
          if (this.condition.date) params['chooseTime'] = this.condition.date === '今天' ? 'today' : this.condition.date
          if (this.pageInfo.currentPage) params['pageNum'] = this.pageInfo.currentPage
          if (this.pageInfo.display) params['pageSize'] = this.pageInfo.display
          let url = this.$store.state.url + 'search/publicSentiment/monitoring'
          this.$get(url, params).then(response => {
            let list
            if (response.data) list = response.data.allPublicSentimentData
            if (response.status === 1 && list.length > 0) {
              this.pageInfo.total = response.data.total
              let tempList = []
              list.forEach(function (item) {
                tempList.push({
                  id: item.id,
                  appraise: [{ name: item.appraise, status: true }],
                  newsName: item.source,
                  newsDate: item.publishDate,
                  newsTitle: item.title,
                  newsContent: item.content,
                  author: item.author,
                  keyWords: item.matchKeys.split(',').slice(0, 5),
                  similarNum: item.similarNum,
                  readNum: item.click,
                  commentsNum: item.repeatTotal,
                  forwardNum: item.forward,
                  follow: item.follow,
                  similarEntityList: item.similarEntityList
                })
              })
              this.monitorList = tempList
              this.runStatus.monitorRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
            } else {
              this.monitorList = []
              this.runStatus.monitorRunStatus = { loading: false, noData: true, errorWork: false, tooltip: response.message }
            }
          }, error => {
            if (error) {
              this.runStatus.monitorRunStatus = { loading: false, noData: false, errorWork: true, tooltip: error }
            }
          })
        } else {
          // this.themeList = [{ id: '', name: '暂未获取到主题', status: true }]
          this.model.menuList = [{name: '暂未获取到主题', value: [{id: '', name: ''}]}]
          this.monitorList = []
          this.runStatus.monitorRunStatus = { loading: false, noData: true, errorWork: false, tooltip: '暂无数据' }
        }
      },
      // 展开相似文章列表
      toggleMonitorSimilar: function(index) {
        if (this.monitorSimilarIndex === index) {
          this.monitorSimilarIndex = ''
          this.monitorSimilarShow = false
        } else {
          this.monitorSimilarIndex = index
          this.monitorSimilarShow = true
        }
      },
      // 查看更多相似文章
      viewMore: function(id) {
        this.similarDetailView.isShow = true
        this.similarDetailView.id = id
      },
      // 展开情感属性
      editClick: function (list, e) {
        e.stopPropagation()
        this.monitorList.forEach(item => {
          if (item.appraise.length === this.defaultAppraise.length) {
            item.appraise = this.realDefaultValue
          }
        })
        this.realDefaultValue = list.appraise
        let tempList = []
        this.defaultAppraise.forEach(function (item) {
          if (item.name === list.appraise[0].name) {
            item.status = true
          } else {
            item.status = false
          }
          tempList.push(item)
        })
        list.appraise = tempList
      },
      // 全局点击关闭展开的情感属性
      appraiseDefault: function(e) {
        let _this = this
        e.stopPropagation()
        e = e || window.event
        let className = e.target.className
        if (className !== 'edit' && className !== 'positive' && className !== 'neutral' && className !== 'negative') {
          this.monitorList.forEach(function (item) {
            if (Array.isArray(item.appraise) && item.appraise.length === 3) {
              item.appraise = _this.realDefaultValue
            }
          })
        }
        if (className === 'title' || className === 'detail-page' || className === 'wrapper' || className === 'keyWord' || className === 'content') {
          _this.detailPageView.foucusClick = true
        }
      },
      // 编辑情感属性
      editappraise: function (list, appraise, e) {
        e.stopPropagation()
        if (list.appraise.length === 3) {
          let _this = this
          this.editappraiseRequest(list, appraise, function (appraise, status) {
            if (status === 1) {
              list.appraise = [appraise]
              _this.$layer.msg('修改成功')
            } else {
              list.appraise = _this.realDefaultValue
              _this.$layer.msg('修改失败')
            }
          })
        }
      },
      // 新闻正中负修改请求
      editappraiseRequest: function(list, appraise, callback) {
        let params = {}
        if (list.id) params.id = list.id
        if (appraise) params.appraise = appraise['name']
        if (list.newsDate) params.year = list.newsDate.slice(0, 4)
        let url = this.$store.state.url + 'theme/collectData/updateAppraise'
        this.$post(url, params).then(res => {
          if (res.status === 1) {
            let tempAppraise = { name: res.data.appraise, status: true }
            callback(tempAppraise, 1)
          }
          if (res.status === 0) {
            this.$layer.msg(res.message)
            callback(appraise, 0)
          }
        }).catch(error => {
          if (error) callback(appraise, 0)
        })
      },
      // 添加关注
      followClick: function (list, e) {
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
          if (list.newsDate) params.year = list.newsDate.slice(0, 4)
          if (this.initParams.taskId) params.taskId = this.initParams.taskId
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
      toggleTheme: function (list, index) {
        if (list && index !== '') {
          this.condition = {themeId: list.id, source: '全部', emotion: '全部', date: '今天'}
          this.customDateTime = ''
          // this.customDate = { startTime: { time: '' }, endTime: { time: '' } }
          this.pageInfo.currentPage = 1
          if (getLocalStorage('monitorEmotion') === '负面') {
            this.currentIndex = {themeIndex: 0, sourceIndex: 0, emotionIndex: 3, dateIndex: 0}
            this.condition.emotion = getLocalStorage('monitorEmotion')
          } else {
            this.currentIndex = {themeIndex: index, sourceIndex: 0, emotionIndex: 0, dateIndex: 0}
          }
          this.getMonitorList()
        }
      },
      toggleSource: function (list, index) {
        this.currentIndex.sourceIndex = index
        this.condition.source = list.name
        this.pageInfo.currentPage = 1
        this.getMonitorList()
      },
      toggleEmotion: function (list, index) {
        this.currentIndex.emotionIndex = index
        this.condition.emotion = list.name
        this.pageInfo.currentPage = 1
        this.getMonitorList()
      },
      toggleDate: function (list, index) {
        this.currentIndex.dateIndex = index
        if (list.name !== '自定义') { // else watch
          this.customDateTime = ''
          // this.customDate = { startTime: { time: '' }, endTime: { time: '' } }
          if (list.name === '今天') {
            this.condition.date = 'today'
          }
          if (list.name === '一周') {
            this.condition.date = 'week'
          }
          if (list.name === '15天') {
            this.condition.date = 'halfMonth'
          }
          this.pageInfo.currentPage = 1
          this.getMonitorList()
        }
      },
      /**
       * 自定义时间
       */
      customDateChange() {
        if (this.customDateTime) {
          this.condition.date = this.customDateTime[0] + ' ' + this.customDateTime[1]
          this.pageInfo.currentPage = 1
          this.getMonitorList()
        }
      },
      pageChange: function (currentPage) {
        this.pageInfo.currentPage = currentPage
        this.monitorSimilarShow = false
        this.getMonitorList()
      },
      expandDetail: function (list) {
        this.monitorSimilarShow = false
        if (this.monitorSimilarIndex === list.id) {
          this.monitorSimilarShow = true
        }
        let params = {}
        let url = this.$store.state.url + 'search/publicSentiment/details'
        if (list.id && list.newsDate) {
          params.dataId = list.id
          params.time = list.newsDate
        }
        if (this.condition.themeId) params.taskId = this.condition.themeId
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
      closeDetail: function () {
        editBody('detailClose')
        this.detailPageView = { foucusClick: false, fire: false, score: true, follow: true, isShow: false, data: {}, similar: [] }
        this.getMonitorList()
        this.similarDetailView.isShow = false
      }
    },
    beforeDestroy() {
      editBody('close', 0)
    },
    watch: {
      // customDate: {
      //   handler: function (val) {
      //     let startTime = val.startTime.time
      //     let endTime = val.endTime.time
      //     if (startTime && endTime) {
      //       if (startTime <= endTime) {
      //         // if (startTime === JSON.parse(getLocalStorage('userInfo'))['registerTime'].slice(0, 10)) {
      //         //   startTime = JSON.parse(getLocalStorage('userInfo'))['registerTime'].length > 10 ? JSON.parse(getLocalStorage('userInfo'))['registerTime'] : JSON.parse(getLocalStorage('userInfo'))['registerTime'].slice(0, 10) + ' 00:00:00'
      //         // } else {
      //         //   startTime += ' 00:00:00'
      //         // }
      //         startTime += ' 00:00:00'
      //         if (endTime === this.$dayjs().format('YYYY-MM-DD')) {
      //           endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      //         } else {
      //           endTime = endTime + ' 23:59:59'
      //         }
      //         this.condition.date = startTime + ' ' + endTime
      //         this.pageInfo.currentPage = 1
      //         this.getMonitorList()
      //       } else {
      //         this.$layer.msg('开始时间不能小于结束时间，请重新选择！')
      //         this.customDate.startTime.time = ''
      //         this.customDate.endTime.time = ''
      //       }
      //     }
      //   },
      //   deep: true,
      //   immediate: true
      // }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/common";

  .wrapper {
    width: 1200px;
    height: 1211px;
    z-index: 0;
    .flexRow(space-between, flex-start);
    .wrapper-left {
      position: relative;
      width: 220px;
      height: 1211px;
      .flexColumn(flex-start, center);
      background: #ffffff;
      .theme-title {
        width: 220px;
        height: 46px;
        line-height: 46px;
        .flexRow(center, center);
        .icon-theme {
          width: 30px;
          height: 39px;
          background: url("../../assets/public/img_monitor_img.png") no-repeat -90px 0;
        }
        & span {
          font-size: 18px;
          color: #0068b7;
        }
      }
      .theme-list {
        width: 220px;
        height: 1211px;
        overflow-y: auto;
        overflow-x: hidden;
        & ul {
          & li {
            line-height: 48px;
            text-align: center;
            font-size: 14px;
          }
          & li:hover {
            background: #0068b7;
            color: #ffffff;
            cursor: pointer;
          }
          & li.active {
            background: #0068b7;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
    .wrapper-right {
      width: 970px;
      height: 1211px;
      .flexColumn(space-between, flex-end);
      .wrapper-top {
        width: 966px;
        height: 162px;
        border: 2px solid #dcdcdc;
        .flexColumn(center, center);
        background: #ffffff;
        .condition {
          width: 966px;
          height: 148.4px;
          .flexColumn(space-between, flex-start);
          & div:first-child {
            width: 966px;
            height: 32px;
            border-left: 5px solid #0068b7;
            & span {
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: #333333;
              padding-left: 14px;
            }
          }
          & div:nth-child(2) {
            width: 966px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #333333;
            & span {
              width: 70px;
              padding-left: 20px;
            }
            & ul {
              & li {
                padding: 0 8px;
                line-height: 32px;
                text-align: center;
              }
              & li:hover {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
              & li.active {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
            }
          }
          & div:nth-child(3) {
            width: 966px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #333333;
            & span {
              width: 70px;
              padding-left: 20px;
            }
            & ul {
              & li {
                padding: 0 8px;
                line-height: 32px;
                text-align: center;
              }
              & li:hover {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
              & li.active {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
            }
          }
          & div:last-child {
            width: 966px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #333333;
            & span:first-child {
              width: 70px;
              padding-left: 20px;
              text-align: justify;
              text-justify: distribute-all-lines;
              text-align-last: justify;
            }
            & ul {
              & li {
                padding: 0 8px;
                line-height: 32px;
                text-align: center;
              }
              & li:hover {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
              & li.active {
                background: #0068b7;
                color: #ffffff;
                cursor: pointer;
              }
              & input {
                margin: 5px 0 0 8px;
                border: 1px solid #0068b7;
              }
            }
            .date-wrap {
              position: relative;
              float: left;
              margin-left: 5px;
              width: 400px;
              height: 32px;
              line-height: 32px;
              .el-date-editor {
                width: 400px;
                border: 1px solid #ccc;
              }
              // & div {
              //   width: 130px;
              //   height: 32px;
              //   border: 0;
              //   margin-left: 10px;
              // }
              // & span {
              //   margin-left: 10px;
              // }
            }
          }
        }
      }
      .wrapper-bottom {
        position: relative;
        overflow-y: auto;
        width: 966px;
        height: 1031px;
        border: 2px solid #dcdcdc;
        background: #ffffff;
        .icon-left {
          position: absolute;
          width: 5px;
          height: 32px;
          background: #0068b7;
          top: 10px;
        }
        .list-content {
          width: 966px;
          & ul {
            padding: 0 38px 20px 38px;
            cursor: pointer;
            & li {
              font-size: 13px;
              & span {
                & i {
                  font-style: inherit;
                }
              }
            }
            & li:first-child {
              position: relative;
              cursor: pointer;
              padding-top: 20px;
              margin-bottom: 15px;
              & span.type {
                & i {
                  color: #ff0000;
                  font-style: inherit;
                }
              }
              & span.appraise {
                position: absolute;
                top: 16px;
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
            & li:nth-child(2) {
              color: #797878;
              line-height: 20px;
            }
            & li:last-child {
              margin-top: 8px;
              & span.keys {
                color: #797878;
                & i {
                  color: #ff0000;
                }
              }
              & span.similarNum {
                /*margin-left: 50px;*/
                color: #797878;
                & i {
                  padding: 0 5px;
                  color: #72b4f0;
                }
              }
              & span.author {
                color: #797878;
                margin: 0 30px;
              }
              & span.readNum {
                margin-left: 45px;
                padding-left: 25px;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -129px;
              }
              & span.commentsNum {
                margin-left: 10px;
                padding-left: 18px;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -82px -129px;
              }
              & span.forwardNum {
                margin-left: 10px;
                padding-left: 18px;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -143px -130px;
              }
              & span.follow {
                display: block;
                width: 13px;
                height: 12px;
                cursor: pointer;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -14px -79px;
              }
              & span.disfollow {
                cursor: pointer;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -71px -79px;
              }
            }
          }
          & ul:hover {
            background: #f6f6f6;
          }
          .similar{
            padding: 10px 38px;
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
        .page {
          margin: 50px 0 35px 0;
        }
      }
    }
  }
</style>
