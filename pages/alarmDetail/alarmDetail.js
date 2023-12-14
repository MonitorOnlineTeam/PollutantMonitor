// pages/alarmDetail/alarmDetail.js
import request from '../../utils/request'
import demo from '../../utils/demo'
import moment from 'moment'
const selectTimeFormat = {
  MinuteData: {
    showFormat: 'YYYY-MM-DD HH:mm',
    chartFormat: 'HH:mm'
  },
  HourData: {
    showFormat: 'YYYY-MM-DD HH:00',
    chartFormat: 'HH:mm'
  },
  DayData: {
    showFormat: 'YYYY-MM-DD',
    chartFormat: 'HH:mm'
  },
  MonthData: {
    showFormat: 'YYYY-MM',
    chartFormat: 'MM-DD'
  }
}

const colors = ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDemo:true,
    selectedPollutantCodes:[],
    pollutantList:[],// 监测因子列表
    colors:['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']//颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('options = ',options);
    const launchType = wx.getStorageSync('launchType')
    let isDemo = (launchType == 'demo'||launchType == 'singlePoint_demo')
    this.setData({
      isDemo,
      alarmPollotantCodes:{
        code:options.pollutantCode,
        name:options.pollutantName
      },
      selectedPollutantCodes:[{
        code:options.pollutantCode,
        name:options.pollutantName,
      }],
      pollutantList:[{
        code:options.pollutantCode,
        name:options.pollutantName,
        color:colors[0]
      }],
      alarmTime: options.alarmTime,
      alarmValue: options.alarmValue,
      dataType: options.dataType,
      DGIMN:options.DGIMN
    })
    if (isDemo) {
      console.log('index = ',options.index);
      console.log('alarmResult = ',demo.alarmResult);
      this.setData({
        ...demo.alarmResult.Datas[options.index]
      })
    } else {
      request.post({
        url: 'GetAlarmInfoList',
        data:{
          "beginTime": moment().subtract(2, 'months').format('YYYY-MM-DD 00:00:00'),
          "endTime": moment().format("YYYY-MM-DD 23:59:59"),
          alarmID:options.id
        },
      }).then(result => {
        // console.log('result=', result);
        if (result.data && result.data.IsSuccess) {
          this.setData({
            ...result.data.Datas[0]
          })
        }
      })
    }
    
    this.GetMonitorDatas();
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
    let alarmPollotantCodes = this.data.alarmPollotantCodes
    request.post({
      url: 'GetPollutantList',
      data: {
        // "DGIMN": wx.getStorageSync('dgimn'),
        // "DGIMN": "40142001012307",
        "DGIMN": this.data.DGIMN,
      }
    }).then(result => {      
      let selectedPollutants = [];
      let pollutantList = [];
      result.data.Datas.map(function (item, index) {
        if (item.pollutantCode == alarmPollotantCodes.code) {
          pollutantList.unshift({
            code: item.pollutantCode,
            name: item.pollutantName,
            unit: item.unit,
            checked: true,
            color: colors[0],
            value: '-'
          })
        } else {
          pollutantList.push({
            code: item.pollutantCode,
            name: item.pollutantName,
            unit: item.unit,
            checked: false,
            color: '',
            value: '-'
          })
        }
      })
      // console.log('pollutantList = ',pollutantList);
      this.setData({
        'pollutantList':pollutantList
      });
      // wx.setStorageSync('pollutantList', pollutantList)
      // wx.setStorageSync('selectedPollutants', selectedPollutants)
    })
  },
  renderChar(F2, config, data) {
    const alarmTime = this.data.alarmTime;
    const alarmValue = this.data.alarmValue;
    const colors = this.data.colors;
    const chart = new F2.Chart({
      ...config,
      // width: '100%'
      padding: 'auto'
    });
    // const selectedPollutants = wx.getStorageSync('selectedPollutants')
    const selectedPollutants = this.data.selectedPollutantCodes;
    // console.log('selectedPollutants = ',selectedPollutants);
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
    chart.legend(false);
    // chart.legend('PollutantName', {
    //   position: 'top',
    //   offsetY: selectedPollutants.length >= 4 ? 33 : 15,
    //   align: 'center',
    //   nameStyle: {
    //     fontSize: '14', // 文本大小
    //   },
    //   marker: {
    //     symbol: 'circle', // marker 的形状
    //     radius: 4 // 半径大小
    //   },
    //   // labelOffset: 60,
    // });
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
    chart.point().position('MonitorTime*Value').shape('smooth')
    .style('MonitorTime*Value', {
      stroke: '#EE3B3B',
      lineWidth: 1,
      fill: '#EE3B3B',
      r:function r(date,value){
        // console.log('date = ',date);
        // console.log('alarmTime = ',alarmTime);
        // console.log('alarmValue = ',alarmValue);
        // console.log('value = ',value);
        if (date == moment(alarmTime).format(selectTimeFormat[dataType].showFormat) && alarmValue == value) {
          return 4;
        } else {
          return 0;
        }
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
          // console.log('tipsData=', thisTip);
          that.setData({
            tipsData: thisTip
          });
        }
      }, // tooltip 显示时的回调函数
      onHide(obj) {

      }, // tooltip 隐藏时的回调函数
    });
    chart.tooltip(false)
    // chart.area().position('MonitorTime*Value').color('PollutantName').adjust('stack');
    chart.line().position('MonitorTime*Value').color('PollutantName', colors);
    chart.render();
    // 默认展示 tooltip
    // if (data.length > 0) {
    //   var point = chart.getPosition(data[data.length - 1]); // 获取该数据的画布坐标
    //   chart.showTooltip(point); // 展示该点的 tooltip
    // }
    return chart;
    // return chart
  },
  // 获取历史数据
  GetMonitorDatas() {
    // 确定因子
    // 确定时间
    let pollutantCodes = this.data.selectedPollutantCodes.map(item => item.code).toString();
    const datatype = this.data.dataType;
    let _dataType = 'realtime';

    let endTime = this.data.alarmTime;
    let beginTime = '';
    if (datatype == 'MinuteData') {// 分钟
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:00');
      beginTime = moment(endTime).add(-1, 'hour').format('YYYY-MM-DD HH:mm:ss');
      _dataType = 'minute';
    } else if (datatype == "HourData") { // 小时
      endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
      beginTime = moment(endTime).add(-4, 'hour').format('YYYY-MM-DD HH:00:00');
      _dataType = 'hour';
    } else if (datatype == 'DayData') { // 日
      beginTime = moment(endTime).add(-1, 'day').format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      _dataType = 'day';
    } else if (datatype == 'MonthData') { // 月
      beginTime = moment(endTime).format('YYYY-MM-01 00:00:00');
      endTime = moment(endTime).add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      _dataType = 'day';
    }
    let alarmTime = this.data.alarmTime;
    request.post({
      url: 'GetMonitorDatas',
      data: {
        "OpenId": wx.getStorageSync('OpenId'),
        "DGIMNs": this.data.DGIMN,
        // "DGIMNs": "40142001012307",
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
        // let selectedPollutants = wx.getStorageSync('selectedPollutants')
        let selectedPollutants = this.data.selectedPollutantCodes;
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
              // value = value == '-' ? null : (+parseFloat(itemD[itemP.code]).toFixed(2));
              value = value == '-' ? null : (+itemD[itemP.code]);
            } else {
              value = null;
            }
            chartDatas.push({
              PollutantName: `${itemP.name}`,
              Value: value,
              MonitorTime: itemD.MonitorTime,
              Status: status,
              PollutantCode: itemP.code,
              Unit: itemP.unit,
              pointSize:itemD.MonitorTime == alarmTime?1:0
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
  selectPollutantFun(option) {
    const index = option.currentTarget.dataset.index;
    const item = option.currentTarget.dataset.item;
    let selectedPollutantCodes = this.data.selectedPollutantCodes;
    let colors = this.data.colors;
    const colorIndex = selectedPollutantCodes.length;
    if (index!=0) {
      let pollutantList = this.data.pollutantList;
      let newItem = {...item};
      let refresh = true;
      if (newItem.checked) {
        newItem.checked = !newItem.checked;
        newItem.color = '#F6F6F6';
        const deleteIndex = selectedPollutantCodes.findIndex((item)=>{
          return item.code == newItem.code
        })
        selectedPollutantCodes.splice(deleteIndex,1);
        const deleteColor = colors[deleteIndex];
        colors.splice(deleteIndex,1);
        colors.push(deleteColor);
      } else {
        if (selectedPollutantCodes.length<5) {
          newItem.checked = !newItem.checked;
          newItem.color = colors[colorIndex];
          selectedPollutantCodes.push(newItem);
        } else {
          refresh = false;
          wx.showToast({
            title: '至多5个因子',
            icon: 'error',
          })
        }
      }
      pollutantList[index] = newItem;
      pollutantList = [].concat(pollutantList);
      if (refresh) {
        this.setData({
          pollutantList,
          selectedPollutantCodes,
          colors,
          chartShow:false
        });
        this.GetMonitorDatas();
      }
    }
  },
  findSelectedPollutantCodes () {
    let selectedPollutantCodes = this.data.selectedPollutantCodes;
  }
})