<template>
  <ul class="theme-list" v-if="model.isShow">
    <li v-for="(list, index) of model.menuList" :key="index">
      <div class="theme-title" @click="toggleMenu(list, index)">
        <span :title="list.name">{{list.name | sliceFilter(14)}}</span>
        <i v-if="Array.isArray(list.value) && list.value.length && list.value[0].id" class="dropDown" :class="list.toggleShow ? '' : 'click'"></i>
      </div>
      <ul class="theme-content" v-show="list.toggleShow">
        <li :title="item.name" v-for="(item, i) in list.value" :key="i" :class="{'active': item.isActive}" @click="toggleTheme(item, i, index)">{{item.name}}</li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'myTree',
  props: {
    model: Object
  },
  data () {
    return {
      navIndex: 0,
      themeIndex: 0,
      secondShow: true
    }
  },
  watch: {
    model: {
      handler: function (val) {
        if (Array.isArray(val.menuList) && val.menuList.length) {
          if (Array.isArray(val.menuList[0]) && val.menuList[0].length && val.menuList[0].value[0].id && val.menuList[0].value[0].name) {
            this.$emit('menuSearch', val.menuList[0].value[0], this.themeIndex)
          } else if (Array.isArray(val.menuList[1]) && val.menuList[1].length && val.menuList[1].value[0].id && val.menuList[1].value[0].name) {
            this.$emit('menuSearch', val.menuList[1].value[0], this.themeIndex)
          } else {
            this.$emit('menuSearch', '', '')
          }
        }
      },
      deep: true
    }
  },
  methods: {
    toggleMenu: function(list) {
      if (list.value.length !== 0) {
        this.themeIndex = ''
        list.toggleShow = !list.toggleShow
      }
    },
    toggleTheme: function (list, childIndex, parentIndex) {
      let tempMenuList = this.model.menuList
      if (tempMenuList.length === 3) { // 有三个主题下有数据时
        if (parentIndex === 0) { // 如果选择第一个主题列表 常规主题
          tempMenuList[0].value.map((item, index) => {
            if (index === childIndex) {
              item.isActive = true
            } else {
              item.isActive = false
            }
          })
        tempMenuList[1].value.map(item => {
          item.isActive = false
        })
        tempMenuList[2].value.map(item => {
          item.isActive = false
        })
        } else if (parentIndex === 1) { // 第二个主题列表 特殊主题
          tempMenuList[1].value.map((item, index) => {
            if (index === childIndex) {
              item.isActive = true
            } else {
              item.isActive = false
            }
          })
          tempMenuList[0].value.map(item => {
            item.isActive = false
          })
          tempMenuList[2].value.map(item => {
            item.isActive = false
          })
        } else { // 第三个主题列表 主体主题
          tempMenuList[2].value.map((item, index) => {
            if (index === childIndex) {
              item.isActive = true
            } else {
              item.isActive = false
            }
          })
          tempMenuList[0].value.map(item => {
            item.isActive = false
          })
          tempMenuList[1].value.map(item => {
            item.isActive = false
          })
        }
        this.model.menuList = tempMenuList
        this.$emit('menuSearch', list, childIndex)
      } else if (tempMenuList.length === 2) { // 有两个主题下有数据时
        if (parentIndex === 0) { // 如果选择第一个主题列表 常规主题
          tempMenuList[0].value.map((item, index) => {
            if (index === childIndex) {
              item.isActive = true
            } else {
              item.isActive = false
            }
          })
          tempMenuList[1].value.map(item => {
            item.isActive = false
          })
        } else if (parentIndex === 1) {
          tempMenuList[1].value.map((item, index) => {
            if (index === childIndex) {
              item.isActive = true
            } else {
              item.isActive = false
            }
          })
          tempMenuList[0].value.map(item => {
            item.isActive = false
          })
        }
        this.model.menuList = tempMenuList
        this.$emit('menuSearch', list, childIndex)
      } else { // 只有一个主题下有数据时
        tempMenuList[0].value.map((item, index) => {
          if (index === childIndex) {
            item.isActive = true
          } else {
            item.isActive = false
          }
        })
        this.model.menuList = tempMenuList
        this.$emit('menuSearch', list, childIndex)
      }
    }
  }
}
</script>

<style scoped lang="less">
.theme-list {
  width: 220px;
  height: 1211px;
  overflow-y: auto;
  overflow-x: hidden;
  .theme-title {
    position: relative;
    line-height: 48px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    background-color: #0068b7;
    .dropDown {
      position: absolute;
      right: 10px;
      top: 13px;
      width: 20px;
      height: 15px;
      background: url("../../../src/assets/analysis/down.png") no-repeat;
      background-size: cover;
    }
    .dropDown.click {
      position: absolute;
      right: 10px;
      top: 16px;
      width: 20px;
      height: 15px;
      background: url("../../../src/assets/analysis/down.png") no-repeat;
      background-size: cover;
      transform:rotate(-90deg)
    }
  }
  .theme-content {
    & li {
      line-height: 48px;
      text-align: center;
      font-size: 14px;
    }

    & li:hover {
      background: #72b4f0;
      color: #ffffff;
      cursor: pointer;
    }

    & li.active {
      background: #72b4f0;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
