var util = require('../../../utils/util.js');
const app = getApp()
const comApi = app.api;
const common = app.common;

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgList: [
      "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=508387608,2848974022&fm=26&gp=0.jpg",
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3139953554,3011511497&fm=26&gp=0.jpg",
      "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1022109268,3759531978&fm=26&gp=0.jpg"
    ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // /**
    //  * 页面相关事件处理函数--监听用户下拉动作
    //  */
    // onPullDownRefresh: function () {
    //   wx.showNavigationBarLoading();
    //   wx.stopPullDownRefresh();
    //   this.setData({
    //     pageindex: 1,
    //     pagesize: 10,
    //   })
    //   //获取运维数据
    //   this.getData();
    // },
    // /**
    //  * 页面上拉触底事件的处理函数
    //  */
    // onReachBottom: function (e) {
    //   if (!this.data.isLast) {
    //     this.setData({
    //       pageindex: ++this.data.pageindex
    //     });
    //     this.getData();
    //   } else {
    //     if (this.data.pageindex !== 1) {
    //       wx.showToast({
    //         title: '已经到最后了！',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //     }
    //     // console.log("已经到最后了");
    //   }

    // },
    // dateChange: function (e) {
    //   var date = new Date(e.detail.value + "-01 00:00:00");
    //   var time = util.formatTimeGang(date);
    //   var convertToCapitalization = this.getMonths(date);
    //   this.setData({
    //     month: e.detail.value,
    //     time,
    //     convertToCapitalization: convertToCapitalization
    //   });
    //   //获取运维数据
    //   this.getData();
    // },
    // //获取月份对应的大写格式
    // getMonths: function (date) {
    //   var chinese = ['0', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    //   // var y = date.getFullYear().toString();
    //   var m = (date.getMonth() + 1).toString();
    //   // var d = date.getDate().toString();
    //   var result = "";
    //   // for (var i = 0; i < y.length; i++) {
    //   //   result += chinese[y.charAt(i)];
    //   // }
    //   // result += "年";
    //   if (m.length == 2) {
    //     if (m.charAt(0) == "1") {
    //       result += ("十" + chinese[m.charAt(1)] + "月份工单情况");
    //     }
    //   } else {
    //     result += (chinese[m.charAt(0)] + "月份工单情况");
    //   }
    //   // if (d.length == 2) {
    //   //   result += (chinese[d.charAt(0)] + "十" + chinese[m.charAt(1)] + "日");
    //   // } else {
    //   //   result += (chinese[d.charAt(0)] + "日");
    //   // }
    //   return result;
    // },
    // //获取运维数据
    // getData: function () {
    //   //获取运维数据
    //   comApi.getOperationLogList(common.getStorage("DGIMN"), this.data.time, this.data.pageindex, this.data.pagesize).then(res => {
    //     if (res && res.IsSuccess) {
    //       if (res.Datas) {
    //         //如果返回的条数小于每页显示的个数或者无返回数据则下拉不刷新
    //         if (res.Datas.FormList.length < this.data.pagesize || !res.Datas.FormList) {
    //           this.setData({
    //             isLast: true
    //           })
    //         }
    //         else {
    //           this.setData({
    //             isLast: false
    //           })
    //         }
    //         if (this.data.pageindex > 1) {
    //           res.Datas.FormList = this.data.resultData.FormList.concat(res.Datas.FormList)
    //         }
    //         //叠加数据
    //         this.setData({
    //           resultData: res.Datas
    //         })
    //       }
    //     }
    //     wx.hideNavigationBarLoading();
    //   });
    // },
    // showModal(e) {
    //   this.setData({
    //     modalName: e.currentTarget.dataset.target
    //   })
    // },
    // hideModal(e) {
    //   this.setData({
    //     modalName: null
    //   })
    // },
    // navigateForm(e) {
    //   wx.navigateTo({
    //     url: '/pages/opreation/operationform/operationform?taskid=' + e.currentTarget.dataset.taskid + "&typeid=" + e.currentTarget.dataset.typeid
    //   })
    // },

    //预览图片，放大预览
    preview(event) {
      console.log(event.currentTarget.dataset.src)
      let currentUrl = event.currentTarget.dataset.src
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.imgList // 需要预览的图片http链接列表
      })
    }
  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      // //获取当前月份
      // var timestamp = Date.parse(new Date());
      // var date = new Date(timestamp);
      // var time = util.formatTimeGang(new Date());
      // var convertToCapitalization = this.getMonths(date);
      // //获取年份  
      // var Y = date.getFullYear();
      // //获取月份  
      // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      // this.setData({
      //   month: Y + "-" + M,
      //   time,
      //   convertToCapitalization: convertToCapitalization
      // });
      // //请求数据
      // this.onPullDownRefresh();


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
      show: function () {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function () {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function (size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }

  }
})