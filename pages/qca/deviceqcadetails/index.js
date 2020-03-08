// pages/qca/deviceqcadetails/index.js
// import F2 from '../../../../miniprogram_npm/@antv/f2-canvas/lib/f2-all.min.js';
import F2 from '../../../miniprogram_npm/@antv/f2-canvas/lib/f2-all.min.js';
const moment = require('../../../utils/moment.min.js');
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
    opts: {
      lazyLoad: true
    },
    chartDatas: [{
        "MonitorTime": "2018-09-01",
        "Value": 35,
        "PollutantName": "1"
      },
      {
        "MonitorTime": "2018-09-02",
        "Value": 36,
        "PollutantName": "2"
      },
      {
        "MonitorTime": "2018-09-03",
        "Value": 45,
        "PollutantName": "1"
      },
      {
        "MonitorTime": "2018-09-04",
        "Value": 35,
        "PollutantName": "2"
      },
      {
        "MonitorTime": "2018-09-05",
        "Value": 36,
        "PollutantName": "1"
      },
      {
        "MonitorTime": "2018-09-06",
        "Value": 45,
        "PollutantName": "2"
      }
    ],
    selectedPollutants: [],
    title: '广东瑞明电力股份有限公司 - 测试质控比对排口，在2020-01-10 19:24:44 - 2020-01-10 19:32:50时间段，进行实测SO2周期质控，正负误差为-3.45%，质控结果为不合格',
    tipsData: [{
        color: 'red',
        status: 1,
        name: '测量温度',
        value: 123,
        unit: 'm3'
      },
      {
        color: 'blue',
        status: 1,
        name: '配比标气浓度',
        value: 123,
        unit: 'm3'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.chartComponent = this.selectComponent('#line-dom');
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
    this.initChart();
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

  },
  testChart: function() {
    var data = [];
    var step = Math.PI / 4;
    for (var x = 0; x < 100; x += step) {
      data.push({
        x: x,
        y: Math.sin(x)
      });
    }
    this.chartComponent.init((canvas, width, height, F2) => {
      chart = new F2.Chart({
        el: canvas,
        width,
        height,
        //padding: [50, 20, 'auto', 50]
      });
      var Global = F2.Global;
      chart.source(data);
      chart.axis('x', {
        grid: function grid(text) {
          if (text == 0) {
            return {
              lineDash: null
            };
          }
        }
      });
      chart.axis('y', {
        grid: function grid(text) {
          if (text == 0) {
            return {
              lineDash: null
            };
          }
        }
      });
      //chart.legend(true);
      // chart.tooltip(false);
      // chart.interaction('pan', {
      //   limitRange: {
      //     x: {
      //       min: 0,
      //       max: 100
      //     }
      //   }
      // });
      // chart.interaction('pinch', {
      //   maxScale: 5,
      //   minScale: 1
      // });
      chart.line().position('x*y').shape('smooth');
      chart.render();
    });
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
          formatter: function formatter(val) {
            return val.toFixed(2);
          }
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
          //console.log(text);
          const cfg = {
            textAlign: 'center',
            text: text, //moment(text).format(selectTimeFormat[dataType].chartFormat),
            rotate: 1.59,
            // textBaseline: 'middle'
          };
          // if (index === 0) {
          //   cfg.textAlign = 'right';
          //   if (dataType != 3)
          //     cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
          // }
          // if (index > 0 && index === total - 1) {
          //   //cfg.textAlign = 'right';
          //   if (dataType != 3)
          //     cfg.text = moment(text).format(selectTimeFormat[dataType].chartFormat) + `\n${moment(text).format('MM-DD')}`;
          // }
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
            text: val, //moment(val).format(selectTimeFormat[dataType].chartFormat),
            fill: '#fff',
            rotate: 1.59,
          };
        },
        yTipBackground: {
          radius: 1,
          fill: 'rgba(0, 0, 0, 0.65)',
          padding: [20, 1]
        },
        custom: false, // 自定义 tooltip 内容框
        // onChange(obj) {
        //   console.log(obj)
        //   const tooltipItems = obj.items;
        //   const map = {};
        //   let thisTip = [];
        //   that.data.selectedPollutants.map(function(item, index) {
        //     let thisData = tooltipItems.filter(m => m.name == item.name);
        //     if (thisData && thisData.length > 0) {
        //       let {
        //         origin
        //       } = thisData[0];
        //       item.name = `${item.name}`;
        //       item.color = thisData[0].color;
        //       item.value = thisData[0].value;
        //       item.status = origin.Status;
        //     }
        //     thisTip.push(item);
        //   })
        //   that.setData({
        //     tipsData: thisTip
        //   });
        // }
      });
      chart.line().position('MonitorTime*Value').color('PollutantName', ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']);
      // chart.area().position('country*population');
      chart.interaction('pan', {
        limitRange: {
          x: {
            min: -100,
            max: 100
          }
        }
      });
      // chart.interaction('pinch', {
      //   maxScale: 5,
      //   minScale: 1
      // });
      chart.render();
      // 默认展示 tooltip
      if (data.length > 0) {
        var point = chart.getPosition(data[data.length - 1]); // 获取该数据的画布坐标
        chart.showTooltip(point); // 展示该点的 tooltip
      }

      return chart;
    })
  }
})