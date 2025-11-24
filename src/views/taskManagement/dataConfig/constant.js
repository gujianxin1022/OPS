import {
  BASE_CONDITION_TYPE,
  CONDITION_STATUS,
  TASK_TARGET_PARENT,
  TASK_TARGET_STUDENT,
  TASK_TARGET_PLAN,
  BEHAVIOR_CONDITION_TYPE,
  FINISH_CLASS_NORMALLY,
  FINISH_CLASS_ABNORMAL,
  CIRCULATION_BEHAVIOR,
  LEARNING_STATUS_BOARD,
  CHANGE_SALES_OWNERSHIP,
  TIME_SPAN_WEEKS,
  TIME_SPAN_MOUNTH,
} from "./enum";

/* 用户基本属性条件列表 */
export const getBaseConditionList = (isEn) => {
  return [
    {
      name: isEn ? "Learing progress type" : "课程进度类型",
      value: BASE_CONDITION_TYPE.COURSE_TYPE,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Class Package" : "课包",
      value: BASE_CONDITION_TYPE.COURSE_PACKAGE_ID,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Class type" : "上课类型",
      value: BASE_CONDITION_TYPE.CLASS_TYPE,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Subject" : "学科",
      value: BASE_CONDITION_TYPE.SUBJECT_ID,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Version" : "版本",
      value: BASE_CONDITION_TYPE.PACKAGE_TREE,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Payment Type" : "付费方式",
      value: BASE_CONDITION_TYPE.PAYMENT_TYPE,
      conditionTarget: TASK_TARGET_PLAN,
    },
    {
      name: isEn ? "Service mode" : "用户接触类型",
      value: BASE_CONDITION_TYPE.PARENT_LTO_LABEL,
      conditionTarget: TASK_TARGET_PARENT,
    },
  ];
};

/* 用户行为属性维度列表 */
export const getUserDimensionList = (isEn) => {
  return [
    {
      name: isEn ? "Parent" : "家长",
      value: TASK_TARGET_PARENT,
    },
    {
      name: isEn ? "Student" : "学生",
      value: TASK_TARGET_STUDENT,
    },
  ];
};

