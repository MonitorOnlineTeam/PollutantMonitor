// pages/welcome/index.js
const app = getApp();
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 获取系统菜单
  GetSysMenuByUserID() {
    // request.post({
    //   url: 'GetSysMenuByUserID',
    //   data: {
    //     menu_id: app.globalData.menuId,
    //   },
    //   options: {
    //     hideLoading: true
    //   }
    // }).then(result => {
    //   console.log('menuList=', result);
    //   let tabBarList = result.data.Datas.map(item => {
    //     return {
    //       "pagePath": item.parentUrl,
    //       "iconPath": `/images/${item.icon}.png`,
    //       "selectedIconPath": `/images/${item.icon}_Select.png`,
    //       "text": item.name
    //     }
    //   });
    //   wx.setStorageSync('tabBarList', tabBarList);
    //   wx.switchTab({
    //     url: tabBarList[0].pagePath,
    //   })
    // })
    let tabBarList = [{
        "pagePath": "/pages/entAndAir/index",
        "iconPath": "/images/SSGY.png",
        "selectedIconPath": "/images/SSGY_Select.png",
        "text": "监控"
      },
      {
        "pagePath": "/pages/alarm/index",
        "iconPath": "/images/SJJK.png",
        "selectedIconPath": "/images/SJJK_Select.png",
        "text": "报警"
      },
      {
        "pagePath": "/pages/my/index",
        "text": "我的",
        "iconPath": "/images/WD.png",
        "selectedIconPath": "/images/WD_Select.png"
      }
    ]
    wx.setStorageSync('tabBarList', tabBarList);
    wx.switchTab({
      url: tabBarList[0].pagePath,
    })
  },

  // 验证是否注册
  isRegister() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('res=', res);
        let wxcode = res.code
        wx.setStorageSync('wxcode', wxcode)
        request.get({
          url: 'SDLSMCIsRegister',
          data: {
            wxcode: wxcode,
            newPhone: ''
          },
          options: {
            hideLoading: true
          }
        }).then(result => {
          // 已注册
          wx.setStorageSync('OpenId', result.data.Datas.OpenId);
          wx.setStorageSync('Ticket', result.data.Datas.Ticket);
          wx.setStorageSync('UserCode', result.data.Datas.UserCode);
          this.GetSysMenuByUserID();
          wx.requestSubscribeMessage({
            tmplIds: ['hy8oFHZ3uiV-QuCIczWMZw5gKrecC_unYLXVQwsiqgg'],
            success (res) { 
             
      
            }
          })
        }).catch(err => {
          // 未注册
          console.log('err=', err);
          wx.showToast({
            title: err.data.Message,
          })
          wx.redirectTo({
            url: '/pages/register/register',
          })
        })
      }
    })
  },

  init() {
    if (!wx.getStorageSync('authorCode') || !wx.getStorageSync('Ticket') || !wx.getStorageSync('OpenId')) {
      wx.redirectTo({
        url: '/pages/authorCode/index',
      })
    } else {
      this.isRegister();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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