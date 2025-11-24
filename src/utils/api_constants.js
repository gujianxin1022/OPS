export default {
  /**
   * 待提交
   */
  reportStNoSubmit: 0,
  /**
   * 待审核
   */
  reportStSubmit: 1,
  /**
   *
   * 审核未通过
   */
  reportStNoPass: 2,
  /**
   * 审核通过
   */
  reportStPass: 3,
  /**
   * 报告审核通过但是不发送
   */
  reportPassButNotSend: 4,

  /**
   * 老师课表状态 取消
   */
  teacherTimetableCancel: 0,
  /**
   * 老师课表状态 预约成功
   */
  teacherTimetableSuccessed: 1,
  /**
   * 老师课表状态 已发布未预约
   */
  teacherTimetablePubNotAppoint: 2,
  /**
   * 老师课表状态 已预约未发布
   */
  teacherTimetableAppointNotPub: 3,
  /**
   * 班型标识 1 对 1
   */
  oneByOneClass: 1,
  /**
   * 小班课标识
   */
  smallGroup: 2,
  /**
   * 大班课标识
   */
  bigGroup: 3,
  /**
   * 学生预约成功
   */
  studentAppointSuccessed: 1,
  /**
   * 学生预占
   */
  studentWillStartClass: 3,
  /**
   * 强占30min
   */
  forciblyOccupy30Min: 4,
  /**
   * ops顾问约课code码
   */
  opsTeacherAppointCode: 5,
  /**
   * 常用老师
   */
  oftenTutor: 'often_tutor',
  /**
   * 可用老师
   */
  ableTutor: 'able_tutor',
  /**
   * 兼职老师标识
   */
  partTimeJobTeacher: 0,
  /**
   * 全职老师标识
   */
  allTimeJobTeacher: 1,
  /**
   * 新加坡老师
   */
  isSgTeacher: 1,
  /**
   * 非新加坡老师
   */
  notIsSgTeacher: 2,
  /**
   * 百家云标识
   */
  bjyCode: 2,
  /**
   * 拓客云标识
   */
  tkCode: 1,
  /**
   * 视图权限-菜单标识
   */
  menuViewCode: 1,
  /**
   * 视图权限-tab标识
   */
  tabViewCode: 2,
  /**
   * 视图权限-button标识
   */
  buttonViewCode: 3,
  /**
   * 老师未激活(status)
   */
  teacherNotActiveStatus: 0,
  /**
   * 老师激活(status)
   */
  teacherActivedStatus: 1,
  /**
   * 老师被封禁(status)
   */
  teacherProhibitionsStatus: 2,
  /**
   * 老师被封禁(status)
   */
  teacherDeletedStatus: 3,
  /**
   * 老师被隐藏(status)
   */
  teacherHidedStatus: 4,
  /**
   * 老师未上岗
   */
  teacherNotWorking: 0,
  /**
   * 老师上岗
   */
  teacherWorking: 1,
  /**
   * 离岗
   */
  teacherLeaveWorking: 2,
  /**
   * 老师对学生隐藏
   */
  teacherHiding: 1,
  /**
   * 老师对学生隐藏
   */
  teacherNotHiding: 0,
  /**
   * web端转介绍海报activityCode
   */
  activityCode: 'referrer',
  /**
   * web端转介绍海报channel
   */
  channel: 'referweb',
  /**
   * 青少版-产品id
   */
  youthsChinese1v1Id: 3,
  /**
   * 启蒙版-产品id
   */
  kidsChinese1v1Id: 6,
  /**
   * 第三方软文渠道码
   */
  thirdPartyChannelCode: 'PM-WC-WCC-NA-YTH',
  /**
   * 转介绍渠道码
   */
  refferChannelCode: 'RF-OTA-NA-NA-NA',
  /**
   * 处理申诉截止时间
   */
  appealStopTime: 'appeal_handle_stop_time',
   /*
   * 课程版本
   */
   courseEditionNn: 1,//进阶版P1
   courseEditionIn: 2,//国际版P1
   courseEditionSg: 3,//新加坡同步课 P1
   courseEditionBLNA: 4,//拓展版P1
   courseEditionBLSG: 5,//公开课
   courseEditionSGWC: 6,//新加坡写作课 P1
   courseTBLNA: 7,//拓展版P2
   advancedGroup: 8,//进阶版C1
   InternationalGroup: 9,//国际版C1
   courseNewAdvanced: 10,//进阶版P2
   courseNewInternationalGroup: 11,//国际版C2
   kidsEdition: 12,//启蒙版P1
   BlnaGroup: 13,//拓展版C1
   sga:14,   //新加坡词语补强课 P1
   sgb:15,   //新加坡技能增进课 P1
   sgoc:16,   //新加坡口语课 P1
   Singapore:17,  //国际版P2
   Kids:18, //进阶版25分钟 P1
   Foundation:19,  //基础版P1
   SingaporeProgramC1:20,//新加坡同步课 C1
   SGWritingClassC4:21,//新加坡写作课 C4
   EnglishEnrichmentC1:22,//英文外语班 C1
   EnglishProgramP1:23,//英文外语班 P1
   FoundationP2:24,//新基础版 P2
   HSKP1:25,//HSKP1
   NewFoundationProgramC1:26,//基础版 C1
   PREP2: 27, // 启蒙版 P2
   ADVP3: 28, // 进阶版 P3

   
}
