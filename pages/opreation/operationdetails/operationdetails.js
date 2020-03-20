var util = require('../../../utils/util.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgList: [
    //   "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=508387608,2848974022&fm=26&gp=0.jpg",
    //   "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3139953554,3011511497&fm=26&gp=0.jpg",
    //   "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1022109268,3759531978&fm=26&gp=0.jpg"
    // ],
    taskid: '',
    resultData:[],
    attachment:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.setStorage("ApiType", 2);
    let attachment = common.getStorage('AuthorCodeRSA_2');
    this.setData({
      taskid:options.taskid,
      attachment
    })
    this.getData();

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
  //获取运维详情数据
  getData: function() {
    comApi.getTaskDitails(this.data.taskid).then(res => {
      if (res && res.requstresult === "1") {
        if (res.data) {
          this.setData({
            resultData: res.data.optData
          })
        }
      }
    });
  },
  //预览图片，放大预览
  preview(event) {
    debugger
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.resultData.Attachments.ImgList, // 需要预览的图片http链接列表
    })
  },
})