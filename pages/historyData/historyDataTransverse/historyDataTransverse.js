// pages/historyData/historyDataTransverse/historyDataTransverse.js
import F2 from '../../../miniprogram_npm/@antv/f2-canvas/lib/f2-all.min.js';
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
// ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387'],
let chart = null;
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
    dataType: 0,
    loadProgress: 0,
    time: '12:01',
    TabCur: 0,
    tabList: ['5分钟', '小时', '日', '月'],
    selectTab: 1,
    selectValue: 0,
    opts: {
      lazyLoad: true
    },
    DGIMN: '',
    selectedPollutants: [],
    chartDatas: [],
    tipsData: [],
    selectedDate: ''
  },
  tabSelect(e) {
    this.setData({
      dataType: e.currentTarget.dataset.id,
      selectedDate: moment(common.getStorage('selectedDate')).format(selectTimeFormat[e.currentTarget.dataset.id].showFormat),
    })
    this.getData();
  },
  onChangeDate(e) {
    wx.navigateTo({
      url: '../selectDateTime/selectDateTime?dataType=' + this.data.dataType
    })
  },
  navigateBack() {
    wx.navigateBack()
  },
  isLoading(e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
  loadModal() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 2000)
  },
  loadProgress() {
    this.setData({
      loadProgress: this.data.loadProgress + 3
    })
    if (this.data.loadProgress < 100) {
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    } else {
      this.setData({
        loadProgress: 0
      })
    }
  },
  transverse() {
    wx.navigateTo({
      url: '../historyDataTransverse/historyDataTransverse'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.chartComponent = this.selectComponent('#line-dom');
    let selectedPollutants = common.getStorage('selectedPollutants') || [];
    let selectedDate = common.getStorage('selectedDate');
    //debugger
    if (!selectedDate) {
      selectedDate = moment().format(selectTimeFormat[this.data.dataType].showFormat);
    } else {
      selectedDate = moment(selectedDate).format(selectTimeFormat[this.data.dataType].showFormat);
    }


    this.setData({
      DGIMN: common.getStorage('DGIMN'),
      selectedPollutants: selectedPollutants,
      tipsData: selectedPollutants,
      selectedDate: selectedDate,
    });
    common.setStorage('selectedDate', selectedDate);
    // if (!selectedPollutants)
    // {

    //   let tipsData=[];
    //   selectedPollutants.map(function(item){
    //     tipsData.push({

    //     });
    //   });
    // }

    //this.getData();
  },
  initChart: function() {
    let that = this;
    let {
      selectedPollutants,
      dataType,
      chartDatas
    } = this.data;
    this.chartComponent.init((canvas, width, height, F2) => {
      chart = new F2.Chart({
        el: canvas,
        width,
        height,
        padding: [50, 20, 'auto', 50]
      });

      var Global = F2.Global;
      var data = chartDatas;
      var margin = 1 / data.length;
      chart.source(data, {
        'MonitorTime': {
          // type: 'timeCat',
          // mask: selectTimeFormat[dataType].chartFormat,
          tickCount: 7,
          //range: [0, 1]
        },
        'Value': {
          type: 'linear',
          tickCount: 5,
        }
        // population: {
        //   tickCount: 5
        // },
        // country: {
        //   range: [margin / 4, 1 - margin / 4] // 配置 range 范围，使左右两边不留边距
        // }
      });

      chart.coord({
        transposed: true
      });
      chart.legend(false);
      chart.axis('MonitorTime', {
        // line: Global._defaultAxis.line,
        // grid: null,
        labelOffset: 20,
        label(text, index, total) {
          console.log(text);
          const cfg = {
            textAlign: 'center',
            text: moment(text).format(selectTimeFormat[dataType].chartFormat),
            rotate: 1.59,
            // textBaseline: 'middle'
          };
          if (index === 0) {
            cfg.textAlign = 'right';
            if (dataType != 3)
              cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
          }
          if (index > 0 && index === total - 1) {
            //cfg.textAlign = 'right';
            if (dataType != 3)
              cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
          }
          return cfg;
        }
      });
      
      chart.axis('Value', {
        position: 'right',
        line: null,
        grid: Global._defaultAxis.grid,
        labelOffset: 10,
        label: {
          rotate: 1.59,
          //textAlign: 'end',
          //textBaseline: 'middle'
        }
      });
      chart.tooltip({
        //showXTip: true,
        showYTip: true,
        showCrosshairs: true,
        crosshairsType: 'x',
        yTip: function yTip(val) {
          return {
            text: moment(val).format(selectTimeFormat[dataType].chartFormat),
            fill: '#fff',
            rotate: 1.59,
          };
        },
        yTipBackground: {
          radius: 1,
          fill: 'rgba(0, 0, 0, 0.65)',
          padding: [20, 1]
        },
        custom: true, // 自定义 tooltip 内容框
        onChange(obj) {
          const tooltipItems = obj.items;
          const map = {};
          let thisTip = [];
          that.data.selectedPollutants.map(function(item, index) {
            let thisData = tooltipItems.filter(m => m.name == item.name);
            if (thisData && thisData.length > 0) {
              let {
                origin
              } = thisData[0];
              item.name = `${ item.name }`;
              item.color = thisData[0].color;
              item.value = thisData[0].value;
              item.status = origin.Status;
            }
            thisTip.push(item);
          })
          that.setData({
            tipsData: thisTip
          });
        }
      });
      chart.line().position('MonitorTime*Value').color('PollutantName');
      // chart.area().position('country*population');
      chart.render();

      return chart;
    })
  },
  //获取监控数据
  getData: function() {
    let {
      selectedPollutant,
      dataType,
      selectedDate,
      selectedPollutants
    } = this.data;
    var pointName = common.getStorage("PointName");
    if (pointName != "") {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
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
          let row = itemD;

          selectedPollutants.map(function(itemP) {
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
            chartDatas.push({
              PollutantName: `${itemP.name}`,
              Value: itemD[itemP.code],
              MonitorTime: itemD.MonitorTime,
              Status: status,
              PollutantCode: itemP.code,
              Unit: itemP.unit
            });
          });
        });

        this.setData({
          chartDatas: chartDatas
        });
        //console.log(chartDatas);
        this.initChart();
      }
      wx.hideNavigationBarLoading();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let that = this;
    // that.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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

  }
})