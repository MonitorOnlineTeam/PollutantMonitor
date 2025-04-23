// pages/qca/validatePhone/validatePhone.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneCode: '',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //qcaValidatePhone
    this.setData({
      phoneCode: common.getStorage("PhoneCode")
    });

    //this.btnLogin(options);
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
  phone(val) {
    this.setData({
      phoneCode: val.detail.value
    });
  },
  btnLogin: function(options) {
    // console.log(this.data.phoneCode)
    if (this.data.phoneCode.length != 11) {
      this.setData({
        message: '请输入正确的手机号'
      });
      return false;
    }
    this.login(options);
  },
  login: function(options) {
    const phone = this.data.phoneCode;
    var that = this;
    if (phone && phone.length == 11) {
      wx.showLoading({
        title: '正在加载中',
      });
      app.wxLogin(function() {
        wx.hideLoading();
        common.setStorage("IsLogin", false);
        comApi.qcaValidatePhone(phone).then(res => {
          if (res && res.IsSuccess) {
            common.setStorage("IsLogin", true); //13800138000
            common.setStorage("PhoneCode", phone); //13800138000
            common.setStorage("UserName", res.Datas);
           
            wx.redirectTo({
              url: '/pages/qca/analyzerList/analyzerList',
            })
          } else {
            that.setData({
              message: (res && res.Message) || '网络错误'
            });
          }
        })
      });
    }
  }
})