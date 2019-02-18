const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneCode: '',
    isAuthor: false
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
    //console.log('设备详情DGIMN_New', common.getStorage('DGIMN_New'))
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
  
  getUserInfo: function(e) {
    console.log(e)

    if(!this.data.isAuthor){
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo

        this.setData({
          isAuthor: true
        })
        this.RegisterBtn();
      } else {
        console.log(1)
      }
    }
  },
  RegisterBtn() {
    console.log('phonecode', this.data.phonecode);

    if (!this.data.isAuthor)
      return false;

    // 获取用户信息
    if (this.data.phoneCode.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success(res) {}
      })
      return false;
    }
    if (this.data.phoneCode && this.data.phoneCode.length == 11) {
      comApi.updateUserInfo(this.data.phoneCode).then(res => {
        console.log('updateUserInfo', res)
        if (res && res.IsSuccess) {
          if (res.Data) {
            common.setStorage("IsFirstLogin", res.Data.IsFirstLogin)
            common.setStorage("AuthorCode", res.Data.AuthorCode)
            //TODO:跳转到设备密码界面
            // wx.navigateTo({
            //   url: '../device/device',
            // });
            wx.switchTab({
              url: '../my/my'
            })
          }
        }else
        {
          wx.showModal({
            title: '提示',
            content: res.Message,
            showCancel: false,
            success(res) { }
          })
        }
      })
    }
  },
  phone(val) {
    this.setData({
      phoneCode: val.detail.value
    });
  },
})