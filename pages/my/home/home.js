// pages/my/home/home.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    isLoading: false,
    currentSize: 0,
    alarmSwitch: false,
    isAuthor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    this.setData({
      userInfo: app.globalData.userInfo,
      isAuthor: app.isAuthor()
    });
    console.log(this.data.userInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 报警开关
   */
  switchSex: function(e) {
    if (!this.data.isAuthor) {
      this.setData({
        alarmSwitch: false
      })
      app.Islogin(function() {});
      return false;
    }
    let that = this;
    if (e.detail.value) {
      wx.showModal({
        title: '提示',
        content: '确定要开启报警推送开关吗？开启后将通过微信公众号接受报警通知。',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../authorization/authorization'
            })
          } else if (res.cancel) {
            that.setData({
              alarmSwitch: false
            })
            console.log('用户点击取消')
          }
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '确定要关闭报警推送开关吗？关闭后将无法接收微信公众号报警通知。',
        success(res) {
          if (res.confirm) {
            comApi.cancelAuthorization().then({

            })
            that.setData({
              alarmSwitch: false
            })
          } else if (res.cancel) {
            that.setData({
              alarmSwitch: true
            })
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 报警列表
   */
  alarmData: function() {
    if (!this.data.isAuthor) {
      app.Islogin(function() {});
      return false;
    }
    wx.navigateTo({
      url: '../alarmDataList/alarmDataList'
    })
  },
  clearCache: function() {
    let that = this;
    that.setData({
      isLoading: true
    });
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存数据吗？',
      success(res) {
        that.setData({
          isLoading: false
        });
        if (res.confirm) {
          wx.clearStorageSync();
          that.updateCurrentSize(0);
          wx.showToast({
            title: '清除成功',
          })
          // wx.navigateTo({
          //   url: '/pages/qca/authorCode/authorCode',
          // });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  goLogin: function() {
    app.Islogin(function() {});
  },
  getUserInfo: function(e) {
    if (e.detail.rawData) {
      const data = e.detail.rawData;
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    !that.data.userInfo && wx.getSetting({
      success: res => {
        wx.showLoading({
          title: '正在加载中',
        })
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.showLoading({
                title: '正在加载中',
              })
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              that.setData({
                userInfo: app.globalData.userInfo
              });

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.hideLoading();
            }
          })
        } else {
          wx.hideLoading();
        }
      }
    })

    this.data.isAuthor && app.isLogin();
    console.log("globalData=", app.globalData);
    this.setData({
      userInfo: app.globalData.userInfo,
      isAuthor: app.isAuthor()
    });

    this.data.isAuthor && comApi.getAuthorizationState().then(res => {
      if (res && res.IsSuccess) {

        if (res.Data) {
          this.setData({
            alarmSwitch: true
          })
        } else {
          this.setData({
            alarmSwitch: false
          })
        }
      }
    })
    //app.isLogin();

    // var pointName = common.getStorage("PointName");
    // if (pointName != "") {
    //   wx.setNavigationBarTitle({
    //     title: pointName,
    //   })
    // }
    this.updateCurrentSize();
  },
  updateCurrentSize: function(size) {

    let that = this;
    wx.getStorageInfo({
      success(res) {
        // console.log(res.keys)
        console.log(res.currentSize);
        that.setData({
          currentSize: size != 0 ? res.currentSize : size
        });
        // console.log(res.limitSize)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: `/pages/my/home/home?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },


  //意见反馈
  showModal(e) {
    if (!this.data.isAuthor) {
      app.Islogin(function() {});
      return false;
    }
    wx.navigateTo({
      url: '../feedBack/feedBack'
    })
  },
  //访问历史
  showHistory() {
    if (!this.data.isAuthor) {
      app.Islogin(function() {});
      return false;
    }
    wx.navigateTo({
      url: '../visitHistory/visitHistory'
    })
  },
  clickScan: function() {

    if (!this.data.isAuthor) {
      app.Islogin(function() {});
      return false;
    }

    //http://api.chsdl.cn/wxwryapi?flag=sdl,mn=62262431qlsp01
    wx.scanCode({
      success(res) {
        if (res.errMsg == 'scanCode:ok') {

          try {
            //var scene = decodeURIComponent(options.scene);
            var scene = res.result;
            app.isValidateSdlUrl(scene, function(res) {
              if (res) {
                wx.switchTab({
                  url: '/pages/realTimeData/home/home'
                })
              }
            });
          } catch (e) {
            wx.showToast({
              icon: 'none',
              title: '无法识别二维码'
            })
          }
        }
        console.log(res)
      },
      fail: res => {
        // 接口调用失败
        // wx.showToast({
        //   icon: 'none',
        //   title: '二维码识别无效'
        // })
      }
    })
  },

})