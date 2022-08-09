// pages/pointRecords.js/pointRecords.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    EntName:'',
    PointName:'',
    OrderID:'',
    records:[],
    PollutantType:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //EntName=${item.EntName}&PointName=${item.PointName}&OrderID=${item.OrderID}
    const EntName = options.EntName,
    PointName = options.PointName,
    PollutantType = options.PollutantType,
    OrderID = options.OrderID;
    this.setData({
      EntName,PointName,OrderID,PollutantType
    });
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
    this.getGetPersonalCenterOrderInfo();
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
  getGetPersonalCenterOrderInfo  : function (id) {
    request.post({
      url: 'GetGetPersonalCenterOrderInfo',
      data: {
        "OrderID": this.data.OrderID,
      }
    }).then(res => {
      this.setData({
        records:res.data.Datas
      })
    })
  },
})