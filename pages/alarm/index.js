// pages/alarm/index.js
import request from '../../utils/request'
import demo from '../../utils/demo'
import {
  getTabBarSelectedIndex
} from '../../utils/util'
import moment from 'moment'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmDataList: [],
    _pageIndex: 1,
    _total: 0,
    isDemo:false,
    noSubscribe:app.globalData.noSubscribe,
  },

  // 获取报警列表数据
  GetAlarmDataList() {
    /**
     * alarmType
     * 0    数据异常
     * 2    数据超标
     * 12   缺失数据报警
     */
    request.post({
      url: 'GetAlarmInfoList',
      data:{
        "beginTime": moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00'),
        "endTime": moment().format("YYYY-MM-DD 23:59:59"),
        // "alarmType": "",
        "pageSize": 20,
        "pageIndex": this.data._pageIndex
      },
    }).then(result => {
      // console.log('result=', result);
      // app.globalData.noSubscribe = app.checkSubscribe();
      if (this.data.isDemo) {
        let alarmResult = demo.alarmResult;
        console.log(demo.alarmResult);
        if (alarmResult && alarmResult.IsSuccess) {
          this.setData({
            alarmDataList: alarmResult.Datas,
            _total: alarmResult.Total,
          })
        }
      } else {
        if (result.data && result.data.IsSuccess) {
          this.setData({
            alarmDataList: result.data.Datas,
            _total: result.data.Total,
          })
        }
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('onLoad');
    // this.GetAlarmDataList();
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
    const launchType = wx.getStorageSync('launchType')
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selectedIndex = getTabBarSelectedIndex('/pages/alarm/index')
      this.getTabBar().setData({
        selectedIndex: selectedIndex,
        list: wx.getStorageSync('tabBarList')
      })
    }
    this.setData({_pageIndex:1,_total:0
      ,isDemo: launchType == 'demo'
    });
    this.GetAlarmDataList();
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    request.post({
      url: 'GetAlarmInfoList',
      data:{
        "beginTime": moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00'),
        "endTime": moment().format("YYYY-MM-DD 23:59:59"),
        "alarmType": "",
        "pageSize": 20,
        "pageIndex": 1
      },
    }).then(result => {
      // console.log('result=', result);
      if (result.data && result.data.IsSuccess) {
        this.setData({
          alarmDataList: result.data.Datas,
          _total: result.data.Total
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.alarmDataList.length != this.data._total) {
      this.data._pageIndex = 1 + this.data._pageIndex;

      request.post({
        url: 'GetAlarmInfoList',
        data:{
          "beginTime": moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00'),
          "endTime": moment().format("YYYY-MM-DD 23:59:59"),
          "alarmType": "",
          "pageSize": 20,
          "pageIndex": this.data._pageIndex
        },
      }).then(result => {
        // console.log('result=', result);
        if (result.data && result.data.IsSuccess) {
          this.setData({
            alarmDataList: this.data.alarmDataList.concat(result.data.Datas),
            _total: result.data.Total
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 下拉刷新
  onPullDownRefresh() {
    this.data._pageIndex = 1;
    this.GetAlarmDataList();
  },
  // 同意订阅
  confirmSubscribeMessage() {
    app.globalData.noSubscribe = false;
    wx.requestSubscribeMessage({
      tmplIds: ['hy8oFHZ3uiV-QuCIczWMZw5gKrecC_unYLXVQwsiqgg'],
      success (res) { 
       
        // console.log('requestSubscribeMessage success');
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // console.log('res=', res);
          }
        })
      },
      fail (errMsg,errCode) { 
        console.log('errMsg = ',errMsg,'errCode = ',errCode);
       }
    })
  },
  // 拒绝订阅
  cancelSubscribeMessage(){
    app.globalData.noSubscribe = false;
  },
  // 报警列表点击时间
  selectAlarm (e) {
    // console.log(e);
    wx.navigateTo({
      url: '/pages/alarmDetail/alarmDetail?index='+e.currentTarget.dataset.index+'&id='+e.currentTarget.dataset.id+"&DGIMN="+e.currentTarget.dataset.item.DGIMN+"&pollutantCode="+e.currentTarget.dataset.item.pollutantCode+"&dataType="+e.currentTarget.dataset.item.dataType+"&alarmTime="+e.currentTarget.dataset.item.alarmTime+"&pollutantName="+e.currentTarget.dataset.item.pollutantName+"alarmValue="+e.currentTarget.dataset.item.alarmValue,
    })
  }
})