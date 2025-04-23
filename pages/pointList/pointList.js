
// pages/pointList/pointList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointList:[]
  },

  onPointClick(event) {
    const dgimn = event.currentTarget.dataset.dgimn;
    const pollutanttype = event.currentTarget.dataset.pollutanttype;
    wx.setStorageSync('dgimn', dgimn);
    wx.setStorageSync('pollutanttype', pollutanttype);
    console.log('pollutanttype = ',pollutanttype);
    app.globalData.pointInfo.dgimn = dgimn
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let entAndPointList = app.globalData.entAndPointList;
    const pointName = entAndPointList[options.index].title;
    const dgimn = entAndPointList[options.index].DGIMN;
    wx.setNavigationBarTitle({
      title: entAndPointList[options.index].title,
    })
    wx.setStorageSync('pointName', pointName);
    app.globalData.pointInfo.pointName = pointName
    let _pointList = entAndPointList[options.index].children;
    _pointList.map((item,index)=>{
      item.src = this.getStatusIcon(item.PollutantType,item.Status);
    })
    this.setData({
      pointList: _pointList
    })
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

  },
  /**
   * 
   */
  getStatusIcon: function(type,Status) {
    /**
     * 0 离线
     * 1 在线
     * 2 超标
     * 3 异常
     */
    if (type == 1 || type == '1') {
      //废水
      if(Status == 0) { // 离线
        return '/images/ic_water_stop.png';
      } else if (Status == 1) {// 在线
        return '/images/ic_water_on_line.png';
      } else if (Status == 2) {// 超标
        return '/images/ic_water_over.png';
      } else if (Status == 3) {// 异常
        return '/images/ic_water_exception.png';
      } else {// 其他
        return '/images/ic_water_stop.png';
      }
    } else if (type == 2 || type == '2') {
        //废气
        if(Status == 0) { // 离线
          return '/images/ic_gas_point_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_gas_point_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_gas_point_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_gas_point_exception.png';
        } else {// 其他
          return '/images/ic_gas_point_stop.png';
        }
    } else if (type == 12 || type == '12') {
        //扬尘
        if(Status == 0) { // 离线
          return '/images/ic_dust_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_dust_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_dust_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_dust_exception.png';
        } else {// 其他
          return '/images/ic_dust_stop.png';
        }
    } else if (type == 10 || type == '10') {
        //VOC
        if(Status == 0) { // 离线
          return '/images/ic_voc_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_voc_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_voc_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_voc_exception.png';
        } else {// 其他
          return '/images/ic_voc_stop.png';
        }
    } else if (type == 5 || type == '5') {
        //大气检测站
        if(Status == 0) { // 离线
          return '/images/ic_monitoring_station_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_monitoring_station_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_monitoring_station_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_monitoring_station_exception.png';
        } else {// 其他
          return '/images/ic_monitoring_station_stop.png';
        }
    } else if (type == 37 || type == '37') {
        //用电量
        if(Status == 0) { // 离线
          return '/images/ic_total_electricity_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_total_electricity_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_total_electricity_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_total_electricity_exception.png';
        } else {// 其他
          return '/images/ic_total_electricity_stop.png';
        }
    } else {
      if(Status == 0) { // 离线
        return '/images/ic_monitoring_station_stop.png';
      } else if (Status == 1) {// 在线
        return '/images/ic_monitoring_station_on_line.png';
      } else if (Status == 2) {// 超标
        return '/images/ic_monitoring_station_over.png';
      } else if (Status == 3) {// 异常
        return '/images/ic_monitoring_station_exception.png';
      } else {// 其他
        return '/images/ic_monitoring_station_stop.png';
      }
    }
  }
})