/* 用户行为属性条件列表 */
export const getBehaviorConditionList = (isEn) => {
  return [
    {
      name: isEn
        ? "# of days since the most recent task created"
        : "最近任务生成距今天数",
      value: BEHAVIOR_CONDITION_TYPE.LAST_TASK_CREATION_DAYS,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
    {
      name: isEn
        ? "# of days since the most recent class completed"
        : "最近正常完课距今天数",
      value: BEHAVIOR_CONDITION_TYPE.LAST_NORMAL_CLASS_COMPLETION_DAYS,
      conditionTarget: [TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "Points" : "课时",
      value: BEHAVIOR_CONDITION_TYPE.ACCOUNT_BALANCE,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "# of classes booked this month" : "本月约课数",
      value: BEHAVIOR_CONDITION_TYPE.CLASS_SCHEDULED_THIS_MONTH_NUM,
      conditionTarget: [TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "# of classes booked this week" : "本周约课数",
      value: BEHAVIOR_CONDITION_TYPE.CLASS_SCHEDULED_THIS_WEEK_NUM,
      conditionTarget: [TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "# of classes compelted this month" : "上月完课数",
      value: BEHAVIOR_CONDITION_TYPE.CLASS_COMPLETED_LAST_MONTH_NUM,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "# of classes compelted this week" : "上周完课数",
      value: BEHAVIOR_CONDITION_TYPE.CLASS_COMPLETED_LAST_WEEK_NUM,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "# of social sharing this month" : "本周打卡成功数",
      value: BEHAVIOR_CONDITION_TYPE.PUNCH_IN_THIS_WEEK_NUM,
      conditionTarget: [TASK_TARGET_PARENT],
    },
    {
      name: isEn ? "# of social sharing this week" : "本月打卡成功数",
      value: BEHAVIOR_CONDITION_TYPE.PUNCH_IN_THIS_MONTH_NUM,
      conditionTarget: [TASK_TARGET_PARENT],
    },
    {
      name: isEn ? "Remaining Reward Tokens" : "剩余积分数",
      value: BEHAVIOR_CONDITION_TYPE.COIN_BALANCE,
      conditionTarget: [TASK_TARGET_PARENT],
    },

    {
      name: isEn
        ? "Days from today for recent order"
        : "最近订单距离今天的天数",
      value: BEHAVIOR_CONDITION_TYPE.LAST_ORDER_DAYS_FROM_NOW,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
    {
      name: isEn ? "Payment period M(x)" : "付费周期M(x)",
      value: BEHAVIOR_CONDITION_TYPE.FIRST_SINGLE_CYCLE,
      conditionTarget: [TASK_TARGET_PARENT, TASK_TARGET_STUDENT],
    },
  ];
};

/* 任务包含状态  */
export const getConditionStatus = (isEn) => {
  return [
    {
      name: isEn ? "Included" : "包含",
      value: CONDITION_STATUS.CONTAINE,
    },
    {
      name: isEn ? "Exclude" : "不包含",
      value: CONDITION_STATUS.EXCLUDE,
    },
  ];
};

/* 课程进度类型下拉枚举  */
import {
  AUDITION_COURSE /* 试听课 */,
  FORMAL_COURSE /* 正式课 */,
} from "@/utils/constants";
export const getPlanTypeList = (isEn) => {
  return [
    {
      name: isEn ? "Formal class" : "正式课",
      value: FORMAL_COURSE,
    },
    {
      name: isEn ? "Audition class" : "试听课",
      value: AUDITION_COURSE,
    },
  ];
};

/* 任务生成条件-事件类型下拉 */
export const getEventTypeList = (isEn) => {
  return [
    {
      name: isEn ? "Complete a class" : "正常完课",
      value: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "End class with errors" : "异常完课",
      value: FINISH_CLASS_ABNORMAL,
    },
    {
      name: isEn ? "Change of follow-up staff" : "流转行为",
      value: CIRCULATION_BEHAVIOR,
    },
    {
      name: isEn ? "Learning Kanban" : "学情看板",
      value: LEARNING_STATUS_BOARD,
    },
    {
      name: isEn ? "Change of sales ownership" : "付费用户变更销售归属",
      value: CHANGE_SALES_OWNERSHIP,
    },
  ];
};

/* 任务生成条件-具体事件 */
export const getEventList = (isEn) => {
  return [
    {
      name: isEn ? "Complete a trial class" : "试听课下课",
      value: 1,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete a unit" : "单元课下课",
      value: 2,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete an even-number unit" : "偶数单元课下课",
      value: 3,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 1st class" : "第1课正常下课",
      value: 4,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 2nd class" : "第2课正常下课",
      value: 5,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 3rd class" : "第3课正常下课",
      value: 6,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 4th class" : "第4课正常下课",
      value: 7,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 5th class" : "第5课正常下课",
      value: 8,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 6th class" : "第6课正常下课",
      value: 9,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 7th class" : "第7课正常下课",
      value: 10,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 8th class" : "第8课正常下课",
      value: 11,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 9th class" : "第9课正常下课",
      value: 12,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 10th class" : "第10课正常下课",
      value: 13,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 11th class" : "第11课正常下课",
      value: 14,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Complete the 12th class" : "第12课正常下课",
      value: 15,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "End class with errors" : "异常下课",
      value: 17,
      eventType: FINISH_CLASS_ABNORMAL,
    },
    {
      name: isEn ? "1st-time assign programs to students" : "学生学科首次分配",
      value: 18,
      eventType: CIRCULATION_BEHAVIOR,
    },
    {
      name: isEn ? "Reassign programs to students" : "学生学科重新分配",
      value: 19,
      eventType: CIRCULATION_BEHAVIOR,
    },
    {
      name: isEn
        ? "1st-time assign learning progress to students"
        : "课程进度首次分配",
      value: 20,
      eventType: CIRCULATION_BEHAVIOR,
    },
    {
      name: isEn
        ? "Reassign learning progress to students"
        : "课程进度重新分配",
      value: 21,
      eventType: CIRCULATION_BEHAVIOR,
    },
    {
      name: isEn
        ? "Teacher has completed the unit report (all unit classes ended as scheduled)"
        : "老师填写完单元报告(所有单元课正常下课)",
      value: 22,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "Teacher has completed the unit report (even-numbered unit classes ended as scheduled)"
        : "老师填写完单元报告(偶数单元课正常下课)",
      value: 23,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "The unit class of a certain subject that ended as scheduled after the initial session following the subject distribution"
        : "某学科分配后老师首次填写单元报告",
      value: 24,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Course Difficulty Level" : "课程难易度",
      value: 25,
      eventType: LEARNING_STATUS_BOARD,
    },
    {
      name: isEn ? "Students present, teachers absent" : "学生出席，教师缺席",
      value: 26,
      eventType: FINISH_CLASS_ABNORMAL,
    },
    {
      name: isEn ? "Students absent, teachers present" : "学生缺席，教师出席",
      value: 27,
      eventType: FINISH_CLASS_ABNORMAL,
    },
    {
      name: isEn ? "Students absent, teachers present" : "学生缺席，教师出席",
      value: 27,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Students absent, teachers absent" : "学生缺席，教师缺席",
      value: 28,
      eventType: FINISH_CLASS_ABNORMAL,
    },
    {
      name: isEn
        ? "0 lessons left of  this version"
        : "版本距离结束还有0节",
      value: 29,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "1 lessons left of  this version"
        : "版本距离结束还有1节",
      value: 30,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "2 lessons left of  this version"
        : "版本距离结束还有2节",
      value: 31,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "3 lessons left of  this version"
        : "版本距离结束还有3节",
      value: 32,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "4 lessons left of  this version"
        : "版本距离结束还有4节",
      value: 33,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "5 lessons left of  this version"
        : "版本距离结束还有5节",
      value: 34,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "6 lessons left of  this version"
        : "版本距离结束还有6节",
      value: 35,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "7 lessons left of  this version"
        : "版本距离结束还有7节",
      value: 36,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "8 lessons left of  this version"
        : "版本距离结束还有8节",
      value: 37,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "9 lessons left of  this version"
        : "版本距离结束还有9节",
      value: 38,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "10 lessons left of  this version"
        : "版本距离结束还有10节",
      value: 39,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn
        ? "Replacement of teachers (non-substitute)"
        : "更换老师（非代课）",
      value: 40,
      eventType: FINISH_CLASS_NORMALLY,
    },
    {
      name: isEn ? "Warning for low scores in unit reports" : "单元报告低分预警",
      value: 41,
      eventType: LEARNING_STATUS_BOARD,
    },
    {
      name: isEn ? "Insufficient lessons" : "低约课量预警",
      value: 42,
      eventType: LEARNING_STATUS_BOARD,
    },
    {
      name: isEn ? "Absence status in the last 8 lessons" : "缺勤干预",
      value: 43,
      eventType: LEARNING_STATUS_BOARD,
    },
    {
      name: isEn ? "Change of sales ownership (no WeChat users)" : "付费用户变更销售归属（无微信用户）",
      value: 44,
      eventType: CHANGE_SALES_OWNERSHIP,
    },
    {
      name: isEn ? "Change of sales ownership (WeChat inheritance failed)" : "付费用户变更销售归属（微信继承失败）",
      value: 45,
      eventType: CHANGE_SALES_OWNERSHIP,
    },
  ];
};

/* 任务生成条件-具体时间跨度下拉 */
export const getTimeSpanList = (isEn) => {
  return [
    {
      name: isEn ? "Everyday" : "每天",
      value: 0,
    },
    {
      name: isEn ? "Every week" : "每周",
      value: TIME_SPAN_WEEKS,
    },
    {
      name: isEn ? "Every month" : "每月",
      value: TIME_SPAN_MOUNTH,
    },
  ];
};
/* 星期枚举  */
export const getWeekList = (isEn) => {
  return [
    {
      name: isEn ? "Mon." : "周一",
      value: "1",
    },
    {
      name: isEn ? "Tues." : "周二",
      value: "2",
    },
    {
      name: isEn ? "Wed." : "周三",
      value: "3",
    },
    {
      name: isEn ? "Thur." : "周四",
      value: "4",
    },
    {
      name: isEn ? "Fri." : "周五",
      value: "5",
    },
    {
      name: isEn ? "Sat." : "周六",
      value: "6",
    },
    {
      name: isEn ? "Sun." : "周日",
      value: "7",
    },
  ];
};

/* 星期枚举  */
export const getMounthList = () => {
  return Array.from(Array(31), (v, k) => {
    return {
      name: k + 1,
      value: k + 1,
    };
  });
};

/* 星期枚举  */
export const getTimeUnitList = (isEn) => {
  return [
    {
      name: isEn ? "Hour" : "小时",
      value: 1,
    },
    {
      name: isEn ? "Day" : "天",
      value: 2,
    },
  ];
};
