import GetData from "@/utils/axios.js";
const { $get, $post, $put } = new GetData();

function commonThen(res) {
  const { code, data } = res.data;
  if (code === 200 || code === 0) {
    return data;
  }
  throw new Error(res.data.message);
}
/**
 * 查询家长的评价数据
 */
export function getParentEvaluations(data) {
  return $get("/opsapi/teachingreport/report/parent/evaluate/parentDashboard", data).then(
    commonThen
  );
}
/**
 * 查询对老师的评价数据
 */
export function getEvaluationsOfTeacher(data) {
  return $get("/opsapi/teachingreport/report/parent/evaluate/teacherDashboard", data).then(
    commonThen
  );
}
/**
 * 查询对老师的评价汇总数据
 */
export function getEvaluationsSummaryOfTeacher(data) {
  return $get("/opsapi/teachingreport/report/parent/evaluate/teacherDashboardSummary", data).then(
    commonThen
  );
}
/**
 * 上架/下架家长评价
 * @param {*} data
 * @returns
 */
export function updateEvaluationStatus(data) {
  return $put("/opsapi/teachingreport/report/parent/evaluate/updateStatus", data).then(
    commonThen
  );
}
