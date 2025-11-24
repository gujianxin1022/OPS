import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

/**修改规则状态 */
export const changeRuleStatus = function () {
  return $post(`/opsapi/conselormanager/xxx`);
};

/**获取常用规则列表 */
export const getNormalRuleList = function () {
  return $get(`/opsapi/conselormanager/xxx`);
};

/**获取兜底规则列表 */
export const getDefaultRuleList = function () {
  return $get(`/opsapi/conselormanager/xxx`);
};

/**新建常用规则 */
export const newNormalRule = function () {};

/**新建兜底规则 */
export const newDefaultRule = function () {};
