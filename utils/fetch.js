const common = require('./common.js')
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
  var AuthorCodeRSA = common.getStorage('AuthorCodeRSA_' + common.getStorage('ApiType'));
  console.log("AuthorCodeRSA=", AuthorCodeRSA);
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