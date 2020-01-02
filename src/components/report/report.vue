<template>
  <div class="report">
    <div class="menu">
      <div class="menu-name">
        <ul class="clearfix">
          <li class="fn-left" v-for="(list,index) in menuName" :class="index === menuCurrent ? 'active': ''" :key="index" @click="changeSize(index, list.alias)">{{list.name}}</li>
        </ul>
      </div>
      <div class="menu-content">
        <ul class="clearfix">
          <li class="fn-left" v-for="(item, index) of menuContent" :key="index" :class="index === menuContentCurrent ? 'active' : ''" @click="changeModel(index, item.value)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div class="wrapper clearfix">
      <div class="wrapper-left fn-left" v-show="dateMenuShow">
        <ul v-for="(list, index) in dateTime" :key="index" :class="!list.isOpen ? 'noActive' : ''">
          <li class="year clearfix" @click="openToggle(list)">
            <span class="fn-left">{{list.year}}</span>
            <span class="fn-right jt" v-if="params.type === 'dayReport' || params.type === 'weekReport'" :class="list.isOpen ? 'active' : 'noActive'"></span>
          </li>
          <div class="month" v-if="list.isOpen && (params.type === 'dayReport' || params.type === 'weekReport')">
            <ul v-for="(item,index) in list.month" :key="index">
              <li @click="changeBK(item, index)" :class="index === yearCurrent ? 'changeBK' : ''">{{item.number}}</li>
            </ul>
          </div>
        </ul>
      </div>
      <div class="wrapper-content fn-right" v-show="!previewToggle">
        <div class="tab-th">
          <ul class="clearfix">
            <li class="fn-left">报告标题</li>
            <li class="fn-left">生成时间</li>
            <li class="fn-left">操作</li>
          </ul>
        </div>
        <div class="tab-content" v-if="reportList.length">
          <ul>
            <li class="clearfix" v-for="(list, index) of reportList" :key="index">
              <div class="liner">
                <span class="fn-left fn-text-overflow" :title="list.reportName">{{list.reportName}}</span>
                <span class="fn-left">{{list.generatedTime}}</span>
                <div class="clearfix fn-left">
                  <i class="fn-left" @click="preview(list)" title="预览" :style="customStyle"></i>
                  <i class="fn-left">|</i>
                  <i ref="pdf" class="fn-left" title="下载PDF文档" @click="reportDownloadRequest(list, 'pdf')" v-show="params.type !== 'orderReport' && params.type !== 'specialCase'"></i>
                  <i class="fn-left" v-show="params.type !== 'orderReport' && params.type !== 'specialCase'">|</i>
                  <i ref="word" class="fn-left" title="下载Word文档" @click="reportDownloadRequest(list, 'word')"></i>
                </div>
              </div>
            </li>
          </ul>
          <div class="page" v-show="pageShow">
            <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
          </div>
        </div>
        <no-data :toggle="reportLoading"></no-data>
      </div>
      <iframe class="previewDetail" :src="iframeSrc" frameborder="0" v-if="previewToggle" scrolling="auto"></iframe>
      <div class="close" @click="closeDetail" v-if="previewToggle"></div>
      <!--<div class="previewDetail" v-if="previewToggle">-->
        <!--<div class="content">-->
          <!--<img v-bind:src="previewContent" alt="" v-show="params.type !== 'orderReport'">-->
          <!--<p v-html="previewContent" v-show="params.type === 'orderReport'"></p>-->
        <!--</div>-->
        <!--<div class="close" @click="closeDetail"></div>-->
        <!--<no-data v-if="previewToggle" :toggle="previewLoading"></no-data>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script type="application/ecmascript">
  import page from '../../components/component/pagination'
  import noData from '../component/vue-noData'
  import { dataFormat, getCookie, initFun, getLocalStorage } from '../../common/js/cookie'
  import { timeFormate } from '../../common/js/common'

  export default {
    name: 'report',
    components: {
      'noData': noData,
      'v-pagination': page
    },
    data () {
      return {
        pageShow: false,
        dateMenuShow: true,
        previewToggle: false,
        previewContent: '',
        defaultYear: '',
        defaultMonth: '',
        menuCurrent: 0,
        reportLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
        previewLoading: {loading: true, noData: false, errorWork: false, tooltip: ''},
        pageInfo: { total: 0, display: 11, currentPage: 1, pageGroup: 11 },
        menuContentCurrent: 0,
        yearCurrentValue: '',
        yearCurrent: 0,
        params: {
          userId: '',
          type: ''
        },
        defaultTime: '',
        menuName: [
          {name: '常规报告', alias: 'default'},
          {name: '决策专报', alias: 'order'}
          ],
        menuArr: {
          default: [
            {name: '日报', value: 'dayReport'},
            // {name: '周报', value: 'weekReport'},
            {name: '月报', value: 'monthReport'},
            // {name: '季报', value: 'seasonReport'},
            // {name: '半年报', value: 'halfReport'},
            {name: '年报', value: 'yearReport'}
            ],
          order: [{name: '决策专报', value: 'orderReport'}, {name: '专题案例', value: 'specialCase'}]
        },
        menuContent: [],
        dateTime: [],
        reportList: [],
        customStyle: '',
        iframeSrc: ''
      }
    },
    created() {
      if (initFun()) {
        if (this.dateTimeSet()) {
          let year = this.dateTime[0].year.substr(0, 4)
          let month = this.dateTime[0].month[0].number
          month = month.substring(0, month.lastIndexOf('月'))
          month = month.length === 2 ? month : '0' + month
          this.defaultYear = year
          this.defaultMonth = month
          this.yearCurrentValue = year
          this.menuContent = this.menuArr['default']
          this.params.type = 'dayReport'
          if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
            this.params.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
          }
          this.defaultTime = year + '-' + month
        }
      } else {
        this.$router.replace({path: '/login'})
      }
    },
    methods: {
      pageChange: function (currentPage) {
        this.pageInfo.currentPage = currentPage
        if (this.params.type === 'orderReport') {
          this.orderReportRequest(0)
        } else {
          this.orderReportRequest(1)
        }
      },
      changeSize: function (index, item) {
        let _this = this
        this.menuContent = this.menuArr[item]
        this.menuCurrent = index
        this.menuContentCurrent = 0
        this.yearCurrent = 0
        this.dateTime.forEach(function (items) {
          if (items.year.indexOf(_this.defaultYear) !== -1) {
            items.isOpen = true
            _this.reportToggle(item)
          } else {
            items.isOpen = false
          }
        })
        if (item === 'order') {
          this.pageShow = true
          this.dateMenuShow = false
        } else {
          this.pageShow = false
          this.dateMenuShow = true
        }
      },
      reportToggle: function (type) {
        if (type === 'default') {
          this.params.type = 'dayReport'
          this.defaultTime = this.defaultYear + '-' + this.defaultMonth
          this.customStyle = ''
        }
        if (type === 'order') {
          this.params.type = 'orderReport'
          this.defaultTime = this.defaultYear + '-' + this.defaultMonth
          this.customStyle = 'margin-left: 44px;'
        }
      },
      changeModel: function (index, value) {
        let _this = this
        this.menuContentCurrent = index
        this.params.type = value
        this.yearCurrent = 0
        this.dateTime.forEach(function (items) {
          if (items.year.indexOf(_this.defaultYear) !== -1) {
            items.isOpen = true
            _this.defaultTime = _this.defaultYear + '-' + _this.defaultMonth
            // _this.defaultTime = _this.defaultYear + '-' + _this.defaultMonth
          } else {
            items.isOpen = false
          }
        })
        if (value === 'yearReport' || value === 'orderReport' || value === 'specialCase') {
          this.dateMenuShow = false
        } else {
          this.dateMenuShow = true
        }
      },
      // 左侧菜单效果控制 年
      openToggle: function (list) {
        list.isOpen = !list.isOpen
        this.yearCurrent = 0
        this.yearCurrentValue = list.year.substr(0, 4)
        this.dateTime.forEach(function (item) {
          if (list.year !== item.year) {
            item.isOpen = false
          }
        })
        if (this.params.type !== 'dayReport' && this.params.type !== 'weekReport') {
          this.defaultTime = list.year.substring(0, 4)
        }
      },
      // 月
      changeBK: function (list, index) {
        let month = list.number
        month = month.substring(0, month.lastIndexOf('月'))
        month = month.length === 2 ? month : '0' + month
        this.yearCurrent = index
        this.defaultTime = this.yearCurrentValue + '-' + month
        this.defaultReportRequest(this.params)
      },
      // 常规报告请求
      defaultReportRequest: function (obj) {
        this.reportList = []
        if (obj.type !== 'dayReport') {
          this.defaultTime = this.defaultTime.split('-')[0]
        }
        let params = {}
        if (obj.userId) params.userId = obj.userId
        if (obj.type) params.type = obj.type
        if (this.defaultTime) params.dateTime = this.defaultTime
        let url = this.$store.state.url + 'report/report/list'
        this.$get(url, params).then(res => {
          if (res.status === 1) {
            this.reportLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
            res.data.forEach(function (item) {
              item.type = 'default'
            })
            this.reportList = res.data
          } else {
            this.reportList = []
            this.reportLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
          }
        }).catch(error => {
          this.reportLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      // 定制报告请求
      orderReportRequest: function (obj) {
        this.total = 0
        this.pageShow = false
        let params = {}
        params.pageSize = this.pageInfo.display
        params.pageNum = this.pageInfo.currentPage
        params.type = obj
        let url = this.$store.state.url + 'report/report/decisionMakingNew'
        this.$get(url, params).then(res => {
          if (res.status === 1) {
            this.pageInfo.total = res.total
            this.reportLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
            this.pageShow = true
            res.data.forEach(function (item) {
              item.type = 'order'
            })
            this.reportList = res.data
          } else {
            this.reportList = []
            this.pageShow = false
            this.reportLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
          }
        }).catch(error => {
          this.reportLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        })
      },
      // 常规报告预览请求
      defaultPreviewRequest: function (obj) {
        // this.previewLoading = {loading: true, noData: false, errorWork: false, tooltip: ''}
        // let params = {}
        // if (obj.reportName) params.fileName = obj.reportName
        // if (obj.wordUrl) params.wordUrl = obj.wordUrl
        // let url = 'http://localhost:15004/preview/preView'
        // let url = this.$store.state.url + 'report/preview/routineReport'
        // this.$get(url, params).then(res => {
        //   if (res.status === 1) {
        //     this.previewLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
        //     this.previewContent = 'data:image/jpg;base64,' + res.data.base
        //   }
        //   if (res.status === 0) {
        //     this.previewLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
        //   }
        // }).catch(error => {
        //   this.previewLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        // })
      },
      // 定制报告预览请求
      orderPreviewRequest: function (obj) {
        // this.previewLoading = {loading: true, noData: false, errorWork: false, tooltip: ''}
        // let params = {}
        // if (obj.reportName) params.fileName = obj.reportName
        // if (obj.wordUrl) params.wordUrl = obj.wordUrl
        // let url = this.$store.state.url + 'report/preview/decisionMakingReport'
        // // window.open('http://192.168.10.209:8012/onlinePreview?url=demo/2019-01-23重庆教育日报.pdf', '_blank', 'toolbar=yes, location=yes, directories=yes, status=yes, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, channelmode=yes')
        // this.$get(url, params).then(res => {
        //   this.previewContent = res
        //     this.previewLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
        //   if (res.status === 1) {
        //     this.previewLoading = {loading: false, noData: false, errorWork: false, tooltip: ''}
        //     this.previewContent = res.data
        //   }
        //   if (res.status === 0) {
        //     this.previewLoading = {loading: false, noData: true, errorWork: false, tooltip: res.message}
        //   }
        // }).catch(error => {
        //   this.previewLoading = {loading: false, noData: false, errorWork: true, tooltip: error}
        // })
      },
      // 报告下载请求
      reportDownloadRequest: function (obj, type) {
        let params = {}
        if (type) params.type = type
        if (obj.reportName) params.fileName = obj.reportName
        if (type === 'word') {
          if (obj.wordUrl) params.wordUrl = obj.wordUrl
        } else if (type === 'pdf') {
          if (obj.pdfUrl) params.pdfUrl = obj.pdfUrl
        }
        if (getCookie('auth')) params.auth = getCookie('auth')
        let url = this.$store.state.url + 'report/downLoad/report?' + dataFormat(params)
        obj.type === 'order' ? type === 'word' ? window.open(url) : this.$layer.msg('pdf文件暂不支持下载') : window.open(url)
      },
      preview: function (list) {
        this.previewToggle = true
        let url = this.$store.state.url + 'report/preview/routineReport' + '?fileName=' + list.reportName + '&wordUrl=' + list.wordUrl + '&auth=' + getCookie('auth')
        this.iframeSrc = url
      },
      closeDetail: function () {
        this.previewToggle = false
        // this.previewContent = ''
      },
      dateTimeSet: function () {
        let yearArr = []
        let mouthArr = []

        let currentYear = timeFormate(new Date()).year
        let currentMonth = timeFormate(new Date()).month
        if (getLocalStorage('userInfo')) {
          let userInfo = JSON.parse(getLocalStorage('userInfo'))
          let registerTime = userInfo.registerTime.split('-')
          let registerYear = Number(registerTime[0])
          let registerMouth = Number(registerTime[1])
          if (registerYear < currentYear) {
            let i = registerYear
            while (i <= currentYear) {
              yearArr.push(Number(i))
              i++
            }
          } else if (registerYear === currentYear) {
            yearArr.push(currentYear)
          }

          if (yearArr.length === 1) {
            let arr = []
            let j = registerMouth
            while (j <= currentMonth) {
              arr.push({number: Number(j) + '月'})
              j++
            }
            mouthArr.push({year: yearArr[0], month: arr.reverse()})
          } else if (yearArr.length === 2) {
            let arr2 = []
            let k = registerMouth
            while (k <= 12) {
              arr2.push({number: Number(k) + '月'})
              k++
            }
            mouthArr.push({year: yearArr[0], month: arr2.reverse()})
            let arr3 = []
            let l = 1
            while (l <= currentMonth) {
              arr3.push({number: Number(l) + '月'})
              l++
            }
            mouthArr.push({year: yearArr[1], month: arr3.reverse()})
          } else if (yearArr.length > 2) {
            let arr4 = []
            let m = registerMouth
            while (m <= 12) {
              arr4.push({number: Number(m) + '月'})
              m++
            }
            mouthArr.push({year: yearArr[0], month: arr4.reverse()})
            let year = Number(registerYear) + 1
            while (year < currentYear) {
              let arrs = [{number: '12月'}, {number: '11月'}, {number: '10月'}, {number: '9月'}, {number: '8月'}, {number: '7月'}, {number: '6月'}, {number: '5月'}, {number: '4月'}, {number: '3月'}, {number: '2月'}, {number: '1月'}]
              mouthArr.push({year: Number(year), month: arrs})
              year++
            }
            let arr5 = []
            let n = 1
            while (n <= currentMonth) {
              arr5.push({number: Number(n) + '月'})
              n++
            }
            mouthArr.push({year: yearArr[yearArr.length - 1], month: arr5.reverse()})
          }
          mouthArr = mouthArr.reverse()
          mouthArr.forEach(function (item, index) {
            item.year = item.year + '年'
            index === 0 ? item.isOpen = true : item.isOpen = false
          })
          this.dateTime = mouthArr
          return true
        } else {
          this.$layer.msg('获取初始化注册时间失败，请重新登录！')
          this.$router.replace({path: '/login'})
          return false
        }
      }
    },
    watch: {
      params: {
        handler: function (newName) {
          this.reportList = []
          this.reportLoading = {loading: true, noData: false, errorWork: false, tooltip: ''}
          if (newName.type === 'orderReport') {
            this.pageInfo.currentPage = 1
            this.orderReportRequest(0)
          } else if (newName.type === 'specialCase') {
            this.pageInfo.currentPage = 1
            this.orderReportRequest(1)
          } else {
            this.defaultReportRequest(newName)
          }
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style scoped lang="less">
.report{
  position: relative;
  .menu{
    width: 100%;
    height: 78px;
    background: #fff;
    margin-top: 2px;
    .menu-name{
      height: 46px;
      & li{
        font-size: 16px;
        color: #333;
        line-height: 49px;
        margin-left: 35px;
      }
      & li:first-child{
        margin-left: 22px;
      }
      & li.active{
        font-size: 18px;
        font-weight: 600;
        color: #ef7e10;
      }
      & li:hover {
        cursor: pointer;
      }
    }
    .menu-content{
      height: 31px;
      border-top: 1px solid #E5E5E5;
      & ul{
        margin-left: 0;
        padding-left: 0;
        position: absolute;
        & li{
          height: 28px;
          font-size: 14px;
          color: #333;
          line-height: 31px;
          padding: 0 23px;
        }
        & li.active{
          border-bottom: 3px solid #0068B7;
        }
        & li:hover {
          cursor: pointer;
        }
      }
    }
  }
  .wrapper{
    width: 1196px;
    min-height: 774px;
    margin-top: 12px;
    border: 2px solid #DCDCDC;
    background: #fff;
    .wrapper-left{
      width: 153px;
      min-height: 710px;
      padding: 36px 30px 0 41px;
      & ul{
        width: 100%;
        background: #448ACA;
        & li{
          width: 145px;
          margin-left: 8px;
          background: #0068B7;
          cursor: pointer;
          & span:first-child{
            font-size: 16px;
            color: #fff;
            line-height: 40px;
            margin-left: 15px;
          }
          & span.jt{
            margin-right: 20px;
            margin-top: 17px;
          }
          & span.active {
            width: 10px;
            height: 5px;
            background: url("../../../src/assets/report/arrow1.png") no-repeat;
          }
          & span.noActive {
            width: 5px;
            height: 10px;
            margin-right: 23px;
            background: url("../../../src/assets/report/arrow2.png") no-repeat;
          }
        }
        .month{
          width: 152px;
          height: auto;
          & ul{
            width: 100%;
            & li{
              width: 117px;
              height: 28px;
              font-size: 14px;
              color: #fff;
              line-height: 28px;
              padding-left: 28px;
            }
            & li:hover{
              background: #448ACA;
            }
            & li.changeBK{
              background: #448ACA;
            }
          }
        }
      }
      & ul.noActive {
        background: #535353;
        & li {
          background: #535353;
        }
      }
    }
    .wrapper-content{
      width: 932px;
      min-height: 653px;
      padding: 45px 40px 48px 0;
      .tab-th{
        width: 766px;
        height: 32px;
        padding: 0 83px;
        & ul{
          width: 100%;
          height: 100%;
          color: #0068b7;
          & li{
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
          }
          & li:first-child{
            width: 256px;
          }
          & li:nth-child(2){
            width: 163px;
            margin-left: 104px;
          }
          & li:nth-child(3){
            width: 145px;
            margin-left: 98px;
          }
        }
      }
      .tab-content{
        width: 100%;
        & ul{
          width: 100%;
          height: 590px;
          & li{
            width: 100%;
            height: 54px;
            .liner{
              border-top: 1px solid #E5E5E5;
              font-size: 14px;
              line-height: 54px;
              width: 766px;
              padding: 0 83px;
              & span:first-child{
                width: 256px;
                text-align: center;
              }
              & span:nth-child(2){
                width: 163px;
                text-align: center;
                margin-left: 104px;
              }
              & div{
                width: 145px;
                height: 100%;
                text-align: center;
                margin-left: 98px;
                & i{
                  position: relative;
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  text-align: center;
                  font-style: normal;
                  color: #5e5e5e;
                }
                /*& i:first-child{
                  cursor: pointer;
                  margin-top: 18px;
                  margin-left: 64px;
                  background: url("../../../src/assets/report/icon_report__icon.png") no-repeat -86px -0px;
                }*/
                & i:first-child{
                  cursor: pointer;
                  margin-top: 18px;
                  margin-left: 23px;
                  background: url("../../../src/assets/report/icon_report__icon.png") no-repeat 0 -2px;
                }
                & i:nth-child(3){
                  cursor: pointer;
                  margin-top: 18px;
                  background: url("../../../src/assets/report/icon_report__icon.png") no-repeat -43px -1px;
                }
                & i:nth-child(5){
                  cursor: pointer;
                  margin-top: 18px;
                  background: url("../../../src/assets/report/icon_report__icon.png") no-repeat -86px -0px;
                }
              }
            }
          }
        }
        .page {
          width: 100%;
          margin-top: 50px;
        }
      }
    }
    .previewDetail{
      position: absolute;
      /*top: 75px;*/
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      .content{
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        margin: 0 auto;
        height: 100%;
        overflow-y: auto;
        & p{
          width: 1100px;
          margin: 0 auto;
        }
        & img{
          margin: 0 auto;
        }
      }
      .close{
        z-index: 101;
        position: absolute;
        top: 15px;
        right: 15px;
        width: 25px;
        height: 25px;
        cursor: pointer;
        background: url("../../../src/assets/detail/img_Details_img.png") no-repeat 0 0;
      }
    }
    .close{
      z-index: 101;
      position: absolute;
      top: 60px;
      right: 40px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      background: url("../../../src/assets/detail/img_Details_img.png") no-repeat 0 0;
    }
  }
}
</style>
