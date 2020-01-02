<template>
  <div v-if="settingThemeInfo.isShow" class="themeSettingPopup" :style="settingThemeInfo.height.wrap">
    <div class="popupBox">
      <div class="title">
        <div class="contentTitle">
          基本信息
        </div>
      </div>
      <div class="formGroup" v-loading="loading.status" :element-loading-text="loading.tooltip">
        <el-form :model="themeForm" :rules="themeRules" :validate-on-rule-change="false" ref="themeForm" label-position="right" label-width="106px" class="demo-themeForm">
          <el-form-item label="主题名称：" prop="themeName">
            <el-col :span="widthArr.inputWidth">
              <el-input v-model="themeForm.themeName" placeholder="请输入主题名称" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="主题类型：" prop="type" v-if="settingThemeInfo.type === 'preview'">
            <el-col :span="widthArr.inputWidth">
              <span>{{themeForm.type === 1 ? '区域主题' : themeForm.type === 3 ? '单位主题' : '特殊主题'}}</span>
            </el-col>
          </el-form-item>
          <el-form-item label="主题类型：" prop="type" v-if="settingThemeInfo.type !== 'preview'">
            <el-col :span="widthArr.inputWidth">
              <el-radio-group v-model="themeForm.type" @change="changeThemeType()">
                <el-radio :label="1" v-if="region === 1">区域主题</el-radio>
                <el-radio :label="3">单位主题</el-radio>
                <el-radio :label="2">特殊主题（重点网站）</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <div class="title" v-if="themeForm.type !== 2">
            <div class="contentTitle">
              主题方案
            </div>
          </div>
          <el-form-item label="区域关键词：" v-if="region === 1 && themeForm.type === 1" prop="areaKey">
            <el-col :span="widthArr.inputWidth">
              <el-input type="textarea" :rows="3" v-model="themeForm.areaKey" placeholder="请输入您所在地区的地域词，包含地域简称，多个关键词用空格分隔开。" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
            <el-col :span="widthArr.line">&nbsp;</el-col>
            <el-col class="description" :span="widthArr.desc" title="输入用户所在地区的地域词，包含地域简称，多个关键词用空格分隔开。如：北京市 海淀区 朝阳区"></el-col>
          </el-form-item>
          <el-form-item label="行业/单位关键词：" v-if="region === 1 && themeForm.type === 1" prop="industryKey">
            <el-col :span="widthArr.inputWidth">
              <el-input type="textarea" :rows="3" v-model="themeForm.industryKey" placeholder="请输入您关注的行业/单位词，包括机构名、职务等，多个关键词用空格分隔开。" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
            <el-col :span="widthArr.line">&nbsp;</el-col>
            <el-col class="description" :span="widthArr.desc" title="输入用户所关注的行业/单位词，包括机构名、职务等，多个关键词用空格分隔开。如：行业词：教育 学校 老师 校长 单位词：北京大学 四川大学"></el-col>
          </el-form-item>
          <el-form-item label="单位关键词：" v-if="themeForm.type === 3" prop="industryKey">
            <el-col :span="widthArr.inputWidth">
              <el-input type="textarea" :rows="3" v-model="themeForm.industryKey" placeholder="请输入您关注的单位词，包括机构名、职务等，多个关键词用空格分隔开。" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
            <el-col :span="widthArr.line">&nbsp;</el-col>
            <el-col class="description" :span="widthArr.desc" title="输入用户所关注的单位词，包括机构名、职务等，多个关键词用空格分隔开。如：单位词：北京大学 四川大学"></el-col>
          </el-form-item>
          <el-form-item label="事件关键词：" v-if="themeForm.type !== 2">
            <el-col :span="widthArr.inputWidth">
              <el-input type="textarea" :rows="3" v-model="themeForm.eventKey" placeholder="请输入您关注行业中发生的事件词，多个关键词用空格分隔开。" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
            <el-col :span="widthArr.line">&nbsp;</el-col>
            <el-col class="description" :span="widthArr.desc" title="输入用户所关注行业中发生的事件词，多个关键词用空格分隔开。如：打架 体罚 贪污"></el-col>
          </el-form-item>
          <el-form-item label="排除词：" v-if="themeForm.type !== 2">
            <el-col :span="widthArr.inputWidth">
              <el-input type="textarea" :rows="3" v-model="themeForm.removeKey" placeholder="请输入与关键词相歧义的词，排除歧义词相关信息，多个关键词用空格分隔开。" :disabled="settingThemeInfo.type === 'preview'"></el-input>
            </el-col>
            <el-col :span="widthArr.line">&nbsp;</el-col>
            <el-col class="description" :span="widthArr.desc" title="输入与关键词相歧义的词，排除歧义词相关信息，多个关键词用空格分隔开。如：地域词为邯郸，歧义词为邯郸学步。"></el-col>
          </el-form-item>
          <el-form-item class="account" label="账号关联：" v-if="settingThemeInfo.isShowAccount && themeForm.type !== 2">
            <el-col :span="widthArr.inputWidth">
              <el-select v-model="themeForm.accountValue" v-if="Array.isArray(themeForm.accountList) && themeForm.accountList.length" placeholder="请选择您希望关联的账号" :disabled="settingThemeInfo.type === 'preview'">
                <el-option
                  v-for="item in themeForm.accountList"
                  :key="item.account + ':' + item.username"
                  :label="item.account + ':' + item.username"
                  :value="item.account + ':' + item.username">
                </el-option>
              </el-select>
              <span v-if="Array.isArray(themeForm.accountList) && themeForm.accountList.length === 0">暂无可关联账号，请先去账号管理新建账号！</span>
            </el-col>
          </el-form-item>
          <div class="title" v-if="themeForm.type === 2">
            <div class="contentTitle">
              信源方案
              <i class="tip" title="用户可对一个主题配置多个网站地址；主题监测信息包括：网站地址1+网站地址2+...的全部监测数据。"></i>
            </div>
          </div>
          <el-table border :data="themeForm.sourceList"
                    :header-cell-style="listTableHeaderCellStyle"
                    :cell-style="listTableCellStyle"
                    v-if="themeForm.type === 2">
            <el-table-column label="序号" width="68">
              <template slot-scope="scope">
                <div>{{scope.$index + 1}}</div>
              </template>
            </el-table-column>
            <el-table-column label="网站地址(URL)" width="268" :rules="specialThemeRules.sourceList" :render-header="renderHeaderUrl">
              <template slot-scope="scope">
                <el-input type="text" :class="{'editState': !scope.row.isEditUrl}" v-model="scope.row.url"
                          placeholder="请输入网站地址，以http或https开头"
                          @focus="getFocus(scope.row, 'url')"
                          @blur="changeSourceList(scope.row, 'url')"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="关键词" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}"  :class="{'editState': !scope.row.isEditKey}" v-model="scope.row.keyWords"
                          placeholder="请输入关键词，用空格隔开，组合关键词需要用加号连接"
                          @blur="changeSourceList(scope.row, 'keywords')"
                          @focus="getFocus(scope.row, 'keywords')"
                          @change="checkInput(scope.row)" @input="checkKeyWords(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <div :class="!scope.row.isEditUrl && !scope.row.isEditKey ? 'icon-edit': 'icon-edit-disable'"
                     @click="toggleEdit(scope.row)" title="编辑"></div>
                <div :class="scope.$index === 0 && scope.row.url === '' && scope.row.keyWords == '' ? 'icon-delete-disable' : 'icon-delete'"
                     @click="toggleDelete(scope.row, scope.$index)" title="删除"></div>
              </template>
            </el-table-column>
          </el-table>
          <span class="add-source" @click="addSource" v-if="themeForm.type === 2 && addShow && themeForm.sourceList.length < 10">添加网站地址</span>
          <div v-if="themeForm.type === 1" class="tooltip">
            <p>关键词设置说明：用户您好，关键词的设置关系到信息的完整性及准确性，为了方便您更好的使用系统功能，我们将最优的关键词设置形式整理出来供您参考：</p>
            <p>1、区域+行业+事件：这样设置能够更准确的获取到区域内行业相关的事件信息。例：北京市+中学+打架</p>
            <p>2、区域+单位+事件：这样设置能够更准确的获取到区域单位相关的事件信息。例：成都+成都七中+食品</p>
            <p>3、区域+行业：这样设置能够更准确的获取到区域内行业相关的信息。例：北京市+学校</p>
          </div>
          <div v-if="themeForm.type === 3" class="tooltip">
            <p>关键词设置说明：用户您好，关键词的设置关系到信息的完整性及准确性，为了方便您更好的使用系统功能，我们将最优的关键词设置形式整理出来供您参考：</p>
            <p>1、单位：这样设置能够更全面、准确的获取到单位相关的信息。例：北京大学</p>
            <p>2、单位+事件：这样设置能够更准确的获取到单位相关的事件信息。例：北京大学+学术造假</p>
          </div>
