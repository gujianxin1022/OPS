/**
 * 测评管理
 */
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
 * 查询学生-学科下的定级测评记录
 */
export function getStudentGradeEvaluationRecords({ studentId, subjectId }) {
  return $get(
    `/opsapi/previewmanager/unityTeachPlatform/evaluation/info/getStudentGradeEvaluationRecords?studentId=${studentId}&subjectId=${subjectId}`
  ).then(commonThen);
}
/**
 * 打开/关闭 学生-学科下的某个定级测评
 */
export function handleStudentGradeEvaluationConfig(data) {
  return $post(
    `/opsapi/previewmanager/unityTeachPlatform/evaluation/info/handleStudentGradeEvaluationConfig`,
    data
  ).then(commonThen);
}
/**
 * 查询学生-学科下的阶段测评
 */
export function getStudentStageEvaluationRecords({ studentId, subjectId }) {
  return $get(
    `/opsapi/previewmanager/unityTeachPlatform/evaluation/info/getStudentStageEvaluationRecords?studentId=${studentId}&subjectId=${subjectId}`
  ).then(commonThen);
}
