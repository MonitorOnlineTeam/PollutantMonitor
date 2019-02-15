// pages/dataMonitor/dataMonitor.js
import * as echarts from '../../dist/ec-canvas/echarts';
const moment = require('../../utils/moment.min.js')
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chartData: [],
    ec: {
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    xAxisData: [],
    seriesData: [],
    selectedPollutantName: '',
    selectedPollutantCode: '',
    selectedPollutantUnit:'',
    tableDatas: [],
    dataType: 0,
    pollutantDatas: [],
    selectTime: '',
    selectTimeFormat: { 0: 'HH:mm', 1: 'MM-DD HH:mm', 2: 'MM-DD HH:00', 3:'MM-DD'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.getPollutantList();
    this.getData();

  },
  // 分段器切换
  onChange(e) {
    console.log(e)
    console.log(e.detail.key + '-' + this.data.dataType)
    if (e.detail.key !== this.data.dataType) {
      this.setData({
        dataType: e.detail.key
      })
      this.getData();
    }
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

  // 点击按钮后初始化图表
  init: function() {
    this.ecComponent.init((canvas, width, height) => {
      console.log(2)
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
  //获取污染物
  getPollutantList: function() {
    comApi.getPollutantList().then(res => {
      console.log('污染物', res);
      //this.reloadChart();
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        this.setData({
          selectedPollutantCode: thisData[0] && thisData[0].pollutantCode,
          selectedPollutantName: thisData[0] && thisData[0].pollutantName,
          selectedPollutantUnit: thisData[0] && thisData[0].unit,
          pollutantDatas: thisData
        })
      }
    });
  },
  //获取监控数据
  getData: function() {
    let {
      selectedPollutantCode,
      dataType,
      selectTime,
      selectTimeFormat
    } = this.data;
    comApi.getMonitorDatas(selectedPollutantCode, dataType).then(res => {
      console.log('getMonitorDatas', res)
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let xAxisData = [];
        let seriesData = [];
        thisData.map(function(item) {
          item.MonitorTime = moment(item.MonitorTime).format(selectTimeFormat[dataType]);
          xAxisData.push(item.MonitorTime);
          seriesData.push(item[selectedPollutantCode]);
        })
        this.setData({
          xAxisData: xAxisData,
          seriesData: seriesData,
          tableDatas: thisData
        });
        this.init();
      }
    })
  },

  setOption: function(chart) {
    console.log(this.data.xAxisData);
    var option = {
      // title: {
      //   text: '测试下面legend的红色区域不应被裁剪',
      //   left: 'center'
      // },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: ['A'],
      //   // top: 50,
      //   left: 'center',
      //   //backgroundColor: 'red',
      //   z: 100
      // },
      grid: {
        containLabel: true,
        left: '2%',
        top: '10%',
        bottom: '10%'
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.xAxisData,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        name:this.data.selectedPollutantUnit,
        // show: false
      },
      series: [{
        name: this.data.selectedPollutantName,
        type: 'line',
        smooth: true,
        data: this.data.seriesData
      }]
    };
    chart.setOption(option);
  }
})