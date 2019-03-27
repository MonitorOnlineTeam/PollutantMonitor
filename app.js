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
  onShow: function() {},
  /**
   * 小程序从前台进入后台时
   */
  onHide: function() {},
  /**
   * 小程序初始化完成时（全局只触发一次）
   */
  onLaunch: function() {
    common.setStorage('DGIMN', '62262431qlsp02')
    common.setStorage("PointName", '10号脱硫出口');
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    //TODO：判断是否需要输入设备密码  缓存用则跳转到 wode  没有的话，跳转到设备密码界面
    if (!common.getStorage('OpenId')) {
      this.login();
    } else {
      this.getUserInfo();
    }
  },
  redirectTo: function(url) {
    wx.switchTab({
      url: url
    })
  },
  login: function() {
    // 登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
        common.setStorage("IsHaveHistory", false);
        console.log('login', res)
        console.log('OpenId', common.getStorage('OpenId'))
        //common.setStorage('DGIMN', '62262431qlsp02')
        if (!common.getStorage('OpenId')) {
          console.log('OpenId1', common.getStorage('OpenId'))
        } else {
          this.getUserInfo();
        }
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
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              if (common.getStorage('DGIMN')) {
                wx.switchTab({
                  url: '/pages/realTimeData/home/home'
                })
              } else {
                this.redirectTo('/pages/my/home/home');
              }
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/authPage/authPage'
          })
        }
      }
    })
  },
  verifyPointIsNull: function() {
    if (!common.getStorage('DGIMN')) {
      wx.showModal({
        title: '提示',
        content: '请先扫描设备二维码',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/home/home'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
  },
  globalData: {
    userInfo: null,
    DGIMN: null,
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})