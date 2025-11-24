/**角色 */
export const ROLE_TYPE = {
  STUDENT: 1,
  PARENT: 2,
  LA: 3,
  TEACHER: 4,
};

/**目标用户 */
export const TARGET_USER_TYPE = {
  ALL: 0,
  TAG: 1 /**标签圈选 */,
  SELF: 2 /**自定义上传 */,
};

/**通知方式 chnnel id*/
export const NOTIFICE_METHOD = {
  ACCOUNT_PUSH: 3 /** 公众号推送*/,
  APP_PUSH_PARENT: 1 /** app push 家长端*/,
  EMAIL: 4 /**邮件 */,
};

/**发送时间 */
export const SEND_TIME = {
  RIGHT: 0 /**立即发送 */,
  ONCE: 1 /**一次性定时 */,
  CYCLE: 2 /**循环发送 */,
  EVENT: 3 /**基于事件定时 */,
};

export const EVENT_PARAMS = {
  EVENT_PRE_AFTER: "EVENT_PRE_AFTER",
  EVENT_TIME_VALUE: "EVENT_TIME_VALUE",
  EVENT_TIME_UNIT: "EVENT_TIME_UNIT",
};

/**公众号推送链接跳转 */
export const WECHAT_JUMP = {
  NONE: 0,
  LINK: 1, //指定落地页
  OPEN_APP: 2, //打开app
};

/**每天 每周 */
export const DAY_WEEK = {
  DAY: 1,
  WEEK: 2,
};

/**
 * 打开应用枚举
 */
export const APP_TYPES = {
  PARENT_APP: "parentApp",
  STUDENT_APP: "studentApp",
  STUDENT_IPAD: "studentIpad",
};

/**循环发送 */
export const TIMES_ENUM = {
  /**月 周 天 */
  WEEK: 2,
  DAY: 1,
  MONTH: 3,
  /**周一 - 周日 */
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
  Sunday: 1,
  /**第几周 */
  FirstWeek: "firshWeek",
  SecondWeek: "secondWeek",
  ThirthWeek: "thirthWeek",
  ForthWeek: "forthWeek",
};

export const MESSAGE_STATUS = {
  PENDING_REVIEW: 0 /* 待审核 */,
  TO_BE_SENT: 10 /* 待发送 */,
  IN_PROGRESS: 20 /* 进行中 */,
  CANCELLED: 30 /* 已取消 */,
  HAS_BEEN_SENT: 40 /* 已发送 */,
};

/**发送事件事件 */
export const SENT_EVENT_TIMES = {
  BEFORE: 1, // 事件发生前
  CURRENT: 0, // 时
  AFTER: -1, // 后
};

/**自然日 or 分钟 */
export const DAY_MINUTES = {
  DAY: "DAY",
  MINUTES: "MINUTE",
};

/**模板类型枚举-是否有标题 */
export const TITLE_TYPE = {
  HAS_TITLE: 1,
  NO_TITLE: 0,
};

/**模板类型枚举-是否可跳转 */
export const LINK_TYPE = {
  HAS_JUMP: 1,
  NO_JUMP: 0,
};

/**模板类型枚举-是否有可选模板 */
export const TEMPLATE_TYPE = {
  CAN_SELECT: 1,
  NO_SELECT: 0,
};

/**模板类型枚举-纯文本/富文本 */
export const TEXT_TYPE = {
  TEXT: 1,
  EDITOR: 2,
};

/**模板类型枚举-部分编辑/全编辑 */
export const EDIT_TYPE = {
  ALL: 1,
  PART: 0,
};

/**模板类型枚举-是否支持多语言*/
export const LANG_TYPE = {
  MULTI: 1,
  SINGLE: 0,
};

/**
 * msgtype
 */
export const MSG_TYPE = {
  PRIVATE: 1 /**私信 */,
  PUSH: 2 /**push */,
  SMS: 3 /**sms */,
  CALL: 4 /**外呼 */,
  EMAIL: 5 /**邮件 */,
  WECHAT: 6 /**微信 */,
};
