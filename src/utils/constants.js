import * as ApiConstants from "./api_constants";
let localeLanguage = () => window.localStorage.getItem("localeLanguage");
let { partTimeJobTeacher, allTimeJobTeacher } = ApiConstants.default;

export const ABNORMAL_CODE = {
  /* 异常code, 此处定义的code不会在axios拦截器提示错误信息，在接口单独处理 */
  accountNotExists: 10028,
  validitySuperposition: 10029,
  costDuplication: 90003 /* 成本重复 */,
  noPermission: 403,
  parentAccountNotExist: 90004 /* 家长账号不存在 */,
  pointAccountNotExist: 90005 /* 积分账号不存在 */,
  existingClassHours: 800010 /*  无法隐藏，该学生存在剩余课时 */,
  noRechargeClass: 800020 /* 无法交接, 该学生没有充值课时 */,
  scheduledCoursesNumberFaild: 2070 /* 首次排课数量不能多于课程总数 */,
  classTypeApplyFaildAge: 2074 /* 学员年龄与课程要求不符，请选择其他课程报名 */,
  classTypeApplyFaildCapacity: 2075 /* 课程名额不足，报名失败 */,
  repeatRegistrationShuttleBus: 2076 /* 重复报名该班车 */,
  releaseOrAppointmentTimeConflict: 30002 /* 发布或者约课时间有冲突 */,
  /**转班二次code */
  hasLeaveClassCode: 30017 /*学生在当前班级有请假但未完成的课程 */,
  transferedInRecentTimeCode: 30018 /*改学员在30天内转过班 */,
  bothLeaveClassAndTransferedCode: 30020 /*学生在当前班级有请假但未完成的课程 &  改学员在30天内转过班 同时满足*/,
  noBindingsWeChat: 10030 /* 学管没有绑定企微账号 */,
  bindingWechatLimit: 70000 /* 家长绑定微信数量超过最大限制 */,
  enterpriseWechatAccountBound: 90001 /* 企微帐号已绑定 */,
  partStudentTimeBooked: 30441 /* 学生部分时间被占  */,
  allStudentTimeBooked: 30440 /* 学生全部时间被占  */,
  partOfTeacherTimeBooked: 30443 /* 老师时间部分被占  */,
  allTeacherTimeBooked: 30442 /* 老师时间全部被占  */,
};

export const ABNORMAL_CODE_LANG = {
  notCurrentXgCode: 30016 /* 不是当前学员的学管 */,
  trailClassEnableCode: 30015 /*试听课班级无法转班 */,
  restClassNumCode: 30004 /* 剩余课时不足不能转班*/,

  refreshCode: 30019 /*当前页面结果已变更，请刷新重试 */,
  hasCourseIn2HourCode: 20007 /*开课前2小时校验 */,
  addNewClassCode: 20002 /*用户已加入新班级 */,
  fullClassCode: 20003 /*班级容量达到上限 */,
  courseStudentsFull: 30012 /*本班级后续课堂人数已达到容量上限 */,
  missedClasses: 30013 /* 该学生在本班级存在未结束的补课课堂，暂时无法加入班级，请在补课课堂结束后重试 */,
  /**请假 */
  onlyXgLeaveClass: 30021 /**仅学生的学管/顾问和客服可以操作请假 */,
  leaveClassTimesEnable: 30022 /**请假次数不足，不可操作请假 */,
  hasCancleClass: 30023 /**本节课已取消，不可请假 */,
  hasLeaveClass: 30024 /**本节课已请假，不可再次请假*/,
  isAdjustCourse: 30025 /** 本节课为调课课程，不可请假*/,
  isAddCourse: 30026 /**本节课为补课课程，不可请假 */,
  before2Hours: 30027 /**上课前两小时内不可请假 */,
  abnormalAddClass: 30028 /**该节课为异常补课课堂，不可请假 */,
  tryClass: 30029 /**试听班型课堂，不可请假 */,
  courseHasBegin: 30030 /**课程已开始，不可请假 */,
  /**调课 */
  onlyXgAdjustCourse: 30041 /**仅学生的学管/顾问和客服可以操作调课 */,
  adjustTimesEnough: 30042 /**调课次数已达上限，不可调课 */,
  hanCancleCourse: 30043 /**本节课已取消，不可调课 */,
  hanLeaveCourse: 30044 /**本节课已请假，不可调课 */,
  hasAdjustCourse: 30045 /**本节课为调课课程，不可再次调课 */,
  isAddCourseForAdjust: 30046 /**本节课为补课课程，不可调课 */,
  before2HoursForAdjust: 30047 /**上课前两小时内不可调课 */,
  abnormalAddCourse: 30048 /**该节课为异常补课课堂，不可调课 */,
  tryCourse: 30049 /**试听班型课堂，不可调课 */,
  courseHasStart: 30050 /**课程已开始，不可调课 */,
  /**补课 */
  pleaseChangeTime: 30061 /**学员该时间段已被占用，请更换时间 */,
};

export const TRANSLATE_CLASS_REASON_TYPES = {
  PLATFORM_ADJUST: 1 /**平台调整班级 */,
  CHANE_TEACHER: 2 /**学员想换老师 */,
  CHANGE_TIME: 3 /**学员想换时间 */,
  DISTAKE_STUDENT: 4 /**学员不喜欢同学 */,
  TIME_ADJUST: 5 /**令时调整 */,
  MERGE_CLASS: 6 /**合班 */,
  CHANGE_VERSION: 7 /**换版本 */,
  END_SHORT_TERM: 8 /**短期课结束 */,
  OTHER: 9 /** 其他原因*/,
};

export const OUT_CLASS_BY_SYS_REASON_TYPES = {
  REMOVE_NORMALLY: 1 /**正常课消完毕移出班级 */,
  REMOVE_INVALID: 2 /**课时失效导致课时不足移出班级 */,
  REMOVE_TRANSFORM: 3 /**课时转换导致课时不足移出班级 */,
  OTHER: 100 /** 其他原因*/,
};

export const PLAY_BACK_TYPES = {
  EMPTY: 0 /**未生成 */,
  ABLE: 1 /**正常，可看回放 */,
  DELETE: 2 /**已删除 */,
  TO_ACTIVE: 3 /**已归档，待激活*/,
  ACTIVING: 4 /**激活中 */,
};

export const NO_DEPARTURE_CLASS_TYPE = 1; /* 未发车班型 */

export const DEPARTURE_CLASS_TYPE = 2; /* 已发车班型 */

export const AUDITION_COURSE = "0"; /* 试听课 */

export const FORMAL_COURSE = "1"; /* 正式课 */

export const ARTIFICAL_CLASS = 0; /* 人工班级 */

export const AUTOMATIC_CLASS = 1; /* 自动班级 */

export const SAME_PROGRESS = 1; /**同进度转班 */

export const NOT_SAME_PROGRESS = 2; /**非同进度转班 */

export const COURSE_PACKAGE_TYPE /* 课包类型 */ = {
  AUDITION_PACKAGE: AUDITION_COURSE,
  SYSTEM_COURSE_PACKAGE: FORMAL_COURSE,
  SPECIAL_COURSE_PACKAGE: 2,
  EXPANDED_COURSE_PACKAGE: 3,
  OPERATIONAL_COURSE_PACKAGE: 4,
};

