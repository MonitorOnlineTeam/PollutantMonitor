import {
  API
} from './api'


const request = (urlName, method, data, options) => {
  if (!options.hideLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: API[urlName],
      method: method || 'GET',
      data: method === 'GET' ? data : JSON.stringify(data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${wx.getStorageSync('Ticket')}`,
        'ProxyCode': wx.getStorageSync('authorCode') || options.authorCode
      },
      success(res) {
        console.log('res=', res);
        if (res.statusCode === 401) {
          wx.clearStorageSync();
          wx.redirectTo({
            url: '/pages/authorCode/index',
          })
        }
        if (res.data.IsSuccess == true) {
          wx.hideLoading()
          resolve(res)
        } else if (res.data.msg === "authorcode faild") {
          resolve({
            ...res,
            data: {
              Message: '请输入正确的授权码'
            }
          })
          wx.hideLoading()
        } else {
          wx.hideLoading({
            success: () => {
              if (!options.hideToast) {
                wx.showToast({
                  title: res.data.Message || '网络请求失败，请重试',
                  icon: 'error',
                  duration: 2500,
                })
              }
            },
          })

          // resolve(res)
          reject(res);
        }
      },
      fail(error) {
        console.log('error=', error);
        reject(error)
        // wx.hideLoading()
      },
      complete: info => {}
    })
  })
}

const get = ({
  url,
  data = {},
  options = {}
}) => {
  return request(url, 'GET', data, options)
}
const post = ({
  url,
  data = {},
  options = {}
}) => {
  return request(url, 'POST', data, options)
}
module.exports = {
  get,
  post
}