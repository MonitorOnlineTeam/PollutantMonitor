//const URL = 'http://172.16.9.13:8019/api/rest/PollutantSourceApi/'
//const URL = 'http://localhost:52198/rest/PollutantSourceApi'
const URL = 'https://api.chsdl.net/NewWryWebProxy/rest/PollutantSourceApi';
//const URL ='http://localhost:54818/rest/PollutantSourceApi'

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
  getDeviceInfo: `WxServer/GetAnalyzerList?authorCode=${authorCode}`,
  verifyDevicePwd: `WxServer/VerifyDevicePwd?authorCode=${authorCode}`,
  verifyDGIMN: `WxServer/VerifyDGIMN?authorCode=${authorCode}`,

  getPollutant: `/SMCManagerApi/GetPollutantList`,
  getMonitorData: `/SMCManagerApi/GetMonitorDatas`,
  getProcessFlowChartStatus: `/SMCManagerApi/GetProcessFlowChartStatus`,
  verifyPhone: `/SMCManagerApi/VerifyPhone`,
  qRCodeVerifyDGIMN: `/SMCManagerApi/QRCodeVerifyDGIMN`,
  getPointInfo: `/SMCManagerApi/GetPointInfo`,
  getRealTimeDataForPoint: `/SMCManagerApi/GetRealTimeDataForPoint`,
  addFeedback: `/SMCManagerApi/AddFeedback`,
  getDataAlarmData: `/SMCManagerApi/GetAlarmDatas`,
  register: `/SMCManagerApi/Register`,
  getEnterpriseList: `/SMCManagerApi/GetEnterpriseList`,
  getOperationLogList: `/SMCManagerApi/GetOperationLogList?authorCode=${authorCode}`,
  getTaskDitails: `/SMCManagerApi/GetTaskDitails?authorCode=${authorCode}`,
  getVentilationOperationRecord: `/SMCManagerApi/GetVentilationOperationRecord`,
  getAuthorizationState: `/SMCManagerApi/getAuthorizationState`,
  cancelAuthorization: `/SMCManagerApi/cancelAuthorization`,
  getUserEntInfo: `/SMCManagerApi/GetUserEntInfo`,
  getPointVisitHistorys: `/SMCManagerApi/GetPointVisitHistorys`,
  validateAuthorCode: `/LoginApi/ValidateAuthorCode`, //代理授权码验证
  qCAResultCheckByDGIMN: `/SMCManagerApi/QCAResultCheckByDGIMN`,
  getStabilizationTime: `/SMCManagerApi/GetStabilizationTime`,
  SDLSMCIsRegister: `/SMCManagerApi/SDLSMCIsRegister`,
  AddUser: `/SMCManagerApi/AddUser`,
  ValidateDGIMN: `/SMCManagerApi/ValidateDGIMN`
}


var RSA = require('./wx_rsa.js');
const publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsx1/cEpUmSwUwwPU0SciWcVKmDORBGwSBjJg8SL2GrCMC1 + Rwz81IsBSkhog7O + BiXEOk / 5frE8ryZOpOm / 3PmdWimEORkTdS94MilEsk + 6Ozd9GnAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC894cUqq1aH9h44SwyQIDAQAB-----END PUBLIC KEY-----';
var encStr = "";


//验证用户是否注册
function SDLSMCIsRegister() {
  return fetchApi(pageUrl.SDLSMCIsRegister, {
    wxcode: common.getStorage('WxCode')
  }, 'get').then(res => res.data);
}
//注册用户
function AddUser(phone) {
  return fetchApi(pageUrl.AddUser, {
    OpenId: common.getStorage('OpenId'),
    Phone: phone
  }, 'post').then(res => res.data)
}
//初始化监控与运维票据
function initTicket(callback) {

  if (common.getStorage("AuthorCodeRSA_1") && common.getStorage("AuthorCodeRSA_2")) {
    common.setStorage("ApiType", 1);
    common.setStorage("IsAuthor", true);
    callback && callback(true);
    return;
  }

  var that = this;
  var authorcodeMo = "90909"; //监控
  var authorcodeOpt = "80000"; //运维
  let encrypt_rsa = new RSA.RSAKey();
  encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
  encStr = encrypt_rsa.encrypt(authorcodeMo)
  encStr = RSA.hex2b64(encStr);
  common.setStorage(`AuthorCodeRSA_1`, encStr);
  common.setStorage("ApiType", 1);

  that.validateAuthorCode().then(res => {
    if (res && res.IsSuccess) {
      common.setStorage(`AuthorCodeRSA_1`, encStr);
      common.setStorage("IsAuthor", true);
      //运维授权
      encStr = encrypt_rsa.encrypt(authorcodeOpt)
      encStr = RSA.hex2b64(encStr);
      common.setStorage(`AuthorCodeRSA_2`, encStr);
      //common.setStorage("ApiType", 2);

      that.validateAuthorCode().then(res => {
        if (res && res.IsSuccess) {
          common.setStorage(`AuthorCodeRSA_2`, encStr);
          common.setStorage("IsAuthor", true);
          wx.showToast({
            title: '授权成功',
            icon: 'none'
          });
          callback && callback(true);
        }
      })
    }
  })
}

