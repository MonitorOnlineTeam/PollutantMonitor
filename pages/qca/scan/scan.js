// pages/qca/scan/scan.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  redrictScan: function() {
    let that = this;
    app.Islogin(function() {
      wx.scanCode({
        success(res) {
          console.log("res=", res);
          if (res.errMsg == 'scanCode:ok') {

            try {
              //var scene = decodeURIComponent(options.scene);//qcaValidataQCAMN
              var scene = res.result;

              app.wxLogin(function() {
                let url = decodeURIComponent(scene);
                let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
                console.log('substr', substr);
                if (substr && substr.indexOf('mn=') >= 0) {
                  let mn = substr.split('=')[1];
                  if (mn) {

                    comApi.qcaValidataQCAMN(mn).then(res => {
                      console.log('res=', res);
                      if (res && res.IsSuccess) {
                        common.setStorage("QCAMN", mn); //13800138000
                        wx.switchTab({
                          url: '/pages/qca/opendoor/opendoor'
                        })
                      } else {
                        that.noQRMessage();
                      }
                    });
                  } else {
                    that.noQRMessage();
                  }
                } else {
                  that.noQRMessage();
                }
              });
            } catch (e) {
              that.noQRMessage();
            }
          }
          //console.log(res)
        },
        fail: res => {
          // 接口调用失败
          //that.noQRMessage();
        }
      })
    });
  },
  noQRMessage:function(){
    wx.showToast({
      icon: 'none',
      title: '二维码识别无效'
    })
  }
})