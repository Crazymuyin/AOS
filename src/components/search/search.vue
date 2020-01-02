<template>
  <div class="wrapper">
    <div class="searchClass clearfix">
      <div class="clearfix" :class="isText ? 'location' : 'header'">
        <div class="buttonGroup">
          <ul class="clearfix">
            <li class="account">{{userName}}</li>
            <li class="line">|</li>
            <li class="exit" @click="logout">退出</li>
            <li class="goHome" @click="goHomeClick">平台首页</li>
            <li class="advancedSearch">
              <span @click="advancedClick">高级搜索</span>
              <search-high :searchHighInfo="searchHighInfo" @closeHighSearchEmit="closeHighSearchEmit"></search-high>
            </li>
          </ul>
        </div>
        <div :class="isText ? 'searchListHeader' : 'formGroup'">
          <div v-if="!isText" class="logo">
            <img src="../../assets/search/search_small.png" width="262" alt="中正云搜">
          </div>
          <div v-if="isText" class="searchListLogo fn-left">
            <img src="../../assets/search/search_small.png" style="width: 14.3vmin" alt="中正云搜">
          </div>
          <div :class="isText ? 'searchText fn-left' : ''">
            <div class="searchInput">
              <input type="text" placeholder="请输入需要搜索的关键词" v-model="searchTxt" @keyup="enterSearch($event)">
              <a href="javascript:;" id="search" @click="searchClick()">搜索</a>
            </div>
            <div class="radioList">
              <label class="radioBox" v-for="(item, index) in radios" :key="index">
                <input :value="item.value" v-model="dataType" class="inputRadio" name="dataType" type="radio" @click="toggleRadio(item.value)" />
                <span>{{item.label}}</span>
              </label>
            </div>
            <div class="checkboxList">
              <label v-if="dataType === 'b'" v-for='(list, index) of checkboxData' :key="index">
                <input type='checkbox' name='checkboxInput' class='inputCheckbox' :checked="list.status" @click="checkedAll(list)"/>{{list.name}}
              </label>
            </div>
          </div>
        </div>
      </div>
      <search-tools v-if="isText" :toolsInfo="toolsInfo" @dateTimeEmit="dateTimeEmit" @webAddressEmit="webAddressEmit" @resetSearchTools="resetSearchTools"></search-tools>
      <search-list v-if="isText" :monitorList="monitorList" @similarList="toggleSimilarList" @currentPage="currentPage"></search-list>
      <div v-if="!isText" class="searchFooter clearfix">
        <div class="qrCode_img fn-left">
          <div class="qrCode_top">
            <img width="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATwAAAE8CAYAAABdBQ0GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAxMjk0M0IyRjdENTExRTlCNUIxRTY2QkJFNTIwRDZGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAxMjk0M0IzRjdENTExRTlCNUIxRTY2QkJFNTIwRDZGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDEyOTQzQjBGN0Q1MTFFOUI1QjFFNjZCQkU1MjBENkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDEyOTQzQjFGN0Q1MTFFOUI1QjFFNjZCQkU1MjBENkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4t1e83AAAUAElEQVR42uzd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" alt="">
          </div>
          <a class="qrCode_tit" style="margin-top: 16.4px; font-size: 1.6vmin; text-decoration: underline; cursor: pointer">About中正</a>
        </div>
        <div class="qrCode_txt fn-right">
          <div class="qrCode_top">
            <p style="margin-top: 25px">中正舆情APP</p>
            <p>搜索你想要的</p>
          </div>
          <a class="qrCode_tit" style="margin-top: 49px; font-size: 1.6vmin; text-decoration: underline; cursor: pointer">中正推广</a>
        </div>
      </div>
      <div class="footer">
        <search-foot></search-foot>
      </div>
    </div>
    <similar-detail @closeDetail="closeDetail" :similar="similarDetailView"></similar-detail>
  </div>
</template>

