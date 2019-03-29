// pages/my/feedBack/feedBack.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    email: "",
    details: ""
  },
  //姓名
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //邮箱
  email: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  //详情
  details: function(e) {
    this.setData({
      details: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  //提交
  loginBtnClick() {
    wx.showNavigationBarLoading();
    var name = this.data.name;
    var email = this.data.email;
    var details = this.data.details;
    //邮箱验证
    var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
    var phoneVar = reg.test(email); // 得到的值为布尔型
    if (phoneVar) {
      //调用接口
      comApi.addFeedback(name, email, details).then(res => {
        if (res && res.IsSuccess) {
          wx.showModal({
            title: '提示',
            content: '添加成功！',
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
        } else {
          wx.showModal({
            title: '提示',
            content: '添加失败，请重试！',
            showCancel: false
          })
        }
        wx.hideNavigationBarLoading();
      })



    } else {
      this.data.regEmail = false;
      wx.showModal({
        title: '提示',
        content: '邮箱格式不正确',
        showCancel: false,
      })
      wx.hideNavigationBarLoading();
    }
  }
})