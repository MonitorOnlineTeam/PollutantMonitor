// pages/qca/analyzerList/analyzerList.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    basicsList: [{
      icon: 'scan',
      name: '扫码质控仪'
    }, {
      icon: 'peoplefill',
      name: '人脸识别'
    }, {
      icon: 'unlock',
      name: '确认开锁'
    }, ],
    basics: 0,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // wx.connectSocket({
    //   url: 'ws://172.16.12.165:50080',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   protocols: []
    // })

    // wx.onSocketOpen(function(e) {
    //   console.log(e);
    // })

    let that = this;
    if (options && options.q) {
      app.wxLogin(function() {
        let url = decodeURIComponent(options.q);
        let substr = url.substr(url.lastIndexOf('/') + 1, url.length);
        console.log('substr', substr);
        if (substr && substr.indexOf('mn=') >= 0) {
          let mn = substr.split('=')[1];
          if (mn) {
            app.Islogin(function() {
             
            common.setStorage("DGIMN",mn); //'62020131jhdp02'
          
            wx.navigateTo({
              url: '/pages/qca/faceValidate/index'
            })
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '二维码识别无效'
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '二维码识别无效'
          })
        }
      });
    }
    //this.onPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userName: common.getStorage("UserName"),
      QCAMN: common.getStorage("QCAMN"),
      textareaBValue: ''
    });
    if (common.getStorage("UserName")) {
      
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.setData({
      pageIndex: 1,
      isLast: false
    });
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isLast) {
      this.setData({
        pageIndex: ++this.data.pageIndex
      });
      this.getData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getData: function() {
    if (!this.data.userName) {
      wx.hideNavigationBarLoading();
      return;
    }
    var that = this;
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    comApi.qcaGetAnalyzerInfoPage(pageIndex, pageSize).then(res => {
      console.log('res=', res);
      if (res && res.IsSuccess) {
        var thisData = res.Datas;

        if (thisData.length < 15 || !thisData) {
          this.setData({
            isLast: true
          })
        }
        this.setData({
          list: pageIndex > 1 ? that.data.list.concat(thisData) : thisData,
          total: res.Total
        })

      } else {
        wx.showModal({
          title: '提示',
          content: (res && res.Message) || '网络错误',
          showCancel: false,
          success(res) {}
        })
      }
      wx.hideNavigationBarLoading();
    });
  },
  reAuth :function(){
    common.setStorage("IsAuthor", true); //13800138000
    wx.navigateTo({
      url: '/pages/qca/authorCode/authorCode'
    })
  },
  openScan: function() {
    let that = this;
    app.Islogin(function () {
      wx.scanCode({
        success(res) {
          console.log("res=", res);
          if (res.errMsg == 'scanCode:ok') {


            common.setStorage("DGIMN",res.result.split('mn=')[1]); //'62020131jhdp02'
          
            wx.navigateTo({
              url: '/pages/qca/faceValidate/index'
            })
          }

          //console.log(res)
        },
        fail: res => {
          // 接口调用失败
          //that.noQRMessage();
        }
      })
    })
     
  
  },
  noQRMessage: function() {
    wx.showToast({
      icon: 'none',
      title: '二维码识别无效'
    })
  },
  login: function() {
    app.Islogin(function() {


    });
  },
  openDoor: function(e) {
    return;
    console.log(e);
    let mn = e.currentTarget.dataset.qcamn;
    comApi.qcaValidataQCAMN(mn).then(res => {
      console.log('res=', res);
      if (res && res.IsSuccess) {
        common.setStorage("QCAMN", mn); //13800138000
        common.setStorage("QCAAddress", res.Datas.Address);
        common.setStorage("QCAName", res.Datas.QCAName);
        wx.navigateTo({
          url: '/pages/qca/opendoor/opendoor'
        })
      }
    });
  }
})