<template>
  <div class="analysisClass">
    <div class="menu-wrapper">
      <ul class="clearfix">
        <li v-for="(vo, index) in menuArr" :key="index" class="menu-name fn-left" :class="index === currentIndex ? 'active' : ''" @click="currentClick(index, vo)">
          <!--<router-link :to="vo.path">{{vo.name}}</router-link>-->{{vo.name}}
        </li>
      </ul>
    </div>
    <div class="content-wrapper">
      <router-view @resetAnalysisMenuIndex="resetAnalysisMenuIndex"></router-view>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  export default {
    name: 'analysis',
    data() {
      return {
        currentIndex: 0,
        menuArr: [{name: '舆情总体分析', path: '/analysis/totality'}, {name: '近期风险分析', path: '/analysis/recent'}, {name: '微博专项分析', path: '/analysis/weiBo'}]
      }
    },
    methods: {
      currentClick: function (index, menu) {
        this.currentIndex = index
        this.$router.replace(menu)
      },
      resetAnalysisMenuIndex: function (index) {
        this.currentIndex = index
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/less/common";
  .analysisClass {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    .menu-wrapper {
      display: flex;
      flex-flow: row nowrap;
      width: 100%;
      height: 48px;
      background: white;
      font-size: 16px;
      line-height: 35px;
      border-radius: 5px;
      & ul {
        height: 100%;
      }
      & li {
        height: 94%;
        text-align: center;
        padding: 0 23px;
        line-height: 45px;
        cursor: pointer;
        & a {
          text-decoration: none;
        }
      }
      & li.active {
        border-bottom: 3px solid #0068B7;
      }
    }
    .content-wrapper{
      width: 100%;
      height: 92%;
      margin-top: 1%;
      background: transparent;
    }
  }
</style>
