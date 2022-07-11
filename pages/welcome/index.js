// pages/welcome/index.js
const app = getApp();
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    directToPointDetail:false,
    launchType:'normal',
    dgimn:'',
    pollutanttype:''
  },

  // 获取系统菜单
  GetSysMenuByUserID() {
    // request.post({
    //   url: 'GetSysMenuByUserID',
    //   data: {
    //     menu_id: app.globalData.menuId,
    //   },
    //   options: {
    //     hideLoading: true
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
  // 验证是否注册
  isRegister() {
    wx.login({
      success: res => {
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
          wx.setStorageSync('OpenId', result.data.Datas.OpenId);
          wx.setStorageSync('Ticket', result.data.Datas.Ticket);
          wx.setStorageSync('UserCode', result.data.Datas.UserCode);
          // wx.requestSubscribeMessage({
          //   tmplIds: ['hy8oFHZ3uiV-QuCIczWMZw5gKrecC_unYLXVQwsiqgg'],
          //   success (res) { 
             
          //     console.log('requestSubscribeMessage success');
          //   },
          //   fail (errMsg,errCode) { 
          //     console.log('errMsg = ',errMsg,'errCode = ',errCode);
          //    }
          // })
          console.log('welcome isRegister success')
          this.GetSysMenuByUserID();
        }).catch(err => {
          console.log('welcome isRegister err')
          // 未注册
          wx.showToast({
            title: err.data.Message,
          })
          wx.redirectTo({
            url: '/pages/register/register',
          })
        })
      }
    })
  },

  init() {
    if (!wx.getStorageSync('authorCode') || !wx.getStorageSync('Ticket') || !wx.getStorageSync('OpenId')) {
      wx.redirectTo({
        url: '/pages/authorCode/index',
      })
    } else {
      this.isRegister();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    if (options.q) {
      let url = options.q;
      let alength  = url.length
      if (alength>0) {
        let strs = url.split('%2F')
        let alength = strs.length;
        if (strs[alength-1] == 'singlePoint') {
          // 保存项目类型
          getApp().globalData.launchType = 'singlePoint'
          wx.setStorageSync('launchType', 'singlePoint');
          const dgimn = strs[alength-3];
          const pollutanttype = strs[alength-2];
          this.setData({
            directToPointDetail:true,
            launchType:'singlePoint',
            dgimn,pollutanttype
          })
          wx.setStorageSync('dgimn', dgimn);
          wx.setStorageSync('pollutanttype', pollutanttype);
          app.globalData.pointInfo.dgimn = dgimn
        } else if (strs[alength-1] == 'demo') {
          // 保存项目类型
          wx.setStorageSync('launchType', 'demo');
          getApp().globalData.launchType = 'demo'
          this.setData({
            launchType:'demo',
          })
        } else {
          // 其他功能在onShow 中执行
          wx.setStorageSync('launchType', 'normal');
        }
      } else {
        // 其他功能在onShow 中执行
        wx.setStorageSync('launchType', 'normal');
      }
    } else {
      // 其他功能在onShow 中执行
      wx.setStorageSync('launchType', 'normal');
    }
    
    
    wx.getSystemInfo({//微信api，可以获取页面的信息
      success: (result) => {
        //   拿到当前设备的宽度和高度,单位为px
          let hiehgt=result.windowHeight
          let width=result.windowWidth;
        // px转rpx的转换比例
        let rpxRatdio=750/width //750为设计稿的宽度，width为刚才获取到的页面的宽度
        // 将获取到的px的高度转为rpx的高度
        let rpxHeight=rpxRatdio*hiehgt;
        getApp().globalData.screenHeight = rpxHeight
      },
      fail: (res) => {},
      complete: (res) => {},
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
    this.checkUpdate()
    if (this.data.launchType == 'singlePoint'&& this.data.directToPointDetail) {
      wx.login({
        success: res => {
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
            wx.setStorageSync('OpenId', result.data.Datas.OpenId);
            wx.setStorageSync('Ticket', result.data.Datas.Ticket);
            wx.setStorageSync('UserCode', result.data.Datas.UserCode);
            wx.navigateTo({
              url: '/pages/pointDetails/index?dgimn='+this.data.dgimn,
            })
            this.setData({
              directToPointDetail:false
            });
            this.GetSysMenuByUserID();
          }).catch(err => {
            console.log('welcome isRegister err')
            // 未注册
            wx.showToast({
              title: err.data.Message,
            })
            wx.redirectTo({
              url: '/pages/register/register',
            })
          })
        }
      })
        
    } else if (this.data.launchType == 'demo') {
      this.demoRegister();
    } else {
      this.init();
    }
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

  },

  checkUpdate: function () {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})