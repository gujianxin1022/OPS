import i18n from "@/assets/locales/index";
// 基础课酬类型选项
export const ruleTypeOptions = [
  { value: 1, label: i18n.t("国籍课酬") },
  { value: 2, label: i18n.t("学历课酬") },
  { value: 3, label: i18n.t("地区课酬") },
  { value: 4, label: i18n.t("资质课酬") },
  { value: 5, label: i18n.t("面试课酬") },
  { value: 6, label: i18n.t("专项培训课酬") },
  { value: 7, label: i18n.t("教师类型课酬") },
];
// 教师类型课酬类型选项
export const teacherTypeRuleOptions = [
  { value: 'tutorType', label: i18n.t("教师类型") }
];
// 等级课酬类型选项
export const djRuleTypeOptions = [
  { value: 8, label: i18n.t("等级规则") }
];
// 保护期课酬类型选项
export const bhqRuleTypeOptions = [
  { value: 7, label: i18n.t("保护期课酬") },
];
// 教学行为课酬类型选项
export const teachRuleTypeOptions = [
  { value: 9, label: i18n.t("迟到") },
  { value: 10, label: i18n.t("早退") },
  { value: 11, label: i18n.t("旷课") }
];
// 教师出席状态
export const teacherStatusOptions = [
  { value: 1, label: i18n.t("出席") },
  { value: 2, label: i18n.t("未出席") }
];
// 特殊补贴课酬类型选项
export const specialRuleTypeOptions = [
  { value: 12, label: i18n.t("特殊时段补贴课酬") },
  { value: 13, label: i18n.t("小班课补贴") },
  { value: 14, label: i18n.t("固定学生课酬") },
  { value: 15, label: i18n.t("slots供给量课酬") },
  { value: 16, label: i18n.t("教学秩序课酬") },
  { value: 17, label: i18n.t("课程质量课酬") }
];
// 试听课转化奖励类型选项
export const trialLessonRuleTypeOptions = [
  { value: 18, label: i18n.t("试听课补贴") },
];
// 全勤奖励类型选项
export const allRewardRuleTypeOptions = [
  { value: 19, label: i18n.t("全勤奖励") },
];
// 等级额外奖励类型选项
export const gradeRewardRuleTypeOptions = [
  { value: 20, label: i18n.t("等级额外奖励") },
];
// 学生取消课酬类型选项
export const studentCancelRuleTypeOptions = [
  { value: 21, label: i18n.t("1V1学生取消课") },
];
// 教师请假课酬类型选项
export const teacherLeaveRuleTypeOptions = [
  { value: 22, label: i18n.t("教师请假") },
];
// 质检扣款课酬类型选项
export const qualityTestRuleTypeOptions = [
  { value: 23, label: i18n.t("课程质检") },
];
// 投诉扣款课酬类型选项
export const complaintRuleTypeOptions = [
  { value: 24, label: i18n.t("投诉扣款") },
];
// 运算符选项
export const operatorStrOptions = [
  { value: "EQ", label: i18n.t("等于") },
  { value: "NE", label: i18n.t("不等于") }
];
// 运算符选项
export const operatorNumOptions = [
  { value: "EQ", label: i18n.t("等于") },
  { value: "GT", label: i18n.t("大于") },
  { value: "LT", label: i18n.t("小于") },
  { value: "GE", label: i18n.t("大于等于") },
  { value: "LE", label: i18n.t("小于等于") }
];
// 逻辑选项
export const logicOptions = [
  { value: "2", label: i18n.t("或") },
  { value: "1", label: i18n.t("且") }
];
// 基础课酬条件选项
export const gjOptions = [
  { value: "nationality", label: i18n.t("国籍") }
];
// 等级课酬条件选项
export const djIfOptions = [
  { value: "tutorLevel", label: i18n.t("等级") },
];
// 迟到条件选项
export const lateIfOptions = [
  { value: "studentAttendStatus", label: i18n.t("学生出席状态") },
  { value: "teacherAttendTime", label: i18n.t("教师出席时间") },
  { value: "teacherLateArrivalTime", label: i18n.t("教师迟到时间") }
];
// 早退条件选项
export const earlyIfOptions = [
  { value: "studentAttendStatus", label: i18n.t("学生出席状态") },
  { value: "teacherAttendTime", label: i18n.t("教师出席时间") },
  { value: "teacherLeaveEarlyTime", label: i18n.t("教师早退时间") }
];
// 旷课条件选项
export const absentIfOptions = [
  { value: "studentAttendStatus", label: i18n.t("学生出席状态") },
  { value: "teacherAttendTime", label: i18n.t("教师出席时间") },
  { value: "teacherAttendStatus", label: i18n.t("教师出席状态") }
];

