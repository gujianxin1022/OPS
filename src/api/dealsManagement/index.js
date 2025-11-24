import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

/**
 * 获取商机列表
 */
export const getDealList = function (params) {
  return $get(`/api/ops/dealInfo`, params, "zoho");
};

/**
 * 分配顾问
 */
export const changeAdviser = (params) => {
  return $put("/api/ops/dealInfo/withAdviser", params, "zoho");
};
