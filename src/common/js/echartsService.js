/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */

// 扇形统计图
function homeSpreadPie (data) {
  let legendData = data.legend
  let list = data.data
  let tempData = list.sort(sortByVal)
  let color = ['#fe6363', '#fcb92c', '#fe63ea', '#9a7dd3', '#459dde', '#11c4ab', '#32cb32', '#5e7e8e']
  tempData.forEach(function(item, index) {
    item['color'] = color[index]
  })
  let seriesData = []
  legendData.forEach(function(item) {
    tempData.forEach(function(val) {
      if (val.name === item) {
        seriesData.push(val)
      }
    })
  })
  function sortByVal(x, y) {
    return (x['value'] < y['value']) ? 1 : -1
  }
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>数量：{c} ({d}%)',
      extraCssText: 'z-index: 1;'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      selectedMode: false,
      data: legendData
    },
    series: [{
      type: 'pie',
      center: ['50%', '39%'],
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: '{b} \n {d}%'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: (function () {
        let tempList = []
        seriesData.forEach(function(item) {
          tempList.push({
            name: item.name,
            value: item.value,
            itemStyle: {
              normal: {
                color: item.color
              }
            }
          })
        })
        return tempList
      }())
    }]
  }
}

// 折线统计图
function homeThemeCharts (data) {
  return {
    tooltip: {
      trigger: 'axis',
      extraCssText: 'z-index: 1;'
    },
    legend: {
      orient: 'horizontal',
      right: '3%',
      data: data.legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: (function () {
      let itemArr = []
      data.legend.forEach(function (list, index) {
        let item = {
          name: list,
          type: 'line',
          smooth: true,
          data: data.data[index]
        }
        itemArr.push(item)
      })
      return itemArr
    }())
  }
}

// 舆情走势折线图
function directionCharts (data) {
  let colorArr = ['#fe6363', '#fcb92c', '#fe63ea']
  return {
    color: ['#fe6363', '#fcb92c', '#fe63ea'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
      // formatter: function (params) {
      //   let result = ''
      //   params.forEach((list) => {
      //     let item = {
      //       month: list.axisValue.substr(0, 2),
      //       time: list.axisValue.substr(3, 2),
      //       value: list.value
      //     }
      //     result = item.month.replace(/\b(0+)/gi, '') + '月' + item.time.replace(/\b(0+)/gi, '') + '日：' + item.value + '条数据'
      //   })
      //   return result
      // }
    },
    legend: {
      data: data[0],
      bottom: '0'
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '18%',
      bottom: '20%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[1],
      name: '时间',
      axisTick: {
        lineStyle: {
          color: '#11C4AB'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '数量',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false,
        nameTextStyle: {
          align: 'left'
        }
      }
    },
    series: (function () {
      let seriesArr = []
      data[2].forEach((list, index) => {
        let item = {
          name: data[0][index],
          type: 'line',
          smooth: true,
          data: list,
          lineStyle: {
            color: colorArr[index]
          }
        }
        seriesArr.push(item)
      })
      return seriesArr
    }())
  }
}

// 平台分布扇形图
function platformCharts (data, percentArr, index, callback) {
  return {
    color: ['#fe6363', '#fcb92c', '#fe63ea', '#9a7dd3', '#459dde', '#11c4ab', '#32cb32', '#5e7e8e'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>数量：{c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      data: data[0],
      bottom: 0,
      itemGap: 5
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['50%', '70%'],
        hoverOffset: 7,
        avoidLabelOverlap: true,
        label: {
          normal: {
            textStyle: {
              fontSize: 12
            },
            formatter: function (params) {
              if (params.name) percentArr.push({name: params.name, percent: params.percent})
              if (index++ === data[0].length) {
                callback(percentArr)
              }
              return `${params.name} ${params.percent}%`
            }
          }
        },
        labelLine: {
          normal: {
            length: 8,
            length2: 5,
            lineStyle: {
              color: '#235894'
            }
          }
        },
        data: data[1]
      }
    ]
  }
}

// 媒体分布扇形图
function mediaCharts (data) {
  return {
    color: ['#fe6363', '#fcb92c', '#fe63ea', '#9a7dd3', '#459dde', '#11c4ab', '#32cb32', '#5e7e8e'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br>数量：{c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      data: data[0],
      itemGap: 5
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['50%', '70%'],
        hoverOffset: 7,
        avoidLabelOverlap: true,
        label: {
          normal: {
            textStyle: {
              fontSize: 12
            },
            formatter: '{b} {d}%'
          }
        },
        labelLine: {
          normal: {
            length: 8,
            length2: 5,
            lineStyle: {
              color: '#235894'
            }
          }
        },
        data: data[1]
      }
    ]
  }
}

// 风险网名分布扇形图
function riskCharts (data) {
  data.forEach(item => {
    item.name.length > 6 ? item.label = item.name.substr(0, 6) + '...' : item.label = item.name
  })
  return {
    tooltip: {
      show: true,
      formatter: function (params) {
        return `${params.marker} ${params.data.label}：${params.data.value}条`
      }
    },
    series: [{
      shape: 'circle',
      type: 'wordCloud',
      center: ['50%', '50%'],
      size: ['100%', '100%'],
      left: 'center',
      top: 'center',
      sizeRange: [15, 24],
      rotationRange: [0, 45, 90, 135],
      rotationStep: 45,
      gridSize: 8,
      padding: 0,
      drawOutOfBound: false,
      textPadding: 0,
      textStyle: { // 文字样式设置
        normal: {
          color: function() { // 颜色
            return 'rgb(' + [ // 返回随机生成的颜色
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')'
          }
        }
      },
      data: (function () {
        let itemArr = []
        data.forEach(list => {
          let item = {
            id: list.id,
            name: list.label,
            label: list.name,
            riskValueMax: list.riskValueMax,
            value: list.value
          }
          itemArr.push(item)
        })
        return itemArr
      }())
    }]
  }
}

/**
 * 舆情分析-近期风险分析-风险摘要：风险程度 仪表盘
 * @param data
 * @param seriesSite
 * @param splitLine
 * @returns {{series: {pointer: {length: string, width: number}, startAngle: number, data: *, center: *, endAngle: number, splitNumber: number, title: {show: boolean}, type: string, axisLabel: {show: boolean}, axisLine: {lineStyle: {color: *[][], width: *}}, name: *, splitLine: {lineStyle: {color: string, width: number}, length: *}, axisTick: {lineStyle: {color: string, width: number}}, radius: *}[], tooltip: {formatter: string}, toolbox: {feature: {saveAsImage: {}, restore: {}}, show: boolean}}}
 */
function riskGauge(data, seriesSite, splitLine) {
  return {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}分'
    },
    toolbox: {
      show: false,
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        title: {
          'show': false
        },
        name: seriesSite[0],
        type: 'gauge',
        center: seriesSite[1],
        radius: seriesSite[2],
        startAngle: 180,
        endAngle: 0,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: seriesSite[3],
            // color: [[0.2, '#5ec79c'], [0.4, '#00f8ff'], [0.6, '#297fff'], [0.8, '#fb8b1d'], [1, '#ee2228']]
            color: [[0.3, '#5ec79c'], [0.5, '#297fff'], [0.84, '#fb8b1d'], [1, '#ee2228']]
          }
        },
        splitLine: {
          length: splitLine,
          lineStyle: {
            width: 1,
            color: '#A8A8A8'
          }
        },
        axisTick: {
          lineStyle: {
            width: 1,
            color: '#A8A8A8'
          }
        },
        axisLabel: {
          show: false
        },
        pointer: {
          length: '80%',
          width: 5
        },
        data: data
      }
    ]
  }
}

