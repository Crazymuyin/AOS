<template>
  <div class="wrapper-bMap" v-show="bMapModel.isShowMap">
    <el-row class="bg-map">
      <el-col :span="2">
        <span class="el-address">地址：</span>
      </el-col>
      <el-col :span="6">
        <el-input class="el-address-input" v-model="address" placeholder="请输入要查询的地址"></el-input>
      </el-col>
      <el-col :span="2">
        <span class="el-coordinate">经纬度：</span>
      </el-col>
      <el-col :span="8">
        <el-input class="el-coordinate-input" v-model="coordinate" placeholder="输入地址后请点击查询按钮" :disabled="true"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button class="el-themesetting-search" type="primary" icon="el-icon-search" @click="searchMap">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button class="el-themesetting-submit" type="primary" icon="el-icon-check" @click="submitMap">提交</el-button>
      </el-col>
      <el-col :span="2">
        <el-button class="el-themesetting-cancel" type="primary" icon="el-icon-arrow-left" @click="cancelMap">返回</el-button>
      </el-col>
    </el-row>
    <div id="map" class="map"></div>
  </div>
</template>
<script>
  /* eslint-disable no-undef */
  import BMap from 'BMap'
  // import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'

  export default {
    name: 'bMap',
    props: {
      bMapModel: Object
    },
    data() {
      return {
        map: '',
        localSearch: '',
        address: '',
        coordinate: '',
        center: {
          lng: 0,
          lat: 0
        },
        zoom: 3
      }
    },
    mounted() {
      this.baiduMap()
    },
    methods: {
      baiduMap() {
        // 百度api功能
        this.map = new BMap.Map('map') // 创建map实例
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11) // 初始化地图，设置中心点坐标和地图级别
        this.map.addControl(new BMap.MapTypeControl({ // 添加地图类型控件
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }))
        this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
        this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        // 添加带有定位的导航控件
        this.map.addControl(new BMap.NavigationControl({// 添加默认缩放平移控件
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        }))
        this.map.addControl(new BMap.OverviewMapControl()) // 添加默认缩略地图控件
        this.map.addControl(new BMap.OverviewMapControl({
            isOpen: true,
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        })) // 右下角，打开
        // 添加定位控件
        let geolocationControl = new BMap.GeolocationControl()
        geolocationControl.addEventListener('locationSuccess', (e) => {
          // 定位成功事件
          let address = ''
          address += e.addressComponent.province
          address += e.addressComponent.city
          address += e.addressComponent.district
          address += e.addressComponent.street
          address += e.addressComponent.streetNumber
          this.address = address
        })
        geolocationControl.addEventListener('locationError', (e) => {
          // 定位失败事件
          alert(e.message)
        })
        this.map.addControl(geolocationControl)
        this.localSearch = new BMap.LocalSearch(this.map)
        this.localSearch.enableAutoViewport() // 允许自动调节窗体大小
        this.localSearch.setSearchCompleteCallback((searchResult) => {
          let poi = searchResult.getPoi(0)
          this.coordinate = poi.point.lng + ',' + poi.point.lat
          this.map.centerAndZoom(poi.point, 13)
          let marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat)) // 创建标注，为要查询的地方对应的经纬度
          this.map.addOverlay(marker)
          marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
        })
      },
      searchMap() {
        this.map.clearOverlays() // 清空原来的标注
        this.localSearch.search(this.address)
      },
      submitMap() {
        this.$emit('closeMap', this.coordinate)
      },
      cancelMap() {
        this.$emit('closeMap', '')
      }
    }
  }

</script>

<style lang="less" scoped>
  // @import "../../common/less/common";
  .wrapper-bMap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #ffffff;
    z-index: 100;

    .map {
      width: 100%;
      height: 77vh;
    }

    .cancelMap {
      position: absolute;
      width: 24px;
      height: 23px;
      top: 10px;
      right: 10px;
      z-index: 101;
      background: url('../../../assets/myself/close.png');
      cursor: pointer;
    }
  }

</style>
<style>
  .bg-map {
    background: #c9c9c9;
  }
  .el-address {
    padding-left: 0.5vw;
    line-height: 3.4vh;
  }

  .el-address-input {
    margin-left: -1vw;
  }

  .el-coordinate {
    padding-left: -5vw;
    line-height: 3.4vh;
  }

  .el-coordinate-input {
    margin-left: -1vw;
  }
  .el-themesetting-search {
    margin-left: 0vw;
  }
  .el-themesetting-sumit {
    margin-left: 0vw;
  }

  .el-themesetting-cancel {
    margin-left: 0vw;
  }
</style>
