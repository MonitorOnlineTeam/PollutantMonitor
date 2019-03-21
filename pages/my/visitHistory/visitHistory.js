const app = getApp()
const comApi = app.api;
const common = app.common;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyRecord: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onPullDownRefresh();
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
    this.getData();
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

  //获取历史数据
  getData: function() {
    let historyRecord = [];
    comApi.getUserInfo().then(res => {
      if (res && res.IsSuccess) {
        if (res.Data) {
          var thisData = res.Data;
          thisData.PointVisitHistorys.map(function(items) {
            historyRecord.push({
              EnterpriseName: items.EnterpriseName,
              PointName: items.PointName,
              VisitTime: items.VisitTime,
              DGIMN: items.DGIMN
            })
          })
          // if (!common.getStorage('DGIMN')) {
          //   common.setStorage("IsHaveHistory", false)
          // }

          if (historyRecord.length > 0) {
            common.setStorage("DGIMN", historyRecord[0].DGIMN)
          }
          this.setData({
            historyRecord: historyRecord,
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  },
  //详情跳转到实时工艺页面
  showDetail(e) {
    var dgimn = e.currentTarget.id;
    var pointname = e.currentTarget.dataset.pointname;
    common.setStorage("PointName", pointname);
    common.setStorage("DGIMN", dgimn);
    wx.switchTab({
      url: '/pages/realTimeData/home/home',
    })
  }
})