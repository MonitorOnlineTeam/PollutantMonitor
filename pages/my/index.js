// pages/my/index.js
import {
  getTabBarSelectedIndex
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  clear() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存数据吗？',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '清除成功',
            success: function () {
              wx.redirectTo({
                url: '/pages/authorCode/index',
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const aa = wx.canIUse('button.open-type.getUserInfo');
    // console.log('aa=', aa);
    wx.getUserInfo({
      success: res => {
        console.log(res) //获取的用户信息还有很多，都在res中，看打印结果
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
      }
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selectedIndex = getTabBarSelectedIndex('/pages/my/index')
      this.getTabBar().setData({
        selectedIndex: selectedIndex
      })
    }
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