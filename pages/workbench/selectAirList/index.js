// pages/workbench/selectAirList/index.js
import request from '../../../utils/request';
import moment from 'moment';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointsList: [],
  },
  onSelectAir(event) {
    // return;
    let itemData = event.currentTarget.dataset.obj;
    if (itemData.OperationStatus !== true) {
      wx.showModal({
        title: '该监测点未查询到运维单位信息，可能原因如下：',
        content: `1. 未设置运维单位信息；
        2. 运维服务已到期。 
        请联系管理员进行设置。`,
        success: (result) => {

        },
        fail: (res) => {},
        complete: (res) => {},
      })
    } else {
      app.globalData.dgimn = itemData.DGIMN;
      app.globalData.pointName = itemData.PointName;
      app.globalData.OperationCompanyID = itemData.OperationCompanyID;
      app.globalData.OperationName = itemData.OperationName;
      wx.navigateBack({
        delta: 1
      });
    }
  },
  // 获取空气站列表
  GetPoints(monitorTargetId) {
    request.get({
      url: 'GetPoints',
      data: {
        monitorTargetId
      },
    }).then(res => {
      this.setData({
        pointsList: res.data.Datas
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetPoints(options.monitorTargetId);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})