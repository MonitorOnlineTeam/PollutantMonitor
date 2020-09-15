//const URL = 'http://localhost:52198/rest/PollutantSourceApi'

// const URL = 'http://172.16.12.152:60060'
const URL = 'https://api.chsdl.net/NewWryWebProxy/rest/PollutantSourceApi';

const fetch = require('./fetch')
const common = require('./common.js')
const util = require('./util.js')
const moment = require('../utils/moment.min.js')
const authorCode = '48f3889c-af8d-401f-ada2-c383031af92d';
const sdlMN = ['0102030405060708090A0B0C0D0E0F10', '0202030405060708090A0B0C0D0E0F10', '0302030405060708090A0B0C0D0E0F10'];
const dataTypeObj = {
  0: 'realtime',
  1: 'minute',
  2: 'hour',
  3: 'day'
}
const pageUrl = {
  getOpenId: `WxServer/PostLogin?authorCode=${authorCode}`,
  validateFirstLogin: 'WxServer/ValidateFirstLogin',
  updateUserInfo: 'WxServer/UpdateUserInfo',
  getUserInfo: 'WxServer/GetUserInfo',
  getPointInfo: `WxServer/GetPointInfo?authorCode=${authorCode}`,
  getDeviceInfo: `WxServer/GetAnalyzerList?authorCode=${authorCode}`,
  getPollutant: `WxServer/GetPollutantList?authorCode=${authorCode}`,
  getMonitorData: `WxServer/GetMonitorDatas?authorCode=${authorCode}`,
  getProcessFlowChartStatus: `WxServer/GetProcessFlowChartStatus?authorCode=${authorCode}`,
  verifyDevicePwd: `WxServer/VerifyDevicePwd?authorCode=${authorCode}`,
  verifyPhone: `WxServer/VerifyPhone?authorCode=${authorCode}`,
  qRCodeVerifyDGIMN: `/WxServer/QRCodeVerifyDGIMN?authorCode=${authorCode}`,
  verifyDGIMN: `WxServer/VerifyDGIMN?authorCode=${authorCode}`,
  getRealTimeDataForPoint: `/WxServer/GetRealTimeDataForPoint?authorCode=${authorCode}`,
  addFeedback: `WxServer/AddFeedback?authorCode=${authorCode}`,
  getDataAlarmData: `WxServer/GetAlarmDatas?authorCode=${authorCode}`,
  getAuthorizationState: `WxServer/getAuthorizationState?authorCode=${authorCode}`,
  cancelAuthorization: `WxServer/cancelAuthorization?authorCode=${authorCode}`,
  getUserEntInfo: `WxServer/GetUserEntInfo?authorCode=${authorCode}`,
  qcaValidatePhone: `/QualityControlWxApi/QCAValidatePhone`,
  qcaValidataQCAMN: `/QualityControlWxApi/QCAValidataQCAMN`,
  qcaOpenDoor: `/QualityControlApi/SendOpenCMD?authorCode=${authorCode}`,
  qcaGetStandardGasList: `/QualityControlWxApi/QCAGetStandardGasList`,
  qcaUpdateStandardGasList: `/QualityControlWxApi/QCAUpdateStandardGasList`,
  validateAuthorCode: `/LoginApi/ValidateAuthorCode`, //代理授权码验证
  qcaGetAnalyzerInfoPage: `/QualityControlWxApi/QCAGetAnalyzerInfoPage`,
  qcaGetDoorState: `/QualityControlWxApi/QCAGetDoorState`,

}

