import {
  CLASS_SUSPENSION_ENUM,
  ABLE_ADD_CLASS_STU_ENUM,
  BOLLEAN,
  COLUMN_TYPE,
  CONDITION_TYPE,
} from "./enum";
import Constants from "@/utils/constants";

export default {
  // 停课情况
  filterByClassSuspension(value, isEn) {
    const valueMap = {
      [CLASS_SUSPENSION_ENUM.NO_SUSPENSION]: isEn
        ? "No Suspension"
        : "无停课(30天以内)",
      [CLASS_SUSPENSION_ENUM.SHORT_SUSPENSION]: isEn
        ? "Short-term Suspension"
        : "短期停课(30-90天)",
      [CLASS_SUSPENSION_ENUM.LONG_SUSPENSION]: isEn
        ? "Long-term Suspension"
        : "长期停课(90+天)",
    };
    return valueMap[value] || "--";
  },

  // 可加课学员
  filterAbleAddStudent(value, isEn) {
    const valueMap = {
      [ABLE_ADD_CLASS_STU_ENUM.CURRENT_WEEK]: isEn
        ? "Students Who can Add Classes this Week"
        : "本周可加课学员",
      [ABLE_ADD_CLASS_STU_ENUM.NEXT_WEEK]: isEn
        ? "Students Who can Add Classes next Week"
        : "下周可加课学员",
      [ABLE_ADD_CLASS_STU_ENUM.CURRENT_MONTH]: isEn
        ? "Students Who can Add Classes this Month"
        : "本月可加课学员",
      [ABLE_ADD_CLASS_STU_ENUM.NEXT_MONTH]: isEn
        ? "Students Who can Add Classes next Month"
        : "下月可加课学员",
    };
    return valueMap[value] || "--";
  },

  // 是否
  filterYesOrNo(value, isEn) {
    const valueMap = {
      [BOLLEAN.NO]: isEn ? "No" : "否",
      [BOLLEAN.YES]: isEn ? "Yes" : "是",
    };
    return valueMap[value] || "--";
  },
  // 跟进类型
};

export const fieldMap = {
  studentFirstSingleCycle: "学生在读周期",
  parentFirstSingleCycle: "家长在读周期",
  parentCountryOfResidence: "地区",
  parentTimeDifference: "时差",
  subjectTypeId: "学科" /**1中文 2英文 */,
  xgUserStr: "学管老师",
  lastHandoverTime: "最近交接时间",
  lastFollowTime: "最近跟进时间",
  lastEndTimeWithDay:
    "上次完课时间+停课天数" /**前端拼接  lastClassEndTime + lastClassEndTimeCycle*/,
  nextClassStartTime: "下次上课时间",
  classCompletedThisWeekNum: "本周正常完课",
  classScheduledThisWeekNum: "本周已约未完课",
  classPlannedCompletedThisWeekNum: "本周预计完课",
  classCompletedThisMonthNum: "本月正常完课",
  classScheduledThisMonthNum: "本月已约未完课",
  classPlannedCompletedThisMonthNum: "本月预计完课",
  beforeThereMonthCompletedNum: "前三月平均月完课",
  threeWeekSchedulePercent:
    "三周约课对比" /**前端拼接  classCompletedLastWeekNum ： classPlannedCompletedThisWeekNum : classScheduledNextWeekNum*/,
  threeMonthSchedulePercent:
    "三月约课对比" /**前端拼接  classCompletedLastMonthNum ： classPlannedCompletedThisMonthNum：classScheduledNextMonthNum  */,
  studentAccountBalance: "学生课时",
  parentAccountBalance: "家长课时",
  parentCoinBalance: "家长积分",
  studentOrderNum: "N签",
  thisMonthHasOrder: "本月是否有订单" /** 0-没有 1-有 */,
  lastOrderTime: "最近订单时间",
  classCompletedTotalNum: "累计完课",
  couponList: "家长账户优惠券" /**string [] */,
  orderInfo:
    "订单情况" /** 前端拼接 待支付：parentOrderPaymentPendingNum ; 已下单：parentOrderPaymentCompletedNum ; 已取消： parentOrderPaymentCancelNum */,
  parentRemainingPunchInNum: "剩余打卡次数",
  parentRemainingPunchInTime: "上次打卡时间",
  parentRemainingPunchInUpload: "本周是否上传" /** 0-未成功，1-成功 */,
  parentRemainingPunchIn: "本周是否打卡" /** 0-未打卡，1-打卡 */,
  parentRemainingPunchInThisMonthNum: "本月已打卡次数",
};