/**
 * 舆情分析-近期风险分析-风险网民分布：ECharts2 字符云
 * @param seriesData
 * @returns {{grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean}, series: {sizeRange: number[], shape: string, data: *, bottom: null, right: null, type: string, rotationRange: number[], gridSize: number, size: string[], top: string, left: string, width: string, drawOutOfBound: boolean, rotationStep: number, textStyle: {normal: {color: (function(): string)}, emphasis: {shadowBlur: number, shadowColor: string}}, height: string}[], tooltip: {}, title: {subtext: string, x: string, text: string}}}
 */
function riskWordCloud(seriesData) {
  seriesData.forEach(item => {
    // item.name.length > 2 ? item.label = item.name.substr(0, 2) + '...' : item.label = item.name
    item.label = item.name
  })
  return {
    title: {
      text: '',
      subtext: '',
      x: 'center'
    },
    tooltip: {
      show: true,
      formatter: function (params) {
        return `${params.marker} ${params.data.label}：${params.data.value}条`
      }
    },
    grid: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      containLabel: true
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      // maskImage: maskImage,
      size: ['90%', '90%'],
      left: 'center',
      top: 'center',
      width: '80%',
      height: '80%',
      right: null,
      bottom: null,
      sizeRange: [12, 20],
      rotationRange: [0, 45, 90, -45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        normal: {
          // fontFamily: 'sans-serif', fontWeight: 'bold',
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')'
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#ccc'
        }
      },
      data: (function () {
        let itemArr = []
        seriesData.forEach(list => {
          let item = {
            name: list.label,
            label: list.name,
            value: list.value
          }
          itemArr.push(item)
        })
        return itemArr
      }())
    }]
  }
}

/**
 * 信息发布热区
 */
function mapInfoHots(serverData, max) {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 条'
    },
    visualMap: {
      type: 'continuous',
      text: ['', ''],
      showLabel: true,
      left: '50',
      bottom: '40',
      itemWidth: 15,
      itemHeight: 95,
      min: 0,
      max: max,
      calculable: true,
      splitNumber: 0,
      inRange: {
        color: ['#e0ffff', '#006edd']
        // color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096']
      },
      textStyle: {
        color: '#000'
      }
    },
    toolbox: {
      show: false,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    series: [{
      type: 'map',
      mapType: 'china',
      zoom: 1.2,
      left: 200,
      itemStyle: {
        borderColor: '#b3b3b3'
      },
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      data: serverData
    }]
  }
}

