// pages/dataMonitor/dataMonitor.js
import * as echarts from '../../dist/ec-canvas/echarts';
const moment = require('../../utils/moment.min.js')
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DGIMN:'',
    chartData: [],
    ec: {
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    xAxisData: [],
    seriesData: [],
    selectedPollutant: {},
    tableDatas: [],
    dataType: 0,
    pickerType: 'day',
    pollutantDatas: [],
    pollutantNames: [],
    pollutantNamesObject: [],
    startDate: moment().add(-1, 'years').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    selectTime: moment().format('YYYY-MM-DD HH:00'),



    selectTimeFormat: {
      0: {
        serverFormat: 'HH:mm',
        pickerTime: moment().format('HH:00'),
        pickerType: ''
      },
      1: {
        serverFormat: 'MM-DD HH:mm',
        pickerTime: moment().format('YYYY-MM-DD'),
        pickerType: 'day'
      },
      2: {
        serverFormat: 'MM-DD HH:00',
        pickerTime: moment().format('YYYY-MM-DD'),
        pickerType: 'day'
      },
      3: {
        serverFormat: 'MM-DD',
        pickerTime: moment().format('YYYY-MM'),
        pickerType: 'month'
      }
    }
    // selectTimeFormat: {
    //   0: 'HH:mm',
    //   1: 'MM-DD HH:mm',
    //   2: 'MM-DD HH:00',
    //   3: 'MM-DD'
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.setData({
      DGIMN: common.getStorage('DGIMN')
    });
    this.onPullDownRefresh();
    //this.fetchData();
  },
  // 分段器切换
  onChange(e) {
    // console.log(e)
    console.log(e.detail.key + '-' + this.data.dataType)
    if (e.detail.key !== this.data.dataType) {
      this.setData({
        dataType: e.detail.key,
        selectedDate: e.detail.key != 0 ? moment(this.data.selectedDate).format(this.data.selectTimeFormat[e.detail.key].pickerTime) : this.data.selectedDate
      })
      this.getData();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!common.getStorage('IsHaveHistory')) {
      wx.showModal({
        title: '提示',
        content: '请先扫描设备二维码',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
      this.setData({
        DGIMN: common.getStorage('DGIMN')
      });
      this.onPullDownRefresh();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 初始化图表
  init: function() {
    this.ecComponent.init((canvas, width, height) => {
      //console.log(2)
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  //获取污染物
  getPollutantList: function(callback) {
    comApi.getPollutantList().then(res => {
      console.log('污染物', res);
      //this.reloadChart();
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let selectedPollutant = {};
        let pollutantNames = [];
        let pollutantNamesObject = [];
        thisData.map(function(item, index) {
          let pObj = {};
          //pollutantObjectArray
          if (index === 0) {
            selectedPollutant = item;
            selectedPollutant.id = index;
          }
          pObj = item;
          pObj.id = index;

          pollutantNames.push(item.pollutantName)
          pollutantNamesObject.push(pObj)
        })
        //console.log(pollutantNamesObject);

        this.setData({
          selectedPollutant: selectedPollutant,
          pollutantDatas: thisData,
          pollutantNames: pollutantNames,
          pollutantNamesObject: pollutantNamesObject
        })
        callback();
      }
    });
  },
  //获取监控数据
  getData: function() {
    let {
      selectedPollutant,
      dataType,
      selectTime,
      selectTimeFormat,
      selectedDate
    } = this.data;
    comApi.getMonitorDatas(selectedPollutant.pollutantCode, dataType, selectedDate).then(res => {
      console.log('getMonitorDatas', res)
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let xAxisData = [];
        let seriesData = [];
        console.log(selectedPollutant)
        thisData.map(function(item) {
          item.MonitorTime = moment(item.MonitorTime).format(selectTimeFormat[dataType].serverFormat);
          xAxisData.push(item.MonitorTime);
          seriesData.push(item[selectedPollutant.pollutantCode] || '0');
        })
        this.setData({
          xAxisData: xAxisData,
          seriesData: seriesData,
          tableDatas: thisData
        });
        this.init();
      }
      wx.hideNavigationBarLoading();
    })
  },
  //图表重绘
  setOption: function(chart) {
    let {
      xAxisData,
      selectedPollutant,
      seriesData
    } = this.data;
    console.log(seriesData)
    //console.log(this.data.xAxisData);
    var option = {
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      grid: {
        containLabel: true,
        left: '5%',
        top: '15%',
        bottom: '10%'
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        name: '单位:' + selectedPollutant.unit,
        // show: false
      },
      series: [{
        name: selectedPollutant.pollutantName,
        type: 'line',
        smooth: true,
        data: seriesData
      }]
    };
    chart.setOption(option);
  },
  //绑定污染物
  bindPollutantChange: function(e) {
    let data = this.data.pollutantNamesObject.filter(m => m.id == e.detail.value);
    if (data) {
      this.setData({
        selectedPollutant: data[0],
      });
      this.getData();
    }
  },
  //时间选择
  bindDateChange: function(e) {
    console.log(e.detail);
    console.log(this.data.selectedDate);
    //moment(endTime).add(1, 'months').add(-1,'seconds').format('YYYY-MM-DD 23:59:59');
    //console.log(moment('2018-12').add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59'));
    if (e.detail.value !== this.data.selectedDate) {
      this.setData({
        selectedDate: e.detail.value
      });
      this.getData();
    }
  },
  fetchData:function(){
    let that = this;
    this.getPollutantList(function () {
      that.getData();
    });
  }
})