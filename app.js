// app.js
import request from './utils/request'
require('./common/runtime.js')
require('./common/vendor.js')
require('./common/main.js')

const api = require('./utils/api.js')
const common = require('./utils/common.js')
const util = require('./utils/util.js')

App({
  message: "网络请求失败，请重试",
  api: api,
  common: common,
  onLaunch() {
    var info = wx.getSystemInfoAsync();
    var deviceInfo = wx.getDeviceInfo();
    this.globalData.noSubscribe = true
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 判断是否登录
    let isLogin = wx.getStorageSync('Ticket');
    if (isLogin) {
      return;
    }
  },
  globalData: {
    headType:'head2',
    historyDataType:'chart',
    userAccount:'SDLCS05',
    userPwd:'13621018195',
    department:'污染源技术服务部',
    token:'',
    proxyCode:wx.getStorageSync('authorCode'),
    authorCode:'',
    launchType:'normal',
    menuId: '722ed7fd-6665-43b5-b39e-5fdafcd6ef99',
    userInfo: null,
    entAndPointList: [],
    airList: [],
    pointInfo: {},
    noSubscribe:true,
    screenHeight:1334,
    operationsVisible:false,
    hasRealtimedata:false,
    hasHistorydata:false,
    hasOoperationorder:false,
    hasEquipmentinfo:false,
    baiduapikey: "56K7zFtlgXr0MNZnXLPtcs5G",
    baidusecretkey: "LesGCxRX7qhK1PBbXI4zf54Pak7tBA0D",
  },
  checkSubscribe() {
    console.log('checkSubscribe');
    // wx.getSetting({withSubscriptions:true
    //   ,success:(res)=>{
    //   console.log('success = ',res);
    //   console.log(res.subscriptionsSetting)
    // }
    // ,fail:(res)=>{
    //   console.log('fail = ',res);
    // }})
    return this.globalData.noSubscribe
  },
  isQcaLogin: function(callback) {
    if (!common.getStorage("IsAuthor")) {
      wx.showModal({
        title: '提示',
        content: '请先授权后，再执行操作',
        showCancel: true,
        success(res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/qca/authorCode/authorCode'
            })
          }
        }
      })
      return;
    }

    
    callback();
  },
  Islogin: function(callback) {
    if (!common.getStorage("IsAuthor")) {
      wx.showModal({
        title: '提示',
        content: '请先授权后，再执行操作',
        showCancel: true,
        success(res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/qca/authorCode/authorCode'
            })
          }
        }
      })
      return;
    }
    callback();
  },
  isAuthor: function() {
    console.log('OpenId = ',common.getStorage('OpenId'));
    console.log('PhoneCode = ',common.getStorage('PhoneCode'));
    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
      return false;
    } else {
      return true;
    }
  },
  wxLogin: function(callback) {
    // 微信登录
    wx.login({
      success: res => {
        common.setStorage("WxCode", res.code);
        console.log('WxCode=', res.code);
        callback && callback();
      }
    })
  },
  isLogin: function() {

    if (!common.getStorage('OpenId') || !common.getStorage("PhoneCode")) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      common.setStorage("IsShare", true);
      return;
    } else {
      common.setStorage("IsShare", false);
    }
  },
})