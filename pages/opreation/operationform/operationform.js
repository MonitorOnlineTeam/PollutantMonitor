// pages/opreation/operationform/operationform.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcPath:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let page="";
    switch (options.typeid) {
      case "1":
        page = "apprepairrecord";
        break;
      case "2":
        page = "appstopcemsrecord";
        break;
      case "3":
        page = "appconsumablesreplacerecord";
        break;
      case "4":
        page = "appstandardgasrepalcerecord";
        break;
      case "5":
        page = "appcompleteextractionrecord";
        break;
      case "6":
        page = "appdilutionsamplingrecord";
        break;
      case "7":
        page = "appdirectmeasurementrecord";
        break;
      case "8":
        page = "appjzrecord";
        break;
      case "9":
        page = "appbdtestrecord";
        break;
      case "10":
        page = "appdeviceexceptionrecord";
        break;
      case "27":
        page = "appmaintainrepalcerecord";
        break;
      case "28":
        page = "appsparepartreplacerecord";
        break;
      default:
        break;
    };
    this.setData({
      srcPath: "http://172.16.12.135:50203/appoperation/" + page + "/" + options.taskid + "/" + options.typeid+"/"
    });
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

  }
})