// pages/qca/ventilationrecord/index.js
const app = getApp()
const comApi = app.api;
const common = app.common;

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true,
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
    pageindex: 1,
    pagesize: 10,
    resultData: [],
    conditionWhere: {
      Rel: "$and",
      Group: [{
        Key: "dbo.T_Bas_QCAnalyzerControlCommand.DGIMN",
        Value: "",
        Where: "$="
      }]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.data.conditionWhere.Group[0].Value = common.getStorage("DGIMN")
      var conditionWhere = JSON.stringify(this.data.conditionWhere);
      //获取通气操作记录数据
      comApi.getVentilationOperationRecord(this.data.pageindex, this.data.pagesize, conditionWhere).then(res => {
        if (res && res.IsSuccess) {
          if (res.Datas) {
            this.setData({
              resultData: res.Datas.DataSource
            })
          }
        }
      });
    },
    navigateChart(e) {
      debugger;
      wx.navigateTo({
        url: '/pages/qca/deviceqcadetails/index?dgimn=' + e.currentTarget.dataset.dgimn + "&pointname=" + e.currentTarget.dataset.pointname + "&qcacontrolresultid=" + e.currentTarget.dataset.qcacontrolresultid + "&qcamn=" + e.currentTarget.dataset.qcamn + "&qcanalyzercontrolcommandid=" + e.currentTarget.dataset.qcanalyzercontrolcommandid + "&qcanalyzerinfoid=" + e.currentTarget.dataset.qcanalyzerinfoid + "&qcaname=" + e.currentTarget.dataset.qcaname + "&qcexecutype=" + e.currentTarget.dataset.qcexecutype + "&qcexecutypename=" + e.currentTarget.dataset.qcexecutypename + "&qcresult=" + e.currentTarget.dataset.qcresult + "&qcresultname=" + e.currentTarget.dataset.qcresultname + "&qctime=" + e.currentTarget.dataset.qctime + "&qctype=" + e.currentTarget.dataset.qctype + "&qctypename=" + e.currentTarget.dataset.qctypename + "&standardpollutantcode=" + e.currentTarget.dataset.standardpollutantcode + "&standardpollutantname=" + e.currentTarget.dataset.standardpollutantname + "&stoptime=" + e.currentTarget.dataset.stoptime
      })
    },
  },

  /*组件生命周期*/
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() {
     this.onPullDownRefresh();
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