/**
 * API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @param  {String} method HTTP 请求方法【get、post】
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(type, params, method, noUrl) {
  console.log("params", params);
  wx.showLoading({
    title: '正在加载中',
  });
  let prefix = URL;
  if (noUrl) {
    prefix = type;
    type = "";
  }
  // if (params && params.DGIMN) {
  //   const flags = sdlMN.filter(m => m === params.DGIMN);
  //   if (flags.length > 0) {

  //     isSdlDevice(function(f) {
  //       if (!f) {
  //         params.DGIMN = "XXX";
  //         params.DGIMNs = "XXX";

  //       }
  //       return fetch(prefix, type, params, method).then(res => {
  //         wx.hideLoading()
  //         res.IsSuccess = false;
  //         res.Message = "请在指定范围内查看设备数据";
  //         return res;
  //       }).catch(res => {
  //         wx.showModal({
  //           title: '提示',
  //           content: '网络错误，请重试', //'网络错误，请重试',JSON.stringify(res)
  //           showCancel: false,
  //           success(res) {
  //             if (res.confirm) {
  //               console.log('用户点击确定')
  //             } else if (res.cancel) {
  //               console.log('用户点击取消')
  //             }
  //           }
  //         })
  //         wx.hideLoading()
  //         return res;
  //       })
  //     })
  //   }
  // }  
  return fetch(prefix, type, params, method).then(res => {
    wx.hideLoading()

    return res;
  }).catch(res => {
    wx.showModal({
      title: '提示',
      content: '网络错误，请重试', //'网络错误，请重试',JSON.stringify(res)
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    wx.hideLoading()
    return res;
  })







}

/**
 * 首次打开微信小程序调用
 * @param  {String}} code     微信Code
 */
function validateFirstLogin(code) {
  return fetchApi(pageUrl.validateFirstLogin, {
      code: code
    }, 'post')
    .then(res => res.data)
}

/**
 * 首次打开微信小程序调用
 */
function getUserEntInfo(code) {
  return fetchApi(pageUrl.getUserEntInfo, {
      OpenId: common.getStorage('OpenId'),
    }, 'post')
    .then(res => res.data)
}

/**
 * 更新用户信息
 * @param  {String}} userPhone  用户手机号
 */
function updateUserInfo(userPhone) {
  return fetchApi(pageUrl.updateUserInfo, {
      IsFirstLogin: common.getStorage('IsFirstLogin'),
      AuthorCode: common.getStorage('AuthorCode'),
      UserPhone: userPhone
    }, 'post')
    .then(res => res.data)
}




/**
 * 获取用户信息及访问排口历史记录
 */
function getUserInfo() {
  //  api.getUserInfo().then(res => {
  //    console.log('getUserInfo', res)
  //  })
  console.log("OpenId_SDL=", common.getStorage('OpenId_SDL'));
  console.log("OpenId=", common.getStorage('OpenId'));
  console.log("AuthorCode=", common.getStorage('OpenId_SDL') || common.getStorage('OpenId'));

  return fetchApi(pageUrl.getUserInfo, {
      AuthorCode: common.getStorage('OpenId_SDL') || common.getStorage('OpenId'),
      DGIMN: common.getStorage('DGIMN')
    }, 'get')
    .then(res => res.data)
}

/**
 * 获取排口详情
 * @param  {String}} DGIMNs MN
 */