// 保护期课酬条件选项
export const bhqIfOptions = [
  { value: "1", label: i18n.t("保护期") },
];     
// 特殊时段补贴课酬条件选项
export const specialTimeIfOptions = [
  { value: "classStartTime", label: i18n.t("开课时间（北京时间）") },
];
// 小班课补贴条件选项
export const smallClassIfOptions = [
  { value: "studentAttendNum", label: i18n.t("应出席人数") },
];
// 固定学生课酬、等级额外激励条件选项
export const fixedStudentIfOptions = [
  { value: "fixedStudentNum", label: i18n.t("固定学生数") },
  { value: "fixedStudentPercent", label: i18n.t("固定学生占比") },
];
// slots供给量课酬条件选项
export const slotsIfOptions = [
  { value: "pptSlotsNum", label: i18n.t("PPTslots开放数量") },
];
// 教学秩序课酬、等级额外激励条件选项
export const teachOrderIfOptions = [
  { value: "monthlyComplianceStatus", label: i18n.t("月度履约问题") },
];
// 课程质量课酬、等级额外激励条件选项
export const courseQualityIfOptions = [
  { value: "classroomQualityStatus", label: i18n.t("课程质量质检") },
];
// 月度履约问题条件选项
export const monthlyIfOptions = [
  { value: "0", label: i18n.t("合格") },
  { value: "1", label: i18n.t("不合格") },
];
// 试听课转化奖励条件选项
export const trialLessonIfOptions = [
  { value: "conversionNum", label: i18n.t("转化人数") },
];
// 全勤奖励条件选项
export const allRewardIfOptions = [
  { value: "classesLeaveNum", label: i18n.t("教师所带班级请假次数") },
  { value: "classesAbsenceNum", label: i18n.t("教师所带班级旷课次数") },
  { value: "classesLateArrivalNum", label: i18n.t("教师所带班级迟到次数") },
  { value: "coursePackageId", label: i18n.t("课包") }
];
// 等级额外奖励条件选项
export const gradeRewardIfOptions = [
  { value: "fixedStudentNum", label: i18n.t("固定学生数") },
  { value: "fixedStudentPercent", label: i18n.t("固定学生占比") },
  { value: "pptSlotsNum", label: i18n.t("PPTslots开放数量") },
  { value: "monthlyComplianceStatus", label: i18n.t("月度履约情况") },
  { value: "classroomQualityStatus", label: i18n.t("课程质量质检") }
];
// SetRewardsDialog字段选项
export const setRewardsOptions = [
  { value: "teacherClassCourseNum", label: i18n.t("教师所带班级课程数") },
  { value: "teacherMathCourseNum", label: i18n.t("教师本月所上课程数") }
];
// 学生取消条件选项
export const studentCancelIfOptions = [
  { value: "cancelTimeGapOfStart", label: i18n.t("取消时间距开课时间") }
];
// 教师请假条件选项
export const teacherLeaveIfOptions = [
  { value: "leaveTimeGapOfStart", label: i18n.t("请假时间距开课时间") },
  // { value: "quarterlyLeaveNum", label: "请假次数（季度）" },
];
// 质检扣款条件选项
export const qualityTestIfOptions = [
  { value: "qualityControlResult", label: i18n.t("质检结果") },
];
// 投诉扣款条件选项
export const complaintIfOptions = [
  { value: "complaintResults", label: i18n.t("投诉结果") },
];
// 投诉结果选项
export const complaintResultOptions = [
  { value: "1", label: i18n.t("有效投诉") },
];
// 学历选项
export const xlOptions = [
  { value: "degree", label: i18n.t("学历") }
];
// 地区选项
export const dqOptions = [
  { value: "currentAddress", label: i18n.t("地区") }
];
// 资质选项
export const zzOptions = [
  { value: "qualificationType", label: i18n.t("资格种类") },
  { value: "quaCertificate", label: i18n.t("教师资格证") },
  { value: "foreignLanguage", label: i18n.t("对外汉语教育相关证书") },
  { value: "mandarinCertificate", label: i18n.t("普通话等级证书") },
  { value: "engCertificate", label: i18n.t("英语相关资质证书") },
  { value: "canMinority", label: i18n.t("小语种") }
];
// 资质选项--中文 0
export const zzOptionsZh = [
  // { value: "quaCertificate", label: "教师资格证" },
  // { value: "foreignLanguage", label: "对外汉语教育相关证书" },
  // { value: "mandarinCertificate", label: "普通话等级证书" },
  // { value: "engCertificate", label: "英语相关资质证书" },
  // { value: "canMinority", label: "小语种" }
];
// 资质选项--英文 1
export const zzOptionsEn = [
  { value: "qualificationType", label: i18n.t("资格种类") },
];  
// 资质选项--数学 2
export const zzOptionsMath = [
  { value: "qualificationType", label: i18n.t("资格种类") },
];  
// 面试选项
export const msOptions = [
  { value: "playBackSubmitNum", label: i18n.t("面试") }
];
// 专项培训选项
export const zxOptions = [
  { value: "teacherCertification", label: i18n.t("专项培训") }
];
// 是否选项
export const isOrNoOptions = [
  { value: "1", label: i18n.t("是") },
  { value: "2", label: i18n.t("否") }
];
// 薪酬扣除类型选项
export const deductionTypeOptions = [
  { value: 2, label: i18n.t("薪酬扣除（百分比）") },
  { value: 1, label: i18n.t("薪酬扣除（金额）") }
];
// 课酬扣除类型选项 
export const feeTypeOptions = [
  { value: 2, label: i18n.t("课酬扣除（百分比）") },
  { value: 1, label: i18n.t("课酬扣除（金额）") }
];
// 薪酬补偿类型选项
export const compensationTypeOptions = [
  { value: 2, label: i18n.t("薪酬补偿（百分比）") },
  { value: 1, label: i18n.t("薪酬补偿（金额）") }
];
// 课酬发放
export const rewardTypeOptions = [
  { value: 2, label: i18n.t("课酬发放（百分比）") },
  { value: 1, label: i18n.t("课酬发放（金额）") }
];

