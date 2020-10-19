// pages/qca/authorCode/authorCode.js
var RSA = require('../../../utils/wx_rsa.js')
const app = getApp()
const comApi = app.api;
const common = app.common;
const publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsx1/cEpUmSwUwwPU0SciWcVKmDORBGwSBjJg8SL2GrCMC1 + Rwz81IsBSkhog7O + BiXEOk / 5frE8ryZOpOm / 3PmdWimEORkTdS94MilEsk + 6Ozd9GnAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC894cUqq1aH9h44SwyQIDAQAB-----END PUBLIC KEY-----'
var encStr = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.validateAuthorCode();
    // debugger

    this.setData({
      authorCode: common.getStorage("AuthorCode")
    })

    //this.validateAuthorCode();
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
  authorCode(val) {
    this.setData({
      authorCode: val.detail.value
    });
  },
  validateAuthorCode: function() {
    var that = this;

    var authorcode = that.data.authorCode;
    that.setData({
      message: '',
    
    });
    if (authorcode.length != 5) {
      that.setData({
        message: '请输入5位授权码'
      });
      return;
    }

    let encrypt_rsa = new RSA.RSAKey();
    encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
    // console.log('加密RSA:')
    console.log(encrypt_rsa)
    encStr = encrypt_rsa.encrypt(authorcode)
    encStr = RSA.hex2b64(encStr);
    // console.log("加密结果：" + encStr)

    common.setStorage("AuthorCode", authorcode); //13800138000
    common.setStorage("AuthorCodeRSA", encStr); //13800138000
    common.setStorage("IsAuthor", false);
    comApi.validateAuthorCode().then(res => {
      if (res && res.IsSuccess) {
        that.setData({
          message: '授权验证成功，正在跳转…',
          messageFlag:true
        });
        common.setStorage("IsAuthor", true); //13800138000
       
        setTimeout(function() {
        
          wx.reLaunch({
            url: '/pages/qca/analyzerList/analyzerList'
          })
        }, 500)

      } else {
        that.setData({
          message: (res && res.Message) || '网络错误'
        });
      }
    })
  }
})