function getPointInfo(DGIMNs) {
  // api.getPointInfo('51052216080302').then(res => {
  //   console.log('getPointInfo', res)
  // })
  return fetchApi(pageUrl.getPointInfo, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取分析仪列表
 * @param  {String}} DGIMNs MN
 */
function getDeviceInfo(DGIMNs) {
  // api.getDeviceInfo('51052216080302').then(res => {
  //   console.log('getDeviceInfo', res)
  // })
  return fetchApi(pageUrl.getDeviceInfo, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取授权状态
 */
function getAuthorizationState() {
  return fetchApi(pageUrl.getAuthorizationState, {
    openID: common.getStorage('OpenId'),
  }, 'get').then(res => res.data)
}
/**
 * 取消授权状态
 */
function cancelAuthorization() {
  return fetchApi(pageUrl.cancelAuthorization, {
    openID: common.getStorage('OpenId'),
  }, 'get').then(res => res.data)
}

/**
 * 获取污染物列表
 * @param  {String}} DGIMNs MN
 */
function getPollutantList(DGIMNs) {
  console.log(common.getStorage('DGIMN'));
  return fetchApi(pageUrl.getPollutant, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取工艺流程图数据
 * @param  {String}} DGIMNs MN
 */
function getProcessFlowChartStatus() {
  return fetchApi(pageUrl.getProcessFlowChartStatus, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取实时工艺数据
 * @param  {String}} DGIMNs MN
 */
function getRealTimeDataForPoint() {
  return fetchApi(pageUrl.getRealTimeDataForPoint, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}
/**
 * 获取监控数据
 * @param  {String}} DGIMNs MN
 * @param  {String}} pollutantCodes 污染物编码
 * @param  {String}} datatype 数据类型：realtime|minute|hour|day
 * @param  {String}} endTime 时间过滤
 */
function getMonitorDatas(pollutantCodes, datatype, endTime = null) {

  let beginTime = '';
  if (datatype === 0) {
    endTime = moment(endTime).format('YYYY-MM-DD HH:mm:00');
    beginTime = moment(endTime).add(-1, 'hour').format('YYYY-MM-DD HH:mm:ss');
  } else if (datatype === 1) {
    endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
    beginTime = moment(endTime).add(-4, 'hour').format('YYYY-MM-DD HH:00:00');
  } else if (datatype === 2) {
    beginTime = moment(endTime).add(-1, 'day').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');

  } else if (datatype === 3) {
    beginTime = moment(endTime).format('YYYY-MM-01 00:00:00');
    endTime = moment(endTime).add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
  }
  let body = {
    OpenId: common.getStorage('OpenId'),
    DGIMNs: common.getStorage('DGIMN'),
    pollutantCodes: pollutantCodes,
    dataType: dataTypeObj[datatype],
    pageIndex: 1,
    pageSize: 100,
    isAsc: true,
    beginTime: beginTime,
    endTime: endTime
  };
  console.log(body);
  return fetchApi(pageUrl.getMonitorData, body, 'post').then(res => res.data)
}

/**
 * 获取报警数据
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function getAlarmDataList(beginTime, endTime, entCode, pageIndex = 1, pageSize = 10, DGIMN = "") {
  return fetchApi(pageUrl.getDataAlarmData, {
    BeginTime: beginTime,
    EndTime: endTime,
    EntCode: entCode,
    DGIMN: DGIMN,
    PageSize: pageSize,
    PageIndex: pageIndex,
    OpenId: common.getStorage('OpenId')
  }, 'post').then(res => res.data)
}

/**
 * 验证设备访问密码
 * @param  {String}} pwd 设备密码
 */
function verifyDevicePwd(pwd) {
  return fetchApi(pageUrl.verifyDevicePwd, {
    OpenId: common.getStorage('OpenId'),
    DGIMN: common.getStorage('DGIMN'),
    DevicePwd: common.getStorage('DevicePwd')
  }, 'post').then(res => res.data)
}

/**
 * 验证手机号是否能进入系统
 * @param  {String}} phone 手机号
 */
function verifyPhone(phone) {
  return fetchApi(pageUrl.verifyPhone, {
    WxCode: common.getStorage('WxCode'),
    Phone: phone
  }, 'post').then(res => res.data)
}

/**
 * 验证二维码是否为内部二维码
 * @param  {String}} phone 手机号
 */
function verifyDGIMN(DGIMN) {
  console.log("DGIMN", DGIMN)
  return fetchApi(pageUrl.verifyDGIMN, {
    DGIMN: DGIMN
  }, 'post').then(res => res.data)
}

/**
 * 根据扫码获取访问权限
 * @param  {String}} phone 手机号
 */
function qRCodeVerifyDGIMN(DGIMN) {
  if (!common.getStorage('OpenId')) {
    wx.showToast({
      title: '登录超时，请重试',
      icon: 'none',
      mask: true
    })
    return false;
  }
  return fetchApi(pageUrl.qRCodeVerifyDGIMN, {
    DGIMN: DGIMN,
    OpenId: common.getStorage('OpenId')
  }, 'post').then(res => res.data)
}

/**
 * 添加意见反馈
 * @param  {String}} phone 手机号
 */
function addFeedback(Name, EmailAddress, Details) {
  return fetchApi(pageUrl.addFeedback, {
    CreateUserID: common.getStorage('OpenId'), //不是用户id
    Name: Name,
    EmailAddress: EmailAddress,
    Details: Details
  }, 'post').then(res => res.data)
}

function geo(callback) {
  var _this = this;
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      var latitude = res.latitude;
      var longitude = res.longitude;
      console.log("latitude=", res.latitude);
      console.log("longitude=", res.longitude);
      const distance = util.VerifyCoordinate((latitude).toFixed(6), (longitude).toFixed(6));
      console.log(distance);
      return distance < 500;
    },
    fail: function() {
      wx.showToast({
        title: '定位信息获取失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
  })
}

function isSdlDevice(callback) {
  var _this = this;
  wx.getSetting({
    success: (res) => {
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        //未授权
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
          success: function(res) {
            if (res.cancel) {
              //取消授权
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
              callback && callback(false);
              //return false;
            } else if (res.confirm) {
              //确定授权，通过wx.openSetting发起授权请求
              wx.openSetting({
                success: function(res) {
                  if (res.authSetting["scope.userLocation"] == true) {
                    //再次授权，调用wx.getLocation的API
                    geo(function(f) {
                      callback && callback(f);
                    });
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                    callback && callback(false);
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == undefined) {
        //用户首次进入页面,调用wx.getLocation的API
        geo(function(f) {
          callback && callback(f);
        });
      } else {
        console.log('授权成功')
        //调用wx.getLocation的API
        geo(function(f) {
          callback && callback(f);
        });
      }
    }
  })
}

function qcaValidatePhone(phone) {
  return fetchApi(pageUrl.qcaValidatePhone, {
    Phone: phone,
    WxCode: common.getStorage('WxCode'),
  }, 'post').then(res => res.data)
}

function qcaValidataQCAMN(qcamn) {
  return fetchApi(pageUrl.qcaValidataQCAMN, {
    QCAMN: qcamn,
  }, 'get').then(res => res.data)
}

function qcaOpenDoor(remark, isQueryStatus) {
  return fetchApi(pageUrl.qcaOpenDoor, {
    DGIMN: remark,
  }, 'post').then(res => res.data)
}

function qcaGetStandardGasList() {
  return fetchApi(pageUrl.qcaGetStandardGasList, {
    qcaMN: common.getStorage('QCAMN'),
  }, 'get').then(res => res.data)
}

function qcaUpdateStandardGasList(datas) {
  return fetchApi(pageUrl.qcaUpdateStandardGasList, {
    Datas: datas, //数组
  }, 'post').then(res => res.data)
}

function validateAuthorCode() {
  return fetchApi(pageUrl.validateAuthorCode, {
    Datas: '',
  }, 'post').then(res => res.data)
}

function qcaGetAnalyzerInfoPage(pageIndex, pageSize) {
  return fetchApi(pageUrl.qcaGetAnalyzerInfoPage, {
    PageIndex: pageIndex || 1,
    PageSize: pageSize || 15
  }, 'post').then(res => res.data)
} //

function qcaGetDoorState() {
  return fetchApi(pageUrl.qcaGetDoorState, {
    qcaMN: common.getStorage('QCAMN'),
  }, 'get').then(res => res.data)
}

module.exports = {
  validateFirstLogin,
  updateUserInfo,
  getUserInfo,
  getPointInfo,
  getDeviceInfo,
  getPollutantList,
  getProcessFlowChartStatus,
  getMonitorDatas,
  verifyDevicePwd,
  verifyPhone,
  qRCodeVerifyDGIMN,
  verifyDGIMN,
  getRealTimeDataForPoint,
  addFeedback,
  getAlarmDataList,
  getAuthorizationState,
  cancelAuthorization,
  getUserEntInfo,
  qcaValidatePhone,
  qcaValidataQCAMN,
  qcaOpenDoor,
  qcaGetStandardGasList,
  qcaUpdateStandardGasList,
  validateAuthorCode,
  qcaGetAnalyzerInfoPage,
  qcaGetDoorState
}