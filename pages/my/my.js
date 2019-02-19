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
    avatarUrl: '-',
    DGIMN:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DGIMN: common.getStorage('DGIMN')
    });
    this.onPullDownRefresh();

  },
  Determine: function(e) {
    console.log(e)
    if (e) {
      
      common.setStorage("DGIMN", e.currentTarget.dataset.dgimn)
      //console.log(common.getStorage('DGIMN'));
      wx.switchTab({
        url: '../realTimeData/realTimeData'
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
    if (this.data.DGIMN !== common.getStorage('DGIMN'))
    {
      this.setData({
        DGIMN: common.getStorage('DGIMN')
      });
      this.onPullDownRefresh();
    }
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
    wx.stopPullDownRefresh();
    this.getData();
  },

  getData: function() {
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
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  }
})