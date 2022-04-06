// pages/alarm/index.js
import request from '../../utils/request'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmDataList: [],
    _pageIndex: 1,
    _total: 0,
  },

  // 获取报警列表数据
  GetAlarmDataList() {
    request.post({
      url: 'GetAlarmDataList',
      data: {
        "BeginTime": moment().format('YYYY-MM-DD 00:00:00'),
        "EndTime": moment().format("YYYY-MM-DD 23:59:59"),
        "PageIndex": this.data._pageIndex,
        "PageSize": 20
      }
    }).then(result => {
      console.log('result=', result);
      if (result.data && result.data.IsSuccess) {
        this.setData({
          alarmDataList: result.data.Datas,
          _total: result.data.Total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetAlarmDataList();
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
    console.log(123);
    if (this.data.alarmDataList.length != this.data._total) {
      this.data._pageIndex = 1 + this.data._pageIndex;
      request.post({
        url: 'GetAlarmDataList',
        data: {
          "BeginTime": moment().format('YYYY-MM-DD 00:00:00'),
          "EndTime": moment().format("YYYY-MM-DD 23:59:59"),
          "PageIndex": this.data._pageIndex,
          "PageSize": 20
        }
      }).then(result => {
        console.log('result=', result);
        if (result.data && result.data.IsSuccess) {
          this.setData({
            alarmDataList: this.data.alarmDataList.concat(result.data.Datas),
            _total: result.data.Total
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 下拉刷新
  onPullDownRefresh() {
    this.data._pageIndex = 1;
    this.GetAlarmDataList();
  }
})