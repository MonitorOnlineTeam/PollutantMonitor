// pages/funcpage/index.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    //tabData: ['实时数据', '历史数据', '质控', '运维', '设备信息'],
    tabData: ['实时数据', '历史数据', '运维', '设备信息'],
    frist: true, //是否首次
    isOpt: true,
    isQCA: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options=', options);
    common.setStorage("ApiType", 1);
    this.myComponent = this.selectComponent('#myComponent');
    this.setData({
      isOpt: options.isOpt == 'false' ? false : true,
      tabData: options.isOpt == 'false' ? ['实时数据', '历史数据', '设备信息'] : ['实时数据', '历史数据', '运维', '设备信息']
    })
    //this.onPullDownRefresh();


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
    wx.setNavigationBarTitle({
      title: common.getStorage("PointName")
    });
    var data = this.data;
    if (data.frist)
      return;

    let myComponent = this.myComponent;

    switch (data.TabCur) {
      case 0:
        myComponent.onShow();
        break;
      case 1:
        myComponent.onShow();
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        myComponent.onShow();
        break;
    }
    console.log(1);
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
    var data = this.data;
    let myComponent = this.myComponent;
    myComponent.onPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var data = this.data;

    let myComponent = this.myComponent;

    switch (data.TabCur) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        data.tabData.length > 3 && myComponent.onReachBottom();
        break;
      case 3:
        data.tabData.length > 3 && myComponent.onReachBottom();
        break;
      case 4:
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tabSelect(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      TabCur: id,
      scrollLeft: (id - 1) * 60,
      frist: false
    });
    common.setStorage("ApiType", 1);
    this.myComponent = this.selectComponent('#myComponent');
  }
})