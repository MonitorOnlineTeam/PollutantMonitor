// pages/realTimeData/home/home.js
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRow: '-',
    pageBackgroundColor: 'white',
    identificationName: '', //异常详情
    identificationCode: '', //标识
    overMultiple: '', //超标倍数
    standValue: '',
    pointInfo: null,
    isShowContent:false,
    isShowInfo: false,
    DGIMN:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DGIMN: common.getStorage('DGIMN')
    });
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
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
      common.setStorage('selectedPollutants', "");
      common.setStorage('selectedDate', moment().format('YYYY-MM-DD HH:mm'));
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
    var resultData = {
      dataitem: [],
      pointInfo: {}
    };
    comApi.getRealTimeDataForPoint().then(res => {
      console.log(res)
      if (res && res.IsSuccess) {
        if (res.Data) {
          let data = res.Data;
          resultData.dataitem = data.dataitem || [];
          resultData.pointInfo = data.pointInfo;
        }
      }
      this.setData({
        dataitem: resultData.dataitem,
        pointInfo: resultData.pointInfo,
      })
      let pointName = resultData.pointInfo && resultData.pointInfo.pointName;
      wx.setNavigationBarTitle({
        title: pointName,
      });
      common.setStorage("PointName", pointName);
      wx.setNavigationBarTitle({
        title: pointName,
      });
      
      wx.hideNavigationBarLoading();
    })
  },
  //超标异常时弹出窗口
  showModal(e) {
    //debugger
    let {
      pollutantCode,
      pollutantName,
      overMultiple,
      identificationName,
      identificationCode,
      standValue
    } = e.currentTarget.dataset.obj;
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
  }
})