const common = require('./common.js');
//12345
//ZE6QNsENUZqQlaJMhQexcy2NGmc5gcG1DpP2lqRCEgVFlJlpbbKo00osI4T8TuyPKjZw+52woMQ1dGaUpFMPfnDfMSf97+GdllnBtE1IQszaT/OfVUio6g7oMBiMXo55TLJnEFcAau3LrEBGBerea1aWUfJBYji57bvJmZ4e7F4=
//90909
//b0Ns+cHJZXXOi4gU62VecNIqPt4gcXmZEmSAmpOtujDh5NOj9+dbPiV832pisLDA0Kuktwadouc8IobhMOvAmAjZjmL/h0Jdy9eGujWRT0h8cXwYysdOUdOGW62d0RpTXK4fZQjQTfRjW84QPh3dVu4mWtZr5CoDZxUs6ptA4X0=
const AuthorCodeRSA_1 = 'b0Ns+cHJZXXOi4gU62VecNIqPt4gcXmZEmSAmpOtujDh5NOj9+dbPiV832pisLDA0Kuktwadouc8IobhMOvAmAjZjmL/h0Jdy9eGujWRT0h8cXwYysdOUdOGW62d0RpTXK4fZQjQTfRjW84QPh3dVu4mWtZr5CoDZxUs6ptA4X0=';
const AuthorCodeRSA_2 = 'TyjmuG8/mCYWRAU3W0GfYj1Hh2abtlEEHtmpkPV2x9vviN0MbrQ/MYL99Iox76o9Oi/zrnFCEynwCoAtoGxOBaeoeSRJzwIkQjUCRj0tQXiUjDV6O7fxHbRyzvo0pb//eRRHviec9LtkLFWSTcVKse6SiNDzEewMNrt8xSHQYQk=';
/**
 * 统一请求方法
 * https://XXXX
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @param  {String} method HTTP 请求方法【get、post】
 * @return {Promise}       包含服务端的Promise
 */
module.exports = function(api, path, params, method) {
  //console.log(`${api}/${path}`, `${JSON.stringify(params)}${method}`);
  // wx.showModal({
  //   title: '提示',
  //   content: `${JSON.stringify(params)}${method}${api}${path}`, //'网络错误，请重试', //'网络错误，请重试',JSON.stringify(res)
  //   showCancel: false,
  //   success(res) {
  //     if (res.confirm) {
  //       console.log('用户点击确定')
  //     } else if (res.cancel) {
  //       console.log('用户点击取消')
  //     }
  //   }
  // })
  var AuthorCodeRSA = common.getStorage('ApiType') == 1 ? AuthorCodeRSA_1 : AuthorCodeRSA_2; //common.getStorage('AuthorCodeRSA_' + common.getStorage('ApiType'));
  //console.log("AuthorCodeRSA=", AuthorCodeRSA);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}${path}`,
      data: Object.assign({}, params),
      method: method || 'get',
      header: {
        'Content-Type': method == 'get' ? 'json' : 'application/json', //application/x-www-form-urlencoded
        'Authorization': `Bearer ${AuthorCodeRSA}$${common.getStorage("Ticket")}`
      },
      success: resolve,
      fail: reject
    })
  })
}