// pages/alarm/index.js
import request from '../../utils/request'
import {
  getTabBarSelectedIndex
} from '../../utils/util'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmDataList: [],
    _pageIndex: 1,
    _total: 0,
  },

  // 获取报警列表数据
  GetAlarmDataList() {
    // request.post({
    //   url: 'GetAlarmDataList',
    //   data: {
    //     "BeginTime": moment().format('YYYY-MM-DD 00:00:00'),
    //     "EndTime": moment().format("YYYY-MM-DD 23:59:59"),
    //     "PageIndex": this.data._pageIndex,
    //     "PageSize": 20
    //   }
    // }).then(result => {
    //   console.log('result=', result);
    //   if (result.data && result.data.IsSuccess) {
    //     this.setData({
    //       alarmDataList: result.data.Datas,
    //       _total: result.data.Total
    //     })
    //   }
    // })

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
        "alarmType": "",
        "pageSize": 20,
        "pageIndex": this.data._pageIndex
      },
    }).then(result => {
      console.log('result=', result);
      if (result.data && result.data.IsSuccess) {
        this.setData({
          alarmDataList: result.data.Datas,
          _total: result.data.Total
        })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selectedIndex = getTabBarSelectedIndex('/pages/alarm/index')
      this.getTabBar().setData({
        selectedIndex: selectedIndex,
        list: wx.getStorageSync('tabBarList')
      })
    }
    this.setData({_pageIndex:1,_total:0});
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
      console.log('result=', result);
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
    // if (this.data.alarmDataList.length != this.data._total) {
    //   this.data._pageIndex = 1 + this.data._pageIndex;
    //   request.post({
    //     url: 'GetAlarmDataList',
    //     data: {
    //       "BeginTime": moment().format('YYYY-MM-DD 00:00:00'),
    //       "EndTime": moment().format("YYYY-MM-DD 23:59:59"),
    //       "PageIndex": this.data._pageIndex,
    //       "PageSize": 20
    //     }
    //   }).then(result => {
    //     console.log('result=', result);
    //     if (result.data && result.data.IsSuccess) {
    //       this.setData({
    //         alarmDataList: this.data.alarmDataList.concat(result.data.Datas),
    //         _total: result.data.Total
    //       })
    //     }
    //   })
    // }

    if (this.data.alarmDataList.length != this.data._total) {
      this.data._pageIndex = 1 + this.data._pageIndex;
      // request.post({
      //   url: 'GetAlarmDataList',
      //   data: {
      //     "BeginTime": moment().format('YYYY-MM-DD 00:00:00'),
      //     "EndTime": moment().format("YYYY-MM-DD 23:59:59"),
      //     "PageIndex": this.data._pageIndex,
      //     "PageSize": 20
      //   }
      // }).then(result => {
      //   console.log('result=', result);
      //   if (result.data && result.data.IsSuccess) {
      //     this.setData({
      //       alarmDataList: this.data.alarmDataList.concat(result.data.Datas),
      //       _total: result.data.Total
      //     })
      //   }
      // })

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
        console.log('result=', result);
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
  }
})