<template>
  <nav>
    <ul class="pagination">
      <li :class="{'disabled': current === 1}"><a href="javascript:" @click="setCurrent(current - 1)">上一页</a></li>
      <li :class="{'disabled': current === 1}"><a href="javascript:" @click="setCurrent(1)"> 首页 </a></li>
      <li v-for="p in groupList" :class="{'active': currentPage === p.val}" :key="p.num">
        <a href="javascript:" @click="setCurrent(p.val)">{{p.text}}</a>
      </li>
      <li :class="{'disabled': current === page}"><a href="javascript:" @click="setCurrent(page)"> 尾页 </a></li>
      <li :class="{'disabled': current === page}"><a href="javascript:" @click="setCurrent(current + 1)">下一页</a></li>
    </ul>
  </nav>
</template>

<script type="application/ecmascript">
  /* eslint-disable func-call-spacing */

  export default {
    name: 'pagination',
    data () {
      return {
        current: this.currentPage
      }
    },
    props: {
      total: { // 总条数
        type: Number,
        default: 0
      },
      display: { // 每页显示条数
        type: Number,
        default: 10
      },
      currentPage: { // 当前页
        type: Number,
        default: 1
      },
      pageGroup: { // 下方展示多少项 最好是奇数
        type: Number,
        default: 10,
        coerce: function (v) {
          v = v > 0 ? v : 5
          return v % 2 === 1 ? v : v + 1
        }
      }
    },
    computed: {
      page: function () { // 总页数
        return Math.ceil(this.total / this.display)
      },
      groupList: function () { // 获取分页页码
        var len = this.page
        var temp = []
        var list = []
        var count = Math.floor(this.pageGroup / 2) // 中心点
        var center = this.current
        if (len <= this.pageGroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len})
          }
          return temp
        }
        while (len--) {
          temp.push(this.page - len)
        }
        var idx = temp.indexOf(center);
        (idx < count) && (center = center + count - idx);
        (this.current > this.page - count) && (center = this.page - count)
        temp = temp.splice(center - count - 1, this.pageGroup)
        do {
          var t = temp.shift()
          list.push({
            text: t,
            val: t
          })
        } while (temp.length)
        if (this.page > this.pageGroup) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 2})
        }
        return list
      }
    },
    methods: {
      setCurrent: function (idx) {
        if (this.current !== idx && idx > 0 && idx < this.page + 1) {
          this.current = idx
          this.$emit('pageChange', this.current)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .pagination {
    overflow: hidden;
    display: table;
    margin: 0 auto;
    height: auto;
    & li {
      float: left;
      height: auto;
      margin: 0.5vmin;
      & a {
        display: block;
        width: auto;
        height: auto;
        text-align: center;
        font-size: 1.2vmin;
        text-decoration: none;
        padding: 1vmin 1vmin;
        color: #666;
      }
      & a:link {
        color: #666;
      }
    }
    & li:hover {
      background: rgba(0,104,183,1);
      & a {
        color: white;
      }
    }
    .active {
      background: rgba(0,104,183,1);
      & a {
        color: white;
      }
      & a:link {
        color: white;
      }
    }
  }
</style>
