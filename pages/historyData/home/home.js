// pages/historyData/home/home.js
import * as echarts from '../../../dist/ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    time: '12:01',
    date: '2016-09-01',
    TabCur: 0,
    scrollLeft: 0,
    tabList: ['5分钟', '小时', '日', '月'],
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    ColorList: [{
      title: 'SO2',
      value: '139',
      unit: 'mg/L'
    },
    {
      title: 'NOX',
      value: '139',
      unit: 'mg/L'
    },
    {
      title: 'NOX',
      value: '139',
      unit: 'mg/L'
    },
    {
      title: 'NOX',
      value: '139',
      unit: 'mg/L'
    }]
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  transverse() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  showModal(e) {
    // this.setData({
    //   modalName: e.currentTarget.dataset.target
    // })
    wx.navigateTo({
      url: '../selectPollutant/selectPollutant'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 点击按钮后初始化图表
  init: function () {

    this.ecComponent.init((canvas, width, height) => {

      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  horizontalScreen: function () {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  setOption: function (chart) {
    //color: ['#37a2da', '#32c5e9', '#67e0e3'],
    // const option = {
    //   color: ['#feac36', 'rgb(27,208,129)', '#8f3ee9','#fb0c28','#3558ef','#30c8e3','#e94810'],
    //   animation: true,
    //   legend: {
    //     top: 'top',
    //     data: ['NOX','SO2']
    //   },
    //   tooltip: {
    //     triggerOn: 'none',
    //     position: function (pt) {
    //       return [pt[0], 130];
    //     }
    //   },
    //   xAxis: {
    //     type: 'time',
    //     // boundaryGap: [0, 0],
    //     axisPointer: {
    //       value: '2016-10-7',
    //       snap: true,
    //       lineStyle: {
    //         color: '#004E52',
    //         opacity: 0.5,
    //         width: 2
    //       },
    //       label: {
    //         show: true,
    //         formatter: function (params) {
    //           return echarts.format.formatTime('yyyy-MM-dd', params.value);
    //         },
    //         backgroundColor: '#004E52'
    //       },
    //       handle: {
    //         show: true,
    //         color: '#004E52'
    //       }
    //     },
    //     splitLine: {
    //       show: false
    //     }
    //   },
    //   yAxis: {
    //     type: 'value',
    //     axisTick: {
    //       inside: true
    //     },
    //     splitLine: {
    //       show: false
    //     },
    //     axisLabel: {
    //       inside: true,
    //       formatter: '{value}\n'
    //     },
    //     z: 10
    //   },
    //   grid: {
    //     top: '20%',
    //     left: 15,
    //     right: 15,
    //     height: 160
    //   },
    //   dataZoom: [{
    //     type: 'inside',
    //     throttle: 30
    //   }],
    //   series: [
    //     {
    //       name: 'NOX',
    //       type: 'line',
    //       smooth: true,
    //       symbol: 'circle',
    //       symbolSize: 5,
    //       sampling: 'average',
    //       itemStyle: {
    //         normal: {
    //           color: '#feac36'
    //         }
    //       },
    //       stack: 'a',
    //       areaStyle: {
    //         normal: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: '#feac36'
    //           }, {
    //             offset: 1,
    //             color: '#ffe'
    //           }])
    //         }
    //       },
    //       data: [2,1, 6, 5, 6, 7, 8]
    //     },
    //     {
    //       name: 'SO2',
    //       type: 'line',
    //       smooth: true,
    //       stack: 'a',
    //       symbol: 'circle',
    //       symbolSize: 5,
    //       sampling: 'average',
    //       itemStyle: {
    //         normal: {
    //           color: 'rgb(27,208,129)'
    //         }
    //       },
    //       areaStyle: {
    //         normal: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: 'rgb(27,208,129)'
    //           }, {
    //             offset: 1,
    //             color: '#ffe'
    //           }])
    //         }
    //       },
    //       data: [1,3,4,5,6,7,8]
    //     }

    //   ]
    // };

    const option = {
      color: ['#feac36', 'rgb(27,208,129)', '#8f3ee9', '#fb0c28', '#3558ef', '#30c8e3', '#e94810'],
      // title: {
      //   text: '堆叠区域图'
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: { normal: {} },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    chart.setOption(option);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})