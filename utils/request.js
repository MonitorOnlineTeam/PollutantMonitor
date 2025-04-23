// import {
//   API
// } from './API'
import {
  API
} from './api'
import a from './api'
console.log('API = ',API);
console.log('a = ',a);
const app = getApp();


const request = (urlName, method, data, options) => {
  if (!options.hideLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  // console.log('request = ',wx.getStorageSync('authorCode'));
  // console.log('request2 = ',getApp());
  
  return new Promise((resolve, reject) => {
    const Ticket = wx.getStorageSync('Ticket')
    // let Authorization =  `Bearer ${wx.getStorageSync('encryData')}`;
    // if (Ticket != '') {
    //   Authorization = `Bearer ${wx.getStorageSync('encryData')}$${Ticket}`;
    // }
    let Authorization =  `Bearer ${Ticket}`;
    wx.request({
      url: API[urlName],
      method: method || 'GET',
      data: method === 'GET' ? data : JSON.stringify(data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': Authorization,
        'ProxyCode': wx.getStorageSync('authorCode') || options.authorCode
      },
      success(res) {
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
          wx.redirectTo({
            url: '/pages/authorCode/index',
          })
          wx.hideLoading()
        } else {
          wx.hideLoading({
            success: () => {
              if (!options.hideToast) {
                wx.showToast({
                  title: res.data.Message?(res.data.Message == '授权码输入错误(P)'?'授权码输入错误':res.data.Message): '网络请求失败，请重试',
                  icon: 'error',
                  // title:'授权码输入错误',
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
        console.log('fail error = ',error);
        reject(error)
        // wx.hideLoading()
      },
      complete: info => {}
    })
  })
}

const requestAuthorizationCode = (url, method, data, options) => {
  if (!options.hideLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      data: method === 'GET' ? data : JSON.stringify(data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'ProxyCode': wx.getStorageSync('authorCode') || options.authorCode
      },
      success(res) {
        // console.log('res = ',res);
        wx.hideLoading()
        if (res.statusCode == 200) {
          resolve(res)
        } else {
          reject(res);
        }
      },
      fail(error) {
        // console.log(error);
        wx.showModal({
          title: '错误',
          content: error.errMsg,
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
        reject(error)
        wx.hideLoading()
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
const getAuthorizationCode = ({
  url,
  data = {},
  options = {}
}) => {
  return requestAuthorizationCode(url, 'GET', data, options)
}
module.exports = {
  get,
  post,
  getAuthorizationCode
}