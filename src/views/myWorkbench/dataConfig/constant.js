import {
  CLASS_SUSPENSION_ENUM,
  MONTH_CLASS_NUM_ENUM,
  CLASS_NUM_ENUM,
  ABLE_ADD_CLASS_STU_ENUM,
  COURSE_TIME_ENUM,
  PARENT_INTEGRAL,
  N_TAG,
  CLOCK_TIMES,
  BOLLEAN,
  TABS,
  CONDITION_TYPE,
  NEW_STUDENT_TYPE,
  CONDITION_STATUS,
} from "./enum";

import Filters, { fieldMap } from "./filter";
//停课情况筛选list
const getClassSuspensions = (isEn) => {
  return [
    {
      name: Filters.filterByClassSuspension(
        CLASS_SUSPENSION_ENUM.NO_SUSPENSION,
        isEn
      ),
      value: CLASS_SUSPENSION_ENUM.NO_SUSPENSION,
    },
    {
      name: Filters.filterByClassSuspension(
        CLASS_SUSPENSION_ENUM.SHORT_SUSPENSION,
        isEn
      ),
      value: CLASS_SUSPENSION_ENUM.SHORT_SUSPENSION,
    },
    {
      name: Filters.filterByClassSuspension(
        CLASS_SUSPENSION_ENUM.LONG_SUSPENSION,
        isEn
      ),
      value: CLASS_SUSPENSION_ENUM.LONG_SUSPENSION,
    },
  ];
};

// 本周正常完课筛选list、本周已约未上筛选list、本周预计完课筛选list
const getClassNums = (isEn) => {
  return [
    {
      name: CLASS_NUM_ENUM.ZERO,
      value: `${CLASS_NUM_ENUM.ZERO}-${CLASS_NUM_ENUM.ZERO}`,
    },
    {
      name: CLASS_NUM_ENUM.ONE,
      value: `${CLASS_NUM_ENUM.ONE}-${CLASS_NUM_ENUM.ONE}`,
    },
    {
      name: CLASS_NUM_ENUM.TWO,
      value: `${CLASS_NUM_ENUM.TWO}-${CLASS_NUM_ENUM.TWO}`,
    },
    {
      name: CLASS_NUM_ENUM.THREE,
      value: `${CLASS_NUM_ENUM.THREE}-${CLASS_NUM_ENUM.THREE}`,
    },
    {
      name: isEn ? "4 and above" : CLASS_NUM_ENUM.MORE,
      value: `${CLASS_NUM_ENUM.MORE.slice(
        0,
        CLASS_NUM_ENUM.MORE.length - 3
      )}-more`,
    },
  ];
};

