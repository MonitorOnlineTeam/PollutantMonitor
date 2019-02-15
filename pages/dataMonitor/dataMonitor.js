// pages/dataMonitor/dataMonitor.js
import * as echarts from '../../dist/ec-canvas/echarts';
const app = getApp()
const comApi = app.api;
const common = app.common;
var wxCharts = require('../../utils/wxcharts-min.js');
var lineChart = null;
function initCharts(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    // title: {
    //   text: '测试下面legend的红色区域不应被裁剪',
    //   left: 'center'
    // },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['A'],
      // top: 50,
      left: 'center',
      //backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周四', '周五', '周六', '周1', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '周四', '周五', '周六', '周1'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33, 18, 36, 65, 30, 18, 36, 65, 30, 78, 40, 33, 18, 36, 65, 30]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chartData:[],
    ec: {
      onInit: initCharts
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();

  },
  // 分段器切换
  onChange(e) {
    console.log(e)

    if (e.detail.key === this.key) {
      return wx.showModal({
        title: 'No switching is allowed',
        showCancel: !1,
      })
    }

    this.setData({
      current: e.detail.key,
    })
  },
  ontouchstart: function(e) {



    lineChart.scrollStart(e); //开始滚动

  },

  onTouchMove: function(e) {


    lineChart.scroll(e);

  },

  ontouchend: function(e) {


    lineChart.scrollEnd(e);

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
   /**
   * 刷新数据
   */
  getData:function(){
    //
    comApi.getPollutantList().then(res=>{
      console.log('污染物',res);
      this.reloadChart();
    });

    comApi.getMonitorDatas('02', 'realtime').then(res => {
      console.log('getMonitorDatas', res)
      this.reloadChart();
   })

    
  },

  reloadChart:function(){
    var windowWidth = '',
      windowHeight = ''; //定义宽高
    try {
      var res = wx.getSystemInfoSync(); //试图获取屏幕宽高数据
      windowWidth = res.windowWidth / 750 * 750;
      windowHeight = res.windowWidth / 750 * 300
    } catch (e) {
      console.error('失败?');
    }
    lineChart = new wxCharts({ //定义一个wxCharts图表实例
      canvasId: 'lineCanvas', //输入wxml中canvas的id
      type: 'line', //图标展示的类型有:'line','pie','column','area','ring','radar'
      categories: ['3:00', '4:00', '4:00', '6:00', '7:00', '8:00', '9:00', '1:00', '2:00', '3:00'], //模拟的x轴横坐标参数
      animation: true, //是否开启动画
      series: [{ //具体坐标数据
        color: "#56A6FF",
        data: [60, 90, 60, 110, 120, 105, 70, 120, 105, 70], //数据点

      }],
      xAxis: { //是否隐藏x轴分割线
        disableGrid: true,

      },
      yAxis: { //y轴数据
        //标题
        format: function (val) { //返回数值
          return val.toFixed(1);
        },
        min: 30, //最小值
        max: 180, //最大值
        gridColor: '#ececec',
      },
      legend: false, //是否显示图例
      enableScroll: true, //是否滚动
      width: windowWidth, //图表展示内容宽度
      height: windowHeight, //图表展示内容高度
      dataLabel: false, //是否在图表上直接显示数据
      dataPointShape: true, //是否在图标上显示数据点标志
      extra: {
        lineStyle: 'curve' //曲线
      },
    });
  }
})