function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject
    })
  })
}

function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) { }
}

function getStorage(key) {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
  }
}

function removeStorage(key)
{
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    
  }
}

function clearStorage()
{
  try {
    wx.clearStorageSync()
  } catch (e) {
  }
}

function getLocation(type) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: type,
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  login,
  getUserInfo,
  setStorage,
  getStorage,
  removeStorage,
  getLocation,
  original: wx
}