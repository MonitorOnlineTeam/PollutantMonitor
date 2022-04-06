import request from './request'

// 获取企业排口列表
export function getEntList() {
  // post("")
  request.post({
    url: 'getEntAndAirList',
    data: {
      "RunState": "1",
      "PollutantTypes": "1,2"
    }
  })
}