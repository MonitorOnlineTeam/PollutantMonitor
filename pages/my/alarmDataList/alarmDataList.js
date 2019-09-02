// // pages/my/home/home.js
// const moment = require('../../../utils/moment.min.js');
// const app = getApp()
// const comApi = app.api;
// const common = app.common;
// Page({
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     alarmData: [],
//     beginTime: null,
//     endTime: null,
//     timeStr: '',
//     pollutantCodes: null,
//     dataType: null,
//     selectedDate: '',
//     alarmSwitch: false,
//     pageIndex: 1,
//     pageSize: 10,
//     isLast: false,
//     array: ['近三月', '近半年', '全年'],
//     selectedClass: '实时',
//     searchValue: ""
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//     const nowMinute = moment().format('mm');
//     const monitorTime = options.monitorTime; //接收是否为推送消息过来的数据
//     if (monitorTime) {
//       this.setData({
//         timeStr: monitorTime
//       })
//     } else {
//       this.setData({
//         beginTime: moment().add(-1, 'hour').format('YYYY-MM-DD HH:00:00'),
//         endTime: moment().format('YYYY-MM-DD HH:00:00')
//       })
//       this.setData({
//         timeStr: this.data.beginTime
//       })
//     }

//     //this.onPullDownRefresh();
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//     // let selectedDate;
//     // if (common.getStorage('alarmselectedDate')) {
//     //   selectedDate = moment(common.getStorage('alarmselectedDate')).format('YYYY-MM-DD HH:00:00');
//     // }
//     // if (selectedDate != null && this.data.selectedDate != selectedDate) {
//     //   this.setData({
//     //     selectedDate: selectedDate
//     //   })
//     //   this.onPullDownRefresh();
//     // }
//   },
//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   getAlarmDataList: function () {
//     //console.log(this.data);
//     let beginTime = this.data.beginTime; //"2019-08-19 00:04:32";
//     let endTime = this.data.endTime; //"2019-08-22 17:04:32";
//     // let beginTime = "2019-08-19 00:00:00";
//     // let endTime = "2019-08-22 15:00:00";
//     let pollutantCodes = "";
//     let dataType = "HourData";
//     let pageIndex = this.data.pageIndex;
//     let pageSize = this.data.pageSize;
//     let entName = this.data.searchValue;
//     //console.log(entName);
//     comApi.getAlarmDataList(entName, beginTime, endTime,
//       pollutantCodes, dataType, pageIndex, pageSize).then(res => {

//         let alarmData = [];
//         if (res && res.IsSuccess) {

//           var thisData = res.Data;
//           thisData.map(item => {
//             alarmData.push({
//               entName: item.abbreviation,
//               pointName: item.pointName,
//               pollutantName: item.pollutantName,
//               standardValue: item.standardValue,
//               monitorValue: item.value,
//               monitorTime: item.time
//             })
//           })
//           if (thisData.length < 10 || !thisData) {
//             this.setData({
//               isLast: true
//             })
//           }
//           this.setData({
//             alarmData: pageIndex > 1 ? this.data.alarmData.concat(alarmData) : alarmData
//           })
//         }
//         wx.hideNavigationBarLoading();

//       })

//   },
//   onReachBottom: function (e) {
//     // if (!this.data.isLast) {
//     //   this.setData({
//     //     pageIndex: ++this.data.pageIndex
//     //   });
//     //   this.getAlarmDataList();
//     // } else {
//     //   console.log("已经到最后了");
//     // }

//   },
//   onPullDownRefresh: function () {
//     wx.showNavigationBarLoading();
//     wx.stopPullDownRefresh();
//     this.setData({
//       pageIndex: 1
//     });
//     this.getAlarmDataList();
//   },
//   onTapDateChange: function (e) {
//     const nowMinute = moment().format('mm');
//     // console.log("e=",e);
//     let clickValue = e.target.dataset.name;
//     let beginTime = '';
//     let endTime = '';
//     switch (clickValue) {
//       case "实时":
//         beginTime = moment().add(-1, 'hour').format('YYYY-MM-DD HH:00:00');
//         endTime = moment().format('YYYY-MM-DD HH:00:00');
//         break;
//       case "当天":
//         beginTime = moment().format('YYYY-MM-DD 00:00:00');
//         endTime = moment().format('YYYY-MM-DD HH:00:00');
//         break;
//       case "近七天":
//         beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
//         endTime = moment().format('YYYY-MM-DD HH:00:00');
//         break;
//       case "本月":
//         beginTime = moment().format('YYYY-MM-01 00:00:00');
//         endTime = moment().format('YYYY-MM-DD HH:00:00');
//         break;
//       case "上月":
//         beginTime = moment().subtract(1, 'months').format('YYYY-MM-01 00:00:00');
//         endTime = moment(moment().format('YYYY-MM-01 00:00:00')).subtract(1, 'hours').format('YYYY-MM-DD 23:00:00');
//         break;
//       case "近三月":
//         beginTime = moment().subtract(3, 'months').format('YYYY-MM-01 00:00:00');
//         endTime = moment().format('YYYY-MM-DD HH:00:00');
//         break;
//       case "近半年":
//         break;
//       case "全年":
//         break;
//     };
//     this.setData({
//       beginTime: beginTime,
//       endTime: endTime,
//       timeStr: clickValue === "实时" ? beginTime : beginTime + ' ~ ' + endTime,
//       selectedClass: clickValue,
//       isLast: false
//     });
//     this.onPullDownRefresh();
//   },
//   doSearch: function (e) {
//     this.onPullDownRefresh();
//   },
//   entValueBind: function (e) {
//     this.setData({
//       searchValue: e.detail.value
//     });
//   },
//   clearValue: function () {
//     if (this.data.searchValue) {
//       this.setData({
//         searchValue: "",
//         isLast: false
//       });
//       this.onPullDownRefresh();
//     }
//   }

