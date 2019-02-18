const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    pointName: '',
    DGIMN: '',
    pointType: '',
    pointStatus: '',
    pointPFType: '',
    pointDiameter: '',
    pointHeight: '',
    longitude: 0.0,
    latitude: 0.0,
    operationName: '',
    pointAddress: '',
    fzUserName: ''
  },
  getCenterLocation: function() {
    
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
   
  },
  includePoints: function() {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap')

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(common.getStorage('DGIMN_New'))
    // console.log(this.data.DGIMN)
    console.log('排口详情DGIMN_New', common.getStorage('DGIMN_New'))
    console.log('排口详情DGIMN', this.data.DGIMN)
    if (common.getStorage('DGIMN_New')!=this.data.DGIMN){
      this.getData()
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
  ,
  /**
 * 下拉刷新
 */
  onPullDownRefresh: function () {

    wx.showNavigationBarLoading();

    wx.hideNavigationBarLoading();

    wx.stopPullDownRefresh();
  },
  getData:function(){
    comApi.getPointInfo().then(res => {
      //console.log('getPointInfo', res)
      if (res && res.IsSuccess) {
        if (res.Data.length > 0) {
          let data = res.Data[0];
          //console.log(this.data)
          this.setData({
            DGIMN: data.DGIMN,
            pointName: data.pointName,
            pointType: data.OutputType,
            pointStatus: data.pointstatus == 1 ? '正常' : '异常',
            pointPFType: data.pollutantTypeName,
            pointDiameter: data.OutputDiameter,
            pointHeight: data.OutputHigh,
            longitude: data.longitude,
            latitude: data.latitude,
            fzUserName: data.SWUserName,
            fzUserPhone: '138001380000',
            operationName: data.operationUserName,
            operationPhone: '18601364607',
            pointAddress: data.Address,
            markers: [{
              id: 1,
              latitude: data.latitude,
              longitude: data.longitude,
              name: 'T.I.T 创意园'
            }]
          })
          //console.log(this.data)
        } else {
          wx.showModal({
            title: '提示',
            content: '暂无数据，请重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
  
})