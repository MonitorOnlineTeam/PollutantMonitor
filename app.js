// app.js
import request from './utils/request'
App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    console.log("request=", request)
    // 判断是否登录
    let isLogin = wx.getStorageSync('Ticket');
    if (isLogin) {
      return;
    }
  },
  globalData: {
    menuId: '722ed7fd-6665-43b5-b39e-5fdafcd6ef99',
    userInfo: null,
    entAndPointList: [],
    airList: [],
    pointInfo: {},
  }
})