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
    dataType: 0,
    tipsData: [],
    selectedDate: moment().format("YYYY-MM-DD HH:ss"),
    _tabs: ["分钟", "小时", "日", "月"]
  },
  onPageTypeChangeTabs(key) {
    const activeKey = key.detail.activeKey;
    if (activeKey == 'realTime') {
      // 实时数据
      this.GetRealTimeDataForPoint();
    } else {
      // 历史数据
      this.GetMonitorDatas();
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
    if (datatype == 0) {
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:00');
      beginTime = moment(endTime).add(-1, 'hour').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'minute';
    } else if (datatype == 1) {
      endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
      beginTime = moment(endTime).add(-4, 'hour').format('YYYY-MM-DD HH:00:00');
      _dataType = 'hour';
    } else if (datatype == 2) {
      beginTime = moment(endTime).add(-1, 'day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      _dataType = 'day';
    } else if (datatype == 3) {
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
              value = value == '-' ? null : (+itemD[itemP.code].toFixed(2));
            } else {
              value = 0;
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
    debugger
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
    // chart.tooltip({
    //   // custom: true,
    //   showXTip: true,
    //   // showYTip: true,
    //   // snap: true,
    //   // crosshairsType: 'xy',
    //   crosshairsStyle: {
    //     lineDash: [ 2 ]
    //   }
    // });
    let that = this;
    chart.tooltip({
      // showXTip: true,
      layout: 'vertical',
      snap: true,
      showCrosshairs: true,
      onShow(obj) {

        let thisTip = [];
        if (obj.items.length > 0) {
          obj.items.map(function (item) {
            thisTip.push(item.origin);
          });
          console.log('tipsData=', thisTip);
          that.setData({
            tipsData: thisTip
          });
        }
      }, // tooltip 显示时的回调函数
      onHide(obj) {

      }, // tooltip 隐藏时的回调函数
    });
    // chart.area().position('MonitorTime*Value').color('PollutantName').adjust('stack');
    chart.line().position('MonitorTime*Value').color('PollutantName', ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']);
    chart.render();
    // 默认展示 tooltip
    if (data.length > 0) {
      var point = chart.getPosition(data[data.length - 1]); // 获取该数据的画布坐标
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
      this.setData({
        dataitem: res.data.Datas.dataitem,
        pointInfo: res.data.Datas.pointInfo,
      })
    })
  },

  getData() {
    this.GetRealTimeDataForPoint();
    this.GetMonitorDatas();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("details=", options)
    this.data._pollutantType = options.pollutantType;
    wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:ss"))
    wx.setNavigationBarTitle({
      title: options.pointName,
    })
    // this.GetRealTimeDataForPoint(options.dgimn)
    this.GetPollutantList();
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
    console.log("onShow")
    // wx.setStorageSync('selectedDate', moment().format("YYYY-MM-DD HH:ss"))
    const storageSelectDate = wx.getStorageSync('selectedDate')
    let selectedDate = moment(storageSelectDate).format(selectTimeFormat[this.data.dataType].showFormat);
    this.setData({
      selectedDate: selectedDate,
      chartShow: false,
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

  }
})