function ValidateDGIMN(mn) {
  return fetchApi(pageUrl.ValidateDGIMN, {
    DGIMN: mn,
    OpenId: common.getStorage("OpenId")
  }, 'post').then(res => res.data);
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
      content: JSON.stringify(res) + type + common.getStorage("ApiType"), //'网络错误，请重试', //'网络错误，请重试',JSON.stringify(res)
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

function validateAuthorCode() {
  return fetchApi(pageUrl.validateAuthorCode, {
    Datas: '',
  }, 'post').then(res => res.data)
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
      OpenId: common.getStorage('PhoneCode'),
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
  console.log("OpenId=", common.getStorage('PhoneCode'));
  console.log("AuthorCode=", common.getStorage('OpenId_SDL') || common.getStorage('PhoneCode'));

  return fetchApi(pageUrl.getUserInfo, {
      AuthorCode: common.getStorage('OpenId_SDL') || common.getStorage('PhoneCode'),
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
    OpenId: common.getStorage('PhoneCode'),
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
    OpenId: common.getStorage('PhoneCode'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取授权状态
 */
function getAuthorizationState() {
  return fetchApi(pageUrl.getAuthorizationState, {
    openID: common.getStorage('PhoneCode'),
  }, 'get').then(res => res.data)
}
/**
 * 取消授权状态
 */
function cancelAuthorization() {
  return fetchApi(pageUrl.cancelAuthorization, {
    openID: common.getStorage('PhoneCode'),
  }, 'get').then(res => res.data)
}

/**
 * 获取污染物列表
 * @param  {String}} DGIMNs MN
 */
function getPollutantList(DGIMNs) {
  console.log(common.getStorage('DGIMN'));
  return fetchApi(pageUrl.getPollutant, {
    OpenId: common.getStorage('PhoneCode'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取工艺流程图数据
 * @param  {String}} DGIMNs MN
 */
function getProcessFlowChartStatus() {
  return fetchApi(pageUrl.getProcessFlowChartStatus, {
    OpenId: common.getStorage('PhoneCode'),
    DGIMN: common.getStorage('DGIMN')
  }, 'post').then(res => res.data)
}

/**
 * 获取实时工艺数据
 * @param  {String}} DGIMNs MN
 */
function getRealTimeDataForPoint() {
  return fetchApi(pageUrl.getRealTimeDataForPoint, {
    OpenId: common.getStorage('PhoneCode'),
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
    OpenId: common.getStorage('PhoneCode'),
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
    OpenId: common.getStorage('PhoneCode')
  }, 'post').then(res => res.data)
}

/**
 * 注册信息
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function register(
  Abbreviation,
  DGIMN,
  EntAddress,
  EntLatitude,
  EntLongitude,
  EntName,
  EnvironmentPrincipal,
  MobilePhone,
  OutputDiameter,
  OutputHigh,
  PointLatitude,
  PointLongitude,
  PointName,
  OpenId,
  EntCode
) {
  return fetchApi(pageUrl.register, {
    Abbreviation: Abbreviation,
    DGIMN: DGIMN,
    EntAddress: EntAddress,
    EntLatitude: EntLatitude,
    EntLongitude: EntLongitude,
    EntName: EntName,
    EnvironmentPrincipal: EnvironmentPrincipal,
    MobilePhone: MobilePhone,
    OutputDiameter: OutputDiameter,
    OutputHigh: OutputHigh,
    PointLatitude: PointLatitude,
    PointLongitude: PointLongitude,
    PointName: PointName,
    openId: OpenId,
    EntCode: EntCode,
  }, 'post').then(res => res.data)
}

/**
 * 获取所有企业信息
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function getEnterpriseList() {
  return fetchApi(pageUrl.getEnterpriseList, {
  }, 'post').then(res => res.data)
}

/**
 * 获取运维数据
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function getOperationLogList(DGIMN, beginTime, pageindex, pagesize) {
  return fetchApi(pageUrl.getOperationLogList, {
    beginTime: beginTime,
    DGIMN: DGIMN,
    pageIndex: pageindex,
    pageSize: pagesize,
  }, 'post').then(res => res.data)
}

/**
 * 获取运维数据
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function getTaskDitails(taskid) {
  return fetchApi(pageUrl.getTaskDitails, {
    TaskID: taskid
  }, 'post').then(res => res.data)
}

/**
 * 获取通气操作记录
 * @param {DateTime} beginTime
 * @param {DateTime} endTime
 * @param {String} pollutantCodes
 * @param {String} dataType
 */
function getVentilationOperationRecord(pageindex, pagesize, conditionwhere) {
  return fetchApi(pageUrl.getVentilationOperationRecord, {
    PageIndex: pageindex,
    PageSize: pagesize,
    ConditionWhere: conditionwhere
  }, 'post').then(res => res.data)
}

//质控-获取稳定时间
function qCAResultCheckByDGIMN(DGIMN, QCAMN, StandardGasCode, ID) {
  return fetchApi(pageUrl.qCAResultCheckByDGIMN, {
    "DGIMN": DGIMN,
    "QCAMN": QCAMN,
    "PollutantCode": StandardGasCode,
    "ID": ID
  }, 'post').then(res => res.data)
}
//质控-获取稳定时间
function getStabilizationTime(DGIMN, QCAMN, StandardGasCode, Type = "History") {
  return fetchApi(pageUrl.getStabilizationTime, {
    "DGIMN": DGIMN,
    "QCAMN": QCAMN,
    "StandardGasCode": StandardGasCode,
    "Type": Type
  }, 'post').then(res => res.data)
}

/**
 * 验证设备访问密码
 * @param  {String}} pwd 设备密码
 */
function verifyDevicePwd(pwd) {
  return fetchApi(pageUrl.verifyDevicePwd, {
    OpenId: common.getStorage('PhoneCode'),
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
 * 获取访问历史
 * @param  {String}} phone 手机号
 */
function getPointVisitHistorys() {
  return fetchApi(pageUrl.getPointVisitHistorys, {
    OpenId: common.getStorage('OpenId'),
  }, 'get').then(res => res.data)
}


/**
 * 根据扫码获取访问权限
 * @param  {String}} phone 手机号
 */
function qRCodeVerifyDGIMN(DGIMN) {

  if (sdlMN.filter(m => m === DGIMN).length > 0) {
    if (!common.getStorage('PhoneCode')) {
      common.setStorage("OpenId", "13800138000"); //13800138000
      common.setStorage("PhoneCode", "13800138000"); //13800138000
    }
  }

  // if (!common.getStorage('PhoneCode')) {
  //   wx.showToast({
  //     title: '登录超时，请重试',
  //     icon: 'none',
  //     mask: true
  //   })
  //   return false;
  // }
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
    CreateUserID: common.getStorage('PhoneCode'), //不是用户id
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

module.exports = {
  validateFirstLogin,
  updateUserInfo,
  getUserInfo,
  getPointInfo,
  getDeviceInfo,
  getPollutantList,
  getProcessFlowChartStatus,
  register,
  getEnterpriseList,
  getMonitorDatas,
  verifyDevicePwd,
  verifyPhone,
  qRCodeVerifyDGIMN,
  verifyDGIMN,
  getRealTimeDataForPoint,
  addFeedback,
  getAlarmDataList,
  getOperationLogList,
  getTaskDitails,
  getVentilationOperationRecord,
  getAuthorizationState,
  cancelAuthorization,
  getUserEntInfo,
  getPointVisitHistorys,
  validateAuthorCode,
  qCAResultCheckByDGIMN,
  getStabilizationTime,
  SDLSMCIsRegister,
  AddUser,
  initTicket,
  ValidateDGIMN
}