// })

const moment = require('../../../utils/moment.min.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alarmDate: "2019-07-25", //moment().format('YYYY-MM-DD'),
    selectedEntName: "",
    selectedEntCode: "",
    pageIndex: 1,
    pageSize: 10,
    alarmData: [],
    total: 0,
    typeColor: ['bg-orange', 'bg-olive', 'bg-blue'],
    entArray: [],
    objectEntArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //wx.authorize({ scope: "scope.userLocation" })
    // wx.getLocation({
    //   type: 'gcj02',
    //   async success(res) {

    //     const distance = util.VerifyCoordinate((res.latitude).toFixed(6), (res.longitude).toFixed(6));
    //     if (distance < 500) {
    //       //在距离内
    //     }

    //   },
    //   fail: function() {
    //     wx.showToast({
    //       title: '定位信息获取失败',
    //       icon: 'none',
    //       duration: 1000,
    //       mask: true
    //     })
    //   }
    // });

    //app.getUserLocation();
    this.setData({
      beginTime: this.data.alarmDate + " 00:00:00",
      endTime: this.data.alarmDate + " 23:59:59"
    });
    this.getEntList();
    this.onPullDownRefresh();
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
    this.setData({
      pageIndex: 1
    });

    this.getAlarmData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    if (!this.data.isLast) {
      this.setData({
        pageIndex: ++this.data.pageIndex
      });
      this.getAlarmData();
    } else {
      console.log("已经到最后了");
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getAlarmData: function() {
    let beginTime = this.data.beginTime; // "2019-07-25 00:00:00";
    let endTime = this.data.endTime; // "2019-07-26 00:00:00";
    let entCode = this.data.selectedEntCode;
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    comApi.getAlarmDataList(beginTime, endTime,
      entCode, pageIndex, pageSize).then(res => {
      let alarmData = [];
      if (res && res.IsSuccess) {

        var thisData = res.Data;

        thisData.map(item => {
          alarmData.push({
            DGIMN: item.DGIMN,
            PointName: item.PointName,
            AlarmTypText: item.AlarmTypText.split(',')
          })
        })
        if (thisData.length < 10 || !thisData) {
          this.setData({
            isLast: true
          })
        }
        this.setData({
          alarmData: pageIndex > 1 ? this.data.alarmData.concat(alarmData) : alarmData,
          total: res.Total
        })
      }
      wx.hideNavigationBarLoading();
    })
  },
  getEntList: function() {
    var that = this;
    comApi.getUserEntInfo().then(res => {
      if (res && res.IsSuccess && res.Data) {
        let thisData = res.Data;
        let entArray = [];
        let objectEntArray = [];
        thisData.map(function(item, index) {
          entArray.push(item.EntName);
          objectEntArray.push({
            id: item.EntCode,
            name: item.EntName
          });
          if (index == 0) {
            that.setData({
              selectedEntName: item.EntName,
              selectedEntCode: item.EntCode
            });
          }
        })

        this.setData({
          entArray: entArray,
          objectEntArray: objectEntArray
        });
      }
    });
  },
  queryDetails: function(e) {
    let mn = e.currentTarget.dataset.mn;
    wx.navigateTo({
      url: `../alarmDataDetails/alarmDataDetails?entCode=${this.data.selectedEntCode}&DGIMN=${mn}&beginTime=${this.data.beginTime}&endTime=${this.data.endTime}`,
    })
  },
  test: function() {
    app.getUserLocation();
  },
  bindEntChange: function(e) {
    console.log(e.detail);
    var data = this.data.objectEntArray[e.detail.value];
    this.setData({
      selectedEntName: data.name,
      selectedEntCode: data.id,
      pageIndex: 1
    });
    this.getAlarmData();
  },
  bindDateChange: function(e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({
      alarmDate: value,
      beginTime: value + " 00:00:00",
      endTime: value + " 23:59:59"
    });
    this.onPullDownRefresh();


  }
})