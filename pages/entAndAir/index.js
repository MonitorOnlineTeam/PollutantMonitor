// pages/index/index.js
import request from '../../utils/request'
import {
  getTabBarSelectedIndex
} from '../../utils/util'
import moment from 'moment'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    current: 'ent',
    entAndPointList: [],
    airList: [],
    time: '-',
    isDemo:false,
    noSubscribe:true,
  },

  //页面滚动执行方式
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  // 获取企业排口信息
  getEntPointAndAirList(PollutantTypes, cb) {
    request.post({
      url: 'getEntAndAirList',
      data: {
        "RunState": "1",
        "PollutantTypes": PollutantTypes,
        "Status": [0, 1, 2, 3]
      }
    }).then(res => {
      cb && cb(res)
    })
  },

  // 获取空气站列表
  getAirList(cb) {
    this.setData({
      time: moment()
        .subtract(1, 'hours')
        .format('YYYY-MM-DD HH:00:00')
    })
    request.post({
      url: 'GetAirDataToXinJiang',
      data: {
        DataType: 'HourData',
        Time: moment()
          .subtract(1, 'hours')
          .format('YYYY-MM-DD HH:00:00')
      },
    }).then(res => {
      cb && cb(res.data.Datas)
    })
  },

  goToPointDetails(event) {
    const dgimn = event.currentTarget.dataset.dgimn;
    const pointName = event.currentTarget.dataset.pointName;
    const pollutantType = event.currentTarget.dataset.pollutantType;
    wx.setStorageSync('dgimn', dgimn);
    wx.setStorageSync('pointName', pointName);
    app.globalData.pointInfo = {
      dgimn,
      pointName
    }
    // let DGIMN = this.
    wx.navigateTo({
      url: `/pages/pointDetails/index?dgimn=${dgimn}&pointName=${pointName}&pollutantType=${pollutantType}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const launchType = wx.getStorageSync('launchType')
    this.getEntPointAndAirList('1,2', (res) => {
      let data = [].concat(res.data.Datas);
      if (launchType == 'demo'||launchType == 'singlePoint_demo') {
        data.map((item,index)=>{
          if (item.title == '石河子市天瑞能源有限公司') {
            item.title = '某某能源有限公司'
            item.EntName = '某某能源有限公司'
            item.children.map((child,childIndex)=>{
              child.EntName = '某某能源有限公司'
            });
          } else {
            item.title = 'xx企业'
            item.children.map((child,childIndex)=>{
              child.EntName = 'xx企业'
            });
          }
        })
      }
      app.globalData.entAndPointList = data;
      let params = {
        entAndPointList: data,
        isDemo:launchType == 'demo'||launchType == 'singlePoint_demo'
      }
      if (getApp().globalData.noSubscribe) {
        app.globalData.noSubscribe = false
      }
      this.setData(params)
    });
    // 空气站数据
    // this.getAirList((res) => {
    //   let airList = res.map(item => {
    //     item.paramsList = {};
    //     item.DataList.map(itm => {
    //       item.paramsList[itm.PollutantCode] = itm.AvgStrength
    //     })
    //     return item;
    //   })
    //   this.setData({
    //     airList
    //   })
    // });
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
    this.getEntPointAndAirList('1,2', (res) => {
      let data = res.data.Datas;
      if (launchType == 'demo'||launchType == 'singlePoint_demo') {
        data.map((item,index)=>{
          if (item.title == '石河子市天瑞能源有限公司') {
            item.title = '某某能源有限公司'
            item.EntName = '某某能源有限公司'
            item.children.map((child,childIndex)=>{
              child.EntName = '某某能源有限公司'
            });
          } else {
            item.title = 'xx企业'
            item.children.map((child,childIndex)=>{
              child.EntName = 'xx企业'
            });
          }
        })
      }
      app.globalData.entAndPointList = data;
      let params = {
        entAndPointList: data,
        isDemo:launchType == 'demo'||launchType == 'singlePoint_demo'
      }
      if (getApp().globalData.noSubscribe) {
        // params.noSubscribe = true;
        app.globalData.noSubscribe = false
      }
      this.setData(params)
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selectedIndex = getTabBarSelectedIndex('/pages/entAndAir/index')
      this.getTabBar().setData({
        selectedIndex: selectedIndex,
        list: wx.getStorageSync('tabBarList')
      })
    }
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
  // 同意订阅
  confirmSubscribeMessage() {
    app.globalData.noSubscribe = false;
    wx.requestSubscribeMessage({
      tmplIds: ['PgGEIIZiCHKLfd-3GEarX4BsZHPDlIKHQxZDFBJAyBg'],
      success (res) { 
       
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
  }
})