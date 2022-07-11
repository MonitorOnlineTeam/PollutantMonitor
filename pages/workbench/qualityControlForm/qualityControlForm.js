// pages/workbench/qualityControlForm/qualityControlForm.js
import request from '../../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    values: {
      IsQualified: 1
    },
    _sheetList: [],
    formData: {
      Record: {},
      QualityTypeList: []
    }
  },


  // 选择质控类型
  onSelectType() {
    let that = this;
    wx.lin.showActionSheet({
      title: "选择质控类型",
      itemList: this.data._sheetList,
      success(res) {
        let values = that.data.values;
        values.QualityType = res.item.id;
        values.QualityTypeName = res.item.name;
        that.setData({
          values
        })
      },
    })
  },

  // 相对误差
  onChangeErrValue(e) {
    let values = this.data.values;
    values.RelativeError = e.detail.value;
    this.setData({
      values
    })
  },

  // 是否合格
  onChangeIsQualified(e) {
    let values = this.data.values;
    values.IsQualified = e.detail.currentKey;
    this.setData({
      values
    })
  },

  // 选择时间
  onSelectDate() {
    wx.navigateTo({
      url: '/pages/date-picker/index?dataType=minute&key=qcDate',
    })
  },

  // 提交表单
  onSubmit() {
    const {
      values,
      formData
    } = this.data;
    // 校验
    if (!values.QualityType) {
      wx.showToast({
        title: '质控类型不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!values.RelativeError) {
      wx.showToast({
        title: '相对误差不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!values.QualityTime) {
      wx.showToast({
        title: '质控时间不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    const postData = {
      ...formData.Record,
      CreateUserID: wx.getStorageSync('UserCode'),
      RecordList: [{
        ...formData.Record.RecordList[0],
        ...values,
        IsWrite: 1,
        QualityItem: values.QualityItemID,
        QualityTypeName: undefined
      }]
    }
    this.AddQualityRecord(postData);
  },
  // 添加或修改质控表单
  AddQualityRecord(postData) {
    request.post({
      url: 'AddQualityRecord',
      data: postData,
    }).then(res => {
      wx.navigateBack({
        delta: 1
      });
    })
  },

  // 删除质控表单
  DeleteQualityRecord() {
    const formData = app.globalData.qcFormData;
    request.post({
      url: 'DeleteQualityRecord',
      data: {
        DType: 2,
        FormMainID: formData.Record.ID,
        ID: this.data.values.QualityItemID
      },
      options: {
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
    this.setData({
      readonly: options.readonly
    })
    const formData = app.globalData.qcFormData;
    const sheetList = formData.QualityTypeList.map(item => {
      return {
        name: item.Name,
        id: item.ChildID
      }
    })
    let IsQualified = formData.Record.RecordList[0].IsQualified || 1;
    this.setData({
      formData: formData,
      _sheetList: sheetList,
      values: {
        ...formData.Record.RecordList[0],
        QualityType: formData.Record.RecordList[0].QualityTypeId,
        IsQualified: IsQualified
      }
    })
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
    let qcDate = wx.getStorageSync('qcDate');
    // console.log('qcDate=', QualityTime);
    let values = this.data.values;
    values.QualityTime = qcDate;
    this.setData({
      values
    })
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