// pages/historyDataPortrait/historyDataPortrait.js
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
    dataType: 0,
    tipsData: [],
    selectedDate: moment().format("YYYY-MM-DD HH:mm"),
    // _tabs: ["分钟", "小时", "日", "月"],
    _tabs: ["小时", "日均", "实时", "分钟"],
    selectedPollutants:[],
    "showMode":'chart',
    screenWidth:1000,
    windowHeight:10000,
    oneRpx:0,
    listLabels:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    const oneRpx = windowInfo.windowWidth/750;
    const alarmType = options.alarmType;
    if (alarmType == 0
      ||alarmType == 2) {
      // 超标报警
      // 异常报警
      this.setData({
        dataType:0,
        screenWidth:windowInfo.windowWidth,
        windowHeight:windowInfo.windowHeight,
        oneRpx,
      });
    } else if (alarmType == 1) {
      // 超标预警
      this.setData({
        dataType:3,
        screenWidth:windowInfo.windowWidth,
        windowHeight:windowInfo.windowHeight,
        oneRpx,
      });
    }

    wx.setNavigationBarTitle({
      title: '数据查询',
    });
    wx.setStorageSync('selectedDate', moment(options.time).format("YYYY-MM-DD HH:mm"))
    this.GetPollutantList();
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
    // 历史数据
    this.setData({
      // dataType: 0,
      chartShow: false,
      selectedDate: moment(wx.getStorageSync('selectedDate')).format(selectTimeFormat[this.data.dataType].showFormat),
      showMode:app.globalData.historyDataType,
    })
    this.GetMonitorDatas();
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
      console.log('GetPollutantList end');
      this.getData();
    })
  },

  getData() {
    // this.GetRealTimeDataForPoint();
    this.GetMonitorDatas();
    // this.getMobileOperationPageList();
    // this.getPointEquipmentInfo();
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
            let showValue = itemD[itemP.code];
            if (value) {
              value = value == '-' ? null : (+parseFloat(itemD[itemP.code]).toFixed(2));
            } else {
              value = null;
            }
            chartDatas.push({
              PollutantName: `${itemP.name}`,
              Value: value,
              "showValue":showValue,
              chartMonitorTime: moment(itemD.MonitorTime).format("HH:mm MM/DD") ,
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
    chart.tooltip({
      alwaysShow:true,
      showTitle:true,
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
      // var point = chart.getPosition(data[data.length - 1]); // 获取该数据的画布坐标
      // point.y = point.y+100;
      // chart.showTooltip(point); // 展示该点的 tooltip
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
    return chart;
    // return chart
  },

  gotoLand: function(e) {
    wx.navigateTo({
      url: '/pages/historyData/historyData?dataType='+this.data.dataType,
    })
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
  },

})