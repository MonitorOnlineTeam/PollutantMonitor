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
    month: "", //选中月份
    time: null, //选中时间字符串
    resultData: [], //返回数据
    convertToCapitalization: "", //月份对应的大写格式
    modalName: '', //弹出信息窗口
    mengShow: false, //蒙层的显示与否
    aniStyle: true, //动画效果，默认slideup  
    info: [
      '1.工单：运维人员去现场执行运维任务，派发的工作单；',
      '2.完成：运维人员完成了的工单；',
      '3.关闭：运维人员已经关闭的工单；',
      '4.执行中：运维人员正在处理的工单；',
      '5.待执行：运维人员还未处理的工单。'
    ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dateChange: function(e) {
      var date = new Date(e.detail.value + "-01 00:00:00");
      var time = util.formatTimeGang(date);
      var convertToCapitalization = this.getMonths(date);
      this.setData({
        month: e.detail.value,
        time,
        convertToCapitalization: convertToCapitalization
      });
      //获取运维数据
      this.getData();
    },
    //获取月份对应的大写格式
    getMonths: function(date) {
      var chinese = ['0', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      // var y = date.getFullYear().toString();
      var m = (date.getMonth() + 1).toString();
      // var d = date.getDate().toString();
      var result = "";
      // for (var i = 0; i < y.length; i++) {
      //   result += chinese[y.charAt(i)];
      // }
      // result += "年";
      if (m.length == 2) {
        if (m.charAt(0) == "1") {
          result += ("十" + chinese[m.charAt(1)] + "月份工单情况");
        }
      } else {
        result += (chinese[m.charAt(0)] + "月份工单情况");
      }
      // if (d.length == 2) {
      //   result += (chinese[d.charAt(0)] + "十" + chinese[m.charAt(1)] + "日");
      // } else {
      //   result += (chinese[d.charAt(0)] + "日");
      // }
      return result;
    },
    //获取运维数据
    getData: function() {
      //获取运维数据
      comApi.getOperationLogList(common.getStorage("DGIMN"), this.data.time).then(res => {
        if (res && res.IsSuccess) {
          if (res.Datas) {
            this.setData({
              resultData: res.Datas
            })
          }
        }
      });
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    navigateForm(e) {
      wx.navigateTo({
        url: '/pages/opreation/operationform/operationform?taskid=' + e.currentTarget.dataset.taskid + "&typeid=" + e.currentTarget.dataset.typeid
      })
    },
  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
      //获取当前月份
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      var time = util.formatTimeGang(new Date());
      var convertToCapitalization = this.getMonths(date);
      //获取年份  
      var Y = date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      this.setData({
        month: Y + "-" + M,
        time,
        convertToCapitalization: convertToCapitalization
      });
      //获取运维数据
      this.getData();


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