<script type="application/ecmascript">
  import searchTools from './searchTools'
  import searchList from './searchList'
  import SearchHigh from './searchHigh'
  import searchFoot from '../component/searchFoot'
  import similarDetail from '../../components/component/similarDetailPage'
  import {initFun, delLocalStorage, delCookie, getLocalStorage} from '../../common/js/cookie'
  import {getSourceAllList} from '../../common/js/config'

  export default {
    name: 'search',
    components: {SearchHigh, searchTools, searchList, searchFoot, similarDetail},
    data() {
      return {
        userName: '',
        searchHighInfo: {isShow: false},
        isText: false,
        radios: [{label: '业务数据', value: 'b'}, {label: '案例数据', value: 'o'}],
        checkboxData: [],
        checkboxValue: [],
        searchType: 'search',
        searchTxt: '',
        toolsParams: {
          publishDate: '',
          endTime: '',
          goalWeb: ''
        },
        dataType: 'b',
        webType: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        },
        superParams: {
          allkey: '',
          arbitrarily: '',
          nocontain: ''
        },
        monitorList: {},
        toolsInfo: {},
        similarDetailView: {
          isShow: false,
          id: ''
        }
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userName']) {
          this.userName = JSON.parse(getLocalStorage('userInfo'))['userName']
        }
        this.checkboxData = getSourceAllList()
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    methods: {
      enterSearch: function(event) {
        if (event.keyCode === 13) {
          this.searchType = 'normal'
          this.pageInfo.pageNum = 1
          this.searchClick()
        }
      },
      searchClick: function() {
        if (this.searchTxt) {
          this.searchType = 'normal'
          this.superParams = {
            allkey: '',
            arbitrarily: '',
            nocontain: ''
          }
          this.pageInfo.pageNum = 1
          this.searchRequest()
        } else {
          this.$layer.msg('搜索内容不能为空')
          this.isText = false
        }
      },
      searchRequest: function() {
        if (this.searchTxt || this.superParams.allkey) {
          this.monitorList = {data: [], dataType: '', total: 0, status: 'loading', msg: ''}
          this.toolsInfo = {total: 0, time: 0, dataType: this.dataType}
          this.isText = true
          let searchParams = {}
          if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
            searchParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
          }
          if (this.searchTxt && this.searchType !== 'super') searchParams.seniorKey = this.searchTxt
          if (this.webType && this.webType !== '全部') searchParams.webType = this.webType
          if (this.searchType === 'super' && this.toolsParams.endTime !== '') {
            if (this.toolsParams.publishDate) searchParams.publishDate = this.toolsParams.publishDate + ' 00:00:00'
            if (this.toolsParams.endTime) searchParams.endTime = this.toolsParams.endTime + ' 23:59:59'
          } else {
            if (this.toolsParams.publishDate) searchParams.publishDate = this.toolsParams.publishDate
            if (this.toolsParams.endTime) searchParams.endTime = this.toolsParams.endTime
          }
          if (this.toolsParams.goalWeb) searchParams.goalWeb = this.toolsParams.goalWeb
          if (this.superParams.allkey) searchParams.allkey = this.superParams.allkey
          if (this.superParams.arbitrarily) searchParams.arbitrarily = this.superParams.arbitrarily
          if (this.superParams.nocontain) searchParams.nocontain = this.superParams.nocontain
          if (this.pageInfo.pageSize) searchParams.pageSize = this.pageInfo.pageSize
          if (this.pageInfo.pageNum) searchParams.pageNum = this.pageInfo.pageNum
          let url = `${this.$store.state.url}search/btext/list`
          if (this.dataType === 'o') url = `${this.$store.state.url}search/case/list`
          this.$get(url, searchParams).then(response => {
            let list
            if (response) list = response.data
            if (response.status === 1 && Array.isArray(list) && list.length) {
              let listArr = list.slice(0, list.length - 2)
              let total = list.slice(list.length - 2, list.length - 1)[0]
              let time = list[list.length - 1]
              if (total.total) {
                let tempList = []
                listArr.forEach(function (item) {
                  tempList.push({
                    id: item.id,
                    appraise: item.appraise ? [{name: item.appraise, status: true}] : [],
                    newsName: item.type ? item.type : '',
                    newsDate: item.publishDate ? item.publishDate : '',
                    newsTitle: item.title ? item.title : item.highlightTitle,
                    newsContent: item.highlightContent ? item.highlightContent : '',
                    desc: item.content ? item.content.replace(/<.*?>/ig, '') : '',
                    keyWords: item.match_keys ? item.match_keys.split(',').slice(0, 5) : '',
                    keyWordstr: item.match_keys ? item.match_keys : '',
                    similarNum: item.similarNum ? item.similarNum : 0,
                    similarEntityList: item.similarEntityList,
                    author: item.author ? item.author : '',
                    url: item.url ? item.url : '',
                    readNum: item.read ? item.read : 0,
                    commentsNum: item.reply ? item.reply : 0,
                    forwardNum: item.transmitted ? item.transmitted : 0,
                    ftp_path: item.ftp_path ? item.ftp_path : ''
                  })
                })
                this.monitorList = {data: tempList, dataType: this.dataType, total: total.total, status: 'success', pageNum: this.pageInfo.pageNum}
                this.toolsInfo = {total: total.total, time: time.time / 1000, dataType: this.dataType, toolsToggle: true}
                if (this.searchType === 'super') {
                  if (this.toolsParams.hasOwnProperty('goalWeb') || this.toolsParams.hasOwnProperty('publishDate')) {
                    this.toolsInfo.publishDate = {
                      publishDate: this.toolsParams.publishDate,
                      endTime: this.toolsParams.endTime ? this.toolsParams.endTime : ''
                    }
                    this.toolsInfo.webValue = this.toolsParams.goalWeb
                    this.toolsInfo.toolsToggle = false
                  }
                } else {
                    this.toolsInfo.toolsToggle = true // 关闭搜索工具
                }
              } else {
                this.monitorList = {data: [], total: 0, status: 'nodata', msg: '暂无案例数据!'}
                this.toolsInfo = {total: total.total, time: time.time / 1000, dataType: this.dataType}
              }
            } else {
              this.monitorList = {data: [], total: 0, status: 'nodata', msg: response.message}
              this.toolsInfo = {total: 0, time: 0, dataType: this.dataType}
            }
          }).catch(error => {
            if (error) {
              this.monitorList = {status: 'nodata', msg: '暂无数据!'}
              this.toolsInfo = {total: 0, time: 0, dataType: this.dataType}
            }
          })
        } else {
          // this.$layer.msg('搜索内容不能为空')
          this.isText = false
        }
      },
      currentPage: function(currentPage) {
        this.monitorList = {data: [], total: 0, status: 'loading', msg: ''}
        if (currentPage) this.pageInfo.pageNum = currentPage
        this.searchRequest()
        this.similarDetailView.isShow = false
      },
      toggleSimilarList: function(id) {
        this.similarDetailView.isShow = true
        this.similarDetailView.id = id
      },
      closeDetail: function() {
        this.similarDetailView.isShow = false
      },
      /**
       * 高级搜索
       */
      closeHighSearchEmit: function(val) {
        if (typeof val === 'object') {
          this.searchTxt = val.allkey
          this.superParams.allkey = val.allkey
          this.superParams.arbitrarily = val.arbitrarily
          this.superParams.nocontain = val.nocontain
          this.toolsParams.publishDate = val.publishDate
          this.toolsParams.endTime = val.endTime
          this.toolsParams.goalWeb = val.goalWeb
          this.searchHighInfo = {isShow: false}
          this.searchType = 'super'
          this.toolsInfo.toolsToggle = false
          // this.isText = true
          this.pageInfo.pageNum = 1
          this.searchRequest()
        } else {
          this.searchHighInfo = {isShow: val}
        }
      },
      /**
       * 搜索工具 时间
       * @param val
       */
      dateTimeEmit: function(val) {
        if (typeof val === 'object') {
          this.toolsParams.publishDate = val.startTime
          this.toolsParams.endTime = val.endTime
          this.searchType = 'super' // 同步加 00:00:00
        }
        if (typeof val === 'number') {
          this.toolsParams.publishDate = String(val)
          this.toolsParams.endTime = ''
        }
        this.pageInfo.pageNum = 1
        this.searchRequest()
      },
      webAddressEmit: function(val) {
        this.toolsParams.goalWeb = val.value
        this.pageInfo.pageNum = 1
        this.searchRequest()
      },
      resetSearchTools: function() {
        this.toolsParams.publishDate = ''
        this.toolsParams.endTime = ''
        this.toolsParams.goalWeb = ''
      },
      toggleRadio: function(type) {
        this.dataType = type
        if (this.dataType === 'o') {
          this.superParams.allkey = ''
          this.superParams.arbitrarily = ''
          this.superParams.nocontain = ''
          this.webType = ''
          this.pageInfo.pageNum = 1
        }
        this.searchRequest()
      },
      logout: function() {
        let _this = this
        _this.$layer.confirm('您确定要退出吗？', {
          btn: ['确定', '取消'],
          title: '退出登录'
        }, (sureIndex) => {
          let url = _this.$store.state.url + 'auth/logout'
          _this.$get(url, {})
            .then(res => {
              if (res.status === 1) {
                _this.$layer.close(sureIndex)
                _this.$router.push({path: '/login'})
                delLocalStorage('userInfo')
                delCookie('auth')
              }
            })
        })
      },
      checkedAll: function(list) {
        let _this = this
        this.checkboxValue = []
        list.status = !list.status
        if (list.name === '全部') {
          this.checkboxData.forEach(function (item) {
            if (item.alias) item.status = false
          })
        } else {
          this.checkboxData.forEach(function (item) {
            if (item.alias === '') item.status = false
          })
        }
        this.checkboxData.forEach(function (item) {
          if (item.status) _this.checkboxValue.push(item.name)
        })
        this.verificationCheckBox()
      },
      verificationCheckBox: function() {
        let _this = this
        if (this.checkboxValue.length === 0) {
          this.checkboxData.forEach(function (item) {
            if (item.name === '全部') {
              item.status = true
              _this.checkboxValue = ['全部']
            }
          })
        }
        this.webType = this.checkboxValue.join(',')
        this.pageInfo.pageNum = 1
        this.searchRequest()
      },
      goHomeClick: function () {
        this.$router.push({path: '/home'})
      },
      advancedClick: function () {
        if (this.dataType === 'b') {
          this.searchHighInfo = {isShow: true}
        } else {
          this.$layer.msg('案例数据暂不支持高级搜索')
        }
      }
    }
  }
