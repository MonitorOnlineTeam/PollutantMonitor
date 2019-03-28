// pages/realTimeData/home/home.js
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRow:'-',
    pageBackgroundColor:'white',
    identificationName: '', //异常详情
    identificationCode: '', //标识
    overMultiple: '', //超标倍数
    standValue:'',
    pointInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onPullDownRefresh();
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
  //点击页面横屏
  horizontalScreen: function() {
    wx.navigateTo({
      url: '../flowChart/flowChart'
    })
  },
  //获取数据
  getData: function() {
    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    var resultData ={
      dataitem:[],
      pointInfo:{}
    };
    comApi.getRealTimeDataForPoint().then(res => {
      if (res && res.IsSuccess) {
        if (res.Data) {
          let data = res.Data;
          resultData.dataitem = data.dataitem || [];
          resultData.pointInfo = data.pointInfo;
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
          showCancel: false,
          success(res) {
          }
        })
      }
      this.setData({
        dataitem: resultData.dataitem,
        pointInfo: resultData.pointInfo,
      })
      wx.hideNavigationBarLoading();
    })
  },
  //超标异常时弹出窗口
  showModal(e) {
    //debugger
    let { pollutantCode, pollutantName, overMultiple, identificationName, identificationCode, standValue} = e.currentTarget.dataset.obj;
    if (identificationCode == "1") {
      this.setData({
        identificationCode: identificationCode,
        overMultiple: overMultiple,
        modalName: e.currentTarget.dataset.target,
        selectedRow: pollutantName,
        standValue: standValue
      })
    } else if (identificationCode == "-1") {
      this.setData({
        identificationCode: identificationCode,
        identificationName: identificationName,
        modalName: e.currentTarget.dataset.target,
        selectedRow: pollutantName
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      selectedRow: '-'
    })
  },
})