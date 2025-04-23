// pages/qca/changeGas/changeGas.js
const moment = require('../../../utils/moment.min.js');
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gasDatas: [],
    changeModalVisible: false,
    starDate: moment().format('YYYY-MM-DD'),
    clickData: {},
    gasInitPowerRequire: false,
    concentrationRequire: false,
    standardGasName:"",
    maxlength: 10,//通过maxlength属性限制输入两位小数
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    common.setStorage("QCAMN", "");
    wx.switchTab({
      url: '/pages/qca/analyzerList/analyzerList',
    })
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
  //加载页面数据
  getData: function() {
    var that = this;

    comApi.qcaGetStandardGasList().then(res => {
      console.log('res=', res);
      if (res && res.IsSuccess) {
        var datas = res.Datas;
        if (datas && datas.length > 0) {
          that.setData({
            gasDatas: datas
          });
        }
      } else {
        wx.showModal({
          title: '提示',
          content: (res && res.Message) || '网络错误',
          showCancel: false,
          success(res) {}
        })
      }
      wx.hideNavigationBarLoading();
    });
  },
  //更换按钮弹窗
  showChangeModal: function(e) {
    console.log('e=', e);
    var clickData = e.target.dataset.rowdata;
    var standardGasName = e.target.dataset.rowdata.StandardGasName;
    clickData.ExpirationDate = moment(clickData.ExpirationDate).format('YYYY-MM-DD');
    this.setData({
      changeModalVisible: true,
      clickData: clickData,
      concentrationRequire: false,
      gasInitPowerRequire: false,
      standardGasName: standardGasName,
    });
  },
  //隐藏弹窗
  hideChangeModal: function() {
    this.setData({
      changeModalVisible: false
    });
  },
  //选择日期
  bindDateChange: function(e) {
    var clickData = this.data.clickData;
    clickData[e.target.dataset.name] = e.detail.value;
    this.setData({
      clickData: clickData
    })
  },
  //input输入框事件
  bindInput: function(e) {
    console.log("e=", e);
    // let price = e.detail.value;
    // let maxlength = price.indexOf('.') + 3;
    // //为什么是2呢？没有小数点的时候indexOf('.')返回-1，-1+3=2，
    // //所以没有小数点的时候限制长度为50位，
    // //有小数点的话直接设置maxlength为 整数部分+小数点一位+两位小数,indexOf返回的是从0开始计算的索引，所以加3就是保留两位小数
    // if (maxlength == 2) {
    //   maxlength = 10;
    // }
    // this.setData({
    //   maxlength,
    //   price
    // })
    var clickData = this.data.clickData;
    clickData[e.target.dataset.name] = e.detail.value;

    this.setData({
      clickData: clickData
    });

  },
  //保存
  btnSave: function() {
    console.log('form=', this.data.clickData);
    var that = this;
    var data = that.data.clickData;

    that.setData({
      concentrationRequire: !data.Concentration
    });

    that.setData({
      gasInitPowerRequire: !data.GasInitPower
    });

    // if (!data.Concentration || !data.GasInitPower) {
    //   return;
    // }

    data.ExpirationDate = data.ExpirationDate + ' 23:59:59';
    comApi.qcaUpdateStandardGasList([data]).then(res => {
      console.log('res=', res);
      if (res && res.IsSuccess) {
        wx.showToast({
          title: '操作成功',
        });

        setTimeout(function() {
          that.setData({
            changeModalVisible: false
          });
          that.getData();
        }, 500)

      } else {
        wx.showModal({
          title: '提示',
          content: (res && res.Message) || '网络错误',
          showCancel: false,
          success(res) {}
        })
      }
    });
  }
})