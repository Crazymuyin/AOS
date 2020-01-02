<template>
  <div class="status" v-if="toggle.loading || toggle.noData || toggle.noAuth || toggle.errorWork">
    <vue-loading v-if="toggle.loading" class="loading" type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
    <div v-if="toggle.noData" class="noData">
      <img src="../../assets/public/noData.png" alt="" width="100">
      <span>{{toggle.tooltip ? toggle.tooltip : '未检索到相关数据'}}</span>
    </div>
    <div v-if="toggle.noAuth" class="noAuth">
      <img src="../../assets/public/noAuth.png" alt="" width="100">
      <span>{{toggle.tooltip ? toggle.tooltip : '您没有该板块权限'}}</span>
    </div>
    <div v-if="toggle.errorWork" class="errorWork">
      <img src="../../assets/public/404.png" alt="" width="100">
      <span>{{toggle.tooltip ? toggle.tooltip : '未找到相关资源'}}</span>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  export default {
    name: 'vue-noData',
    props: {
      toggle: Object
    }
  }
</script>

<style scoped lang="less">
  .status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .noData, .noAuth, .errorWork {
      color: white;
      text-align: center;
      & span {
        color: #333333;
        display: block;
        font-size: 14px;
      }
    }
  }
</style>
