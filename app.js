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
  onLoad: function() {},
  onLoad: function() {},
  /**
   * 小程序启动，或从后台进入前台显示时
   */
  onShow: function(options) {

    //处理分享页面
    if (options && options.scene===1007)
    {
      if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode"))
      {
        wx.navigateTo({
          url: '/pages/login/login',
        });
        common.setStorage("IsShare", true);
        return;
      }

      if (options.query&&options.query.DGIMN)
      {
        
        comApi.verifyDGIMN(options.query.DGIMN).then(res => {
          if (res && res.IsSuccess) {
            common.setStorage("DGIMN", options.query.DGIMN);
           
          } else {
            //common.setStorage("DGIMN", mn);
          
            wx.showModal({
              title: '提示',
              content: res.Message,
              showCancel: false,
              success(res) { 
                wx.navigateTo({
                  url: '/pages/login/login',
                });
              }
            })
          }
        })
      }
    }else
    {
      common.setStorage("IsShare", false);
    }
    

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将更新',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  /**
   * 小程序从前台进入后台时
   */
  onHide: function() {},
  /**
   * 小程序初始化完成时（全局只触发一次）
   */
  onLaunch: function() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将更新',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    })

    // common.setStorage('DGIMN', '62262431qlsp02')
    // common.setStorage("PointName", '10号脱硫出口');
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    this.wxLogin();
  },
  redirectTo: function(url) {
    wx.switchTab({
      url: url
    })
  },
  wxLogin: function() {
    // 微信登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
      }
    })
  },
  getUserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.showLoading({
                title: '正在加载中',
              })
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              if (common.getStorage("IsShare"))
              {
                wx.navigateBack();
              }
              if (common.getStorage('DGIMN')) {
                wx.switchTab({
                  url: '/pages/realTimeData/home/home'
                })
              } else {
                wx.redirectTo({
                  url: '/pages/others/others'
                })
                //this.redirectTo('/pages/my/home/home');
              }
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.hideLoading();
            }
          })
        } else {

          wx.redirectTo({
            url: '/pages/authPage/authPage'
          })
        }
      }
    })
  },
  verifyPointIsNull: function() {
    if (!common.getStorage('DGIMN')) {
      if (common.getStorage("IsShare")) {
        wx.navigateBack();
      }
      wx.redirectTo({
        url: '/pages/others/others'
      })
      return false;
    }
  },
  isLogin:function(){

    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      
      return;
    }
  },
  globalData: {
    userInfo: null,
    DGIMN: null,
    isShowContent: false,
    isShowInfo: false
  }
})