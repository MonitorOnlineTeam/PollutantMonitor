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
      QCAAddress: common.getStorage("QCAAddress"),
      QCAName: common.getStorage("QCAName"),
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
    common.setStorage("QCAMN", "");
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
          showCancel: false,
          success(res) {
            console.log(res);
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/qca/analyzerList/analyzerList',
              })
            }
          }
        })
        return;
      }


      var typeRe = that.data.index;

      var remark = that.data.textareaBValue;
      var exception = false;
      comApi.qcaOpenDoor(remark).then(res => {
        console.log('res=', res);
        wx.showLoading({
          title: '门一打开……',
        })
        if (res && res.IsSuccess) {

        } else {
          wx.showModal({
            title: '提示',
            content: (res && res.Message) || '网络错误',
            showCancel: false,
            success(res) {}
          });
          exception = true;
        }
      });
      wx.showLoading({
        title: '门一打开……',
      })

      //显示开门动态gif
      setTimeout(function() {
        wx.hideLoading();
        //判断开门是否异常
        if (!exception) {
          comApi.qcaGetDoorState().then(res => {
            if (res && res.IsSuccess) {
              wx.navigateTo({
                url: '/pages/qca/changeGas/changeGas'
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '门已关闭，请重新扫码开门',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/qca/analyzerList/analyzerList',
                    })
                  }
                }
              });
            }
          });
        }
      }, 5000)
    });
  }
})