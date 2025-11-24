import ApiConstants from "./api_constants";
import DateTimeUtils from "./datetime_utils";
import { COURSE_TYPE } from "./constants";
import {
  TRANSLATE_CLASS_REASON_TYPES,
  OUT_CLASS_BY_SYS_REASON_TYPES,
  SEND_REASON_TYPE,
} from "@/utils/constants";

let localeLanguage = () => window.localStorage.getItem("localeLanguage"),
  currentLang = localeLanguage();
const mapWeek = (num, isEn) => {
  switch (num) {
    case 0:
      return isEn ? "Sunday" : "周日";
    case 1:
      return isEn ? "Monday" : "周一";
    case 2:
      return isEn ? "Tuesday" : "周二";
    case 3:
      return isEn ? "Wednesday" : "周三";
    case 4:
      return isEn ? "Thursday" : "周四";
    case 5:
      return isEn ? "Friday" : "周五";
    case 6:
      return isEn ? "Saturday" : "周六";
    case 7:
      return isEn ? "Sunday" : "周日";
    default:
      break;
  }
};
const processCode = (code) => {
  switch (code) {
    case 1:
      return currentLang == "en" ? "New Registration" : "新注册";
      break;
    case 2:
      return currentLang == "en" ? "On Trial" : "试讲阶段";
      break;
    case 3:
      return currentLang == "en"
        ? "Teaching Training in Progress"
        : "教学培训阶段";
      break;
    case 4:
      return currentLang == "en" ? "IT Training in Progress" : "技术培训阶段";
      break;
    case 5:
      return currentLang == "en" ? "Final Stage" : "终面阶段";
      break;
    case 6:
      return currentLang == "en" ? "Grinding Class Stage" : "磨课阶段";
      break;
    case 7:
      return currentLang == "en"
        ? "Waiting period of mount guard"
        : "待上岗阶段";
      break;
    case 8:
      return currentLang == "en" ? "Elimination Phase" : "淘汰阶段";
      break;
    case 9:
      return currentLang == "en" ? "Abandon Stage" : "放弃阶段";
      break;
    default:
      break;
  }
};
const teacherAttendStatusFilter = (code) => {
  switch (code) {
    case 0:
      return "正常";
      break;
    case 1:
      return "迟到";
      break;
    case 2:
      return "早退";
      break;
    case 3:
      return "旷课";
      break;
    case 4:
      return "迟到早退";
      break;
  }
};
// 异常结束原因
const abnormalFinishedResult = (code) => {
  switch (code) {
    case 0:
      return currentLang == "en" ? "normal" : "正常";
      break;
    case 1:
      return currentLang == "en" ? "Absence of students" : "学生缺席";
      break;
    case 2:
      return currentLang == "en"
        ? "Student equipment or network failure"
        : "学生设备或网络故障";
      break;
    case 3:
      return currentLang == "en" ? "Cancelled by students" : "被学生取消";
      break;
    case 11:
      return currentLang == "en" ? "Absence of Teachers" : "教师缺席";
      break;
    case 12:
      return currentLang == "en"
        ? "Teacher equipment or network failure"
        : "老师设备或者网络故障";
      break;
    case 20:
      return currentLang == "en" ? "Other reasons" : "其他原因";
      break;
    case 21:
      return currentLang == "en"
        ? "None of the students and teachers were present"
        : "学生老师均未出席";
      break;
    case 22:
      return currentLang == "en"
        ? "The teacher did not click the end of the lecture"
        : "老师未点击授课结束";
      break;
    default:
      break;
  }
};

const teacherAppealStatusFilter = (code) => {
  switch (code) {
    case 0:
      return "未申诉";
      break;
    case 1:
      return "待处理";
      break;
    case 2:
      return "暂未同意";
      break;
    case 3:
      return "已同意";
      break;
  }
};

const correctReasonFilter = (code) => {
  switch (code) {
    case 1:
      return "老师原因 - 家长投诉老师";
      break;
    case 2:
      return "老师原因 - 老师迟到早退";
      break;
    case 3:
      return "老师原因 - 老师教学质量相关问题";
      break;
    case 4:
      return "老师原因 - 老师设备和网络问题";
      break;
    case 5:
      return "老师原因 - 老师操作失误";
      break;
    case 6:
      return "学生原因 - 学生课前两小时内取消课程";
      break;
    case 7:
      return "学生原因 - 学生课前两小时外取消课程";
      break;
    case 8:
      return "学生原因 - 学生旷课";
      break;
    case 9:
      return "学生原因 - 学生设备异常";
      break;
    case 10:
      return "课程顾问原因 - 课程顾问操作失误";
      break;
    case 11:
      return "学管老师原因 - 学管操作失误";
      break;
    case 12:
      return "平台原因 - 平台系统异常";
      break;
    case 13:
      return "老师原因 - 老师旷课";
      break;
  }
};

const newCorrectReasonFilter = (code) => {
  switch (code) {
    case 1:
      return "老师原因 - 家长投诉老师";
      break;
    case 2:
      return "老师原因 - 老师迟到早退";
      break;
    case 3:
      return "老师原因 - 老师教学质量相关问题";
      break;
    case 4:
      return "老师原因 - 老师教学环境问题（环境、网络、设备）";
      break;
    case 5:
      return "老师原因 - 老师操作失误";
      break;
    case 6:
      return "学生原因 - 学生课前两小时内取消课程";
      break;
    case 7:
      return "学生原因 - 学生课前两小时外取消课程";
      break;
    case 8:
      return "学生原因 - 学生旷课";
      break;
    case 9:
      return "学生原因 - 学生设备异常";
      break;
    case 10:
      return "课程顾问原因 - 课程顾问操作失误";
      break;
    case 11:
      return "学管老师原因 - 学管操作失误";
      break;
    case 12:
      return "平台原因 - 平台系统异常";
      break;
    case 13:
      return "老师原因 - 老师旷课";
      break;
    case 14:
      return "老师原因 - 未及时批改作业";
      break;
    case 15:
      return "老师原因 - 教资教态问题（镜头、着装、形象、精神状态）";
      break;
    case 16:
      return "老师原因 - 教学质量问题（态度、投诉、退费）";
      break;
    case 17:
      return "老师原因 - 教授内容错误（上错课件、擅调进度、教错知识）";
      break;
  }
};

