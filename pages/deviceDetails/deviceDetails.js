const app = getApp()
const comApi = app.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let deviceData = [];
    comApi.getDeviceInfo('51052216080302').then(res => {
      console.log('getDeviceInfo', res)
      if (res && res.IsSuccess) {
        if (res.Data) {
          var thisData = res.Data;
          thisData.map(function (items) {
            let obj={
              Name: items.Name,
              child: []
            }
            items.TestComponents.map(function(item){
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
            deviceData:deviceData
          })
          console.log(this.data.deviceData);
        }
      }
    })
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

})