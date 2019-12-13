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
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}${path}`,
      data: Object.assign({}, params),
      method: method || 'get',
      header: {
        'Content-Type': method == 'get' ? 'json' : 'application/json'//application/x-www-form-urlencoded
      },
      success: resolve,
      fail: reject
    })
  })
}