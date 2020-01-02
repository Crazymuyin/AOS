<template>
  <div class="wrapper clearfix">
    <div class="left-list fn-left">
      <div class="theme-title">
        <div class="icon-theme"></div>
        <span>主题列表</span>
      </div>
      <my-tree :model="model" @menuSearch="changeMenu"></my-tree>
      <no-data :toggle="runStatus.themeRunStatus"></no-data>
    </div>
    <div class="right-list fn-right">
      <div class="direction">
        <div class="title clearfix">
          <span class="titleName fn-left">舆情趋势</span>
          <div class="condition clearfix fn-right">
            <div class="con-industry fn-left clearfix">
              <span class="industry fn-left">舆情属性：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionIndustry" :key="index" :class="index === directionCurrent ? 'active' : ''" @click="changeOne(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
            <div class="con-time fn-left clearfix">
              <span class="time fn-left">时间：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionTime" :key="index" :class="index === direcTimeCurrent ? 'active' : ''" @click="changeDirecTime(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chartOne">
          <div class="trend-chart" id="trendChart"></div>
          <span class="explain">{{explain.explainTrend}}</span>
          <no-data :toggle="runStatus.directRunStatus"></no-data>
        </div>
      </div>
      <div class="platform-distribution">
        <div class="title clearfix">
          <span class="titleName fn-left">平台舆情</span>
          <div class="condition clearfix fn-right">
            <div class="con-industry fn-left clearfix">
              <span class="industry fn-left">舆情属性：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionIndustry" :key="index" :class="index === platformCurrent ? 'active' : ''" @click="changeTwo(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
            <div class="con-time fn-left clearfix">
              <span class="time fn-left">时间：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionTime" :key="index" :class="index === platTimeCurrent ? 'active' : ''" @click="changePlatTime(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chartTwo">
          <div class="platform-chart" id="platformChart"></div>
          <span class="explain">{{explain.explainPlatform}}</span>
          <no-data :toggle="runStatus.platformRunStatus"></no-data>
        </div>
      </div>
      <div class="media-distribution">
        <div class="title clearfix">
          <span class="titleName fn-left">媒体舆情</span>
          <div class="condition clearfix fn-right">
            <div class="con-industry fn-left clearfix">
              <span class="industry fn-left">舆情属性：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionIndustry" :key="index" :class="index === mediaCurrent ? 'active' : ''" @click="changeThree(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
            <div class="con-time fn-left clearfix">
              <span class="time fn-left">时间：</span>
              <ul class="fn-left clearfix">
                <li class="fn-left" v-for="(item, index) in conditionTime" :key="index" :class="index === mediaTimeCurrent ? 'active' : ''" @click="changeMediaTime(index, item.key)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chartThree">
          <div class="media-chart" id="mediaChart"></div>
          <span class="explain">{{explain.explainMedia}}</span>
          <no-data :toggle="runStatus.mediaRunStatus"></no-data>
        </div>
      </div>
      <div class="risk-distribution">
        <div class="title clearfix">
          <span class="titleName fn-left">风险网民</span>
          <div class="condition clearfix fn-right">
            <span class="time fn-left">时间：</span>
            <ul class="fn-left clearfix">
              <li class="fn-left" v-for="(item, index) in conditionTime" :key="index" :class="index === riskTimeCurrent ? 'active' : ''" @click="changeFour(index, item.key)">{{item.name}}</li>
            </ul>
          </div>
        </div>
        <div class="chartFour">
          <div class="word-cloud" id="wordCloud" v-show="!runStatus.riskRunStatus.loading && !runStatus.riskRunStatus.noData && !runStatus.riskRunStatus.errorWork"></div>
          <span class="explain" v-show="!runStatus.riskRunStatus.loading && !runStatus.riskRunStatus.noData && !runStatus.riskRunStatus.errorWork">{{explain.explainRisk}}</span>
          <no-data :toggle="runStatus.riskRunStatus"></no-data>
          <div class="netizen-url-wrapper" v-if="isShowNetizenUrlDetails">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
import charts from '../../common/js/echartsService'
import noData from '../component/vue-noData'
import myTree from '../myTree/myTree'
import {getLocalStorage, initFun} from '../../common/js/cookie'
import {directionExPainFun} from '../../common/js/direction.expain.reckon'
import {platformExPainFun} from '../../common/js/platform.expain.reckon'
import {mediaExPainFun} from '../../common/js/media.expain.reckon'

export default {
  name: 'totalityAnalysis',
  components: {
    'no-data': noData,
    'my-tree': myTree
  },
  data() {
    return {
      themeList: [],
      conditionIndustry: [{name: '全部', key: 4}, {name: '正面', key: 1}, {name: '中性', key: 2}, {name: '负面', key: 3}],
      conditionTime: [{name: '近7天', key: 7}, {name: '近30天', key: 30}, {name: '当月', key: 'currentMonth'}],
      menuCurrent: 0,
      directionCurrent: 0,
      direcTimeCurrent: 0,
      platformCurrent: 0,
      platTimeCurrent: 0,
      mediaCurrent: 0,
      mediaTimeCurrent: 0,
      riskTimeCurrent: 0,
      riskWordCloudList: [],
      isShowNetizenUrlDetails: false,
      netizenUrlDetailsTitle: '',
      netizenUrlList: [],
      model: {
        isShow: false,
        menuList: []
      },
      runStatus: {
        themeRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        directRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        platformRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        mediaRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        riskRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
      },
      directionParams: {
        taskId: '',
        dateType: 7,
        raiseType: 4
      },
      platformParams: {
        taskId: '',
        dateType: 7,
        raiseType: 4
      },
      mediaParams: {
        taskId: '',
        dateType: 7,
        raiseType: 4
      },
      riskParams: {
        taskId: '',
        dateType: 7
      },
      explain: {
        explainTrend: '',
        explainPlatform: '',
        explainMedia: '',
        explainRisk: ''
      }
    }
  },
  created() {
    if (initFun()) {
      if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
        let taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        this.getThemeList(taskId)
        this.$emit('resetAnalysisMenuIndex', 0)
      }
    } else {
      this.$router.replace({path: '/login', name: '登录'})
    }
  },
  methods: {
    returnStatus: function (statusObj) {
      return statusObj.loading === false && statusObj.noData === false && statusObj.errorWork === false
    },
    getThemeList: function (taskId) {
      let params = {}
      if (taskId) params['taskId'] = taskId
      let url = `${this.$store.state.url}theme/task/monitor/list`
      this.$get(url, params).then(response => {
        let list = response.data
        if (response.status === 1 && Array.isArray(list) && list.length) {
          let tempList = []
          if (list[0].value.length) {
            list.map(item => {
              if (item.name === '区域主题' && item.value.length) { // 舆情总体分析 只展示常规主题
                let tempVal = []
                item.value.map((val, index) => {
                  if (index === 0) {
                    val.isActive = true
                    tempVal.push(val)
                  } else {
                    val.isActive = false
                    tempVal.push(val)
                  }
                })
                tempList.push({name: item.name, toggleShow: true, value: tempVal})
              } else if (item.name === '单位主题' && item.value.length) { //  单位主题
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
              if (item.name === '单位主题' && item.value.length) { // 舆情总体分析 只展示常规主题
                let tempVal = []
                item.value.map((val, index) => {
                  if (index === 0) {
                    val.isActive = true
                    tempVal.push(val)
                  } else {
                    val.isActive = false
                    tempVal.push(val)
                  }
                })
                tempList.push({name: item.name, toggleShow: true, value: tempVal})
              }
            })
          }
          this.model.menuList = tempList
          this.model.isShow = true
          this.runStatus.themeRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
          if (Array.isArray(tempList[0].value) && tempList[0].value.length) {
            this.directionParams.taskId = tempList[0].value[0].id
            this.platformParams.taskId = tempList[0].value[0].id
            this.mediaParams.taskId = tempList[0].value[0].id
            this.riskParams.taskId = tempList[0].value[0].id
          } else {
            this.runStatus = {
              themeRunStatus: {loading: false, noData: false, errorWork: false, tooltip: ''},
              directRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              platformRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              mediaRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
            }
          }
        } else {
          // this.themeList = [{ id: '', name: '暂未获取到主题', status: true }]
          this.model.menuList = [{name: '暂未获取到主题', toggleShow: false, value: [{id: '', name: ''}]}]
          this.model.isShow = true
          this.runStatus = {
            themeRunStatus: {loading: false, noData: false, errorWork: false, tooltip: ''},
            directRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
            platformRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
            mediaRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
            riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
          }
        }
      }, error => {
        this.model.menuList = [{name: '暂未获取到主题', toggleShow: false, value: [{id: '', name: ''}]}]
        this.model.isShow = true
        this.runStatus = {
          themeRunStatus: {loading: false, noData: false, errorWork: false, tooltip: ''},
          directRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
          platformRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
          mediaRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
          riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
        if (error) {}
      })
    },
    /**
     * 舆情趋势
     */
    directionReq: function () {
      let trendChart = this.$echarts.init(document.getElementById('trendChart'))
      trendChart.clear()
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getBrokenLine`
      this.$get(url, this.directionParams).then(res => {
        if (res.status === 1) {
          let data = res.data
          let option = charts.directionCharts(data)
          trendChart.setOption(option)
          this.explain.explainTrend = directionExPainFun(data, this.directionParams)
          this.runStatus.directRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
        }
        if (res.status === 0) {
          this.explain.explainTrend = ''
          this.runStatus.directRunStatus = { loading: false, noData: true, errorWork: false, tooltip: res.message }
        }
      }).catch(error => {
        if (error) {
          this.runStatus.directRunStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
        }
      })
    },
    /**
     * 平台舆情
     */
    platformReq: function () {
      let platformChart = this.$echarts.init(document.getElementById('platformChart'))
      platformChart.clear()
      let params = this.platformParams
      let paramsArr = []
      if (params.raiseType === 4) {
        paramsArr = [this.totalRequest(params), this.justRequest(params.taskId, params.dateType), this.wellRequest(params.taskId, params.dateType), this.lossRequest(params.taskId, params.dateType)]
      } else {
        paramsArr = [this.totalRequest(params)]
      }
      this.$all(paramsArr)
        .then((res) => {
          if (res.status === 1) {
            let dataAll = res.total
            let dataName = []
            let data = []
            let result = []
            dataAll.forEach((item, index) => {
              dataName.push(item.name)
            })
            dataAll = dataAll.filter((item) => parseFloat(item.value))
            data.push(dataName, dataAll)
            let option = charts.platformCharts(data, [], 1, function (percent) {
              let obj = {}
              for (let i = 0; i < percent.length; i++) {
                if (!obj[percent[i].name]) {
                  result.push(percent[i])
                  obj[percent[i].name] = true
                }
              }
            })
            platformChart.setOption(option)
            this.explain.explainPlatform = platformExPainFun(res, result, this.platformParams)
            this.runStatus.platformRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
          }
          if (res.status === 0) {
            this.runStatus.platformRunStatus = { loading: false, noData: true, errorWork: false, tooltip: res.message }
          }
        }).catch(error => {
          if (error) {
            this.runStatus.platformRunStatus = { loading: false, noData: false, errorWork: true, tooltip: error }
          }
        })
    },
    totalRequest: function(params) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getAnnular`
      return this.$get(url, params)
    },
    justRequest: function(taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getAnnular`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 1})
    },
    wellRequest: function(taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getAnnular`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 2})
    },
    lossRequest: function(taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getAnnular`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 3})
    },
    /**
     * 媒体舆情
     */
    mediaReq: function () {
      let mediaChart = this.$echarts.init(document.getElementById('mediaChart'))
      mediaChart.clear()
      let params = this.mediaParams
      let requestArr = []
      if (params.raiseType === 4) {
        requestArr = [this.mediaTotalRequest(params), this.mediaJustRequest(params.taskId, params.dateType), this.mediaWellRequest(params.taskId, params.dateType), this.mediaLossRequest(params.taskId, params.dateType)]
      } else {
        requestArr = [this.mediaTotalRequest(params)]
      }
      this.$all(requestArr)
        .then(res => {
          if (res.status === 1) {
            let dataAll = res.total
            let dataName = []
            let data = []
            dataAll.forEach((item, index) => {
              dataName.push(item.name)
            })
            dataAll = dataAll.filter((item) => parseFloat(item.value))
            data.push(dataName, dataAll)
            let option = charts.mediaCharts(data)
            mediaChart.setOption(option)
            this.explain.explainMedia = mediaExPainFun(res, this.mediaParams)
            this.runStatus.mediaRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
          }
          if (res.status === 0) {
            this.runStatus.mediaRunStatus = { loading: false, noData: true, errorWork: false, tooltip: res.message }
          }
        }).catch(error => {
          if (error) {
            this.runStatus.mediaRunStatus = { loading: false, noData: false, errorWork: true, tooltip: error }
          }
        })
    },
    mediaTotalRequest: function (params) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getSourceName`
      return this.$get(url, params)
    },
    mediaJustRequest: function (taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getSourceName`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 1})
    },
    mediaWellRequest: function (taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getSourceName`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 2})
    },
    mediaLossRequest: function (taskId, dateType) {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getSourceName`
      return this.$get(url, {taskId: taskId, dateType: dateType, raiseType: 3})
    },
    /**
     * 风险网民
     */
    riskReq: function () {
      let wordCloud = this.$echarts.init(document.getElementById('wordCloud'))
      wordCloud.clear()
      wordCloud.dispose()
      wordCloud = this.$echarts.init(document.getElementById('wordCloud'))
      this.runStatus.riskRunStatus = { loading: true, noData: false, errorWork: false, tooltip: '' }
      let urlArr = [this.riskDataRequest(), this.riskExPainRequest()]
      this.$riskAll(urlArr)
        .then(res => {
          if (res.status === 1) {
            this.riskWordCloudList = res.data
            let option = charts.riskCharts(this.riskWordCloudList)
            wordCloud.setOption(option, true)
            this.explain.explainRisk = res.exPain ? `图释：${res.exPain}` : ''
            this.runStatus.riskRunStatus = { loading: false, noData: false, errorWork: false, tooltip: '' }
            wordCloud.on('click', async (selectedData) => {
              let ids = ''
              this.riskWordCloudList.forEach(item => {
                if (item.name === selectedData.data.label) {
                  ids = item.id
                }
              })
              try {
                let url = `${this.$store.state.url}search/more/data`
                let params = {ids: ids}
                let response = await this.$post(url, params)
                if (response.status === 1) {
                  this.netizenUrlList = response.t
                  if (this.netizenUrlList.length === 1) {
                    window.open(this.netizenUrlList[0].url)
                  } else {
                    this.isShowNetizenUrlDetails = true
                    this.netizenUrlDetailsTitle = selectedData.data.label
                  }
                } else {
                  this.$layer.msg(response.message)
                }
              } catch (error) {
                this.$layer.msg(error)
              }
            })
          } else {
            this.runStatus.riskRunStatus = { loading: false, noData: true, errorWork: false, tooltip: res.message }
          }
        }).catch(error => {
          if (error) {
            this.runStatus.riskRunStatus = { loading: false, noData: false, errorWork: true, tooltip: error }
          }
        })
    },
    riskDataRequest: function () {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getNetizen`
      return this.$get(url, this.riskParams)
    },
    riskExPainRequest: function () {
      let url = `${this.$store.state.url}anlysis/dataAnlysis/getExplain`
      return this.$get(url, this.riskParams)
    },
    close: function() {
      this.isShowNetizenUrlDetails = false
    },
    resetCurrent: function() {
      this.directionCurrent = 0
      this.direcTimeCurrent = 0
      this.platformCurrent = 0
      this.platTimeCurrent = 0
      this.mediaCurrent = 0
      this.mediaTimeCurrent = 0
      this.riskTimeCurrent = 0
    },
    changeMenu: function(list, index) {
      if (list.hasOwnProperty('id') && list.id && index !== '') {
        this.directionParams = {taskId: list.id, dateType: 7, raiseType: 4}
        this.platformParams = {taskId: list.id, dateType: 7, raiseType: 4}
        this.mediaParams = {taskId: list.id, dateType: 7, raiseType: 4}
        this.riskParams = {taskId: list.id, dateType: 7}
        this.resetCurrent()
        this.menuCurrent = index
      }
    },
    changeOne: function (index, key) {
      this.directionParams.raiseType = key
      this.directionCurrent = index
    },
    changeDirecTime: function (index, key) {
      this.directionParams.dateType = key
      this.direcTimeCurrent = index
    },
    changeTwo: function (index, key1) {
      this.platformParams.raiseType = key1
      this.platformCurrent = index
    },
    changePlatTime: function (index, key1) {
      this.platformParams.dateType = key1
      this.platTimeCurrent = index
    },
    changeThree: function (index, key2) {
      this.mediaParams.raiseType = key2
      this.mediaCurrent = index
    },
    changeMediaTime: function (index, key2) {
      this.mediaParams.dateType = key2
      this.mediaTimeCurrent = index
    },
    changeFour: function (index, key3) {
      this.riskParams.dateType = key3
      this.riskTimeCurrent = index
    }
  },
  watch: {
    directionParams: {
      handler: function (val, old) {
        if (val.taskId && val.raiseType && val.dateType) {
          this.runStatus.directRunStatus = { loading: true, noData: false, errorWork: false, tooltip: '' }
          this.explain.explainTrend = ''
          this.directionReq()
        }
      },
      deep: true,
      immediate: false
    },
    platformParams: {
      handler: function (val) {
        if (val.taskId && val.raiseType && val.dateType) {
          this.explain.explainPlatform = ''
          this.runStatus.platformRunStatus = { loading: true, noData: false, errorWork: false, tooltip: '' }
          this.platformReq()
        }
      },
      deep: true,
      immediate: false
    },
    mediaParams: {
      handler: function (val) {
        if (val.taskId && val.raiseType && val.dateType) {
          this.explain.explainMedia = ''
          this.runStatus.mediaRunStatus = { loading: true, noData: false, errorWork: false, tooltip: '' }
          this.mediaReq()
        }
      },
      deep: true,
      immediate: false
    },
    riskParams: {
      handler: function (val) {
        if (val.taskId && val.dateType) {
          this.riskReq()
        }
      },
      deep: true,
      immediate: false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../common/less/common";
.wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .left-list{
    position: relative;
    width: 220px;
    height: 100%;
    min-height: 1641px;
    max-height: 1641px;
    overflow-y: auto;
    background-color: #ffffff;
    .theme-title{
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
    .theme-list{
      width: 100%;
      & ul{
        width: 100%;
        & li{
          width: 100%;
          height: 48px;
          display: block;
          line-height: 48px;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
        }
        & li:hover{
          background-color: #0068B7;
          color: #fff;
        }
        & li.active{
          background-color: #0068B7;
          color: #fff;
        }
      }
    }
  }
  .right-list{
    width: 970px;
    height: 100%;
    .direction, .platform-distribution, .media-distribution, .risk-distribution{
      width:966px;
      background: #fff;
      border:2px solid #dcdcdc;
      margin-top: 10px;
    }
    .direction{
      height:337px;
      margin-top: 0;
      .title{
        width: 99.5%;
        height: 32px;
        border-left: 5px solid #0068B7;
        margin-top: 8px;
        .titleName{
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #333333;
          padding-left: 7px;
        }
        .condition{
          width: 605px;
          line-height: 32px;
          .con-industry{
            width: 300px;
            height: 30px;
            .industry {
              display: block;
              width: 70px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 56px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 57px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
          .con-time{
            width: 280px;
            height: 30px;
            padding-left: 25px;
            .time {
              display: block;
              width: 50px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 70px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 71px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
        }
      }
      .chartOne{
        position: relative;
        .trend-chart {
          width: 100%;
          height: 234px;
        }
        .explain{
          display: block;
          width: 890px;
          padding: 0 43px 0 33px;
          margin-top: 4px;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    .platform-distribution{
      height: 406px;
      .title{
        width: 99.5%;
        height: 32px;
        border-left: 5px solid #0068B7;
        margin-top: 8px;
        .titleName{
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #333333;
          padding-left: 7px;
        }
        .condition{
          width: 605px;
          line-height: 32px;
          .con-industry{
            width: 300px;
            height: 30px;
            .industry {
              display: block;
              width: 70px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 56px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 57px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
          .con-time{
            width: 280px;
            height: 30px;
            padding-left: 25px;
            .time {
              display: block;
              width: 50px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 70px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 71px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
        }
      }
      .chartTwo{
        position: relative;
        .platform-chart {
          width: 100%;
          height: 299px;
        }
        .explain {
          display: block;
          width: 890px;
          padding: 0 43px 0 33px;
          margin-top: 4px;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    .media-distribution{
      height: 406px;
      .title{
        width: 99.5%;
        height: 32px;
        border-left: 5px solid #0068B7;
        margin-top: 8px;
        .titleName{
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #333333;
          padding-left: 7px;
        }
        .condition{
          width: 605px;
          line-height: 32px;
          .con-industry{
            width: 300px;
            height: 30px;
            .industry {
              display: block;
              width: 70px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 56px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 57px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
          .con-time{
            width: 280px;
            height: 30px;
            padding-left: 25px;
            .time {
              display: block;
              width: 50px;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              text-align: center;
              cursor: pointer;
            }
            & ul{
              height: 28px;
              & li{
                width: 70px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                cursor: pointer;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
              }
              & li:first-child{
                border-left: 1px solid #cccccc;
              }
              & li.active{
                border: none;
                width: 71px;
                height: 30px;
                background-color: #0068B7;
                color: #fff;
              }
            }
          }
        }
      }
      .chartThree{
        position: relative;
        .media-chart {
          width: 100%;
          height: 299px;
        }
        .explain {
          display: block;
          width: 890px;
          padding: 0 43px 0 33px;
          margin-top: 4px;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    .risk-distribution{
      position: relative;
      height: 446px;
      .title{
        width: 99.5%;
        height: 32px;
        border-left: 5px solid #0068B7;
        margin-top: 8px;
        .titleName{
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #333333;
          padding-left: 7px;
        }
        .condition{
          width: 280px;
          height: 30px;
          padding-left: 25px;
          .time {
            display: block;
            width: 50px;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
          }
          & ul{
            height: 28px;
            & li{
              width: 70px;
              border-top: 1px solid #cccccc;
              border-right: 1px solid #cccccc;
              border-bottom: 1px solid #cccccc;
              cursor: pointer;
              font-size: 14px;
              line-height: 28px;
              text-align: center;
            }
            & li:first-child{
              border-left: 1px solid #cccccc;
            }
            & li.active{
              border: none;
              width: 71px;
              height: 30px;
              background-color: #0068B7;
              color: #fff;
            }
          }
        }
      }
      .chartFour{
        position: relative;
        width: 100%;
        height: 406px;
        #wordCloud {
          position: absolute;
          top: 10px;
          left: 30px;
          width: 900px;
          height: 339px;
        }
        .explain {
          position: absolute;
          bottom: 10px;
          left: 33px;
          display: block;
          width: 890px;
          font-size: 14px;
          line-height: 18px;
        }
        .netizen-url-wrapper {
          box-sizing: border-box;
          position: absolute;
          bottom: 68px;
          left: 192px;
          width: 556px;
          height: 322px;
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
            height: 286px;
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
  }
}
</style>
