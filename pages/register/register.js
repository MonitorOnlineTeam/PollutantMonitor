// pages/register/register.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajxtrue: false, //手机号验证标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  /**
   * 表单提交
   */
  formSubmit: function(e) {
    if (
      e.detail.value.MobilePhone.length == 0
    ) {
      wx.showToast({
        title: '填写信息不能为空!',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.ajxtrue) {
      wx.showToast({
        title: '请检查手机号!',
        icon: 'none',
        duration: 1500
      })
    } else {
      comApi.AddUser(e.detail.value.MobilePhone).then(res => {
        if (res && res.IsSuccess) {
          wx.showToast({
            title: '注册成功!',
            duration: 1500
          });
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.Message,
            duration: 1500
          })

        }
      });
    }

  },
  // 手机号验证
  blurPhone: function(e) {
    var MobilePhone = e.detail.value;
    let that = this
    if (!(/^1[34578]\d{9}$/.test(MobilePhone))) {

      this.setData({
        ajxtrue: false
      })
      if (MobilePhone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }
  },
})