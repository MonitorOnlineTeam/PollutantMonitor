// pages/historyData/home/home.js
const moment = require('../../../utils/moment.min.js');
import F2 from '../../../miniprogram_npm/@antv/f2-canvas/lib/f2-all.min.js';
const app = getApp();
const comApi = app.api;
const common = app.common;
//['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']
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
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    opts: {
      lazyLoad: true
    },
    DGIMN: '',
    dataType: 0,
    selectedPollutants: [],
    chartDatas: [],
    selectedDate: '',
    tabList: ['5分钟', '小时', '日', '月'],
  },
  tabSelect(e) {
    // console.log(e);
    this.setData({
      dataType: e.currentTarget.dataset.id,
      selectedDate: moment(common.getStorage('selectedDate')).format(selectTimeFormat[e.currentTarget.dataset.id].showFormat),
    })
    this.getData();
  },
  transverse() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  onChangePollutant(e) {

    wx.navigateTo({
      url: '../selectPollutant/selectPollutant'
    })
  },
  onChangeDate(e) {
    wx.navigateTo({
      url: '../selectDateTime/selectDateTime?dataType=' + this.data.dataType
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  horizontalScreen: function() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    this.chartComponent = this.selectComponent('#line-dom');
    let selectedDate = common.getStorage('selectedDate');
    //debugger
    if (!selectedDate) {
      selectedDate = moment().format(selectTimeFormat[this.data.dataType].showFormat);
    } else {
      selectedDate = moment(selectedDate).format(selectTimeFormat[this.data.dataType].showFormat);
    }
    this.setData({
      DGIMN: common.getStorage('DGIMN'),
      selectedPollutants: common.getStorage('selectedPollutants') || [],
      selectedDate: selectedDate
    });
    common.setStorage('selectedDate', selectedDate);
    this.getData();
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
    // console.log(common.getStorage('selectedPollutants'));
    // console.log(common.getStorage('selectedDate'));
    this.setData({
      selectedDate: moment(common.getStorage('selectedDate')).format(selectTimeFormat[this.data.dataType].showFormat),
      selectedPollutants: common.getStorage('selectedPollutants') || []
    });
    if (!common.getStorage('selectedPollutants')) {
      wx.showModal({
        title: '提示',
        content: '请先选择污染物',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../selectPollutant/selectPollutant'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    this.getData();
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
    this.getData();
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
  formatPollutantNames: function() {
    let {
      selectedPollutants
    } = this.data;
    let pollutantNames = [];
    selectedPollutants.map(function(item) {
      pollutantNames.push(item.name);
    });
    return pollutantNames;
  },
  //获取监控数据
  getData: function() {
    
    let {
      selectedPollutant,
      dataType,
      selectedDate,
      selectedPollutants
    } = this.data;
    
    let pollutantCodes = [];

    selectedPollutants.map(function(item) {
      pollutantCodes.push(item.code);
    });
    //debugger;
    comApi.getMonitorDatas(pollutantCodes.join(','), dataType, selectedDate).then(res => {
      console.log('getMonitorDatas', res);
      console.log('selectedPollutants', selectedPollutants);
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let chartDatas = [];

        thisData.map(function(itemD) {
          selectedPollutants.map(function(itemP) {
            chartDatas.push({
              PollutantName: `${itemP.name}/${itemP.unit}`,
              Value: itemD[itemP.code],
              MonitorTime: itemD.MonitorTime,
              Status: 0
            });
          });
        });

        this.setData({
          chartDatas: chartDatas
        });
        this.initChart();
      }
      wx.hideNavigationBarLoading();
    })
  },
  initChart: function() {
    this.chartComponent.init((canvas, width, height, F2) => {
      const arr = this.data.chartDatas;
      const chart = new F2.Chart({
        el: canvas,
        width,
        height,
        padding: ['auto', 'auto', 'auto', 'auto']
      });
      chart.source(arr, {
        'MonitorTime': {
          type: 'timeCat',
          mask: selectTimeFormat[this.data.dataType].chartFormat,
          tickCount: 6,
          range: [0, 1]
        },
        'Value': {
          type: 'linear',
          tickCount: 5,
        }
      });
      chart.legend('PollutantName', {
        position: 'top',
        // offsetY: 40,
        // labelOffset: 60,
      });
      chart.axis('MonitorTime', {
        // labelOffset: 40,
        label(text, index, total) {
          const cfg = {
            textAlign: 'center'
          };
          if (index === 0) {
            cfg.textAlign = 'left';
          }
          if (index > 0 && index === total - 1) {
            cfg.textAlign = 'right';
          }
          return cfg;
        }
      });
      chart.tooltip({
        showXTip: true,
        // showYTip: true,
        showCrosshairs: true,
        custom: true, // 自定义 tooltip 内容框
        onChange(obj) {
          const legend = chart.get('legendController').legends.top[0];
          const tooltipItems = obj.items;
          //debugger
          const legendItems = legend.items;
          const map = {};
          legendItems.map(item => {
            map[item.name] = Object.assign({}, item);
          });
          tooltipItems.map(item => {
            const {
              name,
              value,
              title,
              orign
            } = item;
            if (map[name]) {
              map[name].value = `${value}`;
            }
          });
          legend.setItems(Object.values(map));
        },
        onHide() {
          // const legend = chart.get('legendController').legends.top[0];
          // legend.setItems(chart.getLegendItems().country);
        }
      });
      // chart.area().position('MonitorTime*Value').color('PollutantName');
      chart.line().position('MonitorTime*Value').color('PollutantName');
      chart.render();
      return chart;
    });
  }
})