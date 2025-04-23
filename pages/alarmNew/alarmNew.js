// pages/alarmNew/alarmNew.js
import request from '../../utils/request'
import moment from 'moment'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _tabs:['超标报警','超标预警','异常报警'],
    params:{
      "AlarmType":"2"
      ,"PageIndex":1
      // ,"PageSize":20
      ,"PageSize":1000
      // ,"BeginTime":"2025-01-12 00:00:00"
      ,"BeginTime": moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
      // ,"EndTime":"2025-01-13 10:58:02"
      ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
      ,"DataType":"HourData,DayData"
      // ,"noCancelFlag":true
    },
    listData:[1,1,1,1,1,1,1,1,1,1,1,1],
    screenHeight:1000,
    tabBarHeight:50,
    contentHeight:1000,
    listData:[],
    activeKey:0,
    isTriggered:true,
    secondTag:[0,0,0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '报警',
    })
    const systemInfo = wx.getSystemInfoSync();
    const screenHeight = systemInfo.screenHeight;
    const safeArea = systemInfo.safeArea;
    // 计算内容区域高度
    let contentHeight = screenHeight - safeArea.top;
    // 考虑可能存在的底部安全区域（如果有底部操作栏等情况）
    if ('bottom' in safeArea) {
      contentHeight -= (systemInfo.screenHeight - safeArea.bottom);
    }

    this.setData({
      screenHeight:app.globalData.screenHeight,
      tabBarHeight : safeArea.bottom - safeArea.height + 50,
      "contentHeight":contentHeight,
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
    console.log('alarmNew onShow');

    // this.getAlarmList();
    this.refresh();

    this.getCount();
  },

  getCount(){
    const tabBarList = wx.getStorageSync('tabBarList');
    let newData = [].concat(tabBarList);
    tabBarList.map((item,index)=>{
      if (item.pagePath ==  "/pages/alarmNew/alarmNew") {
        request.post({
          url: 'GetAlarmCountForEnt',
          data: {
            beginTime:moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00'),
            endTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          }
        }).then(result => { 

          newData[index] = {...newData[index]};
          newData[index].redDot = result.data.Datas.allCount;
          
          this.getTabBar().setData({
            selectedIndex: index,
            list: newData
          })

          this.setData({
            secondTag:[
              result.data.Datas.dataOverHourCount,
              result.data.Datas.dataOverMinuteCount,
              result.data.Datas.dataExceptionCount,
            ]
          });

        });
      }
    });
    
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
  // 切换tab页
  changeTabs(key) {
    const activeKey = key.detail.activeKey;
    /**
     * 0 超标报警
     * 1 超标预警
     * 2 异常报警
     */
    let newParams = {};
    if (activeKey == 0) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime": moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"HourData,DayData"
      }
    } else if (activeKey == 1) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"MinuteData"
      };
    } else if (activeKey == 2) {
      newParams = {
        "AlarmType":"0,1,3,4"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        // ,"AllData":"1", //AllData 非空代表  查询未响应的数据 空查询所有数据
      }
    }
    this.setData({
      params:newParams,
      "activeKey":activeKey
    },()=>{
      if (activeKey == 0||activeKey == 1) {
        this.getAlarmList();
      } else if (activeKey == 2) {
        this.getExceptionAlarm();
      }
      this.setData({
        isTriggered:false
      })
    });
    this.getCount();
  },
  getNextPage() {

  },
  refresh(){
    console.log('refresh');
    const _activeKey = this.data.activeKey;
    let newParams = {};
    if (_activeKey == 0) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime": moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"HourData,DayData"
      }
    } else if (_activeKey == 1) {
      newParams = {
        "AlarmType":"2"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        ,"DataType":"MinuteData"
      };
    } else if (_activeKey == 2) {
      newParams = {
        "AlarmType":"0,1,3,4"
        ,"PageIndex":1
        // ,"PageSize":20
        ,"PageSize":1000
        ,"BeginTime":moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        ,"EndTime":moment().format('YYYY-MM-DD HH:mm:ss')
        // ,"AllData":"1" , // AllData 非空代表  查询未响应的数据 空查询所有数据
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
      let newArr = [],temp,tempList;
      result.data.Datas.map((item,index)=>{
        temp = {...item};
        temp.src = this.getStatusIcon(temp.PollutantType,4)
        tempList = [];
        temp.AlarmTag.split(',').map((typeT, index) =>{
          if (typeT!='') {
            tempList.push(typeT);
          }
        });
        temp.alarmTagList = tempList;
        newArr.push(temp);
      });
      this.setData({
        listData:newArr,
        isTriggered: false // 关闭下拉刷新状态
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
      let newArr = [],temp,tempList;
      result.data.Datas.map((item,index)=>{
        temp = {...item};
        temp.src = this.getStatusIcon(temp.PollutantType,4)
        tempList = [];
        temp.AlarmTag.split(',').map((typeT, index) =>{
          if (typeT!='') {
            tempList.push(typeT);
          }
        });
        temp.alarmTagList = tempList;
        newArr.push(temp);
      });
      this.setData({
        listData:newArr,
        isTriggered: false // 关闭下拉刷新状态
      });
    })
  },
  gotoAlarmDetailList(event){
    const item = event.currentTarget.dataset.item;
    console.log('item = ',item);
    wx.navigateTo({
      url: '/pages/alarmRecords/alarmRecords?DGIMN='+item.DGIMN+'&alarmType='+this.data.activeKey,
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
  }
})