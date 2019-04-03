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
  btnLogin: function() {
    console.log(this.data.phoneCode)
    if (this.data.phoneCode.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success(res) {}
      })
      return false;
    }
    this.login();
  },
  login: function() {
    const phone = this.data.phoneCode;
    if (phone && phone.length == 11) {
      comApi.verifyPhone(phone).then(res => {
        if (res && res.IsSuccess) {
          if (res.Data) {
            common.setStorage("OpenId", res.Data);
            common.setStorage("PhoneCode", phone);
            app.getUserInfo();
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.Message,
            showCancel: false,
            success(res) {}
          })
        }
      }).catch(res => {
        wx.showModal({
          title: '提示',
          content: res.Message,
          showCancel: false,
          success(res) {}
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(decodeURIComponent(options.q));
    this.ValidateDGIMN();
    
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
   * 验证是否为扫码进入系统
   */
  ValidateDGIMN: function(options) {
    if (options && options.q) {
      let url = decodeURIComponent(options.q);
      let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
      if (substr && substr.indexOf('flag=sdl,mn=') >= 0) {
        let mn = substr.split(',')[1].split('=')[1];
        if (mn) {
          comApi.verifyDGIMN(mn).then(res => {
            if (res && res.IsSuccess) {
              common.setStorage("DGIMN", mn);
              if (common.getStorage("PhoneCode")) {
                this.setData({
                  phoneCode: common.getStorage("PhoneCode")
                });
                this.btnLogin();
              }
            } else {
              //common.setStorage("DGIMN", mn);
              wx.showModal({
                title: '提示',
                content: res.Message,
                showCancel: false,
                success(res) {}
              })
            }
          })
        }
      }
    }else
    {
      if (common.getStorage("PhoneCode")) {
        this.setData({
          phoneCode: common.getStorage("PhoneCode")
        });
        this.btnLogin();
      }
    }
  }
})