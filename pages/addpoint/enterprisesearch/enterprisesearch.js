var util = require('../../../utils/util.js');
const app = getApp()
const comApi = app.api;
const common = app.common;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  //获取企业信息
  getData: function() {
    !app.globalData.loading && app.showLoading();
    //获取运维数据
    comApi.getEnterpriseList().then(res => {
      app.hideLoading();
      if (res && res.IsSuccess) {
        if (res.Datas) {
          this.setData({
            resultData: res.Datas
          })
        }
      }
      wx.hideNavigationBarLoading();
    });
  },
  //搜索企业名称
  searchEntpriseName(e) {
    let key = e.detail.value;
    let list = this.data.resultData;
    for (let i = 0; i < list.length; i++) {
      let a = key;
      let b = list[i].EntName;
      if (b.indexOf(a) != -1) {
        list[i].isShow = true
      } else {
        list[i].isShow = false
      }
    }
    this.setData({
      resultData: list
    })
  },
  //跳转传递企业信息
  redirectEnterprise: function(e) {
    wx.redirectTo({
      url: '/pages/addpoint/addpoint/addpoint?EntName=' + e.currentTarget.dataset.entname + "&Abbreviation=" + e.currentTarget.dataset.abbreviation + "&EntAddress=" + e.currentTarget.dataset.entaddress + "&EnvironmentPrincipal=" + e.currentTarget.dataset.environmentprincipal + "&MobilePhone=" + e.currentTarget.dataset.mobilephone + "&Longitude=" + e.currentTarget.dataset.longitude + "&Latitude=" + e.currentTarget.dataset.latitude + "&EntCode=" + e.currentTarget.dataset.entcode
    })
  },
  //跳转到添加企业界面
  addenterprise: util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/addpoint/addenterprise/addenterprise'
    })
  }, 1000),
})