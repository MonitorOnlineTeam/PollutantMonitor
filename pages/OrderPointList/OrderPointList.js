// pages/OrderPointList/OrderPointList.js
import request from '../../utils/request'
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    points:[],
    searchStr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getPersonalCenterOrder();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setData({
      searchStr: ''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  gotoPointRecords(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/pointRecords/pointRecords?EntName=${item.EntName}&PointName=${item.PointName}&OrderID=${item.OrderID}&PollutantType=${item.PollutantType}`,
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      searchStr: e.detail.value
    })
  },
  onSearchPoints: function () {
    this.getPersonalCenterOrder();
  },
  getPersonalCenterOrder : function () {
    request.post({
      url: 'GetPersonalCenterOrder',
      data: {
        "KeyValue": this.data.searchStr,
      }
    }).then(res => {
      let data = res.data.Datas.query;
      data.map((item)=>{
        if (moment().isAfter(item.ExpirationDate,'date')) {
          item.expire = true
        } else {
          item.expire = false
        }
      })
      this.setData({
        points:res.data.Datas.query
      });

    })
  },
})