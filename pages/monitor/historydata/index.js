// pages/monitor/historydata/index.js
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

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    opts: {
      lazyLoad: true
    },
    DGIMN: '',
    dataType: 0,
    selectedPollutants: [],
    chartDatas: [],
    selectedDate: '',
    tabList: ['分钟', '小时', '日', '月'],
    legendHeight: 8,
    tipsData: [],
    alarmSwitch: false,
    isAuthor: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      let that = this;
      this.setData({
        isAuthor: app.isAuthor()
      });

      if (!that.data.isAuthor) {
        wx.setNavigationBarTitle({
          title: '历史数据',
        })
        that.setData({
          chartDatas: [],
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        return;
      }
      wx.showNavigationBarLoading();
      wx.stopPullDownRefresh();
      that.getData();
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
      app.Islogin(function() {});
      let {
        selectedPollutant,
        dataType,
        selectedDate,
        selectedPollutants
      } = this.data;

      let pollutantCodes = [];
      let tipsData = [];
      selectedPollutants.map(function(item) {
        pollutantCodes.push(item.code);
        tipsData.push({
          name: `${item.name}`,
          color: item.color,
          value: item.value,
          status: item.Value,
          unit: item.unit
        });
      });
      if (selectedPollutants.length >= 3) {
        this.setData({
          legendHeight: 12,
          tipsData: tipsData
        });
      } else {
        this.setData({
          legendHeight: 8,
          tipsData: tipsData
        });
      }

      //debugger;
      let chartDatas = [];

      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === _this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function(r) {
          if (r) {
            var pointName = common.getStorage("PointName");
            if (pointName != "") {
              wx.setNavigationBarTitle({
                title: pointName,
              })
            }
            if (selectedPollutants.length == 0) {
              _this.setData({
                chartDatas: []
              });
              wx.showModal({
                title: '提示',
                content: '请先选择污染物',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/monitor/selectPollutant/selectPollutant'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              wx.hideNavigationBarLoading();
              return false;
            }
            comApi.getMonitorDatas(pollutantCodes.join(','), dataType, selectedDate).then(res => {
              console.log('getMonitorDatas', res);
              console.log('selectedPollutants', selectedPollutants);
              if (res && res.IsSuccess && res.Datas) {
                let thisData = res.Datas;

                thisData.map(function(itemD, index) {
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
                    //debugger;
                    let value = itemD[itemP.code];
                    if (value != null || value != undefined) {
                      value = (+itemD[itemP.code].toFixed(2));
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

              };
              wx.hideNavigationBarLoading();
              _this.setData({
                chartDatas: chartDatas
              });
              console.log(chartDatas);
              _this.chartComponent = _this.selectComponent('#line-dom');
              chartDatas.length > 0 && _this.initChart();

            })
          }
          wx.hideNavigationBarLoading();
        })
      } else {
        if (selectedPollutants.length == 0) {
          _this.setData({
            chartDatas: []
          });
          wx.showModal({
            title: '提示',
            content: '请先选择污染物',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/monitor/selectPollutant/selectPollutant'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          wx.hideNavigationBarLoading();
          return false;
        }
        var pointName = common.getStorage("PointName");
        if (pointName != "") {
          wx.setNavigationBarTitle({
            title: pointName,
          })
        }
        comApi.getMonitorDatas(pollutantCodes.join(','), dataType, selectedDate).then(res => {
          console.log('getMonitorDatas', res);
          console.log('selectedPollutants', selectedPollutants);
          if (res && res.IsSuccess && res.Datas) {
            let thisData = res.Datas;

            thisData.map(function(itemD, index) {
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
                //debugger;
                let value = itemD[itemP.code];
                if (value != null || value != undefined) {
                  value = (+itemD[itemP.code].toFixed(2));
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

          };
          wx.hideNavigationBarLoading();
          _this.setData({
            chartDatas: chartDatas
          });
          console.log(chartDatas);
          _this.chartComponent = _this.selectComponent('#line-dom');
          chartDatas.length > 0 && _this.initChart();

        })
      }

      wx.hideNavigationBarLoading();


    },
    initChart: function() {
      let that = this;
      let {
        selectedPollutants,
        dataType
      } = this.data;
      this.chartComponent.init((canvas, width, height, F2) => {
        const arr = that.data.chartDatas;
        const chart = new F2.Chart({
          el: canvas,
          width,
          height,
          padding: ['auto', 'auto', 'auto', 'auto']
        });
        chart.source(arr, {
          'MonitorTime': {
            // type: 'timeCat',
            // mask: selectTimeFormat[dataType].chartFormat,
            tickCount: 6,
            range: [0, 1]
          },
          'Value': {
            type: 'linear',
            tickCount: 7,
            formatter: function formatter(val) {
              return val.toFixed(2);
            }
          }
        });
        //chart.legend(false);
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
            //console.log(text);
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
        chart.tooltip({
          showXTip: true,
          // showTitle: true,
          layout: 'vertical',
          // showYTip: true,
          snap: true,
          showCrosshairs: true,
          onShow(obj) {
            let thisTip = [];
            if (obj.items.length > 0) {
              obj.items.map(function(item) {
                thisTip.push(item.origin);
              });
              that.setData({
                tipsData: thisTip
              });
            }
          }, // tooltip 显示时的回调函数
          onHide(obj) {

          }, // tooltip 隐藏时的回调函数
        });
        //chart.area().position('MonitorTime*Value').color('PollutantName', ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']);
        chart.line().position('MonitorTime*Value').color('PollutantName', ['#feac36', '#8de9c0', '#c79ef4', '#fd8593', '#9aabf7', '#97e3f1', '#f4a387']);
        chart.render();
        // 默认展示 tooltip
        if (arr.length > 0) {
          var point = chart.getPosition(arr[arr.length - 1]); // 获取该数据的画布坐标
          chart.showTooltip(point); // 展示该点的 tooltip
        }
        return chart;
      });
    },
    onChangeDate(e) {
      app.Islogin(function () { });
      if (!this.data.isAuthor) {

        return false;
      }
      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === _this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function (r) {
          if (r) {
            wx.navigateTo({
              url: '/pages/monitor/selectDateTime/selectDateTime?dataType=' + _this.data.dataType
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/monitor/selectDateTime/selectDateTime?dataType=' + _this.data.dataType
        })
      }

    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    horizontalScreen: function () {
      app.Islogin(function () { });
      if (!this.data.isAuthor) {

        return false;
      }
      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function (r) {
          if (r) {
            wx.navigateTo({
              url: '/pages/monitor/historyDataTransverse/historyDataTransverse'
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/monitor/historyDataTransverse/historyDataTransverse'
        })
      }



    },
    tabSelect(e) {
      // console.log(e);
      app.Islogin(function () { });
      if (!this.data.isAuthor) {
        return false;
      }
      this.setData({
        dataType: e.currentTarget.dataset.id,
        selectedDate: moment(common.getStorage('selectedDate')).format(selectTimeFormat[e.currentTarget.dataset.id].showFormat),
      })
      this.getData();
    },
    transverse() {


      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === _this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function (r) {
          if (r) {
            wx.navigateTo({
              url: '/pages/monitor/historyDataTransverse/historyDataTransverse'
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/monitor/historyDataTransverse/historyDataTransverse'
        })
      }

    },
    login: function () {
      app.Islogin(function () { });
    },
    goLogin: function () {
      app.goLogin();
    },
    onChangePollutant(e) {
      app.Islogin(function () { });
      if (!this.data.isAuthor) {

        return false;
      }
      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === _this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function (r) {
          if (r) {
            wx.navigateTo({
              url: '/pages/monitor/selectPollutant/selectPollutant'
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/monitor/selectPollutant/selectPollutant'
        })
      }
    }

  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行");
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
        selectedDate: selectedDate,
        isAuthor: app.isAuthor()
      });
      common.setStorage('selectedDate', selectedDate);

      this.data.isAuthor && this.onPullDownRefresh();
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function() {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function() {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function(size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }

  }

})