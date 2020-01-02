<template>
  <div class="wrapper-about">
    <div class="wrapper-title">
      <span>关于中正</span>
    </div>
<!--    <div class="wrapper-content" :style="contentHeight">-->
    <div class="wrapper-content">
      <div>
        <h3>{{ aboutList.title }}</h3>
        <p v-html="aboutList.content"></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import {getLocalStorage, initFun} from '../../common/js/cookie'

  export default {
    name: 'about',
    data () {
      return {
        // contentHeight: {
        //   'min-height': document.body.clientHeight - 194 + 'px'
        // },
        aboutList: {
          'title': '国内领先的专业第三方网络舆情服务智库机构',
          'content': '<p style="padding-left: 30px;">我们专注于网络舆情与互联网大数据精准分析；</p>' +
            '<p style="padding-left: 30px;">我们与北京大学合作共建了互联网与社会研究中心，潜心互联网与社会发展科学研究；</p>' +
            '<p style="padding-left: 30px;">我们是《求是》杂志社《红旗文摘》杂志社重点战略支持单位；</p>' +
            '<p style="padding-left: 30px;">我们拥有六大职能中心、舆情网监平台、中国舆情在线、《舆情决策参考》等机构平台及九项舆情专业服务产品；</p>' +
            '<p style="padding-left: 30px;">我们为党政和企事业单位提供专业的舆情数据监测、大数据采集与分析、品牌管理、课题研究及解决方案等服务；</p>' +
            "<p style='margin: 10px 0;padding: 0; border-bottom: 1px solid #dcdcdc;'></p>" +
            '<p style="padding-left: 30px;">我们已为80余个委局办及地方重点部门、20余家中央企业、600余家民生类企事业单位提供舆情与数据咨询服务。</p>' +
            '<p style="text-align: justify; padding: 0 30px;">北京大学互联网与社会研究中心是北大直属的校级科研机构，由北大与中正合作共建，主要专注互联网与社会应用科学研究，' +
            '是北大产、学、研、用的重点科研基地，是我国未来互联网与社会研究的核心驱动，是互联网舆情产业第三方智库的倡导者与领导者。' +
            '中心聚集了一批有着深厚造诣的专家学者，并有一批北大校内跨部门、跨学科的中青年学术骨干承担研究任务，致力于为政府部门决策提供科学依据，' +
            '为社会经济发展提供智力支持，为互联网产业创新提供权威的研究成果。目前，已承担多个地方政府与企事业单位的课题研究任务，并成功扶持孵化了多家互联网信息应用企业。 ' +
            '</p>' +
            '<p style="padding: 20px 0 0 0;">联系电话：010-62102099</p>'
        }
      }
    },
    created () {
      if (initFun()) {
        JSON.parse(Base64.decode(JSON.parse(getLocalStorage('userInfo'))['menuAuth'])).menuList.forEach((item, index) => {
          if (item.name === '关于中正') {
            this.$emit('resetMenuIndex', index)
          }
        })
      } else {
        this.$router.replace({path: '/login', name: '登录'})
      }
    },
    mounted() {
      this.$bus.on('contentHeightEmit', (height) => {
        this.contentHeight = `min-height: ${height}px`
      })
    },
    beforeDestroy() {
      this.$bus.off('contentHeightEmit')
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/common";
  .wrapper-about {
    width: 970px;
    .flexColumn(center, center);
    .wrapper-title {
      width: 968px;
      height: 48px;
      border: 1px solid #dcdcdc;
      background: #ffffff;
      .flexRow(flex-start, center);
      & span {
        height: 32px;
        line-height: 32px;
        font-size: 18px;
        color: #333333;
        padding-left: 10px;
        font-weight: 600;
        font-family: "Microsoft YaHei";
        border-left: 5px solid #0068b7;
      }
    }
    .wrapper-content {
      position: relative;
      width: 968px;
      height: 754px;
      margin-top: 5px;
      border: 1px solid #dcdcdc;
      border-bottom: 0;
      background: #ffffff;
      & div {
        width: 928px;
        margin: 0 auto;
        & h3 {
          padding: 30px;
          font-size: 16px;
          text-align: center;
        }
        & p {
          text-indent: 2em;
          font-size: 15px;
          line-height: 36px;
        }
      }
    }
  }
</style>
