/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */
export function getSourceList () {
  return [
    {name: '新闻', alias: 'news', status: false},
    {name: '论坛', alias: 'bbs', status: false},
    {name: '博客', alias: 'blog', status: false},
    {name: '新浪微博', alias: 'microBlog', status: false},
    {name: '微信', alias: 'weChat', status: false},
    {name: '平媒', alias: 'media', status: false},
    {name: '贴吧', alias: 'postBar', status: false},
    {name: '留言板', alias: 'messageBoard', status: false},
    {name: '中正云搜', alias: 'search', status: false}
  ]
}

export function getSourceAllList () {
  return [
    {name: '全部', alias: '', status: true},
    {name: '新闻', alias: 'news', status: false},
    {name: '论坛', alias: 'bbs', status: false},
    {name: '博客', alias: 'blog', status: false},
    {name: '新浪微博', alias: 'microBlog', status: false},
    {name: '微信', alias: 'weChat', status: false},
    {name: '平媒', alias: 'media', status: false},
    {name: '贴吧', alias: 'postBar', status: false},
    {name: '留言板', alias: 'messageBoard', status: false},
    {name: '中正云搜', alias: 'search', status: false}
  ]
}

export function getScoreList () {
  return [{name: '全部', alias: '', status: true}, {name: '正面', alias: 'just', status: false}, {name: '中性', alias: 'well', status: false}, {name: '负面', alias: 'loss', status: false}]
}

export function getDateTimeList () {
  return [{name: '全部', status: true}, {name: '今天', status: false}, {name: '一周', status: false}, {name: '15天', status: false}, {name: '自定义', status: false}]
}
