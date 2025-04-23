// pages/alarmRecords/alarmRecords.js
import request from '../../utils/request'
import moment from 'moment'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmType:-1,
    DGIMN:'',
    alarmRecordsPointInfo:{}, // 报警头部信息
    pageHeight:1000,
    pageWidth:1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '报警详情',
    })
    const systemInfo = wx.getSystemInfoSync();
    const screenHeight = systemInfo.screenHeight;
    const safeArea = systemInfo.safeArea;
    console.log('safeArea = ',safeArea);
    // 计算内容区域高度
    let contentHeight = screenHeight - safeArea.top;
    // 考虑可能存在的底部安全区域（如果有底部操作栏等情况）
    if ('bottom' in safeArea) {
      contentHeight -= (systemInfo.screenHeight - safeArea.bottom);
    }
    this.setData({
      alarmType:options.alarmType,
      DGIMN:options.DGIMN,
      pageHeight:contentHeight,
      pageWidth:safeArea.width,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.refresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  refresh(){
    console.log('refresh');
    const _activeKey = this.data.alarmType;
    let newParams = {};
    if (_activeKey == 0) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":10000
        ,"BeginTime": moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"HourData,DayData"
        ,"AllData":"1"
        ,"DGIMN":this.data.DGIMN
        ,"IsPaging":false
      }
    } else if (_activeKey == 1) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":10000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"MinuteData"
        ,"AllData":"1"
        ,"DGIMN":this.data.DGIMN
        ,"IsPaging":false
      };
    } else if (_activeKey == 2) {
      newParams = {
        "AlarmType":"0,1,3,4"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":10000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        // ,"AllData":"1"
        ,"DGIMN":this.data.DGIMN
        ,"IsPaging":false
      }
    }
    this.setData({
      params:newParams,
      // "activeKey":activeKey
    },()=>{
      if (_activeKey == 0||_activeKey == 1) {
        this.getAlarmList();
      } else if (_activeKey == 2) {
        this.getExceptionAlarm();
      }
      
    });
  },
  getAlarmList() {
    request.post({
      url: 'GetOverDataList',
      data: this.data.params
    }).then(result => {  
      console.log('result = ', result);
      let newArr = [],temp,tempItem,tempList;
      const alarmRecordsPointInfo = {...result.data.Datas[0]};
      alarmRecordsPointInfo.src = this.getStatusIcon(alarmRecordsPointInfo.PollutantType,alarmRecordsPointInfo.Status);
      result.data.Datas.map((item,index)=>{
        temp = {...item};
        temp.AlarmMsg.map((msgItem,msgIndex)=>{
          tempItem = {...msgItem};
          tempList = [];
          tempItem.AlarmTag.split(',').map((typeT, index) =>{
            if (typeT!='') {
              tempList.push(typeT);
            }
          });
          tempItem.alarmTagList = tempList;
          newArr.push(tempItem);
        });

        // temp.src = this.getStatusIcon(temp.PollutantType,4)
        
      });
      this.setData({
        alarmRecordsPointInfo, // 报警头部信息
        listData:newArr,
        // isTriggered: false // 关闭下拉刷新状态
      });
    })
  },
  getExceptionAlarm() {
    // 获取异常报警
    request.post({
      url: 'GetMonitorAlarmDatas',
      data: this.data.params
    }).then(result => {  
      console.log('result = ', result);
      let newArr = [],temp,tempList
      ,tempItem;
      const alarmRecordsPointInfo = {...result.data.Datas[0]};
      alarmRecordsPointInfo.Abbreviation = alarmRecordsPointInfo.TargetName;
      // alarmRecordsPointInfo.Abbreviation = alarmRecordsPointInfo.TargetName;
      alarmRecordsPointInfo.src = this.getStatusIcon(alarmRecordsPointInfo.PollutantType,alarmRecordsPointInfo.Status);
      console.log('alarmRecordsPointInfo = ',alarmRecordsPointInfo);
      result.data.Datas.map((item,index)=>{
        temp = {...item};
        temp.AlarmMsg.map((msgItem,msgIndex)=>{
          tempItem = {...msgItem};
          tempList = [];
          tempItem.AlarmTag.split(',').map((typeT, index) =>{
            if (typeT!='') {
              tempList.push(typeT);
            }
          });
          tempItem.alarmTagList = tempList;
          newArr.push(tempItem);
        });
        // temp.src = this.getStatusIcon(temp.PollutantType,4)
        // tempList = [];
        // temp.AlarmTag.split(',').map((typeT, index) =>{
        //   if (typeT!='') {
        //     tempList.push(typeT);
        //   }
        // });
        // temp.alarmTagList = tempList;
        // newArr.push(temp);
      });
      this.setData({
        alarmRecordsPointInfo, // 报警头部信息
        listData:newArr,
        // isTriggered: false // 关闭下拉刷新状态
      });
    })
  },
  gotoDataDetail(event){
    const item = event.currentTarget.dataset.item;
    console.log('item = ',item);
    wx.setStorageSync('dgimn', item.DGIMN);
    wx.navigateTo({
      url: '/pages/historyDataPortrait/historyDataPortrait?DGIMN='+item.DGIMN+'&alarmType='+this.data.alarmType+'&time='+item.AlarmTime,
    })
  },
  getStatusIcon: function(type,Status) {
    /**
     * 0 离线
     * 1 在线
     * 2 超标
     * 3 异常
     */
    if (type == 1 || type == '1') {
      //废水
      if(Status == 0) { // 离线
        return '/images/ic_water_stop.png';
      } else if (Status == 1) {// 在线
        return '/images/ic_water_on_line.png';
      } else if (Status == 2) {// 超标
        return '/images/ic_water_over.png';
      } else if (Status == 3) {// 异常
        return '/images/ic_water_exception.png';
      }else if (Status == 4) {// 异常
        return '/images/ic_water.png';
      } else {// 其他
        return '/images/ic_water_stop.png';
      }
    } else if (type == 2 || type == '2') {
        //废气
        if(Status == 0) { // 离线
          return '/images/ic_gas_point_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_gas_point_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_gas_point_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_gas_point_exception.png';
        } else if (Status == 4) {// 异常
          return '/images/ic_gas_point.png';
        } else {// 其他
          return '/images/ic_gas_point_stop.png';
        }
    } else if (type == 12 || type == '12') {
        //扬尘
        if(Status == 0) { // 离线
          return '/images/ic_dust_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_dust_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_dust_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_dust_exception.png';
        } else if (Status == 4) {// 异常
          return '/images/ic_dust.png';
        } else {// 其他
          return '/images/ic_dust_stop.png';
        }
    } else if (type == 10 || type == '10') {
        //VOC
        if(Status == 0) { // 离线
          return '/images/ic_voc_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_voc_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_voc_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_voc_exception.png';
        } else if (Status == 4) {// 异常
          return '/images/ic_voc.png';
        } else {// 其他
          return '/images/ic_voc_stop.png';
        }
    } else if (type == 5 || type == '5') {
        //大气检测站
        if(Status == 0) { // 离线
          return '/images/ic_monitoring_station_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_monitoring_station_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_monitoring_station_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_monitoring_station_exception.png';
        } else if (Status == 4) {// 异常
          return '/images/ic_monitoring_station.png';
        } else {// 其他
          return '/images/ic_monitoring_station_stop.png';
        }
    } else if (type == 37 || type == '37') {
        //用电量
        if(Status == 0) { // 离线
          return '/images/ic_total_electricity_stop.png';
        } else if (Status == 1) {// 在线
          return '/images/ic_total_electricity_on_line.png';
        } else if (Status == 2) {// 超标
          return '/images/ic_total_electricity_over.png';
        } else if (Status == 3) {// 异常
          return '/images/ic_total_electricity_exception.png';
        } else if (Status == 4) {// 异常
          return '/images/ic_total_electricity.png';
        } else {// 其他
          return '/images/ic_total_electricity_stop.png';
        }
    } else {
      if(Status == 0) { // 离线
        return '/images/ic_monitoring_station_stop.png';
      } else if (Status == 1) {// 在线
        return '/images/ic_monitoring_station_on_line.png';
      } else if (Status == 2) {// 超标
        return '/images/ic_monitoring_station_over.png';
      } else if (Status == 3) {// 异常
        return '/images/ic_monitoring_station_exception.png';
      } else if (Status == 4) {// 异常
        return '/images/ic_monitoring_station.png';
      } else {// 其他
        return '/images/ic_monitoring_station_stop.png';
      }
    }
  },
})