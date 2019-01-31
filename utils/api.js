 const URI = 'http://172.16.9.13:8019/rest/PollutantSourceApi/'
 //const URI = 'http://localhost:52198/rest/PollutantSourceApi'
 const fetch = require('./fetch')
 const common = require('./common.js')
 const authorCode = '48f3889c-af8d-401f-ada2-c383031af92d'

 const pageUrl = {
   getOpenId: `/UserInfoApi/PostLogin?authorCode=${authorCode}`,
   validateFirstLogin: '/UserInfoApi/ValidateFirstLogin',
   updateUserInfo: '/UserInfoApi/UpdateUserInfo',
   getUserInfo: '/UserInfoApi/GetUserInfo',
   getPointInfo: `/UserInfoApi/GetPointInfo?authorCode=${authorCode}`,
   getDeviceInfo: `/UserInfoApi/GetAnalyzerList?authorCode=${authorCode}`,
   getPollutant: `/UserInfoApi/GetPollutantList?authorCode=${authorCode}`,
   getMonitorData: `/UserInfoApi/GetMonitorDatas?authorCode=${authorCode}`,
   getProcessFlowChartStatus: `/UserInfoApi/GetProcessFlowChartStatus?authorCode=${authorCode}`
 }

 /**
  * API
  * @param  {String} type   类型，例如：'coming_soon'
  * @param  {Objece} params 参数
  * @param  {String} method HTTP 请求方法【get、post】
  * @return {Promise}       包含抓取任务的Promise
  */
 function fetchApi(type, params, method) {
   return fetch(URI, type, params, method)
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
   // api.updateUserInfo('18601364600').then(res=>{
   //   console.log('updateUserInfo',res)

   //   if (res && res.IsSuccess) {
   //     if (res.Data) {
   //       common.setStorage("IsFirstLogin", res.Data.IsFirstLogin)
   //       common.setStorage("AuthorCode", res.Data.AuthorCode)
   //     }

   //     wx.showToast({
   //       title: '修改成功',
   //       icon: 'success',
   //       duration: 2000
   //     })
   //   }
   // })


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
       AuthorCode: common.getStorage('AuthorCode')
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
     DGIMN: DGIMNs
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
     DGIMN: DGIMNs
   }, 'post').then(res => res.data)
 }

 /**
  * 获取污染物列表
  * @param  {String}} DGIMNs MN
  */
 function getPollutantList(DGIMNs) {
   return fetchApi(pageUrl.getPollutant, {
     DGIMN: DGIMNs
   }, 'post').then(res => res.data)
 }

 /**
  * 获取工艺流程图数据
  * @param  {String}} DGIMNs MN
  */
 function getProcessFlowChartStatus(DGIMNs) {
   return fetchApi(pageUrl.getProcessFlowChartStatus, {
     DGIMN: DGIMNs
   }, 'post').then(res => res.data)
 }

 /**
  * 获取监控数据
  * @param  {String}} DGIMNs MN
  * @param  {String}} pollutantCodes 污染物编码
  * @param  {String}} datatype 数据类型：realtime|minute|hour|day
  * @param  {String}} endTime 时间过滤
  */
 function getMonitorDatas(DGIMNs, pollutantCodes, datatype, endTime = null) {
   return fetchApi(pageUrl.getProcessFlowChartStatus, {
     DGIMNs: DGIMNs,
     pollutantCodes: pollutantCodes,
     datatype: datatype,
     pageIndex: 1,
     pageSize: 100,
     isAsc: true,
     endTime: datatype == 'realtime' ? null : endTime
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
   getMonitorDatas
 }