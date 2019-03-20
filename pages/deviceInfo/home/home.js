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
    DGIMN: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
        title: '索引列表',
        img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
        url: '../indexes/indexes'
      },
      {
        title: '微动画',
        img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
        url: '../animation/animation'
      },
      {
        title: '全屏抽屉',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
        url: '../drawer/drawer'
      },
      {
        title: '垂直导航',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
        url: '../verticalnav/verticalnav'
      }
    ],
    markers: [{
      iconPath: '/resources/others.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 35
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  methods: {
    toChild(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(common.getStorage('IsHaveHistory'));
    // debugger;
    // if (common.getStorage('IsHaveHistory')) {
    //   this.setData({
    //     DGIMN: common.getStorage('DGIMN')
    //   });
    //   this.onPullDownRefresh();
    // }
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
    //登陆（或者扫描二维码）时已经把MN号码赋上，  ----目前时登陆赋上
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
      this.setData({
        DGIMN: common.getStorage('DGIMN')
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

  },
  //获取数据
  getData: function() {
    var resultData = null;
    comApi.getPointInfo().then(res => {
      if (res && res.IsSuccess) {
        if (res.Data) {
          let data = res.Data;
          this.setData({
            resultData: data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '暂无数据，请重试',
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
      } else {
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
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
      wx.hideNavigationBarLoading();
    })
  },
  //拨打电话
  Call(e) {
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
})