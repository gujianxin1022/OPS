import { tutorManagement } from '@/api';
export const filedKeyNameMap = {
  identity: "教师",
  gender: "性别",
  teachingStyleIds: "教师风格",
  teachingYearList: "教学年限",
  ageGroupList: "老师年龄段",
  preferredTeachingAgeGroupIds: "适教年龄段",
  nationalityList: "国籍",
  studentCountList: "现有学生",
  doneCountList: "完课数量",
  slotCountList: "放课量",
  ticketRateList: "网络问题",
  absenceRateV2List: "旷课情况",
  educationLevelList: "教育水平",
  credentialList: "教师资格证",
  ethnicityList: "Lingoace",
  accentList: "口音",
  complaintRateList: "被投诉次数",
  fullWork: "老师类型",
  localArea: "老师区域",
  working: "在岗状态",
  hide: "开放状态",
  status: "老师状态",
  hideReason: "变更原因",
  languageIds: "语言标签",
  tmUserId: "教师管理人员",
  packageId: "可教课程",
  packageTreeId: "版本",
  levelId: "级别",
  isBindWecom: "是否绑定企微",
  isCanRenewal: "能否续签",
  contractStatusStr: "签约状态",
  duration: "课程时长",
  dateType: "时间筛选逻辑",
  conversionRateId: "转化率标签",
  personalListType: "收藏/黑名单",
  examineStatus: "审核状态",
  salaryLabel: '薪酬标签',
  isPayoneerRegister: "Payoneer绑定状态",
  isPayoneer: "Payoneer审核状态",
};

export const filedConversionRateIdNameMap = {
  /* 转化率标签 */ 409: "转化达人",
  410: "沟通达人",
  411: "非专项试听",
};

export const filedPersonalListNameMap = {
  /* 教师列表类型 */ 1: "我的收藏",
  2: "我的黑名单",
};

export const filedExamineStatusNameMap = {
  /* 审核状态 */ 
  0: "注册中",
  1: "待审核",
  2: "审核不通过",
  3: "审核通过",
  6: "更新申请",
};

export const filedisPayoneerRegisterNameMap = {
  /* Payoneer绑定状态 */
  "0": "未注册",
  "1": "已注册",
};

export const filedisPayoneerNameMap = {
  /* Payoneer审核状态 */
  "0": "未开通",
  "1": "已开通",
  "2": "未过审",
  "3": "审核中",
};

// 新增支持中英文的Payoneer状态映射
export const getPayoneerRegisterStatusText = (status, lang = 'zh') => {
  const statusMap = {
    "0": lang === 'en' ? "Not Registered" : "未注册",
    "1": lang === 'en' ? "Registered" : "已注册",
  };
  return statusMap[status] || status;
};

export const getPayoneerStatusText = (status, lang = 'zh') => {
  const statusMap = {
    "0": lang === 'en' ? "Not Activated" : "未开通",
    "1": lang === 'en' ? "Activated" : "已开通",
    "2": lang === 'en' ? "Not Approved" : "未过审",
    "3": lang === 'en' ? "Under Review" : "审核中",
  };
  return statusMap[status] || status;
};

let salaryLabelMap = {};

