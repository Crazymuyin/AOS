/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */
// import jsTools from './uitls/js.tools'

export function directionExPainFun(arr, obj) {
  let popular = getPopular(arr, obj)
  let expain = `图释：${getDayTime(obj)}相关${getRaiseData(obj)}舆情总计${getTotal(arr)}条，日均${getAverage(arr)}条，整体呈${getDrift(arr)}传播态势。`
  if (obj.raiseType === 4) {
    if (popular.maxArr.just !== 0) expain += `其中，${popular.timeArr.justTime.join(',')}的正面舆情数量最多，为${popular.maxArr.just}条；`
    if (popular.maxArr.loss !== 0) expain += `其中，${popular.timeArr.lossTime.join(',')}的负面舆情数量最多，为${popular.maxArr.loss}条；`
    if (popular.maxArr.well !== 0) expain += `其中，${popular.timeArr.wellTime.join(',')}的中性舆情数量最多，为${popular.maxArr.well}条。`
  }
  if (obj.raiseType === 1) {
    if (popular.maxArr.just !== 0) expain += `${popular.timeArr.justTime.join(',')}的正面舆情数量最多，为${popular.maxArr.just}条。`
  }
  if (obj.raiseType === 2) {
    if (popular.maxArr.well !== 0) expain += `${popular.timeArr.wellTime.join(',')}的中性舆情数量最多，为${popular.maxArr.well}条。`
  }
  if (obj.raiseType === 3) {
    if (popular.maxArr.loss !== 0) expain += `${popular.timeArr.lossTime.join(',')}的负面舆情数量最多，为${popular.maxArr.loss}条。`
  }
  return expain
}

/**
 * 情感
 * @param obj
 * @returns {string}
 */
function getRaiseData(obj) {
  let raise
  let raiseType = obj.raiseType
  switch (raiseType) {
    case 4:
      raise = '全部'
      break
    case 1:
      raise = '正面'
      break
    case 2:
      raise = '中性'
      break
    case 3:
      raise = '负面'
      break
    default:
      raise = '全部'
      break
  }
  return raise
}

/**
 * 时间
 * @param obj
 * @returns {string}
 */
function getDayTime(obj) {
  let dateTime
  let dateType = obj.dateType
  switch (dateType) {
    case 7:
      dateTime = '近7天'
      break
    case 30:
      dateTime = '近30天'
      break
    case 'currentMonth':
      dateTime = '本月'
      break
    default:
      dateTime = '近7天'
      break
  }
  return dateTime
}

/**
 * 总条数
 * @param arr
 * @returns {string}
 */
function getTotal(arr) {
  let total = 0
  if (Array.isArray(arr) && arr.length) {
    if (arr.length === 3) {
      arr[2].forEach(item => {
        item.forEach(list => {
          total += parseInt(list)
        })
      })
    } else {
      total = 0
    }
  }
  return total
}

/**
 * 平均数
 * @param arr
 * @returns {*}
 */
function getAverage(arr) {
  let average = 0
  if (Array.isArray(arr) && arr.length === 3) {
    let total = getTotal(arr)
    let day = arr[1].length
    average = parseInt(parseInt(total) / parseInt(day))
  }
  return average
}

/**
 * 传播趋势
 * @param arr
 * @returns {string}
 */
function getDrift(arr) {
  let str = ''
  let startTotal = 0
  let endTotal = 0
  let percentage = 0
  if (Array.isArray(arr) && arr.length) {
    if (arr.length === 3) {
      arr[2].forEach(item => {
        item.forEach((list, index) => {
          if (index === 0) startTotal += Number(list)
          if (index === item.length - 1) endTotal += Number(list)
        })
      })
      percentage = (Number(endTotal) - Number(startTotal)) / Number(startTotal)
      if (percentage > 0.1) {
        str = '上升'
      } else if (percentage < -0.1) {
        str = '下降'
      } else {
        str = '平稳'
      }
    }
  }
  return str
}

/**
 * 舆情数量统计
 * @param arr
 */
function getPopular(arr) {
  let just, well, loss
  let justTime = []
  let wellTime = []
  let lossTime = []
  if (Array.isArray(arr) && arr.length) {
    let dataArr = arr[2]
    let timeArr = arr[1]
    arr[0].forEach((item, index) => {
      if (item === '正面') {
        just = dataArr[index].reduce((a, b) => {
          return b > a ? b : a
        })
        dataArr[index].forEach((item, index) => {
          if (Number(item) === Number(just)) {
            justTime.push(timeArr[index])
          }
        })
      }
      if (item === '中性') {
        well = dataArr[index].reduce((a, b) => {
          return b > a ? b : a
        })
        dataArr[index].forEach((item, index) => {
          if (item === well) {
            wellTime.push(timeArr[index])
          }
        })
      }
      if (item === '负面') {
        loss = dataArr[index].reduce((a, b) => {
          return b > a ? b : a
        })
        dataArr[index].forEach((item, index) => {
          if (item === loss) {
            lossTime.push(timeArr[index])
          }
        })
      }
    })
  }
  return {
    maxArr: {just: just, well: well, loss: loss},
    timeArr: {justTime: justTime, wellTime: wellTime, lossTime: lossTime}
  }
}