<!--          <div v-if="settingThemeInfo.type !== 'preview' && themeForm.type === 2" class="tooltip">-->
          <div v-if="themeForm.type === 2" class="tooltip">
            <p>关键词设置方式：输入您所关注的关键词，用空格隔开，组合关键词需要加号连接，如：北京 北京+学校；不输入关键词则默认显示对应网站地址全部数据。</p>
            <p>注：每个特殊主题最多支持添加10个网站地址，每个网站地址最多支持配置10个关键词。</p>
          </div>
          <el-form-item v-if="settingThemeInfo.type !== 'preview'">
            <el-button @click="cancelClick()">取消</el-button>
            <el-button type="primary" @click="submitForm('themeForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <message-box :messageBoxInfo="messageBoxInfo" @closeSignal="confirmMessageBox"></message-box>
  </div>
</template>

<script type="application/ecmascript">
  import {getLocalStorage} from '../../../common/js/cookie'
  import messageBox from './messageBox'

  export default {
    name: 'themeSettingPopup',
    props: {
      settingThemeInfo: Object,
      accountList: Array
    },
    components: {
      messageBox
    },
    data () {
      return {
        messageBoxInfo: {isShow: false, title: '', content: '', height: ''},
        loading: {status: false, tooltip: ''},
        widthArr: {inputWidth: 15, line: 1, desc: 8},
        region: JSON.parse(getLocalStorage('userInfo'))['region'],
        accountOption: [],
        addShow: true,
        themeForm: {
          themeName: '',
          type: 1,
          url: '',
          areaKey: '',
          industryKey: '',
          eventKey: '',
          removeKey: '',
          specialKey: '',
          accountList: [],
          accountValue: '',
          sourceList: []
        },
        submitType: false,
        themeRules: {},
        areaThemeRules: { // themeForm.type === 1 区域主题
          themeName: [{ required: true, message: '主题名称不能为空！', trigger: 'blur' }, { min: 1, max: 20, message: '主题名称只支持1-20个字符！', trigger: ['blur', 'change'] }],
          areaKey: [{ required: true, message: '区域关键词不能为空！', trigger: 'blur' }],
          industryKey: [{ required: true, message: '单位关键词不能为空！', trigger: 'blur' }]
        },
        mainBodyThemeRules: { // themeForm.type === 3 单位主题
          themeName: [{ required: true, message: '主题名称不能为空！', trigger: 'blur' }, { min: 1, max: 20, message: '主题名称只支持1-20个字符！', trigger: ['blur', 'change'] }],
          industryKey: [{ required: true, message: '单位关键词不能为空！', trigger: 'blur' }]
        },
        specialThemeRules: { // themeForm.type === 2 特殊主题
          themeName: [{ required: true, message: '主题名称不能为空！', trigger: 'blur' }, { min: 1, max: 20, message: '主题名称只支持1-20个字符！', trigger: ['blur', 'change'] }],
          sourceList: [{ required: true, message: 'URL 不能为空！', trigger: 'blur' }, {type: 'url', message: '请输入正确的url', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.themeRules = this.areaThemeRules
    },
    methods: {
      renderHeaderUrl: function(h, { column }) {
        return h(
          'div',
          [
            h('span', {
              style: {color: 'red', fontSize: '14px'},
              domProps: {
                innerHTML: '* '
              }
            }),
            h('span', column.label)
          ]
        )
      },
      renderHeader(createElement, {column, $index}) {
        return createElement(
          'div',
          [
            createElement('span', column.label),
            createElement('i', {
              class: 'el-icon-question',
              style: {color: '#409eff', marginLeft: '5px', cursor: 'pointer'},
              attrs: {
                title: '输入用户所关注的关键词，用空格隔开，组合关键词需要加号连接，如： 北京 北京+学校； 不输入关键词则默认显示对应网站地址全部数据。'
              }
            })
          ]
        )
      },
      /**
       * 数据列表 table表格 表头样式覆盖
       */
      listTableHeaderCellStyle: function({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2) {
          return 'padding: 0;font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; background-color: #dcedfc; color: #2885dd; font-weight: 500; text-align: center;'
        }
        return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; background-color: #dcedfc; color: #2885dd; font-weight: 500; text-align: center;'
      },
      /**
       * 数据列表 table表格 单元格样式覆盖
       */
      listTableCellStyle: function({ row, column, rowIndex, columnIndex }) {
        return 'font-size: 16px; border-right: 1px solid #b2b2b2; border-bottom: 1px solid #b2b2b2; padding: 8px 0; text-align:center;'
      },
      getRules(type) {
        if (type === 1) {
          return this.areaThemeRules
        } else if (type === 3) {
          return this.mainBodyThemeRules
        } else {
          return this.specialThemeRules
        }
      },
      /**
       * 切换主题类型
       */
      changeThemeType() {
        if (this.themeForm.type === 1) { // 区域主题 region 1 只有区域用户有
          this.$refs['themeForm'].clearValidate(['url', 'specialKey'])
          this.themeRules = this.areaThemeRules
        }
        if (this.themeForm.type === 2) { // 特殊主题
          this.themeForm.areaKey = ''
          this.themeForm.industryKey = ''
          this.themeForm.eventKey = ''
          this.themeForm.removeKey = ''
          this.themeForm.accountValue = ''
          this.$refs['themeForm'].clearValidate(['areaKey', 'industryKey'])
          this.themeRules = this.specialThemeRules
          if (Array.isArray(this.themeForm.sourceList) && this.themeForm.sourceList.length === 0) {
            this.themeForm.sourceList = [{
              url: '',
              keyWords: '',
              isEditUrl: true,
              isEditKey: true
            }]
          }
        }
        if (this.themeForm.type === 3) { // 单位主题
          this.themeForm.areaKey = ''
          this.$refs['themeForm'].clearValidate(['areaKey', 'url', 'specialKey'])
          this.themeRules = this.mainBodyThemeRules
        }
      },
      /**
       * 输入框获取焦点事件
       */
      getFocus: function(list, type) {
        if (type === 'url') {
          list.isEditUrl = true
        } else {
          list.isEditKey = true
        }
      },
      /**
       * 输入框失去焦点事件
       */
      changeSourceList: function (list, type) {
        if (type === 'url') {
          list.isEditUrl = false
          let params = {}
          if (list.url) params.url = list.url
          let url = 'http://10.253.254.28:15002/task/isOpenUrl'
          this.$get(url, params).then(res => {
            if (res.status === 1) {
              if (!res.data) {
                this.$layer.msg('请输入正确的URL地址！')
              }
            }
          })
        } else {
          list.isEditKey = false
        }
      },
      /**
       * 判断关键词个数
       */
      checkKeyWords: function(list) {
        let newArr = list.keyWords.trim().split(' ')
        let keyArr = []
        newArr.forEach((item) => {
          if (item && item !== '') {
            keyArr.push(item)
          }
        })
        console.log(keyArr)
        if (keyArr.length > 10) {
          list.keyWords = keyArr.slice(0, 10).join(' ')
          this.$layer.msg('关键词个数不能超过十个')
        }
      },
      checkInput: function(list) {
        let newArr = list.keyWords.trim().split(' ')
        let keyArr = []
        newArr.forEach((item) => {
          if (item && item !== '') {
            keyArr.push(item)
          }
        })
        if (keyArr.length > 10) {
          list.keyWords = keyArr.slice(0, 10).join(' ')
          this.$layer.msg('关键词个数不能超过十个')
        }
      },
      /**
       * 编辑特殊主题列表
       */
      toggleEdit: function(list) {
        list.isEditUrl = true
        list.isEditKey = true
      },
      /**
       * 添加特殊主题
       */
      addSource: function () {
        if (Array.isArray(this.themeForm.sourceList) && this.themeForm.sourceList.length < 10) {
          this.themeForm.sourceList.push({
            url: '',
            keyWords: '',
            isEditUrl: true,
            isEditKey: true
          })
        } else {
          this.$layer.msg('每个特殊主题最多支持添加10个网站地址')
          this.addShow = false
        }
      },
      /**
       * 删除特殊主题
       */
      toggleDelete: function(list, index) {
        if (this.themeForm.sourceList.length > 1) {
          if (list.url === '' && list.keyWords === '') {
            this.themeForm.sourceList.splice(index, 1)
          } else {
            this.messageBoxInfo = {
              isShow: true,
              title: '确认删除',
              btn: ['取消', '删除'],
              id: list.id,
              index: index,
              type: 'del',
              content: `确定要删除该网站地址及对应关键词吗？`,
              height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
            }
          }
        } else if (list.url !== '' || list.keyWords !== '') {
          this.messageBoxInfo = {
            isShow: true,
            title: '确认删除',
            btn: ['取消', '删除'],
            id: list.id,
            index: index,
            type: 'del',
            content: `确定要删除该网站地址及对应关键词吗？`,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
          }
        }
      },
      /**
       * 确认删除：确认关闭提示窗
       */
      async confirmMessageBox(obj) {
        if (obj.status) {
          if (obj.list.type === 'del') { // 点击删除
            if (this.themeForm.sourceList.length > 1) {
              this.themeForm.sourceList.splice(obj.list.index, 1)
              this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
            } else {
              this.themeForm.sourceList.splice(obj.list.index, 1)
              this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
              this.themeForm.sourceList.push({
                url: '',
                keyWords: '',
                isEditUrl: true,
                isEditKey: true
              })
            }
          } else { // 点击取消
            this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
            this.$emit('closeThemeDialog', this.settingThemeInfo.type, this.submitType, false)
            this.$store.commit('newThemeInit', false)
          }
        } else {
          this.messageBoxInfo = {isShow: false, title: '', id: '', content: '', height: ''}
        }
      },
      submitForm: function (formName) {
        this.submitType = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let sourceArr = this.themeForm.sourceList
            let newArr = []
            sourceArr.forEach((item) => {
              if (item.url !== '' || item.keyWords !== '') {
                newArr.push({
                  url: item.url,
                  keyWords: item.keyWords
                })
              }
            })
            if (this.themeForm.type !== 2 || (this.themeForm.type === 2 && newArr.length)) {
              // let url = this.$store.state.url + 'theme/task/addData'
              let url = 'http://10.253.254.28:15002/task/addData'
              let params = {}
              if (this.settingThemeInfo.type === 'add') {
                params.type = 1
              } else if (this.settingThemeInfo.type === 'update') {
                params.type = 2
              }
              if (this.settingThemeInfo.id) {
                params.id = this.settingThemeInfo.id
              }
              if (this.themeForm.themeName) params.name = this.themeForm.themeName
              /* typeIn 1 常规主题 2 特殊主题（需要传url） */
              if (this.themeForm.type) params.typeIn = this.themeForm.type
              if (this.themeForm.areaKey) params.regionWords = this.themeForm.areaKey
              if (this.themeForm.industryKey) params.industryWords = this.themeForm.industryKey
              if (this.themeForm.eventKey) params.eventWords = this.themeForm.eventKey
              if (this.themeForm.removeKey) params.excludeWords = this.themeForm.removeKey
              if (this.themeForm.accountValue) {
                let accountArr = this.themeForm.accountValue.split(':')
                this.themeForm.accountList.forEach(item => {
                  if (item.account === accountArr[0]) {
                    params.userId = item.id
                    params.userName = item.username
                  }
                })
              }
              params.custom = 1
              params.taskId = JSON.parse(getLocalStorage('userInfo'))['taskId']
              params.specialInfoList = JSON.stringify(newArr)
              if (this.settingThemeInfo.type === 'add') this.loading = {status: true, tooltip: '主题正在添加中，请稍后……'}
              if (this.settingThemeInfo.type === 'update') this.loading = {status: true, tooltip: '主题正在修改，请稍后……'}
              this.$post(url, params)
                .then(res => {
                  if (res.status === 1 && res.data) {
                    this.loading = {status: false, tooltip: ''}
                    this.$layer.msg(res.message)
                    this.cancelClick()
                    this.submitType = false
                    this.$store.commit('newThemeInit', false)
                  } else {
                    this.loading = {status: false, tooltip: ''}
                    this.$layer.msg(res.message)
                  }
                }).catch((error) => {
                console.log(error)
                this.loading = {status: false, tooltip: ''}
                this.$layer.msg(error)
              })
            } else {
              this.$layer.msg('网站地址（URL）不能为空！')
            }
          } else {
            this.loading = {status: false, tooltip: ''}
            return false
          }
        })
      },
      resetForm: function (formName) {
        if (this.$refs[formName] !== 'undefined') {
          this.$refs[formName].resetFields()
        }
        this.themeForm = {
          themeName: '',
          type: this.region === 1 ? 1 : 3,
          url: '',
          areaKey: '',
          industryKey: '',
          eventKey: '',
          removeKey: '',
          specialKey: '',
          accountValue: ''
        }
      },
      /**
       * type cancel 取消 save 保存
       */
      cancelClick: function () {
        console.log(this.themeForm)
        this.themeForm.accountList = []
        if (!this.submitType) { // 未提交离开页面
          this.messageBoxInfo = {
            isShow: true,
            title: '提示',
            btn: ['取消', '确定'],
            id: 1,
            type: 'cancel',
            content: `离开本页面将不会保存当前主题方案设置/修改，您确定要离开吗？`,
            height: {wrap: `min-height: ${document.body.clientHeight - 183}px`, content: 'height: 30%'}
          }
        } else { // 提交离开页面
          this.$emit('closeThemeDialog', this.settingThemeInfo.type, this.submitType, true)
        }
      }
    },
    watch: {
      settingThemeInfo: {
        handler: function (val) {
          if (val.type !== 'add' && val.isShow) {
            let newAccountList = [...this.accountList]
            this.themeForm = {
              id: val.data.id,
              themeName: val.data.name,
              type: val.data.type,
              url: val.data.url,
              areaKey: val.data.regionWords,
              industryKey: val.data.industryWords,
              eventKey: val.data.eventWords,
              removeKey: val.data.excludeWords,
              specialKey: val.data.specialWords,
              accountValue: (val.data.account && val.data.userName && val.data.userId) ? val.data.account + ':' + val.data.userName : '',
              accountList: newAccountList,
              sourceList: []
            }
            if (val.data.hasOwnProperty('specialInfoList') && val.data.specialInfoList !== null) {
              val.data.specialInfoList.forEach(item => {
                this.themeForm.sourceList.push({
                  url: item.url,
                  keyWords: item.keyWords,
                  isEditUrl: false,
                  isEditKey: false
                })
              })
            }
            if (val.data.account && val.data.userName && val.data.userId) {
              this.themeForm.accountList.push({
                id: val.data.userId,
                account: val.data.account,
                username: val.data.userName
              })
            }
          }
          if (val.type === 'add') {
            let newAccountList = [...this.accountList]
            if (this.region === 1) {
              this.themeForm = {
                themeName: '',
                type: 1,
                url: '',
                areaKey: '',
                industryKey: '',
                eventKey: '',
                removeKey: '',
                specialKey: '',
                accountValue: '',
                accountList: newAccountList,
                sourceList: []
              }
            } else {
              this.themeForm = {
                themeName: '',
                type: 3,
                url: '',
                areaKey: '',
                industryKey: '',
                eventKey: '',
                removeKey: '',
                specialKey: '',
                accountValue: '',
                accountList: newAccountList,
                sourceList: []
              }
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
.themeSettingPopup {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.21);
  z-index: 100;
  color: #444444;
  .popupBox {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    overflow: auto;
    .title {
      height: 50px;
      line-height: 50px;
      padding: 10px;
      .contentTitle {
        background-color: #eeeeee;
        color: #333333;
        font-size: 18px;
        padding: 0 11px;
        font-weight: 600;
        & span.close {
          float: right;
          margin-top: 0.5%;
          cursor: pointer;
        }
      }
    }
    .tooltip {
      width: 94%;
      margin: 10px auto 0;
      font-size: 12px;
      text-align: left;
      color: red;
      line-height: 18px;
    }
    .add-source {
      display: inline-block;
      text-align: right;
      width: 140px;
      line-height: 30px;
      background: url("../../../assets/myself/image_add.png") no-repeat 0 0;
      background-size: 30px 30px;
      cursor: pointer;
      margin-left: 25px;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 16px;
      color: #333;
    }
    .formGroup {
      width: 100%;
      .el-form {
        .icon-edit {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 38px;
          width: 18px;
          height: 18px;
          background: url("../../../assets/myself/myself_edit.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        .icon-edit-disable {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 38px;
          width: 18px;
          height: 18px;
          background: url("../../../assets/myself/myself_edit_disable.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        .icon-delete {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 94px;
          width: 18px;
          height: 18px;
          background: url("../../../assets/myself/myself_delete.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        .icon-delete-disable {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 94px;
          width: 18px;
          height: 18px;
          background: url("../../../assets/myself/myself_delete_disable.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        /* 重置表格背景 */
        .el-table {
          width: 96%;
          margin: 0 auto;
        }
        .el-table /deep/ .editState {
          .el-input__inner,.el-textarea__inner {
            border: none !important;
            background: transparent !important;
          }
        }
        /*.el-table /deep/ .el-input.is-disabled .el-input__inner {*/
        /*  color: #9F2925;*/
        /*  cursor: unset;*/
        /*}*/
        .el-table,
        .el-table__expanded-cell {
          background-color: transparent;
        }
        .el-table /deep/ th div {
          display: unset;
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
      .el-form /deep/ .el-form-item {
        width: 95%;
        margin: 15px auto;
      }
      .el-form /deep/ .el-input__inner {
        border-radius: 0;
      }
      .el-form /deep/ .el-textarea__inner {
        border-radius: 0;
      }
      .el-form /deep/ .el-button {
        border-radius: 0;
        width: 80px;
        margin-top: 35px;
        margin-left: 197px;
      }
      .tip {
        display: inline-block;
        width: 20px;
        height: 26px;
        background: url("../../../assets/myself/questionSmall.png") no-repeat 0 14px;
        margin-left: 7px;
        cursor: pointer;
      }
      .el-form /deep/ .el-button:last-child {
        background: #2885DD;
        margin-left: 100px;
      }
      .description {
        width: 20px;
        height: 20px;
        font-size: 12px;
        line-height: 18px;
        padding-left: 15px;
        background: url("../../../assets/myself/questionSmall.png") no-repeat 0 5px;
        cursor: pointer;
      }
      .account {
        & span {
          color: #999999;
          font-size: 12px;
        }
      }
    }
    .btn {
      position: absolute;
      width: 100%;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      & ul {
        width: 50%;
        margin: 10px auto 0;
        & li {
          float: left;
          background: #2885DD;
          color: white;
          padding: 8px 15px;
          cursor: pointer;
        }
        & li:first-child {
          margin-right: 35%;
        }
      }
    }
  }
}
</style>
