// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: wx.getStorageSync('tabBarList'),
    selectedIndex: wx.getStorageSync('selectedIndex') || 0,
    // list: [{
    //     "pagePath": "/pages/entAndAir/index",
    //     "iconPath": "/images/SSGY.png",
    //     "selectedIconPath": "/images/SSGY_Select.png",
    //     "text": "监控"
    //   },
    //   {
    //     "pagePath": "/pages/map/index",
    //     "iconPath": "/images/map.png",
    //     "selectedIconPath": "/images/map_Select.png",
    //     "text": "地图"
    //   },
    //   {
    //     "pagePath": "/pages/analysis/index",
    //     "iconPath": "/images/SJJK.png",
    //     "selectedIconPath": "/images/SJJK_Select.png",
    //     "text": "分析"
    //   },
    //   {
    //     "pagePath": "/pages/workbench/index",
    //     "iconPath": "/images/SBXQ.png",
    //     "selectedIconPath": "/images/SBXQ_Select.png",
    //     "text": "工作台"
    //   },
    //   {
    //     "pagePath": "/pages/my/index",
    //     "text": "我的",
    //     "iconPath": "/images/WD.png",
    //     "selectedIconPath": "/images/WD_Select.png"
    //   }
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabBarChange(e) {
      let index = e.detail.index;
      this.setData({
        selectedIndex: index
      })
      // wx.getStorageSync('selectedIndex')
      wx.setStorageSync('selectedIndex', index)
    }
  },
  // created() {
  //   console.log('tabBarList=',wx.getStorageSync('tabBarList'));
  // },
})