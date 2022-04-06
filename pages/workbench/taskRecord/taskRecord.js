// pages/workbench/taskRecord/taskRecord.js
import request from '../../../utils/request';
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: [moment().subtract(7, "days").startOf('day').valueOf(), moment().endOf('day').valueOf()],
    datesStr: [moment().subtract(7, "days").startOf('day').format("MM/DD"), moment().endOf('day').format("MM/DD")],
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    show: false,
    taskRecordList: [],
    _pageIndex: 1,
    _total: 0,
  },
  formatDateStr(date) {
    let dates = [new Date(date[0]), new Date(date[1])];
    return [moment(dates[0]).format("MM/DD"), moment(dates[1]).format("MM/DD")];
  },
  formatDate(date) {
    date = [new Date(date[0]), new Date(date[1])];
    return date;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      dates: this.formatDate(event.detail),
      datesStr: this.formatDateStr(event.detail)
    });
    this.getData();
  },
  onClose() {
    this.setData({
      show: false,
    });
  },

  // 获取任务记录
  getData() {
    request.post({
      url: 'GetTaskRecord',
      data: {
        "IsQueryAllUser": false,
        "IsPaging": true,
        "operationUserId": wx.getStorageSync('UserCode'),
        "exceptionType": "0",
        "beginTime": moment(this.data.dates[0]).format('YYYY-MM-DD HH:mm:ss'),
        "endTime": moment(this.data.dates[1]).format('YYYY-MM-DD 23:59:59'),
        "pageIndex": this.data._pageIndex,
        "pageSize": 20
      },
    }).then(res => {
      this.setData({
        taskRecordList: res.data.Datas,
        _total: res.data.Total
      })
    })
  },

  // 跳转详情
  onGotoDetails(e) {
    const taskId = e.currentTarget.dataset.taskid;
    wx.navigateTo({
      url: '/pages/workbench/taskDetails/taskDetails?taskID=' + taskId,
    })
  },

  onDateConfirm(value) {
    console.log('date=', value);
  },

  onSelectDate() {
    this.setData({
      show: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('dates=', this.data.dates);
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
    this.getData();
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
    if (this.data.taskRecordList.length != this.data._total) {
      this.data._pageIndex = 1 + this.data._pageIndex;
      request.post({
        url: 'GetTaskRecord',
        data: {
          "IsQueryAllUser": false,
          "IsPaging": true,
          "operationUserId": wx.getStorageSync('UserCode'),
          "exceptionType": "0",
          "beginTime": moment(this.data.dates[0]).format('YYYY-MM-DD HH:mm:ss'),
          "endTime": moment(this.data.dates[1]).format('YYYY-MM-DD 23:59:59'),
          "pageIndex": this.data._pageIndex,
          "pageSize": 20
        },
      }).then(res => {
        this.setData({
          taskRecordList: this.data.taskRecordList.concat(res.data.Datas),
          _total: res.data.Total
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})