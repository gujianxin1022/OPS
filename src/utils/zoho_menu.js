/* 数学 */
// 测评级别 placementTestLevel
export const placementTestLevelList = (isEn) => {
  return !isEn
    ? [
        { label: "未做测评", value: "未做测评" },
        { label: "Level 3", value: "Level 3" },
        { label: "Level 4", value: "Level 4" },
        { label: "Level 5", value: "Level 5" },
        { label: "Level 6", value: "Level 6" },
        { label: "Level 7", value: "Level 7" },
        { label: "Level 8", value: "Level 8" },
        { label: "Level 9", value: "Level 9" },
        { label: "Level 10", value: "Level 10" },
        { label: "Level 11", value: "Level 11" },
        { label: "Level 12", value: "Level 12" },
        { label: "Level 13", value: "Level 13" },
      ]
    : [
        { label: "no test result", value: "未做测评" },
        { label: "Level 3", value: "Level 3" },
        { label: "Level 4", value: "Level 4" },
        { label: "Level 5", value: "Level 5" },
        { label: "Level 6", value: "Level 6" },
        { label: "Level 7", value: "Level 7" },
        { label: "Level 8", value: "Level 8" },
        { label: "Level 9", value: "Level 9" },
        { label: "Level 10", value: "Level 10" },
        { label: "Level 11", value: "Level 11" },
        { label: "Level 12", value: "Level 12" },
        { label: "Level 13", value: "Level 13" },
      ];
};

// 顾问建议级别 salesSuggestedLevel
export const salesSuggestedLevelList = (isEn) => {
  return !isEn
    ? [
        { label: "Level 3", value: "Level 3" },
        { label: "Level 4", value: "Level 4" },
        { label: "Level 5", value: "Level 5" },
        { label: "Level 6", value: "Level 6" },
        { label: "Level 7", value: "Level 7" },
        { label: "Level 8", value: "Level 8" },
        { label: "Level 9", value: "Level 9" },
        { label: "Level 10", value: "Level 10" },
        { label: "Level 11", value: "Level 11" },
        { label: "Level 12", value: "Level 12" },
        { label: "Level 13", value: "Level 13" },
      ]
    : [
        { label: "Level 3", value: "Level 3" },
        { label: "Level 4", value: "Level 4" },
        { label: "Level 5", value: "Level 5" },
        { label: "Level 6", value: "Level 6" },
        { label: "Level 7", value: "Level 7" },
        { label: "Level 8", value: "Level 8" },
        { label: "Level 9", value: "Level 9" },
        { label: "Level 10", value: "Level 10" },
        { label: "Level 11", value: "Level 11" },
        { label: "Level 12", value: "Level 12" },
        { label: "Level 13", value: "Level 13" },
      ];
};

// 现阶段可选级别 availableLevelsAtThisPeriod
export const availableLevelsAtThisPeriodlList = (isEn) => {
  return !isEn
    ? [
        { label: "春季（双数：L4，L6，L8，L10，L12）", value: "1" },
        { label: "秋季（单数：L3，L5，L7，L9，L11，L13）", value: "2" },
      ]
    : [
        { label: "Spring (Plural levels: L4，L6，L8，L10，L12）", value: "1" },
        { label: "Fall (Singular levels：L3，L5，L7，L9，L11，L13）", value: "2" },
      ];
};
export const getAvailableLevelsAtThisPeriodLabel = (id, isEn) => {
  if (!id) {
    return "---";
  }
  let label = "";
  label =
    availableLevelsAtThisPeriodlList(isEn).filter((e) => {
      return e.value === id;
    })[0]?.label || "---";
  return label;
};

// 上课需求 classRequirements
export const classRequirementslListForMath = (isEn) => {
  return !isEn
    ? [
        { label: "希望老师多活跃课堂气氛", value: "20" },
        { label: "学生活动，希望老师注意课堂管理", value: "21" },
        { label: "写老师多引导提问，不要只读课件", value: "22" },
        { label: "多鼓励学生，建立信心", value: "23" },
        { label: "语速慢一些", value: "24" },
        { label: "语速快一些", value: "25" },
        { label: "正常语速", value: "26" },
        { label: "希望老师讲课耐心点", value: "27" },
      ]
    : [
        { label: "Encourage more classroom interaction.", value: "20" },
        {
          label:
            "Students are active; please pay attention to classroom management.",
          value: "21",
        },
        {
          label:
            "Guide students with more questions rather than just reading from slides.",
          value: "22",
        },
        {
          label:
            "Provide plenty of encouragement to build students' confidence.",
          value: "23",
        },
        { label: "Speak more slowly.", value: "24" },
        { label: "Speak more quickly.", value: "25" },
        { label: "Speak at a normal pace.", value: "26" },
        { label: "Please be patient when teaching.", value: "27" },
      ];
};

