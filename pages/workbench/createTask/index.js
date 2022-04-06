// pages/workbench/createTask/index.js
import request from '../../../utils/request'
import moment from 'moment'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _airInfo: [],
    pointName: app.globalData.pointName,
    time: moment().format("YYYY-MM-DD"),
    taskType: {},
    selectAir: {},
  },
  // 获取空气站
  getOperationTargetList() {
    request.get({
      url: 'GetOperationTargetList',
      data: {
        targetType: 2
      },
    }).then(res => {
      this.data._airInfo = res.data.Datas.map(item => {
        return {
          name: item.Name,
          id: item.Id
        }
      });
    })
  },
  // 选择监测站
  onAirClick() {
    console.log('this.data._airInfo=', this.data._airInfo);
    let that = this;
    wx.lin.showActionSheet({
      title: "请选择监测点",
      itemList: this.data._airInfo,
      success(res) {
        that.setData({
          selectAir: res.item
        })
        console.log('success=', res)
      },
      fail(res) {
        console.log('fail=', res)
      }
    })
  },

  // 选择类型
  onTaskTypeClick() {
    const that = this;
    wx.lin.showActionSheet({
      title: '选择任务类型',
      itemList: [{
        name: '质控',
        id: 15
      }, {
        name: '运维',
        id: 17
      }],
      success(res) {
        console.log('success=', res)
        that.setData({
          taskType: res.item
        })
      },
      fail(res) {
        console.log('fail=', res)
      }
    })
  },
  // 选择监测点
  onPointClick() {
    wx.navigateTo({
      url: '/pages/workbench/selectAirList/index?monitorTargetId=' + this.data.selectAir.id,
    })
  },

  // 时间切换
  bindTimeChange(e) {
    console.log('aa=', e.detail.value);
    this.setData({
      time: e.detail.value
    })
  },

  // 备注
  onRemarkChange(e) {
    this.data._remark = e.detail.value;
  },

  onSubmit() {
    const {
      taskType,
      _remark,
      time,
      selectAir
    } = this.data;
    if (!selectAir.id) {
      wx.showToast({
        title: '请选择监测站!',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!app.globalData.dgimn) {
      wx.showToast({
        title: '请选择监测点!',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!taskType.id) {
      wx.showToast({
        title: '请选择任务类型!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    let entName = this.data.selectAir.name;
    if (app.globalData.OperationCompanyID != 1 && app.globalData.OperationName !== '自运维') {
      // 有运维单位
      entName = app.globalData.OperationName;
    }
    wx.showModal({
      title: '',
      content: `该监测点是否由《${entName}》运维，如果不是请联系管理员进行设置。`,
      success: (result) => {
        if (result.confirm) {
          this.AddTask();
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  // 创建任务
  AddTask() {
    if (this.data._flag === true) {
      return
    };
    const {
      taskType,
      _remark,
      time,
      selectAir
    } = this.data;
    request.post({
      url: 'AddTask',
      data: {
        "operationEntCode": selectAir.id,
        "ImplementDate": moment(time).format("YYYY-MM-DD HH:mm:ss"),
        "DGIMNs": app.globalData.dgimn,
        "taskFrom": "1",
        "remark": _remark,
        "RecordType": taskType.id,
        "operationsUserId": wx.getStorageSync('UserCode')
      },
    }).then(res => {
      wx.navigateBack({
        delta: 1
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOperationTargetList();
    console.log('globalData=', app.globalData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('globalData=', app.globalData);
    this.setData({
      pointName: app.globalData.pointName
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