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

const createFormUrl = (TaskFormList, neturl, ID, TaskStatus=-1) => {
  /**
   * 2 StopCemsHistoryList
   * 1 RepairHistoryList
   * 3 ConsumablesReplaceHistoryList
   * 4 StandardGasRepalceHistoryList
   * 5 WQCQFInspectionHistoryList
   * 6 XSCYFInspectionHistoryList
   * 7 ZZCLFInspectionHistoryList
   * 8 JzHistoryList
   * 9 BdTestHistoryList
   * 10 DeviceExceptionHistoryList
   * 27 保养项更换记录表
   * { path: '/appoperation/appmaintainrepalcerecord/:TaskID/:TypeID', component: './AppOperation/AppMaintainRepalceRecord' },
   * 3 备件更换记录表
   * { path: '/appoperation/appsparepartreplacerecord/:TaskID/:TypeID', component: './AppOperation/AppSparePartReplaceRecord' },
   */
  // neturl = 'http://172.16.12.77:8000';//测试
  TaskFormList.map(item => {
      ID = item.TaskID;
      item.TaskStatus = TaskStatus;
      if ((item.TypeName == 'StopCemsHistoryList' || item.TypeID == 2) && ID && ID != '') {
          //停机
          item.formUrl = neturl + '/appoperation/appstopcemsrecord' + '/' + ID + '/' + 2;
      } else if ((item.TypeName == 'RepairHistoryList' || item.TypeID == 1|| item.TypeID == 12) && ID && ID != '') {
          //维修
          item.formUrl = neturl + '/appoperation/apprepairrecord' + '/' + ID + '/' + 1;
          // } else if((item.TypeName == "ConsumablesReplaceHistoryList"||item.TypeID == 3)&&ID&&ID!=''){
      } else if ((item.TypeName == 'ConsumablesReplaceHistoryList' || item.TypeID == 3|| item.TypeID == 14) && ID && ID != '') {
          //易耗品
          // item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + 3;
          item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeName == 'SparePartHistoryList' || item.TypeName == 'SparePartReplace' || item.TypeID == 28|| item.TypeID == 20) && ID && ID != '') {
          //备件
          item.formUrl = neturl + '/appoperation/appsparepartreplacerecord' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeName == 'StandardGasRepalceHistoryList' || item.TypeName == 'ReagentRepalceHistoryList' || item.TypeID == 4) && ID && ID != '') {
          //标气
          item.formUrl = neturl + '/appoperation/appstandardgasrepalcerecord' + '/' + ID + '/' + 4;
      } else if ((item.TypeName == 'WQCQFInspectionHistoryList' || item.TypeID == 5) && ID && ID != '') {
          //巡检 完全抽取法
          item.formUrl = neturl + '/appoperation/appcompleteextractionrecord' + '/' + ID + '/' + 5;
      } else if ((item.TypeName == 'XSCYFInspectionHistoryList' || item.TypeID == 6) && ID && ID != '') {
          //巡检 稀释采样法
          item.formUrl = neturl + '/appoperation/appdilutionsamplingrecord' + '/' + ID + '/' + 6;
      } else if ((item.TypeName == 'ZZCLFInspectionHistoryList' || item.TypeID == 7) && ID && ID != '') {
          //巡检 直接测量法
          item.formUrl = neturl + '/appoperation/appdirectmeasurementrecord' + '/' + ID + '/' + 7;
      } else if ((item.TypeName == 'JzHistoryList' || item.TypeID == 8 ) && ID && ID != '') {
          //校准
          item.formUrl = neturl + '/appoperation/appjzrecord' + '/' + ID + '/' + 8;
      } else if ((item.TypeName == 'BdTestHistoryList' || item.TypeID == 9) && ID && ID != '') {
          //校验
          item.formUrl = neturl + '/appoperation/appbdtestrecord' + '/' + ID + '/' + 9;
      } else if ((item.TypeName == 'DeviceExceptionHistoryList' || item.TypeID == 10) && ID && ID != '') {
          //数据异常
          item.formUrl = neturl + '/appoperation/appdeviceexceptionrecord' + '/' + ID + '/' + 10;
      } else if ((item.TypeName == 'Maintain' || item.TypeID == 27) && ID && ID != '') {
          //保养项更换记录表
          item.formUrl = neturl + '/appoperation/appmaintainrepalcerecord' + '/' + ID + '/' + 10;
      } else if ((item.TypeID == 58 || item.TypeID == 59 ) && ID && ID != '') {
          //设备故障小时记录 20220428没有|| item.TypeID == 60
          item.formUrl = neturl + '/appoperation/appfailurehoursrecord' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 64  && ID && ID != '') {
          //设备参数变动记录 废气
          item.formUrl = neturl + '/appoperation/appGasDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeID == 65||item.TypeID == 73)  && ID && ID != '') {
          //上月委托第三方检测次数
          item.formUrl = neturl + '/appoperation/appThirdPartyTestingContent' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeID == 18||item.TypeID == 63)  && ID && ID != '') {
          //数据一致性记录表 实时
          item.formUrl = neturl + '/appoperation/appDataConsistencyRealTime' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeID == 66||item.TypeID == 74)  && ID && ID != '') {
          //数据一致性记录表 小时与日数据
          item.formUrl = neturl + '/appoperation/appDataConsistencyRealDate' + '/' + ID + '/' + item.TypeID;
      } else if ((item.TypeID == 62||item.TypeID == 61)  && ID && ID != '') {
          //配合检查记录 
          item.formUrl = neturl + '/appoperation/appCooperaInspection' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 19  && ID && ID != '') {
          //实际水样对比实验结果记录表
          item.formUrl = neturl + '/appoperation/comparisonTestResults' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 72  && ID && ID != '') {
          // 设备参数核对记录 水
          item.formUrl = neturl + '/appoperation/appDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 15  && ID && ID != '') {
          // 试剂更换记录表 水
          item.formUrl = neturl + '/appoperation/appreagentreplaceRecord' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 70  && ID && ID != '') {
          // 标准溶液检查记录 水
          item.formUrl = neturl + '/appoperation/appStandardSolutionVerificationRecord' + '/' + ID + '/' + item.TypeID;
      } else if (item.TypeID == 16  && ID && ID != '') {
          // 校准记录表 污水
          item.formUrl = neturl + '/appoperation/appWaterQualityCalibrationRecord' + '/' + ID + '/' + item.TypeID;
      } else {
          item.formUrl = '';
      }
  });
};

module.exports = {
  formatTime: formatTime,
  getTabBarSelectedIndex: getTabBarSelectedIndex,
  createFormUrl:createFormUrl
}