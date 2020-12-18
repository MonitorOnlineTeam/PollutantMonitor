var app = getApp();
const comApi = app.api;
const common = app.common;
Page({
  data: {
    src: "",
    fengmian: "",
    videoSrc: "",
    who: "",
    openid: "",
    token: "",
    windowWidth: 0,
    trackshow: "重新认证",
    canvasshow: true,
    access_token: '',
    canClick: false,
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
    basics: 1,
  },

  onLoad() {
    var that = this
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })
    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    that.ctx = wx.createCameraContext()
    console.log("onLoad"),
      that.setData({
        openid: app.globalData.openid,
        token: app.globalData.token
      });

    // 每次更新access_token
    wx.request({
      url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + app.globalData.baiduapikey + "&client_secret=" + app.globalData.baidusecretkey,
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log(res.data.access_token);
        // app.globalData.access_token = res.data.access_token;
        that.setData({
          access_token: res.data.access_token
        });
      }
    })
    wx.hideLoading()
    that.openFace()
    that.timerOver()
  },

  onReady: function() {},



  face(e) {
    var that = this
 

    if (that.data.trackshow == "重新认证") {
      that.openFace()
      that.timerOver()
    }
  },

  openFace() {
    var that = this
    that.setData({
      canvasshow: true,
      trackshow: "认证中...",
      canClick: true,
    })
    // that.takePhoto()
    that.interval = setInterval(this.takePhoto, 2000)
  },

  //结束识别
  timerOver() {
    var that = this
    that.timeout = setTimeout(this.closeFace, 15000) //16s
  },

  closeFace() {
    var that = this
    clearInterval(that.interval)
    that.setData({
      canvasshow: false,
      trackshow: "重新认证",
      canClick: false,
    })
    wx.showModal({
      title: '提示',
      content: '未识别到人脸，请重新认证',
  
      confirmText:"重新认证",//默认是“确定”
      cancelText:"取消认证",//默认是“取消”
      success: function (res) {
        if (res.cancel) {
           //点击取消,默认隐藏弹框
        } else {
           //点击确定
           that.face()
        }
     },
    })
  },

  searchFace(path) {
    var that = this;
    clearInterval(that.interval)
    var auth = common.getStorage("AuthorCode");
    wx.uploadFile({
      // url:app.globalData.url.login,
      url: `https://api.chsdl.net/NewWryWebProxy/rest/PollutantSourceApi/UploadApi/FaceDetects?authorCode=${auth}`, header: {
        Accept: 'application/json',
        'Content-Type':  'application/json', //application/x-www-form-urlencoded
        'Authorization': `Bearer ${common.getStorage('AuthorCodeRSA')}`
      },
      // url: 'http://61.50.135.114:60064/rest/PollutantSourceApi/UploadApi/FaceDetects',
      filePath: path,
      formData: {
        DGIMN: common.getStorage("DGIMN")
      },
      name: 'file',
      success: (res) => {
        that.setData({
          canClick: false,
          trackshow: "重新认证",
        })
        wx.hideLoading();
        var data = res.data
        console.log(res)
        this.setData({
          logindisabled: false
        });

        var data = JSON.parse(res.data);
        if (data.IsSuccess) {


          common.setStorage("UserName", data.Datas.UserName);
          common.setStorage("EntName", data.Datas.EntName);
          common.setStorage("PointName", data.Datas.PointName);
          common.setStorage("OnlineStatus", data.Datas.OnlineStatus);
          common.setStorage("QCAStatus", data.Datas.QCAStatus);

          wx.redirectTo({
            url: '/pages/qca/opendoor/opendoor',
          })

        } else {
          wx.showModal({
            title: '提示',
            content:data.Message,
            duration: 1000,
           
            confirmText:"重新认证",//默认是“确定”
            cancelText:"取消认证",//默认是“取消”
            success: function (res) {
              if (res.cancel) {
                 //点击取消,默认隐藏弹框
              } else {
                 //点击确定
                that.face()
              }
           },
          })
        }


      },
      fail: (res) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content:'网络错误',
          showCancel:false,
         
        })
      }
    })
  },

  takePhoto() {
    console.log("takePhoto")
    var that = this
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function(resget) {
            takephonewidth = resget.width,
              takephoneheight = resget.height
          }
        })
        // console.log(takephonewidth, takephoneheight)
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: resfile => { //成功的回调
            // console.log('data:image/png;base64,' + res.data),
            wx.request({
              url: "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=" + that.data.access_token,
              data: {
                image: resfile.data,
                image_type: "BASE64",
                max_face_num: 10
              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function(resdetect) {
                console.log(resdetect.data);
                if (resdetect.data.error_code === 0) {
                  clearInterval(that.interval);
                  clearTimeout(that.timeout);
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  for (let j = 0; j < resdetect.data.result.face_num; j++) {
                    var cavansl = resdetect.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth
                    var cavanst = resdetect.data.result.face_list[j].location.top / takephoneheight * that.data.windowWidth
                    var cavansw = resdetect.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth
                    var cavansh = resdetect.data.result.face_list[j].location.height / takephoneheight * that.data.windowWidth
                    ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
                  }
                  wx.drawCanvas({
                    canvasId: 'canvas',
                    actions: ctx.getActions()
                  })
                  wx.showLoading({
                    title: '正在核验身份...',
                  })
                  //发送人脸检测接口 关闭人脸检测
                  // that.closeFace()
                  that.searchFace(res.tempImagePath)
                } else {
                  // //失败后再次调用
                  // that.takePhoto()
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  wx.drawCanvas({
                    canvasId: 'canvas',
                    actions: ctx.getActions()
                  })
                }
              },
              fail: (res) => {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content:'网络错误',
                  showCancel:false,
                 
                })
              }
            })

          }
        })
      }
    })
  },

  

  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      },
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        console.log(res)
        this.setData({
          fengmian: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
        console.log('startOver')
      }
    })
  },
  uploadRecord() {
    var that = this;
    wx.showLoading({
      title: '上传中',
    })
    //获取摄像头信息
    wx.request({
      url: app.globalData.urlHeader + '/login/cameralist',
      data: {
        openid: app.globalData.openid,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 0) {
          if (res.data.data.cameras == null) {
            wx.request({
              url: app.globalData.urlHeader + '/login/addcamera',
              data: {
                openid: app.globalData.openid,
                token: app.globalData.token,
                camera: "phone",
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                if (res.data.code === 0) {
                  console.log('添加成功')
                } else {
                  console.log(res.data.error)
                }
              }
            })
          } else {
            var cameras = res.data.data.cameras
            if (cameras.includes("phone")) {
              return false
            } else {
              wx.request({
                url: app.globalData.urlHeader + '/login/addcamera',
                data: {
                  openid: app.globalData.openid,
                  token: app.globalData.token,
                  camera: "phone"
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  if (res.data.code === 0) {
                    console.log('添加成功')
                  } else {
                    console.log(res.data.error)
                  }
                }
              })
            }
          }
        } else {
          wx.hideLoading()
          console.log('获取摄像头列表失败！' + res.data.error)
          wx.showToast({
            title: '获取摄像头列表失败！',
            image: '../../img/about.png',
            duration: 1000
          })

        }
      }
    })

    wx.uploadFile({
      url: app.globalData.urlHeader + '/upload',
      filePath: that.data.videoSrc,
      name: 'file',
      formData: {
        'cameraid': 'phone',
        'openid': app.globalData.openid,
        'token': app.globalData.token,
        'tag': 2
      },
      success: function(res) {
        console.log(res.data);
        var result = JSON.parse(res.data).data.filename
        console.log(result);
        wx.uploadFile({
          url: app.globalData.urlHeader + '/upload/fengmian',
          filePath: that.data.fengmian,
          name: 'file',
          formData: {
            'openid': app.globalData.openid,
            'token': app.globalData.token,
            'name': result
          },
          success(res) {
            console.log(res.data);
            that.setData({
                fengmian: "",
                videoSrc: ""
              }),
              wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function() {
              wx.switchTab({
                url: '../index/index'
              })
            }, 2000)

          },
          fail(res) {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              image: '../../img/about.png',
              duration: 2000
            })

          }
        })
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          image: '../../img/about.png',
          duration: 2000
        })

      }

    })
  },

  onUnload: function() {
    var that = this
    clearInterval(that.interval)
  },

  error(e) {
    console.log(e.detail)
  }

})