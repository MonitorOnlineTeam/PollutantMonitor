
// pages/pointList/pointList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointList:[]
  },

  onPointClick(event) {
    const dgimn = event.currentTarget.dataset.dgimn;
    wx.setStorageSync('dgimn', dgimn);
    app.globalData.pointInfo.dgimn = dgimn
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let entAndPointList = app.globalData.entAndPointList;
    const pointName = entAndPointList[options.index].title;
    const dgimn = entAndPointList[options.index].DGIMN;
    wx.setNavigationBarTitle({
      title: entAndPointList[options.index].title,
    })
    wx.setStorageSync('pointName', pointName);
    app.globalData.pointInfo.pointName = pointName

    this.setData({
      pointList: entAndPointList[options.index].children
    })
    console.log("options=",options)
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