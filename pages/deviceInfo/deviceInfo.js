//  pages/deviceInfo/deviceInfo.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData: [],
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
      width: 50,
      height: 50
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
    debugger
    if (common.getStorage('IsHaveHistory')) {
      this.setData({
        DGIMN: common.getStorage('DGIMN')
      });
      this.onPullDownRefresh();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    debugger
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    debugger
    if (!common.getStorage('IsHaveHistory')) {
      wx.showModal({
        title: '提示',
        content: '请先扫描设备二维码',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    debugger
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
    var resultData = [];
    comApi.getPointInfo().then(res => {
      if (res && res.IsSuccess) {
        if (res.Data.length > 0) {
          let data = res.Data[0];
          this.setData({
            resultData: data
          })
          console.log(this.resultData)
          debugger
          // this.setData({
          //   DGIMN: data.DGIMN,
          //   pointName: data.pointName,
          //   pointType: data.OutputType,
          //   pointStatus: data.pointstatus == 1 ? '正常' : '异常',
          //   pointPFType: data.pollutantTypeName,
          //   pointDiameter: data.OutputDiameter,
          //   pointHeight: data.OutputHigh,
          //   longitude: data.longitude,
          //   latitude: data.latitude,
          //   fzUserName: data.SWUserName,
          //   fzUserPhone: '138001380000',
          //   operationName: data.operationUserName,
          //   operationPhone: '18601364607',
          //   pointAddress: data.Address,
          //   markers: [{
          //     id: 1,
          //     latitude: data.latitude,
          //     longitude: data.longitude,
          //     name: 'T.I.T 创意园'
          //   }]
          // })
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
  }
})