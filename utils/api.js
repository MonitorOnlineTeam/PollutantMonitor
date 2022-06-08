// const prefix = "http://172.16.12.39:6300/rest/PollutantSourceApi";
const prefix = "https://env.bjlanyue.cn/jsh/rest/PollutantSourceApi";
// const prefix = "http://61.50.135.114:6300/rest/PollutantSourceApi";
export const API = {
  login: prefix +  '/LoginApi/Login',
  // 获取系统配置信息
  GetSystemConfigInfo: prefix + '/SystemSettingApi/GetSystemConfigInfo',
  // 验证是否注册
  SDLSMCIsRegister: prefix + '/SMCManagerApi/SDLSMCIsRegister',
  // 获取系统菜单
  GetSysMenuByUserID: prefix + '/AuthorApi/GetSysMenuByUserID',
  // 获取地图点位信息
  GetViewPoint: prefix + '/BaseDataApi/GetViewPoint',
  // 获取地图空气站信息
  GetAirDetailAndDatas: prefix + '/MonDataApi/GetAirDetailAndDatas',
  getEntAndAirList: prefix + '/BaseDataApi/GetEntAndPoint',
  GetAirDataToXinJiang: prefix + '/MonDataApi/GetAirDataToXinJiang',
  // 获取实时数据列表
  GetRealTimeDataForPoint: prefix + '/SMCManagerApi/GetRealTimeDataForPoint',
  // 意见反馈
  AddFeedback: prefix + '/SMCManagerApi/AddFeedback',
  // 获取污染物列表
  GetPollutantList: prefix + '/SMCManagerApi/GetPollutantList',
  // 根据污染物类型获取污染物列表
  GetPollutantTypeCode: prefix + '/BaseDataApi/GetPollutantTypeCode',
  // 获取企业排口数据
  AllTypeSummaryList: prefix + '/BaseDataApi/AllTypeSummaryList',
  // 获取历史数据
  GetMonitorDatas: prefix + '/SMCManagerApi/GetMonitorDatas',
  // 获取报警信息
  GetAlarmDataList: prefix + '/BaseDataApi/GetAlarmDataList',
  // 获取站点排名
  GetAirPointRanking: prefix + '/MonDataApi/GetAirPointRanking',
  // 获取空气站
  GetOperationTargetList: prefix + '/MonitorTargetApi/GetOperationTargetList',
  // 获取待办任务列表
  GetUnhandleTaskList: prefix + '/OperationBasicApi/GetUnhandleTaskList',
  // 创建任务
  AddTask: prefix + '/TaskProcessingApi/AddTask',
  // 创建任务 - 获取监测点
  GetPoints: prefix + '/MonitorPointApi/GetPoints',
  // 获取任务记录
  GetTaskRecord: prefix + '/TaskProcessingApi/GetOperationHistoryRecordPageList',
  // 获取任务详情
  GetTaskDetails: prefix + '/TaskProcessingApi/GetTaskDetails',
  // 获取质控表单数据
  GetQualityRecordList: prefix + '/TaskFormApi/GetQualityRecordList',
  // 添加或修改质控表单
  AddQualityRecord: prefix + '/TaskFormApi/AddQualityRecord',
  // 获取大气站运维表单
  GetOperationRecordList: prefix + '/TaskFormApi/GetOperationRecordList',
  // 添加或修改运维表单
  AddOperationRecord: prefix + '/TaskFormApi/AddOperationRecord',
  // 暂存和结束任务
  PostTask: prefix + '/TaskProcessingApi/PostTask',
  // 删除运维表单
  DeleteOperationRecord: prefix + '/TaskFormApi/DeleteOperationRecord',
  // 删除质控表单
  DeleteQualityRecord: prefix + '/TaskFormApi/DeleteQualityRecord',
}