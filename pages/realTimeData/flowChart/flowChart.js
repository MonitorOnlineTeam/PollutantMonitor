// pages/realTimeData/flowChart/flowChart.js

// "pageOrientation": "landscape",
//   "navigationStyle": "custom"
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touch: {
      distance: 0,
      scale: 0.5,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    },
    scale: 0.5,
    tantouwendu: '暂未上传',
    guanxianwendu: '暂未上传',
    zhilengwendu: '暂未上传',

    lvxinxiacigenghuanshijian: '暂未上传',
    lingqilvxinggenghuanshijian: '暂未上传',
    quyangbenggenghuanshijian: '暂未上传',
    rudongbenggenghuanshijian: '暂未上传',
    guolvqigenghuanshijian: '暂未上传',

    pituoguan: '暂未上传',
    gognzuozhuangtai: '暂未上传',
    cemsstauts: '暂未上传',
    yeweizhi: '暂未上传',
    jiezhifazhuangtai: '暂未上传',
    PointName:''
  },
  navigateBack() {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      PointName: common.getStorage('PointName')
    });
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
  //获取数据
  getData: function() {
    // var pointName = common.getStorage("PointName");
    // if (pointName != "") {
    //   wx.setNavigationBarTitle({
    //     title: pointName,
    //   })
    // }
    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    var resultData = null;
    comApi.getProcessFlowChartStatus().then(res => {
      console.log('getProcessFlowChartStatus', res)
      if (res && res.IsSuccess) {
        if (res.Data) {
          var $thisData = res.Data;

          var stateNameInfo = $thisData.stateNameInfo;
          var operationInfo = $thisData.operationInfo;
          var stateInfo = $thisData.stateInfo;
          var paramstatusInfo = $thisData.paramstatusInfo

          this.setData({
            tantouwendu: !paramstatusInfo['i33003'] ? '暂未上传' : paramstatusInfo['i33003'] + '℃',
            guanxianwendu: !paramstatusInfo['i33001'] ? '暂未上传' : paramstatusInfo['i33001'] + '℃',
            zhilengwendu: !paramstatusInfo['i33002'] ? '暂未上传' : paramstatusInfo['i33002'] + '℃',

            lvxinxiacigenghuanshijian: moment(operationInfo['探头滤芯']).format('YYYY-MM-DD') || '暂未上传',
            lingqilvxinggenghuanshijian: moment(operationInfo['调节阀滤芯']).format('YYYY-MM-DD') || '暂未上传',
            quyangbenggenghuanshijian: moment(operationInfo['取样泵']).format('YYYY-MM-DD') || '暂未上传',
            rudongbenggenghuanshijian: moment(operationInfo['蠕动泵']).format('YYYY-MM-DD') || '暂未上传',
            guolvqigenghuanshijian: moment(operationInfo['过滤器']).format('YYYY-MM-DD') || '暂未上传',

            pituoguan: this.getValue(stateInfo, 'i12106')[0] || '暂未上传',
            pituoguanColor: (+(this.getValue(stateInfo, 'i12106')[1])) > 0 ? 'red' : '',
            gognzuozhuangtai: this.getValue(stateInfo, 'i12001')[0] || '暂未上传',
            gognzuozhuangtaiColor: (+(this.getValue(stateInfo, 'i12001')[1])) > 0 ? 'red' : '',
            cemsstauts: this.getValue(stateInfo, 'i12103')[0] || '暂未上传',
            cemsstautscolor: (+(this.getValue(stateInfo, 'i12103')[1])) > 0 ? 'red' : '',
            yeweizhi: paramstatusInfo['i33501'] || '暂未上传',
            jiezhifazhuangtai: this.getValue(stateInfo, 'i12104')[0] || '暂未上传',
            jiezhifazhuangtaicolor: (+(this.getValue(stateInfo, 'i12104')[1])) > 0 ? 'red' : '',
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  },
  getValue: function(data, obj) {
    //debugger
    if (!data[obj])
      return [undefined,undefined];
    return data[obj].split('_');
  }
})