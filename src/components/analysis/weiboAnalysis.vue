<template>
  <div class="weiboAnalysis wrapper clearfix">
    <div class="left-list fn-left">
      <div class="theme-title">
        <div class="icon-theme"></div>
        <span>主题列表</span>
      </div>
      <my-tree :model="model" @menuSearch="changeMenu"></my-tree>
      <no-data :toggle="themeRunStatus"></no-data>
    </div>
    <div class="right-list fn-right">
      <div class="infoHots">
        <div class="title clearfix">
          <span class="titleName fn-left">信息发布热区（月）</span>
        </div>
        <div class="mapChart">
          <div v-show="Array.isArray(tableData) && tableData.length" class="map-chart" id="mapChart"></div>
          <el-table v-show="Array.isArray(tableData) && tableData.length"
            :row-style="tableRowStyle"
            :header-row-style="tableHeaderRowColor"
            :cell-style="tableCellColor"
            :header-cell-style="tableHeaderColor"
            :data="tableData" height="265" border style="width: 122px"
          >
            <el-table-column label="区域" width="60">
              <template slot-scope="scope">{{scope.row.name ? scope.row.name : '--'}}</template>
            </el-table-column>
            <el-table-column label="数量" width="60">
              <template slot-scope="scope">{{scope.row.value ? scope.row.value : '--'}}</template>
            </el-table-column>
          </el-table>
          <no-data :toggle="runStatus.mapRunStatus"></no-data>
        </div>
      </div>
      <div class="emotion-risk-wrapper">
        <div class="emotion-digest">
          <div class="title">
            <span>情感属性（月）</span>
          </div>
          <div v-show="emotionState" class="emotionCharts" id="emotionCharts"></div>
          <no-data :toggle="runStatus.emotionRunStatus"></no-data>
        </div>
        <div class="risk-wrapper">
          <div class="title">
            <span>风险类别TOP6（月）</span>
          </div>
          <div v-show="riskState" class="riskWordCloudId" id="riskWordCloudId"></div>
          <no-data :toggle="runStatus.riskRunStatus"></no-data>
        </div>
      </div>
      <div class="weiBoWorld">
        <div class="title clearfix">
          <span class="titleName fn-left">微博热词（月）</span>
        </div>
        <div v-show="worldState" class="weiBoCharts" id="weiBoCharts"></div>
        <no-data :toggle="runStatus.weiBoRunStatus"></no-data>
      </div>
      <div class="emotion-risk-wrapper">
        <div class="emotion-digest">
          <div class="title">
            <span>博主分布（月）</span>
          </div>
          <div v-show="blogState" class="emotionCharts" id="bloCharts"></div>
          <no-data :toggle="runStatus.blogRunStatus"></no-data>
        </div>
        <div class="risk-wrapper">
          <div class="title">
            <span>活跃网民TOP10（月）</span>
          </div>
          <div v-show="netState" class="riskWordCloudId" id="netZenCharts"></div>
          <no-data :toggle="runStatus.netRunStatus"></no-data>
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
  import { provinceMap } from '../../common/js/uitls/mapDirection'

  export default {
    name: 'weiboAnalysis',
    components: {
      'no-data': noData,
      'my-tree': myTree
    },
    data() {
      return {
        taskId: '',
        tableData: [],
        emotionState: false,
        riskState: false,
        worldState: false,
        blogState: false,
        netState: false,
        model: {
          isShow: false,
          menuList: []
        },
        themeRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        runStatus: {
          mapRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          emotionRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          riskRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          weiBoRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          blogRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          netRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
        }
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
          this.getThemeList(this.taskId)
          this.$emit('resetAnalysisMenuIndex', 2)
        }
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    methods: {
      getThemeList: function (taskId) {
        let params = {}
        let self = this
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
            self.model.isShow = true
            self.themeRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
            self.weiBoRequest()
          } else {
            // this.themeList = [{ id: '', name: '暂未获取到主题', status: true }]
            this.themeRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
            self.model.menuList = [{name: '暂未获取到主题', value: [{id: '', name: ''}]}]
            self.model.isShow = true
            self.runStatus = {
              mapRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              emotionRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              weiBoRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              blogRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              netRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
            }
          }
        }, error => {
          if (error) {
            this.themeRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
            this.model.menuList = [{name: '暂未获取到主题', value: [{id: '', name: ''}]}]
            this.model.isShow = true
            this.runStatus = {
              mapRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              emotionRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              weiBoRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              blogRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              netRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
            }
          }
        })
      },
      changeMenu: function(list) {
        if (list.hasOwnProperty('id') && list.id) {
          this.taskId = list.id
          this.resetLoading()
          this.weiBoRequest()
        }
      },
      weiBoRequest() {
        let params = {}
        if (this.taskId) params['taskId'] = this.taskId
        let url = `${this.$store.state.url}anlysis/weiboAnalysis/info`
        this.$get(url, params).then(response => {
          if (response.code === 1) {
            let mapInfoList = response.body.mapInfoList
            let appraiseInfoList = response.body.appraiseInfoList
            let themeLabelInfoList = response.body.themeLabelInfoList
            let hotWordsInfoList = response.body.hotWordsInfoList
            let authorApproveInfoList = response.body.authorApproveInfoList
            let authorInfoList = response.body.authorInfoList
            this.mapInfoRequest(mapInfoList)
            this.emotionRequest(appraiseInfoList)
            this.riskRequest(themeLabelInfoList)
            this.weiBoKeyRequest(hotWordsInfoList)
            this.blogGerRequest(authorApproveInfoList)
            this.netZenRequest(authorInfoList)
          } else {
            this.runStatus = {
              mapRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              emotionRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              riskRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              weiBoRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              blogRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'},
              netRunStatus: {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
            }
          }
        }, error => {
          if (error) {
            this.runStatus = {
              mapRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''},
              emotionRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''},
              riskRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''},
              weiBoRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''},
              blogRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''},
              netRunStatus: {loading: false, noData: false, errorWork: true, tooltip: ''}
            }
          }
        })
      },
      /**
       * 信息发布热区Request
       */
      mapInfoRequest(mapInfoList) {
        if (Array.isArray(mapInfoList) && mapInfoList.length) {
          let self = this
          let mapInfoChart = this.$echarts.init(document.getElementById('mapChart'))
          mapInfoChart.clear()
          let data = []
          let pMap = provinceMap()
          for (let list in pMap) {
            let val = mapInfoList.filter(item => { return list === item.regionCode })
            data.push({
              name: pMap[list],
              value: val.length === 1 ? val[0].num : 0
            })
          }
          data.sort(function (a, b) {
            let x = parseInt(a['value'])
            let y = parseInt(b['value'])
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
          })
          let max = data.reverse()[0].value
          let options = charts.mapInfoHots(data, max)
          mapInfoChart.setOption(options)
          this.tableData = data.slice(0, 10)
          self.runStatus.mapRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.runStatus.mapRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      emotionRequest(appraiseInfoList) {
        if (Array.isArray(appraiseInfoList) && appraiseInfoList.length) {
          let emotionCharts = this.$echarts.init(document.getElementById('emotionCharts'))
          emotionCharts.clear()
          let data = []
          let legendArr = []
          appraiseInfoList.forEach(item => {
            data.push({name: item.key, value: item.value})
            legendArr.push(item.key)
          })
          this.emotionState = true
          let options = charts.emotionAnalysis(data, legendArr)
          emotionCharts.setOption(options)
          this.runStatus.emotionRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.emotionState = false
          this.runStatus.emotionRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      riskRequest(themeLabelInfoList) {
        if (Array.isArray(themeLabelInfoList) && themeLabelInfoList.length) {
          let riskCharts = this.$echarts.init(document.getElementById('riskWordCloudId'))
          riskCharts.clear()
          let data = []
          let legendArr = []
          themeLabelInfoList.sort(function (a, b) {
            let x = parseInt(a['value'])
            let y = parseInt(b['value'])
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
          })
          themeLabelInfoList.forEach(item => {
            data.push({name: item.key, value: item.value})
            legendArr.push(item.key)
          })
          data.reverse()
          legendArr.reverse()
          this.riskState = true
          let options = charts.riskAnalysis(data, legendArr)
          riskCharts.setOption(options)
          this.runStatus.riskRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.riskState = false
          this.runStatus.riskRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      weiBoKeyRequest(hotWordsInfoList) {
        if (Array.isArray(hotWordsInfoList) && hotWordsInfoList) {
          let worldCharts = this.$echarts.init(document.getElementById('weiBoCharts'))
          worldCharts.clear()
          let data = []
          hotWordsInfoList.forEach(item => {
            data.push({name: item.key, value: item.value})
          })
          this.worldState = true
          let options = charts.riskCharts(data)
          worldCharts.setOption(options, true)
          this.runStatus.weiBoRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.worldState = false
          this.runStatus.weiBoRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      blogGerRequest(authorApproveInfoList) {
        if (Array.isArray(authorApproveInfoList) && authorApproveInfoList.length) {
          let bloCharts = this.$echarts.init(document.getElementById('bloCharts'))
          bloCharts.clear()
          let data = []
          let legendArr = []
          authorApproveInfoList.forEach(item => {
            data.push({name: item.key, value: item.value})
            legendArr.push(item.key)
          })
          this.blogState = true
          let options = charts.blogAnalysis(data, legendArr)
          bloCharts.setOption(options)
          this.runStatus.blogRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.blogState = false
          this.runStatus.blogRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      netZenRequest(authorInfoList) {
        if (Array.isArray(authorInfoList) && authorInfoList.length) {
          let netZenCharts = this.$echarts.init(document.getElementById('netZenCharts'))
          netZenCharts.clear()
          let data = []
          let legendArr = []
          authorInfoList.forEach(item => {
            data.push({name: item.key, value: item.value})
            legendArr.push(item.key)
          })
          data.sort(function (a, b) {
            let x = parseInt(a['value'])
            let y = parseInt(b['value'])
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
          })
          this.netState = true
          let options = charts.netZenBarCharts(data, legendArr)
          netZenCharts.setOption(options)
          this.runStatus.netRunStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
        } else {
          this.netState = false
          this.runStatus.netRunStatus = {loading: false, noData: true, errorWork: false, tooltip: '暂无数据'}
        }
      },
      resetLoading: function() {
        this.tableData = []
        this.emotionState = false
        this.riskState = false
        this.worldState = false
        this.blogState = false
        this.netState = false
        this.runStatus = {
          themeRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          mapRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          emotionRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          riskRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          weiBoRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          blogRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
          netRunStatus: {loading: true, noData: false, errorWork: false, tooltip: ''}
        }
      },
      // 重置表格样式
      tableHeaderRowColor: function ({row, rowIndex}) {
        return 'background-color: #eeeeee; font-size: 12px;'
      },
      tableRowStyle: function ({row, rowIndex}) {
        return 'text-align:center;'
      },
      tableHeaderColor: function ({row, column, rowIndex, columnIndex}) {
        return 'font-size: 12px; padding: 0; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; background-color: transparent; color: #444; text-align: center;'
      },
      tableCellColor: function ({row, column, rowIndex, columnIndex}) {
        return 'font-size: 12px; padding: 0; border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align:center;'
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/common";
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .left-list {
      position: relative;
      width: 220px;
      height: 100%;
      min-height: 1641px;
      max-height: 1641px;
      overflow-y: auto;
      background-color: #ffffff;
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
        width: 100%;
        & ul {
          width: 100%;
          & li {
            width: 100%;
            height: 48px;
            display: block;
            line-height: 48px;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
          }
          & li:hover {
            background-color: #0068B7;
            color: #fff;
          }
          & li.active {
            background-color: #0068B7;
            color: #fff;
          }
        }
      }
    }
    .right-list {
      width: 970px;
      height: 100%;
      .infoHots {
        width: 970px;
        background: #fff;
        border: 2px solid #dcdcdc;
        margin-top: 10px;
        box-sizing: border-box;
      }
      .infoHots {
        height: 500px;
        margin-top: 0;
        .title {
          width: 99.5%;
          height: 32px;
          border-left: 5px solid #0068B7;
          margin-top: 8px;
          .titleName {
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            color: #333333;
            padding-left: 7px;
          }
        }
        .mapChart {
          position: relative;
          height: 453px;
          .map-chart {
            width: 966px;
            height: 453px;
          }
          & div.el-table {
            position: absolute;
            top: 110px;
            right: 60px;
          }
        }
      }
      .emotion-risk-wrapper {
        position: relative;
        margin-top: 30px;
        width: 100%;
        height: 311px;
        .flexRow(space-between, center);

        .emotion-digest {
          position: relative;
          box-sizing: border-box;
          width: 480px;
          height: 350px;
          border: 2px solid #DCDCDC;
          background: #ffffff;

          .title {
            .title();
          }

          .emotionCharts {
            width: 480px;
            height: 305px;
          }
        }

        .risk-wrapper {
          position: relative;
          box-sizing: border-box;
          width: 480px;
          height: 350px;
          border: 2px solid #DCDCDC;
          background: #ffffff;

          .title {
            .title();
          }

          .riskWordCloudId {
            width: 480px;
            height: 305px;
          }
        }
      }
      .weiBoWorld {
        position: relative;
        width: 970px;
        height: 408px;
        background: #fff;
        border: 2px solid #dcdcdc;
        margin-top: 30px;
        box-sizing: border-box;
        .title {
          width: 99.5%;
          height: 32px;
          border-left: 5px solid #0068B7;
          margin-top: 8px;
          .titleName {
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            color: #333333;
            padding-left: 7px;
          }
        }
        .weiBoCharts {
          width: 966px;
          height: 360px;
        }
      }
    }
  }
</style>
