// pages/pointDetails/index.js
import request from '../../utils/request'
import util from '../../utils/util'
import moment from 'moment'
const app = getApp();
const selectTimeFormat = {
  0: {
    showFormat: 'YYYY-MM-DD HH:00',
    chartFormat: 'HH:mm'
  },
  1: {
    showFormat: 'YYYY-MM-DD',
    // chartFormat: 'HH:mm'
    chartFormat: 'MM-DD'
  },
  2: {
    showFormat: 'YYYY-MM-DD HH:mm',
    chartFormat: 'HH:mm'
  },
  3: {
    showFormat: 'YYYY-MM-DD HH:mm',
    chartFormat: 'HH:mm'
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedPollutants:[],
    dataitem: [],
    pointInfo: {},
    chartShow: false,
    initChart: null,
    dataType: 0,
    tipsData: [],
    selectedDate: moment().format("YYYY-MM-DD HH:mm"),
    // _tabs: ["分钟", "小时", "日", "月"],
    _tabs: ["小时", "日均", "实时", "分钟"],
    recordTypeList:[],
    selectRecordType:null,
    operationLogs:[],
    screenHeight:1000,
    operationPageListIndex:1,
    isDemo:false,
    filelist:[],// 图片表单记录
    equipmentParametersList:[], // 设备参数列表
    hasRealtimedata:false,
    hasHistorydata:false,
    hasOoperationorder:false,
    hasEquipmentinfo:false,
    showMode:'chart',
    screenWidth:1000,
    windowHeight:10000,
    oneRpx:0,
    listLabels:[],
  },
  onPageTypeChangeTabs(key) {
    const activeKey = key.detail.activeKey;
    if (activeKey == 'realTime') {
      // 实时数据
      this.GetRealTimeDataForPoint();
    } else if (activeKey == 'historyData') {
      // 历史数据
      this.setData({
        dataType: 0,
        chartShow: false,
        selectedDate: moment(wx.getStorageSync('selectedDate')).format(selectTimeFormat[0].showFormat),
      })
      this.GetMonitorDatas();
    } else if (activeKey == 'operationLog') {
      // 运维台账
      this.setData({
        dataType: 3,
        chartShow: false,
        selectedDate: moment(wx.getStorageSync('selectedDate')).format(selectTimeFormat[3].showFormat),
      })
      this.getMobileOperationPageList();
    } else if (activeKey == 'equipmentInfo') {
      // 设备信息
      this.getPointEquipmentInfo();
    }
    this.setData({
      chartShow: false
    })
  },

  changeTabs(key) {
    const activeKey = key.detail.activeKey;
    this.data.dataType = activeKey;
    this.setData({
      dataType: activeKey,
      chartShow: false,
      selectedDate: moment(wx.getStorageSync('selectedDate')).format(selectTimeFormat[activeKey].showFormat),
    })
    // common.setStorage('dataType', e.currentTarget.dataset.id);
    this.GetMonitorDatas();
  },

  // 跳转选择时间
  onChangeDate() {
    let pickerType  = 0;
    if (this.data.dataType == 0) {
      pickerType =1;
    }
    if (this.data.dataType == 2
      || this.data.dataType==3) {
        pickerType = 0;
    }
    if (this.data.dataType == 1) {
      pickerType = 2;
    }
    wx.navigateTo({
      url: '/pages/date-picker/index?dataType=' + pickerType
    })
    // wx.navigateTo({
    //   url: '/pages/date-picker/index?dataType=' + this.data.dataType
    // })
  },

  // 跳转选择污染物
  onChangePollutant(e) {
    wx.navigateTo({
      url: '/pages/selectPollutant/selectPollutant'
    })
  },

  onSelectPoll() {
    wx.navigateTo({
      url: '/pages/selectPollutant/selectPollutant',
    })
  },
  // 系统信息
  getPointEquipmentInfo() {
    let pollutanttype = wx.getStorageSync('pollutanttype');
    if (pollutanttype == 2) {
      // 烟气污染源才有系统信息
      request.post({
        url: 'GetPointEquipmentInfo',
        data: {
          "DGIMN": wx.getStorageSync('dgimn'),
          "PollutantType": wx.getStorageSync('pollutanttype'),
          // "PollutantCode": "sample string 3"
        }
        // data:{"DGIMN":"020003xdcbd11c","PollutantType":2}
      }).then(result => {      
        this.setData({
          // ...result.data.Datas,
          pointEquipmentInfoData:result.data.Datas
        });
      });
    }
    //  设备参数
    request.post({
      url: 'GetPointEquipmentParameters',
      data: {
        "DGIMN": wx.getStorageSync('dgimn'),
        "PollutantType": wx.getStorageSync('pollutanttype'),
        // "PollutantCode": "sample string 3"
      }
      // data:{"DGIMN":"020003xdcbd11c","PollutantType":2}
    }).then(result => {     
      this.setData({
        equipmentParametersList:result.data.Datas
      });
    });
  },
  // 获取污染物信息
  GetPollutantList() {
    console.log('GetPollutantList start');
    request.post({
      url: 'GetPollutantList',
      data: {
        "dgimNs": wx.getStorageSync('dgimn'),
      }
    }).then(result => {  
      let selectedPollutants = []
      ,listLabels = [{
        PollutantCode:'MonitorTime',
        PollutantName:'时间'
      }];
      let pollutantList = result.data.Datas.map(function (item, index) {
        listLabels.push(item);
        if (index < 5||true) {
          // 不限制污染因子个数
          selectedPollutants.push({
            code: item.PollutantCode,
            name: item.PollutantName,
            unit: item.Unit,
            checked: false,
            color: '',
            value: '-',
            checked: true
          })
        }
        return {
          code: item.pollutantCode,
          name: item.pollutantName,
          unit: item.unit,
          checked: false,
          color: '',
          value: '-'
        }
      })
      wx.setStorageSync('pollutantList', pollutantList)
      wx.setStorageSync('selectedPollutants', selectedPollutants)
      this.setData({
        "selectedPollutants":selectedPollutants
        ,"listLabels":listLabels
      });
      this.getData();
    })
  },

  // 获取历史数据
  GetMonitorDatas() {
    let pollutantCodes = this.data.selectedPollutants.map(item => item.code).toString();
    const datatype = this.data.dataType;
    let _dataType = 'realtime';

    let endTime = wx.getStorageSync('selectedDate')
    let beginTime = '';
    if (datatype == 0) {// 小时
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
      beginTime = moment(endTime).add(-24, 'hour').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'hour';
    } else if (datatype == 1) { // 日均
      beginTime = moment(endTime).add(-30, 'day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'day';
    } else if (datatype == 2) { // 实时
      endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
      beginTime = moment(endTime).add(-1, 'hour').format('YYYY-MM-DD HH:00:00');
      _dataType = 'realtime';
    } else if (datatype == 3) { // 分钟
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
      beginTime = moment(endTime).add(-3, 'hour').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'minute';
    }

    request.post({
      url: 'GetMonitorDatas',
      data: {
        "OpenId": wx.getStorageSync('OpenId'),
        "DGIMNs": wx.getStorageSync('dgimn'),
        "pollutantCodes": pollutantCodes,
        // "dataType": app.globalData.dataType,
        "dataType": _dataType,
        // "pageIndex": 1,
        // "pageSize": 100,
        "isAsc": true,
        "beginTime": beginTime,
        "endTime": endTime
      },
    }).then(res => {
      if (res.data && res.data.IsSuccess && res.data.Datas) {
        let selectedPollutants = wx.getStorageSync('selectedPollutants')
        let thisData = res.data.Datas;
        let chartDatas = [];
        thisData.map((itemD, index) => {
          itemD['listMonitorTime'] = moment(itemD.MonitorTime).format("MM/DD HH:mm") ;

          if (this.data._pollutantType == 5 && (_dataType === 'hour' || _dataType === 'day')) {
            chartDatas.push({
              PollutantName: `AQI`,
              Value: itemD.AQI || 0,
              MonitorTime: itemD.MonitorTime,
              listMonitorTime:moment(itemD.MonitorTime).format("MM/DD HH:mm") ,
              Status: '',
              PollutantCode: 'AQI',
              Unit: ''
            });
          }
          let row = itemD;
          selectedPollutants.map(function (itemP) {
            let statusFlag = row[`${itemP.code}_params`];
            let status = 0,bgColor = '#f04d4d';
            if (statusFlag) {
              let flagArray = statusFlag.split('§');
              if (flagArray[0] == 0) {
                itemD[`${itemP.code}_status`] = 1;
                itemD[`${itemP.code}_bgColor`] = '#f04d4d';
                status = 1;
                bgColor = '#f04d4d';
              } else if (flagArray[0] == 1) {
                status = -1;
                bgColor = '#ee9944';
                itemD[`${itemP.code}_status`] = -1;
                itemD[`${itemP.code}_bgColor`] = '#ee9944';
              }
              // if (flagArray[0] === 'IsOver') {
              //   status = 1;
              // } else if (flagArray[0] === 'IsException') {
              //   status = -1;
              // }
            }
            let value = itemD[itemP.code];
            let showValue = value;
            // 如果数据不存在用---替换
            if (typeof itemD[itemP.code+"_flag"] == 'undefined') {
              itemD[itemP.code+"_flag"] = '---';
            } else {
              // showValue = itemD[itemP.code+"_flag"];
            }
            if (value) {
              // value = value == '-' ? null : (+parseFloat(itemD[itemP.code]).toFixed(2));
              value = value == '-' ? null : (+parseFloat(itemD[itemP.code]).toFixed(3));
            } else {
              value = null;
            }
            chartDatas.push({
              PollutantName: `${itemP.name}`,
              Value: value,
              "showValue": showValue,
              chartMonitorTime: moment(itemD.MonitorTime).format("HH:mm MM/DD") ,
              listMonitorTime:moment(itemD.MonitorTime).format("MM/DD HH:mm") ,
              MonitorTime: itemD.MonitorTime,
              Status: status,
              "bgColor":bgColor,
              PollutantCode: itemP.code,
              Unit: itemP.unit
            });

          });
        });

        this.setData({
          "listData":thisData.reverse(),
          "selectedPollutants":selectedPollutants,
          chartDatas: chartDatas,
          chartShow: true,
          initChart: (F2, config) => this.renderChar(F2, config, chartDatas)
        });

      }
    })
  },

  renderChar(F2, config, data) {
    const chart = new F2.Chart({
      ...config,
      // width: '100%'
      padding: 'auto'
    });
    const selectedPollutants = wx.getStorageSync('selectedPollutants')
    const dataType = this.data.dataType;
    chart.source(data, {
      'MonitorTime': {
        tickCount: 6,
        range: [0, 1]
      },
      'Value': {
        type: 'linear',
        tickCount: 7,
        formatter: function formatter(val) {
          return val;
        }
      }
    });
    chart.legend('PollutantName', {
      position: 'top',
      // offsetY: selectedPollutants.length >= 4 ? 33 : 15,
      align: 'center',
      nameStyle: {
        fontSize: '14', // 文本大小
      },
      marker: {
        symbol: 'circle', // marker 的形状
        radius: 4 // 半径大小
      },
      // labelOffset: 60,
    });
    chart.axis('MonitorTime', {
      // labelOffset: 40,
      label(text, index, total) {

        const cfg = {
          textAlign: 'center',
          text: moment(text).format(selectTimeFormat[dataType].chartFormat)
        };
        if (index === 0) {
          cfg.textAlign = 'left';
          if (dataType != 3)
            cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
        }
        if (index > 0 && index === total - 1) {
          cfg.textAlign = 'right';
          if (dataType != 3)
            cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
        }
        return cfg;
      }
    });
    let that = this;
    // chart.tooltip(false);
    chart.tooltip({
      alwaysShow:true,
      showTitle:false,
      layout: 'vertical',
      snap: true,
      custom:true,
      showCrosshairs: true,
      offsetX: 0, // x 方向的偏移
      offsetY: 100,
      onShow(obj) {
        let thisTip = [];
        if (obj.items.length > 0) {
          obj.items.map(function (item) {
            thisTip.push(item.origin);
          });
          that.setData({
            tipsData: thisTip
          });
        }
      }, // tooltip 显示时的回调函数
      onHide(obj) {

      }, // tooltip 隐藏时的回调函数
      onChange(obj){
      }
    });
    // chart.area().position('MonitorTime*Value').color('PollutantName').adjust('stack');
    chart.line().position('MonitorTime*Value').color('PollutantName', ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']);
    chart.render();
    // 默认展示 tooltip
    if (data.length > 0) {
      
      setTimeout(() => {
        let findData = ([].concat(data)).reverse();
        let hasShow = false;
        findData.map((item,index)=>{
          if (!hasShow) {
            if (item.Value) {
              var point = chart.getPosition(item); // 获取该数据的画布坐标
    
              chart.showTooltip(point); // 展示该点的 tooltip
              hasShow = true;
            }
          }
        });
      }, 1000);
    }
    // chart.showTooltip(data[data.length-1]);
    return chart;
    // return chart
  },

  // 获取实时数据
  GetRealTimeDataForPoint() {
    request.post({
      url: 'GetRealTimeDataForPoint',
      data: {
        "DGIMN": wx.getStorageSync('dgimn'),
        // "OpenId":wx.getStorageSync('OpenId'),
      }
    }).then(res => {
      wx.setNavigationBarTitle({
        title: res.data.Datas.pointInfo.pointName,
      })
      this.setData({
        dataitem: res.data.Datas.dataitem,
        pointInfo: res.data.Datas.pointInfo,
      })
    })
  },

  getData() {
    this.GetRealTimeDataForPoint();
    this.GetMonitorDatas();
    this.getMobileOperationPageList();
    this.getPointEquipmentInfo();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const windowInfo = wx.getWindowInfo();
    const index = options.dataType;
    const oneRpx = windowInfo.windowWidth/750;
    this.setData({
      screenWidth:windowInfo.windowWidth,
      windowHeight:windowInfo.windowHeight,
      oneRpx,
    });

    this.data._pollutantType = options.pollutantType;
    wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:mm"))
    this.GetPollutantList();
    let pollutanttype = wx.getStorageSync('pollutanttype');
    console.log('hasRealtimedata = ',app.globalData.hasRealtimedata);
    this.setData({
      screenHeight:app.globalData.screenHeight,
      pollutanttype,
      hasRealtimedata:app.globalData.hasRealtimedata,
      hasHistorydata:app.globalData.hasHistorydata,
      hasOoperationorder:app.globalData.hasOoperationorder,
      hasEquipmentinfo:app.globalData.hasEquipmentinfo,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const launchType = wx.getStorageSync('launchType')
    console.log('launchType = ',launchType);
    const storageSelectDate = wx.getStorageSync('selectedDate')
    let selectedDate = moment(storageSelectDate).format(selectTimeFormat[this.data.dataType].showFormat);
    this.setData({
      selectedDate: selectedDate,
      chartShow: false,
      isDemo: launchType == 'demo'||launchType == 'singlePoint_demo',
      tipsData: [],
      "showMode":app.globalData.historyDataType
    })
    // 没有和监测因子一起加载，可能导致失败，移动至获取监测因子之后
    if (this.data.selectedPollutants.length>0) {
      this.getData();
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
  /**
   * 获取 运维日志
   */
  getMobileOperationPageList: function () {
    let selectedDate = this.data.selectedDate;
    let dgimn = wx.getStorageSync('dgimn');
    this.setData({operationPageListIndex:1});
    console.log('selectRecordType = ',this.data.selectRecordType);
    let params = {"beginTime":moment(selectedDate).format('YYYY-MM-01 00:00:00')
    ,"endTime":moment(selectedDate).date(1).add(1,'month').subtract(1,'days').format('YYYY-MM-DD 23:59:59'),"DGIMN":dgimn,"pageSize":"10","pageIndex":1};
    if (this.data.selectRecordType&&this.data.selectRecordType.TypeId!='全部') {
      params.RecordType = this.data.selectRecordType.TypeId
    }
    // 用于销售演示
    if (this.data.isDemo) {
      let realData = []
      if (dgimn == '399435tsly10jz') {
        // 10
        realData = [
          {
            CreateUser:'张占鑫',
            Abbreviation:'备品备件更换记录表',
            CreateTime:'2022-06-16 14:06:27',
            image:'https://api.chsdl.net/text/10/备品备件更换记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'标准气体更换记录',
            CreateTime:'2022-06-16 14:05:50',
            image:'https://api.chsdl.net/text/10/标准气体更换记录-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'易耗品更换记录表',
            CreateTime:'2022-06-16 14:05:15',
            image:'https://api.chsdl.net/text/10/易耗品更换记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'设备维修记录表',
            CreateTime:'2022-06-16 14:00',
            image:'https://api.chsdl.net/text/10/设备维修记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'校准',
            CreateTime:'2022-06-13 19:53',
            image:'https://api.chsdl.net/text/10/校准-2022-06-13.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'巡检',
            CreateTime:'2022-06-13 15:00',
            image:'https://api.chsdl.net/text/10/巡检-2022-06-13（1）.jpg'
          },
          // {
          //   CreateUser:'张三',
          //   Abbreviation:'',
          //   CreateTime:'2022-06-16 14:06:27',
          //   image:'https://api.chsdl.net/text/04/巡检-2022-06-13（2）.jpg'
          // },
        ]
      } else {
        // 4 399435xe54lp8m
        realData = [
          {
            CreateUser:'张占鑫',
            Abbreviation:'备品备件更换记录表',
            CreateTime:'2022-06-16 14:08:00',
            image:'https://api.chsdl.net/text/04/备品备件更换记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'标准气体更换记录',
            CreateTime:'2022-06-16 14:05:50',
            image:'https://api.chsdl.net/text/04/标准气体更换记录-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'易耗品更换记录表',
            CreateTime:'2022-06-16 14:05:15',
            image:'https://api.chsdl.net/text/04/易耗品更换记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'设备维修记录表',
            CreateTime:'2022-06-16 14:00',
            image:'https://api.chsdl.net/text/04/设备维修记录表-2022-06-16.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'巡检',
            CreateTime:'2022-06-13 15:00',
            image:'https://api.chsdl.net/text/04/巡检 - 2022-06-13（1）.jpg'
          },
          {
            CreateUser:'张占鑫',
            Abbreviation:'校准',
            CreateTime:'2022-06-13 12:17',
            image:'https://api.chsdl.net/text/04/校准.jpg'
          },
          // {
          //   CreateUser:'张三',
          //   Abbreviation:'',
          //   CreateTime:'2022-06-16 14:06:27',
          //   image:'https://api.chsdl.net/text/04/巡检-2022-06-13（2）.jpg'
          // },
        ]
      }
      let recordTypeList = [];
      recordTypeList.unshift({Abbreviation:'全部',TypeId:'全部'})
      this.setData({
        recordTypeList:recordTypeList,
        selectRecordType:{
          index:0,
          ...recordTypeList[0],
        },
        operationLogs:realData
      });
    } else {
      request.post({
        url: 'GetMobileOperationPageList',
        data: params
      }).then(result => {
        console.log('result = ',result);
        // 整理数据
        let realData = [],
        templist;
        result.data.Datas.FormList.map((item,index)=>{
          templist = item.Nodes;
          util.createFormUrl(templist,'https://xuedilong.chsdl.com','temp')
          // realData = realData.concat(item.Nodes);
          realData = realData.concat(templist);
        })
        let recordTypeList = result.data.Datas.RecordType;
        recordTypeList.unshift({Abbreviation:'全部',TypeId:'全部'})
        this.setData({
          filelist:result.data.Datas.Filelist, // 图片列表
          recordTypeList:result.data.Datas.RecordType,
          selectRecordType:this.data.selectRecordType?this.data.selectRecordType:{
            index:0,
            ...result.data.Datas.RecordType[0],
          },
          operationLogs:realData
        });
      })
    }
  },
  bindPickerChange: function(e) {
    let selectedDate = this.data.selectedDate;
    let dgimn = wx.getStorageSync('dgimn');
    let index = e.detail.value;
    let selected = {...this.data.recordTypeList[index]};
    selected.index = index;
    this.setData({selectRecordType:selected})
    let params = {"beginTime":moment(selectedDate).format('YYYY-MM-01 00:00:00')
    ,"endTime":moment(selectedDate).date(1).add(1,'month').subtract(1,'days').format('YYYY-MM-DD 23:59:59'),"DGIMN":dgimn,"pageSize":"10","pageIndex":1};
    if (selected.TypeId != '全部') {
      params.RecordType = selected.TypeId
    }
    request.post({
      url: 'GetMobileOperationPageList',
      data: params
    }).then(result => {
      
      // 整理数据
      let realData = []
      result.data.Datas.FormList.map((item,index)=>{
        realData = realData.concat(item.Nodes);
      })
      this.setData({
        // recordTypeList:result.data.Datas.RecordType,
        operationLogs:realData
      });
    })
  },
  bindscrolltolower: function(e) {
    console.log('bindscrolltolower，携带值为', e)

  },
  gotoRecord: function(e) {
    if (this.data.isDemo) {
      wx.navigateTo({
        url: '/pages/myWebview/index?imageurl='+e.currentTarget.dataset.image,
      })
    } else {
      if (e.currentTarget.dataset.item.Type == '0') {
        let filelistIndex = this.data.filelist.findIndex((fileItem)=>{
          if (e.currentTarget.dataset.item.MainFormID == fileItem.FormMainID ) return true;
        });
        let imagesRecord = this.data.filelist[filelistIndex].FileList;
        if (imagesRecord.length == 0) {

        } else {
          wx.previewImage({
            current: imagesRecord[0], // 当前显示图片的 http 链接
            urls: imagesRecord // 需要预览的图片 http 链接列表
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/myWebview/index?imageurl='+e.currentTarget.dataset.url,
        })
      }
    }
  },
  gotoLand: function(e) {
    // wx.navigateTo({
    //   url: '/pages/historyData/historyData?params='+'123',
    // })
    wx.navigateTo({
      url: '/pages/historyData/historyData?dataType='+this.data.dataType,
    })
  },
  clickItem(e){
    // let _item = e.detail.item;
    let _item = e.currentTarget.dataset.item;
    console.log('_item = ',_item);
  },

  changeShowMode() {
    if (this.data.showMode == 'chart') {
      this.setData({
        "showMode":'list'
      });
      app.globalData.historyDataType = 'list';
    } else {
      this.setData({
        "showMode":'chart'
      });
      app.globalData.historyDataType = 'chart';
    }
    
  },

  testOneRow(e){
    console.log("e = ",e);
  }
})