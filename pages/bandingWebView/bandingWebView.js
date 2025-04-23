// pages/bandingWebView/bandingWebView.js
import request from '../../utils/request'
const app = getApp();
const { unix } = require("moment");
// let drawQrcode = require("../../utils/weapp.qrcode.min.js");
let drawQrcode = require("../../utils/weapp.qrcode.js");
const myRichText = 
`初次使用
1.微信扫码关注公众号。
2.点击检查绑定，检查是否成功绑定公众号，完成绑定后，请勿取消关注公众号。
功能说明
1. 绑定后，可通过公众号接收系统发送的数据报警。
`;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'SDLCS05',
    password:app.globalData.Phone,
    department:'污染源技术服务部',
    token:'Bearer '+wx.getStorageSync('Ticket'),
    proxyCode:wx.getStorageSync('authorCode'),
    UserId:wx.getStorageSync('UserCode'),
    url:`http://101.200.164.233:56789?proxyCode=${wx.getStorageSync('authorCode')}&token=${'Bearer '+wx.getStorageSync('Ticket')}&userAccount=${'SDLCS05'}&userPwd=${'13621018195'}&department=${'污染源技术服务部'}&UserId=${wx.getStorageSync('UserCode')}`,
    myRichText,
    UserId:wx.getStorageSync('UserCode'),
    bandingStatus:'未测试'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('onLoad = ',this.data.token);
    console.log('onLoad = ',this.data.UserId);
    console.log('drawQrcode = ',drawQrcode);
    console.log('Ticket = ',wx.getStorageSync('Ticket'));
    console.log('UserCode = ',wx.getStorageSync('UserCode'));
    this.setData({
      password:app.globalData.Phone,
      UserId:wx.getStorageSync('UserCode'),
    });
    
  },
  /**
   * 监测绑定状态
   */
  checkBandingStatus(){
    request.post({
      url: 'GetUserOpenID',
      data: {
        "userID": this.data.UserId
      }
    }).then(res => {
      // 成功
      console.log('result = ',res);
      const data = res.data;
      if (res.statusCode == 200
        &&typeof data != 'undefined'&&data) {
          const Datas = data.Datas;
          if (typeof Datas == 'string'){
            if (Datas.length>0) {
              this.setData({
                bandingStatus:'已绑定'
              });
              // this.bindingState = '已绑定'
              // this.isCheckButtonDisabled = true;
              // this.isTestButtonDisabled = false;
              // uni.showToast({
              //   title:"已绑定",
              //   duration:2000
              // })
            } else {
              this.setData({
                bandingStatus:'未绑定'
              });
              // this.bindingState = '未绑定'
              // this.isCheckButtonDisabled = false;
              // this.isTestButtonDisabled = true;
              // uni.showToast({
              //   title:"未绑定",
              //   duration:2000
              // })
            }
          } else {
            this.setData({
              bandingStatus:'未测试1'
            });
            // this.bindingState = '未获取到绑定状态'
            // this.bindingState = ''
            // this.isCheckButtonDisabled = false;
            // this.isTestButtonDisabled = true;
            // uni.showToast({
            //   title:"请求结果错误",
            //   duration:2000
            // })
          }
        } else {
          this.setData({
            bandingStatus:'未测试2'
          });
          // uni.showToast({
          //   title:"请求错误",
          //   duration:2000
          // })
        }
    }).catch(err => {
      console.log('err = ',err);
      // 失败
      
    })
  },
  /**
   * 发送测试推送
   */
  TestPushWeChatInfo(){
    if (this.data.bandingStatus!='已绑定') {
      wx.showModal({
        title: '提示',
        content: '不是已绑定状态，无法测试',
        showCancel:false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
      // wx.showToast({
      //   title: '不是已绑定状态，无法测试',
      //   icon:'error',
      //   success() {
      //   }
      // })
      return;
    }
    request.post({
      url: 'TestPushWeChatInfo',
      data: {
        "userID": this.data.UserId
      }
    }).then(result => {
      // 成功
      wx.showToast({
        title: '测试消息发送成功',
        success() {
        }
      })
    }).catch(err => {
      wx.showToast({
        title: '测试消息发送失败',
        success() {
        }
      })
      console.log('err = ',err);
      // 失败
      
    })
  },
  UnbindWechat(){
    if (this.data.bandingStatus!='已绑定') {
      wx.showModal({
        title: '提示',
        content: '不是已绑定状态，无法解绑',
        showCancel:false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    request.post({
      url: 'UnbindWechat',
      data: {
        "userID":this.data.UserId
      }
    }).then(result => {
      // 成功
      wx.showToast({
        title: '解除绑定成功',
        success() {
        }
      })
      this.checkBandingStatus();
    }).catch(err => {
      wx.showToast({
        title: '解除绑定失败',
        success() {
        }
      })
      console.log('err = ',err);
      // 失败
      
    })
  },
  /**
   * 创建二维码
   */
  createCode() {
    console.log('password = ',this.data.password);
    console.log('password = ',this);
    console.log('app = ',app);
    var codeUrl = 'https://apa.chsdl.cn/GridWebApi/WeiXinOAuth/index.aspx?type=polluter&name='+app.globalData.userName+'&pwd='+app.globalData.Phone+'&department=污染源技术服务部'
    console.log('codeUrl = ',codeUrl);
    var that = this;
    var rSWidth = wx.getWindowInfo().screenWidth;
    var canvasWidth = rSWidth/750*380;
    drawQrcode({
      width: canvasWidth,
      height: canvasWidth,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      // text: 'https://github.com/yingye',
      // text: 'https://apa.chsdl.cn/GridWebApi/WeiXinOAuth/index.aspx?type=polluter&name=wechatUser&pwd=13621018195&department=污染源技术服务部',
      text:codeUrl,
      // v1.0.0+版本支持在二维码上绘制图片
      // ctx: wx.createCanvasContext('myQrcode'),
      // text: 'https://github.com/yingye',
      // v1.0.0+版本支持在二维码上绘制图片
      // image: {
      //      imageResource: '../../image/icon.png',
      //      dx: 70,
      //      dy: 70,
      //    dWidth: 60,
      //    dHeight: 60
      //  }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.createCode();
    // const query = wx.createSelectorQuery()
    // query.select('#myCanvas')
    //   .fields({ node: true, size: true })
    //   .exec((res) => {
    //     const canvas = res[0].node
    //     const ctx = canvas.getContext('2d')

    //     const dpr = wx.getSystemInfoSync().pixelRatio
    //     canvas.width = res[0].width * dpr
    //     canvas.height = res[0].height * dpr
    //     ctx.scale(dpr, dpr)

    //     ctx.fillRect(0, 0, 100, 100)
    //   })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.checkBandingStatus();
    this.createCode();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
  // ,
  // generateUQRCode(text){
  //   const qr = new UQRCode();
  //   qr.data = text;
  //   qr.size = 200;
  //   qr.make();
  //   // const ctx = uni.createCanvasContext('qrcode', this); // 组件内调用需传this，vue3 中 this 为 getCurrentInstance()?.proxy
  //   qr.canvasContext = ctx;
  //   qr.drawCanvas();
  // }
})