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
    isLast: false,
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
    onPullDownRefresh: function() {
      wx.showNavigationBarLoading();
      wx.stopPullDownRefresh();
      this.setData({
        pageindex: 1,
        pagesize: 10,
      });
      this.getData();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function(e) {
      if (!this.data.isLast) {
        this.setData({
          pageindex: ++this.data.pageindex
        });
        this.getData();
      } else {
        if (this.data.pageindex !== 1) {
          wx.showToast({
            title: '已经到最后了！',
            icon: 'none',
            duration: 1500
          })
        }

        // console.log("已经到最后了");
      }

    },
    getData: function() {
      this.data.conditionWhere.Group[0].Value = common.getStorage("DGIMN")
      var conditionWhere = JSON.stringify(this.data.conditionWhere);
      //获取通气操作记录数据
      comApi.getVentilationOperationRecord(this.data.pageindex, this.data.pagesize, conditionWhere).then(res => {
        if (res && res.IsSuccess) {
          if (res.Datas) {
            //如果返回的条数小于每页显示的个数或者无返回数据则下拉不刷新
            if (res.Datas.DataSource.length < this.data.pagesize || !res.Datas.DataSource) {
              this.setData({
                isLast: true
              })
            }
            else {
              this.setData({
                isLast: false
              })
            }
            //叠加数据
            this.setData({
              resultData: this.data.pageindex > 1 ? this.data.resultData.concat(res.Datas.DataSource) : res.Datas.DataSource
            })
          }
        }
        wx.hideNavigationBarLoading();
      });
    },
    navigateChart(e) {
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