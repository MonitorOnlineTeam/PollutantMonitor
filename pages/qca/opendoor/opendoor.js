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
    onlineLst: ['离线', '正常', '超标', '异常'],
    qcLst: ['空闲', '运行', '维护', '故障', '断电', '离线'],
    basicsList: [{
      icon: 'scan',
      name: '扫码质控仪'
    }, {
      icon: 'peoplefill',
      name: '人脸识别'
    }, {
      icon: 'unlock',
      name: '确认开锁'
    }, ],
    basics: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options=', options);

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
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // common.setStorage("QCAMN", "");
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
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  openlock: function () {
    var that = this;
    app.Islogin(function () {



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
          //建立连接
          wx.connectSocket({
            url: wsApi,
            header: {
              'content-type': 'application/json'
            },
            //method:"GET",
            protocols: ['protocol1'],
            success: function () {
              console.log("客户端连接成功！");
              wx.onSocketOpen(function () {
                console.log('webSocket已打开！');
                socketOpen = true;
                wx.onSocketMessage(function (msg) {
                  console.log(msg);
                })
              })
            }
          })

          //显示开门动态gif
          setTimeout(function () {
            wx.hideLoading();

            that.setData({
              isOpening: false
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