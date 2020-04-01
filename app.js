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
    // wx.showModal({
    //   title: '1',
    //   content: JSON.stringify(options),
    // })
    //处理分享页面
    if (options && options.scene === 1007) {
      common.setStorage("IsShare", true);
      common.setStorage("SharePath", `/${options.path}`);

      if (options.query && options.query.queryJson) {
        var queryJson = JSON.parse(options.query.queryJson);

        common.setStorage("DGIMN", queryJson.DGIMN);
        common.setStorage("isOpt", queryJson.isOpt);
        common.setStorage("ShareTabCur", queryJson.TabCur);
        common.setStorage('selectedPollutants', queryJson.selectedPollutants);
        common.setStorage('selectedDate', queryJson.selectedDate);
        common.setStorage('dataType', queryJson.dataType);
      }
    } else {
      common.setStorage("IsShare", false);
      common.setStorage("SharePath", null);
      common.setStorage('dataType', "");
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
  wxLogin: function(callback) {
    // 微信登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
        // if (!common.getStorage("OpenId")) {
        //   api.SDLSMCIsRegister().then(res => {
        //     var data = res.Datas;
        //     common.setStorage("OpenId", data.OpenId); //13800138000
        //     if (res.StatusCode == 10001) {
        //       common.setStorage("IsLogin", false);
        //     }

        //     if (res.IsSuccess) {
        //       common.setStorage("Ticket", data.Ticket);
        //       common.setStorage("PhoneCode", data.Phone);
        //       common.setStorage("IsLogin", true);
        //     } else {
        //       common.setStorage("Ticket", "");
        //       common.setStorage("IsLogin", false);
        //       common.setStorage("PhoneCode", "");
        //     }

        //   });
        // }
        callback && callback(true);
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

              wx.redirectTo({
                url: '/pages/home/index',
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.hideLoading();
            }
          })
        }
      }
    })
  },
  isLogin: function(callback) {

    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode") || !common.getStorage("IsLogin")) {
      // wx.navigateTo({
      //   url: '/pages/login/login',
      // });
      common.setStorage("IsShare", true);
      callback && callback(false);
      return;
    } else {
      common.setStorage("IsShare", false);
      callback && callback(true);
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
        callback(true);
        return;
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
    callback && callback(true);
    return;
  },
  isValidateSdlUrl: function(urlParam, callback) {
    let _this = this;
    try {
      let url = decodeURIComponent(urlParam);
      let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
      console.log('substr', substr);
      if (substr && substr.indexOf('flag=sdl,mn=') >= 0) {
        let mn = substr.split(',')[1].split('=')[1];

        if (mn.length > 0) {
          console.log("mn=", mn);
          common.setStorage("DGIMN", mn);
          _this.IsRegister(function(res) {

            if (res) {
              //验证是否先注册
              api.ValidateDGIMN(mn).then(vres => {
                //debugger;
                if (vres && vres.StatusCode == 200) {
                  if (!vres.IsSuccess) {

                    wx.showModal({
                      title: '提示',
                      content: '信息不存在，请先添加',
                      showCancel: true,
                      success(res) {
                        if (res.confirm) {
                          common.setStorage("DGIMN", mn);
                          wx.navigateTo({
                            url: '/pages/addpoint/addpoint/addpoint',
                          })
                        }
                      }
                    })
                    callback && callback(false);
                  } else {
                    api.qRCodeVerifyDGIMN(mn).then(res => {
                      console.log("res=", res);
                      if (res && res.IsSuccess) {
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
                  }

                } else {
                  if (vres.Message == "暂未注册!") {
                    wx.navigateTo({
                      url: '/pages/register/register',
                    })
                  } else {
                    wx.showToast({
                      title: vres.Message,
                      icon: 'none',
                    })
                  }
                }
              });
            } else {
              callback && callback(true);
            }
          });

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
  GetUserInfoNew: function(callback) {
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
              //common.setStorage('IsLogin', true);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.hideLoading();
              callback && callback(true);
            }
          })
        }
      }
    })
  },
  IsRegister: function(callback) {

    var that = this;
    if (!common.getStorage("OpenId") || !common.getStorage("IsLogin")) {
      that.wxLogin(function() {
        api.SDLSMCIsRegister().then(res => {
          var data = res.Datas;
          common.setStorage("OpenId", data.OpenId); //13800138000
          if (res.StatusCode == 10001) {
            common.setStorage("IsLogin", false);

            if (!common.getStorage('Agreement')) {
              common.setStorage("Agreement", false);
              wx.navigateTo({
                url: '/pages/lookagreement/index',
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '请注册授权后，再执行操作',
                showCancel: true,
                success(res) {
                  console.log(res);
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/register/register'
                    })
                  }
                }
              })
            }

            callback && callback(false)
            return;
          }

          if (res.IsSuccess) {
            common.setStorage("Ticket", data.Ticket);

            common.setStorage("PhoneCode", data.Phone);
            common.setStorage("IsLogin", true);
            common.setStorage("Agreement", true);
            callback && callback(true);

          } else {
            common.setStorage("Ticket", "");
            common.setStorage("IsLogin", false);
            common.setStorage("PhoneCode", "");
            common.setStorage("Agreement", true);
            // wx.showToast({
            //   title: res.Message,
            //   icon: 'none'
            // });
            wx.showModal({
              title: '提示',
              content: '请注册授权后，再执行操作',
              showCancel: true,
              success(res) {
                console.log(res);
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/register/register'
                  })
                }
              }
            })
            callback && callback(false);
            return;
          }
        });
      })

    } else {
      callback && callback(true);
    }
  },
  reloadRequest: function(callback) {
    var that = this;
    that.wxLogin(function() {
      api.initTicket(function() {
        //debugger;
        api.SDLSMCIsRegister().then(res => {
          var data = res.Datas;
          common.setStorage("OpenId", data.OpenId); //13800138000
          if (res.StatusCode == 10001) {
            //common.setStorage("Agreement", false);
            common.setStorage("IsLogin", false);
            that.IsRegister();
            callback && callback(false)
            return;
          }

          if (res.IsSuccess) {
            common.setStorage("Ticket", data.Ticket); //13800138000

            common.setStorage("PhoneCode", data.Phone); //13800138000
            common.setStorage("IsLogin", true);
            common.setStorage("Agreement", true);
            callback && callback(true);

          } else {
            common.setStorage("Ticket", ""); //13800138000
            common.setStorage("IsLogin", false);
            common.setStorage("PhoneCode", ""); //13800138000
            common.setStorage("Agreement", true);
            wx.showToast({
              title: res.Message,
              icon: 'none'
            });
            callback && callback(false);
          }

        });
      });
    })
  },
  IsEntryDetails: function() {
    if (common.getStorage("DGIMN")) {
      common.setStorage("IsEntryDetails", true);
      wx.redirectTo({
        url: '/pages/home/index',
      })
    } else {
      common.setStorage("IsEntryDetails", false);
      wx.navigateBack();
    }
  },
  RedirectToDetails: function() {
    var that = this;
    !that.globalData.loading && that.showLoading();
    common.setStorage("ApiType", 2);
    api.IfExistsDGIMN().then(res => {
      that.hideLoading();
      common.setStorage("ApiType", 1);
      console.log('res=', res);
      common.setStorage("dataType", "");
      common.setStorage("IsShare", false);
      if (res && res.requstresult == '0') {
        wx.navigateTo({
          url: '/pages/funcpage/index?isOpt=false',
        })
      } else {
        if (res && (res.requstresult == '1' || res.IsSuccess)) {
          wx.navigateTo({
            url: '/pages/funcpage/index?isOpt=true',
          })
        } else {
          wx.navigateTo({
            url: '/pages/funcpage/index?isOpt=false',
          })
        }
      }
    })
  },
  InitStorage: function(callback) {
    var that = this;
    that.wxLogin(function() {
      api.initTicket(function() {
        //debugger;
        api.SDLSMCIsRegister().then(res => {
          var data = res.Datas;
          common.setStorage("OpenId", data.OpenId); //13800138000
          if (res.StatusCode == 10001) {
            common.setStorage("IsLogin", false);
            that.IsRegister();
            callback && callback(false)
            return;
          }

          if (res.IsSuccess) {
            common.setStorage("Ticket", data.Ticket); //13800138000

            common.setStorage("PhoneCode", data.Phone); //13800138000
            common.setStorage("IsLogin", true);
            callback && callback(true);

          } else {
            common.setStorage("Ticket", ""); //13800138000
            common.setStorage("IsLogin", false);
            common.setStorage("PhoneCode", ""); //13800138000
            // wx.showToast({
            //   title: res.Message,
            //   icon: 'none'
            // });
            callback && callback(false);
          }
        });
      });
    })
  },
  onShareApp: function(callback) {
    var that = this;
    //1.判断是否为分享进来
    //2.如果为分享进来，请求接口返回票据，跳转到对应的路径页面 
    if (!common.getStorage("IsShare")) {
      callback && callback(false);
    } else {
      that.InitStorage(function(res) {
        callback && callback(res);
      });
    }

  },
  showLoading: function() {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    });
    this.globalData.loading = true;
  },
  hideLoading: function() {
    wx.hideLoading();
    this.globalData.loading = false;
  },
  globalData: {
    loading: false,
    userInfo: null,
    DGIMN: null,
    isShowContent: false,
    isShowInfo: false,
    isSdlDevice: false,
    sdlMN: ['0102030405060708090A0B0C0D0E0F10', '0202030405060708090A0B0C0D0E0F10', '0302030405060708090A0B0C0D0E0F10']
  }
})