// pages/historyData/historyData.js
import moment from 'moment'
import request from '../../utils/request'
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
    initChart: null,
    selectedPollutants:[],
    tipsData:[],
    chartShow:false,
    dataType: 0,
    _tabs: [{
      label:"小时",
      status:'seleted',
      color:'#2d8cf0',
    },{
      label:"日均",
      status:'unseleted',
      color:'#bbbbbb',
    },{
      label:"实时",
      status:'unseleted',
      color:'#bbbbbb',
    },{
      label:"分钟",
      status:'unseleted',
      color:'#bbbbbb',
    }],
    windowHeight:0,
    screenHeight:0,
    windowWidth:0,
    selectedDate:moment().format("YYYY-MM-DD HH:mm"),
    "showMode":'chart',
    listLabels:[],
    oneRpx:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    const index = options.dataType;
    const oneRpx = windowInfo.windowWidth/750;
    let newData = [].concat(this.data._tabs);
    newData.map((item,_index)=>{
      if (_index == index) {
        item.color = '#2d8cf0';
      } else {
        item.color = '#bbbbbb';
      }
    });
    console.log('123 windowWidth = '+windowInfo.windowWidth);
    this.setData({
      screenWidth:windowInfo.windowHeight,
      windowHeight:windowInfo.windowHeight,
      screenHeight:windowInfo.windowWidth,
      // screenWidth:windowInfo.screenHeight,
      // windowHeight:windowInfo.windowHeight,
      // screenHeight:windowInfo.windowWidth,
      dataType:index,
      _tabs:newData,
      oneRpx,
    });
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
    const windowInfo = wx.getWindowInfo();
    console.log('123 windowWidth = '+windowInfo.windowWidth);
    console.log('123 screenWidth = '+windowInfo.screenWidth);
    console.log('123 windowInfo = ',windowInfo);

    this.setData({
      // screenWidth:windowInfo.windowWidth-windowInfo.statusBarHeight,
      screenWidth:windowInfo.windowHeight,
      windowHeight:windowInfo.windowHeight,
    });
    const storageSelectDate = wx.getStorageSync('selectedDate')
    console.log('onShow storageSelectDate = ',storageSelectDate);
    let selectedDate = moment(storageSelectDate).format(selectTimeFormat[this.data.dataType].showFormat);
    this.setData({
      selectedDate: selectedDate,
      chartShow: false,
      // isDemo: launchType == 'demo'||launchType == 'singlePoint_demo',
      tipsData: [],
      showMode:app.globalData.historyDataType,
    })

    //
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
  gotoPortrait() {
    wx.navigateBack()
  },
  changeType(e){
    let index = e.currentTarget.dataset.index;
    let newData = [].concat(this.data._tabs);
    newData.map((item,_index)=>{
      if (_index == index) {
        item.color = '#2d8cf0';
      } else {
        item.color = '#bbbbbb';
      }
    });
    this.data.dataType = index;
    console.log('activeKey = ',index);
    this.setData({
      _tabs:newData,
      dataType: index,
      chartShow: false,
      tipsData:[],
      selectedDate: moment(wx.getStorageSync('selectedDate')).format(selectTimeFormat[index].showFormat),
    });
    this.GetMonitorDatas();
  },
  // 跳转选择时间
  onChangeDate() {
    console.log('onChangeDate dataType = ',this.data.dataType);
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
    // wx.navigateTo({
    //   url: '/pages/date-picker/index?dataType=' + pickerType
    // })
    wx.navigateTo({
      url: '/pages/date-picker-landscape/datePickerLandscape?dataType=' + pickerType
    })
  },
  // 获取历史数据
  GetMonitorDatas() {
    console.log('GetMonitorDatas this.data.selectedPollutants = ',this.data.selectedPollutants);
    // let pollutantCodes = wx.getStorageSync('selectedPollutants').map(item => item.code).toString();
    let pollutantCodes = this.data.selectedPollutants.map(item => item.code).toString();
    const datatype = this.data.dataType;
    let _dataType = 'realtime';

    let endTime = wx.getStorageSync('selectedDate')
    let beginTime = '';
    // if (datatype == 0) {// 分钟
    //   endTime = moment(endTime).format('YYYY-MM-DD HH:mm:00');
    //   beginTime = moment(endTime).add(-6, 'hour').format('YYYY-MM-DD HH:mm:ss');
    //   _dataType = 'minute';
    // } else if (datatype == 1) { // 小时
    //   endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
    //   beginTime = moment(endTime).add(-24, 'hour').format('YYYY-MM-DD HH:00:00');
    //   _dataType = 'hour';
    // } else if (datatype == 2) { // 日
    //   beginTime = moment(endTime).add(-30, 'day').format('YYYY-MM-DD HH:mm:ss');
    //   endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
    //   _dataType = 'day';
    // } else if (datatype == 3) { // 月
    //   beginTime = moment(endTime).format('YYYY-MM-01 00:00:00');
    //   endTime = moment(endTime).add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
    //   _dataType = 'day';
    // }
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
            }
            let value = itemD[itemP.code];
            let showValue = itemD[itemP.code];
            // 如果数据不存在用---替换
            if (typeof itemD[itemP.code+"_flag"] == 'undefined') {
              itemD[itemP.code+"_flag"] = '---';
            }
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
      // width: '100%',
      // padding: 'auto'
      padding: [50,200,50,50]
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
      offsetX:-50,
      offsetY:-10,
      itemMarginBottom:8,
      itemWidth:80,
      wrap: true, // 允许换行
      itemGap: 10, // 设置图例项间距
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
            console.log('item = ',item);
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
            console.log('item =',item);
            if (item.Value) {
              var point = chart.getPosition(item); // 获取该数据的画布坐标
              console.log('point = ',point);
    
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
        console.log("pollutantList item = ",item);
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
      console.log('before setDataselectedPollutants = ',selectedPollutants);
      wx.setStorageSync('pollutantList', pollutantList)
      wx.setStorageSync('selectedPollutants', selectedPollutants)
      this.setData({
        "selectedPollutants":selectedPollutants
        ,"listLabels":listLabels
      });
      console.log('GetPollutantList end');
      // this.getData();
      this.GetMonitorDatas();
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

})