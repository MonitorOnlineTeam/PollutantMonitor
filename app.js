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
  onLoad: function() {

  },
  /**
   * 小程序启动，或从后台进入前台显示时
   */
  onShow: function() {

    // if (!common.getStorage("userId")) {
    //   wx.showToast({
    //     title: '提示',
    //     icon: 'success',
    //     duration: 10000
    //   })
    //   return false;
    // }
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
    console.log('onLaunch');

    //TODO：判断是否需要输入设备密码  缓存用则跳转到 wode  没有的话，跳转到设备密码界面
    this.login();
    // if (!common.getStorage('AuthorCode')) {

    // }

    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log('res111111111111', res);
    //       // wx.switchTab({
    //       //   url: '/pages/my/my'
    //       // })
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log('res', res);
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         },
    //         fail: function(res) {
    //           console.log('fail', res);
    //         }
    //       })
    //       // wx.showModal({
    //       //   title: '提示',
    //       //   content: '请先授权',
    //       //   showCancel: false,
    //       //   success(res) {
    //       //     if (res.confirm) {
    //       //       console.log('用户点击确定')
    //       //     } else if (res.cancel) {
    //       //       console.log('用户点击取消')
    //       //     }
    //       //   }
    //       // })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    DGIMN: null
  },
  redirectTo: function(url) {
    wx.switchTab({
      url: url
    })
  },
  login: function() {
    // wx.scanCode({
    //   success(res) {

    //   },
    //   fail() { }
    // })
    //this.redirectTo('/pages/proving/proving');
    // 登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
        console.log('login', res)
        console.log('OpenId', common.getStorage('OpenId'))
        common.setStorage('DGIMN', '62262431qlsp02')
        if (!common.getStorage('OpenId')) {
          console.log('OpenId1', common.getStorage('OpenId'))
          // wx.navigateTo({
          //   url: '/pages/proving/proving'
          // })
        } else {
          //common.setStorage('DevicePwd','')
          if (common.getStorage('DevicePwd')) {
            api.verifyDevicePwd()
              .then(res => {
                if (res && res.IsSuccess) {
                  this.redirectTo('/pages/my/my');
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.Message,
                    showCancel: false,
                    success(res) {
                    }
                  })
                }
              })
          }
        }

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // return api.validateFirstLogin(res.code)
        //   .then(res => {
        //     console.log('validateFirstLogin', res)
        //     if (res && res.IsSuccess) {
        //       if (res.Data) {
        //         common.setStorage("IsFirstLogin", res.Data.IsFirstLogin)
        //         common.setStorage("AuthorCode", res.Data.AuthorCode)
        //         common.setStorage("DGIMN_New", '62262431qlsp02')//62262431qlsp02  51052216080302
        //       }
        //       // if (!common.getStorage('IsFirstLogin')) {
        //       //   this.redirectTo('/pages/my/my');
        //       // } else {
        //       //   this.redirectTo('/pages/proving/proving');
        //       // }
        //       if (res.Data.IsFirstLogin) {
        //         wx.showToast({
        //           title: '首次登陆',
        //           icon: 'success',
        //           duration: 2000
        //         })
        //         //this.redirectTo('/pages/proving/proving');
        //       } else {
        //         wx.showToast({
        //           title: '已登录',
        //           icon: 'success',
        //           duration: 2000
        //         })
        //         if (common.gettStorage('DevicePwd'))
        //         {
        //           this.redirectTo('/pages/my/my');
        //         }else
        //         {
        //           this.redirectTo('/pages/device/device');
        //         }
        //         //this.redirectTo('/pages/my/my');
        //       }
        //     }
        //   })
        //   .catch(e => {
        //     console.error('error', e)
        //   })
      }
    })
  }
})