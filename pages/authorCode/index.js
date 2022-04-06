// pages/authorCode/index.js
const app = getApp();
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onChangeAuthorCode(val) {
    this.setData({
      authorCode: val.detail.value
    });
  },

  // 获取系统菜单
  GetSysMenuByUserID() {
    request.post({
      url: 'GetSysMenuByUserID',
      data: {
        menu_id: app.globalData.menuId,
      }
    }).then(result => {
      console.log('menuList=', result);
      let tabBarList = [{
          "pagePath": "/pages/entAndAir/index",
          "iconPath": "/images/SSGY.png",
          "selectedIconPath": "/images/SSGY_Select.png",
          "text": "监控"
        },
        {
          "pagePath": "/pages/map/index",
          "iconPath": "/images/map.png",
          "selectedIconPath": "/images/map_Select.png",
          "text": "地图"
        },
        {
          "pagePath": "/pages/analysis/index",
          "iconPath": "/images/SJJK.png",
          "selectedIconPath": "/images/SJJK_Select.png",
          "text": "分析"
        },
        {
          "pagePath": "/pages/my/index",
          "text": "我的",
          "iconPath": "/images/WD.png",
          "selectedIconPath": "/images/WD_Select.png"
        }
      ]
      if (result.data.Datas && result.data.Datas.length) {
        tabBarList = result.data.Datas.map(item => {
          return {
            "pagePath": item.parentUrl,
            "iconPath": `/images/${item.icon}.png`,
            "selectedIconPath": `/images/${item.icon}_Select.png`,
            "text": item.name
          }
        });
      }

      wx.setStorageSync('tabBarList', tabBarList);
      wx.switchTab({
        url: tabBarList[0].pagePath,
      })
    })
  },

  // 验证是否注册
  isRegister() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('res=', res);
        let wxcode = res.code
        wx.setStorageSync('wxcode', wxcode)
        request.get({
          url: 'SDLSMCIsRegister',
          data: {
            wxcode: wxcode,
            newPhone: ''
          },
          options: {
            hideToast: true
          }
        }).then(result => {
          // 已注册
          wx.setStorageSync('OpenId', result.data.Datas.OpenId);
          wx.setStorageSync('Ticket', result.data.Datas.Ticket);
          wx.setStorageSync('UserCode', result.data.Datas.UserCode);
          this.GetSysMenuByUserID();
        }).catch(err => {
          // 未注册
          console.log('err=', err);
          // wx.showToast({999
          //   title: err.data.Message,
          // })
          wx.redirectTo({
            url: '/pages/register/register',
          })
        })
      }
    })
  },

  validateAuthorCode: function () {
    var authorcode = this.data.authorCode;
    if (authorcode.length != 5) {
      this.setData({
        message: '请输入5位授权码'
      });
      return;
    }
    request.get({
      url: 'GetSystemConfigInfo',
      data: {},
      options: {
        authorCode: this.data.authorCode
      }
    }).then(result => {
      let res = result.data;
      if (res && res.IsSuccess) {
        this.setData({
          message: '授权验证成功，正在跳转…',
          messageFlag: true
        });
        wx.setStorageSync('authorCode', this.data.authorCode)
        wx.setStorageSync('CenterLatitude', res.Datas.CenterLatitude)
        wx.setStorageSync('CenterLongitude', res.Datas.CenterLongitude)
        wx.setStorageSync('ZoomLevel', res.Datas.ZoomLevel)
        this.isRegister();
        // setTimeout(function () {
        //   wx.reLaunch({
        //     url: '/pages/transit/index'
        //   })
        // }, 500)
      } else {
        console.log('res=', res);
        this.setData({
          message: (res && res.Message) || '网络错误'
        });
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