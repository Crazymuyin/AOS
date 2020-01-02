<template>
  <div class="popup-wrapper">
    <div class="head clearfix">
      <span class="fn-left">添加信源</span>
      <span class="close fn-right" @click="closeDetail"></span>
    </div>
    <div class="content">
      <add-source-page :model="addSourceMOdel" @closeParent="closeDetail"></add-source-page>
    </div>
  </div>
</template>

<script>
import addSourcePage from './addSourcePage'
export default {
  name: 'addSourcePopup',
  components: {
    addSourcePage
  },
  data () {
    return {
      addSourceMOdel: {
      }
    }
  },
  methods: {
    closeDetail: function () {
      this.$emit('closePopup')
    }
  }
}
</script>

<style scoped lang="less">
.popup-wrapper {
  position: absolute;
  width: 900px;
  height: 640px;
  background-color: #fff;
  box-shadow: -1px 1px 12px #808080;
  top: 63px;
  left: 34px;
  z-index: 100;
  color: #444444;
  .head {
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    background-color: #eeeeee;
    color: #333333;
    & span:nth-child(2) {
      display: block;
      width: 18px;
      height: 18px;
      background: url("../../../../src/assets/detail/img_Details_img.png") no-repeat 0 0;
      background-size: 30px;
      margin-top: 12px;
      cursor: pointer;
    }
  }
  .content {}
}
</style>
