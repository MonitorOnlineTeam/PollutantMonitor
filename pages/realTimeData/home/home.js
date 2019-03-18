// pages/realTimeData/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
        "PollutantName": "二氧化硫",
        "MonitorValue": "250",
        "Unit": "mg/m³",
        "States": "异常",
      },
      {
        "PollutantName": "氮氧化物",
        "MonitorValue": "250",
        "Unit": "mg/m³",
        "States": "正常",
      },
      {
        "PollutantName": "烟尘",
        "MonitorValue": "150",
        "Unit": "mg/m³",
        "States": "异常",
      },
      {
        "PollutantName": "实测烟尘",
        "MonitorValue": "100",
        "Unit": "mg/m³",
        "States": "超标",
      },
      {
        "PollutantName": "流量",
        "MonitorValue": "200",
        "Unit": "mg/m³",
        "States": "超标",
      },
      {
        "PollutantName": "温度",
        "MonitorValue": "100",
        "Unit": "mg/m³",
        "States": "正常",
      },
      {
        "PollutantName": "压力",
        "MonitorValue": "100",
        "Unit": "mg/m³",
        "States": "正常",
      }
    ],
    MonitorTimes:"2019-3-18 00:00:00",
    States:"正常",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }
})