export const DEALS_STATUS = {
  Schedule_Trial_Class: 2, //已约试听
  Complete_Trial_Class: 3, // 完成试听
  Order: 1, // 已成单
  Other: 4,
};

export const COURSE_PACKAGE_TYPE_CODE_NAME /* 课包类型 */ = {
  [COURSE_PACKAGE_TYPE.AUDITION_PACKAGE]: "试听课包",
  [COURSE_PACKAGE_TYPE.SYSTEM_COURSE_PACKAGE]: "系统课包",
  [COURSE_PACKAGE_TYPE.SPECIAL_COURSE_PACKAGE]: "专题课包",
  [COURSE_PACKAGE_TYPE.EXPANDED_COURSE_PACKAGE]: "拓展课包",
  [COURSE_PACKAGE_TYPE.OPERATIONAL_COURSE_PACKAGE]: "运营课包",
};

export const SUBJECT_TYPE /* 学科类型 */ = {
  CHINESE: 0,
  ENGLISH: 1,
  MATH: 2,
  MUSIC: 3,
  VOCAB: 6,
};

export const SUBJECT_TYPE_CODE_NAME /* 学科类型 code to Name */ = {
  [SUBJECT_TYPE.CHINESE]: "中文",
  [SUBJECT_TYPE.ENGLISH]: "英文",
  [SUBJECT_TYPE.MATH]: "数学",
  [SUBJECT_TYPE.MUSIC]: "音乐",
  [SUBJECT_TYPE.VOCAB]: "单词通",
};

export const CLASS_TYPE /* 上课形式 */ = {
  LIVE_1V1: 1,
  LIVE_SMALL_CLASS: 2,
  LIVE_BIG_CLASS: 3,
  RECORD_AND_BROADCAST_1V1: 4,
  RECORD_AND_BROADCAST_SMALL_CLASS: 5,
  RECORD_AND_BROADCAST_BIG_CLASS: 6,
};

export const CLASS_TYPE_CODE_NAME /* 上课形式 code to Name */ = {
  [CLASS_TYPE.LIVE_1V1]: "直播1V1",
  [CLASS_TYPE.LIVE_SMALL_CLASS]: "直播小班",
  [CLASS_TYPE.LIVE_BIG_CLASS]: "直播大班",
  [CLASS_TYPE.RECORD_AND_BROADCAST_1V1]: "录播1v1",
  [CLASS_TYPE.RECORD_AND_BROADCAST_SMALL_CLASS]: "录播小班",
  [CLASS_TYPE.RECORD_AND_BROADCAST_BIG_CLASS]: "录播大班",
};

export const COURSE_TYPE = {
  TRIAL: 0 /**试听 */,
  PAID: 1 /**正式 */,
};

export const LEAVE_CLASS_TYPE = {
  NO_USE: 1 /**未使用 */,
  OCCUPANCY: 2 /**已占用 */,
  USED: 3 /**已使用 */,
  FAILURE: 4 /**失效 */,
};

export const SEND_REASON_TYPE = {
  SYSTEM: 1 /**系统升级发放 */,
  FIRST_JOIN: 2 /**首次加入班级赠送 */,
  MONTH_SEND: 3 /**每月赠送 */,
  MANUAL_RELEASE: 4 /* 手动发放 */,
};

export const timeZones = () => {
  const arr = Array.from(Array(24), (v, k) => {
    return [
      {
        label: k - 12 > 0 || k - 12 === 0 ? `UTC+${k - 12}` : `UTC${k - 12}`,
        value: k - 12 > 0 || k - 12 === 0 ? `UTC+${k - 12}` : `UTC${k - 12}`,
      },
      {
        label:
          k - 11.5 > 0 || k - 11.5 === 0 ? `UTC+${k - 11.5}` : `UTC${k - 11.5}`,
        value:
          k - 11.5 > 0 || k - 11.5 === 0 ? `UTC+${k - 11.5}` : `UTC${k - 11.5}`,
      },
    ];
  });
  const finalArr = [];
  for (let t of arr) {
    finalArr.push(...t);
  }
  finalArr.push({ label: `UTC+12`, value: `UTC+12` });
  return finalArr;
};

