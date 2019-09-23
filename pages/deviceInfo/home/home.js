// pages/deviceInfo/home/home.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData: null,
    dgimn: '',
    y: '',
    x: '',
    markers: [{
      iconPath: '',
      id: 0,
      latitude: 39.920000,
      longitude: 116.460000,
      width: 18,
      height: 35,
    }],
    isAuthor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      dgimn: common.getStorage('DGIMN'),
      isAuthor: app.isAuthor()
    });
    this.data.isAuthor && this.onPullDownRefresh();
  },
  goLogin: function() {
    app.goLogin();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // debugger
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //app.isLogin();
    //扫描二维码后改缓存变为true
    // if (!common.getStorage('IsHaveHistory')) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先扫描设备二维码',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         wx.switchTab({
    //           url: '/pages/my/home/home',
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    //   return false;
    // }

    this.data.isAuthor && app.isLogin();
    this.setData({
      isAuthor: app.isAuthor()
    });
    //登陆（或者扫描二维码）时已经把MN号码赋上，  ----目前时登陆赋上
    if (this.data.dgimn !== common.getStorage('DGIMN')) {
      this.setData({
        dgimn: common.getStorage('DGIMN')
      });
      this.onPullDownRefresh();
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
      path: `/pages/deviceInfo/home/home?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },
  //获取数据
  getData: function() {
    let that = this;
    var pointName = common.getStorage("PointName");


    const sdlMN = app.globalData.sdlMN.filter(m => m === common.getStorage('DGIMN'));
    if (sdlMN.length > 0) {
      app.getUserLocation(function(r) {
        if (r) {
          if (pointName != "") {
            wx.setNavigationBarTitle({
              title: pointName,
            })
          }
          comApi.getPointInfo().then(res => {
            if (res && res.IsSuccess) {
              if (res.Data) {
                let data = res.Data;
                //将数组中的某个字段拼接出来
                var lo = "markers[" + 0 + "].longitude";
                var la = "markers[" + 0 + "].latitude";

                var yy = (data.Longitude).toString();
                var xx = (data.Latitude).toString();

                that.setData({
                  resultData: data,
                  [lo]: data.Longitude, //markers中的经度
                  [la]: data.Latitude, //markers中的纬度
                  y: yy, //经度
                  x: xx, //纬度
                })
              }
            }
            wx.hideNavigationBarLoading();
          })
        }
        wx.hideNavigationBarLoading();
      })
    } else {
      if (pointName != "") {
        wx.setNavigationBarTitle({
          title: pointName,
        })
      }
      comApi.getPointInfo().then(res => {
        if (res && res.IsSuccess) {
          if (res.Data) {
            let data = res.Data;
            //将数组中的某个字段拼接出来
            var lo = "markers[" + 0 + "].longitude";
            var la = "markers[" + 0 + "].latitude";

            var yy = (data.Longitude).toString();
            var xx = (data.Latitude).toString();

            that.setData({
              resultData: data,
              [lo]: data.Longitude, //markers中的经度
              [la]: data.Latitude, //markers中的纬度
              y: yy, //经度
              x: xx, //纬度
            })
          }
        }
        wx.hideNavigationBarLoading();
      })
    }


  },
  //拨打电话(环保专工)
  CallHBFZ(e) {
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //拨打电话(运维人员)
  CallOperation(e) {
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  lookAddress: function() {
    wx.openLocation({
      longitude: Number(this.data.y),
      latitude: Number(this.data.x),
      name: this.data.resultData && common.getStorage("PointName"),
      address: this.data.resultData && this.data.resultData.PointAddress
    })
  }
})