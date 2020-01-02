<template>
  <div class="searchList">
    <div class="wrapper">
      <div class="list-content">
        <div class="ul-wrapper" v-for="(list, index) of monitorList.data" :key="index" :class="index === listCurrent ? 'active' : ''">
          <ul>
            <li class="clearfix">
              <span class="type" v-if="list.hasOwnProperty('newsName') && list.newsName.length && list.newsName !== 'word'">【<i :title="list.newsName">{{list.newsName | sliceFilter(10)}}</i>】</span>
              <span v-if="list.hasOwnProperty('newsTitle')" class="title" :title="list.newsTitle" @click="expandDetail(list, index)">
                {{monitorList.dataType === 'b' && list.newsTitle.length > 25 ? list.newsTitle.slice(0, 25) + '...' :
                monitorList.dataType === 'o' && list.newsTitle.length > 65 ? list.newsTitle.slice(5, 65) + '...' :
                monitorList.dataType === 'o' ? list.newsTitle.slice(5) : list.newsTitle}}
              </span>
              <span v-if="list.hasOwnProperty('appraise') && list.appraise.length" class="appraise">
                <i v-for="(appraise, number) of list.appraise" :key="number"
                   :class="list.appraise.length === 1 ? {'positive': appraise.name === '正面', 'neutral': appraise.name === '中性', 'negative': appraise.name === '负面'} : {'positiveHover': appraise.name === '正面' && appraise.status, 'positivePlus': appraise.name === '正面' && !appraise.status,
                    'neutralHover': appraise.name === '中性' && appraise.status, 'neutralPlus': appraise.name === '中性' && !appraise.status,
                    'negativeHover': appraise.name === '负面' && appraise.status, 'negativePlus': appraise.name === '负面' && !appraise.stauts}" @click="editAppraise(list, appraise, $event)"></i>
                <i class="edit" @click="editClick(list, $event)" title="我要修改"></i>
              </span>
              <span class="dateTime fn-right">{{list.newsDate}}</span>
            </li>
            <li @click="expandDetail(list, index)">{{list.desc | sliceFilter(80)}}</li>
            <li class="clearfix">
              <span class="keys" v-if="list.keyWords.length" :title="list.keyWordstr">关键词：<i v-for="(vo, index) of list.keyWords" :key="index">{{vo}}&nbsp;&nbsp;</i></span>
              <span v-if="list.newsName !== 'word' && list.similarNum > 0" class="similarNum" @click="toggleSearchSimilar(list.id)">【<i>{{list.similarNum}}</i>篇相似】</span>
              <span v-if="list.newsName !== 'word'" class="readNum" title="浏览数">{{list.readNum}}</span>
              <span v-if="list.newsName !== 'word'" class="commentsNum" title="评论数">{{list.commentsNum}}</span>
              <span v-if="list.newsName !== 'word'" class="forwardNum" title="转发数">{{list.forwardNum}}</span>
              <span v-if="list.newsName === 'word'" @click="downloadFile(list)" class="download" title="下载文档">下载文档</span>
              <!--<span @click="followClick(list, $event)" class="follow fn-right" :class="list.follow === 1 ? 'follow' : 'disfollow'" title="添加关注"></span>-->
            </li>
          </ul>
          <div class="similarList" v-if="searchSimilarIndex === list.id" v-show="searchSimilarShow">
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
                      <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(25)}}</a></span>
                      <span>{{item.publishDate}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-if="monitorList.total" class="page">
        <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
      </div>
      <search-detail :detailInfoParams="detailInfoParams" @appraiseEdit="appraiseEdit" @closeDetail="closeDetail" @similar="toggleSimilarView"></search-detail>
    </div>
    <no-data :toggle="loadingStatus"></no-data>
  </div>
</template>

<script type="application/ecmascript">
  import page from '../../components/component/pagination'
  import SearchDetail from './searchDetail'
  import noData from '../component/vue-noData'
  import {getCookie} from '../../common/js/cookie'
  export default {
    name: 'searchList',
    components: {
      SearchDetail,
      'v-pagination': page,
      'no-data': noData
    },
    props: ['monitorList', 'searchTxt'],
    data() {
      return {
        detailInfoParams: {
          isDetail: false
        },
        searchSimilarIndex: '',
        searchSimilarShow: false,
        listCurrent: '',
        defaultAppraise: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
        realDefaultValue: [],
        pageInfo: { total: 0, display: 10, currentPage: 1, pageGroup: 5 },
        loadingStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
      }
    },
    methods: {
      // 展开相似文章列表
      toggleSearchSimilar: function(index) {
        this.listCurrent = index
        if (this.searchSimilarIndex === index) {
          this.searchSimilarIndex = ''
          this.searchSimilarShow = false
        } else {
          this.searchSimilarIndex = index
          this.searchSimilarShow = true
        }
      },
      // 查看更多相似文章
      viewMore: function(id) {
        this.$emit('similarList', id)
      },
      // 从详情页打开相似文章详情页
      toggleSimilarView: function(id) {
        this.$emit('similarList', id)
      },
      expandDetail: function (list, index) {
        this.searchSimilarShow = false
        if (this.searchSimilarIndex === list.id) {
          this.searchSimilarShow = true
        }
        this.listCurrent = index
        list.isDetail = true
        this.detailInfoParams = list
      },
      appraiseEdit: function(obj) {
        if (obj.status) {
          if (Array.isArray(this.monitorList.data) && this.monitorList.data.length) {
            this.monitorList.data.forEach(item => {
              if (Number(item.id) === Number(obj.id)) {
                item.appraise = obj.appraise
              }
            })
          }
        }
      },
      closeDetail: function(state) {
        if (state) {
          this.detailInfoParams = {
            isDetail: false
          }
        }
      },
      downloadFile: function (list) {
        let url = `${this.$store.state.url}search/caseData?ftp_path=${list.ftp_path}&highlightTitle=${list.newsTitle}&auth=${getCookie('auth')}`
        window.open(url)
      },
      pageChange: function (currentPage) {
        if (this.detailInfoParams.isDetail) this.closeDetail(true)
        this.listCurrent = ''
        this.pageInfo.currentPage = currentPage
        this.searchSimilarShow = false
        this.$emit('currentPage', currentPage)
      },
      // 展开情感属性
      editClick: function (list, e) {
        e.stopPropagation()
        this.monitorList.data.forEach(item => {
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
      editAppraise: function (list, appraise, e) {
        e.stopPropagation()
        if (list.appraise.length === 3) {
          let _this = this
          this.editAppraiseRequest(list, appraise, function (appraise, status) {
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
      editAppraiseRequest: function(list, appraise, callback) {
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
      }
    },
    watch: {
      monitorList: {
        handler: function (val) {
          this.listCurrent = ''
          if (val.pageNum === 1) {
            this.pageInfo.currentPage = 1
          }
          if (val.total !== '') this.pageInfo.total = val.total
          if (val.status === 'loading') this.loadingStatus = {loading: true, noData: false, errorWork: false, tooltip: ''}
          if (val.status === 'success') this.loadingStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
          if (val.status === 'nodata') this.loadingStatus = {loading: false, noData: true, errorWork: false, tooltip: val.msg}
          if (val.status === 'error') this.loadingStatus = {loading: false, noData: false, errorWork: true, tooltip: val.msg}
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style scoped lang="less">
  /*@media (min-width: 1420px) and (max-width: 1890px) {*/
  /*.searchList {*/
  /*width: 690px !important;*/
  /*}*/
  /*}*/
  /*@media (min-width: 1320px) and (max-width: 1420px) {*/
  /*.searchList {*/
  /*width: 720px !important;*/
  /*}*/
  /*}*/
  /*@media (max-width: 1320px) {*/
  /*.searchList {*/
  /*width: 620px !important;*/
  /*!*max-width: 620px !important;*!*/
  /*}*/
  /*}*/
  .searchList {
    width: 83.5vmin;
    height: 70%;
    margin: 0 0 0 18.8vmin;
    position: relative;
    .wrapper {
      position: relative;
      width: 100%;
      height: auto;
      padding-bottom: 6vmin;
      .list-content {
        width: 100%;
        .ul-wrapper {
          & ul {
            width: auto;
            padding: 0 1.5vmin 1vmin 1.5vmin;
            cursor: pointer;
            & li {
              font-size: 1.4vmin;
              & span {
                & i {
                  font-style: inherit;
                }
              }
            }
            & li:first-child {
              position: relative;
              cursor: pointer;
              padding-top: 2vmin;
              margin-bottom: 1vmin;
              & span.type {
                & i {
                  color: #ff0000;
                  font-style: inherit;
                }
              }
              & span.appraise {
                position: absolute;
                top: 1.6vmin;
                & i {
                  display: inline-block;
                  width: 19px;
                  height: 23px;
                  cursor: pointer;
                  margin-right: 1.5vmin;
                }
                & i:first-child {
                  margin-left: 1.9vmin;
                }
                & i.positive {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
                }
                & i.positivePlus {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -188px;
                }
                & i.positivePlus:hover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -222px;
                }
                & i.positiveHover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -222px;
                }
                & i.neutral {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
                }
                & i.neutralPlus {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -188px;
                }
                & i.neutralPlus:hover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -222px;
                }
                & i.neutralHover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -112px -222px;
                }
                & i.negative {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
                }
                & i.negativePlus {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -61px -188px;
                }
                & i.negativePlus:hover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -222px;
                }
                & i.negativeHover {
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -62px -222px;
                }
                & i.edit {
                  margin-left: -7px;
                  background: url("../../assets/public/img_monitor_img.png") no-repeat -151px -188px;
                }
              }
            }
            & li:nth-child(2) {
              color: #7E7E7E;
              line-height: 2vmin;
              text-align: justify;
              text-justify: distribute-all-lines;
              text-align-last: left;
            }
            & li:last-child {
              margin-top: 0.8vmin;
              & span.keys {
                color: #797878;
                & i {
                  color: #ff0000;
                }
              }
              & span.download {
                color: #72b4f0;
                & i {
                  padding: 0 0.5vmin;
                  color: #72b4f0;
                }
              }
              & span.similarNum {
                color: #797878;
                & i {
                  padding: 0 0.5vmin;
                  color: #72b4f0;
                }
              }
              & span.readNum {
                margin-left: 4.5vmin;
                padding-left: 2.5vmin;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -12px -129px;
              }
              & span.commentsNum {
                margin-left: 1vmin;
                padding-left: 1.8vmin;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -82px -129px;
              }
              & span.forwardNum {
                margin-left: 1vmin;
                padding-left: 1.8vmin;
                color: #797878;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -143px -130px;
              }
              & span.follow {
                display: block;
                width: 1.3vmin;
                height: 1.2vmin;
                cursor: pointer;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -14px -79px;
              }
              & span.disfollow {
                cursor: pointer;
                background: url("../../assets/public/img_monitor_img.png") no-repeat -71px -79px;
              }
            }
          }
        }
        .ul-wrapper:hover {
          background-color: #dddddd;
        }
        .ul-wrapper.active {
          background-color: #dddddd;
        }
        .similar{
          padding: 1vmin 1.5vmin;
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
            & li:first-child {
              padding-top: 0;
              margin-bottom: 0;
            }
            & li:nth-child(2) {
              color: #000;
              line-height: 20px;
            }
            & li:last-child {
              margin-top: 0;
            }
          }
          & ul:hover {
            background: none;
          }
        }
      }
      .page {
        margin-top: 5vmin;
      }
    }
  }
</style>
