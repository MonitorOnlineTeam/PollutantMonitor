// pages/my/home/home.js
const moment = require('../../../utils/moment.min.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    alarmData:[],
    beginTime:null,
    entTime:null,
    pollutantCodes:null,
    dataType:null,
    selectedDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    const nowMinute = moment().format('mm');
    let selectedDate;
    if(nowMinute<35)
    {
      selectedDate = moment().add(-2, 'hour').format('YYYY-MM-DD HH:00:00');
    }
    else
    {
      selectedDate = moment().add(-1, 'hour').format('YYYY-MM-DD HH:00:00');
    }
    var monitorTime = options.monitorTime;
    if (monitorTime)
    {
      selectedDate = monitorTime;
    }
    this.setData({
      selectedDate: selectedDate
    })
    var entInfo = common.getStorage('selectedEnt');
    if (!entInfo)
    {
      wx.showModal({
        title: '提示',
        content: '请先选择企业',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../selectEntList/selectEntList'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    this.getAlarmDataList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChangeEnt: function () {
    wx.navigateTo({
      url: '../selectEntList/selectEntList'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let selectedDate;
    if (common.getStorage('alarmselectedDate'))
    {
      selectedDate = moment(common.getStorage('alarmselectedDate')).format('YYYY-MM-DD HH:00:00');
    }
    if (selectedDate!=null && this.data.selectedDate != selectedDate)
    {
      this.setData({
        selectedDate: selectedDate
      })
    }
    this.onPullDownRefresh();
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
 
  onChangeDate:function(){
    wx.navigateTo({
      url: '../../historyData/selectDateTime/selectDateTime?dataType=1'
    })
  },
  onPullDownRefresh:function(){
   this.getAlarmDataList();
  },
  getAlarmDataList:function(){
    comApi.getAlarmDataList(this.data.selectedDate, this.data.selectedDate,
    this.data.pollutantCodes, this.data.dataType).then(res=>{
      let alarmData=[];
      if (res && res.IsSuccess)
      {
        var thisData=res.Data;
        thisData.map(item => {
          alarmData.push({
            entpoint: item.abbreviation + "-" + item.pointName,
            pollutantName: item.pollutantName,
            standardValue: item.standardValue,
            monitorValue:item.value
          })
        })
      this.setData({
        alarmData: alarmData
      })
      }
      else
      {
        this.setData({
          alarmData: null
        })
      }
    })
  
  }
  

})