// pages/qca/opendoor/opendoor.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaBValue: '',
    picker: ['更换标气', '维护备件', '设备维修', '设备巡检'],
    index: 0,
    userName: '',
    QCAMN: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options=', options);
    let that = this;
    if (options && options.q) {
      app.wxLogin(function() {
        let url = decodeURIComponent(options.q);
        let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
        console.log('substr', substr);
        if (substr && substr.indexOf('mn=') >= 0) {
          let mn = substr.split('=')[1];
          if (mn) {
            app.Islogin(function() {
              comApi.qcaValidataQCAMN(mn).then(res => {
                console.log('res=', res);
                if (res && res.IsSuccess) {
                  common.setStorage("QCAMN", mn); //13800138000
                  //app.Islogin();
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '二维码识别无效'
                  })
                }
              });
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '二维码识别无效'
            })
          }
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
    this.setData({
      userName: common.getStorage("UserName"),
      QCAMN: common.getStorage("QCAMN"),
      textareaBValue: ''
    });
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

  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    if (e.detail.value != 0) {
      wx.showModal({
        title: '提示',
        content: '功能暂未开放',
        showCancel: false,
        success(res) {}
      })
      return;
    }
    this.setData({
      index: e.detail.value
    })
  },
  openlock: function() {
    var that = this;
    app.Islogin(function() {
      if (!common.getStorage("QCAMN")) {
        wx.showModal({
          title: '提示',
          content: '请先扫描设备二维码，再执行操作',
          showCancel: true,
          success(res) {
            console.log(res);
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/qca/scan/scan',
              })
            }
          }
        })
        return;
      }


      var typeRe = that.data.index;

      var remark = that.data.textareaBValue;
      if (remark) {
        comApi.qcaOpenDoor(remark).then(res => {
          console.log('res=', res);
          if (res && res.IsSuccess) {
            //common.setStorage("QCAMN", scene); //13800138000
            wx.navigateTo({
              url: '/pages/qca/changeGas/changeGas'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: (res && res.Message) || '网络错误',
              showCancel: false,
              success(res) {}
            })
            // wx.navigateTo({
            //   url: '/pages/qca/changeGas/changeGas'
            // })
          }
        });
      } else {
        // wx.showToast({
        //   icon: 'none',
        //   title: '''
        // })
      }
    });
  },
  login: function() {
    app.Islogin(function() {
      if (!common.getStorage("QCAMN")) {
        wx.showModal({
          title: '提示',
          content: '请先扫描设备二维码，再执行操作',
          showCancel: true,
          success(res) {
            console.log(res);
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/qca/scan/scan',
              })
            }
          }
        })
        return;
      }
    });
  }
})