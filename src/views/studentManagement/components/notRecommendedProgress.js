const notRecommendedProgressList = [
  {
    name: "进阶版 P1",
    courseRootId: 1,
    isAllNotRecommended: true,
    notRecommendedLevel: "",
  },
  {
    name: "新加坡技能增进课 P1",
    courseRootId: 15,
    isAllNotRecommended: true,
    notRecommendedLevel: "",
  },
  {
    name: "新加坡口语课 P1",
    courseRootId: 16,
    isAllNotRecommended: true,
    notRecommendedLevel: "",
  },
  {
    name: "新加坡词语补强课 P1",
    courseRootId: 14,
    isAllNotRecommended: true,
    notRecommendedLevel: "",
  },
  {
    name: "国际版 P1",
    courseRootId: 2,
    isAllNotRecommended: false,
    notRecommendedLevel: [7, 8, 9],// Level 1~Level3
  },
  {
    name: "进阶版 C1",
    courseRootId: 8,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "进阶版 P2",
    courseRootId: 10,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "国际版 C2",
    courseRootId: 11,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "启蒙版 P1",
    courseRootId: 12,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "国际版P2",
    courseRootId: 17,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "启蒙版 P2",
    courseRootId: 27,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "新加坡写作课 P1",
    courseRootId: 6,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "标准版 C1",
    courseRootId: 26,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "启蒙版 P3",
    courseRootId: 39266,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
  {
    name: "启蒙版 P2(试听课)",
    courseRootId: 33996,
    isAllNotRecommended: true,
    notRecommendedLevel: [],
  },
];
export const editionIdsList = [1, 15, 16, 14, 2,8,10,11,12,17,27,6,26,39266,33996];

export const isShowOff = (node) => {
  let isShowOff = notRecommendedProgressList.some((e, i) => {
    if (node.courseRootId) {
      /* 课程版本 */
      return node.courseRootId === e.courseRootId && e.isAllNotRecommended;
    }
    if (
      node.name.includes("Level") &&
      e.notRecommendedLevel.includes(node.id)
    ) {
      /* 级别 */
      return true;
    }
  });
  return isShowOff;
};
