const app = getApp()
const comApi = app.api;
const common = app.common;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    tabs: [],
    pointName:'',
    DGIMN:'',
    pointStatus:''
  },
  onSwiperChange(e) {
    //console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]

    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },
  onTabsChange(e) {
    //console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DGIMN: common.getStorage('DGIMN')
    });
    this.onPullDownRefresh();
    // this.setData({
    //   DGIMN: common.getStorage('DGIMN')
    // });
    // this.getData();
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
    // console.log('实时工艺DGIMN', common.getStorage('DGIMN'))
    // console.log('实时工艺DGIMN', this.data.DGIMN)
    if (!common.getStorage('IsHaveHistory')) {
      wx.showModal({
        title: '提示',
        content: '请先扫描设备二维码',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
      this.setData({
        DGIMN: common.getStorage('DGIMN')
      });
      this.onPullDownRefresh();
    }
    // if (common.getStorage('DGIMN') != this.data.DGIMN) {
    //   this.getData()
    // }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
* 下拉刷新
*/
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getData();
  },
  getData:function(){
    let so2 = {
      key: 'SO2分析仪',
      title: 'SO2分析仪',
      data: []
    };
    let nox = {
      key: 'NOX分析仪',
      title: 'NOX分析仪',
      data: []
    };
    let pm = {
      key: '烟气分析仪',
      title: '烟气分析仪',
      data: []
    };

    comApi.getProcessFlowChartStatus().then(res => {
      console.log('getProcessFlowChartStatus', res)
      if (res && res.IsSuccess) {
        if (res.Data) {
          var thisData = res.Data;
          var dataInfo = thisData.dataInfo;
          var tableCol = thisData.paramNameInfo;
          var tableValue = thisData.paramsInfo;
          for (var i = 0; i < tableCol.length; i++) {
            var model_zs01 = '';
            var model_zs02 = '';
            var model_zs03 = '';
            tableValue.map(function (items) {
              if (items.name == 'zs01_' + tableCol[i].code) {
                model_zs01 = items.value;
              }
              if (items.name == 'zs02_' + tableCol[i].code) {
                model_zs02 = items.value;
              }
              if (items.name == 'zs03_' + tableCol[i].code) {
                model_zs03 = items.value;
              }
            });
            so2.data.push({
              name: tableCol[i].name,
              value: model_zs02
            });
            nox.data.push({
              name: tableCol[i].name,
              value: model_zs03
            });
            pm.data.push({
              name: tableCol[i].name,
              value: model_zs01
            });

            // $("#yanqiTable tbody").append('<tr><td>' + item.name + '</td><td>' + model_zs01 + '</td></tr>');
            // $("#s2Table tbody").append('<tr><td>' + item.name + '</td><td>' + model_zs02 + '</td></tr>');
            // $("#x2Table tbody").append('<tr><td>' + item.name + '</td><td>' + model_zs03 + '</td></tr>');
          }
          this.setData({
            tabs: [so2, nox, pm],
            pointName: dataInfo.pointName,
            DGIMN: common.getStorage('DGIMN'),
            pointStatus: dataInfo.status == 1 ? '正常' : '异常'
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  }
})