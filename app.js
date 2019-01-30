/**
 * Api API 模块
 * @type {Object}
 */
const api = require('./utils/api.js')

//app.js

App({

  api: api,
  onLoad: function() {
    console.log(2);
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLaunch: function() {
    console.log(1);
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        return api.getOpenId(res.code)
          .then(d => {
            console.log('success', d)
          })
          .catch(e => {
            console.error('error', e)
          })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})