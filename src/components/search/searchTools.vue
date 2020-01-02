<template>
  <div class="searchTools">
    <div v-if="searchToolsIsShow" class="fruit-tools clearfix">
      <span class="fruit fn-left">中正搜索为你找到相关结果{{fruitInfo.total}}个&nbsp;&nbsp;&nbsp;&nbsp;用时：{{fruitInfo.dateTime}}秒</span>
      <span v-if="fruitInfo.dataType === 'b'" class="tools fn-right" @click="searchToggle(false)">搜索工具</span>
    </div>
    <div v-if="!searchToolsIsShow" class="search-tools clearfix">
      <div class="dateTimeTools fn-left">
        <span @click="searchToolsClick('dateTime')">{{dateTimeValue.name}}</span>
        <ul v-if="searchToolsToggle === 'dateTime'" class="dateTime">
          <li v-for="(item, index) in this.dateTimeArr" :key="index" @click="dateTimeClick(item)">{{item.name}}</li>
          <span class="custom"></span>
          <span>自定义&nbsp;&nbsp;<font color="red">{{toolsTimeInfo}}</font></span>
          <span><font color="#b6b6b6">从</font><input type="date" v-model="searchToolTime.startTime"><font color="#b6b6b6">到</font><input type="date" v-model="searchToolTime.endTime"></span>
        </ul>
      </div>
      <div class="webTools fn-left">
        <span @click="searchToolsClick('webInput')">
          {{webValue.name}}
          <i></i>
        </span>
        <div v-if="searchToolsToggle === 'webInput'" class="webInput clearfix">
          <input type="text" class="fn-left" v-model="webAddress">
          <span class="fn-left" @click="searchClick">查询</span>
        </div>
      </div>
      <div class="tools fn-right" @click="searchToggle(true)"><i></i>收起工具</div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  export default {
    name: 'searchTools',
    props: ['toolsInfo'],
    data() {
      return {
        dateTimeArr: [
          {name: '时间不限', value: ''},
          {name: '一天以内', value: 1},
          {name: '一周以内', value: 7},
          {name: '一月以内', value: 30},
          {name: '一年以内', value: 365}
        ],
        toolsTimeInfo: '',
        searchToolTime: {
          startTime: '',
          endTime: ''
        },
        fruitInfo: {
          total: 0,
          dateTime: 0,
          dataType: 'b'
        },
        webAddress: '',
        dateTimeValue: {name: '时间不限', value: ''},
        webValue: {name: '站点内检索', value: ''},
        searchToolsIsShow: true,
        searchToolsToggle: 'default'
      }
    },
    mounted() {
      this.$bus.on('syncSuperSearch', (obj) => {
        this.searchToolsIsShow = true
        if (obj.publishDate) this.dateTimeValue = {name: obj.publishDate, value: ''}
        if (obj.webValue) this.webValue = {name: obj.webValue, value: ''}
      })
    },
    beforeDestroy() {
      this.$bus.off('syncSuperSearch')
    },
    methods: {
      /**
       * 搜索工具 选择时间 一周
       * @param item
       */
      dateTimeClick: function(item) {
        this.toolsTimeInfo = ''
        this.searchToolTime = { startTime: '', endTime: '' }
        this.dateTimeValue = item
        this.searchToolsToggle = 'default'
        this.$emit('dateTimeEmit', this.dateTimeValue.value)
      },
      searchClick: function() {
        if (this.webAddress) {
          this.webValue = {name: this.webAddress, value: this.webAddress}
          this.webAddress = ''
          this.searchToolsToggle = 'default'
          this.$emit('webAddressEmit', this.webValue)
        }
      },
      searchToggle: function (bool) {
        this.dateTimeValue = {name: '时间不限', value: ''}
        this.webValue = {name: '站点内检索', value: ''}
        this.searchToolsToggle = 'default'
        this.searchToolsIsShow = bool
        if (bool) {
          this.$emit('resetSearchTools')
        }
      },
      searchToolsClick: function (type) {
        if (type === this.searchToolsToggle) {
          this.searchToolsToggle = 'default'
        } else {
          this.searchToolsToggle = type
        }
      }
    },
    watch: {
      searchToolTime: {
        handler(val) {
          if (val.startTime !== '' && val.endTime !== '') {
            if (val.startTime > val.endTime) {
              this.toolsTimeInfo = '开始时间不可大于结束时间'
            } else {
              // this.dateTimeValue = { name: `${val.startTime}至${val.endTime}`, value: {startTime: val.startTime + ' ' + '00:00:00', endTime: val.endTime + ' ' + '23:59:59'} }
              this.dateTimeValue = { name: `${val.startTime}至${val.endTime}`, value: {startTime: val.startTime, endTime: val.endTime} }
              this.searchToolsToggle = 'default'
              this.$emit('dateTimeEmit', this.dateTimeValue.value)
              this.toolsTimeInfo = ''
            }
          } else {
            this.toolsTimeInfo = ''
          }
        },
        deep: true,
        immediate: false
      },
      toolsInfo: {
        handler: function (val) {
          if (val.hasOwnProperty('total') && val.hasOwnProperty('time')) {
            if (val.total !== '' && val.time !== '') {
              this.fruitInfo = {
                total: val.total,
                dateTime: val.time,
                dataType: val.dataType
              }
            }
          }
          if (!val.toolsToggle) {
            if (val.hasOwnProperty('publishDate')) {
              let publishDate = val.publishDate.publishDate
              this.dateTimeArr.forEach(item => {
                if (item.value === publishDate) publishDate = item.name
              })
              this.searchToolsIsShow = val.toolsToggle
              if (val.publishDate) {
                if (val.publishDate.endTime) {
                  val.publishDate.name = val.publishDate.publishDate
                  // this.dateTimeValue = {name: val.publishDate.name, value: val.publishDate.publishDate}
                  // this.dateTimeValue = { name: `${val.publishDate.publishDate}至${val.publishDate.endTime}`, value: {startTime: val.publishDate.publishDate + ' ' + '00:00:00', endTime: val.publishDate.endTime + ' ' + '23:59:59'} }
                  this.dateTimeValue = { name: `${val.publishDate.publishDate}至${val.publishDate.endTime}`, value: {startTime: val.publishDate.publishDate, endTime: val.publishDate.endTime} }
                  // this.searchToolTime = {
                  //   startTime: this.dateTimeValue.value.startTime,
                  //   endTime: this.dateTimeValue.value.endTime
                  // }
                } else {
                  this.dateTimeArr.forEach(item => {
                    if (item.value === val.publishDate.publishDate) {
                      this.dateTimeValue = {name: item.name, value: item.value}
                    }
                  })
                }
              }
              if (val.webValue) this.webValue = {name: val.webValue, value: ''}
            }
          } else {
            this.searchToolsIsShow = val.toolsToggle
          }
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style scoped lang="less">
/*@media (min-width: 1420px) and (max-width: 1890px) {*/
  /*.searchTools {*/
    /*width: 690px !important;*/
  /*}*/
/*}*/
/*@media (min-width: 1320px) and (max-width: 1420px) {*/
  /*.searchTools {*/
    /*width: 720px !important;*/
  /*}*/
/*}*/
/*@media (max-width: 1320px) {*/
  /*.searchTools {*/
    /*width: 620px !important;*/
    /*!*max-width: 620px !important;*!*/
  /*}*/
/*}*/
.searchTools {
  width: 84.5vmin;
  margin: 13.5vmin 0 0 20.3vmin;
  font-size: 1.4vmin;
  color: #A5A4A4;
  .fruit-tools {
    width: 95.6%;
    height: 2.4vmin;
    line-height: 2.4vmin;
    & span.fruit {}
    & span.tools {
      cursor: pointer;
      padding-left: 1.8vmin;
      background: url("../../assets/search/tool.png") no-repeat left center;
    }
  }
  .search-tools {
    width: 95.6%;
    height: 2.4vmin;
    line-height: 2.4vmin;
    color: #333333;
    .dateTimeTools, .webTools {
      margin-right: 5vmin;
      cursor: pointer;
      padding-right: 1.1vmin;
      background: url("../../assets/search/traingle.png") no-repeat right 1.1vmin;
    }
    .dateTimeTools {
      position: relative;
      & ul.dateTime {
        position: absolute;
        top: 20px;
        width: 320px;
        height: auto;
        background: white;
        border: 1px solid #666666;
        z-index: 1000;
        & li {
          padding: 5px 10px;
          line-height: 20px;
        }
        & li:hover {
          background: #A5A4A4;
        }
        & span {
          display: block;
          padding: 5px 10px;
          line-height: 20px;
        }
        & span.custom {
          width: 290px;
          height: 1px;
          margin: 0 10px;
          padding: 0;
          border-top: 1px solid #b6b6b6;
        }
        & span:last-child {
          & input{
            width: 120px;
            padding: 0;
            margin: 0 6px;
            border: 1px solid;
          }
          & input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
          & input[type="number"]{ -moz-appearance: textfield; }
        }
      }
    }
    .webTools {
      position: relative;
      .webInput {
        position: absolute;
        top: 20px;
        width: 270px;
        height: 30px;
        line-height: 30px;
        background: white;
        border: 1px solid #666666;
        z-index: 1000;
        padding: 5px 10px;
        & input {
          width: 200px;
          height: 24px;
          line-height: 24px;
          padding: 2px 5px;
          border: 0.1vmin solid #cccccc;
          outline: none;
        }
        & span {
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          border: 1px solid #cccccc;
          padding: 2px 5px;
          & i {
            width: 6px;
            height: 5px;
            background: url("../../assets/search/traingle.png") no-repeat right center;
          }
        }
        & span:hover {
          border: 1px solid #830506;
        }
      }
    }
    .tools {
      padding-left: 10px;
      cursor: pointer;
      & i {
        width: 6px;
        height: 12px;
        display: block;
        float: left;
        margin-top: 8px;
        margin-right: 5px;
        transform: rotate(180deg);
        background: url("../../assets/search/traingle.png") no-repeat left center;
      }
    }
  }
}
</style>
