const app = getApp()
const comApi = app.api;
const common = app.common;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwrod:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  visit:function(){
    if(this.data.passwrod)
    {
      common.setStorage("DevicePwd", this.data.passwrod);
      comApi.verifyDevicePwd().then(res => {
        if (res && res.IsSuccess) {
          if (res.Data) {
            common.setStorage("DevicePwd", this.data.passwrod);
            //common.setStorage("DGIMN", ress.result);
            wx.switchTab({
              url: '../my/my'
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.Message,
            showCancel: false,
            success(res) { }
          })
        }
      })
    }
  },
  passwrod(val) {
    this.setData({
      passwrod: val.detail.value
    });
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