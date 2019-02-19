const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceData: [],
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
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
  onChange(e) {
    if (e.detail.key.indexOf(this.key) !== -1) {
      return wx.showModal({
        title: 'No switching is allowed',
        showCancel: !1,
      })
    }
    this.setData({
      current: e.detail.key,
    })
  },
  getData:function(){
    let deviceData = [];
    comApi.getDeviceInfo().then(res => {
      console.log('getDeviceInfo', res)
      if (res && res.IsSuccess) {
        if (res.Data) {
          var thisData = res.Data;
          thisData.map(function (items) {
            let obj = {
              Name: items.Name,
              child: []
            }
            items.TestComponents.map(function (item) {
              obj.child.push({
                AnalyzerName: item.AnalyzerName,
                AnalyzerPrinciple: item.AnalyzerPrinciple,
                AnalyzerRange: item.AnalyzerRange,
                ComponentName: item.ComponentName,
                DeviceModel: item.DeviceModel,
                MeasurementUnit: item.MeasurementUnit,
                Slope: item.Slope,
                Intercept: item.Intercept
              })
            })
            deviceData.push(obj)
          })
          console.log(this.data.deviceData);
          this.setData({
            deviceData: deviceData,
            //DGIMN: common.getStorage('DGIMN_New')
          })
          console.log(this.data.deviceData);
        }
      }
      wx.hideNavigationBarLoading();
    })
  }
})