// 本月正常完课、本月已约未上、本月预计完课筛选list
const getMonthClassNums = (isEn) => {
  return [
    {
      name: MONTH_CLASS_NUM_ENUM.ZERO,
      value: `${MONTH_CLASS_NUM_ENUM.ZERO}-${MONTH_CLASS_NUM_ENUM.ZERO}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.ONE,
      value: `${MONTH_CLASS_NUM_ENUM.ONE}-${MONTH_CLASS_NUM_ENUM.ONE}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.TWO,
      value: `${MONTH_CLASS_NUM_ENUM.TWO}-${MONTH_CLASS_NUM_ENUM.TWO}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.THREE,
      value: `${MONTH_CLASS_NUM_ENUM.THREE}-${MONTH_CLASS_NUM_ENUM.THREE}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.FOUR,
      value: `${MONTH_CLASS_NUM_ENUM.FOUR}-${MONTH_CLASS_NUM_ENUM.FOUR}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.FIVE_EIGHT,
      value: `${MONTH_CLASS_NUM_ENUM.FIVE_EIGHT}`,
    },
    {
      name: MONTH_CLASS_NUM_ENUM.EIGHT_TWL,
      value: `${MONTH_CLASS_NUM_ENUM.EIGHT_TWL}`,
    },
    {
      name: isEn ? "13 and above" : MONTH_CLASS_NUM_ENUM.MORE,
      value: `${MONTH_CLASS_NUM_ENUM.MORE.slice(
        0,
        MONTH_CLASS_NUM_ENUM.MORE.length - 3
      )}-more`,
    },
  ];
};
// 可加课学员筛选list
const getAbleAddStudents = (isEn) => {
  return [
    {
      name: Filters.filterAbleAddStudent(
        ABLE_ADD_CLASS_STU_ENUM.CURRENT_WEEK,
        isEn
      ),
      value: ABLE_ADD_CLASS_STU_ENUM.CURRENT_WEEK,
    },
    {
      name: Filters.filterAbleAddStudent(
        ABLE_ADD_CLASS_STU_ENUM.NEXT_WEEK,
        isEn
      ),
      value: ABLE_ADD_CLASS_STU_ENUM.NEXT_WEEK,
    },
    {
      name: Filters.filterAbleAddStudent(
        ABLE_ADD_CLASS_STU_ENUM.CURRENT_MONTH,
        isEn
      ),
      value: ABLE_ADD_CLASS_STU_ENUM.CURRENT_MONTH,
    },
    {
      name: Filters.filterAbleAddStudent(
        ABLE_ADD_CLASS_STU_ENUM.NEXT_MONTH,
        isEn
      ),
      value: ABLE_ADD_CLASS_STU_ENUM.NEXT_MONTH,
    },
  ];
};

// 学生课时筛选list、家长课时筛选list
const getCourseTimes = (isEn) => {
  return [
    {
      name: COURSE_TIME_ENUM.ZERO,
      value: `${COURSE_TIME_ENUM.ZERO}-${COURSE_TIME_ENUM.ZERO}`,
    },
    {
      name: COURSE_TIME_ENUM["1-20"],
      value: COURSE_TIME_ENUM["1-20"],
    },
    {
      name: COURSE_TIME_ENUM["21-40"],
      value: COURSE_TIME_ENUM["21-40"],
    },
    {
      name: COURSE_TIME_ENUM["41-60"],
      value: COURSE_TIME_ENUM["41-60"],
    },
    {
      name: COURSE_TIME_ENUM["61-80"],
      value: COURSE_TIME_ENUM["61-80"],
    },
    {
      name: isEn ? "81及以上" : COURSE_TIME_ENUM["80+"],
      value: `${COURSE_TIME_ENUM["80+"].slice(
        0,
        COURSE_TIME_ENUM["80+"].length - 3
      )}-more`,
    },
  ];
};

// 家长积分筛选list
const getParentIntegrals = (isEn) => {
  return [
    {
      name: PARENT_INTEGRAL.ZERO,
      value: `${PARENT_INTEGRAL.ZERO}-${PARENT_INTEGRAL.ZERO}`,
    },
    { name: PARENT_INTEGRAL["1-300"], value: PARENT_INTEGRAL["1-300"] },
    { name: PARENT_INTEGRAL["301-900"], value: PARENT_INTEGRAL["301-900"] },
    { name: PARENT_INTEGRAL["901-1500"], value: PARENT_INTEGRAL["901-1500"] },
    { name: PARENT_INTEGRAL["1501-3000"], value: PARENT_INTEGRAL["1501-3000"] },
    {
      name: isEn ? "3001 and above" : PARENT_INTEGRAL["3000+"],
      value: `${PARENT_INTEGRAL["3000+"].slice(
        0,
        PARENT_INTEGRAL["3000+"].length - 3
      )}-more`,
    },
  ];
};

// N签
const getNTags = (isEn) => {
  return [
    { name: N_TAG.ONE + "签", value: `${N_TAG.ONE}-${N_TAG.ONE}` },
    { name: N_TAG.TWO + "签", value: `${N_TAG.TWO}-${N_TAG.TWO}` },
    { name: N_TAG.THREE + "签", value: `${N_TAG.THREE}-${N_TAG.THREE}` },
    {
      name: isEn ? "4 Orders and above" : N_TAG.MORE,
      value: `${N_TAG.MORE.slice(0, N_TAG.MORE.length - 4)}-more`,
    },
  ];
};

// 本月是否续费、本周是够上传成功、本周是否打卡成功
const getIfConfigs = (isEn) => {
  return [
    {
      name: Filters.filterYesOrNo(BOLLEAN.YES, isEn),
      value: BOLLEAN.YES,
    },
    {
      name: Filters.filterYesOrNo(BOLLEAN.NO, isEn),
      value: BOLLEAN.NO,
    },
  ];
};

// 本月已打卡次数
const getClockTimes = () => {
  return [
    {
      name: CLOCK_TIMES.ZERO,
      value: CLOCK_TIMES.ZERO,
    },
    { name: CLOCK_TIMES.ONE, value: CLOCK_TIMES.ONE },
    { name: CLOCK_TIMES.TWO, value: CLOCK_TIMES.TWO },
    {
      name: CLOCK_TIMES.THREE,
      value: CLOCK_TIMES.THREE,
    },
    {
      name: CLOCK_TIMES.FOUR,
      value: CLOCK_TIMES.FOUR,
    },
  ];
};

import HandlePermission from "@/utils/handlePermission";

const { handleTabsPer } = HandlePermission;

// 后续会新增其他tab类型，目前只有「全部学生」
const tabList = (isEn) => {
  return [
    {
      name: isEn ? "Paid Students" : "正式学员",
      value: TABS.ALL_STUDENT,
      visible: handleTabsPer("teach.myWorkbench.myStudentNew.formalStudent"),
    },
    {
      name: isEn ? "Trial Students" : "试听学员",
      value: TABS.TRAIL_STUDENT,
      visible: handleTabsPer("teach.myWorkbench.myStudentNew.trailStudent"),
    },
  ];
};

// 学员列表所有可配置字段
const getAllFields = () => {
  return Object.keys(fieldMap);
};

export {
  getClassSuspensions,
  getClassNums,
  getMonthClassNums,
  getAbleAddStudents,
  getCourseTimes,
  getParentIntegrals,
  getClockTimes,
  getNTags,
  getIfConfigs,
  tabList,
  getAllFields,
};

/**分配规则条件类型 */
export const getConditionList = (isEn) => {
  return [
    {
      name: isEn ? "Handover department" : "交接人部门",
      value: CONDITION_TYPE.DEPARTMENT,
    },
    {
      name: isEn ? "User Country" : "用户国家",
      value: CONDITION_TYPE.COUNTRY,
    },
    {
      name: isEn ? "Subject" : "学科",
      value: CONDITION_TYPE.SUBJECT,
    },
    {
      name: isEn ? "Package Type" : "课包类型",
      value: CONDITION_TYPE.COURSE_TYPE,
    },
    {
      name: isEn ? "Package Name" : "课包",
      value: CONDITION_TYPE.PACKAGE,
    },
    {
      name: isEn ? "Time Difference" : "时差",
      value: CONDITION_TYPE.TIME_DIFF,
    },
    {
      name: isEn ? "Time Zone" : "时区",
      value: CONDITION_TYPE.TIME_ZONE,
    },
    {
      name: isEn ? "Payment Method" : "付费方式",
      value: CONDITION_TYPE.PAY_TYPE,
    },
    {
      name: isEn ? "Number of Class Points" : "课时数量",
      value: CONDITION_TYPE.COURSE_HOURS,
    },
    {
      name: isEn ? "Course tree" : "课程树",
      value: CONDITION_TYPE.PACKAGE_TREE,
    },
    {
      name: isEn ? "Parent LTO Label" : "家长LTO标签",
      value: CONDITION_TYPE.PARENT_LTO_LABEL,
    },
    {
      name: isEn ? "Preferred service language" : "服务语言偏好",
      value: CONDITION_TYPE.SPECIAL_LANGUAGE,
    },
  ];
};

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

export const getNewStudentType = (isEn) => {
  return [
    {
      name: isEn ? "New student" : "完全新生",
      value: NEW_STUDENT_TYPE.COMPLETELY_NEWSTUDENT,
    },
    {
      name: isEn ? "New student in same subject under a parent" : "新生同科",
      value: NEW_STUDENT_TYPE.SAME_SUBJECT_STUDENT,
    },
    {
      name: isEn ? "New subject for the student" : "同生扩科",
      value: NEW_STUDENT_TYPE.SAME_STUDENT_EXPEND_SUBJECT,
    },
    {
      name: isEn ? "New student in new subject under a parent" : "新生扩科",
      value: NEW_STUDENT_TYPE.NEW_STUDENT_EXPEND_SUBJECT,
    },
  ];
};

export const FUNCTION_POINT = "workbentch_myStudent";
