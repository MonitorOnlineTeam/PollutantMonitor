// pages/realTimeData/flowChart/flowChart.js

// "pageOrientation": "landscape",
//   "navigationStyle": "custom"
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touch: {
      distance: 0,
      scale: 0.5,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    },
    scale: 0.5,
    // tantouwendu: '暂未上传',
    // guanxianwendu: '暂未上传',
    // zhilengwendu: '暂未上传',

    // lvxinxiacigenghuanshijian: '暂未上传',
    // lingqilvxinggenghuanshijian: '暂未上传',
    // quyangbenggenghuanshijian: '暂未上传',
    // rudongbenggenghuanshijian: '暂未上传',
    // guolvqigenghuanshijian: '暂未上传',

    // pituoguan: '暂未上传',
    // gognzuozhuangtai: '暂未上传',
    // cemsstauts: '暂未上传',
    // yeweizhi: '暂未上传',
    // jiezhifazhuangtai: '暂未上传',

    //图片路径
    imgageSrc: null,
    //钢气瓶压力
    gangqiping: null,
    //系统采样探头温度
    tantouwendu: null,
    //采样探头状态
    tamtoustate: null,
    //采样泵使用时间
    caiyangbengshijian: null,
    //标定组分标气测量值
    biaodingbiaoqizhi: null,
    //大气压
    daqiya: null,
    //制冷器温度
    zhilengqiwendu: null,
    //蠕动泵使用时间
    rudongbengshijian: null,
    //采样流量
    caiyangliuliang: null,
    //氧通道
    yangtongdao: null,
    //室内温度
    shineiwendu: null,
    //校准偏差值
    jiaozhunpiancha: null,
    //电磁阀累计使用次数
    diancifashijian: null,
    //标气浓度
    biaoqinongdu: null,
    //采样管线温度
    caiyanggaunxianwendu: null,

    //采样管线状态
    caiyangguanxianstate: null,
    //探头吹扫状态
    tantouchuisaostate: null,
    //废液桶状态
    feiyetongstate: null,
    //制冷器状态
    zhilengqistate: null,
    //蠕动泵状态
    rudongbengstate: null,
    //校准类别
    jiaozhunstate: null,
    //湿度报警
    shidustate: null,
    //温度，压力，流量（速）
    wylparam: [],
    //探头管线信息
    tantouguanxian: [],
    //颗粒物分析仪
    keliwuparam: [],
    //湿度仪
    shiduyi: [],
    //气态分析仪
    qitaiparam: [],
    //侧边显示
    modalVisite: 'none',
    showmodalstate: [],
    showmodalparam: [],
    showmodaldata: [],
    PointName: '',
    //站点类型
    pointType: 1,
    //voc分析仪
    vocparam: [],
    //汞分析仪
    hgparam: []
  },
  navigateBack() {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      PointName: common.getStorage('PointName')
    });
    // this.getData();
    this.getParamData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.isLogin();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: `/pages/realTimeData/flowChart/flowChart?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },
  hiddenModal: function () {
    this.setData({
      modalVisite: 'none'
    })
  },
  showModal: function (e) {
    var info = e.currentTarget.dataset.obj;
    if (info) {
      var modalVisite = 'none';
      if ((info.state && info.state.length > 0) || (info.param && info.param.length > 0) || (info.data && info.data.length > 0)) {
        modalVisite = 'display';
      }
      this.setData({
        showmodalstate: info.state ? info.state : [],
        showmodalparam: info.param ? info.param : [],
        showmodaldata: info.data ? info.data : [],
        modalVisite: modalVisite
      })
    }
  },
  getParamData: function () {
    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    var resultData = null;
    comApi.getProcessFlowChartStatus().then(res => {
      if (res && res.IsSuccess) {
        if (res.Datas) {

          var pointType = res.Datas.dataInfo ? res.Datas.dataInfo.equipmentType : 1;
          var imgageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point_wps.png";
          if (pointType == 1) {
            imgageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/point_wps.png";

          }
          else if (pointType == 2) {
            imgageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/vocpoint_wps.png";
          }
          else if (pointType == 3) {
            imgageSrc = "https://api.chsdl.net/NewWryWebProxy/images/smc/hgpoint_wps.png";
          }
          console.log(imgageSrc);
          this.setData({
            imgageSrc: imgageSrc,
            pointType: pointType ? pointType : 3
          })

          var paramstatusInfo = res.Datas.paramstatusInfo;
          var tantouparam, tantoustate, shiduyistate;
          if (paramstatusInfo) {
            var gangqipingInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33011";
            })
            var tantouwenduInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33003";
            })
            var caiyangbengshijianInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33007";
            })
            var biaodingbiaoqizhiInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33039";
            })
            var daqiyaInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33013";
            })
            var zhilengqiwenduInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33008";
            })
            var rudongbengshijianInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33010";
            })
            var caiyangliuliangInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33021";
            })
            var yangtongdaoInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33036";
            })
            var shineiwenduInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33012";
            })
            var jiaozhunpianchaInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33040";
            })
            var diancifashijianInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33014";
            })
            var biaoqinongduInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33038";
            })
            var caiyanggaunxianwenduInfo = paramstatusInfo.find(val => {
              return val.statecode == "i33038";
            })

            tantouparam = paramstatusInfo.filter(a => a.statecode == "i33003" || a.statecode == "i33001");
            this.setData({
              gangqiping: gangqipingInfo ? gangqipingInfo.value : null,
              tantouwendu: tantouwenduInfo ? tantouwenduInfo.value : null,
              caiyangbengshijian: caiyangbengshijianInfo ? caiyangbengshijianInfo.value : null,
              biaodingbiaoqizhi: biaodingbiaoqizhiInfo ? biaodingbiaoqizhiInfo.value : null,
              daqiya: daqiyaInfo ? daqiyaInfo.value : null,
              zhilengqiwendu: zhilengqiwenduInfo ? zhilengqiwenduInfo.value : null,
              rudongbengshijian: rudongbengshijianInfo ? rudongbengshijianInfo.value : null,
              caiyangliuliang: caiyangliuliangInfo ? caiyangliuliangInfo.value : null,
              yangtongdao: yangtongdaoInfo ? yangtongdaoInfo.value : null,
              shineiwendu: shineiwenduInfo ? shineiwenduInfo.value : null,
              jiaozhunpiancha: jiaozhunpianchaInfo ? jiaozhunpianchaInfo.value : null,
              diancifashijian: diancifashijianInfo ? diancifashijianInfo.value : null,
              biaoqinongdu: biaoqinongduInfo ? biaoqinongduInfo.value : null,
              caiyanggaunxianwendu: caiyanggaunxianwenduInfo ? caiyanggaunxianwenduInfo.value : null
            })
          }
          var stateInfo = res.Datas.stateInfo;
          if (stateInfo) {
            var tamtoustateInfo = stateInfo.find(val => {
              return val.code == "i12111";
            })
            var caiyangguanxianstateInfo = stateInfo.find(val => {
              return val.code == "i12110";
            })
            var tantouchuisaostateInfo = stateInfo.find(val => {
              return val.code == "i12105";
            })
            var feiyetongstateInfo = stateInfo.find(val => {
              return val.code == "i12115";
            })
            var zhilengqistateInfo = stateInfo.find(val => {
              return val.code == "i12109";
            })
            var rudongbengstateInfo = stateInfo.find(val => {
              return val.code == "i12116";
            })
            var jiaozhunstateInfo = stateInfo.find(val => {
              return val.code == "i12117";
            })
            var shidustateInfo = stateInfo.find(val => {
              return val.code == "i12102";
            })
            tantoustate = stateInfo.filter(a => a.code == "i12110" || a.code == "i12105");
            shiduyistate = stateInfo.filter(a => a.code == "i12102");
            this.setData({
              tamtoustate: tamtoustateInfo ? tamtoustateInfo.statename : null,
              caiyangguanxianstate: caiyangguanxianstateInfo ? caiyangguanxianstateInfo.statename : null,
              tantouchuisaostate: tantouchuisaostateInfo ? tantouchuisaostateInfo.statename : null,
              feiyetongstate: feiyetongstateInfo ? feiyetongstateInfo.statename : null,
              zhilengqistate: zhilengqistateInfo ? zhilengqistateInfo.statename : null,
              rudongbengstate: rudongbengstateInfo ? rudongbengstateInfo.statename : null,
              jiaozhunstate: jiaozhunstateInfo ? jiaozhunstateInfo.statename : null,
              shidustate: shidustateInfo ? shidustateInfo.statename : null
            })
          }
          var paramsInfo = res.Datas.paramsInfo;
          if (paramsInfo) {
            var wylparam = paramsInfo.filter(a => a.pollutantCode == "s02" || a.pollutantCode == "s07"
              || a.pollutantCode == "s08" || a.pollutantCode == "b02");

            var wyl = {
              data: wylparam
            }
            var tantouguanxian = {
              param: tantouparam,
              state: tantoustate,
            }
            var keliwuparam = paramsInfo.filter(a => a.pollutantCode == "01");
            var keliwu = {
              data: keliwuparam
            }
            var shiduyiparam = paramsInfo.filter(a => a.pollutantCode == "s05");
            var shiduyi = {
              data: shiduyiparam,
              state: shiduyistate,
            }
            var qitaiparam = paramsInfo.filter(a => a.pollutantCode == "02" || a.pollutantCode == "03");
            var qitai = {
              data: qitaiparam
            }
            var vocparam = paramsInfo.filter(a => a.pollutantCode == "a24088" || a.pollutantCode == "m005");
            var voc = {
              data: vocparam
            }
            var hgparam = paramsInfo.filter(a => a.pollutantCode == "a20057");
            var hg = {
              data: hgparam
            }
            this.setData({
              wylparam: wyl,
              tantouguanxian: tantouguanxian,
              keliwuparam: keliwu,
              shiduyi: shiduyi,
              qitaiparam: qitai,
              vocparam: voc,
              hgparam: hg
            })
          }
        }
      }
    })
  },
  //获取数据
  getData: function () {
    // var pointName = common.getStorage("PointName");
    // if (pointName != "") {
    //   wx.setNavigationBarTitle({
    //     title: pointName,
    //   })
    // }

    var pointName = common.getStorage("PointName");
    if (pointName) {
      wx.setNavigationBarTitle({
        title: pointName,
      })
    }
    var resultData = null;




    comApi.getProcessFlowChartStatus().then(res => {
      console.log('getProcessFlowChartStatus', res)
      if (res && res.IsSuccess) {
        if (res.Datas) {
          var $thisData = res.Datas;

          var stateNameInfo = $thisData.stateNameInfo;
          var operationInfo = $thisData.operationInfo;
          var stateInfo = $thisData.stateInfo;
          var paramstatusInfo = $thisData.paramstatusInfo

          this.setData({
            tantouwendu: !paramstatusInfo['i33003'] ? '暂未上传' : paramstatusInfo['i33003'] + '℃',
            guanxianwendu: !paramstatusInfo['i33001'] ? '暂未上传' : paramstatusInfo['i33001'] + '℃',
            zhilengwendu: !paramstatusInfo['i33002'] ? '暂未上传' : paramstatusInfo['i33002'] + '℃',

            lvxinxiacigenghuanshijian: moment(operationInfo['探头滤芯']).format('YYYY-MM-DD') || '暂未上传',
            lingqilvxinggenghuanshijian: moment(operationInfo['调节阀滤芯']).format('YYYY-MM-DD') || '暂未上传',
            quyangbenggenghuanshijian: moment(operationInfo['取样泵']).format('YYYY-MM-DD') || '暂未上传',
            rudongbenggenghuanshijian: moment(operationInfo['蠕动泵']).format('YYYY-MM-DD') || '暂未上传',
            guolvqigenghuanshijian: moment(operationInfo['过滤器']).format('YYYY-MM-DD') || '暂未上传',

            pituoguan: this.getValue(stateInfo, 'i12106')[0] || '暂未上传',
            pituoguanColor: (+(this.getValue(stateInfo, 'i12106')[1])) > 0 ? 'red' : '',
            gognzuozhuangtai: this.getValue(stateInfo, 'i12001')[0] || '暂未上传',
            gognzuozhuangtaiColor: (+(this.getValue(stateInfo, 'i12001')[1])) > 0 ? 'red' : '',
            cemsstauts: this.getValue(stateInfo, 'i12103')[0] || '暂未上传',
            cemsstautscolor: (+(this.getValue(stateInfo, 'i12103')[1])) > 0 ? 'red' : '',
            yeweizhi: paramstatusInfo['i33501'] || '暂未上传',
            jiezhifazhuangtai: this.getValue(stateInfo, 'i12104')[0] || '暂未上传',
            jiezhifazhuangtaicolor: (+(this.getValue(stateInfo, 'i12104')[1])) > 0 ? 'red' : '',
          })
        }
      }
      wx.hideNavigationBarLoading();
    })
  },
  getValue: function (data, obj) {
    //debugger
    if (!data[obj])
      return [undefined, undefined];
    return data[obj].split('_');
  }
})