const getSalaryLabelList = async (id) => {
  if (Object.keys(salaryLabelMap).length === 0) {
    try {
      const res = await tutorManagement.getSalaryLabelsList(2);
      if (res.status === 200 && res.data.code === 200) {
        salaryLabelMap = res.data.data.reduce((acc, item) => {
          acc[item.code] = item.description;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error('获取薪酬标签失败:', error);
    }
  }
  return salaryLabelMap[id] || '';
};

export const multipleSelection = [
  "teachingStyleIds",
  "teachingYearList",
  "ageGroupList",
  "preferredTeachingAgeGroupIds",
  "studentCountList",
  "doneCountList",
  "slotCountList",
  "ticketRateList",
  "absenceRateV2List",
  "complaintRateList",
  "educationLevelList",
  "credentialList",
  "ethnicityList",
  "accentList",
  "languageIds",
];
export const filedValueNameMap = {
  1: "男",
  2: "女",
};
export const filedTeachingExperienceNameMap = {
  1: "1年以下",
  2: "1-3年",
  3: "3-5年",
  4: "5-8年",
  5: "8-10年",
  6: "10年以上",
};

export const filedTeacherAgeGroupNameMap = {
  1: "<20",
  2: "20~30",
  3: "30~40",
  4: "40+",
};

export const filedTeacherNumOfStuNameMap = {
  1: "10个以内",
  2: "10-20个",
  3: "20-40个",
  4: "40-60个",
  5: "60个以上",
};

export const filedTeacherNumOfLessonsNameMap = {
  1: "50节以内",
  2: "50-100节",
  3: "100-200节",
  4: "200-300节",
  5: "300节以上",
};

export const filedOpenLessonTimesNameMap = {
  1: "1-10",
  2: "11-30",
  3: "30-50",
  4: "50+",
};

export const filedNetworkIssuesNameMap = {
  1: "从未（0%）",
  2: "少（1%-5%）",
  3: "中（6%-10%）",
  4: "多（10%以上）",
};

export const filedabsenceNameMap = {
  1: "从未（0%）",
  2: "少（1%-5%）",
  3: "中（6%-10%）",
  4: "多（10%以上）",
};

export const filedEducationLevelNameMap = {
  "Bachelor's": "Bachelor's",
  "Master's": "Master's",
  PHD: "PHD",
};

export const filedEnCredentialListNameMap = {
  "A state/province issued teaching license":
    "A state/province issued teaching license",
  "A school or other institution issued teaching license":
    "A school or other institution issued teaching license",
  TESOL: "TESOL",
  TEFL: "TEFL",
  TKT: "TKT",
  CELTA: "CELTA",
  TESL: "TESL",
  ESOL: "ESOL",
  "Other ESL certificate": "Other ESL certificate",
};

export const filedEthnicityNameMap = {
  1: "B",
  2: "Z",
  3: "H",
  4: "Y",
};

export const filedaccentNameMap = {
  1: "美式",
  2: "英式",
  3: "其他",
};

export const filedTimesComplainedNameMap = {
  1: "0次",
  2: "1次",
  3: "2次",
  4: "3次",
  5: "3次以上",
};

export const filedFullWorkNameMap = {
  "": "全部",
  0: "兼职老师",
  1: "全职老师",
};

export const filedLocalAreaNameMap = {
  "": "全部地区",
  1: "新加坡",
  2: "其他",
};

export const filedWorkingNameMap = {
  "": "全部地区",
  0: "未上岗",
  1: "在岗",
  2: "离岗",
};

export const filedHideNameMap = {
  "": "全部",
  0: "全部可教（试听/正式）",
  1: "仅试听",
  2: "仅正式",
  3: "全部不可教",
  4: "限制仅老生正式课",
};

export const filedisBindWecomNameMap = {
  0: "否",
  1: "是",
};
export const filedIsCanRenewalMap = {
  0: "不能续签",
  1: "能续签",
};

export const filedContractStatusStrMap = {
  0: "未签",
  1: "已签（非续签期）",
  2: "已签（续签期）",
  3: "已过期",
};

export const filedteacherStatusMap = {
  0: "未激活",
  1: "已激活",
};

export const filedDateTypeMap = {
  2: "一个即符合",
  1: "全部符合",
};

export const filedHideReasonNameMap = {
  "": "全部",
  0: "全部可教（试听/正式）",
  1: "课量过多",
  2: "老师不想接试听",
  3: "教学质量频繁出现问题",
  4: "频繁请假",
  5: "离职交接期",
  6: "老师态度问题",
  7: "老师质疑平台",
  9: "课量达标",
  10: "请假中",
  11: "教学规范多次违规",
  12: "PS",
  8: "其他",
};

export const transformArray = (arr) => {
  return arr.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});
};

export const getTagName = (key, id) => {
  switch (key) {
    case "teachingStyleIds":
      return filedValueNameMap[id];
    case "teachingYearList":
      return filedTeachingExperienceNameMap[id];
    case "ageGroupList":
      return filedTeacherAgeGroupNameMap[id];
    case "studentCountList":
      return filedTeacherNumOfStuNameMap[id];
    case "doneCountList":
      return filedTeacherNumOfLessonsNameMap[id];
    case "slotCountList":
      return filedOpenLessonTimesNameMap[id];
    case "ticketRateList":
      return filedNetworkIssuesNameMap[id];
    case "absenceRateV2List":
      return filedabsenceNameMap[id];
    case "educationLevelList":
      return filedEducationLevelNameMap[id];
    case "credentialList":
      return filedEnCredentialListNameMap[id];
    case "ethnicityList":
      return filedEthnicityNameMap[id];
    case "accentList":
      return filedaccentNameMap[id];
    case "complaintRateList":
      return filedTimesComplainedNameMap[id];
    case "fullWork":
      return filedFullWorkNameMap[id];
    case "localArea":
      return filedLocalAreaNameMap[id];
    case "working":
      return filedWorkingNameMap[id];
    case "hide":
      return filedHideNameMap[id];
    case "hideReason":
      return filedHideReasonNameMap[id];
    case "isBindWecom":
      return filedisBindWecomNameMap[id];
    case "isCanRenewal":
      return filedIsCanRenewalMap[id];
    case "contractStatusStr":
      return filedContractStatusStrMap[id];
    case "dateType":
      return filedDateTypeMap[id];
    case "status":
      return filedteacherStatusMap[id];
    case "personalListType":
      return filedPersonalListNameMap[id];
    case "examineStatus":
      return filedExamineStatusNameMap[id];
    case "salaryLabel":
      return salaryLabelMap[id] || '';
    case "isPayoneerRegister":
      return filedisPayoneerRegisterNameMap[id];
    case "isPayoneer":
      return filedisPayoneerNameMap[id];
  }
};

// 初始化加载薪酬标签数据
getSalaryLabelList().catch(console.error);

export const filterParams = (params) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (
      value !== "" && // 过滤空字符串
      !(Array.isArray(value) && value.length === 0) &&
      value != null // 过滤空数组
    ) {
      acc[key] = value;
    }
    return acc;
  }, {});
};
