<template>
  <div v-if="searchHighInfo.isShow" class="searchHigh">
    <div class="close">
      <span @click="closeHighClick"></span>
    </div>
    <div class="wrapper">
      <div class="title">
        <h2>高级搜索</h2>
      </div>
      <div class="content">
        <ul>
          <li class="list clearfix">
            <label class="fn-left result">搜索结果：</label>
            <div class="fn-right result-condition">
              <div class="clearfix">
                <span class="fn-left">包含以下全部关键词</span>
                <input v-model="superParams.allkey" type="text" placeholder="多个关键词之间用空格分隔">
              </div>
              <div class="clearfix">
                <span class="fn-left">包含以下任意一个关键词</span>
                <input type="text" v-model="superParams.arbitrarily" placeholder="多个关键词之间用空格分隔">
              </div>
              <div class="clearfix">
                <span class="fn-left">不包含以下关键词</span>
                <input type="text" v-model="superParams.nocontain" placeholder="多个关键词之间用空格分隔">
              </div>
            </div>
          </li>
          <li class="list clearfix">
            <label class="fn-left result">时间：</label>
            <div class="time clearfix">
              <span class="fn-left">限定要搜索的网页的时间</span>
              <div class="fn-left dateTimeToggle">
                <span class="toggle-name" @click="searchToolsClick('dateTime')">{{dateTimeValue.name}}</span>
                <ul v-if="searchToolsToggle === 'dateTime'" class="dateTime">
                  <li v-for="(item, index) in this.dateTimeArr" :key="index" @click="dateTimeClick(item)">{{item.name}}</li>
                  <li>
                    <span class="line"></span>
                    <span class="diy">自定义&nbsp;&nbsp;<font color="red">{{superSearchTimeInfo}}</font></span>
                    <div>
                      <span class="date">从<input type="date" v-model="superSearchTime.startTime">到<input type="date" v-model="superSearchTime.endTime"></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="list clearfix">
            <label class="fn-left result">站内搜索：</label>
            <div class="web clearfix">
              <span class="fn-left">限定要搜索指定的网站是</span>
              <input type="text" v-model="superParams.goalWeb" placeholder="例如：baidu">
            </div>
          </li>
        </ul>
      </div>
      <div class="search">
        <span @click="superSearch">高级搜索</span>
      </div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  export default {
    name: 'searchHigh',
    props: ['searchHighInfo'],
    data () {
      return {
        dateTimeValue: {name: '时间不限', value: ''},
        dateTimeArr: [
          {name: '时间不限', value: ''},
          {name: '一天以内', value: 1},
          {name: '一周以内', value: 7},
          {name: '一月以内', value: 30},
          {name: '一年以内', value: 365}
        ],
        searchToolsToggle: 'default',
        superSearchTimeInfo: '',
        superSearchTime: {
          startTime: '',
          endTime: ''
        },
        superParams: {
          allkey: '',
          arbitrarily: '',
          nocontain: '',
          publishDate: '',
          endTime: '',
          goalWeb: '',
          type: 'super'
        }
      }
    },
    methods: {
      dateTimeClick: function(item) {
        this.dateTimeValue = item
        this.searchToolsToggle = 'default'
      },
      closeHighClick: function () {
        this.$emit('closeHighSearchEmit', false)
      },
      searchToolsClick: function (type) {
        if (type === this.searchToolsToggle) {
          this.searchToolsToggle = 'default'
        } else {
          this.searchToolsToggle = type
        }
      },
      superSearch: function () {
        if (typeof this.dateTimeValue.value === 'number') {
          this.superParams.publishDate = this.dateTimeValue.value
          this.superParams.endTime = ''
        }
        if (typeof this.dateTimeValue.value === 'object') {
          this.superParams.publishDate = this.superSearchTime.startTime
          this.superParams.endTime = this.superSearchTime.endTime
        }
        this.$emit('closeHighSearchEmit', this.superParams)
        this.$bus.emit('syncSuperSearch', this.superParams)
        this.superParams = {allkey: '', arbitrarily: '', nocontain: '', publishDate: '', endTime: '', goalWeb: '', type: 'super'}
        this.dateTimeValue = {name: '时间不限', value: ''}
      }
    },
    watch: {
      superSearchTime: {
        handler(val) {
          if (val.startTime !== '' && val.endTime !== '') {
            if (val.startTime > val.endTime) {
              this.superSearchTimeInfo = '开始时间不可大于结束时间'
            } else {
              this.dateTimeValue = { name: `${val.startTime}至${val.endTime}`, value: {startTime: val.startTime + ' ' + '00:00:00', endTime: val.endTime + ' ' + '23:59:59'} }
              this.searchToolsToggle = 'default'
              this.superSearchTimeInfo = ''
            }
          } else {
            this.superSearchTimeInfo = ''
          }
        },
        deep: true,
        immediate: false
      }
    }
  }
