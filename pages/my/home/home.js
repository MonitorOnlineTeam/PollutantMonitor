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
    isLoading:false,
    currentSize:0,
    alarmSwitch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 

    this.setData({
      userInfo: app.globalData.userInfo
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
  switchSex:function(e){
    if (e.detail.value)
    {
      wx.navigateTo({
        url: '../authorization/authorization'
      })
    }
    else
    {
      comApi.cancelAuthorization().then({

      })
    }
  },
  /**
   * 报警列表
   */
  alarmData:function(){
    wx.navigateTo({
       url:'../alarmDataList/alarmDataList'
     })
  },
  clearCache:function(){
    let that=this;
    that.setData({
      isLoading:true
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
          that.updateCurrentSize();
          wx.redirectTo({
            url: '/pages/login/login',
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    comApi.getAuthorizationState().then(res => {
      if (res && res.IsSuccess) {
         
        if (res.Data) {
           this.setData({
             alarmSwitch:true
           })
        }
        else{
          this.setData({
            alarmSwitch: false
          })
        }
      }
    })


    app.isLogin();

    var pointName = common.getStorage("PointName");
    if (pointName != "") {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    this.updateCurrentSize();
  },
  updateCurrentSize:function(){

    let that = this;
    wx.getStorageInfo({
      success(res) {
        // console.log(res.keys)
        console.log(res.currentSize);
        that.setData({
          currentSize: res.currentSize
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
    wx.navigateTo({
      url: '../feedBack/feedBack'
    })
  },
  //访问历史
  showHistory() {
    wx.navigateTo({
      url: '../visitHistory/visitHistory'
    })
  },
  clickScan: function() {
    //http://api.chsdl.cn/wxwryapi?flag=sdl&mn=62262431qlsp01
    wx.scanCode({
      success(res) {
        if (res.errMsg == 'scanCode:ok') {

          try {
            //var scene = decodeURIComponent(options.scene);
            var scene = res.result;
            let url = decodeURIComponent(scene);
            let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
            console.log('substr', substr);
            if (substr && substr.indexOf('flag=sdl,mn=') >= 0) {
              let mn = substr.split(',')[1].split('=')[1];
              if (mn) {
                comApi.qRCodeVerifyDGIMN(mn).then(res => {
                  if (res && res.IsSuccess) {
                    common.setStorage("DGIMN", mn);
                    wx.switchTab({
                      url: '/pages/realTimeData/home/home'
                    })

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