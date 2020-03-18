// pages/monitor/realtimedata1/home.js
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
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
    selectedRow: '-',
    pageBackgroundColor: 'white',
    identificationName: '', //异常详情
    identificationCode: '', //标识
    overMultiple: '', //超标倍数
    standValue: '',
    pointInfo: null,
    isShowContent: false,
    isShowInfo: false,
    DGIMN: '',
    dataInfo: null,
    imageSrc: null,
    isAuthor: false,
    dataitem: [],
    qr: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 验证是否为扫码进入系统
     */
    ValidateDGIMN: function(options) {
      let that = this;
      if (options && options.q) {
        app.wxLogin(function() {
          app.isValidateSdlUrl(options.q, function(res) {
            that.setData({
              qr: true
            });
            if (res) {
              //单独给雪迪龙展厅设备指定openId
              if (common.getStorage("OpenId_SDL")) {
                common.setStorage("OpenId", "13800138000"); //13800138000
                common.setStorage("PhoneCode", "13800138000"); //13800138000
                app.getUserInfo(options);
                that.onPullDownRefresh();
                return;
              } else {
                that.data.isAuthor && that.onPullDownRefresh();
              }
            }
          });
        });
      } else {
        that.data.isAuthor && that.onPullDownRefresh();
      }
    },

    /**
     * 刷新数据
     */
    onPullDownRefresh: function() {
      let that = this;
      this.setData({
        isAuthor: common.getStorage("IsLogin")
      });

      if (!that.data.isAuthor) {

        that.setData({
          dataitem: [],
          pointInfo: {},
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        return;
      }
      wx.showNavigationBarLoading();
      wx.stopPullDownRefresh();
      that.getData();
    },
    //获取数据
    getData: function() {
      var resultData = {
        dataitem: [],
        pointInfo: {},

      };
      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function(r) {
          if (r) {
            comApi.getProcessFlowChartStatus().then(res => {
              if (res && res.IsSuccess && res.Datas) {
                var pointType = res.Datas.dataInfo ? res.Datas.dataInfo.equipmentType : 1;
                var imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point.png";
                if (pointType == 1) {
                  imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point.png";

                } else if (pointType == 2) {
                  imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/vocpoint.png";
                } else if (pointType == 3) {
                  imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/hgpoint.png";
                }
                _this.setData({
                  dataInfo: res.Datas.paramsInfo,
                  imageSrc: imageSrc,
                })
              }
            })

            comApi.getRealTimeDataForPoint().then(res => {
              if (res && res.IsSuccess) {
                if (res.Datas) {
                  let data = res.Datas;
                  resultData.dataitem = data.dataitem || [];
                  resultData.pointInfo = data.pointInfo;
                }
              }
              _this.setData({
                dataitem: resultData.dataitem,
                pointInfo: resultData.pointInfo,
              })
              let pointName = resultData.pointInfo && resultData.pointInfo.pointName;
              pointName && wx.setNavigationBarTitle({
                title: pointName,
              });
              common.setStorage("PointName", pointName);
              pointName && wx.setNavigationBarTitle({
                title: pointName,
              });

              wx.hideNavigationBarLoading();
            })
          } else {

            wx.hideNavigationBarLoading();
          }
        })
      } else {
        comApi.getProcessFlowChartStatus().then(res => {
          if (res && res.IsSuccess && res.Datas) {

            var pointType = res.Datas.dataInfo ? res.Datas.dataInfo.equipmentType : 1;
            var imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point.png";
            if (pointType == 1) {
              imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point.png";

            } else if (pointType == 2) {
              imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/vocpoint.png";
            } else if (pointType == 3) {
              imageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/hgpoint.png";
            }
            _this.setData({
              dataInfo: res.Datas.paramsInfo,
              imageSrc: imageSrc,
            })
          }
        })

        comApi.getRealTimeDataForPoint().then(res => {
          if (res && res.IsSuccess) {
            if (res.Datas) {
              let data = res.Datas;
              resultData.dataitem = data.dataitem || [];
              resultData.pointInfo = data.pointInfo;
            }
          }
          _this.setData({
            dataitem: resultData.dataitem,
            pointInfo: resultData.pointInfo,
          })
          let pointName = resultData.pointInfo && resultData.pointInfo.pointName;
          pointName && wx.setNavigationBarTitle({
            title: pointName,
          });
          common.setStorage("PointName", pointName);
          pointName && wx.setNavigationBarTitle({
            title: pointName,
          });

          wx.hideNavigationBarLoading();
        })
      }

    },
    //超标异常时弹出窗口
    showModal(e) {
      let {
        pollutantCode,
        pollutantName,
        overMultiple,
        identificationName,
        identificationCode,
        standValue
      } = e.currentTarget.dataset.obj;
      if (identificationCode == "1") {
        this.setData({
          identificationCode: identificationCode,
          overMultiple: overMultiple,
          modalName: e.currentTarget.dataset.target,
          selectedRow: pollutantName,
          standValue: standValue
        })
      } else if (identificationCode == "-1") {
        this.setData({
          identificationCode: identificationCode,
          identificationName: identificationName,
          modalName: e.currentTarget.dataset.target,
          selectedRow: pollutantName
        })
      }
    },
    hideModal(e) {
      this.setData({
        modalName: null,
        selectedRow: '-'
      })
    },
    //点击页面横屏
    horizontalScreen: function() {

      let _this = this;
      const sdlMN = app.globalData.sdlMN.filter(m => m === this.data.DGIMN);
      if (sdlMN.length > 0) {
        app.getUserLocation(function(r) {
          if (r) {
            wx.navigateTo({
              url: '/pages/monitor/flowchart/index'
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/monitor/flowchart/index'
        })
      }
    },
    onShow: function() {
      let that = this;
      that.setData({
        isAuthor: common.getStorage("IsLogin")
      });
      if (!that.data.isAuthor) {
        that.setData({
          dataitem: [],
          pointInfo: {},
        })
        return;
      }

      app.isLogin(function(res) {
        if (!res) {
          that.setData({
            dataitem: [],
            pointInfo: {},
          })
        } else {
          if (that.data.DGIMN !== common.getStorage('DGIMN') || that.data.qr) {
            common.setStorage('selectedPollutants', "");
            common.setStorage('selectedDate', moment().format('YYYY-MM-DD HH:mm'));
            that.setData({
              DGIMN: common.getStorage('DGIMN'),
              qr: false
            });
            that.onPullDownRefresh();
          }
        }

      });
    }
  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      wx.showLoading({
        title: '正在加载',
      })
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      this.setData({
        DGIMN: common.getStorage('DGIMN'),
        isAuthor: common.getStorage("IsLogin")
      });
      console.log("在组件实例进入页面节点树时执行")
    },
    ready() {

      console.log("在组件在视图层布局完成后执行")
      wx.hideLoading();
      this.ValidateDGIMN({});
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