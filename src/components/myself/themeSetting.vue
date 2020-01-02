<template>
  <div class="wrapper-themeSetting">
    <div class="wrapper-title">
      <div class="title-wrapper clearfix">
        <div class="fn-left">
          <span>主题设置</span>
          <span v-if="settingThemeInfo.title">&nbsp;>&nbsp;{{settingThemeInfo.title}}</span>
        </div>
        <div class="fn-right">
          <span v-if="settingThemeInfo.title" @click="closeThemeForm('return')">返回</span>
        </div>
      </div>
    </div>
<!--    <div class="wrapper-content" :style="contentHeight">-->
    <div class="wrapper-content">
      <div class="add-wrapper">
        <el-button type="primary" icon="el-icon-plus" @click="toggleAdd()">添加</el-button>
      </div>
      <div class="search-wrapper">
        <el-row :gutter="10" type="flex" justify="space-between">
          <el-col>
             <el-select v-model="condition.currentThemeType" placeholder="请选择主题类型" @change="changeThemeTypeSelect()">
              <el-option
                v-for="item in themeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col>
            <div @keyup="toggleEnter($event, 'search')">
              <el-input type="text" placeholder="请输入主题名称" v-model="condition.searchKeys"></el-input>
            </div>
          </el-col>
          <el-col>
            <el-button type="primary" style="background: #0068b7; border: #0068b7;" icon="el-icon-search" @click="toggleSearch()"></el-button>
          </el-col>
          <el-col>
            <el-button @click="resetSearchKey()">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="theme-list-wrapper"
           v-if="!themeSettingStatus.loading && !themeSettingStatus.noData && !themeSettingStatus.errorWork">
        <el-table border :data="themeList"
                  :header-cell-style="listTableHeaderCellStyle"
                  :cell-style="listTableCellStyle">
          <el-table-column label="序号" width="62">
            <template slot-scope="scope">
              <div>{{pageInfo.currentPage === 1 ? scope.$index + 1 : scope.$index + 1 + (pageInfo.currentPage - 1) * 10 }}</div>
            </template>
          </el-table-column>
          <el-table-column label="主题名称" v-if="userInfo.region === 1">
            <template slot-scope="scope">
              <span :title="scope.row.name" style="color: #9F2925">{{ scope.row.name | sliceFilter(20) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主题名称" v-if="userInfo.region === 0">
            <template slot-scope="scope">
              <span :title="scope.row.name">{{ scope.row.name | sliceFilter(33) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="typeStr" label="主题类型" width="150"></el-table-column>
          <el-table-column label="关联账号" width="250" v-if="userInfo.region !== 0">
            <template slot-scope="scope">
              <div>
                <span :title="scope.row.account+':'+scope.row.userName" v-if="scope.row.account">{{ scope.row.account + '：' + scope.row.userName | sliceFilter(11) }}</span>
                <div class="icon-link" v-if="scope.row.account === null && scope.row.typeStr !== '特殊主题'"></div>
                <img width="100%" src="../../assets/myself/line.png" alt="" v-if="scope.row.typeStr === '特殊主题'">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="196">
            <template slot-scope="scope">
              <div :class="{ 'icon-edit': scope.row.custom === 1, 'icon-edit-disable': scope.row.custom === 0 }"
                   @click="toggleEdit(scope.row)" title="编辑"  v-if="scope.row.custom !== 0"></div>
              <div class="icon-preview" @click="togglePreview(scope.row)" title="预览" v-if="scope.row.custom === 0"></div>
              <div :class="{ 'icon-delete': scope.row.custom === 1, 'icon-delete-disable': scope.row.custom === 0 }"
                   @click="toggleDelete(scope.row)" title="删除"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper"
           v-if="!themeSettingStatus.loading && !themeSettingStatus.noData && !themeSettingStatus.errorWork">
        <span>第{{pageInfo.currentPage}}页，共{{pageInfo.totalPage}}页</span>
        <span @click="togglePage('previous')">上一页</span>
        <div>
          <input type="number" v-model="pageInfo.selectedPage" @keyup="toggleEnter($event, 'enterPage')">
        </div>
        <span @click="togglePage('next')">下一页</span>
      </div>
      <add-theme-from :settingThemeInfo="settingThemeInfo" :accountList="accountList" @closeThemeDialog="closeThemeForm"></add-theme-from>
      <message-box :messageBoxInfo="messageBoxInfo" @closeSignal="confirmMessageBox"></message-box>
      <noData :toggle="themeSettingStatus"></noData>
    </div>
  </div>
</template>

<script>
  // import {transEnterToSpace} from '../../common/js/common'
  import { Base64 } from 'js-base64'
  import {initFun, getLocalStorage} from '../../common/js/cookie'
  import addThemeFrom from './common/themeSettingPopup'
  import messageBox from './common/messageBox'
  import noData from '../component/vue-noData'

  export default {
    name: 'themeSetting',
    components: {messageBox, addThemeFrom, noData},
    data() {
      return {
        themeOptions: [],
        // contentHeight: `min-height: ${document.body.clientHeight - 194}px`,
        settingThemeInfo: {isShow: false, title: '', type: '', id: '', height: ''},
        messageBoxInfo: {isShow: false, title: '', content: '', height: ''},
        themeList: [],
        condition: {
          searchKeys: '',
          themeName: '',
          regionWords: '',
          industryWords: '',
          eventWords: '',
          specialWords: '',
          currentThemeType: 'all' // 主题 全部
        },
        status: {isShowSave: false, isShowTips: false},
        userInfo: {userId: '', taskId: '', region: ''},
        themeSettingStatus: {loading: true, noData: false, errorWork: false, tooltip: ''},
        pageInfo: {currentPage: 1, pageSize: 10, totalPage: 1, selectedPage: 1},
        accountList: []
      }
    },
    created() {
      if (initFun()) {
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
          this.userInfo.userId = JSON.parse(getLocalStorage('userInfo'))['userId']
        }
        if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
          this.userInfo.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
        }
        this.userInfo.region = JSON.parse(getLocalStorage('userInfo'))['region']
        if (this.userInfo.region === 1) {
          this.themeOptions = [{label: '全部', value: 'all'}, {label: '区域主题', value: 1}, {label: '单位主题', value: 3}, {label: '特殊主题', value: 2}]
        } else if (this.userInfo.region === 0) {
          this.themeOptions = [{label: '全部', value: 'all'}, {label: '单位主题', value: 3}, {label: '特殊主题', value: 2}]
        }
        JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])).menuList.forEach((item, index) => {
          if (item.name === '主题设置') {
            this.$emit('resetMenuIndex', index)
          }
        })
        this.init()
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    mounted() {
      this.$bus.on('contentHeightEmit', (height) => {
        this.contentHeight = `min-height: ${height}px`
      })
      this.$bus.on('confirmSaveTheme', (bool, path) => {
        if (bool) {
          this.closeThemeForm('return',path)
        }
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
        return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; background-color: #dcedfc; color: #2885dd; font-weight: 500; text-align: center; padding:0;'
      },
      /**
       * 数据列表 table表格 单元格样式覆盖
       */
      listTableCellStyle: function({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return 'color: #9F2925;height: 40px; font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; text-align:center; padding:0;'
        }
        return 'height: 40px; font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; text-align:center; padding:0;'
      },
      init() {
        this.getThemeList()
        this.accountQueryReq()
      },
      /**
       * 获取主题列表
       */
      async getThemeList() {
        try {
          this.themeSettingStatus = {loading: true, noData: false, errorWork: false, tooltip: ''}
          // let url = this.$store.state.url + 'theme/task/list'
          let url = 'http://10.253.254.28:15002/task/list'
          let params = {
            page: this.pageInfo.selectedPage,
            pageSize: this.pageInfo.pageSize,
            userId: this.userInfo.userId,
            name: this.condition.searchKeys,
            type: this.condition.currentThemeType
          }
          let response = await this.$get(url, params)
          if (response.status === 1) {
            this.themeList = response.data.data.length > 10 ? response.data.data.slice(0, 10) : response.data.data
            this.themeList.forEach(item => {
              if (typeof item.regionWords === 'string') item.regionWords = item.regionWords.replace(/\[|\]/g, '').replace(/\|/g, ' ')
              if (typeof item.industryWords === 'string') item.industryWords = item.industryWords.replace(/\[|\]/g, '').replace(/\|/g, ' ')
              if (typeof item.eventWords === 'string') item.eventWords = item.eventWords.replace(/\[|\]/g, '').replace(/\|/g, ' ')
              if (typeof item.excludeWords === 'string') item.excludeWords = item.excludeWords.replace(/\[|\]/g, '').replace(/\|/g, ' ')
              if (typeof item.specialWords === 'string') item.specialWords = item.specialWords.replace(/\[|\]/g, '').replace(/\|/g, ' ')
            })
            this.pageInfo.totalPage = Math.ceil(response.data.total / this.pageInfo.pageSize)
            this.pageInfo.currentPage = this.pageInfo.selectedPage
            this.themeSettingStatus = {loading: false, noData: false, errorWork: false, tooltip: ''}
          } else {
            this.pageInfo.selectedPage = this.pageInfo.currentPage
            this.themeSettingStatus = {loading: false, noData: true, errorWork: false, tooltip: response.message}
          }
        } catch (error) {
          this.themeSettingStatus = {loading: false, noData: false, errorWork: true, tooltip: error}
        }
      },
      /**
       * 获取可关联的账号列表
       */
      async accountQueryReq() {
        try {
          let url = this.$store.state.url + 'theme/user/queryData'
          let userId, taskId
          if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
            userId = JSON.parse(getLocalStorage('userInfo'))['userId']
          }
          if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['taskId']) {
            taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
          }
          let response = await this.$get(url, {userId: userId, taskId: taskId})
          if (response.status === 1) {
            this.accountList = response.data
          } else if (response.status === 0) {
            this.accountList = []
          }
        } catch (e) {
          this.$layer.msg(e)
        }
      },
      /**
       * 回车搜索、翻页
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
        this.getThemeList()
      },
      /**
       * 重置 搜索框 searchKeys
       */
      resetSearchKey() {
        this.condition.currentThemeType = 'all'
        this.condition.searchKeys = ''
        this.pageInfo.selectedPage = 1
        this.getThemeList()
      },
      /**
       * 更改主题类型
       */
      changeThemeTypeSelect() {
        this.pageInfo.selectedPage = 1
      },
      /**
       * 添加
       */
      toggleAdd() {
        if (this.userInfo.region === 1) {
          this.settingThemeInfo = {
            isShow: true,
            title: '添加主题',
            type: 'add',
            isShowAccount: true,
            id: '',
            data: '',
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 100%'} // 92% chrome
          }
        } else {
          this.settingThemeInfo = {
            isShow: true,
            title: '添加主题',
            type: 'add',
            isShowAccount: false,
            id: '',
            data: '',
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 77%'} // 55% chrome
          }
        }
        this.$store.commit('newThemeInit', true)
      },
      /**
       * 关闭 添加、编辑
       * @param type cancel 取消回调 save 保存回调
       * @param handleType add 添加 update 修改 preview 预览
       */
      closeThemeForm(handleType, path, submitType, bool) {
        if (this.settingThemeInfo.type !== 'preview' && !submitType && bool) { // 非预览状态下未保存离开页面的回调
          console.log('1111')
          this.messageBoxInfo = {
            isShow: true,
            title: '提示',
            btn: ['取消', '确定'],
            id: 1,
            type: 'cancel',
            handleType: handleType,
            content: `离开本页面将不会保存当前主题方案设置/修改，您确定要离开吗？`,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
          }
        } else if (this.settingThemeInfo.type !== 'preview' && handleType === 'return' && !submitType) {
          this.messageBoxInfo = {
            isShow: true,
            title: '提示',
            btn: ['取消', '确定'],
            id: 1,
            type: 'cancel',
            path: path,
            handleType: handleType,
            content: `离开本页面将不会保存当前主题方案设置/修改，您确定要离开吗？`,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
          }
        } else {
          console.log('333')
          this.getThemeList()
          this.settingThemeInfo = {isShow: false, isShowAccount: false, title: '', type: '', id: '', data: '', height: ''}
        }
      },
      /**
       * 编辑
       * @param list
       */
      toggleEdit(list) {
        if (list.custom) { // custom 0 系统预设 不允许编辑
          if (this.userInfo.region === 1) {
            this.settingThemeInfo = {
              isShow: true,
              title: '修改主题',
              type: 'update',
              isShowAccount: true,
              id: list.id,
              data: list,
              height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 100%'} // 74%chrome
            }
          } else {
            this.settingThemeInfo = {
              isShow: true,
              title: '修改主题',
              type: 'update',
              isShowAccount: false,
              id: list.id,
              data: list,
              height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 77%'} // 55% chrome
            }
          }
          this.$store.commit('newThemeInit', true)
        }
      },
      /**
       * 预览
       * @param list
       */
      togglePreview(list) {
        if (this.userInfo.region === 1) {
          this.settingThemeInfo = {
            isShow: true,
            title: '查看主题',
            type: 'preview',
            isShowAccount: true,
            id: '',
            data: list,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 77%'} // 67% chrome
          }
        } else {
          this.settingThemeInfo = {
            isShow: true,
            title: '查看主题',
            type: 'preview',
            isShowAccount: false,
            id: '',
            data: list,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 77%'} // 50% chrome
          }
        }
      },
      /**
       * 删除
       * @param list
       */
      toggleDelete(list) {
        if (this.userInfo.region === 1) {
          if (list.custom) { // custom 0 系统预设 不允许编辑
            this.messageBoxInfo = {
              isShow: true,
              title: '确认删除',
              btn: ['取消', '删除'],
              id: list.id,
              custom: list.custom,
              content: `确认要删除该主题（${list.name}）吗？`,
              // tooltip: '此操作将同时删除与该主题对应的账号哦！',
              height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
            }
          } else {
            this.$layer.msg('预设主题不能删除！')
          }
        } else {
          if (list.custom) { // custom 0 系统预设 不允许编辑
            this.messageBoxInfo = {
              isShow: true,
              title: '确认删除',
              btn: ['取消', '删除'],
              id: list.id,
              custom: list.custom,
              content: `确认要删除该主题（${list.name}）吗？`,
              tooltip: '',
              height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
            }
          } else {
            this.$layer.msg('预设主题不能删除！')
          }
        }
      },
      /**
       * 确认删除：确认关闭提示窗
       */
      async confirmMessageBox(obj) {
        if (obj.status) {
          if (obj.list.hasOwnProperty('path') && obj.list.hasOwnProperty('type') && obj.list.type === 'cancel') {
            this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
            this.$router.replace({
              path: obj.list.path
            })
          }
          if (obj.list.hasOwnProperty('type') && obj.list.type === 'cancel') {
            this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
            if (this.userInfo.region === 1) {
              this.settingThemeInfo = {isShow: false, isShowAccount: true, title: '', type: '', id: '', data: '', height: ''}
            } else {
              this.settingThemeInfo = {isShow: false, isShowAccount: false, title: '', type: '', id: '', data: '', height: ''}
            }
            this.accountQueryReq()
            if (obj.list.handleType === 'add') {
              this.pageInfo.selectedPage = 1
            }
            this.getThemeList()
            this.$store.commit('newThemeInit', false)
          } else {
            try {
              // let url = this.$store.state.url + 'theme/task/delete'
              let url = 'http://10.253.254.28:15002/task/delete'
              let params = {}
              if (obj.list.id) params.id = obj.list.id
              params.custom = obj.list.custom

              let response = await this.$post(url, params)
              if (response.status === 1) {
                this.pageInfo.selectedPage = 1
                this.getThemeList()
              }
              this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
              this.$layer.msg(response.message)
            } catch (error) {
              this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
              this.$layer.msg(error)
            }
          }
        } else {
          this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
        }
      },
      /**
       * 翻页
       * @param type 'previous' 上一页 'next' 下一页 'enter' 回车搜索
       */
      togglePage(type) {
        if (type === 'previous' && this.pageInfo.currentPage !== 1) {
          this.pageInfo.selectedPage = this.pageInfo.currentPage - 1
          this.getThemeList()
        }
        if (type === 'next' && this.pageInfo.selectedPage !== this.pageInfo.totalPage) {
          this.pageInfo.selectedPage = this.pageInfo.currentPage + 1
          this.getThemeList()
        }
        if (type === 'enter' && this.pageInfo.selectedPage <= this.pageInfo.totalPage && this.pageInfo.selectedPage > 0) {
          this.getThemeList()
        }
      }
    },
    watch: {
      condition: {
        handler: function (val) {
          if (val.searchKeys === '') {
            this.pageInfo.selectedPage = 1
            this.getThemeList()
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
        immediate: false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/common";

  .wrapper-themeSetting {
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
      min-height: 754px;

      .add-wrapper {
        // box-sizing: border-box;
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
        .el-select {
          width: 200px;
        }
        .el-input {
          width: 200px;
        }
      }

      .theme-list-wrapper {
        box-sizing: border-box;
        float: left;
        width: 100%;
        padding: 20px 20px 0 20px;
        .el-table {
          width: 100%;
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
            left: 57px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_edit.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .icon-edit-disable {
            position: absolute;
            top: 11px;
            left: 57px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_edit_disable.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .icon-preview {
            position: absolute;
            top: 12px;
            left: 57px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_preview.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .icon-delete {
            position: absolute;
            top: 11px;
            left: 124px;
            width: 18px;
            height: 18px;
            background: url("../../assets/myself/myself_delete.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .icon-delete-disable {
            position: absolute;
            top: 11px;
            left: 124px;
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
        .el-table /deep/ .cell {
          padding: 0;
          height: 40px;
          line-height: 40px;
          & img {
            height: 40px;
          }
        }
        .el-table /deep/ .th {
          padding: 0;
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
