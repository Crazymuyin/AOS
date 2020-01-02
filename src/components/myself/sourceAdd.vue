<template>
  <div class="wrapper-themeSetting">
    <div class="wrapper-title">
      <span>信源添加</span>
    </div>
    <div class="list-wrapper">
      <div class="head clearfix" v-if="tableStatus === true">
        <el-button class="fn-left" icon="el-icon-plus" @click="addSource">添加</el-button>
        <el-button plain class="reset fn-right" @click="resetSearch()">重置</el-button>
        <el-button class="fn-right" icon="el-icon-search" @click="toggleSearch()"></el-button>
        <el-input class="fn-right" v-model="sourceName" placeholder="请输入信源名称" @keyup.enter.native="toggleSearch()"></el-input>
      </div>
      <div class="table-wrapper" v-if="tableStatus === true">
        <el-table border :data="sourceList"
                  :header-cell-style="listTableHeaderCellStyle"
                  :cell-style="listTableCellStyle">
          <el-table-column label="序号" width="62">
            <template slot-scope="scope">
              <div>{{currentPage === 1 ? scope.$index + 1 : scope.$index + 1 + (currentPage - 1) * 11}}</div>
            </template>
          </el-table-column>
          <el-table-column label="信源名称" width="240">
            <template slot-scope="scope">
              <span :title="scope.row.sourceName">{{ scope.row.sourceName | sliceFilter(20) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="信源地址" width="300">
            <template slot-scope="scope">
              <span :title="scope.row.sourceUrl">{{ scope.row.sourceUrl | sliceFilter(33) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="信源状态" width="240">
            <template slot-scope="scope">
              <span>{{scope.row.sourceStatus === 0 ? '审核中' : scope.row.sourceStatus === 1 ? '审核通过（长期信源）' : scope.row.sourceStatus === 2 ? '审核通过（临时信源）' : '审核未通过'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="icon-preview" @click="toggleDetail(scope.row)"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper" v-if="tableStatus === true">
        <span>第{{currentPage}}页，共{{totalPage}}页</span>
        <span @click="togglePage('previous')">上一页</span>
        <div>
          <input type="number" v-model="selectPage" @keyup="togglePage($event)">
        </div>
        <span @click="togglePage('next')">下一页</span>
      </div>
      <source-add-page v-if="tableStatus === false"></source-add-page>
      <source-detail-page :model="detailModel"></source-detail-page>
      <source-add-popup v-if="popupShow" @closePopup="closePopup"></source-add-popup>
    </div>
  </div>
</template>

<script>
import sourceAddPage from './common/addSourcePage'
import sourceAddPopup from './common/addSourcePopup'
import sourceDetailPage from './common/sourceDetailPage'
import {getLocalStorage} from '../../common/js/cookie'
export default {
  name: 'sourceAdd',
  components: {
    sourceAddPage,
    sourceAddPopup,
    sourceDetailPage
  },
  data () {
    return {
      firstStatus: true,
      sourceName: '',
      selectPage: 1,
      currentPage: 1,
      pageSize: 11,
      totalPage: 1,
      sourceList: [],
      detailModel: {
        isShow: false
      },
      popupShow: false,
      tableStatus: ''
    }
  },
  created () {
    this.sourceListReq((state) => {
      let _this = this
      if (state) {
        _this.tableStatus = true
      } else {
        _this.tableStatus = false
      }
    })
  },
  methods: {
    /**
     * 数据列表 table表格 表头样式覆盖
     */
    listTableHeaderCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; background-color: #dcedfc; color: #2885dd; font-weight: 500; text-align: center;'
    },
    /**
     * 数据列表 table表格 单元格样式覆盖
     */
    listTableCellStyle: function({ row, column, rowIndex, columnIndex }) {
      return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; text-align:center;'
    },
    /**
     * 添加
     */
    addSource: function () {
      this.popupShow = true
    },
    /**
     * 关闭添加信源
     */
    closePopup: function () {
      this.popupShow = false
      this.sourceListReq()
    },
    /**
     * 搜索查询
     */
    toggleSearch: function () {
      this.selectPage = 1
      this.sourceListReq()
    },
    /**
     * 重置
     */
    resetSearch: function () {
      this.selectPage = 1
      this.sourceName = ''
      this.sourceListReq()
    },
    /**
     * 列表请求
     */
    sourceListReq: function (callBak) {
      let params = {}
      if (this.sourceName) params.sourceName = this.sourceName
      if (this.selectPage) params.pageNum = this.selectPage
      if (this.pageSize) params.pageSize = this.pageSize
      let uid = JSON.parse(getLocalStorage('userInfo'))['userId']
      params.userId = uid
      let url = `${this.$store.state.url}theme/sourceInfo/getSourceList`
      this.$get(url, params).then(res => {
        if (this.firstStatus) this.firstStatus = false
        if (res.status === 1) {
          this.sourceList = res.data
          let page = res.total % this.pageSize
          if (page === 0) {
            this.totalPage = res.total / this.pageSize
          } else {
            this.totalPage = parseInt(res.total / this.pageSize) + 1
          }
          this.currentPage = this.selectPage
          if (typeof callBak === 'function') callBak(true)
        } else {
          this.sourceList = []
          this.selectPage = this.currentPage
          if (typeof callBak === 'function') callBak(false)
        }
      }).catch(() => {
        if (typeof callBak === 'function') callBak(false)
      })
    },
    /**
     * 翻页
     * @param type 'previous' 上一页 'next' 下一页 'enter' 回车搜索
     */
    togglePage: function (type) {
      if (type === 'previous' && this.selectPage !== 1) {
        this.selectPage = this.currentPage - 1
        this.sourceListReq()
      }
      if (type === 'next' && this.selectPage !== this.totalPage) {
        this.selectPage = this.currentPage + 1
        this.sourceListReq()
      }
      if (type.keyCode === 13 && this.selectPage <= this.totalPage && this.selectPage > 0) {
        this.sourceListReq()
      }
    },
    /**
     * 查看详情
     */
    toggleDetail: function (list) {
      this.detailModel.isShow = true
      this.detailModel.data = list
    }
  },
  watch: {
    selectPage: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal < 0 || newVal > this.totalPage) {
            this.selectPage = this.currentPage
          }
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

.wrapper-themeSetting {
  width: 969px;
  .flexColumn(center, center);

  .wrapper-title {
    width: 100%;
    height: 48px;
    border: 1px solid #dcdcdc;
    background: #ffffff;
    .flexRow(flex-start, center);

    & span {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #333333;
      font-weight: 600;
      font-family: "Microsoft YaHei";
      padding-left: 10px;
      border-left: 5px solid #0068b7;
    }
  }
  .list-wrapper {
    position: relative;
    width: 100%;
    min-height: 754px;
    margin-top: 5px;
    border: 1px solid #dcdcdc;
    border-bottom: 0;
    background: #ffffff;
    .head {
      padding: 20px;
      .el-button:first-child, .el-button:nth-child(3) {
        background-color: #0068b7;
        border: 1px solid #0068b7;
        color: #fff;
      }
      .el-input {
        width: 200px;
      }
    }
    .table-wrapper {
      padding: 0 20px;
      .el-table {
        width: 100%;
        overflow-y: auto;
        .icon-preview {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          background: url("../../assets/myself/myself_preview.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
      /* 重置表格背景 */
      .el-table,
      .el-table__expanded-cell {
        background-color: transparent;
      }

      el-table th,
      .el-table tr {
        background-color: transparent;
      }

      .el-table--border,
      .el-table--group {
        border: 1px solid #666;
      }
    }
    .page-wrapper {
      position: relative;
      float: left;
      margin-left: 20px;
      width: 932px;
      height: 48px;
      line-height: 48px;
      font-size: 14px;

      span {
        float: left;
      }

      span:nth-child(2) {
        position: absolute;
        right: 126px;
        cursor: pointer;
      }

      div {
        position: absolute;
        top: 10px;
        right: 66px;
        width: 48px;
        height: 24px;
        line-height: 24px;
        border: 1px solid;
        text-align: center;

        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border: none;
          outline: medium;
        }

        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      }

      span:last-child {
        position: absolute;
        right: 10px;
        cursor: pointer;
      }

    }
  }
}
</style>
