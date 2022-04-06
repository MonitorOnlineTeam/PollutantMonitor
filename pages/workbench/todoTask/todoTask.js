// pages/workbench/todoTask/todoTask.js
import request from '../../../utils/request';
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoTaskList: [],
    _pageIndex: 1,
    _total: 0,
  },

  // 获取待办任务数据
  getData() {
    request.post({
      url: 'GetUnhandleTaskList',
      data: {
        "pageIndex": this.data._pageIndex,
        "pageSize": 20
      },
    }).then(res => {
      this.setData({
        todoTaskList: res.data.Datas,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log('show');
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
    if (this.data.todoTaskList.length != this.data._total) {
      this.data._pageIndex = 1 + this.data._pageIndex;
      request.post({
        url: 'GetUnhandleTaskList',
        data: {
          "pageIndex": this.data._pageIndex,
          "pageSize": 20
        },
      }).then(res => {
        this.setData({
          todoTaskList: this.data.todoTaskList.concat(res.data.Datas),
          _total: res.data.Total
        })
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
    this.getData();
  }
})