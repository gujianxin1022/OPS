/* 老师年龄段 */
export const teacherAgeGroup = [
  {
    label: "<20",
    value: 1,
  },
  {
    label: "20~30",
    value: 2,
  },
  {
    label: "30~40",
    value: 3,
  },
  {
    label: "40+",
    value: 4,
  },
];

/* 适教年龄段 */
export const teachingStudentAgeGroup = [
  {
    label: "3~5岁",
    value: 1,
  },
  {
    label: "5~8岁",
    value: 2,
  },
  {
    label: "8~11岁",
    value: 3,
  },
  {
    label: "11岁以上",
    value: 4,
  },
];

/* 种族 */
export const race = [
  {
    label: "B",
    value: 1,
  },
  {
    label: "Z",
    value: 2,
  },
  {
    label: "H",
    value: 3,
  },
  {
    label: "Y",
    value: 4,
  },
];

/* 口音 */
export const accent = [
  {
    label: "美式",
    value: 1,
  },
  {
    label: "英式",
    value: 2,
  },
  {
    label: "其他",
    value: 3,
  },
];

/* 网络问题  电子教师老师网络问题类工单次数 / 总完课数 （近三个月）*/
export const networkIssues = [
  {
    label: "从未（0%）",
    value: 1,
  },
  {
    label: "少（1%-5%）",
    value: 2,
  },
  {
    label: "中（6%-10%）",
    value: 3,
  },
  {
    label: "多（10%以上）",
    value: 4,
  },
];

/* 旷课情况  总旷课次数 / 总完课数 （近三个月）*/
export const absenceOptions = [
  {
    label: "从未（0%）",
    value: 1,
  },
  {
    label: "少（1%-5%）",
    value: 2,
  },
  {
    label: "中（6%-10%）",
    value: 3,
  },
  {
    label: "多（10%以上）",
    value: 4,
  },
];

/* 被投诉次数 总投诉次数 / 总完课数*/
export const timesComplained = [
  {
    label: "0次",
    value: 1,
  },
  {
    label: "1次",
    value: 2,
  },
  {
    label: "2次",
    value: 3,
  },
  {
    label: "3次",
    value: 4,
  },
  {
    label: "3次以上",
    value: 5,
  },
];

export const teachingYears = [
  {
    label: "1年以下",
    value: 1,
  },
  {
    label: "1-3年",
    value: 2,
  },
  {
    label: "3-5年",
    value: 3,
  },
  {
    label: "5-8年",
    value: 4,
  },
  {
    label: "8-10年",
    value: 5,
  },
  {
    label: "10年以上",
    value: 6,
  },
];

export const openLessonTimes = [
  /* 放课量 */
  {
    label: "1-10",
    value: 1,
  },
  {
    label: "11-30",
    value: 2,
  },
  {
    label: "30-50",
    value: 3,
  },
  {
    label: "50+",
    value: 4,
  },
];

export const fullWorkList = [
  /* 老师类型 */
  {
    label: "全部",
    value: "",
  },
  {
    label: "兼职老师",
    value: "0",
  },
  {
    label: "全职老师",
    value: "1",
  },
];

export const localAreaList = [
  {
    label: "全部地区",
    value: "",
  },
  {
    label: "新加坡",
    value: "1",
  },
  {
    label: "其他",
    value: "2",
  },
];

export const workingStatusList = [
  { label: "全部", value: "" },
  { label: "未上岗", value: "0" },
  { label: "在岗", value: "1" },
  { label: "离岗", value: "2" },
];

export const openForTeacherList = [
  { label: "全部", value: "" },
  { label: "全部可教（试听/正式）", value: "0" },
  { label: "仅试听", value: "1" },
  { label: "仅正式", value: "2" },
  { label: "全部不可教", value: "3" },
  { label: "限制仅老生正式课", value: "4" },
];

export const blackAndCollectForTeacherList = [
  { label: "全部", value: "" },
  { label: "我的收藏", value: "1" },
  { label: "我的黑名单", value: "2" },
];

export const examineStatusList=[
  { label: "注册中", value: "0" },
  { label: "待审核", value: "1" },
  { label: "审核不通过", value: "2" },
  { label: "审核通过", value: "3" },
  { label: "更新申请", value: "6" },
]

export const teacherStatusList = [
  { label: "未激活", value: "0" },
  { label: "已激活", value: "1" },
];

export const reasonList=[
  { label: "全部", value: "" },
  { label: "课量过多", value: '1' },
  { label: "老师不想接试听", value: '2' },
  { label: "教学质量频繁出现问题", value: '3' },
  { label: "频繁请假", value: '4' },
  { label: "离职交接期", value: '5' },
  { label: "老师态度问题", value: '6' },
  { label: "老师质疑平台", value: '7' },
  { label: "课量达标", value: '9' },
  { label: "请假中", value: '10' },
  { label: "教学规范多次违规", value: '11' },
  { label: "PS", value: '12' },
  { label: "其他", value: '8' },
]

export const isPayoneerRegisteStatusList=[
  { label: "未注册", value: "0" },
  { label: "已注册", value: '1' },
]

export const isPayoneerStatusList=[
  { label: "未开通", value: "0" },
  { label: "已开通", value: '1' },
  { label: "未过审", value: '2' },
  { label: "审核中", value: '3' },
]