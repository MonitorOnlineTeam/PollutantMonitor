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
    QCAMN: '',
    isOpening: false,
    basicsList: [{
      icon: 'scan',
      name: '扫码质控仪'
    }, {
      icon: 'peoplefill',
      name: '人脸识别'
    }, {
      icon: 'unlock',
      name: '确认开锁'
    },],
    basics: 2,
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
      UserName: common.getStorage("UserName"),
      EntName: common.getStorage("EntName"),
      PointName: common.getStorage("PointName"),
      OnlineStatus: common.getStorage("OnlineStatus"),
      QCAStatus: common.getStorage("QCAStatus"),
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
    // common.setStorage("QCAMN", "");
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
     


      var typeRe = that.data.index;

      var remark = common.getStorage("DGIMN");
      var exception = false;
      comApi.qcaOpenDoor(remark).then(res => {
        console.log('res=', res);
        // wx.showLoading({
        //   title: '正在开锁',
        // })
        if (res && res.IsSuccess) {
          that.setData({
            isOpening: true
          });

          //显示开门动态gif
          setTimeout(function() {
            wx.hideLoading();
            //判断开门是否异常
            comApi.qcaOpenDoor(remark, 1).then(res => {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '门已关闭，请重新扫码开门',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    // wx.redirectTo({
                    //   url: '/pages/qca/analyzerList/analyzerList',
                    // })
                    wx.navigateBack({ delta: 1 })
                  }
                }
              });
            });
          }, 8000)
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

    });
  }
})