/**
 * 微博专项分析扇形
 * @param data
 * @param legend
 * @returns {{tooltip: {trigger: string, formatter: string}, legend: {x: string, bottom: number, data: *}, series: *[]}}
 */
function emotionAnalysis(data, legend) {
  let color = {'正面': '#46a1e3', '中性': '#fe9d00', '负面': '#fe6362'}
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/> {c} 条 ({d}%)'
    },
    legend: {
      x: 'center',
      bottom: 20,
      data: legend
    },
    series: [{
      type: 'pie',
      selectedMode: 'single',
      center: ['50%', '40%'],
      radius: ['45%', '65%'],
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      data: (function () {
        let list = []
        data.forEach(vo => {
          let item = {
            name: vo.name,
            value: vo.value,
            itemStyle: {
              normal: {
                color: color[vo.name]
              }
            }
          }
          list.push(item)
        })
        return list
      }())
    }]
  }
}

/**
 * 微博热词分析
 * @param data
 * @param legend
 * @returns {{tooltip: {trigger: string, formatter: (function(*): string)}, grid: {top: string, left: string, right: string, bottom: string}, xAxis: {type: string, data: *}, yAxis: {type: string}, series: *[]}}
 */
function riskAnalysis(data, legend) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return params.data.name + ':  ' + params.data.value + '条'
      }
    },
    grid: {
      top: '15%',
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: legend
    },
    yAxis: {
      name: '数量',
      type: 'value'
    },
    series: [{
      data: data,
      type: 'bar',
      barWidth: 30,
      itemStyle: {
        normal: {
          color: '#37A5EE'
        }
      }
    }]
  }
}

/**
 * 博主分析扇形统计图
 * @param data
 * @param legend
 * @returns {{tooltip: {trigger: string, formatter: string}, legend: {x: string, bottom: number, data: *}, series: *[]}}
 */
function blogAnalysis(data, legend) {
  let color = ['#fe9d00', '#fc6464', '#9b7ed3', '#46ale3', '#12c5ab', '#11c4ab', '#32cb32', '#5e7e8e']
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/> 数量:{c} ({d}%)'
    },
    legend: {
      x: 'center',
      bottom: 20,
      data: legend
    },
    series: [{
      type: 'pie',
      selectedMode: 'single',
      center: ['50%', '40%'],
      radius: ['45%', '65%'],
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      data: (function () {
        let list = []
        data.forEach((vo, index) => {
          let item = {
            name: vo.name,
            value: vo.value,
            itemStyle: {
              normal: {
                color: color[index]
              }
            }
          }
          list.push(item)
        })
        return list
      }())
    }]
  }
}

function netZenBarCharts(data, legend) {
  return {
    tooltip: {
      trigger: 'axis'
      // textStyle: {
      //   align: 'left',
      //   color: '#37A5EE',
      //   // color: '#fff',
      //   fontSize: '14'
      // }
    },
    label: {
      normal: {
        textStyle: {
          color: '#37A5EE'
        }
      },
      emphasis: {
        textStyle: {
          color: '#37A5EE'
        }
      }
    },
    grid: {
      top: '10%',
      left: '5%',
      right: '15%',
      bottom: '10%',
      containLabel: true
    },
    yAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#000'
        }
      },
      axisTick: {
        show: false,
        interval: 0,
        alignWithLabel: true
      },
      axisLabel: {
        interval: 0,
        rotate: '0',
        textStyle: {
          fontSize: 10,
          color: '#000'
        },
        formatter: function (params) {
          if (params.length > 5) {
            return params.substr(0, 5) + '...'
          } else {
            return params
          }
        }
      },
      data: legend,
      splitLine: {
        show: false,
        lineStyle: {
          color: ['rgba(138, 199, 255, .2)']
        }
      }
    },
    xAxis: {
      type: 'value',
      name: '数量',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#000'
        }
      }
    },
    series: [{
      name: '数量',
      type: 'bar',
      barWidth: 10,
      label: {
        normal: {
          show: true,
          position: 'right',
          color: '#000',
          formatter: '{c}'
        }
      },
      itemStyle: {
        normal: {
          borderWidth: '0',
          barBorderRadius: [0, 10, 10, 0],
          borderColor: '#37A5EE',
          color: '#37A5EE'
        }
        // emphasis: {
        //   barBorderColor: '#37A5EE',
        //   barBorderWidth: '1'
        //   // color: 'rgba(26,177,98,.8)'
        // }
      },
      data: data
    }]
  }
}

module.exports = {
  homeSpreadPie,
  homeThemeCharts,
  directionCharts,
  platformCharts,
  mediaCharts,
  riskCharts,
  riskGauge,
  riskWordCloud,
  mapInfoHots,
  emotionAnalysis,
  riskAnalysis,
  blogAnalysis,
  netZenBarCharts
}
