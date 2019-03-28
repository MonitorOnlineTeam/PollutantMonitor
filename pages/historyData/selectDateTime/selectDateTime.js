// pages/historyData/selectDateTime/selectDateTime.js
const app = getApp();
const comApi = app.api;
const common = app.common;
const moment = require('../../../utils/moment.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    minDate: new Date(2010, 0, 1, 0, 0).getTime(),
    maxDate: moment(moment().format("YYYY-MM-DD HH:mm")).valueOf(),
    selectTime: new Date().getTime(),
    pickerType: 'datetime',
    currentDate: 0,

    dataType: 0
  },
  confirm(event) {
    //console.log(moment(event.detail).format("YYYY-MM-DD HH:mm:00"));
    common.setStorage('selectedDate', moment(event.detail).format("YYYY-MM-DD HH:mm:00"));
    // wx.switchTab({
    //   url: '/pages/historyData/home/home'
    // })
    wx.navigateBack()
  },
  cancel() {
    // wx.switchTab({
    //   url: '/pages/historyData/home/home'
    // })
    wx.navigateBack()
  },
  onInput(event) {
    const {
      detail,
      currentTarget
    } = event;

    const result = this.getResult(detail, currentTarget.dataset.type);
    this.setData({
      selectTime: result
    });
    // console.log(event);
  },

  getResult(time, type) {
    const date = new Date(time);
    switch (type) {
      case 'datetime':
        return moment(date).format('YYYY-MM-DD HH:mm:00'); //.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'year-month':
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      case 'time':
        return time;
      default:
        return '';
    }
  },
  onChange(event) {
    console.log(event.detail);

    const {
      dataType
    } = this.data;
    if (dataType <= 1) {
      switch (dataType) {
        case 0:
          break;
        case 1:
          event.detail.setColumnValues(4, ["00"]);
          break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     
    let selectedDate = common.getStorage('selectedDate');
    if (!common.getStorage('selectedDate')) {
      selectedDate = moment();
    } else {
      selectedDate = moment(selectedDate);
    }

    let pickerType = 'datetime';

    let currentDate = 0;
    let maxDate = moment(moment().format("YYYY-MM-DD HH:mm")).valueOf();
    switch ((+options.dataType) || 0) {
      case 0:
        currentDate = moment(selectedDate.format('YYYY-MM-DD HH:mm:ss')).valueOf();
        pickerType = 'datetime';
        break;
      case 1:
        currentDate = moment(selectedDate.format('YYYY-MM-DD HH:00')).valueOf();
        maxDate = moment(moment().format('YYYY-MM-DD HH:00')).valueOf();
        pickerType = 'datetime';
        break;
      case 2:
        currentDate = selectedDate.valueOf();
        pickerType = 'date';
        break;
      case 3:
        currentDate = selectedDate.valueOf();
        pickerType = 'year-month';
        break;
    }
    this.setData({
      dataType: (+options.dataType) || 0,
      currentDate: currentDate,
      maxDate: maxDate,
      pickerType: pickerType,
      selectTime: moment(selectedDate.format('YYYY-MM-DD HH:mm:00')).valueOf()

    });
    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    // console.log(this.data.dataType);
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
    //console.log("onShow");

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