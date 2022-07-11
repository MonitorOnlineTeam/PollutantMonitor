// pages/historyData/selectDateTime/selectDateTime.js
const app = getApp();
const comApi = app.api;
const common = app.common;
import moment from 'moment'
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
    wx.setStorageSync('selectedDate', moment(event.detail).format("YYYY-MM-DD HH:mm:00"));
    wx.setStorageSync('alarmselectedDate', moment(event.detail).format("YYYY-MM-DD HH:00:00"));
    if (this.data._setDateKey) {
      wx.setStorageSync(this.data._setDateKey, moment(event.detail).format("YYYY-MM-DD HH:mm:ss"));
    }
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
    // console.log(event.detail);

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
  onLoad: function (options) {
    // let selectedDate = '';
    // let selectedDate = common.getStorage('selectedDate');
    let selectedDate = wx.getStorageSync('selectedDate');
    if (options.key) {
      this.data._setDateKey = options.key;
      selectedDate = wx.getStorageSync(options.key)
    }
    if (!selectedDate) {
      // if (true) {
      selectedDate = moment();
    } else {
      selectedDate = moment(selectedDate);
    }

    let pickerType = 'datetime';

    let currentDate = 0;
    let maxDate = moment(moment().format("YYYY-MM-DD HH:mm")).valueOf();
    // console.log('options.dataType=', options.dataType);
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
      case 'minute':
        currentDate = moment(selectedDate.format('YYYY-MM-DD HH:mm')).valueOf();
        maxDate = moment(moment().format('YYYY-MM-DD HH:mm')).valueOf();
        pickerType = 'datetime';
        break;
      case 2:
        currentDate = moment(selectedDate.format('YYYY-MM-DD')).valueOf();
        pickerType = 'date';
        break;
      case 3:
        currentDate = moment(selectedDate.format('YYYY-MM-01')).valueOf();
        pickerType = 'year-month';
        break;
      case 4:
        currentDate = moment(selectedDate.format('YYYY-01-01')).valueOf();
        pickerType = 'year-month';
        break;
      default:
        currentDate = moment(selectedDate.format('YYYY-MM-DD HH:mm:ss')).valueOf();
        pickerType = 'datetime';
        break;
    }
    this.setData({
      dataType: (+options.dataType) || 0,
      currentDate: currentDate,
      maxDate: maxDate,
      pickerType: pickerType,
      selectTime: currentDate //moment(selectedDate.format('YYYY-MM-DD HH:mm:00')).valueOf()
    });
    // var pointName = common.getStorage("PointName");
    // if (pointName) {
    //   wx.setNavigationBarTitle({
    //     title: pointName,
    //   })
    // }
    // console.log(this.data.dataType);
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
})