<template>
  <div v-if="settingAccountInfo.isShow" class="accountSettingPopup">
    <div class="popupBox">
      <div class="formGroup" v-loading="loading.status" :element-loading-text="loading.tooltip">
        <el-form :model="accountForm" :rules="accountRules" ref="accountForm" label-position="right" label-width="100px"
          class="demo-themeForm">
          <el-form-item label="账号名称" prop="userName">
            <el-input :title="accountForm.userName" v-model="accountForm.userName"
              :disabled="settingAccountInfo.type === 'view'" placeholder="例如：abc_123"></el-input>
          </el-form-item>
          <el-form-item label="显示名称" prop="userAlias">
            <el-input :title="accountForm.userAlias" v-model="accountForm.userAlias"
              :disabled="settingAccountInfo.type === 'view'" placeholder="例如：成都教育舆情监测"></el-input>
          </el-form-item>
          <el-form-item label="默认密码" v-if="settingAccountInfo.type === 'add'">
            {{accountForm.password}}
          </el-form-item>
          <el-form-item label="经纬度" prop="coordinate">
            <el-col>
              <el-input :title="accountForm.coordinate" v-model="accountForm.coordinate"
                :disabled="settingAccountInfo.type === 'preview'" @focus="toggleCoordinate"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所在区域" prop="province">
            <el-select v-model="accountForm.province" placeholder="请选择省份" @change="changeRegion('province')" filterable>
              <el-option v-for="item in provinceOptions" :key="item.codeId" :label="item.codeName" :value="item.codeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="accountForm.city" placeholder="请选择市" @change="changeRegion('city')" filterable>
              <el-option v-for="item in cityOptions" :key="item.codeId" :label="item.codeName" :value="item.codeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="accountForm.county" placeholder="请选择区县" @change="changeRegion('county')" filterable>
              <el-option v-for="item in countyOptions" :key="item.codeId" :label="item.codeName" :value="item.codeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="theme" label="主题关联">
            <el-select v-if="Array.isArray(editThemeList) && editThemeList.length" v-model="accountForm.taskId"
              :disabled="settingAccountInfo.type === 'view'" filterable placeholder="请选择">
              <el-option v-for="item in editThemeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <span v-if="Array.isArray(editThemeList) && editThemeList.length === 0">暂无可关联主题，请去主题设置新建主题</span>
          </el-form-item>
          <el-form-item class="submit" v-if="settingAccountInfo.type !== 'view'">
            <el-button @click="cancelClick('cancel')">取消</el-button>
            <el-button type="primary" @click="submitForm('accountForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <b-map :bMapModel="bMapModel" @closeMap="closeMap"></b-map>
  </div>
</template>