export const fieldSortMap = {
  studentFirstSingleCycle: { sort: true, type: COLUMN_TYPE.CYCLE },
  parentFirstSingleCycle: { sort: true, type: COLUMN_TYPE.CYCLE },
  parentCountryOfResidence: { sort: false },
  parentTimeDifference: { sort: false },
  subjectTypeId: { sort: false },
  xgUserStr: { sort: false },
  lastHandoverTime: { sort: true },
  lastFollowTime: { sort: false },
  lastEndTimeWithDay: {
    sort: true,
  } /**前端拼接  lastClassEndTime + lastClassEndTimeCycle*/,
  nextClassStartTime: { sort: true },
  classCompletedThisWeekNum: { sort: true, type: COLUMN_TYPE.NUM },
  classScheduledThisWeekNum: { sort: true, type: COLUMN_TYPE.NUM },
  classPlannedCompletedThisWeekNum: { sort: true, type: COLUMN_TYPE.NUM },
  classCompletedThisMonthNum: { sort: true, type: COLUMN_TYPE.NUM },
  classScheduledThisMonthNum: { sort: true, type: COLUMN_TYPE.NUM },
  classPlannedCompletedThisMonthNum: { sort: true, type: COLUMN_TYPE.NUM },
  beforeThereMonthCompletedNum: { sort: true, type: COLUMN_TYPE.NUM },
  threeWeekSchedulePercent: {
    sort: false,
  } /**前端拼接  classCompletedLastWeekNum ： classPlannedCompletedThisWeekNum : classScheduledNextWeekNum*/,
  threeMonthSchedulePercent: {
    sort: false,
  } /**前端拼接  classCompletedLastMonthNum ： classPlannedCompletedThisMonthNum：classScheduledNextMonthNum  */,
  studentAccountBalance: { sort: true },
  parentAccountBalance: { sort: true },
  parentCoinBalance: { sort: true },
  studentOrderNum: { sort: true, type: COLUMN_TYPE.NTag },
  thisMonthHasOrder: { sort: false },
  lastOrderTime: { sort: true },
  classCompletedTotalNum: { sort: true, type: COLUMN_TYPE.NUM },
  couponList: { sort: false },
  orderInfo: {
    sort: false,
  } /** 前端拼接 待支付：parentOrderPaymentPendingNum ; 已下单：parentOrderPaymentCompletedNum ; 已取消： parentOrderPaymentCancelNum */,
  parentRemainingPunchInNum: { sort: true, type: COLUMN_TYPE.TIMES },
  parentRemainingPunchInTime: { sort: true },
  parentRemainingPunchInUpload: { sort: false },
  parentRemainingPunchIn: { sort: false },
  parentRemainingPunchInThisMonthNum: { sort: true, type: COLUMN_TYPE.TIMES },
};

export const transferSubmitData = (params) => {
  const searchParams = { ...params };
  for (const key in searchParams) {
    if (
      Array.isArray(searchParams[key]) &&
      searchParams[key].length &&
      searchParams[key].every((p) => (p + "").includes("-"))
    ) {
      searchParams[key] = searchParams[key].map((t) => {
        return {
          start: t.split("-")[0],
          end: t.split("-")[1] === "more" ? "" : t.split("-")[1],
        };
      });
    }
  }
  return searchParams;
};

export const mapFetchDataToState = (params, id) => {
  const formState = { ...params };
  for (const key in formState) {
    const valueArr = [];
    const excludeArr = [
      "addClassList",
      "rangeValue",
      "parentRemainingPunchInThisMonthNum",
    ];
    if (Array.isArray(formState[key]) && !excludeArr.includes(key)) {
      if (formState[key].length) {
        formState[key].forEach((item) => {
          if (Object.keys(item).every((t) => t === "start" || t === "end")) {
            const endVal = item["end"] ? item["end"] : "more";
            valueArr.push(`${item["start"]}-${endVal}`);
          }
        });
      }
      formState[key] = valueArr;
    } else {
      formState[key] = formState[key];
    }
  }
  formState.id = id;
  return formState;
};

const getAllFields = () => {
  return Object.keys(fieldMap).map((t) => {
    return {
      label: fieldMap[t],
      field: t,
    };
  });
};

const timeDiffList = () => {
  const arr = Array.from(Array(48), (v, k) => {
    return [
      {
        label: k - 24,
        value: (k - 24) * 60,
      },
      {
        label: k - 23.5,
        value: (k - 23.5) * 60,
      },
    ];
  });
  const finalArr = [];
  for (let t of arr) {
    finalArr.push(...t);
  }
  finalArr.shift();
  return finalArr;
};

const courseHours = () => {
  return Array.from(Array(200), (v, k) => {
    return {
      label: k + 1,
      value: k + 1,
    };
  });
};

const payTypes = (isEn) => {
  return [
    {
      label: isEn ? "Subscription" : "订阅制",
      value: "SUBSCRIBE",
    },
  ];
};

export const defaultTableColumnData = getAllFields();

export const conditionValueListFilter = (conditionName, currentLang) => {
  const isEn = currentLang === "en";
  const map = {
    [CONDITION_TYPE.DEPARTMENT]: [],
    [CONDITION_TYPE.COUNTRY]: [],
    [CONDITION_TYPE.SUBJECT]: Constants.subjectListAll(currentLang),
    [CONDITION_TYPE.COURSE_TYPE]: Constants.courseTypeList(isEn),
    [CONDITION_TYPE.PACKAGE]: [],
    [CONDITION_TYPE.PACKAGE_TREE]: [],
    [CONDITION_TYPE.TIME_DIFF]: timeDiffList(),
    [CONDITION_TYPE.PAY_TYPE]: payTypes(isEn),
    [CONDITION_TYPE.COURSE_HOURS]: courseHours(),
    [CONDITION_TYPE.TIME_ZONE]: Constants.timeZonesWithMin(),
    [CONDITION_TYPE.PARENT_LTO_LABEL]: Constants.packageLabelList(currentLang)
  };
  return map[conditionName] || [];
};

