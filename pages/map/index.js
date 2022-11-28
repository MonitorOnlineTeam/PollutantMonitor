// pages/map/index.js
import request from '../../utils/request'
import {
  getTabBarSelectedIndex
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    airList: [],
    pointPollutantList: [],
    pointItemData: [],
    visible: false,
    showType: 'ent',
    entPointList: [],
    _pollutantTypeCodeList: [],
    centerLatitude: wx.getStorageSync('CenterLatitude'),
    centerLongitude: wx.getStorageSync('CenterLongitude'),
    zoom: wx.getStorageSync('ZoomLevel') || 12,
  },

  // 弹出层
  onPopupClick() {
    this.setData({
      visible: false
    })
  },

  // 显示类型切换
  onShowTypeChange(e) {
    console.log('e=', e);
    const showType = e.currentTarget.dataset.showType;
    if (this.data.showType == showType) {
      return;
    }
    if (showType === 'ent') {
      // 获取企业
      this.GetEntPointList();
    } else {
      // 空气站
      this.GetAirDetailAndDatas();
    }
    this.setData({
      showType
    })
  },

  // 根据污染物类型获取排口污染物列表
  GetPollutantTypeCode(pollutantTypes, DGIMN) {
    request.post({
      url: 'GetPollutantTypeCode',
      data: {
        pollutantTypes: pollutantTypes,
      }
    }).then(res => {
      if (res.data && res.data.IsSuccess) {
        this.data._pollutantTypeCodeList = res.data.Datas;
        this.AllTypeSummaryList(pollutantTypes, DGIMN);
      }
    })
  },

  // 获取企业排口数据
  AllTypeSummaryList(pollutantTypes, DGIMN) {
    request.post({
      url: 'AllTypeSummaryList',
      data: {
        DGIMNs: DGIMN,
        dataType: "HourData",
        isAirOrSite: false,
        isLastest: true,
        pollutantTypes: pollutantTypes,
      }
    }).then(res => {
      if (res.data && res.data.IsSuccess) {
        let pointItemData = {
          PointPollutantList: []
        };
        this.data._pollutantTypeCodeList.map(item => {
          res.data.Datas.map(itm => {
            if (itm[item.field] !== undefined) {
              pointItemData.MonitorTime = itm.MonitorTime;
              pointItemData.PointName = itm.abbreviation ? itm.abbreviation + ' - ' + itm.pointName : itm.pointName;
              pointItemData.PointPollutantList.push({
                PollutantName: item.name,
                value: itm[item.field],
                key: item.field,
                title: item.title,
                status: itm[item.field + "_params"] ? itm[item.field + "_params"].split("§")[0] : null,
                // level: itm[item.field + "_Level"],
                backgroundColor: itm[item.field + "_LevelColor"],
                // levelValue: itm[item.field + "_LevelValue"],
                unit: item.unit
                // ...itm,
              })
            }
          })
        })
        this.setData({
          pointItemData: pointItemData,
          visible: true
        })
      }
    })
  },

  // 排口点击事件
  onMarkerClick(e) {
    if (this.data.showType === 'air') {
      // 空气站
      let pointItemData = {};
      let pointInfo = this.data.airList[e.detail.markerId]
      console.log('pointInfo=', pointInfo);
      pointItemData = {
        MonitorTime: pointInfo.MonitorTime,
        PointName: pointInfo.PointName,
        PointPollutantList: [{
          PollutantName: "AQI",
          value: pointInfo.Data.AQI,
          backgroundColor: pointInfo.Data.AQI_backgroundColor,
          color: pointInfo.Data.AQI_backgroundColor,
        }],
      };
      pointInfo.PointPollutantList.map(item => {
        pointItemData.PointPollutantList.push({
          ...item,
          value: pointInfo.Data[item.PollutantCode],
          backgroundColor: pointInfo.Data[item.PollutantCode + "_backgroundColor"],
          color: pointInfo.Data[item.PollutantCode + "_color"],
        })
      })
      console.log('pointItemData=', pointItemData);
      this.setData({
        pointItemData: pointItemData,
        visible: true
      })
    } else {
      // 企业
      let PollutantType = this.data.entPointList[e.detail.markerId].PollutantType;
      let DGIMN = this.data.entPointList[e.detail.markerId].DGIMN;
      this.GetPollutantTypeCode(PollutantType, DGIMN);
    }

  },

  // 获取企业排口信息并更新markers
  GetEntPointList() {
    request.post({
      url: 'GetViewPoint',
      data: {
        // pollutantCode: '1,2',
      }
    }).then(res => {
      if (res.data && res.data.IsSuccess) {
        let filterList = res.data.Datas.PointList.filter(item => item.PollutantType != 5)
        let markers = filterList.map((item, index) => {
          let callout = [];
          return {
            id: index,
            latitude: item.PointLatitude,
            longitude: item.PointLongitude,
            // width: 20,
            // height: 6,
            width: 24,
            height: 24,
            iconPath: `/images/legend/${item.PollutantType}-${item.Status}.png`,
            // title: item.AQI,
            callout: {
              content: item.EntName + ' - ' + item.PointName,
              display: "ALWAYS",
              bgColor: "#fff",
              color: "#333",
              padding: 4,
              textAlign: 'center',
              borderWidth: 1,
              borderColor: item.Color !== '-' ? item.Color : '#ccc',
              borderRadius: 4,
              fontSize: 14,
            },
          }
        })
        console.log('markers=', markers);
        this.setData({
          markers: markers,
          entPointList: filterList,
        })
      }
    })
  },

  // 获取空气站排口信息
  GetAirDetailAndDatas() {
    request.post({
      url: 'GetAirDetailAndDatas',
      data: {}
    }).then(res => {
      if (res.data && res.data.IsSuccess) {
        let pointPollutantList = [];
        if (res.data.Datas && res.data.Datas[0].PointPollutantList) {
          // 污染物
          pointPollutantList = [{
              PollutantCode: "AQI",
              PollutantName: "AQI"
            },
            ...res.data.Datas[0].PointPollutantList
          ];
        }
        let markers = res.data.Datas.map((item, index) => {
          let callout = [];
          return {
            id: index,
            latitude: item.Latitude,
            longitude: item.Longitude,
            // width: 20,
            // height: 6,
            width: 24,
            height: 24,
            // alpha: 0,
            iconPath: "/images/air.png",
            // title: item.Data.AQI || '-',
            // label: {
            //   content: item.PointName,
            //   bgColor: "#fff",
            //   color: "#333",
            //   padding: 2,
            //   textAlign: 'center',
            //   borderWidth: 1,
            //   borderColor: item.Data.AQI_color !== '-' ? item.Data.AQI_color : '#ccc',
            //   borderRadius: 4,
            //   fontSize: 14,
            // },
            callout: {
              content: item.PointName + "：" + (item.Data.AQI ? item.Data.AQI : '--'),
              display: "ALWAYS",
              bgColor: "#ffffff",
              color: (item.Data.AQI_color && item.Data.AQI_color !== '-') ? item.Data.AQI_color : "#333",
              borderColor: (item.Data.AQI_color && item.Data.AQI_color !== '-') ? item.Data.AQI_color : '#ccc',
              borderWidth: 1,
              borderRadius: 4,
              padding: 6,
              textAlign: 'center',
              fontSize: 14,
            },
          }
        })
        this.setData({
          markers: markers,
          airList: res.data.Datas,
          pointPollutantList: pointPollutantList
        })
      }
    })
  },

  // 空气站污染物切换
  changeTabs(event) {
    console.log('event=', event);
    let activeKey = event.detail.activeKey;
    let markers = this.data.airList.map((item, index) => {
      return {
        id: index,
        latitude: item.Latitude,
        longitude: item.Longitude,
        // width: 20,
        // height: 6,
        width: 24,
        height: 24,
        iconPath: "/images/air.png",
        // alpha: 0,
        // iconPath: "/images/location.png",
        // title: item.Data.AQI || '-',
        // label: {
        //   content: item.PointName,
        //   bgColor: "#fff",
        //   color: "#333",
        //   padding: 2,
        //   textAlign: 'center',
        //   borderWidth: 1,
        //   borderColor: item.Data[activeKey + '_backgroundColor'] !== '-' ? item.Data[activeKey + '_backgroundColor'] : '#ccc',
        //   borderRadius: 4,
        //   fontSize: 14,
        // },
        callout: {
          content: item.PointName + "：" + (item.Data[activeKey] !== undefined ? item.Data[activeKey] : '--'),
          display: "ALWAYS",
          bgColor: "#ffffff",
          color: (item.Data[activeKey + '_backgroundColor'] && item.Data[activeKey + '_backgroundColor'] !== '-') ? item.Data[activeKey + '_backgroundColor'] : "#333",
          borderColor: (item.Data[activeKey + '_backgroundColor'] && item.Data[activeKey + '_backgroundColor'] !== '-') ? item.Data[activeKey + '_backgroundColor'] : '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          padding: 6,
          textAlign: 'center',
          fontSize: 14,
        },
        // callout: {
        //   content: item.Data[activeKey] || '--',
        //   // content: '1231',
        //   display: "ALWAYS",
        //   bgColor: (item.Data[activeKey + '_backgroundColor'] && item.Data[activeKey + '_backgroundColor'] !== '-') ? item.Data.AQI_color : "#fff",
        //   color: (item.Data[activeKey + '_backgroundColor'] && item.Data[activeKey + '_backgroundColor'] !== '-') ? "#fff" : '#333',
        //   padding: 4,
        //   textAlign: 'center',
        //   borderWidth: 1,
        //   borderRadius: 4,
        //   borderColor: '#ccc',
        //   fontSize: 14,
        // },
      }
    })
    this.setData({
      markers: markers,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.GetAirDetailAndDatas();
    this.GetEntPointList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selectedIndex = getTabBarSelectedIndex('/pages/map/index')
      this.getTabBar().setData({
        selectedIndex: selectedIndex
      })
    }
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