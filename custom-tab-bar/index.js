Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    selected: 0,
    list: [{
      "selectedIconPath": "/images/SSGY_Select.png",
      "iconPath": "/images/SSGY.png",
      "pagePath": "/pages/realTimeData/realTimeData",
      "text": "实时工艺"
    },
      {
        "selectedIconPath": "/images/SJJK_Select.png",
        "iconPath": "/images/SJJK.png",
        "pagePath": "/pages/dataMonitor/dataMonitor",
        "text": "历史数据"
      },
      {
        "selectedIconPath": "/images/SBXQ_Select.png",
        "iconPath": "/images/SBXQ.png",
        "pagePath": "/pages/deviceInfo/deviceInfo",
        "text": "设备信息"
      },
      {
        "selectedIconPath": "/images/WD_Select.png",
        "iconPath": "/images/WD.png",
        "pagePath": "/pages/historyData/historyData",
        "text": "我的"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const url = e.currentTarget.dataset.path
     console.log(e);
     this.setData({
       selected: e.currentTarget.dataset.index
     })
      wx.switchTab({
        url: url
      })
    }
  },
  pageLifetimes: {},
})