// 首课记录转换
const getFeedRecord = (code) => {
  switch (code) {
    case 1:
      return currentLang === "en" ? "Have Record" : "有记录";
      break;
    case "中文短链":
      return currentLang === "en" ? "Chn-H5" : "中文短链";
      break;
    case "中文海报":
      return currentLang === "en" ? "Chn-poster" : "中文海报";
      break;
    case "英文短链":
      return currentLang === "en" ? "Eng-H5" : "英文短链";
      break;
    case "英文海报":
      return currentLang === "en" ? "Eng-poster" : "英文海报";
      break;
    case "泰语短链":
      return currentLang === "en" ? "Th-H5" : "泰语短链";
      break;
    case "泰语海报":
      return currentLang === "en" ? "Th-poster" : "泰语海报";
      break;
    case "印尼语短链":
      return currentLang === "en" ? "Ind-H5" : "印尼语短链";
      break;
    case "印尼语海报":
      return currentLang === "en" ? "Ind-poster" : "印尼语海报";
      break;
    default:
      return currentLang === "en" ? "No Record" : "无记录";
      break;
  }
};

export default {
  // 返回学生阶段 0：新建；1:已约试听；2：试听异常；3:试听完成
  mapStudentProcess: (auditionStage) => {
    if (auditionStage == 1) {
      return currentLang == "en" ? "Schedule Trial Class" : "预约试听";
    } else if (auditionStage == 4) {
      return currentLang == "en" ? "Abnormal Trial Class" : "试听异常";
    } else if (auditionStage == 3) {
      return currentLang == "en" ? "Complete Trial Class" : "试听完成";
    }
  },
  highestDegreeFilters: (code) => {
    switch (code) {
      case 0:
        return "未上学";
        break;
      case 1:
        return "小学";
        break;
      case 2:
        return "初中";
        break;
      case 3:
        return "中专";
        break;
      case 4:
        return "高中";
        break;
      case 5:
        return "大专";
        break;
      case 6:
        return "本科";
        break;
      case 7:
        return "硕士";
        break;
      case 8:
        return "博士";
        break;
      default:
        break;
    }
  },
  mapFullWork: (num) => {
    if (num == null) {
      return "";
    } else if (num == 0) {
      return "兼职老师";
    } else {
      return "全职老师";
    }
  },
  /**
   * 根据status code 返回单元报告状态
   * @param {Number} num 单元报告status code
   */
  mapUnitReportStatus: (num) => {
    num = num * 1;
    if (num === ApiConstants.reportStNoSubmit) {
      return "待提交";
    } else if (num === ApiConstants.reportStSubmit) {
      return "待审核";
    } else if (num === ApiConstants.reportStNoPass) {
      return "审核未通过";
    } else if (num === ApiConstants.reportStPass) {
      return "审核通过";
    } else if (num === ApiConstants.reportPassButNotSend) {
      return "审核通过";
    } else {
      return "未知类型";
    }
  },

  /**
   * 根据 code 换算性别
   * @param {Number} str 性别
   */
  mapGender: (num, currentLang) => {
    switch (num) {
      case 0:
        return currentLang === "en" ? "unset" : "未设置";
        break;
      case 1:
        return currentLang === "en" ? "Male" : "男";
        break;
      case 2:
        return currentLang === "en" ? "Female" : "女";
        break;
      default:
        break;
    }
  },
  /**
   * 收费标准
   * @param {Number} num 收费标准
   */
  mapRechargeRule: (num) => {
    switch (num) {
      case null:
        return "";
        break;
      case 1:
        return currentLang == "en" ? "Free" : "免费";
        break;
      case 2:
        return currentLang == "en" ? "Singapore Small Class" : "新加坡小班课";
        break;
      case 3:
        return currentLang == "en" ? "Asia Europe Small Class" : "亚欧小班课";
        break;
      default:
        break;
    }
  },
  /**
   * 班型
   * @param {Number} num 班型
   */
  mapClassType: (num, isEn) => {
    switch (num) {
      case 1:
        if (isEn !== undefined) {
          return isEn ? "1 on 1" : "一对一";
        } else {
          return currentLang == "en" ? "1 on 1" : "一对一";
        }
        break;
      case 2:
        if (isEn !== undefined) {
          return isEn ? "Small class" : "小班课";
        } else {
          return currentLang == "en" ? "Small class" : "小班课";
        }
        break;
      case 3:
        return currentLang == "en" ? "Public class" : "大班课";
        break;
      default:
        break;
    }
  },
  mapWeek: mapWeek,

  teacherType: (num) => {
    switch (num) {
      case 1:
        return "新加坡老师";
        break;
      case 2:
        return "非新加坡老师";
        break;
      default:
        break;
    }
  },
  groupStatus: (num) => {
    switch (num) {
      case 0:
        return currentLang === "en" ? "close" : "关闭";
        break;
      case 1:
        return currentLang === "en" ? "In group" : "拼团中";
        break;
      case 2:
        return currentLang === "en" ? "Spell success" : "拼团成功";
        break;
      default:
        break;
    }
  },
  mapClassStatus: (num) => {
    switch (num) {
      case 0:
        return "已取消";
        break;
      case 1:
        return "未开始";
        break;
      case 2:
        return "开始上课";
        break;
      case 3:
        return "正常结束";
        break;
      case 4:
        return "异常结束";
        break;
      default:
        break;
    }
  },
  rechargeTypeFilter: (code) => {
    switch (code) {
      case 1:
        return currentLang == "en" ? "ordinary" : "普通";
        break;
      case 2:
        return currentLang == "en" ? "refill card" : "充值卡";
        break;
      case 3:
        return currentLang == "en" ? "Course package" : "课程包";
        break;
      default:
        break;
    }
  },
  orderStatusFilter: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "Pending Payment" : "待支付";
        break;
      case 1:
        return currentLang == "en" ? "Payment Done" : "已支付";
        break;
      case 2:
        return currentLang == "en" ? "Pay for failure" : "支付失败";
        break;
      case 3:
        return currentLang == "en" ? "Refund" : "退款";
        break;
      case 4:
        return currentLang == "en" ? "Repeat to pay" : "重复支付";
        break;
      case 5:
        return currentLang == "en" ? "Order cancellation" : "订单取消";
        break;
      case 6:
        return currentLang == "en" ? "Order a timeout" : "订单超时";
      default:
        break;
    }
  },
  getCourseType: (code, isEn) => {
    switch (code) {
      case 0:
        return isEn ? "Paid Lesson" : "正式课";
        break;
      case 1:
        return isEn ? "Trial Lesson" : "试听课";
        break;
      default:
        break;
    }
  },
  virtualclassType: (code, currentLang) => {
    switch (code) {
      case 1:
        return currentLang == "en" ? "Talk Cloud" : "拓课云";
        break;
      case 2:
        return currentLang == "en" ? "Baijia Cloud" : "百家云";
        break;
      case 3:
        return currentLang == "en" ? "LingoAce" : "LingoAce";
        break;
      default:
        break;
    }
  },
  courseStatus: (code, currentLang) => {
    switch (code) {
      case 1:
        return currentLang == "en" ? "Yet to Start" : "未开始";
        break;
      case 2:
        return currentLang == "en" ? "In Progress" : "正在上课";
        break;
      case 3:
        return currentLang == "en" ? "Ended" : "正常结束";
        break;
      case 4:
        return currentLang == "en" ? "Abort" : "异常结束";
        break;
      case 5:
        return currentLang == "en" ? "Reject" : "驳回处理";
        break;
      default:
        break;
    }
  },
  examineStatus: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "Pending" : "未审核";
        break;
      case 1:
        return currentLang == "en" ? "Approved" : "已审核";
        break;
      default:
        return "-";
        break;
    }
  },
  userSource: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "Organic Customer" : "自然用户";
        break;
      case 1:
        return currentLang == "en" ? "Referral" : "转介绍";
        break;
      case 2:
        return currentLang == "en" ? "Ambassador" : "城市合伙人";
        break;
      case 3:
        return currentLang == "en" ? "Investment channels" : "投放渠道";
        break;
      default:
        break;
    }
  },
  studentCurrentStage: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "Newly Created Student" : "新创建学生";
        break;
      case 1:
        return currentLang == "en" ? "Schedule Trial" : "已预约试听";
        break;
      case 3:
        return currentLang == "en" ? "Successful Trial" : "试听完成";
        break;
      case 2:
        return currentLang == "en" ? "Abnormal Trial" : "试听异常";
        break;
      default:
        break;
    }
  },
  isSchoolFilters: (code) => {
    switch (code) {
      case 0:
        return "已毕业";
        break;
      case 1:
        return "在读";
        break;
      default:
        break;
    }
  },
  /**
   * 服务协议过滤器
   */
  laborAgreementStatusFilters: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "Not Signed" : "未签";
        break;
      case 1:
        return currentLang == "en" ? "Signed" : "已签";
        break;
      case 2:
        return currentLang == "en" ? "Reject" : "驳回";
        break;
      default:
        break;
    }
  },
  /**
   * 大班课活动状态过滤
   */
  activityStatus: (code) => {
    switch (code) {
      case 0:
        return currentLang == "en" ? "In preparation" : "准备中";
        break;
      case 1:
        return currentLang == "en" ? "Registration in progress" : "报名中";
        break;
      case 2:
        return currentLang == "en" ? "End of registration" : "报名结束";
        break;
      case 3:
        return currentLang == "en" ? "Registration suspended" : "报名暂停";
        break;
      case 4:
        return currentLang == "en" ? "Not started" : "未开始";
        break;
      case 5:
        return currentLang == "en" ? "have in hand" : "进行中";
        break;
      case 6:
        return currentLang == "en" ? "suspend" : "暂停";
        break;
      case 7:
        return currentLang == "en" ? "end" : "结束";
        break;
      default:
        break;
    }
  },
  /**
   * 录播课视频状态-IPA培训视频状态
   */
  videoStatus: (code) => {
    switch (code) {
      case 1:
        return currentLang == "en" ? "Disable" : "禁用";
        break;
      case 0:
        return currentLang == "en" ? "available" : "可用";
        break;
      default:
        break;
    }
  },
  /**
   * 老师流程阶段filtercode
   */
  processCode,
  /**
   * 老师流程 流程说明
   */
  processDescription: (
    { examineStatus, rejectStage },
    currentLang = localeLanguage()
  ) => {
    if (examineStatus == 1) {
      return currentLang == "en" ? "normal" : "正常";
    } else if (examineStatus == 2) {
      return currentLang == "en"
        ? `Back from ${processCode(rejectStage, currentLang)}`
        : `回退自${processCode(rejectStage, currentLang)}`;
    } else {
      return "";
    }
  },
  isDeviceFilters: (code) => {
    switch (code) {
      case 1:
        return currentLang == "en" ? "Passed" : "通过";
        break;
      case 0:
        return currentLang == "en" ? "Failed" : "未通过";
        break;
      default:
        break;
    }
  },
  /**
   * 审核时间轴 颜色过滤
   */
  timeLineColor: (type) => {
    switch (type) {
      case 1:
        return "#0bbd87";
        break;
      case 2:
        return "#0bbd87";
        break;
      case 3:
        return "#F7A747";
        break;
      case 4:
        return "#f4818e";
        break;
      case 5:
        return "#f4818e";
        break;
      default:
        break;
    }
  },
  /**
   * 审核时间轴 标题过滤
   */
  timeLineTitle: (
    { type, stageAfter, stageBefore, statusAfter, statusBefore },
    currentLang = localeLanguage()
  ) => {
    if (stageBefore == 8) {
      return currentLang == "en"
        ? "Back to New Registration(From Removed Teacher Group)"
        : `回退到新注册阶段（自淘汰教师库）`;
    }
    if (stageBefore == 9) {
      return currentLang == "en"
        ? "Back to New Registration(From Teacher Group Who Give up Voluntarily)"
        : `回退到新注册阶段（自主动放弃教师库）`;
    }

    if (stageBefore == 7 && stageAfter == 7 && type == 2) {
      return currentLang == "en"
        ? "Waiting period of mount guard, review completed and move on to teacher list"
        : `待上岗阶段 审核通过 进入老师列表`;
    }
    switch (type) {
      case 1:
        return currentLang == "en" ? "Successfully Registered" : "注册成功";
        break;
      case 2:
        return currentLang == "en"
          ? `${processCode(
              stageBefore,
              currentLang
            )}, review completed and move on to ${processCode(
              stageAfter,
              currentLang
            )}`
          : `${processCode(
              stageBefore,
              currentLang
            )} 审核通过 并进入${processCode(stageAfter, currentLang)}`;
        break;
      case 3:
        return currentLang == "en"
          ? `${processCode(
              stageBefore,
              currentLang
            )}, review is not successful and back to ${processCode(
              stageAfter,
              currentLang
            )}`
          : `${processCode(
              stageBefore,
              currentLang
            )} 审核未通过 回退至${processCode(stageAfter, currentLang)}`;
        break;
      case 4:
        return currentLang == "en"
          ? `Review is not successful and be moved in ${processCode(
              stageBefore,
              currentLang
            )}`
          : `审核未通过在${processCode(stageBefore, currentLang)}被淘汰`;
        break;
      case 5:
        return currentLang == "en"
          ? `Teacher gave up in ${processCode(stageBefore, currentLang)}`
          : `老师在${processCode(stageBefore, currentLang)}主动放弃`;
        break;
      default:
        break;
    }
  },
  /**
   * 审核时间轴label映射
   */
  timeLineLable: (key, type) => {
    if (key == "outReason" && type == 4) {
      return currentLang == "en" ? "Reason for Elimination" : "淘汰原因";
    } else if (key == "outReason" && type == 5) {
      return currentLang == "en" ? "Reason to Give up" : "放弃原因";
    }
    switch (key) {
      case "tryTime":
        return currentLang == "en" ? "Trial Time" : "试讲时间";
        break;
      case "courseEdition":
        return currentLang == "en" ? "Version" : "版本";
        break;
      case "tryUser":
        return currentLang == "en" ? "Trial Examiner" : "试讲考官";
        break;
      case "teachTime":
        return currentLang == "en" ? "Training Date" : "教培时间";
        break;
      case "isTeach":
        return currentLang == "en" ? "Training Completed" : "完成教培";
        break;
      case "skillTime":
        return currentLang == "en" ? "Technical Training Time" : "技培时间";
        break;
      case "skillUser":
        return currentLang == "en" ? "Technical Trainer" : "技术培训师";
        break;
      case "millUser":
        return currentLang == "en" ? "Grinding Class Trainer" : "磨课培训师";
        break;
      case "courseAdvice":
        return currentLang == "en" ? "Suggested version" : "建议版本";
        break;
      case "millTime":
        return currentLang == "en" ? "Grinding Class Time" : "磨课时间";
        break;
      case "language":
        return currentLang == "en" ? "Teaching Language" : "教学语言";
        break;
      case "adviceSmall":
        return currentLang == "en"
          ? "Suggestion for small group class trial?"
          : "建议小班课";
        break;
      case "teachStyle":
        return currentLang == "en" ? "Teaching Style" : "教学风格";
        break;
      case "tmUser":
        return currentLang == "en" ? "Teacher Management Staff" : "教师管理";
        break;
      case "isMill":
        return currentLang == "en" ? "Finish Grinding" : "完成磨课";
        break;
      case "isFinal":
        return currentLang == "en" ? "Final Stage Completed" : "完成终面";
        break;
      case "isTry":
        return currentLang == "en" ? "Trial Completed" : "完成试讲";
        break;
      case "isSkill":
        return currentLang == "en"
          ? "Technical Training Completed"
          : "完成技培";
        break;
      default:
        return key;
        break;
    }
  },
  /**
   * 审核时间轴 value映射
   */
  timeLineValue: (key, value) => {
    if (key.indexOf("Time") !== -1) {
      if (key == "teachTime" || key == "skillTime") {
        return DateTimeUtils.dateClockTime(value).split(" ")[0];
      } else {
        let str = DateTimeUtils.dateClockTime(value);
        return str.substr(0, str.length - 3);
      }
    }
    if (key.indexOf("is") !== -1 || key == "adviceSmall") {
      return value == 1 ? "是" : value == 0 ? "否" : "--";
    }
    if (key == "courseAdvice") {
      let edition = value.split(",")[0],
        level = value.split(",")[1];
      return edition + " " + level;
    } else {
      return value;
    }
  },
  disableRoleCode: (code) => {
    switch (code) {
      case "jishupeixunshi":
        return true;
        break;
      case "jiaoxuepeixunshi":
        return true;
        break;
      case "zhaopinzhuanyuan":
        return true;
        break;
      case "zhaopinzhuguan":
        return true;
        break;
      default:
        return false;
        break;
    }
  },
  /**
   * 负责团队
   */
  teamFilter: (code, isEn) => {
    switch (code) {
      case 1:
        return isEn ? "Beijing Team" : "北京团队";
      case 2:
        return isEn ? "Singapore Team" : "新加坡团队";
      case 3:
        return isEn ? "Indonesia Team" : "印尼团队";
      case 4:
        return isEn ? "Thailand Team" : "泰国团队";
      default:
        return "";
    }
  },
  /**
   * 班型类型
   */
  groupTypeFilter: (code, isEn) => {
    switch (code) {
      case 1:
        if (isEn !== undefined) {
          return isEn ? "Trial class" : "试听";
        } else {
          return currentLang === "en" ? "Trial class" : "试听";
        }
        break;
      case 2:
        if (isEn !== undefined) {
          return isEn ? "Formal class" : "正式";
        } else {
          return currentLang === "en" ? "Formal class" : "正式";
        }

        break;
      default:
        return "";
        break;
    }
  },
  /**
   * 试听课上课周期
   */
  tryWeekListMap: (arr) => {
    if (!arr) return "";
    let str = "";
    arr.forEach((item, index) => {
      if (index != arr.length - 1) {
        str += `${mapWeek(item.week)},`;
      } else {
        str += `${mapWeek(item.week)}`;
      }
    });
    return `${str} ${arr[0]["time"]}`;
  },
  /**
   * 正式课上课周期
   */
  normalWeekListMap: (arr, isEn) => {
    if (!arr) return "";
    let str = "";
    arr.forEach((item, index) => {
      if (index != arr.length - 1) {
        str += `${mapWeek(item.week, isEn)} ${item.time},`;
      } else {
        str += `${mapWeek(item.week, isEn)} ${item.time}`;
      }
    });
    return str;
  },
  /**
   * 语言标签
   */
  languageLabelFilter: (code, isEn) => {
    switch (code) {
      case 1:
        return isEn ? "Japanese" : "日语";
      case 2:
        return isEn ? "Korean" : "韩语";
      case 3:
        return isEn ? "Thailand" : "泰语";
      case 4:
        return isEn ? "English" : "英语";
      default:
        return "";
    }
  },
  /**
   * 年龄标签
   */
  ageLabelFilter: (code, isEn) => {
    switch (code) {
      case 0:
        return isEn ? "Unknown" : "未知";
      case 1:
        return isEn ? "Age 6-8" : "6-8岁";
      case 2:
        return isEn ? "Age 8-10" : "8-10岁";
      case 3:
        return isEn ? "Age 10-12" : "10-12岁";
      case 4:
        return isEn ? "Above 12" : "12岁以上";
      case 5:
        return isEn ? "Under 6" : "6岁以下";
      default:
        return "";
    }
  },
  /**
   * 转班原因
   */
  translateClassTeasonFilter: (code, isEn) => {
    const map = {
      [TRANSLATE_CLASS_REASON_TYPES.PLATFORM_ADJUST]: isEn
        ? "Platform unified adjustment class"
        : "平台调整班级",
      [TRANSLATE_CLASS_REASON_TYPES.CHANE_TEACHER]: isEn
        ? "Student want to change teacher"
        : "学员想换老师",
      [TRANSLATE_CLASS_REASON_TYPES.CHANGE_TIME]: isEn
        ? "Student wants to change time"
        : "学员想换时间",
      [TRANSLATE_CLASS_REASON_TYPES.DISTAKE_STUDENT]: isEn
        ? "Student don't like his(her) classmates"
        : "学员不喜欢同学",
      [TRANSLATE_CLASS_REASON_TYPES.TIME_ADJUST]: isEn
        ? "Adjustment of Daylight Saving Time or Standard Time"
        : "令时调整",
      [TRANSLATE_CLASS_REASON_TYPES.MERGE_CLASS]: isEn
        ? "Class merging"
        : "合班",
      [TRANSLATE_CLASS_REASON_TYPES.CHANGE_VERSION]: isEn
        ? "Change the version"
        : "换版本",
      [TRANSLATE_CLASS_REASON_TYPES.END_SHORT_TERM]: isEn
        ? "End of Short-term Course"
        : "短期课结束",
      [TRANSLATE_CLASS_REASON_TYPES.OTHER]: isEn ? "Others" : "其他原因",
    };
    return map[code] || "-";
  },
  /**
   * 小班课用户课时不足移出班级原因
   */
  removeClassTeasonFilter: (code, isEn) => {
    const map = {
      [OUT_CLASS_BY_SYS_REASON_TYPES.REMOVE_NORMALLY]: isEn
        ? "The student was removed from the class due to the class points used up."
        : "正常课消完毕移出班级",
      [OUT_CLASS_BY_SYS_REASON_TYPES.REMOVE_INVALID]: isEn
        ? "The student was removed from the class because the class points were expired."
        : "课时失效导致课时不足移出班级",
      [OUT_CLASS_BY_SYS_REASON_TYPES.REMOVE_TRANSFORM]: isEn
        ? "The student was removed from the class because the class points were converted."
        : "课时转换导致课时不足移出班级",
      [OUT_CLASS_BY_SYS_REASON_TYPES.OTHER]: isEn ? "Others" : "其他原因",
    };
    return map[code] || "-";
  },

  /**
   * 班型状态
   */
  groupTypeStatusFilter: (code) => {
    switch (code) {
      case 0:
        return currentLang === "en" ? "Active" : "启用";
        break;
      case 1:
        return currentLang === "en" ? "Deactivate" : "停用";
        break;
      default:
        return "";
        break;
    }
  },
  mapGroupStudentsStatus: (code) => {
    switch (code) {
      case 0:
        return currentLang === "en" ? "Waiting to create class" : "等待组班";
        break;
      case 1:
        return currentLang === "en" ? "Class created successfully" : "组班成功";
        break;
      case 2:
        return currentLang === "en" ? "Class created failed" : "组班失败";
        break;
      case 3:
        return currentLang === "en" ? "Cancel the registration" : "撤销报名";
        break;
      default:
        return "";
        break;
    }
  },
  /**
   * 字
   */
  wordMap: (code) => {
    if (code?.length > 1) {
      return code;
    }
    switch (parseInt(code)) {
      case 1:
        return "0";
      case 2:
        return "1-50";
      case 3:
        return "51-100";
      case 4:
        return "101-200";
      case 5:
        return "201-500";
      case 6:
        return "500以上";
      default:
        return code || "---";
    }
  },
  languageEnvironmentMap: (code, currentLang) => {
    switch (code) {
      case "0":
        return currentLang === "en" ? "Not Set" : "未知";
      case "1":
        return currentLang === "en" ? "Pure Chinese" : "纯中文";
      case "2":
        return currentLang === "en" ? "Pure English" : "纯英文";
      case "3":
        return currentLang === "en" ? "Chinese & English" : "中文+英文";
      case "4":
        return currentLang === "en" ? "Chinese & Other" : "中文+其他语言";
      case "5":
        return currentLang === "en" ? "English & Other" : "英文+其他语言";
      case "6":
        return currentLang === "en"
          ? "Chinese & English & Other"
          : "中文+英文+其他语言";
      case "7":
        return currentLang === "en"
          ? "Pure Other"
          : "纯其他语言（非中文和英文）";
      case "8":
        return currentLang === "en"
          ? "Mandarin Chinese only, or mostly Mandarin Chinese (Discovery P3 or Advanced)"
          : "纯中文或大部分中文 (拓展版或进阶版）";
      case "9":
        return currentLang === "en"
          ? "Other languages, or mostly other languages (Core)"
          : "其他语言或大部分其他语言（标准版）";
      case "10":
        return currentLang === "en"
          ? "Half Mandarin Chinese + half other languages (refer to the next item for curriculum placement)"
          : "一半中文+一半其他语言 (定版参考下一题）";
      default:
        return code || "-";
    }
  },
  // 处理原因filter
  getDealCauseEnum: (id) => {
    const enumMap = {
      1: "调时令",
      2: "换班次",
      3: "换版本",
      4: "学生升Level",
      5: "专项拼音班",
      6: "合班",
      7: "代课",
      8: "新接手学生剩余课量",
      9: "其他",
    };
    return enumMap[+id] || "-";
  },
  // 申诉处理结果filter
  getDealResultEnum: (id, isEn) => {
    const enumMap = {
      1: isEn ? "Passed" : "通过申诉",
      2: isEn ? "Not Passed" : "不通过申诉",
    };
    return enumMap[+id] || "-";
  },
  /**
   * 中文听说能力Filter
   */
  chineseAbilityMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en"
          ? "Cannot understand nor speak Chinese"
          : "不会听说";
      case 2:
        return currentLang === "en"
          ? "Understand but cannot speak Chinese"
          : "会听不会说";
      case 3:
        return currentLang === "en"
          ? "Understand and speak some Chinese"
          : "会听会蹦词";
      case 4:
        return currentLang === "en"
          ? "Understand and basic communication in Chinese"
          : "会听能简单交流";
      case 5:
        return currentLang === "en"
          ? "Understand and speak fluently"
          : "听说流利";
      case 6:
        return currentLang === "en" ? "Others" : "其他";
      case 7:
        return currentLang === "en"
          ? "Can’t understand or speak Mandarin Chinese (Core)"
          : "不会听说 (标准版）";
      case 8:
        return currentLang === "en"
          ? "Struggle to have daily conversations (e.g., can partially understand what’s said; can’t speak, or can only say simple words.) (Core)"
          : "日常听说有障碍(e.g.只能听懂一部分，不能说或只能蹦简单词）（标准版）";
      case 9:
        return currentLang === "en"
          ? "Good with daily conversations (Discovery P3 or Advanced)"
          : "日常听说基本没问题 (拓展版或进阶版）";
      default:
        return code || "---";
    }
  },

  /**
   * 中文使用情况Filter
   */
  chineseUsingMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en" ? "Only Chinese" : "只用中文";
      case 2:
        return currentLang === "en"
          ? "Mostly Chinese; Barely Foreign Language"
          : "大量中文和少量外语";
      case 3:
        return currentLang === "en"
          ? "Barely Chinese; Mostly Foreign Language"
          : "少量中文和大量外语";
      case 4:
        return currentLang === "en"
          ? "No Chinese; Only Foreign Language"
          : "不用中文，只用外语";
      default:
        return code || "---";
    }
  },
  /**
   * 英文听说能力Filter
   */
  englishAbilityMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en"
          ? "Can not understand basic expressions"
          : "无法理解日常表达";
      case 2:
        return currentLang === "en"
          ? "Can understand and use basic expressions"
          : "能够使用日常基本表达";
      case 3:
        return currentLang === "en"
          ? "Can understand  frequently used expressions"
          : "能够使用常见表达";
      case 4:
        return currentLang === "en"
          ? "Can deal with most situations whilst travelling"
          : "能够处理大多数的情况";
      default:
        return code || "---";
    }
  },
  /**
   * 英文阅读水平Filter
   */
  englishReadLevelListMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en"
          ? "Can not read English stories"
          : "阅读零基础";
      case 2:
        return currentLang === "en"
          ? "Can read simple picture stories"
          : "能阅读简单的英文绘本";
      case 3:
        return currentLang === "en"
          ? "Can read graded readers"
          : "能阅读分级阅读";
      case 4:
        return currentLang === "en" ? "Can read chapter books" : "能阅读章节书";
      default:
        return code || "---";
    }
  },
  /**
   * 英文书写水平Filter
   */
  englishWriteLevelListMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en" ? "Can not write" : "书写零基础";
      case 2:
        return currentLang === "en" ? "Can write letters" : "书写字母";
      case 3:
        return currentLang === "en" ? "Can write words" : "书写词汇";
      case 4:
        return currentLang === "en"
          ? "Can write complete sentences"
          : "书写表意正确的句子";
      case 5:
        return currentLang === "en" ? "Can write paragraphs" : "书写段落";
      case 6:
        return currentLang === "en" ? "Can write an essay" : "书写英文作文";
      default:
        return code || "---";
    }
  },
  /**
   * 中文使用语言Filter
   */
  standardOrNotLangMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en" ? "Mandarin" : "标准语（普通话）";
      case 2:
        return currentLang === "en"
          ? "Other Dialects (Cantonese,Hokkien, etc)e"
          : "方言（粤语、闽南语等）";
      default:
        return code || "---";
    }
  },
  /**
   * 是否Filter
   */
  yesOrNoConfigMap: (code, currentLang) => {
    if (code === "true" || code === true) {
      return currentLang === "en" ? "Yes" : "是";
    } else if (code === "false" || code === false) {
      return currentLang === "en" ? "No" : "否";
    } else {
      return code || "---";
    }
  },
  /**
   * 家长期望和要求Filter
   */
  parentalExpectationsMap: (code, currentLang) => {
    const normalCode = parseInt(code);
    switch (normalCode) {
      case 1:
        return currentLang === "en"
          ? "Improve daily listening & speaking ability (daily life communication)"
          : "提升日常听说能力（日常生活交流）";
      case 2:
        return currentLang === "en"
          ? "Improve comprehensive speaking expression ability (speech、discuss）"
          : "提升综合口语表达能力（演讲、探讨）";
      case 3:
        return currentLang === "en"
          ? "Improve basic reading and writing ability (write Chinese character, reading short essays)"
          : "提升基础读写能力（写字、阅读小短文）";
      case 4:
        return currentLang === "en"
          ? "Improve intensive reading & writing ability (able to write different style essays, read famous literacy work)"
          : "提升精读、写作能力（写作各种文体、阅读长篇名著）";
      case 5:
        return currentLang === "en"
          ? "Enlightenment, cultivate interests"
          : "提升精读、写作能力（写作各种文体、阅读长篇名著）";
      case 6:
        return currentLang === "en"
          ? "Improve cultural literacy (learn Chinese culture, literature and art)"
          : "提升文化素养（了解中国文化、文学）";
      case 7:
        return currentLang === "en"
          ? "Keep the same level of Chinese as the Children in China"
          : "保持和国内孩子等同的中文水平";
      case 8:
        return currentLang === "en" ? "Testing/Exam Need" : "考试需求";
      case 9:
        return currentLang === "en" ? "Others" : "其他";
      default:
        return code || "-";
    }
  },
  /**
   * 充值类型
   */
  uploadStatusFilter: (code) => {
    switch (code) {
      case 0:
        return currentLang === "en" ? "Processing" : "正在处理";
        break;
      case 1:
        return currentLang === "en" ? "success" : "成功";
        break;
      case 2:
        return currentLang === "en" ? "fail" : "失败";
        break;
      case 4:
        return currentLang === "en" ? "success" : "成功";
        break;
      default:
        return "-";
        break;
    }
  },
  bktom: (size) => {
    if (!size) return "";
    var num = 1024.0; //byte
    if (size < num) return size + "B";
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
    if (size < Math.pow(num, 3))
      return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
    if (size < Math.pow(num, 4))
      return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
  },
  getRandom: (start, end, fixed = 0) => {
    let differ = end - start;
    let random = Math.random();
    return (start + differ * random).toFixed(fixed);
  },
  /**
   * 优惠券类型:1-折扣券,2-代金券
   */
  couponTypeFilters: (code) => {
    switch (code) {
      case 1:
        return currentLang === "en" ? "coupon" : "折扣券";
        break;
      case 2:
        return currentLang === "en" ? "cash coupon" : "代金券";
        break;
      default:
        return "";
        break;
    }
  },
  /**
   * 状态:0-停止发券,1-允许发券
   */
  couponStatusFilters: (code) => {
    switch (code) {
      case 0:
        return currentLang === "en" ? "Stop issuing bonds" : "停止发券";
        break;
      case 1:
        return currentLang === "en" ? "Allow issuing coupons" : "允许发券";
        break;
      default:
        return "";
        break;
    }
  },
  couponUsedStatusFilters: (code) => {
    switch (code) {
      case 0:
        return currentLang === "en" ? "not used" : "未使用";
        break;
      case 1:
        return currentLang === "en" ? "Used" : "已使用";
        break;
      case 2:
        return currentLang === "en" ? "Expired" : "已过期";
        break;
      default:
        return "";
        break;
    }
  },
  tutorSysLogsType: (code) => {
    switch (code) {
      case 1:
        return currentLang === "en"
          ? "Modify teaching authority"
          : "修改教学权限";
        break;
      case 2:
        return currentLang === "en"
          ? "Modify teacher's salary"
          : "修改老师课酬";
        break;
      case 3:
        return currentLang === "en"
          ? "Modify attendance status"
          : "修改出席状态";
        break;
      case 5:
        return currentLang === "en" ? "Modify teacher status" : "修改教师状态";
        break;
      case 6:
        return currentLang === "en"
          ? "Modify Teacher Information"
          : "修改教师资料";
        break;
      case 7:
        return currentLang === "en"
          ? "Modify teacher conversion rate label"
          : "修改教师转化率标签";
        break;
      case 8:
        return currentLang === "en"
          ? "Update Teacher Renewal Status"
          : "更新老师续签状态";
        break;
      case 11:
        return currentLang === "en"
          ? "Modify teaching permissions - batch processing"
          : "修改教学权限-批量处理";
        break;
      case 12:
        return currentLang === "en" ? "Modify slots type" : "修改slots类型";
        break;
      case 13:
        return currentLang === "en"
          ? "Modify white list"
          : "修改约课白名单家长";
        break;
      case 14:
        return currentLang === "en"
          ? "Modify Teacher Type"
          : "修改教师类型";
        break;
      case 15:
        return currentLang === "en"
          ? "Quality Check"
          : "课堂质检";
        break;
      case 16:
        return currentLang === "en"
          ? "Touch"
          : "课堂投诉";
        break;
      default:
        return "";
        break;
    }
  },
  /**
   * 千分位
   */
  thousandthPercentile: (num) => {
    if (isNaN(num)) {
      throw new TypeError("num is not a number");
    }
    var groups = /([\-\+]?)(\d*)(\.\d+)?/g.exec("" + num),
      mask = groups[1], //符号位
      integers = (groups[2] || "").split(""), //整数部分
      decimal = groups[3] || "", //小数部分
      remain = integers.length % 3;

    var temp = integers
      .reduce(function (previousValue, currentValue, index) {
        if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
          return previousValue + currentValue + ",";
        } else {
          return previousValue + currentValue;
        }
      }, "")
      .replace(/\,$/g, "");
    return mask + temp + decimal;
  },

  numberPercentage: (num) => {
    if (typeof num !== "number") throw TypeError("number must be a number");
    if (num == 1) return "100";
    if (num == 0) return "0";
    num *= 100;
    let result = num.toFixed(2);
    return result;
  },
  teacherAttendStatusFilter: teacherAttendStatusFilter,
  teacherAppealStatusFilter: teacherAppealStatusFilter,
  correctReasonFilter: correctReasonFilter,
  abnormalFinishedResult: abnormalFinishedResult,
  newCorrectReasonFilter: newCorrectReasonFilter,
  ruleStatusFilter: (num) => {
    switch (num) {
      case 0:
        return "无效";
        break;
      case 1:
        return "有效";
        break;
      default:
        break;
    }
  },
  /**
   * 消费税状态
   */
  validStatusGstFilter: (num) => {
    switch (num) {
      case 1:
        return currentLang === "en" ? "In effect" : "生效中";
        break;
      case 2:
        return currentLang === "en" ? "Invalid" : "已失效";
        break;
      default:
        break;
    }
  },
  manualOrderStatus: (num) => {
    switch (num) {
      case 0:
        return "待支付";
        break;
      case 1:
        return "待审批";
        break;
      case 2:
        return "驳回";
        break;
      case 3:
        return "审核通过";
        break;
      default:
        break;
    }
  },
  getFeedRecord: getFeedRecord,
  //首课反馈 海报与短链记录 列表数据返回拼接字符串
  feedArray: (arr) => {
    if (arr) {
      arr = arr.split(",");
      let list = arr.map((e, i) => {
        return getFeedRecord(e);
      });
      return (list = list.join(","));
    } else {
      // return getFeedRecord(arr)
    }
  },
  getWorkingTxt: (code) => {
    switch (code) {
      case 0:
        return "未上岗";
        break;
      case 1:
        return "在岗";
        break;
      case 2:
        return "离岗";
        break;
      default:
        break;
    }
  },
  getOpenTxt: (code) => {
    switch (code) {
      case 0:
        return "全部可教（试听/正式）";
        break;
      case 1:
        return "仅试听";
        break;
      case 2:
        return "仅正式";
        break;
      case 3:
        return "全部不可教";
        break;
      case 4:
        return "限制仅老生正式课";
        break;
      default:
        break;
    }
  },
  getReasonTxt: (code) => {
    const codeMap = {
      1: "课量过多",
      2: "老师不想接试听",
      3: "教学质量频繁出现问题",
      4: "频繁请假",
      5: "离职交接期",
      6: "老师态度问题",
      7: "老师质疑平台",
      8: "其他",
      9: "课量达标",
      10: "请假中",
      11: "教学规范多次违规",
      12: "PS",
    };
    return codeMap[code];
  },
  getCourseType: (code, isEn) => {
    const valMap = {
      [COURSE_TYPE.TRIAL]: isEn ? "Trial Lesson" : "试听课",
      [COURSE_TYPE.PAID]: isEn ? "Paid Lesson" : "正式课",
    };
    return valMap[code] || "-";
  },
  getSubjectLabel: (code, currentLang) => {
    const isEn = currentLang === "en";
    const subjectMap = {
      0: isEn ? "Chinese" : "中文",
      1: isEn ? "English" : "英文",
      2: isEn ? "Math" : "数学",
      3: isEn ? "Music" : "音乐",
      6: isEn ? "AceVocab" : "单词通",
    };
    return subjectMap[code] || "";
  },
  createTypeFilter: (code, isEn) => {
    const map = {
      0: isEn ? "Parents purchase" : "家长购买",
      1: isEn ? "Manual order" : "人工订单",
      2: isEn ? "Class hour transfer" : "课时转移",
      3: isEn ? "Class hour change" : "课时变化",
      4: isEn ? "Point exchange" : "积分兑换",
      5: isEn ? "Complimentary class hours" : "赠送课时",
      6: isEn ? "Others" : "其他",
      7: isEn ? "No history" : "历史无记录",
    };
    return map[code] || "-";
  },

  assignTypeFilter: (code, isEn) => {
    const map = {
      0: isEn ? "System assignment" : "系统分配",
      1: isEn ? "Manual first assignment" : "手动首次分配",
      2: isEn ? "toManual reassignmentdo" : "手动重新分配",
    };
    return map[code] || "-";
  },
  assignmentType: (code, isEn) => {
    const map = {
      ["SYSTEM_ALLOCATION"]: isEn ? "System Assignment" : "自动分配",
      ["MANUAL_ALLOCATION"]: isEn ? "Manual Assignment" : "人工分配",
      ["CC_HANDOVER_SELF"]: isEn
        ? "Handover Form - Assign LA to CC"
        : "交接单-将学管分配给销售人员",
    };
    return map[code] || "-";
  },
  assignmentChannel: (code, isEn) => {
    const map = {
      ["SYSTEM_RULE"]: isEn ? "Rules Of System Assignment" : "系统分配规则",
      ["ASSIGN_TASKS"]: isEn ? "Assignment Task" : "分配任务",
      ["WAIT_DISTRIBUTION"]: isEn ? "Unassigned List" : "待分配列表",
      ["CC_HANDOVER_SELF"]: isEn
        ? "Handover Form - Assign LA to CC"
        : "交接单-将学管分配给销售人员",
    };
    return map[code] || "-";
  },
  getSendReasonFilter: (code, isEn) => {
    const map = {
      [SEND_REASON_TYPE.SYSTEM]: isEn
        ? "System upgrade release"
        : "系统升级发放",
      [SEND_REASON_TYPE.FIRST_JOIN]: isEn
        ? "First entry class release"
        : "初次加入班级赠送",
      [SEND_REASON_TYPE.MONTH_SEND]: isEn ? "Monthly release" : "每月赠送",
      [SEND_REASON_TYPE.MANUAL_RELEASE]: isEn ? "Manual release" : "手动发放",
    };
    return map[code] || "-";
  },
};
