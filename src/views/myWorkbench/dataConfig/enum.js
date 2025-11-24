// 停课情况
export const CLASS_SUSPENSION_ENUM = {
  NO_SUSPENSION: "0-30", // 无停课
  SHORT_SUSPENSION: "31-90", // 短期停课
  LONG_SUSPENSION: "91-more", // 长期停课
};

// 本周正常完课、 本周已约未上、本周预计完课
export const CLASS_NUM_ENUM = {
  ZERO: "0",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  MORE: "4及以上",
};

// 本月正常完课、本月已约未上、本月预计完课
export const MONTH_CLASS_NUM_ENUM = {
  ZERO: "0",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE_EIGHT: "5-8",
  EIGHT_TWL: "9-12",
  MORE: "13及以上",
};

// 可加课学员
export const ABLE_ADD_CLASS_STU_ENUM = {
  CURRENT_WEEK: 1, // 本周可加课学员
  NEXT_WEEK: 2, // 下周可加课学员
  CURRENT_MONTH: 3, // 本月可加课学员
  NEXT_MONTH: 4, // 下月可加课学员
};

// 学生课时、家长课时
export const COURSE_TIME_ENUM = {
  ZERO: "0",
  "1-20": "1-20",
  "21-40": "21-40",
  "41-60": "41-60",
  "61-80": "61-80",
  "80+": "81及以上",
};

// 家长积分
export const PARENT_INTEGRAL = {
  ZERO: "0",
  "1-300": "1-300",
  "301-900": "301-900",
  "901-1500": "901-1500",
  "1501-3000": "1501-3000",
  "3000+": "3001及以上",
};

// N签
export const N_TAG = {
  ONE: "1", //1签
  TWO: "2", //2签
  THREE: "3", //3签
  MORE: "4签及以上", // 3+
};

// 本月打卡次数
export const CLOCK_TIMES = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
};

export const BOLLEAN = {
  YES: 1,
  NO: 0,
};

// 后续会新增其他tab类型，目前只有「全部学生」
export const TABS = {
  ALL_STUDENT: "0", //全部学生 ；二孩商机需求更名为’正式学生‘
  TRAIL_STUDENT: "1", // 试听学生
};

// 全部勾选项枚举
export const CHECK_ITEMS_ENUM = {
  /**基础信息勾选项 */
  AREA: "area",
  TIME_DIFF: "timeDiff", // 时差
  LA: "la",
  RECENT_SUBMIT_TIME: "recentSubmitTime", //最近提交时间
  LAST_RECOMMEND_TIME: "lastRecommondTime", //上次备注时间
  /**课消维度勾选项 */
  NEXT_CLASS_TIME: "nextClassTime", // 下次上课时间
  HISTORY_AVE_FINISH_COURSE: "historyAveFinishCourse", // 历史平均月完课
  COMPARE_THREE_WEEK: "compareThreeWeek", // 3周约课对比
  COMPARE_THREE_MONTH: "compareThreeMonth", // 3月完课对比
  /**续费维度勾选项 */
  LAST_PAY_TIME: "lastPayTime", // 上次续费时间
  ALL_FINISH_COURSE: "allFinishCourse", //累计完课
  COUPON_EXPIRED: "couponExpired", // 当月优惠券到期
  /**转介绍维度勾选项 */
  REST_CLOCK_TIMES: "restClockTimes", //剩余打卡次数
  LAST_CLOCK_TIME: "lastClockTimes", //上次打卡时间
};

// 跟进类型
export const FOLLOW_TYPE = {
  RI_CHANG: 1, // 日常沟通,
  KE_XIAO: 2, //课消沟通
  XU_FEI: 3, // 续费沟通
  ZHUAN: 4, //转介绍沟通
  XUE_QING: 5, //学情沟通
  FAN_KUI: 6, // 家长反馈
};

export const FOLLOW_LABEL = {
  [FOLLOW_TYPE.RI_CHANG]: "日常沟通",
  [FOLLOW_TYPE.KE_XIAO]: "课消沟通",
  [FOLLOW_TYPE.XU_FEI]: "续费沟通",
  [FOLLOW_TYPE.ZHUAN]: "转介绍沟通",
  [FOLLOW_TYPE.XUE_QING]: "学情沟通",
  [FOLLOW_TYPE.FAN_KUI]: "家长反馈",
};

export const COLUMN_TYPE = {
  CYCLE: "cycle",
  NUM: "chassNum",
  NTag: "NTag",
  TIMES: "times",
};

export const ASSIGN_CONFIG_TAB_TYPE = {
  AUTO_ASSIGN_RULE: 1, // 自动分配规则
  LA_ASSIGN_SETTING: 2, // 学管分配设置
};

export const ASSIGN_DATA_TYPE = {
  ASSIGN_STATISTICS: 1 /**分配统计 */,
  ASSIGN_RECORD: 2 /**分配记录 */,
};

export const ASSIGN_TYPE = {
  FIRST_ASSIGN: 1 /**首次分配 */,
  RE_ASSIGN: 2 /**重新分配 */,
};

export const ASSIGN_RULE_TYPE = {
  NORMAL_RULE: "GENERAL", // 常规规则
  DEFAULT_RULE: "FINAL", // 兜底规则
};

export const CONDITION_STATUS = {
  CONTAINE: "IN",
  EXCLUDE: "NOTIN",
};

/**条件字段类型 */
export const CONDITION_TYPE = {
  DEPARTMENT: "CC_USER_POST" /**交接人部门 */,
  COUNTRY: "USER_COUNTRY" /**国家 */,
  SUBJECT: "SUBJECT_ID" /**学科 */,
  COURSE_TYPE: "CLASS_TYPE_ID" /**课程类型 */,
  PACKAGE: "PACKAGE_ID" /**课包 */,
  PACKAGE_TREE: "packageTree" /**版本 */,
  TIME_DIFF: "TIME_DIFFERENCE" /**时差 */,
  PAY_TYPE: "PAYMENT_TYPE" /**付费方式 */,
  COURSE_HOURS: "ORDER_AMOUNT" /**课时数量 */,
  TIME_ZONE: "TIME_ZONE" /**时区 */,
  PACKAGE_TREE:"PACKAGE_TREE" /** 课程树 */,
  PARENT_LTO_LABEL:"PARENT_LTO_LABEL" /**家长LTO标签 */,
  SPECIAL_LANGUAGE:"SPECIAL_LANGUAGE"/**服务语言偏好 */,
};

/**新生类型 */
export const NEW_STUDENT_TYPE = {
  COMPLETELY_NEWSTUDENT: "NEW_STUDENT" /** 完全新生*/,
  SAME_SUBJECT_STUDENT: "NEW_STUDENT_SAME_SUBJECT" /** 新生同科*/,
  SAME_STUDENT_EXPEND_SUBJECT: "OLD_STUDENT_ADD_SUBJECT" /** 同生扩科*/,
  NEW_STUDENT_EXPEND_SUBJECT: "NEW_STUDENT_ADD_SUBJECT" /**新生扩科 */,
};

/**快照类型 */
export const SNAPSHOT = {
  NORMAL: 1, // 常规规则
  SPECIAL_LANG: 2, // 常规规则（特殊语言）
  AUTO_ASSIGN_ORIGIN: 3, // 自动归属原学管
};
