<template>
  <div v-if="messageBoxInfo.isShow" class="messageBox" :style="messageBoxInfo.height.wrap">
    <div class="popupBox" :style="messageBoxInfo.height.content">
      <div class="title">
        {{messageBoxInfo.title ? messageBoxInfo.title : '提示'}}
        <span class="close" @click="cancelClick"><img src="../../../assets/myself/close.png" width="19" height="19"></span>
      </div>
      <div class="content">
        <p>{{messageBoxInfo.content ? messageBoxInfo.content : '确认该操作吗？'}}</p>
      </div>
      <div class="btn">
        <div v-if="messageBoxInfo.tooltip" class="tooltip">
          {{messageBoxInfo.tooltip}}
        </div>
        <ul class="clearfix" v-if="messageBoxInfo.id !== -1">
          <li class="cancel" @click="cancelClick">{{messageBoxInfo.btn[0]}}</li>
          <li class="confirm" @click="confirmClick">{{messageBoxInfo.btn[1]}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="application/ecmascript">
  export default {
    name: 'messageBox',
    props: ['messageBoxInfo'],
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      confirmClick: function () {
        this.$emit('closeSignal', {list: this.messageBoxInfo, status: true})
      },
      cancelClick: function () {
        this.$emit('closeSignal', {list: this.messageBoxInfo, status: false})
      }
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="less">
  .messageBox {
    position: absolute;
    width: 100%;
    height: auto;
    background: rgba(0,0,0,0.21);
    z-index: 100;
    top: 0;
    .popupBox {
      width: 40%;
      /*height: 30%;*/
      background: #FFFFFF;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px 0px #797979;
      .title {
        width: 95%;
        height: 40px;
        background-color: #dcedfc;
        color: #2885dd;
        line-height: 40px;
        padding-left: 5%;
        & span.close {
          float: right;
          margin-right: 4%;
          cursor: pointer;
        }
      }
      .content {
        position: absolute;
        width: 80%;
        word-wrap: break-word;
        text-align: center;
        margin: 0 auto;
        line-height: 25px;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -45%);
      }
      .btn {
        position: absolute;
        width: 100%;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        .tooltip {
          width: 80%;
          margin: 0 auto;
          font-size: 12px;
          text-align: center;
          color: red;
        }
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
