/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */
export function mediaExPainFun(arr, obj) {
  let exPain = '图释：'
  let newArr = sortByKey(arr.total, 'value').reverse()
  let justMax = sortByKey(arr.just, 'value').reverse()
  let wellMax = sortByKey(arr.well, 'value').reverse()
  let lossMax = sortByKey(arr.loss, 'value').reverse()

  if (Array.isArray(newArr) && newArr.length) {
    if (newArr.length === 1) {
      exPain += `${getDayTime(obj)}${getRaiseData(obj)}舆情的传播媒体为${newArr[0].name}。`
    }
    if (newArr.length === 2) {
      exPain += `${getDayTime(obj)}${getRaiseData(obj)}舆情的传播媒体中，${newArr[0].name}及${newArr[1].name}的传播数量最多。`
    }
    if (newArr.length >= 3) {
      exPain += `${getDayTime(obj)}${getRaiseData(obj)}舆情的传播媒体中，${newArr[0].name}、${newArr[1].name}及${newArr[2].name}的传播数量排名前三。`
    }
    if (obj.raiseType === 4) {
      exPain += `其中，`
      if (justMax.length) {
        if (wellMax.length === 0 && lossMax.length === 0) {
          exPain += `${getMaxMedia(justMax)}传播的正面舆情数量最多。`
        } else {
          exPain += `${getMaxMedia(justMax)}传播的正面舆情数量最多；`
        }
      }
      if (wellMax.length) {
        if (lossMax.length === 0) {
          exPain += `${getMaxMedia(wellMax)}传播的中性舆情数量最多。`
        } else {
          exPain += `${getMaxMedia(wellMax)}传播的中性舆情数量最多；`
        }
      }
      if (lossMax.length) exPain += `${getMaxMedia(lossMax)}传播的负面舆情数量最多。`
    }
  }
  return exPain
}

/**
 * 计算媒体Max
 * @param arr
 * @returns {string}
 */
function getMaxMedia(arr) {
  let maxArr = []
  if (Array.isArray(arr) && arr.length) {
    arr.forEach(item => {
      if (arr[0].value === item.value) {
        maxArr.push(item.name)
      }
    })
  }
  return maxArr.join('、')
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
 * 数组对象的排序函数
 * @param array
 * @param key
 * @returns {*}
 */
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    let x = parseInt(a[key])
    let y = parseInt(b[key])
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}
