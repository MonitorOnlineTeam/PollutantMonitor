// pages/historyData/selectPollutant/selectPollutant.js
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({
  onShareAppMessage() {
    return {
      title: 'checkbox',
      path: 'page/component/pages/checkbox/checkbox'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },
  checkboxChange(e) {
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
    items.map(function(item, index) {
      if (item.code == thisSelected.code) {
        item.checked = !thisSelected.checked;
      }
      newData.push(item);
    });
    this.setData({
      items: newData
    })
  },
  navigateBack() {
    wx.navigateBack()
  },
  reloadData() {
    const items = this.data.items;
    let length = items.filter(m => m.checked == true);
    if (length.length==0)
    {
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
    common.setStorage('selectedPollutants', length);
    wx.switchTab({
      url: '/pages/historyData/home/home'
    })
  },
  //获取污染物
  getPollutantList: function(callback) {
    let cookiePollutant = common.getStorage('Pollutants');
    if (!cookiePollutant) {
      comApi.getPollutantList().then(res => {
        console.log('污染物', res);

        if (res && res.IsSuccess && res.Data) {
          let thisData = res.Data;
          let selectedPollutant = {};
          let pollutantNames = [];
          let pollutantNamesObject = [];

          let pollutantList = [];

          thisData.map(function(item, index) {
            pollutantList.push({
              code: item.pollutantCode,
              name: item.pollutantName,
              unit: item.unit,
              checked: false,
              color:'',
              value:'-'
            });
          })
          this.setData({
            items: pollutantList
          });
          common.setStorage('Pollutants', pollutantList);
        }
      });
    } else {
      let selectedPollutants = common.getStorage('selectedPollutants');
      let newData = [];
      cookiePollutant.map(function(item, index) {
        if (selectedPollutants) {
          let that = selectedPollutants.filter(m => m.code == item.code);
          if (that.length > 0) {
            item.checked = true;
          }
        }
        newData.push(item);
      });
      this.setData({
        items: newData
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    this.getPollutantList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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