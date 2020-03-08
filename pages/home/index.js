// pages/home/index.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyRecord: [],
    DGIMN: "",
    selectedTab: 0,
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
    console.log('app.globalData.userInfo=', app.globalData.userInfo);
    this.setData({
      DGIMN: common.getStorage("DGIMN"),
      userInfo: app.globalData.userInfo,
      isAuthor: app.isAuthor()
    })
    this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(common.getStorage("DGIMN_Old"));
    this.setData({
      DGIMN: common.getStorage("DGIMN")
    })
    app.isLogin();
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
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getData();
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
      path: `/pages/my/visitHistory/visitHistory?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },
  //获取历史数据
  getData: function() {
    let historyRecord = [];
    comApi.getPointVisitHistorys().then(res => {
      console.log(res)
      if (res && res.IsSuccess) {
        if (res.Datas) {
          var thisData = res.Datas;
          thisData.map(function(items) {
            historyRecord.push({
              EnterpriseName: items.EnterpriseName,
              PointName: items.PointName,
              VisitTime: items.VisitTime,
              DGIMN: items.DGIMN
            })
          });
          this.setData({
            historyRecord: historyRecord,
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  },
  //详情跳转到实时工艺页面
  showDetail(e) {
    var dgimn = e.currentTarget.id;
    var pointname = e.currentTarget.dataset.pointname;
    var targetname = e.currentTarget.dataset.targetname;
    common.setStorage("PointName", pointname);
    common.setStorage("TargetName", targetname);
    //common.setStorage("DGIMN_Old", dgimn);
    let _this = this;
    const sdlMN = app.globalData.sdlMN.filter(m => m === dgimn);
    if (sdlMN.length > 0) {
      app.getUserLocation(function(r) {
        if (r) {
          common.setStorage("DGIMN", dgimn);
          common.setStorage("OpenId_SDL", "");
          wx.navigateTo({
            url: '/pages/funcpage/index' //'/pages/realTimeData/home/home',
          })
        }
      }, 'history')
    } else {
      common.setStorage("DGIMN", dgimn);
      common.setStorage("OpenId_SDL", "");
      wx.navigateTo({
        url: '/pages/funcpage/index' //'/pages/realTimeData/home/home',
      })
    }
  },
  tapHistory: function() {
    const selectedTap = this.data.selectedTab;
    if (selectedTap === 0)
      return;

    this.setData({
      selectedTab: 0
    });
    wx.setNavigationBarTitle({
      title: '足迹'
    });

    console.log(1);
  },
  tapMy: function() {
    console.log(2);

    const selectedTap = this.data.selectedTab;
    if (selectedTap === 1)
      return;
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

    this.setData({
      selectedTab: 1
    });
    wx.setNavigationBarTitle({
      title: '我的'
    });
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

                var data = {};
                data.currentTarget = {};
                data.currentTarget.id = mn;
                data.currentTarget.pointname = mn;
                data.currentTarget.targetname = mn;
                this.showDetail(data);
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
  }

})