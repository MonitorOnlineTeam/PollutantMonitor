const app = getApp()
const comApi = app.api;
const common = app.common;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyRecord: [],
    DGIMN: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DGIMN: common.getStorage("DGIMN")
    })
    this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //this.onPullDownRefresh();
    console.log(common.getStorage("DGIMN_Old"));
    this.setData({
      DGIMN: common.getStorage("DGIMN")
    })
    app.isLogin();
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
    return {
      path: `/pages/my/visitHistory/visitHistory?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },

  //获取历史数据
  getData: function() {
    let historyRecord = [];
    comApi.getUserInfo().then(res => {
      console.log(res)
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
          });
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

    //common.setStorage("DGIMN_Old", dgimn);
    let _this = this;
    const sdlMN = app.globalData.sdlMN.filter(m => m === dgimn);
    if (sdlMN.length > 0) {
      app.getUserLocation(function(r) {
        if (r) {
          common.setStorage("DGIMN", dgimn);
          common.setStorage("OpenId_SDL", "");
          wx.switchTab({
            url: '/pages/realTimeData/home/home',
          })
        }
      }, 'history')
    } else {
      common.setStorage("DGIMN", dgimn);
      common.setStorage("OpenId_SDL", "");
      wx.switchTab({
        url: '/pages/realTimeData/home/home',
      })
    }
  }
})