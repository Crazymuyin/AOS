<template>
  <div class="risk-wrapper">
    <div class="ranking-wrapper">
      <div class="title">
        <span>风险事件</span>
      </div>
      <div class="ranking-left" v-if="!eventStatus.loading && !eventStatus.noData && !eventStatus.errorWork">
        <ul>
          <li v-for="(item, index) of riskEventList.slice(0, 5)" :key="index" :class="{'active': item.status}"
            @click="handleRiskDetail('left', index, item)">
            <div></div>
            <span :title="item.title">{{item.title | sliceFilter(26)}}</span>
          </li>
        </ul>
      </div>
      <div class="ranking-right" v-if="!eventStatus.loading && !eventStatus.noData && !eventStatus.errorWork">
        <ul>
          <li v-for="(item, index) of riskEventList.slice(5, 10)" :key="index" :class="{'active': item.status}"
            @click="handleRiskDetail('right', index, item)">
            <div></div>
            <span>{{item.title | sliceFilter(26)}}</span>
          </li>
        </ul>
      </div>
      <v-no-data :toggle="eventStatus"></v-no-data>
    </div>
    <div class="digest-user-wrapper">
      <div class="risk-digest">
        <div class="title">
          <span>事件摘要</span>
        </div>
        <div class="digest-wrapper" v-if="!digestStatus.loading && !digestStatus.noData && !digestStatus.errorWork">
          <div>
            <span :title="riskDigest.title">{{riskDigest.title | sliceFilter(13)}}</span>
            <span :title="riskDigest.publishDate">{{riskDigest.publishDate.slice(0, 10)}}</span>
          </div>
          <div>
            <span :title="riskDigest.digest">{{riskDigest.digest | sliceFilter(100)}}</span>
          </div>
        </div>
        <div class="gauge-wrapper" v-show="!digestStatus.loading && !digestStatus.noData && !digestStatus.errorWork">
          <div id="riskGaugeId"></div>
          <div>
            <span>风险程度：</span>
            <span :class="degreeClass">{{ riskDigest.degreeDescription }}</span>
          </div>
        </div>
        <v-no-data :toggle="digestStatus"></v-no-data>
      </div>
      <div class="user-distribute-wrapper">
        <div class="title">
          <span>风险网民</span>
        </div>
        <div id="riskWordCloudId"
          v-show="!isShowNetizenUrlDetails && !netizenStatus.loading && !netizenStatus.noData && !netizenStatus.errorWork">
        </div>
        <div class="netizen-url-wrapper"
          v-if="isShowNetizenUrlDetails && !netizenStatus.loading && !netizenStatus.noData && !netizenStatus.errorWork">
          <div class="detail-title">
            <span>{{ netizenUrlDetailsTitle }}</span>
            <div class="close" @click="close"></div>
          </div>
          <div class="detail-content">
            <ul>
              <li v-for="(item, index) of netizenUrlList" :key="index">
                <a target="_blank" :href="item.url">{{ item.title | sliceFilter(30) }}</a>
              </li>
            </ul>
          </div>
        </div>
        <v-no-data :toggle="netizenStatus"></v-no-data>
      </div>
    </div>
    <div class="risk-spread-path-wrapper">
      <div class="title">
        <span>传播路径</span>
      </div>
      <div class="risk-spread-path">
        <div class="eventPathHeader" v-if="!pathStatus.loading && !pathStatus.noData && !pathStatus.errorWork">
          <div class="dateTime">{{riskSpreadPathList.length ? riskSpreadPathList[0].publishDate.slice(0,10) : ''}}</div>
          <img src="../../../src/assets/analysis/recentAnalysis/icon_clock.png" alt="" width="37">
        </div>
        <div v-if="!pathStatus.loading && !pathStatus.noData && !pathStatus.errorWork">
        <div class="eventPathItem" v-for="(list, index) of riskSpreadPathList" :key="index">
          <div class="dateTime">{{list.publishDate}}</div>
          <div class="line">
            <span class="radius"></span>
          </div>
          <div class="eventPathContent">
            <span class="fn_left fn_text_overflow" :title="list.title">{{list.title | sliceFilter(53)}}</span>
          </div>
        </div>
        </div>
        <v-no-data :toggle="pathStatus"></v-no-data>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getLocalStorage,
    initFun
  } from '../../common/js/cookie'
  import {
    riskGauge,
    riskWordCloud
  } from '../../common/js/echartsService'
  import detail from '../../components/component/detailPage'
  import noData from '../component/vue-noData'

  export default {
    name: 'recentAnalysis',
    components: {
      'v-detail': detail,
      'v-no-data': noData
    },
    data() {
      return {
        riskEventList: [],
        riskDigest: {title: '', publishDate: '', digest: '', degreeDescription: '', degreeValue: ''},
        degreeClass: '',
        riskWordCloudList: [],
        riskSpreadPathList: [],
        netizenUrlList: [],
        isShowNetizenUrlDetails: false,
        netizenUrlDetailsTitle: '点击跳转至相关链接网站：',
        eventStatus: {loading: false, noData: true, errorWork: false, tooltip: ''},
        digestStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        netizenStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        pathStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
      }
    },
    created() {
      if (initFun) {
        this.getRiskEventListReq()
        this.$emit('resetAnalysisMenuIndex', 1)
      } else {
        this.$router.replace({
          path: '/login',
          name: '登录'
        })
      }
    },
    methods: {
      initForEvent(riskEventItem) {
        if (riskEventItem) {
          this.getDigestListReq(riskEventItem)
          this.getNetizenListReq(riskEventItem)
          this.getRiskSpreadPathListReq(riskEventItem)
        }
      },
      /**
       * 风险事件TOP10
       */
      getRiskEventListReq() {
        this.eventStatus = {
          loading: true,
          noData: false,
          errorWork: false,
          tooltip: ''
        }
        let url = `${this.$store.state.url}anlysis/riskAnalysis/getRiskEventListById`
        let params = {
          userId: JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        this.$get(url, params).then(response => {
          if (response.status === 1) {
            this.eventStatus = {
              loading: false,
              noData: false,
              errorWork: false,
              tooltip: ''
            }
            this.riskEventList = response.data
            this.riskEventList.forEach((item, index) => {
              if (index === 0) {
                item['status'] = true
              } else {
                item['status'] = false
              }
            })
            this.initForEvent(this.riskEventList['0'])
          } else {
            this.eventStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
            this.digestStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
            this.netizenStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
            this.pathStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          this.eventStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
          this.digestStatus = {loading: false, noData: true, errorWork: false, tooltip: error}
          this.netizenStatus = {loading: false, noData: true, errorWork: false, tooltip: error}
          this.pathStatus = {loading: false, noData: true, errorWork: false, tooltip: error}
        })
      },
      /**
       * 事件摘要
       */
      getDigestListReq(riskEventItem) {
        this.digestStatus = {loading: true, noData: false, errorWork: false, tooltip: ''}
        let url = `${this.$store.state.url}anlysis/riskAnalysis/getRiskDigestById`
        let params = {
          eventId: riskEventItem.id,
          taskId: riskEventItem.taskId,
          codeId: riskEventItem.codeId
        }
        this.$get(url, params).then(response => {
          if (response.status === 1) {
            this.digestStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
            this.riskDigest = response.data[0]
            if (this.riskDigest.degreeDescription === '低') {
              this.degreeClass = 'low'
            } else if (this.riskDigest.degreeDescription === '一般') {
              this.degreeClass = 'commonly'
            } else if (this.riskDigest.degreeDescription === '较高') {
              this.degreeClass = 'higher'
            } else if (this.riskDigest.degreeDescription === '高') {
              this.degreeClass = 'high'
            } else {
              this.degreeClass = ''
            }
            this.drawGauge()
          } else {
            this.digestStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          if (error) {
            this.digestStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
          }
        })
      },
      /**
       * 事件摘要：画ECharts4仪表盘
       */
      drawGauge() {
        let myChart = this.$echarts.init(document.getElementById('riskGaugeId'))
        myChart.clear()
        let riskGaugeItem = [{
          name: this.riskDigest.degreeDescription,
          value: this.riskDigest.degreeValue
        }]
        let option = riskGauge(riskGaugeItem, ['当前整体风险', ['50%', '90%'], '150%', 10], 15)
        myChart.setOption(option)
        window.onresize = myChart.resize
      },
      /**
       * 风险网民
       */
      getNetizenListReq(riskEventItem) {
        this.netizenStatus = {loading: true, noData: false, errorWork: false, tooltip: ''}
        let url = `${this.$store.state.url}anlysis/riskAnalysis/getNetizenListById`
        let params = {
          eventId: riskEventItem.id,
          taskId: riskEventItem.taskId,
          codeId: riskEventItem.codeId
        }
        this.$get(url, params).then(response => {
          if (response.status === 1) {
            this.netizenStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
            this.riskWordCloudList = response.data.length > 20 ? response.data.slice(0, 20) : response.data
            this.drawWordCloud()
          } else {
            this.netizenStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          if (error) {
            this.netizenStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
          }
        })
      },
      /**
       * 风险网民：ECharts2字符云
       */
      drawWordCloud() {
        let seriesData = []
        this.riskWordCloudList.forEach(item => {
          seriesData.push({
            name: item.name,
            value: item.value
          })
        })
        let myChart = this.$echarts.init(document.getElementById('riskWordCloudId'))
        myChart.clear()
        myChart.dispose()
        myChart = this.$echarts.init(document.getElementById('riskWordCloudId'))
        let option = riskWordCloud(seriesData)
        myChart.setOption(option, true)
        // window.onresize = myChart.resize
        myChart.on('click', async (selectedData) => {
          let ids = ''
          this.riskWordCloudList.forEach(item => {
            if (item.name === selectedData.name) {
              ids = item.id
            }
          })
          try {
            let url = `${this.$store.state.url}search/more/data`
            let params = {
              ids: ids
            }
            let response = await this.$post(url, params)
            if (response.status === 1) {
              this.netizenUrlList = response.t
              if (this.netizenUrlList.length === 1) {
                window.open(this.netizenUrlList[0].url)
              } else {
                this.isShowNetizenUrlDetails = true
                this.netizenUrlDetailsTitle = selectedData.name
              }
            } else {
              this.$layer.msg(response.message)
            }
          } catch (error) {
            if (error) this.$layer.msg(error)
          }
        })
      },
      /**
       * 路径
       */
      async getRiskSpreadPathListReq(riskEventItem) {
        this.pathStatus = {
          loading: true,
          noData: false,
          errorWork: false,
          tooltip: ''
        }
        let url = `${this.$store.state.url}search/getRiskSpreadPathListWeb`
        let params = {
          ids: riskEventItem.ids
        }
        this.$post(url, params).then(response => {
          if (response.status === 1) {
            this.pathStatus = {
              loading: false,
              noData: false,
              errorWork: false,
              tooltip: ''
            }
            this.riskSpreadPathList = response.data
          } else {
            this.pathStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        }).catch(error => {
          if (error) {
            this.pathStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
          }
        })
      },
      /**
       * 点击风险事件 改变样式index 请求事件摘要、风险网民、传播路径
       * @param type
       * @param currentIndex
       * @param list
       */
      handleRiskDetail(type, currentIndex, list) {
        if (type === 'right') {
          currentIndex += 5
        }
        this.riskEventList.forEach((item, index) => {
          item.status = index === currentIndex
        })
        this.initForEvent(list)
        this.isShowNetizenUrlDetails = false
        this.netizenUrlList = []
      },
      close() {
        this.isShowNetizenUrlDetails = false
        this.netizenUrlList = []
      }
    }
  }

</script>

<style scoped lang="less">
  @import "../../common/less/common";

  .risk-wrapper {
    width: 100%;

    .ranking-wrapper {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 250px;
      border: 2px solid #DCDCDC;
      background: #ffffff;

      .title {
        .title();
      }

      .ranking-left,
      .ranking-right {
        box-sizing: border-box;
        float: left;
        margin-left: 57px;
        margin-top: 20px;
        width: 480px;
        height: 160px;

        ul {
          li {
            .flexRow(flex-start, center);
            cursor: pointer;

            div {
              margin-left: 10px;
              width: 16px;
              height: 18px;
              background: url("../../../src/assets/analysis/recentAnalysis/icon_listheadlines_black.png");
            }

            span {
              box-sizing: border-box;
              padding-left: 8px;
              padding-right: 8px;
              width: 100%;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              font-family: MicrosoftYaHei;
              font-weight: 400;
              color: #333333;
            }
          }

          li.active,
          li:hover {
            background: #0068B7;

            div {
              background: url("../../../src/assets/analysis/recentAnalysis/icon_listheadlines_white.png");
            }

            span {
              color: #ffffff;
            }
          }
        }
      }

      .ranking-right {
        margin-left: 100px;
      }
    }

    .digest-user-wrapper {
      position: relative;
      margin-top: 12px;
      width: 100%;
      height: 311px;
      .flexRow(space-between, center);

      .risk-digest {
        position: relative;
        box-sizing: border-box;
        width: 594px;
        height: 311px;
        border: 2px solid #DCDCDC;
        background: #ffffff;

        .title {
          .title();
        }

        .digest-wrapper {
          float: left;
          margin-top: 15px;
          margin-left: 15px;
          box-sizing: border-box;
          width: 344px;
          height: 232px;
          border: 4px solid rgba(0, 104, 183, 0.2);

          div:first-child {
            margin-left: 45px;
            margin-top: 18px;
            width: 252px;
            height: 36px;
            .flexColumn(center, center);

            span:first-child {
              width: 252px;
              height: 30px;
              font-size: 16px;
              font-family: MicrosoftYaHei;
              line-height: 30px;
              text-align: center;
            }

            span:last-child {
              width: 252px;
              height: 26px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              line-height: 26px;
              text-align: center;
            }
          }

          div:last-child {
            margin-left: 16px;
            margin-top: 10px;
            width: 305px;
            height: 150px;
            text-align: justify;

            span {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              line-height: 30px;
            }
          }
        }

        .gauge-wrapper {
          float: left;
          margin-top: 15px;
          margin-left: 15px;
          box-sizing: border-box;
          width: 200px;
          height: 232px;
          border: 4px solid rgba(0, 104, 183, 0.2);
          .flexColumn(center, center);

          #riskGaugeId {
            width: 126px;
            height: 83px;
          }

          div:last-child {
            margin-top: 10px;
            width: 126px;
            height: 18px;
            line-height: 18px;
            font-size: 18px;
            font-family: 'Microsoft YaHei';
            .flexRow(flex-start, center);

            span.high {
              // 高
              color: #ee2228;
            }

            span.higher {
              // 较高
              color: #fb8b1d;
            }

            span.commonly {
              // 一般
              color: #297fff;
            }

            /*span.lower { // 较低*/
            /*color: #00f8ff;*/
            /*}*/

            span.low {
              // 低
              color: #5ec79c;
            }
          }
        }
      }

      .user-distribute-wrapper {
        position: relative;
        box-sizing: border-box;
        width: 594px;
        height: 311px;
        border: 2px solid #DCDCDC;
        background: #ffffff;

        .title {
          .title();
        }

        #riskWordCloudId {
          position: absolute;
          bottom: 17px;
          left: 15px;
          width: 556px;
          height: 232px;
        }

        .netizen-url-wrapper {
          box-sizing: border-box;
          position: absolute;
          bottom: 20px;
          left: 15px;
          width: 556px;
          height: 232px;
          .flexColumn(center, flex-start);

          .detail-title {
            width: 548px;
            height: 36px;
            line-height: 36px;
            color: #0068b7;
            font-weight: bold;
            background: #f0f7fa;
            border: 4px solid rgba(0, 104, 183, 0.2);
            border-bottom: 0;
            & span {
              padding-left: 18px;
            }

            .close {
              position: absolute;
              top: 10px;
              right: 10px;
              width: 16px;
              height: 16px;
              cursor: pointer;
              background: url("../../../src/assets/detail/detail_close.png") no-repeat 0 0;
            }
          }

          .detail-content {
            box-sizing: border-box;
            position: relative;
            width: 556px;
            height: 196px;
            background: #ffffff;
            border-left: 4px solid rgba(0, 104, 183, 0.2);
            border-right: 4px solid rgba(0, 104, 183, 0.2);
            border-bottom: 4px solid rgba(0, 104, 183, 0.2);

            ul {
              width: 100%;
              height: 100%;
              overflow-y: scroll;

              li {
                font-size: 16px;
                padding: 0 15px;
                line-height: 28px;

                a {
                  cursor: pointer;
                  text-decoration-line: none;
                }

                a:link {
                  color: black;
                }

                a:hover {
                  color: red;
                }

                a:active {
                  color: green;
                }

                a:visited {
                  color: blue;
                }
              }
            }
          }
        }
      }
    }

    .risk-spread-path-wrapper {
      margin-top: 12px;
      box-sizing: border-box;
      width: 100%;
      height: 563px;
      border: 2px solid #DCDCDC;
      background: #ffffff;

      .title {
        .title();
      }

      .risk-spread-path {
        position: relative;
        width: 1150px;
        height: 490px;
        margin-top: 10px;
        padding: 0 20px 20px 20px;
        overflow-y: auto;

        .eventPathHeader {
          width: 100%;
          height: 36px;

          .dateTime {
            float: left;
            width: 155px;
            height: 100%;
            line-height: 36px;
            margin-right: 0;
            padding-right: 15px;
            text-align: right;
          }

          img {
            display: block;
          }
        }

        .eventPathItem {
          width: 100%;
          height: 100px;

          .dateTime {
            float: left;
            width: 170px;
            height: 69px;
            line-height: 69px;
            margin-right: 18px;
          }

          .line {
            float: left;
            width: 2px;
            height: 100%;
            background: #cccccc;
            position: relative;

            .radius {
              display: block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: red;
              position: absolute;
              top: 31px;
              left: -1.5px;
            }
          }

          .eventPathContent {
            float: left;
            width: 888px;
            height: 69px;
            line-height: 69px;
            background: rgba(241, 241, 241, 1);
            padding: 0 15px;
            margin-left: 25px;
            font-size: 16px;
            color: #333333;
          }
        }
      }
    }
  }

</style>
