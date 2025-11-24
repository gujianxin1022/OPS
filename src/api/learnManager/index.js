import GetData from '@/utils/axios.js'

const { $get, $post, $put } = new GetData()

// 获取学管下学生与家长信息
export const getMyStudents = function (xgUserId) {
  return $get(`/opsapi/workbench/select/xg/information/${xgUserId}`)
}

// 获取是否有新任务
export const getNewTaskStatus = function () {
  return $get(`/opsapi/conselormanager/api/v1/counselor/manage/my/sop/check/todo/task`)
}

// 获取SOP任务列表
export const getSOPTaskList = function () {
  return $get(`/opsapi/workbench/sop/todo/task/list`)
}

/**
 * 分配学生到学管
 * @returns
 */
export const insertDistributionXg = function( params ) {
  return $put(`/opsapi/conselormanager/api/v1/counselor/manage/my/sop/insert/distribution/xg/`, params)
}
