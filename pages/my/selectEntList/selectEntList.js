// pages/my/selectEntList/selectEntList.js
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({
  onShareAppMessage() {
    return {
      title: 'checkbox',
      path: 'page/component/pages/checkbox/checkbox'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },
  checkboxChange(e) {
    const items = this.data.items;
    let length = items.filter(m => m.checked == true);
    var thisSelected = e.detail.value;
    common.setStorage('selectedEnt', thisSelected);
    this.navigateBack()
    // wx.navigateTo({
    //   url: '/pages/my/alarmDataList/alarmDataList'
    // })
  },
  navigateBack() {
    wx.navigateBack()
  },
  //获取污染物
  getUserEntInfo: function (callback) {
    comApi.getUserEntInfo().then(res => {
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let entList = [];
        thisData.map(function (item, index) {
          entList.push({
            code: item.EntCode,
            name: item.EntName,
            value: item.EntCode,
            checked: false,
          });
          var selectrValue = common.getStorage('selectedEnt');
          if (selectrValue != null && entList[index].code== selectrValue)
          {
            entList[index].checked = true;
          }
        })
        

        this.setData({
          items: entList
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserEntInfo();
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
    app.isLogin();
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
    return {
      path: `/pages/historyData/selectPollutant/selectPollutant?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  }
})