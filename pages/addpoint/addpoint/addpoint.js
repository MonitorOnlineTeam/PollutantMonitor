// pages/register/register.js
var util = require('../../../utils/util.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    DGIMN: '',
    Abbreviation: '',
    EntAddress: '',
    EntName: '',
    EnvironmentPrincipal: '',
    MobilePhone: '',
    IfExistsFlag: true,
    EntCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (JSON.stringify(options) != "{}") {
      this.setData({
        Abbreviation: options.Abbreviation,
        EntAddress: options.EntAddress,
        EntName: options.EntName,
        EnvironmentPrincipal: options.EnvironmentPrincipal,
        MobilePhone: options.MobilePhone,
        latitude: options.Latitude,
        longitude: options.Longitude,
        entCode: options.EntCode ? options.EntCode : "",
      })
    }
    this.setData({
      DGIMN: !common.getStorage("DGIMN") ? "" : common.getStorage("DGIMN"),
      openid: common.getStorage("OpenId")
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
    // let pages = getCurrentPages().length - 1;
    // console.log('需要销毁的页面：' + pages);
    // wx.navigateBack({
    //   delta: pages
    // })
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
      e.detail.value.Abbreviation.length == 0 ||
      e.detail.value.DGIMN.length == 0 ||
      e.detail.value.EntAddress.length == 0 ||
      e.detail.value.EntLatitude.length == 0 ||
      e.detail.value.EntLongitude.length == 0 ||
      e.detail.value.EntName.length == 0 ||
      e.detail.value.EnvironmentPrincipal.length == 0 ||
      e.detail.value.MobilePhone.length == 0 ||
      e.detail.value.OutputDiameter.length == 0 ||
      e.detail.value.OutputHigh.length == 0 ||
      e.detail.value.PointLatitude.length == 0 ||
      e.detail.value.PointLongitude.length == 0 ||
      e.detail.value.PointName.length == 0 ||
      !this.data.openid
    ) {
      wx.showToast({
        title: '填写信息不能为空!',
        icon: 'none',
        duration: 1500
      })
    } else if ((!common.getStorage("FormMobilePhone") && !this.data.ajxtrue && !this.data.entCode) || (this.data.entCode && this.data.MobilePhone.length != 11 && !this.data.ajxtrue)) {
      wx.showToast({
        title: '请检查手机号!',
        icon: 'none',
        duration: 1500
      })
    } else {
      !app.globalData.loading && app.showLoading();
      comApi.register(
        e.detail.value.Abbreviation,
        e.detail.value.DGIMN,
        e.detail.value.EntAddress,
        e.detail.value.EntLatitude,
        e.detail.value.EntLongitude,
        e.detail.value.EntName,
        e.detail.value.EnvironmentPrincipal,
        e.detail.value.MobilePhone,
        e.detail.value.OutputDiameter,
        e.detail.value.OutputHigh,
        e.detail.value.PointLatitude,
        e.detail.value.PointLongitude,
        e.detail.value.PointName,
        this.data.openid,
        this.data.entCode
      ).then(res => {
        app.hideLoading();
        if (res && res.IsSuccess) {
          if (res.Datas) {
            //将添加企业是缓存的数据清空
            common.setStorage("FormEntName", '');
            common.setStorage("FormAbbreviation", '');
            common.setStorage("FormEntAddress", '');
            common.setStorage("FormEnvironmentPrincipal", '');
            common.setStorage("FormMobilePhone", '');
            common.setStorage("FormEntLongitude", '');
            common.setStorage("FormEntLatitude", '');

            wx.showToast({
              title: '保存成功!',
              duration: 1500
            });
            setTimeout(function() {
              //app.IsEntryDetails();
              common.setStorage("IsEntryDetails", true);
              let pages = getCurrentPages().length - 1;
              // 跳转
              wx.navigateBack({
                delta: pages
              });
              // wx.redirectTo({
              //   url: '/pages/home/index',
              // });
            }, 1000) //延迟时间 这里是1秒

          }
        } else {
          wx.showToast({
            title: res.Message,
            duration: 1500
          })

        }
        wx.hideNavigationBarLoading();
      });

    }

  },

  //直径验证
  moneyInputOutputDiameter(e) {
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      OutputDiameter: money,
    })
  },
  //高度验证
  moneyInputOutputHigh(e) {
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      OutputHigh: money,
    })
  },

  //跳转企业列表
  searchoraddenterprise: util.throttle(function(e) {
    wx.redirectTo({
      url: '/pages/addpoint/enterprisesearch/enterprisesearch?'
    })
  }, 500),
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