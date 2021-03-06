/**
 * Api API 模块
 * @type {Object}
 */
const api = require('./utils/api.js')
const common = require('./utils/common.js')
const util = require('./utils/util.js')
//app.js

App({
  message: "网络请求失败，请重试",
  api: api,
  common: common,
  onLoad: function() {},
  onLoad: function() {},
  /**
   * 小程序启动，或从后台进入前台显示时
   */
  onShow: function(options) {


    //处理分享页面
    if (options && options.scene === 1007) {
      if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
        wx.switchTab({
          url: '/pages/qca/analyzerList/analyzerList'
        })
        common.setStorage("IsShare", true);
        return;
      }

      if (options.query && options.query.DGIMN) {
        common.setStorage("QCAMN", options.query.DGIMN);
        api.qRCodeVerifyDGIMN(options.query.DGIMN).then(res => {
          if (res && res.IsSuccess) {
            common.setStorage("QCAMN", options.query.DGIMN);

          } else {
            //common.setStorage("DGIMN", mn);

            wx.showModal({
              title: '提示',
              content: res.Message,
              showCancel: false,
              success(res) {
                common.setStorage("IsShare", false);
                wx.switchTab({
                  url: '/pages/qca/analyzerList/analyzerList'
                })
              }
            })
          }
        })
      } else {
        // wx.switchTab({
        //   url: '/pages/qca/scan/scan'
        // })
      }
    } else {
      common.setStorage("IsShare", false);
    }


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


  },
  /**
   * 小程序从前台进入后台时
   */
  onHide: function() {

    // common.setStorage("QCAMN", "");
    // wx.switchTab({
    //   url: '/pages/qca/scan/scan'
    // })
  },
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
  wxLogin: function(callback) {
    // 微信登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
        console.log('WxCode=', res.code);
        callback && callback();
      }
    })
  },
  getUserInfo: function(options) {
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

              if (common.getStorage("IsShare")) {
                wx.navigateBack();
              }
              if (common.getStorage('DGIMN')) {
                if (options && options.authorization) {

                  wx.switchTab({
                    url: '/pages/my/home/home',
                  })
                  return;
                }
                if (options && options.alarmdatatime) {
                  wx.navigateTo({
                    url: '/pages/my/alarmDataList/alarmDataList?monitorTime=' + options.alarmdatatime,
                  })
                  return;
                }

                wx.switchTab({
                  url: '/pages/realTimeData/home/home'
                })
              } else {
                wx.navigateTo({
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

          wx.navigateTo({
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
  isLogin: function() {

    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      common.setStorage("IsShare", true);
      return;
    } else {
      common.setStorage("IsShare", false);
    }
  },
  geo: function(callback, flagR) {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("latitude=", res.latitude);
        console.log("longitude=", res.longitude);
        const distance = util.VerifyCoordinate((latitude).toFixed(6), (longitude).toFixed(6));
        console.log(distance);
        if (distance > 500) {
          //common.setStorage("DGIMN", "SDL***XXX");
          wx.showModal({
            title: '提示',
            content: '无法访问该设备数据，请在指定区域范围内查看设备数据', //'网络错误，请重试',JSON.stringify(res)
            showCancel: false,
            success(res) {
              if (res.confirm) {

                if (flagR !== 'history') {
                  common.setStorage("DGIMN", common.getStorage("DGIMN_Old"));
                  wx.navigateTo({
                    url: '/pages/my/visitHistory/visitHistory'
                  })
                }

              } else if (res.cancel) {
                common.setStorage("DGIMN", common.getStorage("DGIMN_Old"));
                console.log('用户点击取消')
              }
            }
          })
          callback && callback(false);

        } else {
          callback && callback(distance < 500);
        }
        //return distance < 500000;
      },
      fail: function() {
        wx.showToast({
          title: '定位信息获取失败',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        callback && callback(false);
        //return false;
      }
    })

  },
  getUserLocation: function(callback, flagR) {
    var _this = this;
    wx.showLoading({
      title: '正在获取位置',
    });
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
                callback && callback(false);
                //return false;
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      //再次授权，调用wx.getLocation的API
                      _this.geo(function(f) {
                        wx.hideLoading()
                        callback && callback(f);
                      }, flagR)


                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      wx.hideLoading()
                      callback && callback(false);
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.geo(function(f) {
            wx.hideLoading()
            callback && callback(f);
          }, flagR)
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.geo(function(f) {
            wx.hideLoading()
            callback && callback(f);
          }, flagR)
        }
      }
    })
  },
  isValidateSdlUrl: function(urlParam, callback) {
    let _this = this;

    try {
      let url = decodeURIComponent(urlParam);
      let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
      console.log('substr', substr);
      if (substr && substr.indexOf('flag=sdl,mn=') >= 0) {
        let mn = substr.split(',')[1].split('=')[1];
        if (mn) {
          api.qRCodeVerifyDGIMN(mn).then(res => {
            if (res && res.IsSuccess) {
              const sdlMN = _this.globalData.sdlMN.filter(m => m === mn);

              if (sdlMN.length > 0) {
                common.setStorage("OpenId_SDL", "13800138000"); //13800138000
              } else {
                common.setStorage("OpenId_SDL", "");
              }
              if (common.getStorage("DGIMN"))
                common.setStorage("DGIMN_Old", common.getStorage("DGIMN"));
              else {
                common.setStorage("DGIMN_Old", mn);
              }
              common.setStorage("DGIMN", mn);

              callback && callback(true);
            } else {
              //common.setStorage("DGIMN", mn);
              wx.showModal({
                title: '提示',
                content: res.Message,
                showCancel: false,
                success(res) {}
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '无法识别，请重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '无法识别，请重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } catch (e) {
      wx.showToast({
        icon: 'none',
        title: '无法识别二维码'
      })
    }
    callback && callback(false);
  },
  isAuthor: function() {
    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
      return false;
    } else {
      return true;
    }
  },
  goLogin: function() {
    wx.showModal({
      title: '提示',
      content: '登录后查看更多信息',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getMyPhoto: function() {
    wx.getSetting({
      success: res => {
        debugger
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              debugger
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

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
  Islogin: function(callback) {
    if (!common.getStorage("IsAuthor")) {
      wx.showModal({
        title: '提示',
        content: '请先授权后，再执行操作',
        showCancel: true,
        success(res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/qca/authorCode/authorCode'
            })
          }
        }
      })
      return;
    }

   
    callback();
  },
  globalData: {
    userInfo: null,
    DGIMN: null,
    isShowContent: false,
    isShowInfo: false,
    isSdlDevice: false,
    baiduapikey: "56K7zFtlgXr0MNZnXLPtcs5G",
    baidusecretkey: "LesGCxRX7qhK1PBbXI4zf54Pak7tBA0D",
    sdlMN: ['0102030405060708090A0B0C0D0E0F10', '0202030405060708090A0B0C0D0E0F10', '0302030405060708090A0B0C0D0E0F10']
  }
})