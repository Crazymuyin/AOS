/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */
export function platformExPainFun(data, percent, obj) {
  let topPercent = getTopPercent(data.total)
  let exPain
  topPercent = topPercent.filter((item) => parseFloat(item.percent))
  percent = percent.filter((item) => item.percent)
  if (Array.isArray(topPercent) && topPercent.length && Array.isArray(percent) && percent.length) {
    topPercent.forEach(item => {
      percent.forEach(list => {
        if (item.name === list.name) {
          item.percent = `${list.percent}%`
        }
      })
    })
  }
  if (topPercent.length === 1) {
    exPain = obj.raiseType === 4 ? `图释：${getDayTime(obj)}舆情传播载体为${topPercent[0].name}，此类平台主要关注${getFollow(data, topPercent[0].name)}舆情。` : `图释：${getDayTime(obj)}舆情传播载体为${topPercent[0].name}。`
  } else {
    exPain = `图释：${getDayTime(obj)}${getRaiseData(obj)}舆情传播载体包括${getWebType(data.total)}。`
    topPercent.forEach((item, index) => {
      if (index === 0) {
        if (obj.raiseType === 4) {
          exPain += `其中，${topPercent[index].name}的舆情数量最多，共${topPercent[index].value}条，占比为${topPercent[index].percent}，此类平台主要关注${getFollow(data, topPercent[index].name)}舆情；`
        } else {
          exPain += `其中，${topPercent[index].name}的舆情数量最多，共${topPercent[index].value}条，占比为${topPercent[index].percent}；`
        }
      }
      if (index === 1) {
        if (topPercent.length === 2) {
          if (obj.raiseType === 4) {
            exPain += `其次是${topPercent[index].name}，共${topPercent[index].value}条，占比为${topPercent[index].percent}，此类平台主要关注${getFollow(data, topPercent[index].name)}舆情；`
          } else {
            exPain += `其次是${topPercent[index].name}，共${topPercent[index].value}条，占比为${topPercent[index].percent}；`
          }
        } else {
          if (obj.raiseType === 4) {
            exPain += `其次是${topPercent[index].name}，共${topPercent[index].value}条，占比为${topPercent[index].percent}，此类平台主要关注${getFollow(data, topPercent[index].name)}舆情。`
          } else {
            exPain += `其次是${topPercent[index].name}，共${topPercent[index].value}条，占比为${topPercent[index].percent}。`
          }
        }
      }
      if (index === 2) {
        if (obj.raiseType === 4) {
          exPain += `第三是${topPercent[2].name}，共${topPercent[2].value}条，占比为${topPercent[2].percent}，此类平台主要关注${getFollow(data, topPercent[index].name)}舆情。`
        } else {
          exPain += `第三是${topPercent[2].name}，共${topPercent[2].value}条，占比为${topPercent[2].percent}。`
        }
      }
    })
  }
  return exPain
}

/**
 * 数组对象求和
 * @param arr
 * @param params
 */
export function platformObjSum(arr, ...params) {
  let temp = {}
  if (Array.isArray(arr) && arr.length) {
    arr.forEach((item, index) => {
      for (let i in item) {
        if (params.indexOf(i) >= 0) {
          if (typeof item[i] === 'string') {
            item[i] = item[i] * 1
          }
          if (temp[i]) {
            temp[i] += temp[i]
          } else {
            temp[i] = item[i]
          }
        }
      }
    })
  }
  return temp
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
      raise = ''
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
 * 平台类型
 * @param arr
 */
function getWebType(arr) {
  let typeArr = []
  let typeStr
  if (Array.isArray(arr) && arr.length) {
    arr.forEach(item => {
      if (item.value) typeArr.push(item.name)
    })
  }
  typeStr = typeArr.slice(0, typeArr.length - 1).join('、') + '及' + typeArr[typeArr.length - 1]
  return typeStr
}

function getFollow(data, type) {
  let str
  let strArr = []
  let justTotal = 0
  let wellTotal = 0
  let lossTotal = 0
  let newArr = []

  if (Array.isArray(data.just) && data.just.length) {
    newArr.push({value: '正面', total: getMax(data.just, type)})
  } else {
    newArr.push({value: '正面', total: justTotal})
  }
  if (Array.isArray(data.well) && data.well.length) {
    newArr.push({value: '中性', total: getMax(data.well, type)})
  } else {
    newArr.push({value: '中性', total: wellTotal})
  }
  if (Array.isArray(data.loss) && data.loss.length) {
    newArr.push({value: '负面', total: getMax(data.loss, type)})
  } else {
    newArr.push({value: '负面', total: lossTotal})
  }
  sortByKey(newArr, 'total').reverse()

  newArr.forEach(item => {
    if (newArr[0].total === item.total) {
      strArr.push(item.value)
    }
  })

  if (strArr.length === 3 && Array.isArray(strArr)) strArr = ['中性']

  str = strArr.reverse().join('、')

  return str
}

function getMax(arr, type) {
  let total = 0
  if (Array.isArray(arr) && arr.length) {
    arr.forEach(item => {
      if (type === item.name) total += item.value
    })
  }
  return total
}

function getTopPercent(arr) {
  sortByKey(arr, 'value').reverse()
  let total = 0
  arr.forEach(item => {
    total += item.value
  })
  arr.forEach(item => {
    item.percent = getPercent(item.value, total)
  })
  return arr
}

/**
 * 数组对象的排序函数 从小到大
 * @param array
 * @param key
 * @returns {*}
 */
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    let x = a[key]
    let y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

/**
 * 计算百分比
 * @param num
 * @param total
 * @returns {string}
 * @constructor
 */
function getPercent(num, total) {
  num = parseFloat(num)
  total = parseFloat(total)
  if (isNaN(num) || isNaN(total)) {
    return '-'
  }
  return total <= 0 ? '0%' : (Math.round(num / total * 10000) / 100.00) + '%'
}
