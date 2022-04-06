// pages/historyData/selectPollutant/selectPollutant.js
const app = getApp();
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },
  checkboxChange(e) {
    console.log('e=', e);
    const items = this.data.items;
    let length = items.filter(m => m.checked == true);
    var thisSelected = e.currentTarget.dataset.obj;

    if (length.length > 4 && !thisSelected.checked) {
      wx.showModal({
        title: '提示',
        content: '最多选择5个污染物',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }


    let newData = [];
    items.map(function (item, index) {
      if (item.code == thisSelected.code) {
        item.checked = !thisSelected.checked;
      }
      newData.push(item);
    });
    console.log('newData=', newData);
    this.setData({
      items: newData
    })
  },
  //获取污染物
  getPollutantList: function (callback) {
    request.post({
      url: 'GetPollutantList',
      data: {
        "DGIMN": wx.getStorageSync('dgimn'),
      }
    }).then(result => {
      let res = result.data;
      console.log('污染物', res);
      if (res && res.IsSuccess && res.Datas) {
        let thisData = res.Datas;
        let selectedPollutant = {};
        let pollutantNames = [];
        let pollutantNamesObject = [];

        let pollutantList = [];

        thisData.map(function (item, index) {
          pollutantList.push({
            code: item.pollutantCode,
            name: item.pollutantName,
            unit: item.unit,
            checked: false,
            color: '',
            value: '-'
          });
        })
        // wx.setStorageSync('Pollutants', pollutantList)
        // common.setStorage('Pollutants', pollutantList);
        let selectedPollutants = wx.getStorageSync('selectedPollutants');
        // let selectedPollutants = "";
        let newData = [];
        pollutantList.map(function (item, index) {
          if (selectedPollutants) {
            let that = selectedPollutants.filter(m => m.code == item.code);
            if (that.length > 0) {
              item.checked = true;
            }
          }
          newData.push(item);
        });
        console.log('pollutantList=', pollutantList);
        this.setData({
          items: pollutantList
        });
      }
    })
  },
  // 保存选中污染物
  onSaveSelectPoll() {
    const items = this.data.items;
    let length = items.filter(m => m.checked == true);
    if (length.length == 0) {
      wx.showModal({
        title: '提示',
        content: '最少选择一种污染物',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    wx.setStorageSync('selectedPollutants', length)
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app=", app);
    // var pointName = app.globalData.pointInfo.pointName;
    // if (pointName) {
    //   wx.setNavigationBarTitle({
    //     title: pointName,
    //   })
    // }
    this.getPollutantList();
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
    //app.isLogin();
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
    // return {
    //   path: `/pages/historyData/selectPollutant/selectPollutant?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    // }
  }
})