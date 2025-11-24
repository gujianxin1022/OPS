let localeLanguage = () => window.localStorage.getItem("localeLanguage");

function reasonList(currentLang = localeLanguage()) {
  return [
    {
      id: 13,
      reason:
        currentLang == "en"
          ? "Teacher reason - teacher absenteeism"
          : "老师原因 - 老师旷课",
    },
    {
      id: 1,
      reason:
        currentLang == "en"
          ? "Teacher reason - parents complain about Teachers"
          : "老师原因 - 家长投诉老师",
    },
    {
      id: 2,
      reason:
        currentLang == "en"
          ? "Teacher reason - teacher is late and leaves early"
          : "老师原因 - 老师迟到早退",
    },
    {
      id: 3,
      reason:
        currentLang == "en"
          ? "Teacher reasons - problems related to teacher teaching quality"
          : "老师原因 - 老师教学质量相关问题",
    },
    {
      id: 4,
      reason:
        currentLang == "en"
          ? "Teacher reasons - teacher equipment and network problems"
          : "老师原因 - 老师设备和网络问题",
    },
    {
      id: 5,
      reason:
        currentLang == "en"
          ? "Teacher's reason - teacher's operation error"
          : "老师原因 - 老师操作失误",
    },
    {
      id: 6,
      reason:
        currentLang == "en"
          ? "Student reason - students cancel the course within two hours before class"
          : "学生原因 - 学生课前两小时内取消课程",
    },
    {
      id: 7,
      reason:
        currentLang == "en"
          ? "Student reason - students cancel the course two hours before class"
          : "学生原因 - 学生课前两小时外取消课程",
    },
    {
      id: 8,
      reason:
        currentLang == "en"
          ? "Student reason - student absenteeism"
          : "学生原因 - 学生旷课",
    },
    {
      id: 9,
      reason:
        currentLang == "en"
          ? "Student reason - abnormal student equipment"
          : "学生原因 - 学生设备异常",
    },
    {
      id: 10,
      reason:
        currentLang == "en"
          ? "Course consultant reason - Course Consultant operation error"
          : "课程顾问原因 - 课程顾问操作失误",
    },
    {
      id: 11,
      reason:
        currentLang == "en"
          ? "Student management teacher's reason - student management operation error"
          : "学管老师原因 - 学管操作失误",
    },
    {
      id: 12,
      reason:
        currentLang == "en"
          ? "Platform cause - platform system exception"
          : "平台原因 - 平台系统异常",
    },
  ];
}

function newReasonList(currentLang = localeLanguage()) {
  return [
    {
      id: 13,
      reason:
        currentLang == "en"
          ? "Teacher reason - teacher absenteeism"
          : "老师原因 - 老师旷课",
    },
    {
      id: 1,
      reason:
        currentLang == "en"
          ? "Teacher reason - parents complain about Teachers"
          : "老师原因 - 家长投诉老师",
    },
    {
      id: 2,
      reason:
        currentLang == "en"
          ? "Teacher reason - teacher is late and leaves early"
          : "老师原因 - 老师迟到早退",
    },
    {
      id: 3,
      reason:
        currentLang == "en"
          ? "Teacher reasons - problems related to teacher teaching quality"
          : "老师原因 - 老师教学质量相关问题",
    },
    {
      id: 4,
      reason:
        currentLang == "en"
          ? "Teacher reasons - teaching environment problems (environment, network, equipment)"
          : "老师原因 - 老师教学环境问题（环境、网络、设备）",
    },
    {
      id: 5,
      reason:
        currentLang == "en"
          ? "Teacher's reason - teacher's operation error"
          : "老师原因 - 老师操作失误",
    },
    {
      id: 14,
      reason:
        currentLang == "en"
          ? "Teacher reasons - not correcting homework on time"
          : "老师原因 - 未及时批改作业",
    },
    {
      id: 15,
      reason:
        currentLang == "en"
          ? "Teacher reasons - teaching manner problems (lens, dress, image, mental state)"
          : "老师原因 - 教资教态问题（镜头、着装、形象、精神状态）",
    },
    {
      id: 16,
      reason:
        currentLang == "en"
          ? "Teacher reasons - teaching quality problems (attitude, complaints, refund)"
          : "老师原因 - 教学质量问题（态度、投诉、退费）",
    },
    {
      id: 17,
      reason:
        currentLang == "en"
          ? "Teacher reasons - teaching content errors (wrong courseware, unauthorized adjustment of progress, teaching wrong knowledge)"
          : "老师原因 - 教授内容错误（上错课件、擅调进度、教错知识）",
    },
    {
      id: 6,
      reason:
        currentLang == "en"
          ? "Student reason - students cancel the course within two hours before class"
          : "学生原因 - 学生课前两小时内取消课程",
    },
    {
      id: 7,
      reason:
        currentLang == "en"
          ? "Student reason - students cancel the course two hours before class"
          : "学生原因 - 学生课前两小时外取消课程",
    },
    {
      id: 8,
      reason:
        currentLang == "en"
          ? "Student reason - student absenteeism"
          : "学生原因 - 学生旷课",
    },
    {
      id: 9,
      reason:
        currentLang == "en"
          ? "Student reason - abnormal student equipment"
          : "学生原因 - 学生设备异常",
    },
    {
      id: 10,
      reason:
        currentLang == "en"
          ? "Course consultant reason - Course Consultant operation error"
          : "课程顾问原因 - 课程顾问操作失误",
    },
    {
      id: 11,
      reason:
        currentLang == "en"
          ? "Student management teacher's reason - student management operation error"
          : "学管老师原因 - 学管操作失误",
    },
    {
      id: 12,
      reason:
        currentLang == "en"
          ? "Platform cause - platform system exception"
          : "平台原因 - 平台系统异常",
    },
  ];
}

export const APPEAL_TYPE = {
  ADD: 0, // 添加
  REMOVE: 1, //移除
};

export const DEFAULT_VALUE = {
  DEAL_CAUSE: 1,
  DEAL: 2,
};

export { reasonList, newReasonList };
