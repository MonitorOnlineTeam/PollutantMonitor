// pages/funcpage/index.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    //tabData: ['实时数据', '历史数据', '质控', '运维', '设备信息'],
    tabData: ['实时数据', '历史数据', '设备信息'],
    frist: true, //是否首次
    isOpt: false,
    isQCA: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('options=', options);

      if (!common.getStorage('DGIMN')) {
        wx.redirectTo({
          url: '/pages/home/index',
        })
      }
      common.setStorage("ApiType", 1);

      if (common.getStorage('IsShare')) {
        app.IsRegister(function(res) {
          if (!res) {
            that.setData({
              TabCur: -1
            });
          } else {

            that.setData({
              TabCur: +common.getStorage('ShareTabCur'),
              isOpt: common.getStorage('isOpt'),
              tabData: !common.getStorage('isOpt') ? ['实时数据', '历史数据', '设备信息'] : ['实时数据', '历史数据', '运维', '设备信息']
            });
          }
        });
      }

      that.myComponent = that.selectComponent('#myComponent');
      if (options && options.isOpt) {
        that.setData({
          isOpt: options.isOpt == 'false' ? false : true,
          tabData: options.isOpt == 'false' ? ['实时数据', '历史数据', '设备信息'] : ['实时数据', '历史数据', '运维', '设备信息']
        })
      }
    //this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  btnRegister: function() {
    wx.showModal({
      title: '提示',
      content: '请注册授权后，再执行操作',
      showCancel: true,
      success(res) {
        console.log(res);
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/register/register'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!common.getStorage('DGIMN')) {
      wx.redirectTo({
        url: '/pages/home/index',
      })
    }
    wx.setNavigationBarTitle({
      title: common.getStorage("PointName")
    });

    if (this.data.TabCur == -1 && common.getStorage('IsLogin')) {
      this.setData({
        TabCur: common.getStorage('ShareTabCur')
      });
    }

    var data = this.data;
    if (data.frist && !common.getStorage('IsShare'))
      return;

    let myComponent = this.myComponent;

    switch (data.TabCur) {
      case 0:
        myComponent.onShow();
        break;
      case 1:
        myComponent.onShow();
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        myComponent.onShow();
        break;
    }
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


    var data = this.data;
    if (data.TabCur == -1) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      wx.showModal({
        title: '提示',
        content: '请注册授权后，再执行操作',
        showCancel: true,
        success(res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/register/register'
            })
          }
        }
      })
    } else {
      let myComponent = this.myComponent;
      myComponent.onPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var data = this.data;

    let myComponent = this.myComponent;

    switch (data.TabCur) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        data.tabData.length > 3 && myComponent.onReachBottom();
        break;
      case 3:
        data.tabData.length > 3 && myComponent.onReachBottom();
        break;
      case 4:
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let selectedPollutants = common.getStorage('selectedPollutants');

    // if (typeof selectedPollutants == 'object') {
    //   selectedPollutants = JSON.stringify(selectedPollutants);
    // }
    var queryJson = {
      DGIMN: common.getStorage('DGIMN'),
      TabCur: this.data.TabCur,
      isOpt: this.data.isOpt,
      selectedPollutants: selectedPollutants || [],
      selectedDate: common.getStorage('selectedDate'),
      dataType: common.getStorage('dataType')
    };
    // wx.showModal({
    //   title: 'queryJson',
    //   content: JSON.stringify(queryJson),
    // })
    return {
      path: `/pages/funcpage/index?queryJson=${JSON.stringify(queryJson)}` // 路径，F传递参数到指定页面。
    }
  },
  tabSelect(e) {
    var that = this;
    app.IsRegister(function(res) {
      if (res) {
        var id = e.currentTarget.dataset.id;
        that.setData({
          TabCur: id,
          scrollLeft: (id - 1) * 60,
          frist: false
        });
        common.setStorage("ApiType", 1);
        that.myComponent = that.selectComponent('#myComponent');
      }
    })
  }
})