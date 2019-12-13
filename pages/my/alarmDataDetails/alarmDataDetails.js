const moment = require('../../../utils/moment.min.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DGIMN: "",
    entCode: "",
    beginTime: "",
    endTime: "",
    pageIndex: 1,
    pageSize: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options) {
      this.setData({
        DGIMN: options.DGIMN,
        entCode: options.entCode,
        beginTime: options.beginTime,
        endTime: options.endTime
      });
      this.onPullDownRefresh();
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
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getAlarmData();
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
  getAlarmData: function() {
    let beginTime = this.data.beginTime;
    let endTime = this.data.endTime;
    let entCode = this.data.entCode;
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    let DGIMN = this.data.DGIMN;
    comApi.getAlarmDataList(beginTime, endTime,
      entCode, pageIndex, pageSize, DGIMN).then(res => {
      let alarmData = [];
      if (res && res.IsSuccess) {

        var thisData = res.Datas;

        thisData.map(item => {
          alarmData.push(item)
        })

        this.setData({
          alarmData: alarmData
        })
      }
      
      wx.hideNavigationBarLoading();
    })
  }
})