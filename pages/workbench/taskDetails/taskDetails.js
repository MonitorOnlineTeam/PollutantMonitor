// pages/workbench/taskDetails/taskDetails.js
import request from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskInfo: {},
    formList: [],
  },

  // 获取数据
  getData(taskID) {
    request.post({
      url: 'GetTaskDetails',
      data: {
        taskID,
      },
      options: {
        hideLoading: true
      }
    }).then(res => {
      // let formList = [];
      // if (res.data.Datas.length && res.data.Datas[0] && res.data.Datas[0].TaskLogList.length && res.data.Datas[0].TaskLogList[0]) {
      //   formList = res.data.Datas[0].TaskLogList[0].FormRecordList;
      // }
      let formList = res.data.Datas[0].TaskFormList.filter(item => {
        if (item.FormMainID) {
          return item;
        }
      })
      if (res.data.Datas.length) {
        this.data._description = res.data.Datas[0].TaskDescription
      }
      this.setData({
        taskInfo: res.data.Datas[0],
        formList: formList
      })
    })
  },

  // 添加表单 - 点击
  onCreateForm() {
    let TaskFormList = [];
    const {
      taskInfo
    } = this.data;
    if (taskInfo.TaskFormList && taskInfo.TaskFormList.length) {
      taskInfo.TaskFormList.map(item => {
        if (!item.FormMainID) {
          TaskFormList.push({
            name: item.CnName,
            typeID: item.TypeID,
            taskID: item.TaskID,
          })
        }

      })
    }
    wx.lin.showActionSheet({
      title: "选择表单类型",
      itemList: TaskFormList,
      success(res) {
        let url = "/pages/workbench/qualityControlForm/pollutantsList"
        if (res.item.typeID != '61') {
          url = "/pages/workbench/operationsForm/operationsForm"
        }
        // 跳转到 创建质控记录表或创建运维记录页面
        wx.navigateTo({
          url: `${url}?taskID=${res.item.taskID}&typeID=${res.item.typeID}`,
        })
      },
      fail(res) {
        // console.log('fail=', res)
      }
    })
  },

  // 表单点击事件
  onFormClick(e) {
    // console.log('e=', e);
    // return;
    const res = e.currentTarget.dataset;
    const readonly = this.data.taskInfo.TaskStatus == 3;
    // if (this.data.taskInfo.TaskStatus !== 3) {
    // 任务未结束
    let url = "/pages/workbench/qualityControlForm/pollutantsList"
    if (res.item.TypeID != '61') {
      url = "/pages/workbench/operationsForm/operationsForm"
    }
    // 跳转到 创建质控记录表或创建运维记录页面
    wx.navigateTo({
      url: `${url}?readonly=${readonly}&taskID=${res.item.TaskID}&typeID=${res.item.TypeID}`,
    })
    // } else {
    //   // 任务已结束
    // }
  },
  // 处理说明
  onDescChange(e) {
    const description = e.detail.value;
    this.data._description = description
  },

  // 暂存和结束任务
  onPostTask(e) {
    const IsComplete = e.currentTarget.dataset.complete;
    const {
      _description,
      taskInfo,
      formList
    } = this.data;
    if (IsComplete && !formList.length) {
      wx.showToast({
        title: '请添加表单',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!_description) {
      wx.showToast({
        title: '请输入处理说明',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    request.post({
      url: 'PostTask',
      data: {
        // "CheckUserID": wx.getStorageSync('UserCode'),
        "taskID": taskInfo.TaskID,
        "IsComplete": IsComplete,
        "description": _description,
        "longitude": 116.298168,
        "latitude": 39.96501,
      },
      options: {
        hideLoading: true
      }
    }).then(res => {
      let that = this;
      wx.showToast({
        title: '操作成功！',
        success() {
          that.getData(that.data._taskId);
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const taskID = options.taskID;
    this.data._taskId = options.taskID;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(this.data._taskId);
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