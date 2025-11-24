import GetData from "@/utils/axios.js";

const { $get, $post, $put } = new GetData();

// ops 课堂结算 - 修正列表-新
export const getCorrectListV2 = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/classroom/correct/list/correct/${pageNum}/${pageSize}`,
    params
  );
};

// ops 课堂结算 - 修正详情-新
export const getCorrectDetail = function (
  virtualClassId,
  classTypeId,
  correctRole
) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/classroom/correct/detail/correct/${virtualClassId}/${classTypeId}/${correctRole}`
  );
};

// ops 课堂结算 - 修正费用新接口
export const saveCorrect = function (params) {
  return $post(
    `/opsapi/teachermanager/teacher-manage/classroom/correct/save/correct`,
    params
  );
};

// ops 课堂结算 - 修正出席状态
export const updateAttendstatus = function (params) {
  return $post(`/opsapi/financeclassroom/update/attendstatus`, params);
};

// ops 课堂结算 - 修正出席状态详情
export const attendstatusDetail = function (classTypeId, virtualClassId) {
  return $get(
    `/opsapi/financeclassroom/log/attendstatus/${classTypeId}/${virtualClassId}`
  );
};

// ops 课堂结算 - 老师反馈
export const teacherFeedback = function (virtualClassId, classTypeId) {
  return $get(
    `/opsapi/financeclassroom/detail/comment/${virtualClassId}/${classTypeId}`
  );
};

// 获取课堂申诉列表-old
export const getAppealList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/financeclassroom/list/appeal/${pageNum}/${pageSize}`,
    params
  );
};

// 获取课堂申诉列表-new
export const getAppealListV2 = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/classroom/appeal/list/appeal/${pageNum}/${pageSize}`,
    params
  );
};

// 获取课堂申诉详情
export const getAppealDetail = function (appealId, classTypeId) {
  return $get(
    `/opsapi/financeclassroom/detail/appeal/${appealId}/${classTypeId}`
  );
};

// 获取课堂申诉详情-新
export const getAppealDetailV2 = function (appealId, classTypeId) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/classroom/appeal/detail/appeal/${appealId}/${classTypeId}`
  );
};

// 获取课堂申诉历史记录
export const getAppealItemHistory = function (virtualClassId) {
  return $get(`/opsapi/financeclassroom/history/appeal/${virtualClassId}`);
};

// 处理申诉
export const updateAppeal = function (params) {
  return $post(`/opsapi/financeclassroom/update/appeal`, params);
};

// 处理申诉-新
export const updateAppealV2 = function (params) {
  return $post(
    `/opsapi/teachermanager/teacher-manage/classroom/appeal/update/appeal`,
    params
  );
};

// 获取申诉截止时间
export const getAppealStopTime = function () {
  return $get(`/opsapi/financeclassroom/appeal/stop/time/list`);
};

// 获取等级申诉列表
export const getLevelAppealList = function (params) {
  return $post(
    `/opsapi/teachersalary/tutor-level-appeal/ops/appeal/list`,
    params
  );
};

// 等级申诉处理提交
export const submitLevelAppeal = function (userId, param, appealType) {
  return $put(`/opsapi/teachersalary/tutor-level-appeal/ops/handle/level`, {
    userId,
    param,
    appealType,
  });
};

// 等级申诉详情
export const getLevelAppealInfo = function (appealIds) {
  return $get(
    `/opsapi/teachersalary/tutor-level-appeal/ops/operate/appeal/list`,
    {
      appealIds,
    }
  );
};
