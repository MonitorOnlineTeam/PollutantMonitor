// pages/feedback/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: ''
  },

  // 输入事件
  onInput(e) {
    console.log(e);
    this.data.details = e.detail.value;
    // this.setData({
    //   details: e.detail.value
    // })
  },

  // 提交意见
  onSubmit() {
    const details = this.data.details;
    if (details.length < 5) {
      wx.showToast({
        title: '内容字数不能少于5个字符',
        icon: 'none'
      })
      return;
    }
    request.post({
      url: 'AddFeedback',
      data: {
        "Details": this.data.details,
      }
    }).then(res => {
      console.log(res);
      if (res.data.IsSuccess) {
        wx.showModal({
          title: '提示',
          content: '反馈成功！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //返回上一级
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})