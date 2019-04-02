// pages/others/others.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  redrictHistory: function () {
    wx.navigateTo({
      url: '/pages/my/visitHistory/visitHistory'
    })
  },
  redrictScan: function () {
    let that = this;
    wx.scanCode({
      success(res) {
        if (res.errMsg == 'scanCode:ok') {

          try {
            //var scene = decodeURIComponent(options.scene);
            var scene = res.result;
            let url = decodeURIComponent(scene);
            let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
            console.log('substr', substr);
            if (substr && substr.indexOf('flag=sdl&mn=') >= 0) {
              let mn = substr.split('&')[1].split('=')[1];
              if (mn) {
                comApi.qRCodeVerifyDGIMN(mn).then(res => {
                  if (res && res.IsSuccess) {
                    common.setStorage("DGIMN", mn);
                    wx.switchTab({
                      url: '/pages/realTimeData/home/home'
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: res.Message,
                      showCancel: false,
                      success(res) { }
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
  }
})