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
    isAuthor: false,
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.setStorage("ApiType", 1);
    //common.setStorage("DGIMN", "");
    var that = this;

    if (options && options.q) {
      app.reloadRequest(function(res) {
        that.setData({
          userInfo: app.globalData.userInfo,
          isAuthor: res
        });
        if (res) {
          app.isValidateSdlUrl(options.q, function(res) {
            var mn = common.getStorage("DGIMN");
            if (res) {
              var data = {};
              data.currentTarget = {};
              data.currentTarget.id = mn;
              data.currentTarget.dataset = {};
              data.currentTarget.dataset.pointname = mn;
              data.currentTarget.dataset.targetname = mn;
              that.showDetail(data);
            } else {
              that.onPullDownRefresh();
            }
          });
        }
      });
    } else {
      app.reloadRequest(function(res) {
        if (res) {
          that.setData({
            userInfo: app.globalData.userInfo,
            isAuthor: res
          });
          that.onPullDownRefresh();
        }
      });
    }



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
    var that = this;
    common.setStorage("ApiType", 1);
    if (common.getStorage("IsEntryDetails")) {
      common.setStorage("IsEntryDetails", false);
      app.RedirectToDetails();
      return;
    } else {
      if (that.data.selectedTab == 0 && common.getStorage("IsLogin")) {
        that.onPullDownRefresh();
      }
    }

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
    var that = this;
    if (this.data.selectedTab == 1) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      return;
    }
    app.IsRegister(function(res) {
      if (res) {

        wx.showNavigationBarLoading();
        wx.stopPullDownRefresh();

        that.getData();
      } else {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });

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
  showLoading: function() {
    wx.showToast({
      title: '正在加载中',
      icon: 'loading'
    });
  },
  cancelLoading: function() {
    wx.hideToast();
  },
  //详情跳转到实时工艺页面
  showDetail(e) {
    this.showLoading();
    var dgimn = e.currentTarget.id;
    var pointname = e.currentTarget.dataset.pointname;
    var targetname = e.currentTarget.dataset.targetname;
    common.setStorage("PointName", pointname);
    common.setStorage("TargetName", targetname);
    //common.setStorage("DGIMN_Old", dgimn);
    let _this = this;
    const sdlMN = app.globalData.sdlMN.filter(m => m === dgimn);
    // if (sdlMN.length > 0) {
    //   app.getUserLocation(function(r) {
    //     if (r) {
    //       common.setStorage("DGIMN", dgimn);
    //       common.setStorage("OpenId_SDL", "");
    //       wx.navigateTo({
    //         url: '/pages/funcpage/index' //'/pages/realTimeData/home/home',
    //       })
    //     }
    //   }, 'history')
    // } else {
    //   common.setStorage("DGIMN", dgimn);
    //   common.setStorage("OpenId_SDL", "");
    //   wx.navigateTo({
    //     url: '/pages/funcpage/index' //'/pages/realTimeData/home/home',
    //   })
    // }
    common.setStorage("DGIMN", dgimn);
    app.RedirectToDetails();

    this.cancelLoading();
  },
  tapHistory: function() {
    const selectedTap = this.data.selectedTab;
    var isLogin = common.getStorage("IsLogin");
    if (selectedTap === 0 && !isLogin) {
      return;
    }

    if (!isLogin) {
      this.setData({
        historyRecord: [],
        selectedTab: 0
      })
      wx.setNavigationBarTitle({
        title: '足迹'
      });
      return;
    }

    if (this.data.historyRecord.length == 0)
      this.getData();


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
    let that = this;
    if (!this.data.userInfo) {
      that.setData({
        isAuthor: false
      });
    }

    console.log("userInfo=", this.data.userInfo);
    !that.data.userInfo && app.GetUserInfoNew(function(res) {
      if (res) {
        that.setData({
          userInfo: app.globalData.userInfo,
          isAuthor: true
        })
      }
    });

    that.setData({
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
          //wx.clearStorageSync();
          //that.updateCurrentSize(0);
          wx.showToast({
            title: '清除成功',
          });
          that.setData({
            DGIMN: "",
            userInfo: null,
            isAuthor: false,
            historyRecord: []
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
  getUserInfo: function(e, callback) {
    var that = this;
    if (e.detail.rawData) {
      const data = e.detail.rawData;
      app.globalData.userInfo = e.detail.userInfo;
      wx.showLoading({
        title: '',
      })
      app.GetUserInfoNew(function(res) {
        if (res) {
          that.setData({
            userInfo: app.globalData.userInfo,
            isAuthor: true
          })
          callback && callback();
        }
      });
      wx.hideLoading();

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
    app.IsRegister(function(res) {
      if (res) {
        wx.navigateTo({
          url: '/pages/my/feedBack/feedBack'
        })
      }
    });
  },
  clickScan: function() {

    var that = this;
    app.IsRegister(function(res) {
      if (res) {
        that.openQRCode();
      }
    });
  },
  openQRCode: function() {
    var that = this;
    common.setStorage("ApiType", 1);


    //http://api.chsdl.cn/wxwryapi?flag=sdl,mn=62262431qlsp01
    wx.scanCode({
      success(res) {
        if (res.errMsg == 'scanCode:ok') {

          try {
            //var scene = decodeURIComponent(options.scene);
            var scene = res.result;
            app.isValidateSdlUrl(scene, function(res) {
              var mn = common.getStorage("DGIMN");
              if (res) {
                var data = {};
                data.currentTarget = {};
                data.currentTarget.id = mn;
                data.currentTarget.dataset = {};
                data.currentTarget.dataset.pointname = mn;
                data.currentTarget.dataset.targetname = mn;
                that.showDetail(data);
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
  isLogin: function() {
    if (!common.getStorage("IsLogin")) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none'
      })
      return false
    }
    return true;
  }

})