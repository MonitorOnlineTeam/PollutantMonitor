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
    showTabbar:true,
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

  updated: function () {
    console.log('custom-tab-bar updated');
    // 在组件更新时检查数据变化并刷新
    if (this.data.redDotVisible === false) {
        // 这里可以添加一些逻辑来刷新redDot的显示，比如重新渲染包含redDot的部分
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabBarChange(e) {
      console.log('this.data = ',this.data);
      let index = e.detail.index;
      console.log('e = ',e);
      console.log('index = ',index);
      if (typeof index != 'undefined') {
        this.setData({
          "selectedIndex": index
        })
        wx.setStorageSync('selectedIndex', index)
      }
      // wx.getStorageSync('selectedIndex')
      
    }
  },
  // created() {
  //   console.log('tabBarList=',wx.getStorageSync('tabBarList'));
  // },
})