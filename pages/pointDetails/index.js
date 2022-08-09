// pages/pointDetails/index.js
import request from '../../utils/request'
import moment from 'moment'
const app = getApp();
const selectTimeFormat = {
  0: {
    showFormat: 'YYYY-MM-DD HH:mm',
    chartFormat: 'HH:mm'
  },
  1: {
    showFormat: 'YYYY-MM-DD HH:00',
    chartFormat: 'HH:mm'
  },
  2: {
    showFormat: 'YYYY-MM-DD',
    chartFormat: 'HH:mm'
  },
  3: {
    showFormat: 'YYYY-MM',
    chartFormat: 'MM-DD'
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataitem: [],
    pointInfo: {},
    chartShow: false,
    initChart: null,
    dataType: 1,
    tipsData: [],
    selectedDate: moment().format("YYYY-MM-DD HH:ss"),
    _tabs: ["分钟", "小时", "日", "月"],
    recordTypeList:[],
    selectRecordType:null,
    operationLogs:[],
    screenHeight:1000,
    operationPageListIndex:1,
    isDemo:false,
    equipmentParametersList:[] // 设备参数列表
  },
  onPageTypeChangeTabs(key) {
    const activeKey = key.detail.activeKey;
    if (activeKey == 'realTime') {
      // 实时数据
      this.GetRealTimeDataForPoint();
    } else if (activeKey == 'historyData') {
      // 历史数据
      this.setData({
        dataType: 1,
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
    console.log('activeKey = ',activeKey);
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
    wx.navigateTo({
      url: '/pages/date-picker/index?dataType=' + this.data.dataType
    })
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
    request.post({
      url: 'GetPollutantList',
      data: {
        "DGIMN": wx.getStorageSync('dgimn'),
      }
    }).then(result => {  
      let selectedPollutants = [];
      let pollutantList = result.data.Datas.map(function (item, index) {
        if (index < 5) {
          selectedPollutants.push({
            code: item.pollutantCode,
            name: item.pollutantName,
            unit: item.unit,
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
    })
  },

  // 获取历史数据
  GetMonitorDatas() {
    let pollutantCodes = wx.getStorageSync('selectedPollutants').map(item => item.code).toString();
    const datatype = this.data.dataType;
    let _dataType = 'realtime';

    let endTime = wx.getStorageSync('selectedDate')
    let beginTime = '';
    if (datatype == 0) {// 分钟
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:00');
      beginTime = moment(endTime).add(-6, 'hour').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'minute';
    } else if (datatype == 1) { // 小时
      endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
      beginTime = moment(endTime).add(-24, 'hour').format('YYYY-MM-DD HH:00:00');
      _dataType = 'hour';
    } else if (datatype == 2) { // 日
      beginTime = moment(endTime).add(-30, 'day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      _dataType = 'day';
    } else if (datatype == 3) { // 月
      beginTime = moment(endTime).format('YYYY-MM-01 00:00:00');
      endTime = moment(endTime).add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      _dataType = 'day';
    }

    request.post({
      url: 'GetMonitorDatas',
      data: {
        "OpenId": wx.getStorageSync('OpenId'),
        "DGIMNs": wx.getStorageSync('dgimn'),
        "pollutantCodes": pollutantCodes,
        // "dataType": app.globalData.dataType,
        "dataType": _dataType,
        "pageIndex": 1,
        "pageSize": 100,
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
          if (this.data._pollutantType == 5 && (_dataType === 'hour' || _dataType === 'day')) {
            chartDatas.push({
              PollutantName: `AQI`,
              Value: itemD.AQI || 0,
              MonitorTime: itemD.MonitorTime,
              Status: '',
              PollutantCode: 'AQI',
              Unit: ''
            });
          }
          let row = itemD;
          selectedPollutants.map(function (itemP) {
            let statusFlag = row[`${itemP.code}_params`];
            let status = 0;
            if (statusFlag) {
              let flagArray = statusFlag.split('§');
              if (flagArray[0] === 'IsOver') {
                status = 1;
              } else if (flagArray[0] === 'IsException') {
                status = -1;
              }
            }
            let value = itemD[itemP.code];
            if (value) {
              value = value == '-' ? null : (+parseFloat(itemD[itemP.code]).toFixed(2));
            } else {
              value = null;
            }
            chartDatas.push({
              PollutantName: `${itemP.name}`,
              Value: value,
              MonitorTime: itemD.MonitorTime,
              Status: status,
              PollutantCode: itemP.code,
              Unit: itemP.unit
            });

          });
        });

        this.setData({
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
      offsetY: selectedPollutants.length >= 4 ? 33 : 15,
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
    chart.tooltip({
      showTitle:true,
      layout: 'vertical',
      snap: true,
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
      var point = chart.getPosition(data[data.length - 1]); // 获取该数据的画布坐标
      point.y = point.y+100;
      chart.showTooltip(point); // 展示该点的 tooltip
    }
    return chart;
    // return chart
  },

  // 获取实时数据
  GetRealTimeDataForPoint() {
    request.post({
      url: 'GetRealTimeDataForPoint',
      data: {
        "DGIMN": wx.getStorageSync('dgimn'),
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
    this.data._pollutantType = options.pollutantType;
    wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:ss"))
    // wx.setNavigationBarTitle({
    //   title: options.pointName,
    // })
    // this.GetRealTimeDataForPoint(options.dgimn)
    this.GetPollutantList();
    let pollutanttype = wx.getStorageSync('pollutanttype');
    this.setData({
      screenHeight:app.globalData.screenHeight,
      pollutanttype
    });
    // this.GetMonitorDatas();
    // app.globalData.DGIMN = options.DGIMN;
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
    const storageSelectDate = wx.getStorageSync('selectedDate')
    let selectedDate = moment(storageSelectDate).format(selectTimeFormat[this.data.dataType].showFormat);
    this.setData({
      selectedDate: selectedDate,
      chartShow: false,
      isDemo: launchType == 'demo',
      tipsData: [],
    })
    this.getData();
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
        
        // 整理数据
        let realData = []
        result.data.Datas.FormList.map((item,index)=>{
          realData = realData.concat(item.Nodes);
        })
        let recordTypeList = result.data.Datas.RecordType;
        recordTypeList.unshift({Abbreviation:'全部',TypeId:'全部'})
        this.setData({
          recordTypeList:result.data.Datas.RecordType,
          selectRecordType:{
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
    // console.log('picker发送选择改变，携带值为', index)
    // console.log('picker发送选择改变，携带值为', this.data.recordTypeList[index])
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
      // wx.navigateTo({
      //   url: '/pages/imageForm/imageForm',
      // })
      wx.navigateTo({
        url: '/pages/myWebview/index?imageurl='+e.currentTarget.dataset.image,
      })
    } else {
      wx.navigateTo({
        url: '/pages/myWebview/index',
      })
    }
    
  }
})