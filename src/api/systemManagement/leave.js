import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

function commonThen(res) {
  const { code, data, message } = res.data;
  if (code === 200 || code === 0) {
    return data;
  }
  throw new Error(message);
}
// 获取待离职员工列表
export function getAwaitingResignationEmployeeList() {
  return $get(
    "/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/predimissionlist"
  ).then(commonThen);
}
// 获取待离职员工数
export function getAwaitingResignationEmployeeCount() {
  return $get(
    "/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/predimissioncount"
  ).then(commonThen);
}
// 撤销员工的待离职状态
export function cancelResignation(id) {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/cancelpredimission?id=${id}`
  ).then(commonThen);
}
