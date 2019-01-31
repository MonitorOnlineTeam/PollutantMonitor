/**
 * Api API 模块
 * @type {Object}
 */
const api = require('./utils/api.js')
const common = require('./utils/common.js')
//app.js

App({

  api: api,
  common: common,
  onLoad: function() {
    //console.log(2);
  },
  /**
   * 小程序启动，或从后台进入前台显示时
   */
  onShow: function() {

    if (!common.getStorage("userId")) {
      wx.showToast({
        title: '提示',
        icon: 'success',
        duration: 10000
      })
      return false;
    }
  },
  /**
   * 小程序从前台进入后台时
   */
  onHide: function() {
    common.setStorage("userId", "123456")
    common.setStorage("userName", "zhangsan")

  },
  /**
   * 小程序初始化完成时（全局只触发一次）
   */
  onLaunch: function() {

    // 登录
    wx.login({
      success: res => {
        console.log('login',res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        return api.validateFirstLogin(res.code)
          .then(res => {
            console.log('validateFirstLogin', res)
            if (res && res.IsSuccess) {
              if (res.Data) {
                common.setStorage("IsFirstLogin", res.Data.IsFirstLogin)
                common.setStorage("AuthorCode", res.Data.AuthorCode)
              }
              if (res.Data.IsFirstLogin)
              {
                wx.showToast({
                  title: '首次登錄',
                  icon: 'success',
                  duration: 2000
                })
              }else
              {
                wx.showToast({
                  title: '已登錄',
                  icon: 'success',
                  duration: 2000
                })
                
                // api.getUserInfo().then(res=>{
                //   console.log('getUserInfo',res)
                // })

                // api.getPointInfo('51052216080302').then(res => {
                //   console.log('getPointInfo', res)
                // })

                // api.getPollutantList('51052216080302').then(res=>{
                //   console.log('getPollutantList',res)
                // })

                // api.getDeviceInfo('51052216080302').then(res => {
                //   console.log('getDeviceInfo', res)
                // })

                // api.getProcessFlowChartStatus('51052216080302').then(res => {
                //   console.log('getProcessFlowChartStatus', res)
                // })
              }
            }
          })
          .catch(e => {
            console.error('error', e)
          })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log(123);
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
  globalData: {
    userInfo: null
  }
})