const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTabBarSelectedIndex = url => {
  let tabBarList = wx.getStorageSync('tabBarList');
  let selectedIndex;
  tabBarList.filter((item, index) => {
    if (item.pagePath === url) {
      selectedIndex = index;
    }
  })
  console.log('selectedIndex=',selectedIndex);
  return selectedIndex;
}

// const getDefaultTime = type => {
//   let beginTime, endTime;
//   switch (type) {
//     case 'realttime':
//       beginTime = moment().subtract('hours', 1);
//       endTime = moment()
//   }
// }

module.exports = {
  formatTime: formatTime,
  getTabBarSelectedIndex: getTabBarSelectedIndex
}