<script type="application/ecmascript">
  import {
    getLocalStorage
  } from '../../../common/js/cookie'
  import bMap from './bMap'

  export default {
    name: 'accountSettingPopup',
    props: {
      settingAccountInfo: Object
    },
    components: {
      bMap
    },
    data() {
      return {
        loading: {
          status: false,
          tooltip: ''
        },
        bMapModel: {
          isShowMap: false
        },
        themeOption: [],
        provinceOptions: [],
        cityOptions: [],
        countyOptions: [],
        editThemeList: [],
        accountForm: {
          userName: '',
          userAlias: '',
          password: 123456,
          province: '',
          city: '',
          county: '',
          coordinate: '',
          id: '',
          taskId: ''
        },
        accountRules: {
          userName: [{
            required: true,
            message: '请输入账号名称',
            trigger: 'blur'
          }],
          userAlias: [{
            required: true,
            message: '请输入显示名称',
            trigger: 'blur'
          }],
          coordinate: [{
            required: true,
            message: '点击选择经纬度',
            trigger: 'change'
          }],
          province: [{
            required: true,
            message: '请选择账号所处省份',
            trigger: 'change'
          }]
        }
      }
    },
    mounted() {
      this.getProvinceReq()
    },
    methods: {
      submitForm: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.$store.state.url + 'theme/user/addData'
            let params = {
              taskId: this.accountForm.taskId,
              id: this.accountForm.id
            }
            if (this.settingAccountInfo.type === 'add') {
              params.type = 1
            } else if (this.settingAccountInfo.type === 'update') {
              params.type = 2
            }
            if (this.accountForm.userName) params.account = this.accountForm.userName
            if (this.accountForm.userAlias) params.username = this.accountForm.userAlias
            if (getLocalStorage('userInfo') && JSON.parse(getLocalStorage('userInfo'))['userId']) {
              params.pid =
                JSON.parse(getLocalStorage('userInfo'))['userId']
            }
            if (this.accountForm.province || this.accountForm.city || this.accountForm.county) {
              if (this.accountForm.coordinate) {
                if (this.settingAccountInfo.type === 'add') {
                  this.loading = {
                    status: true,
                    tooltip: '账号正在添加中，请稍后……'
                  }
                }
                if (this.settingAccountInfo.type === 'update') {
                  this.loading = {
                    status: true,
                    tooltip: '账号正在修改，请稍后……'
                  }
                }
                params['regionCode'] = this.accountForm.county ? this.accountForm.county : this.accountForm.city
                  ? this.accountForm.city : this.accountForm.province
                params['lng'] = this.accountForm.coordinate.split(',')[0]
                params['lat'] = this.accountForm.coordinate.split(',')[1]
                this.$post(url, params)
                  .then(res => {
                    if (res.status === 1 && res.data) {
                      this.loading = {
                        status: false,
                        tooltip: ''
                      }
                      this.$layer.msg(res.message)
                      this.resetForm('accountForm')
                      this.cancelClick('save')
                    } else {
                      this.loading = {
                        status: false,
                        tooltip: ''
                      }
                      this.$layer.msg(res.message)
                    }
                  }).catch(() => {
                    this.loading = {
                      status: false,
                      tooltip: ''
                    }
                    this.$layer.msg('账号添加失败')
                  })
              } else {
                this.$layer.msg('账号所在经纬度不能为空，请先选择经纬度。')
              }
            } else {
              this.$layer.msg('账号所在区域不能为空，请先选择所在区域。')
            }
          } else {
            this.loading = {
              status: false,
              tooltip: ''
            }
            this.$layer.msg('账号添加失败')
          }
        })
      },
      resetForm: function (formName) {
        this.$refs[formName].resetFields()
        this.accountForm = {
          userName: '',
          userAlias: '',
          password: 123456,
          province: '',
          city: '',
          county: '',
          coordinate: '',
          id: '',
          taskId: ''
        }
      },
      changeRegion(type) {
        if (type === 'province') {
          this.accountForm.city = ''
          this.getCityReq()
        } else if (type === 'city') {
          this.accountForm.county = ''
          this.getCountyReq()
        }
      },
      /**
       * 获取省
       */
      async getProvinceReq() {
        try {
          let params = {}
          let url = `${this.$store.state.url}theme/region/provinces`
          let response = await this.$get(url, params)
          if (response.status === 1) {
            this.provinceOptions = response.data
          } else {
            this.$layer.msg(response.message)
          }
        } catch (error) {
          this.$layer.msg(error)
        }
      },
      /**
       * 获取市
       */
      async getCityReq() {
        try {
          let params = {}
          params['code'] = this.accountForm.province
          let url = `${this.$store.state.url}theme/region/citys`
          let response = await this.$get(url, params)
          if (response.status === 1) {
            this.cityOptions = response.data
          } else {
            this.$layer.msg(response.message)
          }
        } catch (error) {
          this.$layer.msg(error)
        }
      },
      /**
       * 获取区/县
       */
      async getCountyReq() {
        try {
          let params = {}
          params['code'] = this.accountForm.city
          let url = `${this.$store.state.url}theme/region/countys`
          let response = await this.$get(url, params)
          if (response.status === 1) {
            this.countyOptions = response.data
          } else {
            this.$layer.msg(response.message)
          }
        } catch (error) {
          this.$layer.msg(error)
        }
      },
      /**
       * 展开百度地图
       */
      toggleCoordinate() {
        this.bMapModel.isShowMap = true
      },
      closeMap(coordinate) {
        this.bMapModel.isShowMap = false
        if (coordinate) {
          this.accountForm.coordinate = coordinate
        } else {
          this.accountForm.coordinate = ''
        }
      },
      /**
       * @params type
       * cancel: 取消
       * save: 保存回调
       */
      cancelClick: function (type) {
        this.$emit('closeSignal', type, this.settingAccountInfo.type)
      }

    },
    watch: {
      settingAccountInfo: {
        handler: function (val) {
          this.loading = {
            status: false,
            tooltip: ''
          }
          if (val.data !== '') {
            this.accountForm.userName = val.data.account
            this.accountForm.userAlias = val.data.username
            this.accountForm.id = val.data.id
            this.accountForm.taskId = val.data.taskId
            if (val.data.lng && val.data.lat) { // 编辑 数据回显经纬度
              this.accountForm.coordinate = `${val.data.lng},${val.data.lat}`
            }
            if (val.data.regionCode) { // 编辑 数据回显 省、市、县
              if (val.data.regionCode.indexOf(',') !== -1) { // 省、市 或 省、市县
                if (val.data.regionCode.split(',').length === 2) { // 省、市
                  this.accountForm.province = val.data.regionCode.split(',')[0]
                  this.getCityReq()
                  this.accountForm.city = val.data.regionCode.split(',')[1]
                  this.getCountyReq()
                  this.accountForm.county = ''
                } else { // 省、市、县
                  this.accountForm.province = val.data.regionCode.split(',')[0]
                  this.getCityReq()
                  this.accountForm.city = val.data.regionCode.split(',')[1]
                  this.getCountyReq()
                  this.accountForm.county = val.data.regionCode.split(',')[2]
                }
              } else { // 省
                this.accountForm.province = val.data.regionCode
                this.getCityReq()
                this.accountForm.city = ''
                this.accountForm.county = ''
              }
            }
          } else {
            this.accountForm = {
              userName: '',
              userAlias: '',
              password: 123456,
              province: '',
              city: '',
              county: '',
              coordinate: '',
              id: '',
              taskId: ''
            }
          }
          this.editThemeList = val.themeList
        },
        deep: true,
        immediate: false
      }
    }
  }

