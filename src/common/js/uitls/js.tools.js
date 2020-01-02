// /**
//  * Author: $[USERNAME]
//  * Created by $[USER] on $[DATE]
//  */
// function cacl(arr, callback) {
//   var ret
//   for (var i = 0; i < arr.length; i++) {
//     ret = callback(arr[i], ret)
//   }
//   return ret
// }
//
// function arrMaxNum(arr) {
//   return cacl(arr, function (item, max) {
//     if (!(max > item)) {
//       return item
//     } else {
//       return max
//     }
//   })
// }
//
// function arrMinNum(arr) {
//   return cacl(arr, function (item, min) {
//     if (!(min < item)) {
//       return item
//     } else {
//       return min
//     }
//   })
// }
//
// function arrAverageNum(arr) {
//   if (arr.length === 0) {
//     return 0
//   }
//   return arrSumNum(arr) / arr.length
// }
//
// module.exports = {
//   arrMaxNum: arrMaxNum,
//   arrMinNum: arrMinNum,
//   arrAverageNum: arrAverageNum
// }
