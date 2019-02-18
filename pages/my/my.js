const app = getApp()
const comApi = app.api;
const common = app.common;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyRecord: [],
    userPhone: '-',
    nickName: '-',
    avatarUrl: '-'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.globalData.userInfo);
    // console.log(app.globalData.userInfo.avatarUrl);
    if (app.globalData.userInfo) {
      // this.setData({
      //   nickName: app.globalData.userInfo.nickName,
      //   avatarUrl: app.globalData.userInfo.avatarUrl
      // })

    } else {
      // wx.switchTab({
      //   url: '../proving/proving'
      // })
    }
    console.log(this.data.avatarUrl);
    let historyRecord = [];
    comApi.getUserInfo().then(res => {
      console.log('getUserInfo', res)
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
          this.setData({
            historyRecord: historyRecord,
            userPhone: thisData.UserPhone,
            //  nickName: app.globalData.userInfo.nickName,
            //  avatarUrl: app.globalData.userInfo.avatarUrl
          })
        }
      }
    })
  },
  Determine: function(e) {
    console.log(e)
    if (e) {
      //e.currentTarget.dataset.dgimn
      common.setStorage("DGIMN_New", e.currentTarget.dataset.dgimn)
      console.log(common.getStorage('DGIMN_New'));
      // app.globalData.setData({
      //   DGIMN: e.currentTarget.dataset.dgimn
      // })
      wx.switchTab({
        url: '../pointInfo/pointInfo'
      })

    }
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
    console.log(2)
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
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {

    wx.showNavigationBarLoading();

    wx.hideNavigationBarLoading();

    wx.stopPullDownRefresh();
  }


})