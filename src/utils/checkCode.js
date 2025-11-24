import Vue from "vue";
import i18n from "@/assets/locales/index";
import { ABNORMAL_CODE_LANG } from "@/utils/constants";

function checkCode(code, msg) {
  let message = msg;
  switch (code) {
    case ABNORMAL_CODE_LANG.notCurrentXgCode:
      message = i18n.t("只有该学生的学管才能操作转班");
      break;
    case ABNORMAL_CODE_LANG.restClassNumCode:
      message = i18n.t("学员课时余额不足");
      break;
    case ABNORMAL_CODE_LANG.trailClassEnableCode:
      message = i18n.t("试听班级无法转班");
      break;
    case ABNORMAL_CODE_LANG.refreshCode:
      message = i18n.t("当前页面结果已变更，请刷新重试");
      break;
    case ABNORMAL_CODE_LANG.hasCourseIn2HourCode:
      message = i18n.t("学生当前班级在2h内有未完成的课程，无法退出或转班");
      break;
    case ABNORMAL_CODE_LANG.addNewClassCode:
      message = i18n.t("用户已经加入了班级");
      break;
    case ABNORMAL_CODE_LANG.fullClassCode:
      message = i18n.t("班级已经满员");
      break;
    case ABNORMAL_CODE_LANG.courseStudentsFull:
      message = i18n.t("加入班级失败，本班级后续课堂人数已达到容量上限");
      break;
    case ABNORMAL_CODE_LANG.missedClasses:
      message = i18n.t(
        "该学生在本班级存在未结束的补课课堂，暂时无法加入班级，请在补课课堂结束后重试"
      );
      break;
    case ABNORMAL_CODE_LANG.onlyXgLeaveClass:
      message = i18n.t("仅学生的学管/顾问和客服可以操作请假");
      break;
    case ABNORMAL_CODE_LANG.leaveClassTimesEnable:
      message = i18n.t("请假次数不足，不可操作请假");
      break;
    case ABNORMAL_CODE_LANG.hasCancleClass:
      message = i18n.t("本节课已取消，不可请假");
      break;
    case ABNORMAL_CODE_LANG.hasLeaveClass:
      message = i18n.t("本节课已请假，不可再次请假");
      break;
    case ABNORMAL_CODE_LANG.isAdjustCourse:
      message = i18n.t("本节课为调课课程，不可请假");
      break;
    case ABNORMAL_CODE_LANG.isAddCourse:
      message = i18n.t("本节课为补课课程，不可请假");
      break;
    case ABNORMAL_CODE_LANG.before2Hours:
      message = i18n.t("上课前两小时内不可请假");
      break;
    case ABNORMAL_CODE_LANG.abnormalAddClass:
      message = i18n.t("该节课为异常补课课堂，不可请假");
      break;
    case ABNORMAL_CODE_LANG.tryClass:
      message = i18n.t("试听班型课堂，不可请假");
      break;
    case ABNORMAL_CODE_LANG.courseHasBegin:
      message = i18n.t("课程已开始，不可请假");
      break;
    case ABNORMAL_CODE_LANG.onlyXgAdjustCourse:
      message = i18n.t("仅学生的学管/顾问和客服可以操作调课");
      break;
    case ABNORMAL_CODE_LANG.adjustTimesEnough:
      message = i18n.t("调课次数已达上限，不可调课");
      break;
    case ABNORMAL_CODE_LANG.hanCancleCourse:
      message = i18n.t("本节课已取消，不可调课");
      break;
    case ABNORMAL_CODE_LANG.hanLeaveCourse:
      message = i18n.t("本节课已请假，不可调课");
      break;
    case ABNORMAL_CODE_LANG.hasAdjustCourse:
      message = i18n.t("本节课为调课课程，不可再次调课");
      break;
    case ABNORMAL_CODE_LANG.isAddCourseForAdjust:
      message = i18n.t("本节课为补课课程，不可调课");
      break;
    case ABNORMAL_CODE_LANG.before2HoursForAdjust:
      message = i18n.t("上课前两小时内不可调课");
      break;
    case ABNORMAL_CODE_LANG.abnormalAddCourse:
      message = i18n.t("该节课为异常补课课堂，不可调课");
      break;
    case ABNORMAL_CODE_LANG.tryCourse:
      message = i18n.t("试听班型课堂，不可调课");
      break;
    case ABNORMAL_CODE_LANG.courseHasStart:
      message = i18n.t("课程已开始，不可调课");
      break;
    case ABNORMAL_CODE_LANG.pleaseChangeTime:
      message = i18n.t("学员该时间段已被占用，请更换时间");
      break;
    default:
  }

  if (message) {
    Vue.prototype.$notify({
      message,
      type: "error",
      duration: 3000,
    });
  }
}

export default checkCode;
