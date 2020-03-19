// pages/addpoint/addenterprise/addenterprise.js
var util = require('../../../utils/util.js');
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    ajxtrue: false, //手机号验证标识
    FormEntName: '',
    FormAbbreviation: '',
    FormEntAddress: '',
    FormEnvironmentPrincipal: '',
    FormMobilePhone: '',
    FormEntLongitude: '',
    FormEntLatitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      FormEntName: common.getStorage("FormEntName") ? common.getStorage("FormEntName") : '',
      FormAbbreviation: common.getStorage("FormAbbreviation") ? common.getStorage("FormAbbreviation") : '',
      FormEntAddress: common.getStorage("FormEntAddress") ? common.getStorage("FormEntAddress") : '',
      FormEnvironmentPrincipal: common.getStorage("FormEnvironmentPrincipal") ? common.getStorage("FormEnvironmentPrincipal") : '',
      FormMobilePhone: common.getStorage("FormMobilePhone") ? common.getStorage("FormMobilePhone") : '',
      FormEntLongitude: common.getStorage("FormEntLongitude") ? common.getStorage("FormEntLongitude") : '',
      FormEntLatitude: common.getStorage("FormEntLatitude") ? common.getStorage("FormEntLatitude") : '',
    })
    this.getLocation();
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
   * 获取经纬度
   */
  getLocation: function() {
    //获取当前经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  /**
   * 表单提交
   */
  formSubmit: function(e) {
    if (
      e.detail.value.EntName.length == 0 ||
      e.detail.value.Abbreviation.length == 0 ||
      e.detail.value.EntAddress.length == 0 ||
      e.detail.value.EntLatitude.length == 0 ||
      e.detail.value.EntLongitude.length == 0 ||
      e.detail.value.EnvironmentPrincipal.length == 0 ||
      e.detail.value.MobilePhone.length == 0
    ) {
      wx.showToast({
        title: '填写信息不能为空!',
        icon: 'none',
        duration: 1500
      })
    } else if (!common.getStorage("FormMobilePhone") && !this.data.ajxtrue) {
      wx.showToast({
        title: '请检查手机号!',
        icon: 'none',
        duration: 1500
      })
    } else {
      common.setStorage("FormEntName", e.detail.value.EntName);
      common.setStorage("FormAbbreviation", e.detail.value.Abbreviation);
      common.setStorage("FormEntAddress", e.detail.value.EntAddress);
      common.setStorage("FormEnvironmentPrincipal", e.detail.value.EnvironmentPrincipal);
      common.setStorage("FormMobilePhone", e.detail.value.MobilePhone);
      common.setStorage("FormEntLongitude", e.detail.value.EntLongitude);
      common.setStorage("FormEntLatitude", e.detail.value.EntLatitude);
      wx.navigateTo({
        url: '/pages/addpoint/addpoint/addpoint?EntName=' + e.detail.value.EntName + "&Abbreviation=" + e.detail.value.Abbreviation + "&EntAddress=" + e.detail.value.EntAddress + "&EnvironmentPrincipal=" + e.detail.value.EnvironmentPrincipal + "&MobilePhone=" + e.detail.value.MobilePhone + "&Longitude=" + e.detail.value.EntLongitude + "&Latitude=" + e.detail.value.EntLatitude
      })
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
  //经度验证
  moneyInputlongitude(e) {
    var money;
    if (/^(\d?)+(\.\d{0,5})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于五位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      longitude: money,
    })
  },
  //纬度验证
  moneyInputlatitude(e) {
    var money;
    if (/^(\d?)+(\.\d{0,5})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于五位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      latitude: money,
    })
  },
})