<template>
  <div class="wrapper-accountAdd">
    <div class="wrapper-title">
      <div class="title-wrapper clearfix">
        <div class="fn-left">
          <span>账号管理</span>
          <span v-if="settingAccountInfo.title">&nbsp;>&nbsp;{{settingAccountInfo.title}}</span>
        </div>
        <div class="fn-right">
          <span v-if="settingAccountInfo.title" @click="closeThemeForm">返回</span>
        </div>
      </div>
    </div>
<!--    <div class="wrapper-content" :style="contentHeight">-->
    <div class="wrapper-content" style="height: 754px">
      <div class="add-wrapper">
        <el-button type="primary" icon="el-icon-plus" @click="toggleAdd()">添加</el-button>
      </div>
      <div class="search-wrapper">
        <el-row :gutter="10" type="flex" justify="space-between">
          <el-col>
            <div @keyup="toggleEnter($event, 'search')">
              <el-input type="text" placeholder="请输入账号名称或显示名称" v-model="condition.searchKeys"></el-input>
            </div>
          </el-col>
          <el-col>
            <el-button type="primary" style="background-color: #0068b7; border: #0068b7;" icon="el-icon-search" @click="toggleSearch()"></el-button>
          </el-col>
          <el-col>
            <el-button @click="resetSearchKey()">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="account-list-wrapper"
           v-if="!accountSettingStatus.loading && !accountSettingStatus.noData && !accountSettingStatus.errorWork">
        <el-table border :data="accountList"
                  :header-cell-style="listTableHeaderCellStyle"
                  :cell-style="listTableCellStyle">
          <el-table-column label="序号" width="62">
            <template slot-scope="scope">
              <div>{{pageInfo.currentPage === 1 ? scope.$index + 1 : scope.$index + 1 + (pageInfo.currentPage - 1) * 10}}</div>
            </template>
          </el-table-column>
          <el-table-column label="账号名称" width="168">
            <template slot-scope="scope">
              <span :title="scope.row.account">{{ scope.row.account | sliceFilter(8) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="显示名称" width="200">
            <template slot-scope="scope">
              <span :title="scope.row.username">{{ scope.row.username | sliceFilter(10) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联主题" width="258">
            <template slot-scope="scope">
              <span v-if="scope.row.name" :title="scope.row.name">{{ scope.row.name | sliceFilter(12) }}</span>
              <div class="icon-link" v-if="scope.row.name === null"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div :class="{ 'icon-edit': scope.row.pid !== 0, 'icon-edit-disable': scope.row.pid === 0 }"
                   @click="toggleEdit(scope.row)" title="编辑"></div>
              <div :class="{ 'icon-reset': scope.row.pid !== 0, 'icon-reset-disable': scope.row.pid === 0 }"
                   @click="toggleResetPassword(scope.row)" title="密码重置"></div>
              <div :class="{ 'icon-delete': scope.row.pid !== 0, 'icon-delete-disable': scope.row.pid === 0 }"
                   @click="toggleDelete(scope.row)" title="删除"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper"
           v-if="!accountSettingStatus.loading && !accountSettingStatus.noData && !accountSettingStatus.errorWork">
        <span>第{{pageInfo.currentPage}}页，共{{pageInfo.totalPage}}页</span>
        <span @click="togglePage('previous')">上一页</span>
        <div>
          <input type="number" v-model="pageInfo.selectedPage" @keyup="toggleEnter($event, 'enterPage')">
        </div>
        <span @click="togglePage('next')">下一页</span>
      </div>
      <add-account-form :settingAccountInfo="settingAccountInfo" @closeSignal="closeThemeForm">
      </add-account-form>
      <message-box :messageBoxInfo="messageBoxInfo" @closeSignal="confirmMessageBox"></message-box>
      <noData :toggle="accountSettingStatus"></noData>
    </div>
  </div>
</template>

<script>
  // import {transEnterToSpace} from '../../common/js/common'
  import {
    initFun,
    getLocalStorage
  } from '../../common/js/cookie'
  import addAccountForm from './common/accountSettingPopup'
  import messageBox from './common/messageBox'
  import noData from '../component/vue-noData'

  export default {
    name: 'accountAdd',
    components: {
      messageBox,
      addAccountForm,
      noData
    },
    data() {
      return {
        // contentHeight: `min-height: ${document.body.clientHeight - 194}px`,
        settingAccountInfo: {
          isShow: false,
          title: '',
          type: '',
          id: '',
          height: ''
        },
        messageBoxInfo: {
          isShow: false,
          title: '',
          content: '',
          height: ''
        },
        accountList: [],
        condition: {
          searchKeys: ''
        },
        status: {
          isShowSave: false,
          isShowTips: false
        },
        userInfo: {
          userId: ''
        },
        pageInfo: {
          currentPage: 1,
          pageSize: 10,
          totalPage: 1,
          selectedPage: 1
        },
        accountSettingStatus: {
          loading: true,
          noData: false,
          errorWork: false,
          tooltip: ''
        },
        themeList: []
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
          this.userInfo.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        this.init()
        this.$emit('resetMenuIndex', 1)
      } else {
        this.$router.replace({
          path: '/login',
          name: '登录'
        })
      }
    },
    mounted() {
      this.$bus.on('contentHeightEmit', (height) => {
        this.contentHeight = `min-height: ${height}px`
      })
    },
    beforeDestroy() {
      this.$bus.off('contentHeightEmit')
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
        if (columnIndex === 1) {
          return 'color: #9F2925;font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; text-align:center;'
        }
        return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; text-align:center;'
      },
      init() {
        this.getAccountList()
        this.themeQueryReq()
      },
      /**
       * 获取账号列表
       */
      async getAccountList() {
        try {
          this.accountSettingStatus = {
            loading: true,
            noData: false,
            errorWork: false,
            tooltip: ''
          }
          let url = this.$store.state.url + 'theme/user/list'
          let params = {
            userId: this.userInfo.userId,
            name: this.condition.searchKeys,
            page: this.pageInfo.selectedPage,
            pageSize: this.pageInfo.pageSize
          }
          let response = await this.$get(url, params)
          if (response.status === 1) {
            response = response.data
            this.accountList = response.data
            this.pageInfo.totalPage = Math.ceil(response.total / this.pageInfo.pageSize)
            this.pageInfo.currentPage = this.pageInfo.selectedPage
            this.accountSettingStatus = {
              loading: false,
              noData: false,
              errorWork: false,
              tooltip: ''
            }
          } else {
            this.pageInfo.selectedPage = this.pageInfo.currentPage
            this.accountSettingStatus = {
              loading: false,
              noData: true,
              errorWork: false,
              tooltip: response.message
            }
          }
        } catch (error) {
          this.accountSettingStatus = {
            loading: false,
            noData: false,
            errorWork: true,
            tooltip: error
          }
        }
      },
      /**
       * 获取未关联的主题列表
       */
      async themeQueryReq() {
        try {
          this.themeList = []
          let url = this.$store.state.url + 'theme/task/queryData'
          let taskId
          if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
            taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
          }
          let response = await this.$get(url, {
            taskId: taskId
          })
          if (response.status === 1) {
            this.themeList = response.data
          } else {
            this.themeList = []
          }
        } catch (e) {
          this.themeList = []
          this.$layer.msg(e)
        }
      },
      /**
       * 回车 搜索、翻页
       * @param event 键盘点击事件 type search 查询 enterPage 回车翻页
       */
      toggleEnter(event, type) {
        if (event.keyCode === 13) {
          if (type === 'search') {
            this.toggleSearch()
          }
          if (type === 'enterPage') {
            this.togglePage('enter')
          }
        }
      },
      /**
       * 搜索
       */
      toggleSearch() {
        this.pageInfo.selectedPage = 1
        this.getAccountList()
      },
      /**
       * 重置搜索框
       */
      resetSearchKey() {
        this.condition.searchKeys = ''
      },
      /**
       * 添加
       */
      toggleAdd() {
        this.settingAccountInfo = {
          isShow: true,
          title: '添加账号',
          type: 'add',
          id: '',
          data: '',
          themeList: this.themeList,
          height: {
            wrap: `min-height: ${document.body.clientHeight - 194}px`,
            content: 'height: 75%'
          }
        }
      },
      /**
       * 关闭添加、编辑窗口的回调
       */
      closeThemeForm(type, handleType) {
        this.settingAccountInfo = {
          isShow: false,
          title: '',
          type: '',
          id: '',
          data: '',
          themeList: [],
          height: ''
        }
        if (type === 'save') { // save 保存回调 calcel 取消
          this.themeQueryReq()
        }
        if (handleType === 'add') {
          this.pageInfo.selectedPage = 1
        }
        this.getAccountList()
      },
      /**
       * 编辑
       * @param list
       */
      toggleEdit(list) {
        if (list.pid !== 0) {
          let themeList = []
          this.themeList.forEach(item => {
            themeList.push(item)
          })
          if (list.taskId !== null && list.taskId !== '' && list.name !== null && list.name !== '') {
            themeList.unshift({id: list.taskId, name: list.name})
          }
          this.settingAccountInfo = {
            isShow: true,
            title: '编辑账号',
            type: 'update',
            id: list.id,
            data: list,
            themeList: themeList,
            height: {
              wrap: `min-height: ${document.body.clientHeight - 194}px`,
              content: 'height: 70%'
            }
          }
        } else {
          this.$layer.msg('预设账号不可操作！')
        }
      },
      /**
       * 重置密码
       * @param list
       */
      toggleResetPassword(list) {
        if (list.pid !== 0) {
          this.messageBoxInfo = {
            isShow: true,
            title: '重置密码',
            btn: ['取消', '确认'],
            id: list.id,
            account: list.account,
            content: `确认要重置该账号${list.account}:${list.username}的密码为123456吗？`,
            height: {
              wrap: `min-height: ${document.body.clientHeight - 194}px`,
              content: 'height: 30%'
            }
          }
        } else {
          this.$layer.msg('预设账号不可操作！')
        }
      },
      /**
       * 删除
       * @param list
       */
      toggleDelete(list) {
        if (list.pid !== 0) { // pid 0 不可删除
          this.messageBoxInfo = {
            isShow: true,
            title: '确认删除',
            btn: ['取消', '删除'],
            id: list.id,
            content: `确认要删除该账号${list.account}:${list.username}吗？`,
            height: {
              wrap: `min-height: ${document.body.clientHeight - 194}px`,
              content: 'height: 30%'
            }
          }
        } else {
          this.$layer.msg('预设账号不可操作！')
        }
      },
      /**
       * 确认删除
       */
      async confirmMessageBox(obj) {
        if (obj.status) {
          if (obj.list.title === '确认删除') {
            try {
              let url = this.$store.state.url + 'theme/user/delete'
              let params = {
                id: obj.list.id
              }
              let response = await this.$post(url, params)
              if (response.status === 1) {
                this.pageInfo.selectedPage = 1
                this.getAccountList()
                this.$layer.msg('账号删除成功！')
              } else {
                this.$layer.msg(response.message)
              }
              this.messageBoxInfo = {
                isShow: false,
                title: '',
                id: '',
                content: '',
                height: ''
              }
            } catch (error) {
              this.$layer.msg(error)
              this.messageBoxInfo = {
                isShow: false,
                title: '',
                id: '',
                content: '',
                height: ''
              }
            }
          } else if (obj.list.title === '重置密码') {
            try {
              let url = this.$store.state.url + 'theme/user/resetPwd'
              let params = {
                id: obj.list.id,
                account: obj.list.account
              }
              let response = await this.$post(url, params)
              if (response.status === 1) {
                this.pageInfo.selectedPage = 1
                this.getAccountList()
                this.messageBoxInfo = {
                  isShow: true,
                  title: '密码重置',
                  id: -1,
                  content: response.message,
                  height: {
                    wrap: `min-height: ${document.body.clientHeight - 194}px`,
                    content: 'height: 20%'
                  }
                }
              } else {
                this.messageBoxInfo = {
                  isShow: true,
                  title: '密码重置',
                  id: -1,
                  content: response.message,
                  height: {
                    wrap: `min-height: ${document.body.clientHeight - 194}px`,
                    content: 'height: 20%'
                  }
                }
              }
            } catch (error) {
              this.$layer.msg(error)
              this.messageBoxInfo = {
                isShow: false,
                title: '',
                id: '',
                content: '',
                height: ''
              }
            }
          }
        } else {
          this.messageBoxInfo = {
            isShow: false,
            title: '',
            id: '',
            content: '',
            height: ''
          }
        }
      },
      /**
       * 翻页
       * @param type 'previous' 上一页 'next' 下一页 'enter' 回车搜索
       */
      togglePage(type) {
        if (type === 'previous' && this.pageInfo.currentPage !== 1) {
          this.pageInfo.selectedPage = this.pageInfo.currentPage - 1
          this.getAccountList()
        }
        if (type === 'next' && this.pageInfo.selectedPage !== this.pageInfo.totalPage) {
          this.pageInfo.selectedPage = this.pageInfo.currentPage + 1
          this.getAccountList()
        }
        if (type === 'enter' && this.pageInfo.selectedPage <= this.pageInfo.totalPage && this.pageInfo.selectedPage >
          0) {
          this.getAccountList()
        }
      }
    },
    watch: {
      condition: {
        handler: function (val) {
          if (val.searchKeys === '') {
            this.pageInfo.selectedPage = 1
            this.init()
          }
        },
        deep: true
      },
      pageInfo: {
        handler: function (val) {
          if (val.selectedPage < 0 || val.selectedPage > this.pageInfo.totalPage) {
            this.pageInfo.selectedPage = this.pageInfo.currentPage
          }
        },
        deep: true,
        immediate: true
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../common/less/common";

  .wrapper-accountAdd {
    position: relative;
    width: 970px;
    .flexColumn(center, center);

    .wrapper-title {
      width: 968px;
      height: 48px;
      border: 1px solid #dcdcdc;
      background: #ffffff;
      .flexRow(flex-start, center);
      .title-wrapper {
        width: 100%;
        & div:first-child {
          width: 300px;
          & span {
            height: 32px;
            line-height: 32px;
            font-size: 18px;
            color: #333333;
            font-family: "Microsoft YaHei";
          }
          & span:first-child {
            padding-left: 10px;
            border-left: 5px solid #0068b7;
            font-weight: 600;
          }
        }
        & div:last-child {
          width: 300px;
          text-align: right;
          padding-right: 20px;
          & span {
            display: inline-block;
            width: 52px;
            background: url("../../assets/myself/arrow-left.png") no-repeat 0 3px;
            background-size: 7px 13px;
            font-size: 18px;
            color: #808080;
            margin-top: 8px;
            cursor: pointer;
          }
        }
      }
    }

    .wrapper-content {
      position: relative;
      width: 968px;
      margin-top: 5px;
      border: 1px solid #dcdcdc;
      border-bottom: 0;
      background: #ffffff;

      .add-wrapper {
        float: left;
        margin-top: 23px;
        margin-left: 20px;
        .el-button {
          background-color: #0068b7;
          border: #0068b7;
        }
      }

      .search-wrapper {
        float: right;
        margin-top: 23px;
        margin-right: 16px;
        .el-input {
          width: 200px;
        }
      }
      /deep/ .el-button--small, .el-button--small.is-round {
        height: 32px;
      }

      .account-list-wrapper {
        float: left;
        margin-top: 23px;
        margin-left: 20px;
        width: 932px;
        .el-table {
          width: 100%;
          overflow-y: auto;
          .icon-link {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_link.png") no-repeat;
            background-size: 100% 100%;
          }
          .icon-edit {
            position: absolute;
            top: 11px;
            left: 54px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_edit.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }

          .icon-edit-disable {
            position: absolute;
            top: 11px;
            left: 54px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_edit_disable.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }

          .icon-reset {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_account_reset.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }

          .icon-reset-disable {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/dis_reset.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }

          .icon-delete {
            position: absolute;
            top: 11px;
            left: 170px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_delete.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }

          .icon-delete-disable {
            position: absolute;
            top: 11px;
            left: 170px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_delete_disable.png") no-repeat;
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
