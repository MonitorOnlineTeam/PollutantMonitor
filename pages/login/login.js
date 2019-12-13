// pages/login/login.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneCode: '' //18601364063
  },
  phone(val) {
    this.setData({
      phoneCode: val.detail.value
    });
  },
  btnLogin: function(options) {
    // console.log(this.data.phoneCode)
    if (this.data.phoneCode.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success(res) {}
      })
      return false;
    }
    this.login(options);
  },
  login: function(options) {
    const phone = this.data.phoneCode;
    if (phone && phone.length == 11) {
      wx.showLoading({
        title: '正在加载中',
      });
      app.wxLogin(function() {
        wx.hideLoading();
        comApi.verifyPhone(phone).then(res => {
          if (res && res.IsSuccess) {
            if (res.Datas) {
              common.setStorage("OpenId", res.Datas); //13800138000
              common.setStorage("PhoneCode", phone); //13800138000
              app.getUserInfo(options);
            }
          } else {
            wx.showModal({
              title: '提示',
              content: res.Message,
              showCancel: false,
              success(res) {}
            })
          }
        })
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (common.getStorage("PhoneCode")) {
      this.setData({
        phoneCode: common.getStorage("PhoneCode")
      });
    }
    //console.log(decodeURIComponent(options.q));
    this.ValidateDGIMN(options);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {

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
  btnNoLogin: function() {
    wx.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: `/pages/lgoin/lgoin?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },
  /**
   * 验证是否为扫码进入系统
   */
  ValidateDGIMN: function(options) {
    let that = this;
    if (options && options.q) {
      app.wxLogin(function() {
        console.log(11111111111);
        app.isValidateSdlUrl(options.q, function(res) {
          if (res) {
            //单独给雪迪龙展厅设备指定openId
            if (common.getStorage("OpenId_SDL")) {
              common.setStorage("OpenId", "13800138000"); //13800138000
              common.setStorage("PhoneCode", "13800138000"); //13800138000
              app.getUserInfo(options);
              return;
            } else {
              if (common.getStorage("PhoneCode")) {
                that.setData({
                  phoneCode: common.getStorage("PhoneCode")
                });
                that.btnLogin();
              }
            }
          }
        });
      });
    } else {
      if (common.getStorage("PhoneCode")) {
        that.setData({
          phoneCode: common.getStorage("PhoneCode")
        });
        that.btnLogin(options);
      }
    }
  }
})