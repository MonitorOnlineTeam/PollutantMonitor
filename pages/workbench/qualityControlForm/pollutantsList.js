// pages/workbench/qualityControlForm/pollutantsList.js
import request from '../../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordData: {},
  },


  // 获取数据
  getData(data) {
    request.post({
      url: 'GetQualityRecordList',
      data: data,
    }).then(res => {
      this.data._formData = res.data.Datas;
      this.setData({
        recordData: res.data.Datas.Record
      })
    })
  },

  // 跳转到填写form页面
  onGotoHandleForm(e) {
    // console.log('e=', e);
    // return;
    const index = e.currentTarget.dataset.index;
    const qcFormData = {
      ...this.data._formData,
      Record: {
        ...this.data._formData.Record,
        RecordList: [this.data._formData.Record.RecordList[index]]
      }
    }
    app.globalData.qcFormData = qcFormData;


    wx.navigateTo({
      url: '/pages/workbench/qualityControlForm/qualityControlForm?readonly=' + this.data._options.readonly,
    })
  },

  // 删除质控表单
  DeleteQualityRecord() {
    request.post({
      url: 'DeleteQualityRecord',
      data: {
        DType: 1,
        FormMainID: this.data.recordData.ID,
      },
      options:{
        hideLoading: true
      }
    }).then(res => {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      wx.navigateBack({
        delta: 1
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options=', options);
    this.setData({
      readonly: options.readonly
    })
    this.data._options = options;
    // this.getData({
    //   TaskID: options.taskID,
    //   TypeID: options.typeID
    // });
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
    let options = this.data._options;
    console.log('options=', options);
    this.getData({
      TaskID: options.taskID,
      TypeID: options.typeID
    });
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