</script>

<style scoped lang="less">
.searchHigh{
  position: absolute;
  width: 75vmin;
  height: 43vmin;
  top: 6.4vmin;
  right: 3vmin;
  text-align: left;
  overflow: auto;
  z-index: 1001;
  border: 0.1vmin solid #cccccc;
  background-color: #fff;
  .close{
    width: 100%;
    height: 4vmin;
    & span{
      position: absolute;
      right: 1vmin;
      top: 1vmin;
      display: block;
      width: 2.7vmin;
      height: 2.7vmin;
      background: url("../../../src/assets/search_close.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .wrapper{
    width: 71vmin;
    height: 36.6vmin;
    padding: 0 2vmin 2vmin 2vmin;
    .title{
      width: 100%;
      height: 4vmin;
      border-bottom: 0.2vmin solid #cccccc;
      & h2{
        font-size: 1.8vmin;
      }
    }
    .content{
      width: 90%;
      padding: 0 5%;
      .list {
        margin: 0.8vmin;
        .time{
          position: relative;
          vertical-align: middle;
          .dateTimeToggle{
            display: inline-block;
            .toggle-name{
              display: inline-block;
              width: 21vmin;
              height: 2.5vmin;
              line-height: 2.5vmin;
              border: 0.1vmin solid #666;
              padding: 0 2vmin 0 1vmin;
              box-sizing: border-box;
              font-size: 1.4vmin;
              background: url("../../assets/search/traingle.png") no-repeat 19vmin 1vmin;
            }
            .dateTime{
              position: absolute;
              top: 3vmin;
              width: 32vmin;
              height: 17.5vmin;
              border: 0.1vmin solid #666;
              box-shadow: 0 0.2vmin 0.4vmin rgba(0, 0, 0, .2);
              background-color: #fff;
              color: #757575;
              & li {
                font-size: 1.2vmin;
                padding: 0.3vmin 1vmin;
                height: 1.8vmin;
                line-height: 1.8vmin;
              }
              & li:hover{
                background-color: #eeeeee;
              }
              & li:last-child{
                .line{
                  display: block;
                  width: 100%;
                  height: 0.1vmin;
                  border-top: 0.1vmin solid #757575;
                  margin-top: -0.25vmin;
                }
                .diy{
                  width: 29vmin;
                  margin-top: 0.25vmin;
                }
                .date{
                  display: inline-block;
                  width: 100%;
                  height: 2.3vmin;
                  line-height: 2.3vmin;
                  margin-top: 0.5vmin;
                  & input{
                    width: 12vmin;
                    padding: 0;
                    margin: 0 0.6vmin;
                  }
                  & input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
                  & input[type="number"]{ -moz-appearance: textfield; }
                }
              }
            }
          }
        }
      }
      .result{
        width: 15%;
        padding-right: 2%;
        text-align: right;
        font-size: 1.6vmin;
        font-weight: 600;
      }
      .result-condition, .time, .web{
        width: 83%;
        & span{
          display: block;
          width: 20vmin;
          font-size: 1.4vmin;
        }
        & input{
          width: 21vmin;
          height: 2.5vmin;
          border: 0.1vmin solid #666;
          padding: 0.5vmin 1vmin;
          box-sizing: border-box;
          font-size: 1.4vmin;
          outline: none;
        }
      }
    }
    .search{
      width: 100%;
      margin-top: 4vmin;
      & span{
        margin: 0 auto;
        text-align: center;
        width: 8vmin;
        height: 3.5vmin;
        line-height: 3.5vmin;
        display: block;
        cursor: pointer;
        background-color: #00B7EE;
        color: #fff;
      }
    }
  }
}
</style>