export const getClassRequirementslLabel = (ids, isEn) => {
  const classRequirementsMath = (ids || []).map((id) => {
    return (
      classRequirementslListForMath(isEn).find((item) => id == item.value)
        ?.label || ""
    );
  });
  return classRequirementsMath.join("、");
};

// 有无接触过新加坡数学 knowSingaporeMathexport
export const knowSingaporeMathexportlList = (isEn) => {
  return !isEn
    ? [
        { label: "是", value: true },
        { label: "否", value: false },
      ]
    : [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ];
};

/* 英文 */
// 上课需求 classRequirements
export const classRequirementslListForEn = (isEn) => {
  return !isEn
    ? [
        { label: "请多纠正发音和纠错", value: "1" },
        { label: "避免疲劳授课", value: "2" },
        { label: "希望老师不要只读课件，要多拓展", value: "3" },
        { label: "请引导孩子多开口", value: "4" },
        { label: "如果使用虚拟背景，请保证图像清晰", value: "5" },
        { label: "请按时出席，上够时长", value: "6" },
        { label: "希望老师有亲和力，多微笑", value: "7" },
        { label: "多使用肢体语言和小道具，活跃课堂氛围", value: "8" },
        { label: "希望语速慢一些", value: "9" },
        { label: "学生零基础，希望老师耐心引导", value: "10" },
        { label: "学生比较内敛，希望老师耐心引导", value: "11" },
        { label: "希望老师认真反馈学生水平和课堂表现", value: "12" },
        { label: "上课集中精力，专注教学，不要分心", value: "13" },
        { label: "引导孩子说整句", value: "14" },
        { label: "合理分配教学时间，把握课堂节奏", value: "15" },
        { label: "请在合适的环境上课并保持课堂安静", value: "16" },
        { label: "请提前确保网络稳定", value: "17" },
        { label: "请提前备课，熟悉课件操作", value: "18" },
        { label: "多鼓励学生，建立信心", value: "19" },
      ]
    : [
        { label: "Correct pronunciation and errors frequently.", value: "1" },
        { label: "Avoid teaching when fatigued.", value: "2" },
        {
          label: "Do not just read from slides; expand the topics.",
          value: "3",
        },
        { label: "Encourage students to speak up more.", value: "4" },
        {
          label: "If using virtual backgrounds, ensure the image is clear.",
          value: "5",
        },
        {
          label: "Attend classes on time and fulfill the required duration.",
          value: "6",
        },
        { label: "Be approachable and smile often.", value: "7" },
        {
          label: "Use more TPR and props to energize the classroom.",
          value: "8",
        },
        { label: "Speak a bit more slowly.", value: "9" },
        {
          label: "Students have no basic knowledge; guide them patiently.",
          value: "10",
        },
        {
          label: "Students are introverted; guide them patiently.",
          value: "11",
        },
        {
          label:
            "Provide detailed feedback on students' levels and classroom performance.",
          value: "12",
        },
        {
          label:
            "Focus during class, concentrate on teaching, and avoid distractions.",
          value: "13",
        },
        {
          label: "Encourage students to speak in complete sentences.",
          value: "14",
        },
        {
          label:
            "Manage teaching time wisely and control the pace of the class.",
          value: "15",
        },
        {
          label:
            "Teach in a suitable environment and maintain classroom quietness.",
          value: "16",
        },
        {
          label: "Ensure a stable internet connection before class.",
          value: "17",
        },
        {
          label:
            "Prepare for class in advance and familiarize yourself with the presentation tools.",
          value: "18",
        },
        {
          label: "Encourage students frequently to build their confidence.",
          value: "19",
        },
      ];
};

export const getClassRequirementslLabelEn = (ids, isEn) => {
  if (!ids) {
    return "---";
  }
  let idArr = Array.isArray(ids) ? ids : ids.spilt(",");
  const classRequirementsMath = (idArr || []).map((id) => {
    return (
      classRequirementslListForEn(isEn).find((item) => id == item.value)
        ?.label || ""
    );
  });
  return classRequirementsMath.join("、");
};
