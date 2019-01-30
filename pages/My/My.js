//index.js

Page({
  data: {
    userInfo: {},
  },
  onLoad: function (options) {

    var userinfo = getApp().globalData.userInfo;
    console.log(userinfo);
    this.setData({
     userInfo: userinfo
   })
  }
 
})
