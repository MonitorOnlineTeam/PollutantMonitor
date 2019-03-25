  //const URL = 'http://172.16.9.13:8019/api/rest/PollutantSourceApi/'
  //const URL = 'http://localhost:52198/rest/PollutantSourceApi/'
  //const URL = 'http://api.chsdl.cn/WxWryApi/rest/PollutantSourceApi'
  //http://api.chsdl.cn/wxwryapi?flag=sdl&mn=62262431qlsp099
  const URL = 'http://172.16.30.108/WxWryApi/rest/PollutantSourceApi'
  const fetch = require('./fetch')
  const common = require('./common.js')
  const moment = require('../utils/moment.min.js')
  const authorCode = '48f3889c-af8d-401f-ada2-c383031af92d'
  const dataTypeObj = {
    0: 'realtime',
    1: 'minute',
    2: 'hour',
    3: 'day'
  }
  const pageUrl = {
    getOpenId: `/UserInfoApi/PostLogin?authorCode=${authorCode}`,
    validateFirstLogin: '/UserInfoApi/ValidateFirstLogin',
    updateUserInfo: '/UserInfoApi/UpdateUserInfo',
    getUserInfo: '/UserInfoApi/GetUserInfo',
    getPointInfo: `/UserInfoApi/GetPointInfo?authorCode=${authorCode}`,
    getDeviceInfo: `/UserInfoApi/GetAnalyzerList?authorCode=${authorCode}`,
    getPollutant: `/UserInfoApi/GetPollutantList?authorCode=${authorCode}`,
    getMonitorData: `/UserInfoApi/GetMonitorDatas?authorCode=${authorCode}`,
    getProcessFlowChartStatus: `/UserInfoApi/GetProcessFlowChartStatus?authorCode=${authorCode}`,
    verifyDevicePwd: `/UserInfoApi/VerifyDevicePwd?authorCode=${authorCode}`,
    verifyPhone: `/UserInfoApi/VerifyPhone?authorCode=${authorCode}`,
    verifyDGIMN: `/UserInfoApi/VerifyDGIMN?authorCode=${authorCode}`,
    getRealTimeDataForPoint: `/UserInfoApi/GetRealTimeDataForPoint?authorCode=${authorCode}`,
    addFeedback: `/UserInfoApi/AddFeedback?authorCode=${authorCode}`,
  }

  /**
   * API
   * @param  {String} type   类型，例如：'coming_soon'
   * @param  {Objece} params 参数
   * @param  {String} method HTTP 请求方法【get、post】
   * @return {Promise}       包含抓取任务的Promise
   */
  function fetchApi(type, params, method) {
    wx.showLoading({
      title: '正在加载中',
    })
    return fetch(URL, type, params, method).then(res => {
      wx.hideLoading()
      return res;
    }).catch(res => {
      wx.showModal({
        title: '提示',
        content: JSON.stringify(res), //'网络错误，请重试',
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
    return fetchApi(pageUrl.getUserInfo, {
        AuthorCode: common.getStorage('OpenId')
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
      DGIMN: common.getStorage('DGIMN')
    }, 'post').then(res => res.data)
  }

  /**
   * 获取污染物列表
   * @param  {String}} DGIMNs MN
   */
  function getPollutantList(DGIMNs) {
    console.log(common.getStorage('DGIMN'));
    return fetchApi(pageUrl.getPollutant, {
      DGIMN: common.getStorage('DGIMN')
    }, 'post').then(res => res.data)
  }

  /**
   * 获取工艺流程图数据
   * @param  {String}} DGIMNs MN
   */
  function getProcessFlowChartStatus() {
    return fetchApi(pageUrl.getProcessFlowChartStatus, {
      DGIMN: common.getStorage('DGIMN')
    }, 'post').then(res => res.data)
  }

  /**
   * 获取实时工艺数据
   * @param  {String}} DGIMNs MN
   */
  function getRealTimeDataForPoint() {
    return fetchApi(pageUrl.getRealTimeDataForPoint, {
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
      beginTime = moment(endTime).add(-5, 'minute').format('YYYY-MM-DD HH:mm:ss');
    } else if (datatype === 1) {
      endTime = moment(endTime).format('YYYY-MM-DD HH:59:59');
      beginTime = moment(endTime).format('YYYY-MM-DD HH:00:00');
    } else if (datatype === 2) {
      endTime = moment(endTime).add(1, 'day').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
      beginTime = moment(endTime).format('YYYY-MM-DD 00:00:00');
    } else if (datatype === 3) {
      beginTime = moment(endTime).format('YYYY-MM-01 00:00:00');
      endTime = moment(endTime).add(1, 'months').add(-1, 'seconds').format('YYYY-MM-DD 23:59:59');
    }
    let body = {
      DGIMNs: common.getStorage('DGIMN'),
      pollutantCodes: pollutantCodes,
      datatype: dataTypeObj[datatype],
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
    return fetchApi(pageUrl.verifyDGIMN, {
      DGIMN: DGIMN
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
    verifyDGIMN,
    getRealTimeDataForPoint,
    addFeedback
  }