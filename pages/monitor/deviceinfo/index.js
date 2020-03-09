// pages/monitor/deviceinfo/index.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    resultData: null,
    dgimn: '',
    y: '',
    x: '',
    markers: [{
      iconPath: '',
      id: 0,
      latitude: 39.920000,
      longitude: 116.460000,
      width: 18,
      height: 35,
    }],
    isAuthor: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      let that = this;
      this.setData({
        isAuthor: app.isAuthor()
      });

      if (!that.data.isAuthor) {
        that.setData({
          resultData: {}
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        return;
      }
      wx.showNavigationBarLoading();
      wx.stopPullDownRefresh();
      this.getData();
    },
    //获取数据
    getData: function() {
      let that = this;
      var pointName = common.getStorage("PointName");


      const sdlMN = app.globalData.sdlMN.filter(m => m === common.getStorage('DGIMN'));
      if (sdlMN.length > 0) {
        app.getUserLocation(function(r) {
          if (r) {
            if (pointName != "") {
              wx.setNavigationBarTitle({
                title: pointName,
              })
            }
            comApi.getPointInfo().then(res => {
              if (res && res.IsSuccess) {
                if (res.Datas) {
                  let data = res.Datas;
                  //将数组中的某个字段拼接出来
                  var lo = "markers[" + 0 + "].longitude";
                  var la = "markers[" + 0 + "].latitude";

                  var yy = (data.Longitude).toString();
                  var xx = (data.Latitude).toString();

                  that.setData({
                    resultData: data,
                    [lo]: data.Longitude, //markers中的经度
                    [la]: data.Latitude, //markers中的纬度
                    y: yy, //经度
                    x: xx, //纬度
                  })
                }
              }
              wx.hideNavigationBarLoading();
            })
          }
          wx.hideNavigationBarLoading();
        })
      } else {
        if (pointName != "") {
          wx.setNavigationBarTitle({
            title: pointName,
          })
        }
        comApi.getPointInfo().then(res => {
          if (res && res.IsSuccess) {
            if (res.Datas) {
              let data = res.Datas;
              //将数组中的某个字段拼接出来
              var lo = "markers[" + 0 + "].longitude";
              var la = "markers[" + 0 + "].latitude";

              var yy = (data.Longitude).toString();
              var xx = (data.Latitude).toString();

              that.setData({
                resultData: data,
                [lo]: data.Longitude, //markers中的经度
                [la]: data.Latitude, //markers中的纬度
                y: yy, //经度
                x: xx, //纬度
              })
            }
          }
          wx.hideNavigationBarLoading();
        })
      }


    },
    //拨打电话(环保专工)
    CallHBFZ(e) {
      var phone = e.currentTarget.id;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    //拨打电话(运维人员)
    CallOperation(e) {
      var phone = e.currentTarget.id;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    lookAddress: function() {
      wx.openLocation({
        longitude: Number(this.data.y),
        latitude: Number(this.data.x),
        name: this.data.resultData && common.getStorage("PointName"),
        address: this.data.resultData && this.data.resultData.PointAddress
      })
    },
    onShow: function() {
      let that = this;
      this.setData({
        isAuthor: app.isAuthor()
      });

      if (!that.data.isAuthor) {
        that.setData({
          resultData: {}
        });
        return;
      }
      app.isLogin(function(res) {
        if (!res) {
          that.setData({
            resultData: {}
          });
          return;
        } else {
          //登陆（或者扫描二维码）时已经把MN号码赋上，  ----目前时登陆赋上
          if (that.data.dgimn !== common.getStorage('DGIMN')) {
            that.setData({
              dgimn: common.getStorage('DGIMN')
            });
            that.onPullDownRefresh();
          }
        }
      })
    }
  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行")
      this.setData({
        dgimn: common.getStorage('DGIMN'),
        isAuthor: app.isAuthor()
      });
      this.data.isAuthor && this.onPullDownRefresh();
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function() {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function() {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function(size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }

  }

})