// 操作明细type枚举
export const ACTIONLO_TYPE = {
  ACTIONLOG_ADJUST_EDITION: 1 /* 调整学生版本 */,
  ACTIONLOG_OTO_SUBSCRIBE_ONE: 2 /* 1v1单次约课 */,
  ACTIONLOG_OTO_SUBSCRIBE_MORE: 3 /* 1v1多次约课 */,
  ACTIONLOG_OTO_CANCEL_ONE: 4 /* 1v1单次取消约课 */,
  ACTIONLOG_OTO_CANCEL_MORE: 5 /* 1v1多次取消约课 */,
  ACTIONLOG_SMALL_LEAVE: 6 /* 小班课请假 */,
  ACTIONLOG_SMALL_ADJUST: 7 /* 小班课调课 */,
  ACTIONLOG_SMALL_REPAIR: 8 /* 小班课补课 */,
  ACTIONLOG_SMALL_OUT: 9 /* 小班课退班 */,
  ACTIONLOG_CONSUME_LOCAL: 10 /* 修改家长资料 */,
  ACTIONLOG_OTO_CANCEL_SYS: 11 /* 1v1系统取消约课 */,
  ACTIONLOG_SMALL_TRANSFER: 12 /* 小班课转班 */,
  DISTRIBUTE_MANUAL_ONE: 13 /* 首次分配学管 */,
  DISTRIBUTE_MANUAL_TWO: 14 /* 重新分配学管 */,
  DISTRIBUTE_MANUAL_SYSTEM: 15 /* 系统分配学管 */,
  ACTIONLOG_SMALL_JOIN: 16 /* 小班课加入班级 */,
  ACTIONLOG_SMALL_OUT_SYS: 17 /* 小班课退出班级 */,
  ACTIONLOG_SMALL_CANCEL_REPAIR_SYS: 17 /* 取消小班课补课课程 */,
  ACTIONLOG_OTO_ADJUST_TUTOR_LEAVE: 19 /* 老师请假发起调课 */,
  ACTIONLOG_OTO_ADJUST_STUDENT: 20 /* 1v1调课（学生调课 */,
  ACTIONLOG_SMALL_CANCEL_SYS: 21 /* 小班课取消课程 */,
  ACTIONLOG_CUSTOMER_UPDATE_PASSWORD: 22 /* 账号更改密码 */,
  ACTIONLOG_INVITE_INITIATE: 23 /* 老师约课申请 */,
  ACTIONLOG_INVITE_SUCCESS: 24 /* 老师约课成功 */,
  ACTIONLOG_INVITE_FAIL: 25 /* 老师约课失败 */,
  ACTIONLOG_OTO_ADJUST_TUTOR: 26 /* 1v1调课（老师调课） */,
  ACTIONLOG_Change_Time_Zone: 27 /* 1v1调课（老师调课） */,
  ACTIONLOG_Adjustment_of_classes: 28 /* 1v1调课（老师调课） */,
  ACTIONLOG_Adjustment_batch_of_classes: 31 /* 1v1批量调课（老师调课） */,
};
export const SNAPSHOT_TYPE = {
  LANGUAGE: "LANGUAGE",
  RULE: "RULE",
  AUTO_ASSIGN_EXIST_XG: "AUTO_ASSIGN_EXIST_XG",
};
export const AUTO_ASSIGN_TYPE = {
  SYSTEM_ALLOCATION: "SYSTEM_ALLOCATION",
  MANUAL_ALLOCATION: "MANUAL_ALLOCATION",
};
export const ASSIGN_CHANNEL_TYPE = {
  SYSTEM_RULE: "SYSTEM_RULE",
  ASSIGN_TASKS: "ASSIGN_TASKS",
  WAIT_DISTRIBUTION: "WAIT_DISTRIBUTION",
};
export default {
  // 在职状态列表
  getInServiceStatusList() {
    return [
      { value: 0, zh: "在职", en: "在职" },
      { value: 1, zh: "离职", en: "离职" },
    ];
  },
  startClassTimeData: [
    {
      label: "凌晨0:00-6:00",
      value: 0,
    },
    {
      label: "上午6:30-12:00",
      value: 1,
    },
    {
      label: "下午12:30-18:00",
      value: 2,
    },
    {
      label: "晚上18:30-24:00",
      value: 3,
    },
  ],
  startClassTimeOfData: [
    {
      start: "00:00",
      step: "00:30",
      end: "06:00",
    },
    {
      start: "06:30",
      step: "00:30",
      end: "12:00",
    },
    {
      start: "12:30",
      step: "00:30",
      end: "18:00",
    },
    {
      start: "18:30",
      step: "00:30",
      end: "24:00",
    },
  ],
  getMoneyList: [
    {
      label: "免费",
      value: 1,
    },
    {
      label: "新加坡小班课",
      value: 2,
    },
    {
      label: "亚欧小班课",
      value: 3,
    },
  ],
  times: [
    "00:00",
    "00:30",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ],
  /**
   * 老师教学年限
   */
  teacherTeachAgoList(currentLang = localeLanguage()) {
    return currentLang == "en"
      ? [
          {
            label: "Less than one year",
            value: -1,
          },
          {
            label: "1-3 years",
            value: 1,
          },
          {
            label: "3-5 years",
            value: 3,
          },
          {
            label: "5-8 years",
            value: 5,
          },
          {
            label: "8-10 years",
            value: 8,
          },
          {
            label: "More than 10 years",
            value: 10,
          },
        ]
      : [
          {
            label: "1年以下",
            value: -1,
          },
          {
            label: "1-3年",
            value: 1,
          },
          {
            label: "3-5年",
            value: 3,
          },
          {
            label: "5-8年",
            value: 5,
          },
          {
            label: "8-10年",
            value: 8,
          },
          {
            label: "10年以上",
            value: 10,
          },
        ];
  },
  /* 老师教学年限搜索（约课用 ）*/
  teacherBookTeachAgoList(isEn) {
    return isEn
      ? [
          {
            label: "Less than one year",
            value: 1,
          },
          {
            label: "1-3 years",
            value: 2,
          },
          {
            label: "3-5 years",
            value: 3,
          },
          {
            label: "5-8 years",
            value: 4,
          },
          {
            label: "8-10 years",
            value: 5,
          },
          {
            label: "More than 10 years",
            value: 6,
          },
        ]
      : [
          {
            label: "1年以下",
            value: 1,
          },
          {
            label: "1-3年",
            value: 2,
          },
          {
            label: "3-5年",
            value: 3,
          },
          {
            label: "5-8年",
            value: 4,
          },
          {
            label: "8-10年",
            value: 5,
          },
          {
            label: "10年以上",
            value: 6,
          },
        ];
  },
  /**
   * 老师现有学生数量
   */
  teacherNumOfStu(isEn) {
    return [
      {
        label: isEn ? "Within 10" : "10个以内",
        value: 1,
      },
      {
        label: isEn ? "10-20" : "10-20个",
        value: 2,
      },
      {
        label: isEn ? "20-40" : "20-40个",
        value: 3,
      },
      {
        label: isEn ? "40-60" : "40-60个",
        value: 4,
      },
      {
        label: isEn ? "More than 60" : "60个以上",
        value: 5,
      },
    ];
  },
  /**
   * 老师完课数量
   */
  teacherNumOfLessons(isEn) {
    return [
      {
        label: isEn ? "Less than 50 lessons" : "50节以内",
        value: 1,
      },
      {
        label: isEn ? "50-100" : "50-100节",
        value: 2,
      },
      {
        label: isEn ? "100-200" : "100-200节",
        value: 3,
      },
      {
        label: isEn ? "200-300" : "200-300节",
        value: 4,
      },
      {
        label: isEn ? "More than 300 lessons" : "300节以上",
        value: 5,
      },
    ];
  },
  teacherTypeList(currentLang = localeLanguage()) {
    return currentLang == "en"
      ? [
          {
            label: "Part Time Teacher",
            value: partTimeJobTeacher,
          },
          {
            label: "Full Time Teacher",
            value: allTimeJobTeacher,
          },
        ]
      : [
          {
            label: "兼职老师",
            value: partTimeJobTeacher,
          },
          {
            label: "全职老师",
            value: allTimeJobTeacher,
          },
        ];
  },
  /**
   * 更换老师标识
   */
  changeTeacher: "change",
  /**
   * 安排老师标识
   */
  setTeacher: "set",
  /**
   * 课程状态
   */
  classStatus: 0,
  /**
   * 单次排课
   */
  singleSetClass: 1,
  /**
   * 按天排课
   */
  byDaySetClass: 2,
  /**
   * 按周排课
   */
  byWeekSetClass: 3,
  /**
   * 结束方式：按课节总数
   */
  byClassSumEnd: 1,
  /**
   * 结束方式：按日期结束
   */
  byTimeEnd: 2,
  /**
   * 学生常用老师 数量
   */
  studentOftenTeacherNum: 10,
  /**
   * 取消课
   */
  cancelClassCode: 2,
  /**
   * 约课
   */
  appointClassCode: 1,
  /**
   * 用户最低余额
   */
  minimumMoney: 5,
  /**
   * 教师管理人员
   */
  teacherMtCode: 56,

  /**
   * 教师流程阶段
   */
  rollbackList: [
    { label: "新 注 册", peopleNum: 0, id: 1 },
    { label: "试 讲 阶 段", peopleNum: 0, id: 2 },
    { label: "教 学 培 训 阶 段", peopleNum: 0, id: 3 },
    { label: "技 术 培 训 阶 段", peopleNum: 0, id: 4 },
    { label: "终 面 阶 段", peopleNum: 0, id: 5 },
    { label: "磨 课 阶 段", peopleNum: 0, id: 6 },
    { label: "待 上 岗", peopleNum: 0, id: 7 },
  ],
  /**
   * 语言标签列表
   */
  langList(currentLang) {
    if (currentLang === "en") {
      return [
        { label: "No Tag", value: 0 },
        { label: "Japanese", value: 1 },
        { label: "Korean", value: 2 },
        { label: "Thailand", value: 3 },
        { label: "English", value: 4 },
      ];
    } else {
      return [
        { label: "无标签", value: 0 },
        { label: "日语", value: 1 },
        { label: "韩语", value: 2 },
        { label: "泰语", value: 3 },
        { label: "英语", value: 4 },
      ];
    }
  },
  /**
   * 年龄标签列表
   */
  ageList(currentLang) {
    if (currentLang == "en") {
      return [
        { label: "No Tag", value: 0 },
        { label: "Under 6 (excluding 6)", value: 5 },
        { label: "Age 6-8", value: 1 },
        { label: "Age 8-10", value: 2 },
        { label: "Age 10-12", value: 3 },
        { label: "Above 12 (excluding 12)", value: 4 },
      ];
    } else {
      return [
        { label: "无标签", value: 0 },
        { label: "6岁以下（不含6岁）", value: 5 },
        { label: "6-8" + "岁", value: 1 },
        { label: "8-10" + "岁", value: 2 },
        { label: "10-12" + "岁", value: 3 },
        { label: "12岁以上（不含12岁）", value: 4 },
      ];
    }
  },
  weekList(currentLang) {
    if (currentLang == "en") {
      return [
        { label: "Monday", value: 1 },
        { label: "Tuesday", value: 2 },
        { label: "Wednesday", value: 3 },
        { label: "Thursday", value: 4 },
        { label: "Friday", value: 5 },
        { label: "Saturday", value: 6 },
        { label: "Sunday", value: 7 },
      ];
    } else {
      return [
        { label: "周一", value: 1 },
        { label: "周二", value: 2 },
        { label: "周三", value: 3 },
        { label: "周四", value: 4 },
        { label: "周五", value: 5 },
        { label: "周六", value: 6 },
        { label: "周日", value: 7 },
      ];
    }
  },
  responsiblieTeam(currentLang) {
    if (currentLang === "en") {
      return [
        { label: "Beijing", value: 1 },
        { label: "Singapore", value: 2 },
        { label: "Indonesia", value: 3 },
        { label: "Thailand", value: 4 },
      ];
    } else {
      return [
        { label: "北京", value: 1 },
        { label: "新加坡", value: 2 },
        { label: "印尼", value: 3 },
        { label: "泰国", value: 4 },
      ];
    }
  },
  wordList: [
    { label: "未知", value: "0", hide: true },
    { label: "0", value: "1" },
    { label: "1-50", value: "2" },
    { label: "51-100", value: "3" },
    { label: "101-200", value: "4" },
    { label: "201-500", value: "5" },
    { label: "500以上", value: "6" },
  ],
  wordListEn: [
    { label: "unknown", value: "0", hide: true },
    { label: "0", value: "1" },
    { label: "1-50", value: "2" },
    { label: "51-100", value: "3" },
    { label: "101-200", value: "4" },
    { label: "201-500", value: "5" },
    { label: "Above 500", value: "6" },
  ],
  classTypeOptions: [
    { label: "一对一", value: 1 },
    { label: "小班课", value: 2 },
    { label: "大班课", value: 3 },
  ],
  functionCodeOptions: [
    { label: "未定义", value: 100100 },
    { label: "多职能", value: 100200 },
    { label: "销售", value: 200100 },
    { label: "客服", value: 200200 },
    { label: "学管", value: 200300 },
    { label: "教研", value: 200400 },
    { label: "教学管理", value: 200500 },
    { label: "教师招聘", value: 200501 },
    { label: "教师培训", value: 200502 },
    { label: "教师管理", value: 200503 },
    { label: "教学质检", value: 200504 },
    { label: "财务", value: 200600 },
    { label: "市场运营", value: 200700 },
    { label: "技术支持", value: 300100 },
    { label: "产品设计", value: 300200 },
    { label: "技术开发", value: 300300 },
    { label: "产品测试", value: 300400 },
    { label: "人力行政", value: 400100 },
    { label: "战略", value: 400200 },
    { label: "小班课运营", value: 200505 },
  ],
  reasonList: [
    { label: "课量过多", value: 1 },
    { label: "老师不想接试听", value: 2 },
    { label: "教学质量频繁出现问题", value: 3 },
    { label: "频繁请假", value: 4 },
    { label: "离职交接期", value: 5 },
    { label: "老师态度问题", value: 6 },
    { label: "老师质疑平台", value: 7 },
    { label: "课量达标", value: 9 },
    { label: "请假中", value: 10 },
    { label: "教学规范多次违规", value: 11 },
    { label: "PS", value: 12 },
    { label: "其他", value: 8 },
  ],
  // 教师在岗状态
  workingForTeacherList: [
    { label: "未上岗", value: 0 },
    { label: "在岗", value: 1 },
    { label: "离岗", value: 2 },
  ],
  // 教师开放状态
  openForTeacherList: [
    { label: "全部可教（试听/正式）", value: 0 },
    { label: "仅试听", value: 1 },
    { label: "仅正式", value: 2 },
    { label: "全部不可教", value: 3 },
    { label: "限制仅老生正式课", value: 4 },
  ],
  // 中文听说能力
  chineseAbility(isEn) {
    return isEn
      ? [
          {
            label: "Cannot understand nor speak Chinese",
            value: "1",
            disabled: true,
          },
          {
            label: "Understand but cannot speak Chinese",
            value: "2",
            disabled: true,
          },
          {
            label: "Understand and speak some Chinese",
            value: "3",
            disabled: true,
          },
          {
            label: "Understand and basic communication in Chinese",
            value: "4",
            disabled: true,
          },
          {
            label: "Understand and speak fluently",
            value: "5",
            disabled: true,
          },
          { label: "Others", value: "6", disabled: true },
          {
            label: "Can’t understand or speak Mandarin Chinese (Core)",
            value: "7",
          },
          {
            label:
              "Struggle to have daily conversations (e.g., can partially understand what’s said; can’t speak, or can only say simple words.) (Core)",
            value: "8",
          },
          {
            label: "Good with daily conversations (Discovery P3 or Advanced)",
            value: "9",
          },
        ]
      : [
          { label: "不会听说", value: "1", disabled: true },
          { label: "会听不会说", value: "2", disabled: true },
          { label: "会听会蹦词", value: "3", disabled: true },
          { label: "会听能简单交流", value: "4", disabled: true },
          { label: "听说流利", value: "5", disabled: true },
          { label: "其他", value: "6", disabled: true },
          { label: "不会听说 (标准版）", value: "7" },
          {
            label:
              "日常听说有障碍(e.g.只能听懂一部分，不能说或只能蹦简单词）（标准版）",
            value: "8",
          },
          { label: "日常听说基本没问题 (拓展版或进阶版）", value: "9" },
        ];
  },
  // 英文听说能力
  englishAbility(isEn) {
    return isEn
      ? [
          {
            label: "Can not understand basic expressions",
            value: "1",
          },
          {
            label: "Can understand and use basic expressions",
            value: "2",
          },
          {
            label: "Can understand  frequently used expressions",
            value: "3",
          },
          {
            label: "Can deal with most situations whilst travelling",
            value: "4",
          },
        ]
      : [
          { label: "无法理解日常表达", value: "1" },
          { label: "能够使用日常基本表达", value: "2" },
          { label: "能够使用常见表达", value: "3" },
          { label: "能够处理大多数的情况", value: "4" },
        ];
  },

  // 英文词汇水平
  englishWordLevelList(isEn) {
    return isEn
      ? [
          { label: "0-200 Words", value: "0-200 Words" },
          { label: "200-400 Words", value: "200-400 Words" },
          { label: "400-600 Words", value: "400-600 Words" },
          { label: "600-800 Words", value: "600-800 Words" },
          { label: "800-1500 Words", value: "800-1500 Words" },
          { label: "3000+ Words", value: "3000+ Words" },
        ]
      : [
          { label: "0-200单词", value: "0-200单词" },
          { label: "200-400单词", value: "200-400单词" },
          { label: "400-600单词", value: "400-600单词" },
          { label: "600-800单词", value: "600-800单词" },
          { label: "800-1500单词", value: "800-1500单词" },
          { label: "3000+单词", value: "3000+单词" },
        ];
  },

  // 家庭语言环境
  languageEnvironmentList(isEn) {
    return isEn
      ? [
          { label: "Not Set", value: "0", hide: true },
          { label: "Pure Chinese", value: "1", disabled: true },
          { label: "Pure English", value: "2", disabled: true },
          { label: "Chinese & English", value: "3", disabled: true },
          { label: "Chinese & Other", value: "4", disabled: true },
          { label: "English & Other", value: "5", disabled: true },
          { label: "Chinese & English & Other", value: "6", disabled: true },
          { label: "Pure Other", value: "7", disabled: true },
          {
            label:
              "Mandarin Chinese only, or mostly Mandarin Chinese (Discovery P3 or Advanced)",
            value: "8",
          },
          {
            label: "Other languages, or mostly other languages (Core)",
            value: "9",
          },
          {
            label:
              "Half Mandarin Chinese + half other languages (refer to the next item for curriculum placement)",
            value: "10",
          },
        ]
      : [
          { label: "未设置", value: "0", hide: true },
          { label: "纯中文", value: "1", disabled: true },
          { label: "纯英文", value: "2", disabled: true },
          { label: "中文+英文", value: "3", disabled: true },
          { label: "中文+其他语言", value: "4", disabled: true },
          { label: "英文+其他语言", value: "5", disabled: true },
          { label: "中文+英文+其他语言", value: "6", disabled: true },
          { label: "纯其他语言（非中文和英文）", value: "7", disabled: true },
          { label: "纯中文或大部分中文 (拓展版或进阶版）", value: "8" },
          { label: "其他语言或大部分其他语言（标准版）", value: "9" },
          { label: "一半中文+一半其他语言 (定版参考下一题）", value: "10" },
        ];
  },

  // 英文阅读水平
  englishReadLevelList(isEn) {
    return isEn
      ? [
          {
            label: "Can not read English stories",
            value: "1",
          },
          {
            label: "Can read simple picture stories",
            value: "2",
          },
          {
            label: "Can read graded readers",
            value: "3",
          },
          { label: "Can read chapter books", value: "4" },
        ]
      : [
          { label: "阅读零基础", value: "1" },
          { label: "能阅读简单的英文绘本", value: "2" },
          { label: "能阅读分级阅读", value: "3" },
          { label: "能阅读章节书", value: "4" },
        ];
  },
  // 英文书写水平
  englishWriteLevelList(isEn) {
    return isEn
      ? [
          { label: "Can not write", value: "1" },
          { label: "Can write letters", value: "2" },
          { label: "Can write words", value: "3" },
          {
            label: "Can write complete sentences",
            value: "4",
          },
          { label: "Can write paragraphs", value: "5" },
          { label: "Can write an essay", value: "6" },
        ]
      : [
          { label: "书写零基础", value: "1" },
          { label: "书写字母", value: "2" },
          { label: "书写词汇", value: "3" },
          { label: "书写表意正确的句子", value: "4" },
          { label: "书写段落", value: "5" },
          { label: "书写英文作文", value: "6" },
        ];
  },
  // 中文学习经历
  learningExperience(isEn) {
    return isEn
      ? [
          { label: "Never Learned", value: "1" },
          {
            label: "Parents has taught at home",
            value: "2",
          },
          { label: "Self-studied on Apps", value: "3", disabled: true },
          {
            label: "Studied in a educational",
            value: "4",
            disabled: true,
          },
          {
            label: "My child has taken online Mandarin Chinese lessons.",
            value: "6",
          },
          {
            label: "My child has taken in-person Mandarin Chinese lessons.",
            value: "7",
          },
          { label: "Others", value: "5" },
        ]
      : [
          { label: "没有学过", value: "1" },
          { label: "父母在家里教过", value: "2" },
          { label: "孩子在App自学过", value: "3", disabled: true },
          { label: "在机构报班学过", value: "4", disabled: true },
          { label: "孩子在线上学习过", value: "6" },
          { label: "孩子在线下学习过", value: "7" },
          { label: "其他", value: "5" },
        ];
  },
  // 英文学习经历
  learningExperienceEn(isEn) {
    return isEn
      ? [
          { label: "Never Learned", value: "1" },
          { label: "Taught by parents", value: "2" },
          { label: "App self-study App", value: "3" },
          { label: "Online centers", value: "4" },
          { label: "Offline centers", value: "5" },
          { label: "Others", value: "6" },
        ]
      : [
          { label: "从来没学过", value: "1" },
          { label: "家长在家教", value: "2" },
          { label: "自学", value: "3" },
          { label: "线上机构", value: "4" },
          { label: "线下机构", value: "5" },
          { label: "其他", value: "6" },
        ];
  },
  // 英文学习年限
  learningEnExperienceTime() {
    return [
      {
        label: 0,
        value: 0,
      },
      {
        label: 1,
        value: 1,
      },
      {
        label: 2,
        value: 2,
      },
      {
        label: 3,
        value: 3,
      },
      {
        label: 4,
        value: 4,
      },
      {
        label: "4+",
        value: "4+",
      },
      {
        label: 0,
        value: 0,
      },
    ];
  },
  // 中文使用情况
  chineseUsing(isEn) {
    return isEn
      ? [
          { label: "Only Chinese", value: "1" },
          {
            label: "Mostly Chinese; Barely Foreign Language",
            value: "2",
          },
          {
            label: "Barely Chinese; Mostly Foreign Language",
            value: "3",
          },
          {
            label: "No Chinese; Only Foreign Language",
            value: "4",
          },
        ]
      : [
          { label: "只用中文", value: "1" },
          { label: "大量中文和少量外语", value: "2" },
          { label: "少量中文和大量外语", value: "3" },
          { label: "不用中文，只用外语", value: "4" },
        ];
  },
  // 中文使用语言
  standardOrNotLang(isEn) {
    return isEn
      ? [
          { label: "Mandarin", value: "1" },
          {
            label: "Other Dialects (Cantonese,Hokkien, etc)",
            value: "2",
          },
        ]
      : [
          { label: "标准语（普通话）", value: "1" },
          { label: "方言（粤语、闽南语等）", value: "2" },
        ];
  },
  // 家长期望和要求
  parentalExpectations(isEn) {
    return isEn
      ? [
          {
            label:
              "Improve daily listening & speaking ability (daily life communication)",
            value: "1",
          },
          {
            label:
              "Improve comprehensive speaking expression ability (speech、discuss）",
            value: "2",
          },
          {
            label:
              "Improve basic reading and writing ability (write Chinese character, reading short essays)",
            value: "3",
          },
          {
            label:
              "Improve intensive reading & writing ability (able to write different style essays, read famous literacy work)",
            value: "4",
          },
          {
            label: "Enlightenment, cultivate interests",
            value: "5",
          },
          {
            label:
              "Improve cultural literacy (learn Chinese culture, literature and art)",
            value: "6",
          },
          {
            label: "Keep the same level of Chinese as the Children in China",
            value: "7",
          },
          { label: "Testing/Exam Need", value: "8" },
          { label: "Others", value: "9" },
        ]
      : [
          {
            label: "提升日常听说能力（日常生活交流）",
            value: "1",
          },
          {
            label: "提升综合口语表达能力（演讲、探讨）",
            value: "2",
          },
          {
            label: "提升基础读写能力（写字、阅读小短文）",
            value: "3",
          },
          {
            label: "提升精读、写作能力（写作各种文体、阅读长篇名著）",
            value: "4",
          },
          { label: "启蒙培养兴趣", value: "5" },
          {
            label: "提升文化素养（了解中国文化、文学）",
            value: "6",
          },
          {
            label: "保持和国内孩子等同的中文水平",
            value: "7",
          },
          { label: "考试需求", value: "8" },
          { label: "其他", value: "9" },
        ];
  },
  // 定级测试结果
  resultOfTestLevel() {
    return Array.from(Array(15), (v, k) => {
      return {
        label: `Lv${k + 1}`,
        value: k + 1,
      };
    });
  },
  // 进度类型
  progressTypes(isEn, showAll = false) {
    const baseItems = [
      {
        name: isEn ? "Formal" : "正式",
        value: 1,
      },
      {
        name: isEn ? "Audition" : "试听",
        value: 0,
      },
    ];
    const allItem = [
      {
        name: isEn ? "All" : "全部",
        value: null,
      },
    ];
    return showAll ? allItem.concat(baseItems) : baseItems;
  },
  // 进度创建方式
  progressCreateMethods(isEn) {
    return [
      {
        name: isEn ? "Parents purchase" : "家长购买",
        value: 0,
      },
      {
        name: isEn ? "Manual order" : "人工订单",
        value: 1,
      },
      {
        name: isEn ? "Class hour transfer" : "课时转移",
        value: 2,
      },
      {
        name: isEn ? "Class hour change" : "课时变化",
        value: 3,
      },
      {
        name: isEn ? "Point exchange" : "积分兑换",
        value: 4,
      },
      {
        name: isEn ? "Complimentary class hours" : "赠送课时",
        value: 5,
      },
      {
        name: isEn ? "Others" : "其他",
        value: 6,
      },
      {
        name: isEn ? "No history" : "历史无记录",
        value: 7,
      },
    ];
  },

  // 计算教师教学年限
  teachAgoComputed(time) {
    let date = time || new Date().toISOString();
    let workingDate = new Date(date),
      now = new Date(),
      nowYear = now.getFullYear(),
      workingYear = workingDate.getFullYear(),
      workingMonth = workingDate.getMonth(),
      workingDay = workingDate.getDate(),
      workingDateInThisYear = new Date(now.setMonth(workingMonth));
    workingDateInThisYear = workingDateInThisYear.setDate(workingDay);
    let teachingYear = nowYear - workingYear;
    if (workingDateInThisYear - now.getTime() > 0) {
      teachingYear--;
    }
    return teachingYear;
  },
  // 自动分配or人工分配
  assignMethodForAuto(isEn) {
    return [
      {
        name: isEn ? "System Assignment" : "自动分配",
        value: "SYSTEM_ALLOCATION",
      },
      {
        name: isEn ? "Manual Assignment" : "人工分配",
        value: "MANUAL_ALLOCATION",
      },
    ];
  },

  //分配途径
  assignChannels(isEn) {
    return [
      {
        name: isEn ? "Rules Of System Assignment" : "系统分配规则",
        value: "SYSTEM_RULE",
      },
      {
        name: isEn ? "Assignment Task" : "分配任务",
        value: "ASSIGN_TASKS",
      },
      {
        name: isEn ? "Unassigned List" : "待分配列表",
        value: "WAIT_DISTRIBUTION",
      },
    ];
  },

  subjectListAll(currentLang, isShowAll = false) {
    const commonConfig = [
      {
        label: currentLang === "en" ? "Chinese" : "中文",
        value: 0,
      },
      {
        label: currentLang === "en" ? "English" : "英文",
        value: 1,
      },
      {
        label: currentLang === "en" ? "Math" : "数学",
        value: 2,
      },
      {
        label: currentLang === "en" ? "AceVocab" : "单词通",
        value: 6,
      },
    ];
    const allItem = [
      { label: currentLang === "en" ? "all" : "全部", value: null },
    ];
    return isShowAll ? allItem.concat(commonConfig) : commonConfig;
  },
  subjectListNotMusic(currentLang, isShowAll = false) {
    const commonConfig = [
      {
        label: currentLang === "en" ? "Chinese" : "中文",
        value: 0,
      },
      {
        label: currentLang === "en" ? "English" : "英文",
        value: 1,
      },
      {
        label: currentLang === "en" ? "Math" : "数学",
        value: 2,
      },
    ];
    const allItem = [
      { label: currentLang === "en" ? "all" : "全部", value: null },
    ];
    return isShowAll ? allItem.concat(commonConfig) : commonConfig;
  },
  businessLineList(currentLang, isShowAll = false) {
    const commonConfig = [
      {
        label: currentLang === "en" ? "Chinese" : "中文",
        value: 1,
      },
      {
        label: currentLang === "en" ? "English" : "英文",
        value: 2,
      },
      {
        label: currentLang === "en" ? "Math" : "数学",
        value: 3,
      },
    ];
    const allItem = [
      { label: currentLang === "en" ? "all" : "全部", value: null },
    ];
    return isShowAll ? allItem.concat(commonConfig) : commonConfig;
  },
  packageLabelList(currentLang, isShowAll = false) {
    const commonConfig = [
      {
        label: currentLang === "en" ? "LTO" : "低接触",
        value: "LTO",
      },
    ];
    const allItem = [
      { label: currentLang === "en" ? "all" : "全部", value: null },
    ];
    return isShowAll ? allItem.concat(commonConfig) : commonConfig;
  },

  getDealsStatus(isEn) {
    return [
      {
        label: isEn ? "Schedule Trial" : "已约试听",
        value: DEALS_STATUS.Schedule_Trial_Class,
      },
      {
        label: isEn ? "Finished Trial" : "完成试听",
        value: DEALS_STATUS.Complete_Trial_Class,
      },
      {
        label: isEn ? "Paid Trial" : "已成单",
        value: DEALS_STATUS.Order,
      },
      {
        label: isEn ? "Other" : "其他",
        value: DEALS_STATUS.Other,
      },
    ];
  },

  timeZonesWithMin() {
    return timeZones().map((item) => {
      const t = item.label;
      let diff;
      let zone;
      let symble;
      if (t.includes("-")) {
        symble = "-";
        const arr = t.split("-");
        diff =
          arr[1].indexOf(".") > -1
            ? arr[1].replace(".5", ":30")
            : arr[1] + ":00";
        zone = arr[0];
      } else if (t.includes("+")) {
        symble = "+";
        const arr = t.split("+");
        diff =
          arr[1].indexOf(".") > -1
            ? arr[1].replace(".5", ":30")
            : arr[1] + ":00";
        zone = arr[0];
      }
      return {
        label: `${zone}${symble}${diff}`,
        value: `${zone}${symble}${diff}`,
      };
    });
  },

  courseTypeList(isEn) {
    return [
      {
        label: isEn ? "1v1" : "1v1",
        value: CLASS_TYPE.LIVE_1V1,
      },
      {
        label: isEn ? "Small Class" : "小班课",
        value: CLASS_TYPE.LIVE_SMALL_CLASS,
      },
    ];
  },
  yesOrNoConfig(currentLang, isShowAll = true) {
    const commonConfig = [
      {
        label: currentLang === "en" ? "Yes" : "是",
        value: true,
      },
      {
        label: currentLang === "en" ? "No" : "否",
        value: false,
      },
    ];
    const allItem = [
      { label: currentLang === "en" ? "All" : "全部", value: null },
    ];
    return isShowAll ? allItem.concat(commonConfig) : commonConfig;
  },

  getTrialClassStatus(currentLang, type) {
    if (type === 1) {
      return currentLang === "en" ? "Appointment audition" : "预约试听";
    } else if (type === 3) {
      return currentLang === "en" ? "Complete the audition" : "试听完成";
    } else if (type === 2) {
      return currentLang === "en" ? "Abnormal audition" : "试听异常";
    }
  },

  getClassType(currentLang) {
    if (currentLang === "en") {
      return [
        { label: "Ready schedule", value: "1" },
        { label: "Launched schedule", value: "2" },
      ];
    } else {
      return [
        { label: "未发车班型", value: NO_DEPARTURE_CLASS_TYPE },
        { label: "已发车班型", value: DEPARTURE_CLASS_TYPE },
      ];
    }
  },
  getTranslateClassType(isEn) {
    return [
      {
        label: isEn ? "Transfer Class at Same Progress" : "同进度转班",
        value: SAME_PROGRESS,
      },
      {
        label: isEn ? "Transfer Class at Different Progress" : "非同进度转班",
        value: NOT_SAME_PROGRESS,
      },
    ];
  },
  getWordList(currentLang) {
    if (currentLang === "en") {
      return [
        { label: "unknown", value: "0", hide: true },
        { label: "0", value: "1" },
        { label: "1-50", value: "2" },
        { label: "51-100", value: "3" },
        { label: "101-200", value: "4" },
        { label: "201-500", value: "5" },
        { label: "Above 500", value: "6" },
      ];
    } else {
      return [
        { label: "未知", value: "0", hide: true },
        { label: "0", value: "1" },
        { label: "1-50", value: "2" },
        { label: "51-100", value: "3" },
        { label: "101-200", value: "4" },
        { label: "201-500", value: "5" },
        { label: "500以上", value: "6" },
      ];
    }
  },

  // 学科
  subjectList(currentLang) {
    if (currentLang === "en") {
      return [
        { label: "Chinese", value: 0 },
        { label: "English", value: 1 },
        { label: "Math", value: 2 },
        { label: "Music", value: 3 },
        { label: "AceVocab", value: 4 },
      ];
    } else {
      return [
        { label: "中文", value: 0 },
        { label: "英文", value: 1 },
        { label: "数学", value: 2 },
        { label: "音乐", value: 3 },
        { label: "单词通", value: 6 },
      ];
    }
  },

  getAppealTypeList(isEn) {
    return !isEn
      ? [
          {
            label: "添加",
            value: 0,
          },
          {
            label: "移除",
            value: 1,
          },
        ]
      : [
          {
            label: "Add",
            value: 0,
          },
          {
            label: "Remove",
            value: 1,
          },
        ];
  },
  getDealStatusList(isEn) {
    return isEn
      ? [
          {
            label: "Processed",
            value: 1,
          },
          {
            label: "Pending",
            value: 0,
          },
        ]
      : [
          {
            label: "已处理",
            value: 1,
          },
          {
            label: "待处理",
            value: 0,
          },
        ];
  },
  // 申诉处理原因枚举值
  getDealReasonType() {
    return [
      {
        name: "调时令",
        value: 1,
      },
      {
        name: "换班次",
        value: 2,
      },
      {
        name: "换版本",
        value: 3,
      },
      {
        name: "学生升Level",
        value: 4,
      },
      {
        name: "专项拼音班",
        value: 5,
      },
      {
        name: "合班",
        value: 6,
      },
      {
        name: "代课",
        value: 7,
      },
      {
        name: "新接手学生剩余课量<=8",
        value: 8,
      },
      {
        name: "其他",
        value: 9,
      },
    ];
  },
  // 申诉处理结果枚举值
  getDealAppealResultType(isEn) {
    return !isEn
      ? [
          {
            name: "通过申诉",
            value: 1,
          },
          {
            name: "不通过申诉",
            value: 2,
          },
        ]
      : [
          {
            name: "Pass Appeal",
            value: 1,
          },
          {
            name: "Reject Appeal",
            value: 2,
          },
        ];
  },
  getTeacherAttendStatus(currentLang, status) {
    return {
      0: { zh: "未知", en: "Unknown" },
      1: { zh: "正常", en: "Normal" },
      2: { zh: "缺席", en: "Absent" },
      3: { zh: "迟到", en: "Late" },
      4: { zh: "早退", en: "Leave early" },
      5: { zh: "迟到早退", en: "Be late and leave early" },
    }[status]?.[currentLang];
  },
  getStudentAttendStatus(currentLang, status) {
    return {
      0: { zh: "未知", en: "Unknown" },
      1: { zh: "出席", en: "Attend" },
      2: { zh: "缺席", en: "Absent" },
    }[status]?.[currentLang];
  },
  getTranslateClassReasons(isEn) {
    return [
      {
        name: isEn ? "Platform unified adjustment class" : "平台调整班级",
        value: TRANSLATE_CLASS_REASON_TYPES.PLATFORM_ADJUST,
      },
      {
        name: isEn ? "Student want to change teacher" : "学员想换老师",
        value: TRANSLATE_CLASS_REASON_TYPES.CHANE_TEACHER,
      },
      {
        name: isEn ? "Student wants to change time" : "学员想换时间",
        value: TRANSLATE_CLASS_REASON_TYPES.CHANGE_TIME,
      },
      {
        name: isEn
          ? "Student don't like his(her) classmates"
          : "学员不喜欢同学",
        value: TRANSLATE_CLASS_REASON_TYPES.DISTAKE_STUDENT,
      },
      {
        name: isEn
          ? "Adjustment of Daylight Saving Time or Standard Time"
          : "令时调整",
        value: TRANSLATE_CLASS_REASON_TYPES.TIME_ADJUST,
      },
      {
        name: isEn ? "End of Short-term Course" : "短期课结束",
        value: TRANSLATE_CLASS_REASON_TYPES.END_SHORT_TERM,
      },
      {
        name: isEn ? "Others" : "其他原因",
        value: TRANSLATE_CLASS_REASON_TYPES.OTHER,
      },
    ];
  },
  // 有效期时长单位
  validityTypeList(isEn) {
    return isEn
      ? [
          { label: "year(s)", value: 0 },
          { label: "month(s)", value: 1 },
          { label: "day(s)", value: 2 },
        ]
      : [
          { label: "年", value: 0 },
          { label: "月", value: 1 },
          { label: "日", value: 2 },
        ];
  },
  // 订阅周期
  subscribeCycleList(isEn) {
    return isEn
      ? [
          { value: 0, label: "day(s)" },
          // { value: 1, label: 'week(s)'}, // 暂不展示
          { value: 2, label: "month(s)" },
          { value: 3, label: "year(s)" },
        ]
      : [
          { value: 0, label: "日" },
          // { value: 1, label: '周'}, // 暂不展示
          { value: 2, label: "月" },
          { value: 3, label: "年" },
        ];
  },
  // 建议学习时长
  studyLengthList(isEn) {
    return isEn
      ? [
          { value: 0, label: "1 Month" },
          { value: 1, label: "3 Months" },
          { value: 2, label: "6 Months" },
          { value: 3, label: "8 Months" },
          { value: 4, label: "1 Year" },
          { value: 5, label: "15 Months" },
          { value: 6, label: "2 Years" },
        ]
      : [
          { value: 0, label: "月度课包" },
          { value: 1, label: "季度课包" },
          { value: 2, label: "半年课包" },
          { value: 3, label: "8个月课包" },
          { value: 4, label: "年度课包" },
          { value: 5, label: "15个月课包" },
          { value: 6, label: "两年课包" },
        ];
  },
  // 有效期计算方式
  expireTypeList(isEn) {
    return isEn
      ? [
          { value: 0, label: "Starts upon last class points' expiry date" },
          { value: 1, label: "Starts upon class points added" },
        ]
      : [
          { value: 0, label: "从当前有效期结束开始计算" },
          { value: 1, label: "课时到账时开始计算" },
        ];
  },
  // 促销标签
  promotionTagList(isEn) {
    return isEn
      ? [
          { value: 0, label: "Popular" },
          { value: 1, label: "Best Value" },
          { value: "", label: "none" },
        ]
      : [
          { value: 0, label: "最热门" },
          { value: 1, label: "最划算" },
          { value: "", label: "无" },
        ];
  },
  payTypes(isEn) {
    return [
      {
        label: isEn ? "Subscription" : "订阅制",
        value: "SUBSCRIBE",
      },
    ];
  },
  limitsList(isEn) {
    return [
      {
        label: isEn ? "无限制" : "无限制",
        value: -1,
      },
      {
        label: isEn ? "只允许兑换一个" : "只允许兑换一个",
        value: 0,
      },
      {
        label: isEn ? "天" : "天",
        value: 1,
      },
    ];
  },
  orderList(isEn) {
    return [
      {
        label: isEn ? "System Order" : "系统订单",
        value: 0,
      },
      {
        label: isEn ? "Manual Order" : "人工订单",
        value: 1,
      },
      {
        label: isEn ? "All Order" : "全部订单",
        value: 2,
      },
    ];
  },
  streamWaterList(isEn) {
    return [
      {
        label: isEn ? "Synchronize" : "同步",
        value: 0,
      },
      {
        label: isEn ? "Import" : "导入",
        value: 1,
      },
      {
        label: isEn ? "All" : "全部",
        value: 2,
      },
    ];
  },
  /* 作废原因枚举 */
  nullifyReasonList(isEn) {
    return [
      {
        label: isEn ? "Invalid Item " : "无效",
        value: 1,
      },
      {
        label: isEn ? "Reconciliation Not Required " : "无需对账",
        value: 2,
      },
    ];
  },
  subjectTypeMap: {
    0: "zh",
    1: "en",
    2: "ma",
  },
  classTypeMap: {
    1: "付费课时",
    2: "赠送课时",
    3: "运营课时",
    4: "积分兑换课时",
  },
  getPayMethodChannel(isEn) {
    return [
      {
        label: isEn ? "alipay" : "alipay",
        value: 1,
      },
      {
        label: isEn ? "wechat" : "wechat",
        value: 2,
      },
      {
        label: isEn ? "union" : "union",
        value: 3,
      },
      {
        label: isEn ? "card" : "card",
        value: 4,
      },
      {
        label: isEn ? "atome" : "atome",
        value: 5,
      },
      {
        label: isEn ? "subscribe" : "subscribe",
        value: 6,
      },
      {
        label: isEn ? "affirm" : "affirm",
        value: 7,
      },
      {
        label: isEn ? "paynow" : "paynow",
        value: 8,
      },
      {
        label: isEn ? "ach" : "ach",
        value: 9,
      },
      {
        label: isEn ? "bank transfer" : "银行转账",
        value: 10,
      },
      {
        label: isEn ? "Zelle" : "Zelle",
        value: 11,
      },
    ];
  },
  filterCountryCodeListByCurrency: (currency) => {
    const map = {
      USD: [
        { code: "US", name: "美国", nameEn: "USA" },
        { code: "HK", name: "其他", nameEn: "Other" },
      ],
      SGD: [
        { code: "SG", name: "新加坡", nameEn: "Singapore" },
        { code: "HK", name: "其他", nameEn: "Other" },
      ],
      EUR: [
        {
          code: "AT",
          name: "奥地利",
          nameEn: "Austria",
        },
        {
          code: "BE",
          name: "比利时",
          nameEn: "Belgium",
        },
        {
          code: "BG",
          name: "保加利亚",
          nameEn: "Bulgaria",
        },
        {
          code: "HR",
          name: "克罗地亚",
          nameEn: "Croatia",
        },
        {
          code: "CY",
          name: "塞浦路斯",
          nameEn: "Cyprus",
        },
        {
          code: "CZ",
          name: "捷克",
          nameEn: "Czech Republic",
        },
        {
          code: "DK",
          name: "丹麦",
          nameEn: "Denmark",
        },
        {
          code: "EE",
          name: "爱沙尼亚",
          nameEn: "Estonia",
        },
        {
          code: "FI",
          name: "芬兰",
          nameEn: "Finland",
        },
        {
          code: "FR",
          name: "法国",
          nameEn: "France",
        },
        {
          code: "DE",
          name: "德国",
          nameEn: "Germany",
        },
        {
          code: "GR",
          name: "希腊",
          nameEn: "Greece",
        },
        {
          code: "HU",
          name: "匈牙利",
          nameEn: "Hungary",
        },
        {
          code: "IE",
          name: "爱尔兰",
          nameEn: "Ireland",
        },
        {
          code: "IT",
          name: "意大利",
          nameEn: "Italy",
        },
        {
          code: "LV",
          name: "拉脱维亚",
          nameEn: "Latvia",
        },
        {
          code: "LT",
          name: "立陶宛",
          nameEn: "Lithuania",
        },
        {
          code: "LU",
          name: "卢森堡",
          nameEn: "Luxembourg",
        },
        {
          code: "MT",
          name: "马耳他",
          nameEn: "Malta",
        },
        {
          code: "NL",
          name: "荷兰",
          nameEn: "Netherlands",
        },
        {
          code: "PL",
          name: "波兰",
          nameEn: "Poland",
        },
        {
          code: "PT",
          name: "葡萄牙",
          nameEn: "Portugal",
        },
        {
          code: "RO",
          name: "罗马尼亚",
          nameEn: "Romania",
        },
        {
          code: "SK",
          name: "斯洛伐克",
          nameEn: "Slovakia",
        },
        {
          code: "SI",
          name: "斯洛文尼亚",
          nameEn: "Slovenia",
        },
        {
          code: "ES",
          name: "西班牙",
          nameEn: "Spain",
        },
        {
          code: "SE",
          name: "瑞典",
          nameEn: "Sweden",
        },
        { code: "HK", name: "其他", nameEn: "Other" },
      ],
      HKD: [{ code: "HK", name: "香港", nameEn: "Hongkong" }],
      AUD: [
        { code: "AU", name: "澳大利亚", nameEn: "Australia" },
        { code: "HK", name: "其他", nameEn: "Other" },
      ],
      JPY: [
        { code: "JP", name: "日本", nameEn: "Japan" },
        { code: "HK", name: "其他", nameEn: "Other" },
      ],
    };
    return map[currency] || null;
  },
};
