import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

// 获取等级规则条件
// subject 科目类型 0 中文 1 英 2 数 
// salaryLabel 薪酬标签id 

export const getLevelCondition = function (params) {
  return $get(`/opsapi/teachersalary/salary/new/rule/getLevelCondition`,params,);
};
// 保存等级规则
export const saveLevelRule = (params) => {
  return $post(`/opsapi/teachersalary/salary/new/rule/saveSalaryRuleDetail`, params,);
};
// 获取国家列表
export const countryList = function (params) {
  return $get(`/opsapi/usercenter-service/api/v1/pub/usercenter/country/region/all/region/country/list`,params,);
};
