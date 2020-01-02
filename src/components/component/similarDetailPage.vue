<template>
  <div class="detail-page" v-if="similar.isShow">
    <div class="wrapper">
      <div class="similar">
        <div>
          <span class="title">相似文章: </span>
        </div>
        <div v-if="tipShow" style="color: red;">{{tipText}}</div>
        <ul class="link">
          <li v-for="(item, i) of similarList" :key="i">
            <div>
              <div class="detail">
                <span>【<a style="color: red">{{item.sourceName}}</a>】</span>
                <span><a target="_blank" :href="item.url">{{item.title | sliceFilter(55)}}</a></span>
                <span>{{item.publishDate}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="page">
        <v-pagination :display="pageInfo.display" :total="pageInfo.total" :current-page='pageInfo.currentPage' :page-group="pageInfo.pageGroup" @pageChange="pageChange"></v-pagination>
      </div>
      <div class="close" @click="closeDetail"></div>
    </div>
  </div>
</template>

<script>
import page from '../../components/component/pagination'
import {getLocalStorage} from '../../common/js/cookie'
export default {
  name: 'similarDetailPage',
  data() {
    return {
      pageInfo: { total: 20, display: 20, currentPage: 1, pageGroup: 20 },
      initParams: {
        id: '',
        taskId: ''
      },
      tipShow: false,
      tipText: '数据加载中,请稍后...',
      similarList: []
    }
  },
  components: {
    'v-pagination': page
  },
  props: {
    similar: Object
  },
  created() {
    this.initParams.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
  },
  methods: {
    init () {
      this.tipShow = true
      this.tipText = '数据加载中,请稍后...'
      this.similarList = []
      let params = {}
      if (this.initParams.id) params.id = this.initParams.id
      if (this.initParams.taskId) params.taskId = this.initParams.taskId
      if (this.pageInfo.currentPage) params.pageNum = this.pageInfo.currentPage
      if (this.pageInfo.display) params.pageSize = this.pageInfo.display
      let url = `${this.$store.state.url}search/publicSentiment/getsimilarDataList`
      this.$post(url, params).then(res => {
        if (res.status === 1) {
          this.similarList = res.data.pojo
          this.pageInfo.total = res.data.total
          this.tipText = ''
          this.tipShow = false
        } else {
          this.tipText = '获取数据失败!'
          this.$layer.msg(res.message)
        }
      }).catch(error => {
        this.tipText = '获取数据失败!'
        this.$layer.msg(error)
      })
    },
    warningInit () {
      this.tipShow = true
      this.tipText = '数据加载中,请稍后...'
      this.similarList = []
      let params = {}
      if (this.initParams.id) params.id = this.initParams.id
      if (this.initParams.taskId) params.taskId = this.initParams.taskId
      if (this.pageInfo.currentPage) params.pageNum = this.pageInfo.currentPage
      if (this.pageInfo.display) params.pageSize = this.pageInfo.display
      let url = `${this.$store.state.url}warns/warn/getsimilarDataList`
      this.$post(url, params).then(res => {
        if (res.status === 1) {
          this.similarList = res.data.similarWarnData
          this.pageInfo.total = res.data.total
          this.tipText = ''
          this.tipShow = false
        } else {
          this.tipText = '获取数据失败!'
          this.$layer.msg(res.message)
        }
      }).catch(error => {
        this.tipText = '获取数据失败!'
        this.$layer.msg(error)
      })
    },
    closeDetail: function () {
      this.pageInfo.currentPage = 1
      this.similarList = []
      this.$emit('closeDetail')
    },
    pageChange: function (currentPage) {
      this.pageInfo.currentPage = currentPage
      this.init()
    }
  },
  watch: {
    similar: {
      handler: function (val) {
        console.log(val)
        if (val.id) {
          this.initParams.id = val.id
          if (val.type === 'warning') {
            this.warningInit()
          } else {
            this.init()
          }
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
.detail-page {
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 73px;
  width: 100%;
  height: 93%;
  background: #fff;
  z-index: 100;
  overflow-y: auto;

  .wrapper {
    position: relative;
    width: 1136px;
    height: 100%;
    margin: 0 auto;

    .similar {
      margin-top: 55px;
      .title {
        height: 48px;
        font-size: 16px;
        line-height: 48px;
        font-weight: 600;
      }

      & ul {
        font-size: 14px;
        padding-bottom: 50px;

        & li {
          & div {
            & span {
              display: inline-block;
              font-size: 28px;
              vertical-align: middle;
            }

            & div {
              display: inline-block;
              color: #000;

              & span {
                font-size: 14px;
                line-height: 28px;

                & a {
                  text-decoration: none;
                }
              }

              & span:last-child {
                margin-left: 10px;
                font-size: 12px;
                color: #666666;
              }
            }
          }
        }
      }
    }
    .page {
      margin-top: 50px
    }
    .close {
      position: absolute;
      top: -35px;
      right: -25px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      background: url("../../../src/assets/detail/img_Details_img.png") no-repeat 0 0;
    }
  }
}
</style>
