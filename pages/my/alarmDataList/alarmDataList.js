const moment = require('../../../utils/moment.min.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmDate: moment().format('YYYY-MM-DD'),
    selectedEntName: "",
    selectedEntCode: "",
    pageIndex: 1,
    pageSize: 10,
    alarmData: [],
    total: 0,
    typeColor: ['bg-orange', 'bg-olive', 'bg-blue'],
    entArray: [],
    objectEntArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //wx.authorize({ scope: "scope.userLocation" })
    // wx.getLocation({
    //   type: 'gcj02',
    //   async success(res) {

    //     const distance = util.VerifyCoordinate((res.latitude).toFixed(6), (res.longitude).toFixed(6));
    //     if (distance < 500) {
    //       //在距离内
    //     }

    //   },
    //   fail: function() {
    //     wx.showToast({
    //       title: '定位信息获取失败',
    //       icon: 'none',
    //       duration: 1000,
    //       mask: true
    //     })
    //   }
    // });

    //app.getUserLocation();
    this.setData({
      beginTime: this.data.alarmDate + " 00:00:00",
      endTime: this.data.alarmDate + " 23:59:59"
    });
    this.getEntList();

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

    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.setData({
      pageIndex: 1
    });

    this.getAlarmData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    if (!this.data.isLast) {
      this.setData({
        pageIndex: ++this.data.pageIndex
      });
      this.getAlarmData();
    } else {
      console.log("已经到最后了");
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getAlarmData: function() {
    let beginTime = this.data.beginTime; // "2019-07-25 00:00:00";
    let endTime = this.data.endTime; // "2019-07-26 00:00:00";
    let entCode = this.data.selectedEntCode;
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    comApi.getAlarmDataList(beginTime, endTime,
      entCode, pageIndex, pageSize).then(res => {
      let alarmData = [];
      if (res && res.IsSuccess) {

        var thisData = res.Datas;

        thisData.map(item => {
          alarmData.push({
            DGIMN: item.DGIMN,
            PointName: item.PointName,
            AlarmTypText: item.AlarmTypText.split(',')
          })
        })
        if (thisData.length < 10 || !thisData) {
          this.setData({
            isLast: true
          })
        }
        this.setData({
          alarmData: pageIndex > 1 ? this.data.alarmData.concat(alarmData) : alarmData,
          total: res.Total
        })
      }
      wx.hideNavigationBarLoading();
    })
  },
  getEntList: function() {
    var that = this;
    comApi.getUserEntInfo().then(res => {
      if (res && res.IsSuccess && res.Datas) {
        let thisData = res.Datas;
        let entArray = [];
        let objectEntArray = [];
        thisData.map(function(item, index) {
          entArray.push(item.EntName);
          objectEntArray.push({
            id: item.EntCode,
            name: item.EntName
          });
          if (index == 0) {
            that.setData({
              selectedEntName: item.EntName,
              selectedEntCode: item.EntCode
            });
          }
        })

        this.setData({
          entArray: entArray,
          objectEntArray: objectEntArray
        });
        that.onPullDownRefresh();
      }
    });
  },
  queryDetails: function(e) {
    let mn = e.currentTarget.dataset.mn;
    wx.navigateTo({
      url: `../alarmDataDetails/alarmDataDetails?entCode=${this.data.selectedEntCode}&DGIMN=${mn}&beginTime=${this.data.beginTime}&endTime=${this.data.endTime}`,
    })
  },
  test: function() {
    app.getUserLocation();
  },
  bindEntChange: function(e) {
    console.log(e.detail);
    var data = this.data.objectEntArray[e.detail.value];
    this.setData({
      selectedEntName: data.name,
      selectedEntCode: data.id,
      pageIndex: 1
    });
    this.getAlarmData();
  },
  bindDateChange: function(e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({
      alarmDate: value,
      beginTime: value + " 00:00:00",
      endTime: value + " 23:59:59"
    });
    this.onPullDownRefresh();


  }
})