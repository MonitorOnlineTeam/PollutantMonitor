// pages/workbench/operationsForm/operationsForm.js
import request from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      EquipmentStatusList: [],
      Record: {}
    },
    values: {},
    _deviceState: [],
  },
  // 是否合格
  onChangeIsFault(e) {
    let values = this.data.values;
    values.IsFault = e.detail.currentKey;
    this.setData({
      values
    })
  },
  // 状态选择
  onSelectStatus() {
    let that = this;
    wx.lin.showActionSheet({
      title: "请选择设备状态",
      itemList: this.data._deviceState,
      success(res) {
        let values = that.data.values;
        values.EquipmentStatus = res.item.id;
        values.EquipmentStatusName = res.item.name;
        that.setData({
          values
        })
      },
    })
  },
  // 告警问题
  onAlarmProblemInput(e) {
    let values = this.data.values;
    values.AlarmProblem = e.detail.value;
    this.setData({
      values
    })
  },

  // 处理方式
  onTreatmentMethodInput(e) {
    let values = this.data.values;
    values.TreatmentMethod = e.detail.value;
    this.setData({
      values
    })
  },

  // 维修内容
  onMaintenanceContentInput(e) {
    let values = this.data.values;
    values.MaintenanceContent = e.detail.value;
    this.setData({
      values
    })
  },

  onSubmit() {
    const {
      values,
      formData
    } = this.data;
    // 校验
    if (!values.IsFault) {
      wx.showToast({
        title: '请选择是否合格',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!values.EquipmentStatus) {
      wx.showToast({
        title: '请选择设备状态',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    const postData = {
      ...formData.Record,
      CreateUserID: wx.getStorageSync('UserCode'),
      RecordList: [{
        // ...formData.Record.RecordList[0],
        ...values,
        // IsWrite: 1,
        // QualityItem: values.QualityItemID,
        // QualityTypeName: undefined
      }]
    }
    this.AddOperationRecord(postData);
  },

  // 添加或修改运维表单
  AddOperationRecord(postData) {
    request.post({
      url: 'AddOperationRecord',
      data: postData,
    }).then(res => {
      wx.navigateBack({
        delta: 1
      });
    })
  },

  // 获取表单数据
  getData(data) {
    request.post({
      url: 'GetOperationRecordList',
      data: data,
    }).then(res => {
      const deviceState = res.data.Datas.EquipmentStatusList.map(item => {
        return {
          name: item.Name,
          id: item.ChildID
        }
      })
      this.setData({
        formData: res.data.Datas,
        _deviceState: deviceState,
        values: res.data.Datas.Record.RecordList.length ? res.data.Datas.Record.RecordList[0] : {
          IsFault: 1
        }
      })
    })
  },

  // 删除运维表单
  DeleteOperationRecord() {
    request.post({
      url: 'DeleteOperationRecord',
      data: {
        FormMainID: this.data.values.FormMainID
      },
    }).then(res => {
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        success() {
          wx.navigateBack({
            delta: 1,
          })
        }
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
    this.getData({
      TaskID: options.taskID,
      TypeID: options.typeID
    });
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