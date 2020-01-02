<template>
  <div v-show="detailInfoObj.isDetail" class="searchDetail">
    <div class="close" @click="closeDetail"></div>
    <div class="detail-wrapper">
      <div class="wrapper" v-show="normalShow">
        <div class="normalDetail">
          <div class="title">
            <div class="name">
              <span :title="detailInfoObj.newsTitle">{{detailInfoObj.newsTitle | sliceFilter(25)}}</span>
              <i v-for="(vo, index) of detailInfoObj.appraise" :key="index" @click="editCurrent(detailInfoObj, vo)" :class="detailInfoObj.appraise.length === 1 ? {'positive': vo.name === '正面', 'neutral': vo.name === '中性', 'negative': vo.name === '负面'} : {'positiveHover': vo.name === '正面' && vo.status, 'positivePlus': vo.name === '正面' && !vo.status,
                            'neutralHover': vo.name === '中性' && vo.status, 'neutralPlus': vo.name === '中性' && !vo.status,
                            'negativeHover': vo.name === '负面' && vo.status, 'negativePlus': vo.name === '负面' && !vo.stauts}"></i>
              <i v-show="editShow" @click="editModel(detailInfoObj)" title="我要修改"></i>
            </div>
            <div v-if="detailInfoObj.newsName !=='word'" class="date">
              <span v-if="detailInfoObj.newsDate">发布时间：</span><span>{{detailInfoObj.newsDate}}</span>
              <span v-if="detailInfoObj.author">作者：</span><span>{{detailInfoObj.author}}</span>
              <span v-if="detailInfoObj.url">【<a :href="detailInfoObj.url" target="_blank">阅读原文</a>】</span>
            </div>
          </div>
          <!--<div class="feature">
            <div class="number clearfix">
              <span class="fn-left"></span><span class="fn-left" title="浏览数">{{detailInfoObj.readNum}}</span>
              <span class="fn-left"></span><span class="fn-left" title="评论数">{{detailInfoObj.commentsNum}}</span>
              <span class="fn-left"></span><span class="fn-left" title="转发数">{{detailInfoObj.forwardNum}}</span>
            </div>
          </div>-->
          <div class="keyWord" v-if="detailInfoObj.keyWordstr">
            <span>【<a>关键词</a>】</span>
            <span>{{ detailInfoObj.keyWordstr.replace(/,/g, '，') }}</span>
          </div>
          <div class="content">
            <span v-if="detailInfoObj.source">【<a>{{detailInfoObj.source}}</a>】</span>
            <span v-if="detailInfoObj.newsName !=='word' && detailInfoObj.newsContent" v-html="detailInfoObj.newsContent"></span>
            <span v-if="detailInfoObj.newsName ==='word' && detailInfoObj.highlightContent" v-html="detailInfoObj.highlightContent"></span>
          </div>
          <div class="liner" v-if="Array.isArray(similarArr) && similarArr.length"></div>
          <div class="similar" v-if="Array.isArray(similarArr) && similarArr.length">
            <div>
              <span class="title">相似文章</span>
              <span v-if="detailInfoObj.similarNum > 5" class="more fn-right" @click="viewMore(detailInfoObj.id)">查看更多 ></span>
            </div>
            <ul class="link">
              <li v-for="(list,index) in similarArr" :key="index">
                <div>
                  <span>·</span>
                  <div class="detail">
                    <span>【<a>{{list.sourceName | sliceFilter(15)}}</a>】</span>
                    <span><a v-bind:href="list.url" target="_blank" :title="list.title">{{list.title | sliceFilter(30)}}</a></span>
                    <span>{{list.publishDate}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="caseDetail" v-show="caseShow">
        <img :src="caseImgSrc">
      </div>
      <no-data :toggle="loadingStatus"></no-data>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  import noData from '../component/vue-noData'
  import {getLocalStorage} from '../../common/js/cookie'
  export default {
    name: 'searchDetail',
    props: {
      detailInfoParams: Object
    },
    components: {noData},
    data() {
      return {
        editShow: false,
        detailInfoObj: {isDetail: false},
        loadingStatus: {loading: false, noData: false, errorWork: false, tooltip: ''},
        defaultModel: [{ name: '正面', status: false }, { name: '中性', status: false }, { name: '负面', status: false }],
        followScoreDefault: [],
        similarArr: [],
        caseShow: false,
        normalShow: false,
        caseImgSrc: '',
        similarDetailView: {
          id: ''
        }
      }
    },
    methods: {
      viewMore: function(id) {
        this.similarDetailView.id = id
        this.$emit('similar', this.similarDetailView.id)
      },
      detailRequest: function(response) {
        response = response.data
        response.appraise = [{ name: response.appraise, status: true }]
        // console.log(response)
        // this.similarArr = response.similarList
        // this.detailObj = response
        // this.detailObj.content = addKeyStyleForContent(response.content, response.matchKeys)
      },
      // 新闻正中负修改请求
      editRequest: function(list, score, callback) {
        let params = {}
        if (list.id) params.id = list.id
        if (score) params.appraise = score['name']
        if (list.newsDate) params.year = list.newsDate.slice(0, 4)
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
              _this.$emit('appraiseEdit', {id: list.id, appraise: list.appraise, status: true})
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
      closeDetail: function () {
        // this.detailInfoObj = {}
        this.editShow = false
        this.$emit('closeDetail', true)
      },
      resetDetail: function () {
        this.detailInfoObj = {
          appraise: [],
          newsName: '',
          newsDate: '',
          newsTitle: '',
          newsContent: '',
          highlightContent: '',
          keyWords: '',
          keyWordstr: '',
          similarNum: '',
          readNum: '',
          commentsNum: '',
          forwardNum: '',
          ftp_path: '',
          isDetail: true
        }
        this.similarArr = []
        this.editShow = false
      }
    },
    watch: {
      detailInfoParams: {
        handler: function (val) {
          this.resetDetail()
          this.loadingStatus = {loading: true, noData: false, errorWork: false, tooltip: ''}
          if (val.ftp_path) {
            this.detailInfoObj.isDetail = val.isDetail
            this.caseImgSrc = ''
            let url = `${this.$store.state.url}search/caseShow`
            this.$get(url, {ftp_path: val.ftp_path, highlightTitle: val.newsTitle})
              .then(response => {
                this.normalShow = false
                this.caseShow = true
                this.caseImgSrc = 'data:image/png;base64,' + response.base
                this.loadingStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
                // <div style='****'>    <div>
                // response.data = response.data.replace(/(<div style=")(.*?)(">)/, '<div>')
                // val.highlightContent = response.data
                // this.detailInfoObj = val
              }).catch(error => {
                this.loadingStatus = {loading: false, noData: true, errorWork: false, tooltip: error}
              })
          } else {
            let params = {}
            let url = `${this.$store.state.url}search/publicSentiment/details`
            if (val.id && val.newsDate) {
              params.dataId = val.id
              params.time = val.newsDate
            }
            if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
              params.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
            }
            this.$get(url, params).then(response => {
              if (response.status === 1) {
                this.normalShow = true
                this.caseShow = false
                let dataInfo = response.data
                let item = dataInfo.publicSentimentData
                if (item) {
                  let contentObj = {
                    isDetail: true,
                    id: item.id,
                    appraise: item.appraise ? [{name: item.appraise, status: true}] : [],
                    newsName: item.type ? item.type : '',
                    newsDate: item.publishDate ? item.publishDate : '',
                    newsTitle: item.title ? item.title : item.highlightTitle,
                    newsContent: item.content ? item.content : item.highlightContent,
                    keyWords: item.matchKeys ? item.matchKeys.split(',') : '',
                    keyWordstr: item.matchKeys ? item.matchKeys : '',
                    similarNum: item.similarNum ? item.similarNum : 0,
                    author: item.author ? item.author : '',
                    url: item.url ? item.url : '',
                    readNum: item.click ? item.click : 0,
                    commentsNum: item.repeatTotal ? item.repeatTotal : 0,
                    forwardNum: item.forward ? item.forward : 0,
                    ftp_path: item.ftp_path ? item.ftp_path : ''
                  }
                  this.detailInfoObj = contentObj
                  this.editShow = true
                } else {
                  this.detailInfoObj = val
                }
                this.similarArr = dataInfo.similarList
                this.loadingStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
              } else if (JSON.stringify(val) !== '{}') {
                this.loadingStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
                this.detailInfoObj = val
              } else {
                this.loadingStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
              }
            })
          }
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style scoped lang="less">
  @import url('../../common/less/common');
  .searchDetail{
    position: fixed;
    width: 45%;
    height: 82.9%;
    background: white;
    border-radius: 1vmin;
    box-shadow: -0.1vmin 0.1vmin 1vmin rgba(0, 0, 0, .2);
    bottom: 4.7%;
    right: 0;
    z-index: 10000;
    overflow-y: auto;
    .detail-wrapper {
      width: 100%;
      height: 100%;
      .wrapper {
        position: relative;
        width: 88%;
        height: 86%;
        margin: 7vmin auto 0 auto;
        padding: 0 5vmin;
        overflow-y: auto;
        .normalDetail {
          .title {
            text-align: center;
            padding-bottom: 5vmin;

            .name {
              height: 3vmin;
              margin-top: 2.5vmin;

              & i {
                position: relative;
                display: inline-block;
                top: 0.2vmin;
                width: 20px;
                height: 23px;
                margin-top: -1vmin;
                margin-right: 0.6vmin;
                vertical-align: middle;
                cursor: pointer;
              }

              & i:first-child {
                .fire-icon(1);
              }

              & i:nth-child(2) {
                margin-left: -0.6vmin;
              }

              & i:last-child {
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

              & span {
                font-size: 2.4vmin;
                line-height: 2.5vmin;
                padding: 0 1.2vmin;
              }
            }

            .date {
              margin-top: 1.6vmin;
              height: 1.5vmin;
              font-size: 1.4vmin;

              & span:nth-child(2) {
                margin-right: 2vmin;
              }

              & span:nth-child(4) {
                margin-right: 2vmin;
              }

              & span:last-child {
                & a {
                  text-decoration: none;
                  color: #00a0e9;
                }
              }
            }
          }

          .feature {
            font-size: 1.4vmin;
            line-height: 2.4vmin;
            text-indent: 2em;
            text-align: justify;
            text-justify: distribute-all-lines;
            text-align-last: left;

            .number {
              font-size: 1.2vmin;
              cursor: default;

              & span:first-child {
                position: relative;
                margin-top: 0.7vmin;
                width: 20px;
                height: 11px;
                background: url("../../../resource/design/img_monitor_img.png") no-repeat -12px -131px;
              }

              & span:nth-child(3) {
                position: relative;
                margin-top: 0.7vmin;
                margin-left: 1vmin;
                width: 13px;
                height: 11px;
                background: url("../../../resource/design/img_monitor_img.png") no-repeat -82px -131px;
              }

              & span:nth-child(5) {
                position: relative;
                margin-top: 0.7vmin;
                margin-left: 1vmin;
                width: 12px;
                height: 12px;
                background: url("../../../resource/design/img_monitor_img.png") no-repeat -143px -131px;
              }

              & div {
                & span:first-child {
                  position: relative;
                  margin-top: 7px;
                  width: 13px;
                  height: 12px;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -14px -79px;
                }

                & span:nth-child(2) {
                  margin-left: -20px;
                }

                & span.like {
                  cursor: pointer;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -14px -79px;
                }

                & span.dislike {
                  cursor: pointer;
                  background: url("../../../resource/design/img_monitor_img.png") no-repeat -71px -79px;
                }
              }

              & span:nth-child(2), & span:nth-child(4), & span:nth-child(6) {
                margin-left: -20px;
              }
            }
          }

          .keyWord {
            padding: 2vmin 3vmin;
            border: 1px dashed #7e8c8d;
            white-space: normal;
            word-break: break-all;
            font-size: 1.4vmin;
            color: #ff0000;
            line-height: 2vmin;

            & span:first-child {
              color: black;

              & a {
                text-decoration: none;
                color: #ff0000;
                font-weight: 600;
              }
            }

            & span:nth-child(2) {
              & i {
                font-style: inherit;
                padding: 0 5px;
              }
            }
          }

          .content {
            width: 100%;
            margin-top: 2vmin;
            margin-bottom: 5vmin;
            padding-right: 1.5vmin;
            font-size: 1.4vmin;
            line-height: 2.4vmin;
            text-indent: 2em;
            text-align: justify;
            text-justify: distribute-all-lines;
            text-align-last: left;
            word-break: break-word;

            & span:first-child {
              & a {
                text-decoration: none;
                color: #ff0000;
                font-weight: 600;
              }
            }
          }

          .liner {
            height: 3px;
            background: url("../../../src/assets/detail/xian_details_xian.png") no-repeat;
            background-size: 100%;
            margin-top: 6vmin;
          }

          .similar {
            .title {
              height: 5vmin;
              font-size: 1.6vmin;
              line-height: 4.8vmin;
              font-weight: 600;
            }
            .more {
              font-size: 12px;
              color: #666666;
              margin-left: 13px;
              cursor: pointer;
              line-height: 48px;
            }
            & ul {
              font-size: 1.4vmin;
              padding-bottom: 5vmin;

              & li {
                & div {
                  & span {
                    display: inline-block;
                    font-size: 2.8vmin;
                    vertical-align: middle;
                  }

                  & div {
                    display: inline-block;

                    & span {
                      font-size: 1.4vmin;
                      line-height: 2.8vmin;

                      & a {
                        text-decoration: none;
                        color: red;
                      }
                    }

                    & span:last-child {
                      font-size: 1.2vmin;
                      color: #666666;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .caseDetail {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        & img {
          width: 100%;
        }
      }
    }
    .close{
      width: 2.5vmin;
      height: 2.5vmin;
      float: right;
      margin: 0.8vmin 2vmin 0 0;
      cursor: pointer;
      background: url("../../assets/search_close.png") no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
