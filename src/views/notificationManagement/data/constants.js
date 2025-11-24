import {
  ROLE_TYPE,
  TARGET_USER_TYPE,
  NOTIFICE_METHOD,
  SEND_TIME,
  WECHAT_JUMP,
  APP_TYPES,
  TIMES_ENUM,
  SENT_EVENT_TIMES,
  MESSAGE_STATUS,
  MSG_TYPE,
} from "./enum";
import { computed } from "@vue/composition-api";
import i18n from "@/assets/locales/index";

export default {
  getSendRoles(isEn) {
    return [
      {
        name: isEn ? "Student" : "学生",
        value: ROLE_TYPE.STUDENT,
      },
      {
        name: isEn ? "Parent" : "家长",
        value: ROLE_TYPE.PARENT,
      },
      {
        name: isEn ? "LA" : "学管",
        value: ROLE_TYPE.LA,
      },
      {
        name: isEn ? "Teacher" : "老师",
        value: ROLE_TYPE.TEACHER,
      },
      {
        name: isEn ? "Adviser" : "销售",
        value: ROLE_TYPE.CC,
      },
    ];
  },
  getSendTimes(isEn) {
    return [
      {
        name: isEn ? "Send immediately" : "立即发送",
        value: SEND_TIME.RIGHT,
      },
      {
        name: isEn ? "Timed push (1 time)" : "定时推送（1次）",
        value: SEND_TIME.ONCE,
      },
      {
        name: isEn ? "Cyclic push" : "循环推送",
        value: SEND_TIME.CYCLE,
      },
      {
        name: isEn ? "Conditional trigger" : "条件触发",
        value: SEND_TIME.EVENT,
      },
    ];
  },

  getAppTypes(isEn) {
    return [
      {
        name: isEn ? "Parent App" : "家长端",
        value: APP_TYPES.PARENT_APP,
      },
      {
        name: isEn ? "Student App" : "学生端",
        value: APP_TYPES.STUDENT_APP,
      },
      {
        name: isEn ? "Student Ipad" : "学生端平板",
        value: APP_TYPES.STUDENT_IPAD,
      },
    ];
  },
  /**每天 周  */
  getSendCycles(isEn) {
    return [
      {
        name: isEn ? "every day" : "每天",
        value: TIMES_ENUM.DAY,
      },
      {
        name: isEn ? "every week" : "每周",
        value: TIMES_ENUM.WEEK,
      },
    ];
  },

  getSendDays(isEn) {
    return [
      {
        name: isEn ? "Monday" : "周一",
        value: TIMES_ENUM.Monday,
      },
      {
        name: isEn ? "Tuesday" : "周二",
        value: TIMES_ENUM.Tuesday,
      },
      {
        name: isEn ? "Wednesday" : "周三",
        value: TIMES_ENUM.Wednesday,
      },
      {
        name: isEn ? "Thursday" : "周四",
        value: TIMES_ENUM.Thursday,
      },
      {
        name: isEn ? "Friday" : "周五",
        value: TIMES_ENUM.Friday,
      },
      {
        name: isEn ? "Saturday" : "周六",
        value: TIMES_ENUM.Saturday,
      },
      {
        name: isEn ? "Sunday" : "周日",
        value: TIMES_ENUM.Sunday,
      },
    ];
  },

  getSendWeeks(isEn) {
    return [
      {
        name: isEn ? "FirstWeek" : "第一周",
        value: TIMES_ENUM.FirstWeek,
      },
      {
        name: isEn ? "SecondWeek" : "第二周",
        value: TIMES_ENUM.SecondWeek,
      },
      {
        name: isEn ? "ThirthWeek" : "第三周",
        value: TIMES_ENUM.ThirthWeek,
      },
      {
        name: isEn ? "ForthWeek" : "第四周",
        value: TIMES_ENUM.ForthWeek,
      },
    ];
  },
  messageStatusColor: {
    [MESSAGE_STATUS.PENDING_REVIEW]: "#0E7490",
    [MESSAGE_STATUS.TO_BE_SENT]: "#7580E5",
    [MESSAGE_STATUS.IN_PROGRESS]: "#4D7C0F",
    [MESSAGE_STATUS.CANCELLED]: "#BE123C",
    [MESSAGE_STATUS.HAS_BEEN_SENT]: "#71717A",
  },
  messageStatusList: computed(() => [
    {
      label: i18n.t("待审核"),
      value: MESSAGE_STATUS.PENDING_REVIEW,
    },
    {
      label: i18n.t("待发送"),
      value: MESSAGE_STATUS.TO_BE_SENT,
    },
    {
      label: i18n.t("进行中"),
      value: MESSAGE_STATUS.IN_PROGRESS,
    },
    {
      label: i18n.t("已取消"),
      value: MESSAGE_STATUS.CANCELLED,
    },
    {
      label: i18n.t("已完成"),
      value: MESSAGE_STATUS.HAS_BEEN_SENT,
    },
  ]),
  langList: [
    {
      name: "中文",
      id: "chinese",
    },
    {
      name: "英文",
      id: "english",
    },
  ],
  getTranslateText(code, languageList) {
    if (!languageList) return code;
    return languageList[code] || code;
  },
  getRedUserStatus(isEn) {
    return [
      {
        id: 1,
        name: isEn ? "Enable" : "启用",
      },
      {
        id: 0,
        name: isEn ? "Diasble" : "禁用",
      },
    ];
  },
  taskRangeList(isEn) {
    return [
      {
        id: 9223372036854775807,
        name: isEn ? "All Tasks" : "全部任务",
      },
      {
        id: 0,
        name: isEn ? "Api Tasks" : "API任务",
      },
      {
        id: 3,
        name: isEn ? "Assigned tasks" : "指定任务",
      },
    ];
  },
  msgTypeFilter(code, isEn, msgTypes) {
    const map = {
      [MSG_TYPE.PRIVATE]: isEn ? "Private Message" : "私信",
      [MSG_TYPE.PUSH]: isEn ? "Push" : "Push",
      [MSG_TYPE.SMS]: isEn ? "SMS" : "短信",
      [MSG_TYPE.CALL]: isEn ? "Call" : "电话",
      [MSG_TYPE.EMAIL]: isEn ? "Email" : "邮件",
      [MSG_TYPE.WECHAT]: isEn ? "WeChat Public account push" : "公众号",
    };
    // 本地没有记录的常量类型 将使用服务端的常量返回(未考虑 双语翻译)
    if (!map[code] && msgTypes) {
      const msgs = msgTypes.filter(data => (data.code === code))
      if (msgs.length) {
        return msgs[0]?.name
      }
    }
    return map[code] || "-";
  },
};

export const SOURCE = "ops";
