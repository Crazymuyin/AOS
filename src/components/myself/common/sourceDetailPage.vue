<template>
  <div class="detail-wrapper" v-if="model.isShow">
    <div class="title clearfix">
      <span class="fn-left">查看信源</span>
      <span class="close fn-right" @click="closeDetail"></span>
    </div>
    <div class="content">
      <el-steps :active="model.data.sourceStatus === 0 ? 2 : 3" simple>
        <el-step title="提交审核" icon="el-icon-upload2"></el-step>
        <el-step title="审核中" icon="el-icon-edit-outline"></el-step>
        <el-step title="审核完成" icon="el-icon-check"></el-step>
      </el-steps>
      <div class="detail-info">
        <div class="source">
          <label>信源名称：</label>
          <span>{{model.data.sourceName}}</span>
        </div>
        <div class="source">
          <label>信源链接：</label>
          <span>{{model.data.sourceUrl}}</span>
        </div>
        <div class="source clearfix">
          <label class="fn-left">信源动态：</label>
          <div class="dynamics-list fn-left">
            <div class="dynamics" v-if="model.data.sourceStatus === 1">
              <i class="el-icon-s-custom"></i>
              <span>平台</span>
              <p>信源审核通过，通过类型：长期信源，已入库。原因备注：{{model.data.remark ? model.data.remark : '无'}}</p>
              <span>{{model.data.updateTime}}</span>
            </div>
            <div class="dynamics" v-if="model.data.sourceStatus === 2">
              <i class="el-icon-s-custom"></i>
              <span>平台</span>
              <p>信源审核通过，通过类型：临时信源，已入库。原因备注：{{model.data.remark ? model.data.remark : '无'}}</p>
              <span>{{model.data.updateTime}}</span>
            </div>
            <div class="dynamics" v-if="model.data.sourceStatus === 3">
              <i class="el-icon-s-custom"></i>
              <span>平台</span>
              <p>审核未通过,原因备注：{{model.data.remark ? model.data.remark : '无'}}</p>
              <span>{{model.data.updateTime}}</span>
            </div>
            <div class="dynamics" v-if="model.data.sourceStatus === 0 || model.data.sourceStatus === 1 || model.data.sourceStatus === 2 || model.data.sourceStatus === 3">
              <i class="el-icon-s-custom"></i>
              <span>我</span>
              <p>已提交审核</p>
              <span>{{model.data.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sourceDetailPage',
  data () {
    return {
      remarkTime: ''
    }
  },
  props: {
    model: Object
  },
  methods: {
    closeDetail: function () {
      this.model.isShow = false
    }
  }
}
</script>

<style scoped lang="less">
.detail-wrapper {
  position: absolute;
  width: 785px;
  min-height: 470px;
  background-color: #fff;
  box-shadow: -1px 1px 12px #808080;
  top: 63px;
  left: 90px;
  z-index: 100;
  color: #444444;
  .title {
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    background-color: #dcedfc;
    color: #2885dd;
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
  .content {
    padding: 30px 30px;
    .detail-info {
      border: 1px solid #808080;
      margin-top: 20px;
      padding: 15px 30px;
      .source {
        width: 100%;
        height: auto;
        line-height: 60px;
        & label {
          margin-right: 15px;
        }
      }
      .source:nth-child(2) {
        & label {
          display: inline-block;
          vertical-align: top;
          margin-right: 15px;
        }
        & span {
          display: inline-block;
          width: 80%;
          word-wrap: break-word;
          line-height: 26px;
          margin: 17px 0 0 0;
        }
      }
      .source:last-child{
        height: 240px;
        overflow-y: auto;
        .dynamics-list {
          width: 80%;
          .dynamics {
            font-size: 14px;
            position: relative;
            width: 400px;
            margin-top: 20px;
            min-height: 50px;
            line-height: 20px;
            background: #eeeeee;
            padding: 5px 5px 28px 5px;
            & i {
              font-size: 20px;
            }
            & p {
              margin-top: 5px;
            }
            & span:last-child {
              position: absolute;
              right: 5px;
              bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
