// pages/register/register.js
const app = getApp();
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajxtrue: false, //手机号验证标识
    Agreement: false,
    checkbox: false,
    _MobilePhone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   Agreement: common.getStorage('Agreement'),
    //   checkbox: common.getStorage('Agreement'),
    // });
  
  },
  checkboxChange: function (e) {
    this.setData({
      checkbox: e.detail.value.length
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
    this.setData({
      Agreement: this.data.checkbox
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
    return {
      path: `/pages/home11/index1` // 路径，传递参数到指定页面。
    }
  },
  // 获取系统菜单
  GetSysMenuByUserID() {
    // request.post({
    //   url: 'GetSysMenuByUserID',
    //   data: {
    //     menu_id: app.globalData.menuId,
    //   }
    // }).then(result => {
    //   console.log('menuList=', result);
    //   let tabBarList = result.data.Datas.map(item => {
    //     return {
    //       "pagePath": item.parentUrl,
    //       "iconPath": `/images/${item.icon}.png`,
    //       "selectedIconPath": `/images/${item.icon}_Select.png`,
    //       "text": item.name
    //     }
    //   });
    //   wx.setStorageSync('tabBarList', tabBarList);
    //   wx.switchTab({
    //     url: tabBarList[0].pagePath,
    //   })
    // })
    let tabBarList = [{
        "pagePath": "/pages/entAndAir/index",
        "iconPath": "/images/SSGY.png",
        "selectedIconPath": "/images/SSGY_Select.png",
        "text": "监控"
      },
      {
        "pagePath": "/pages/alarm/index",
        "iconPath": "/images/SJJK.png",
        "selectedIconPath": "/images/SJJK_Select.png",
        "text": "报警"
      },
      {
        "pagePath": "/pages/my/index",
        "text": "我的",
        "iconPath": "/images/WD.png",
        "selectedIconPath": "/images/WD_Select.png"
      }
    ]
    wx.setStorageSync('tabBarList', tabBarList);
    wx.switchTab({
      url: tabBarList[0].pagePath,
    })
  },

  /**
   * 表单提交
   */
  formSubmit: function (e) {
    if (this.data._MobilePhone.length == 0) {
      wx.showToast({
        title: '填写信息不能为空!',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (!this.data.ajxtrue) {
      wx.showToast({
        title: '请检查手机号!',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      if (!this.data.checkbox) {
        wx.showToast({
          // title: '请先勾选用户协议!',
          title: '请勾选阅读并接受用户监测数据许可协议!',
          icon: 'none',
          duration: 1500
        });
        return;
      }
    }
    wx.login({
      success: res => {
        // console.log(res);
        request.get({
          url: 'SDLSMCIsRegister',
          data: {
            wxcode: res.code,
            newPhone: this.data._MobilePhone
          }
        }).then(result => {
          // 已注册
          wx.setStorageSync('OpenId', result.data.Datas.OpenId);
          wx.setStorageSync('Ticket', result.data.Datas.Ticket);
          wx.setStorageSync('UserCode', result.data.Datas.UserCode);
          this.GetSysMenuByUserID();
        }).catch(err => {
          // 未注册
          // wx.setStorageSync('OpenId', err.data.Datas.OpenId)
          // wx.setStorageSync('Ticket', err.data.Datas.Ticket)
          // console.log('err=', err);
        })
      }
    })
  },
  // 手机号验证
  blurPhone: function (e) {
    let MobilePhone = e.detail.value;
    this.data._MobilePhone = MobilePhone;
    let that = this
    if (!(/^1[3456789]\d{9}$/.test(MobilePhone))) {
      this.setData({
        ajxtrue: false
      })
      if (MobilePhone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }
  },
  lookAgreement: function () {
    wx.navigateTo({
      url: '/pages/lookagreement/index',
    })
  }
})