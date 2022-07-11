// pages/myWebview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl:'https://api.chsdl.net/text/04/备品备件更换记录表-2022-06-16.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let imageurl = options.imageurl
    this.setData({
      imageurl
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

  }
})