</script>

<style scoped lang="less">
.searchPub {
  /*@media screen and (min-width: 1900px) {*/

  /*}*/
  /*@media (min-width: 1420px) and (max-width: 1890px) {*/
    /*& div.searchInput {*/
      /*width: 690px !important;*/
    /*}*/
  /*}*/
  /*@media (min-width: 1320px) and (max-width: 1420px) {*/
    /*& div.searchInput {*/
      /*width: 720px !important;*/
    /*}*/
  /*}*/
  /*@media (max-width: 1320px) {*/
    /*& div.searchInput {*/
      /*width: 620px !important;*/
      /*!*max-width: 620px !important;*!*/
    /*}*/
  /*}*/
  & div.searchInput {
    width: 82vmin;
    height: 4vmin;
    margin-top: 1.5vmin;
    position: relative;
    & input {
      width: 100%;
      height: 4vmin;
      padding-left: 1vmin;
      box-sizing: border-box;
      font-size: 1.4vmin;
      border: 1px solid #333333;
      outline: none;
    }
    & a {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 6.8vmin;
      height: 1.8vmin;
      border: 1px solid #333333;
      border-left: none;
      font-size: 2vmin;
      text-align: center;
      padding: 1vmin;
      color: #fff;
      background-color: #9f2925;
      text-decoration: none;
    }
  }
  & div.radioList {
    margin-top: 1vmin;
    & label {
      margin-right: 4vmin;
      position: relative;
      cursor: pointer;
      font-size: 1.2vmin;
      & input[type = 'radio'] {
        vertical-align: middle;
        width: 1.6vmin;
        height: 1.6vmin;
        background-color: #fff;
        -webkit-appearance:none;
        border: 1px solid #c9c9c9;
        border-radius: 1vmin;
        outline: none;
      }
      & input[type = 'radio']:checked{
        background: url("../../assets/search/radioChecked.png") no-repeat;
        background-size: cover;
      }
    }
    & label:first-child {
      & span {
        padding-left: 0;
      }
    }
    & label:last-child {
      & span {
        padding-left: 0;
      }
    }
  }
  & div.checkboxList {
    margin-top: 1.5vmin;
    input[type = 'checkbox']{
      width: 1.2vmin;
      height: 1.2vmin;
      background-color: #fff;
      -webkit-appearance:none;
      border: 1px solid #c9c9c9;
      outline: none;
      margin-right: 0.2vmin;
      cursor: pointer;
    }
    input[type = 'checkbox']:checked{
      background: url("../../assets/search/checked.png")no-repeat;
      background-size: cover;
    }
    & label {
      margin-right: 1vmin;
      font-size: 1.2vmin;
      cursor: pointer;
    }
  }
}
.wrapper {
  width: 100%;
  height: 100%;
  .searchClass {
    width: 100%;
    /*min-width: 75%;*/
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    overflow-y: auto;
    & div.location {
      position: fixed;
      width: 100%;
      z-index: 10000;
    }
    & div.buttonGroup {
      float: right;
      margin: 20px 0 5px;
      padding: 0 40px 0 0;
      & ul {
        line-height: 40px;
        color: black;
        font-size: 14px;
        & li {
          margin: 0 10px;
          float: left;
          cursor: pointer;
        }
        & li.account {
          cursor: auto;
          padding-left: 45px;
          background: url("../../assets/search/img_user.png") no-repeat 0 0;
        }
        & li.line {
          margin: 0;
          cursor: none;
        }
        & li.exit {
        }
      }
    }
    & div.searchListHeader {
      width: auto;
      height: 12.4vmin;
      border-bottom: 1px solid #cccccc;
      position: fixed;
      background: #fff;
      z-index: 100;
      & div.searchListLogo {
        margin: 1.8vmin 1vmin 0 5vmin;
      }
      .searchPub;
    }
    & div.formGroup {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -25%);
      & div.logo {
        width: 26vmin;
        height: 6.6vmin;
        margin: 0 auto;
      }
      .searchPub;
    }
    & div.searchFooter {
      position: absolute;
      width: 220px;
      height: 180px;
      top: 80%;
      left: 50%;
      transform: translate(-50%, -50%);
      & div.qrCode_img {
        font-size: 14px;
        color: black;
        text-align: center;
        & a {
          margin-top: 15px;
          display: inline-block;
          color: black;
        }
      }
      & div.qrCode_txt {
        font-size: 14px;
        color: black;
        text-align: center;
        & div.qrCode_top {
          line-height: 32px;
        }
        & a {
          margin-top: 15px;
          display: inline-block;
          color: black;
        }
      }
    }
    & div.footer {
      position: fixed;
      width: 100%;
      bottom: 0;
      z-index: 100;
    }
  }
}
</style>
