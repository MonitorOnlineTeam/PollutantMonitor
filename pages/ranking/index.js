// pages/ranking/index.js
import request from '../../utils/request'
import moment from 'moment'

const pageSelectTimeFormat = {
  0: {
    showFormat: 'YYYY-MM-DD HH:mm',
    chartFormat: 'HH:mm'
  },
  1: {
    showFormat: 'YYYY-MM-DD HH:00',
    chartFormat: 'HH:mm'
  },
  2: {
    showFormat: 'YYYY-MM-DD',
    chartFormat: 'HH:mm'
  },
  3: {
    showFormat: 'YYYY-MM',
    chartFormat: 'MM-DD'
  },
  4: {
    showFormat: 'YYYY',
    chartFormat: 'MM-DD'
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    airPointRankingList: [],
    selectedDate: moment().format("YYYY-MM-DD HH:00"),
    dataType: 1,
    _tabs: ['小时', '日均', '月均', '年均'],
  },

  changeTabs(key) {
    const activeKey = key.detail.activeKey;
    this.data.dataType = activeKey;
    this.GetAirPointRanking();
    this.setData({
      selectedDate: moment(wx.getStorageSync('selectedDate')).format(pageSelectTimeFormat[activeKey].showFormat),
    })
  },

  // 跳转选择时间
  onChangeDate(event) {
    console.log('e=', event);
    wx.navigateTo({
      url: '/pages/date-picker/index?dataType=' + this.data.dataType
    })
  },

  // 获取站点排名
  GetAirPointRanking() {
    const datatype = this.data.dataType;
    let selectedDate = wx.getStorageSync('selectedDate')
    // let beginTime = '';
    let _dataType;
    switch (datatype + "") {
      case '1':
        _dataType = 'HourData';
        break;
      case '2':
        _dataType = 'DayData';
        break;
      case '3':
        _dataType = 'MonthData';
        break;
      case '4':
        _dataType = 'YearData';
        break;
    }
    request.post({
      url: 'GetAirPointRanking',
      data: {
        "DataType": _dataType,
        "DateTime": moment(selectedDate).format("YYYY-MM-DD HH:mm:ss")
      }
    }).then(result => {
      console.log('result=', result);
      this.setData({
        airPointRankingList: result.data.Datas
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:00"))
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
    console.log("onShow")
    // wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:ss"))
    const storageSelectDate = wx.getStorageSync('selectedDate')
    let selectedDate = moment(storageSelectDate).format(pageSelectTimeFormat[this.data.dataType].showFormat);
    this.setData({
      selectedDate: selectedDate,
    })
    this.GetAirPointRanking();
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