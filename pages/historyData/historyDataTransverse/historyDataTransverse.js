// pages/historyData/historyDataTransverse/historyDataTransverse.js
import * as echarts from '../../../dist/ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loadProgress: 0,
    time: '12:01',
    isDisposed: false,
    ec: {
      lazyLoad: true
    },
    isLoaded: false,
    TabCur: 0,
    scrollLeft: 0,
    tabList: ['5分钟', '小时', '日', '月'],
    selectTab: 1
  },
  tabSelect(e) {
    console.log(e);
    // this.setData({
    //   TabCur: e.currentTarget.dataset.id,
    //   scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    // })
    this.setData({
      selectTab: e.currentTarget.dataset.id,
      // scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  navigateBack() {
    wx.navigateBack()
  },
  isLoading(e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
  loadModal() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 2000)
  },
  loadProgress() {
    this.setData({
      loadProgress: this.data.loadProgress + 3
    })
    if (this.data.loadProgress < 100) {
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    } else {
      this.setData({
        loadProgress: 0
      })
    }
  },
  transverse() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },

  // 初始化图表
  init: function () {
    this.ecComponent.init((canvas, width, height) => {
      console.log(width, height)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ecComponent = this.selectComponent('#mychart-dom-line');

    console.log(this.ecComponent);
    this.init();
  },
  //图表重绘
  setOption: function (chart) {

    var option = {
      color: ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387'],
      tooltip: {

        trigger: 'axis',

        extraCssText: 'transform: rotate(90deg)'

      },
      grid: {
        right: '20%',
        left: '20%',
        bottom: '2%'
      },
      xAxis: {

        type: 'value', //数据

        position: 'top', //x 轴的位置【top bottom】

        nameRotate: -90, //坐标轴名字旋转，角度值。

        axisLabel: {  //坐标轴刻度标签的相关设置。

          rotate: 90 //刻度标签旋转的角度，

        },

        scale: true, //是否是脱离 0 值比例

      },
      legend: {
        data: ['邮件营销', '联盟广告'],
        // right: '0%',
        // top:'30%',
        // orient: 'vertical',
        rotate: -90
      },
      yAxis: {

        type: 'category',

        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

        inverse: 'true', //是否是反向坐标轴。

        axisLabel: {

          rotate: -90

        },

      },

      series: [{
        name: '邮件营销',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        areaStyle: {},
        type: 'line',
        smooth: true //是否平滑曲线显示
      },
      {
        name: '联盟广告',
        data: [720, 932, 501, 834, 790, 1330, 1320],
        areaStyle: {},
        type: 'line',
        smooth: true //是否平滑曲线显示
      }]
    };
    chart.setOption(option);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let that = this;
    // that.init();
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