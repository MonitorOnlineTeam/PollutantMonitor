// pages/historyData/home/home.js
import * as echarts from '../../../dist/ec-canvas/echarts';
const moment = require('../../../utils/moment.min.js')
const app = getApp();
const comApi = app.api;
const common = app.common;
const selectTimeFormat = {
  0: {
    showFormat: 'YYYY-MM-DD HH:mm'
  },
  1: {
    showFormat: 'YYYY-MM-DD HH:00'
  },
  2: {
    showFormat: 'YYYY-MM-DD'
  },
  3: {
    showFormat: 'YYYY-MM'
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DGIMN: '',
    dataType: 0,
    currentDate1: new Date(2018, 2, 31).getTime(),
    minDate: new Date(2018, 0, 1).getTime(),
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    time: '12:01',
    date: '2016-09-01',
    selectedDate: '',
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
      }
    ]
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      dataType: e.currentTarget.dataset.id
    })
  },
  transverse() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  onChangePollutant(e) {

    wx.navigateTo({
      url: '../selectPollutant/selectPollutant'
    })
  },
  onChangeDate(e) {
    wx.navigateTo({
      url: '../selectDateTime/selectDateTime?dataType='+this.data.dataType
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 点击按钮后初始化图表
  init: function() {

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
  horizontalScreen: function() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  setOption: function(chart) {

    const option = {
      color: ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387'],
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
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
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
          areaStyle: {
            normal: {}
          },
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
          areaStyle: {
            normal: {}
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    chart.setOption(option);
  },
  onInput(event) {
    const {
      detail,
      currentTarget
    } = event;
    const result = this.getResult(detail, currentTarget.dataset.type);

    console.log(result);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.setData({
      DGIMN: common.getStorage('DGIMN')
    });
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(common.getStorage('selectedPollutants'));
    // console.log(common.getStorage('selectedDate'));
    this.setData({
      selectedDate: moment(common.getStorage('selectedDate')).format(selectTimeFormat[this.data.dataType].showFormat) 
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取监控数据
  getData: function() {
    let {
      selectedPollutant,
      dataType,
      selectTime,
      selectTimeFormat,
      selectedDate
    } = this.data;
    comApi.getMonitorDatas(selectedPollutant.pollutantCode, dataType, selectedDate).then(res => {
      console.log('getMonitorDatas', res)
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let xAxisData = [];
        let seriesData = [];
        console.log(selectedPollutant)
        thisData.map(function(item) {
          item.MonitorTime = moment(item.MonitorTime).format(selectTimeFormat[dataType].serverFormat);
          xAxisData.push(item.MonitorTime);
          seriesData.push(item[selectedPollutant.pollutantCode] || '0');
        })
        this.setData({
          xAxisData: xAxisData,
          seriesData: seriesData,
          tableDatas: thisData
        });
        this.init();
      }
      wx.hideNavigationBarLoading();
    })
  }
})