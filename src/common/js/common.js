export function editBody(status, topValue, callBack) {
  if (status === 'open') {
    // callback(ScollPostion().top)
    // window.scrollTo(topValue, 0)
    document.body.style.overflowY = 'hidden'
  }
  if (status === 'detailClose') {
    document.body.style.overflowY = 'auto'
    if (typeof callBack === 'function') callBack(true)
  }
  if (status === 'close') {
    window.scrollTo(0, topValue)
    document.body.style.overflowY = 'auto'
  }
}

export function ScollPostion() {
  let t, l, w, h
  if (document.documentElement && document.documentElement.scrollTop) {
    t = document.documentElement.scrollTop
    l = document.documentElement.scrollLeft
    w = document.documentElement.scrollWidth
    h = document.documentElement.scrollHeight
  } else if (document.body) {
    t = document.body.scrollTop
    l = document.body.scrollLeft
    w = document.body.scrollWidth
    h = document.body.scrollHeight
  }
  return {
    top: t,
    left: l,
    width: w,
    height: h
  }
}

export function transSpaceToEnter(str) {
  let tempStr = str.replace(/\s/g, '\n').split('\n')
  let result = []
  tempStr.forEach(function (item) {
    if (item !== '') {
      result.push(item)
    }
  })
  return result.join('\n')
}

export function transEnterToSpace(str) {
  let tempStr = str.replace(/\s/g, ' ').split(' ')
  let result = []
  tempStr.forEach(function (item) {
    if (item !== '') {
      result.push(item)
    }
  })
  return result.join(' ')
}

export function timeFormate(timeStamp) {
  let year = new Date(timeStamp).getFullYear()
  let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
  let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
  let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
  let mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
  let ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()
  let nowTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss
  let yearMonthDay = year + '年' + month + '月' + date + '日'
  let hours = hh + ':' + mm + ':' + ss
  return {
    nowTIme: nowTime,
    yearMonthDay: yearMonthDay,
    hours: hours,
    year: year,
    month: month,
    day: date
  }
}

export function addKeyStyleForContent (content, keys) {
  keys.split(',').forEach(item => {
    content = content.replace(new RegExp(item, 'g'), `<span style='color: red;'>${item}</span>`)
  })
  return content
}