</script>

<style scoped lang="less">
  .accountSettingPopup {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.21);
    color: #444444;
    z-index: 100;

    .popupBox {
      width: 100%;
      height: 100%;
      /*height: 420px;*/
      background: #FFFFFF;
      position: absolute;
      top: 0;

      .title {
        width: 100%;
        height: 40px;
        background-color: #eeeeee;
        color: #333333;
        line-height: 40px;

        .contentTitle {
          width: 90%;
          margin: 0 auto;
        }
      }

      .formGroup {
        width: 91%;
        margin: 0 auto;
        .el-form {
          margin-top: 56px;
          .el-button {
            width: 90px;
            border-radius: 0;
          }
          .el-button:last-child {
            background: #2885DD;
            margin-left: 60px;
          }
        }
        /deep/ .el-form-item__content {
          line-height: 38px;
        }
        /deep/ .el-form-item__label {
          width: 150px;
          font-size: 16px;
          color: #333;
          font-weight: 500;
          line-height: 38px;
        }
        /deep/ .el-input--small .el-input__inner {
          width: 300px !important;
          border-radius: 0;
          height: 38px;
          line-height: 38px;
        }

        .theme {
          & span {
            color: #999999;
            font-size: 12px;
          }
        }

        .submit {
          margin-top: 40px;
        }
      }
    }
  }

</style>
