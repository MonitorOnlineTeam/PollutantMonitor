// pages/authorCode/index.js
const app = getApp();
import request from '../../utils/request'
import { JSEncrypt } from '../../utils/jsencrypt.min';
const PUB_KEY =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsx1/cEpUmSwUwwPU0SciWcVK\n' +
    'mDORBGwSBjJg8SL2GrCMC1+Rwz81IsBSkhog7O+BiXEOk/5frE8ryZOpOm/3PmdW\n' +
    'imEORkTdS94MilEsk+6Ozd9GnAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC\n' +
    '894cUqq1aH9h44SwyQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorCode: '',
    isDemo:false,
  },
  bindHideKeyboard: function (e) {
    console.log('bindHideKeyboard e = ',e);
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onChangeAuthorCode(val) {
    console.log('onChangeAuthorCode val = ',val);
    this.setData({
      authorCode: val.detail.value
    });
  },

  // 获取系统菜单
  GetSysMenuByUserID() {
    // let tabBarList = [{
    //     "pagePath": "/pages/entAndAir/index",
    //     "iconPath": "/images/SSGY.png",
    //     "selectedIconPath": "/images/SSGY_Select.png",
    //     "text": "监控"
    //   },
    //   {
    //     "pagePath": "/pages/alarm/index",
    //     "iconPath": "/images/SJJK.png",
    //     "selectedIconPath": "/images/SJJK_Select.png",
    //     "text": "报警"
    //   },
    //   {
    //     "pagePath": "/pages/my/index",
    //     "text": "我的",
    //     "iconPath": "/images/WD.png",
    //     "selectedIconPath": "/images/WD_Select.png"
    //   }
    // ]
    let tabBarList = [{
      "pagePath": "/pages/entAndAir/index",
      "iconPath": "/images/SSGY.png",
      "selectedIconPath": "/images/SSGY_Select.png",
      "text": "监控"
    },
    {
      "pagePath": "/pages/alarmNew/alarmNew",
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

  // 验证是否注册
  isRegister() {
    console.log('isRegister');
    wx.login({
      success: res => {
        console.log('res = ',res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let wxcode = res.code
        wx.setStorageSync('wxcode', wxcode)
        request.get({
          url: 'SDLSMCIsRegister',
          data: {
            wxcode: wxcode,
            newPhone: ''
          },
          options: {
            hideLoading: true
          }
        }).then(result => {
          // 已注册
          console.log('result = ',result);
          wx.setStorageSync('OpenId', result.data.Datas.OpenId);
          wx.setStorageSync('Ticket', result.data.Datas.Ticket);
          wx.setStorageSync('Phone', result.data.Datas.Phone);
          wx.setStorageSync('UserCode', result.data.Datas.UserCode);
          app.globalData.token = 'Bearer ' + result.data.Datas.Ticket;
          app.globalData.Phone = result.data.Datas.Phone;
          app.globalData.userName = result.data.Datas.userName;
          console.log('welcome isRegister success')
          this.GetSysMenuByUserID();
          const MenuDatas = result.data.Datas.MenuDatas;
          console.log('MenuDatas = ',MenuDatas);
          let tabBarList = [];
          
        
          MenuDatas.map((item,index)=>{
            if (item.NavigateUrl == 'monitor') {
              tabBarList.push({
                "pagePath": "/pages/entAndAir/index",
                "iconPath": "/images/SSGY.png",
                "selectedIconPath": "/images/SSGY_Select.png",
                "text": "监控"
              });
              const pointMenu = item.children;
              let hasRealtimedata = false;
              let hasHistorydata = false;
              let hasOoperationorder = false;
              let hasEquipmentinfo = false;
              pointMenu.map((pointItem,pointMenuIndex)=>{
                console.log('pointItem = ',pointItem);
                if (pointItem.NavigateUrl == "equipmentinfo") {
                  hasEquipmentinfo = true;
                }
                if (pointItem.NavigateUrl == "realtimedata") {
                  hasRealtimedata = true;
                }
                if (pointItem.NavigateUrl == "historydata") {
                  hasHistorydata = true;
                }
                if (pointItem.NavigateUrl == "operationorder") {
                  hasOoperationorder = true;
                }
              });
              app.globalData.hasRealtimedata = hasRealtimedata;
              app.globalData.hasHistorydata = hasHistorydata;
              app.globalData.hasOoperationorder = hasOoperationorder;
              app.globalData.hasEquipmentinfo = hasEquipmentinfo;
            }
            if (item.NavigateUrl == 'alarm') {
              // tabBarList.push({
              //   "pagePath": "/pages/alarm/index",
              //   "iconPath": "/images/SJJK.png",
              //   "selectedIconPath": "/images/SJJK_Select.png",
              //   "text": "报警"
              // });
              tabBarList.push({
                "pagePath": "/pages/alarmNew/alarmNew",
                "iconPath": "/images/SJJK.png",
                "selectedIconPath": "/images/SJJK_Select.png",
                "text": "报警"
              });
            }
            if (item.NavigateUrl == 'myinfo') {
              tabBarList.push({
                "pagePath": "/pages/my/index",
                "text": "我的",
                "iconPath": "/images/WD.png",
                "selectedIconPath": "/images/WD_Select.png"
              });
              if (item.children&&item.children[0]
                &&item.children[0].NavigateUrl) {
                const headType = item.children[0].NavigateUrl;
                app.globalData.headType = headType;
              }
            }
            /**
             * {
                "pagePath": "/pages/qca/analyzerList/analyzerList",
                "iconPath": "/images/SJJK.png",
                "selectedIconPath": "/images/SJJK_Select.png",
                "text": "质控"
              },
             */
          });
          if (tabBarList.length == 0) {
            tabBarList.push({
              "pagePath": "/pages/my/index",
              "text": "我的",
              "iconPath": "/images/WD.png",
              "selectedIconPath": "/images/WD_Select.png"
            });
          }
          wx.setStorageSync('tabBarList', tabBarList);
          wx.switchTab({
            url: tabBarList[0].pagePath,
          })
          this.getTabBar().setData({
            selectedIndex: 0,
            list: tabBarList
          })
        }).catch(err => {
          console.log('err = ',err);
          wx.showToast({
            title: err.data.Message,
          })
          console.log('welcome isRegister err')
          console.log('err = ',err);
          if (err.statusCode == 404) {
            wx.redirectTo({
              url: '/pages/authorCode/index',
            })
          }else {
            // 未注册
            wx.redirectTo({
              url: '/pages/register/register',
            })
          }
        })
      }
    })
  },
  // isRegister() {
  //   console.log('isRegister');
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       console.log('res=', res);
  //       let wxcode = res.code
  //       wx.setStorageSync('wxcode', wxcode)
  //       request.get({
  //         url: 'SDLSMCIsRegister',
  //         data: {
  //           wxcode: wxcode,
  //           newPhone: ''
  //         },
  //         options: {
  //           hideToast: true
  //         }
  //       }).then(result => {
  //         console.log('success result = ',result);
  //         console.log('success Ticket = ',result.data.Datas.Ticket);
  //         // 已注册
  //         wx.setStorageSync('OpenId', result.data.Datas.OpenId);
  //         wx.setStorageSync('Ticket', result.data.Datas.Ticket);
  //         wx.setStorageSync('UserCode', result.data.Datas.UserCode);
  //         this.GetSysMenuByUserID();
  //       }).catch(err => {
  //         // 未注册
  //         // console.log('err=', err);
  //         // wx.showToast({999
  //         //   title: err.data.Message,
  //         // })
  //         wx.redirectTo({
  //           url: '/pages/register/register',
  //         })
  //       })
  //     }
  //   })
  // },

  validateAuthorCode: function () {
    console.log('validateAuthorCode');
    var authorcode = this.data.authorCode;
    console.log('authorcode = ',authorcode);
    console.log('this = ',this);
    console.log('authorcode.length = ',authorcode.length);
    if (authorcode.length != 5) {
      this.setData({
        message: '请输入5位数授权码'
      });
      return;
    }

    let cryptFirst = new JSEncrypt(); //创建RSA对象 
    cryptFirst.setPublicKey(PUB_KEY); //为RSA对象设置公钥；publicKey是你获取到的公钥，后台会提供的
    wx.setStorageSync('encryData', cryptFirst.encrypt(this.data.authorCode));

    wx.setStorageSync('authorCode', this.data.authorCode)
    let launchType = getApp().globalData.launchType
    if (launchType == 'demo'||launchType == 'singlePoint_demo') {
      wx.setStorageSync('launchType', launchType);
      this.demoRegister();
    } else {
      this.isRegister();
    }

    // request.getAuthorizationCode({
    //   url: 'http://172.16.9.53:6777/api'+this.data.authorCode+'/AppConfig.json',
    //   data: {
    //     "AuthCode":this.data.authorCode
    //   },
    //   options: {
    //     authorCode: this.data.authorCode
    //   }
    // }).then(result => {
    //   console.log('result = ',result);
    //   let res = result;
    //   if (res && res.statusCode == 200) {
    //     this.setData({
    //       message: '授权验证成功，正在跳转…',
    //       messageFlag: true
    //     });
    //     wx.setStorageSync('authorCode', this.data.authorCode)
    //     // wx.setStorageSync('CenterLatitude', res.Datas.CenterLatitude)
    //     // wx.setStorageSync('CenterLongitude', res.Datas.CenterLongitude)
    //     // wx.setStorageSync('ZoomLevel', res.Datas.ZoomLevel)
    //     let launchType = getApp().globalData.launchType
    //     if (launchType == 'demo'||launchType == 'singlePoint_demo') {
    //       wx.setStorageSync('launchType', launchType);
    //       this.demoRegister();
    //     } else {
    //       this.isRegister();
    //     }
    //   } else {
    //     this.setData({
    //       message: (res && res.Message) || '网络错误'
    //     });
    //   }
    // }).catch(err => {
    //   console.log('catch err = ',err);
    //   this.setData({
    //     message: '授权码错误或网络错误'
    //   });
    // }) 
  },
  /**
   * 演示注册
   */
  demoRegister() {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    let wxcode = '123456789'
    wx.setStorageSync('wxcode', wxcode)
    request.get({
      url: 'SDLSMCIsRegister',
      data: {
        wxcode: wxcode,
        newPhone: ''
      },
      options: {
        hideLoading: true
      }
    }).then(result => {
      // 已注册
      wx.setStorageSync('OpenId', '123456789');
      wx.setStorageSync('Ticket', result.data.Datas.Ticket);
      wx.setStorageSync('UserCode', result.data.Datas.UserCode);
      console.log('welcome isRegister success')
      this.GetSysMenuByUserID();
    }).catch(err => {
      // 演示账号配置成功后，不应该进入此页面
      // err.data.Message
      wx.showToast({
        title: '演示信息获取失败',
      })
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