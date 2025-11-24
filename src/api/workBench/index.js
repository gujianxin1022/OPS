import GetData from "@/utils/axios.js";

const { $get, $post, $put, $delete } = new GetData();

/**
 * 获取我的课堂列表信息
 * @param {Int} userId 登录人标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params query参数对象
 *        @param {Int} dateType 日期类型（-7：过去七天，-1：昨天，0：今天，1：明天，7：未来七天）
 *        @param {Int} deptType 部门类型（0：我的工作，1：我的部门）
 *        @param {Int} isAudition 只看试听课（0：否，1：是）
 *        @param {Int} isExamine 只看考核期课堂（0：否，1：是）
 *        @param {Int} isSearchFive 只看学生前5节（0：否，1：是）
 *        @param {Int} isSearchThree 只看换师3节（0：否，1：是）
 *        @param {Int} status 课堂状态（-1：全部，0：未开始，1：正在上课，2：正常结束，3：异常结束，4超时未开始，5：超时未结束）
 *        @param {Int} reason 课堂异常结束原因，-1：全部，1：学生缺席；2：学生设备或网络故障；3：被学生取消；11：教师缺席；12：老师设备或网络故障；20：其他原因；21：学生老师均未出席；22：老师未点击授课结束
 */
export const getMyClassList = function (userId, pageNum, pageSize, params) {
  return $get(
    `/opsapi/workbench/myClassroom/list/${userId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取我的客户详情信息
 * @param {Int} parentUserId 家长用户标识
 */
export const getMyCustomerDetailInfo = function (parentUserId) {
  return $get(`/opsapi/workbench/myCustomer/detail/${parentUserId}`);
};

/**
 * 获取我的客户列表信息v2
 * @param {Object} params query参数对象
 *        @param {Int} dealsId 商机Id
 *        @param {Boolean} dealsOrder 是否成单 true false
 *        @param {Str} endDate  商机创建时间
 *        @param {Str} startDate
 *        @param {Boolean} handover 是否可交接
 *        @param {Int} pageSize 页尺寸
 *        @param {IntStr} postIdStr 部门ID集合
 *        @param {Str} studentName
 *        @param {Int} subject 学科 0:中文 1：英文 不传：全部
 *        @param {Int} userId
 *        @param {IntStr} userIdStr 用户Id集合
 */
export const getMyCustomerList = function (params) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/v2/my/customer/list`,
    params
  );
};

/**
 * 获取我的成交列表信息
 * @param {Int} userId 登录人标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params query参数对象
 *        @param {Int} deptType 部门类型（0：我的工作，1：我的部门）
 */
export const getMyDealList = function (userId, pageNum, pageSize, params) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/deal/list/v2/${userId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取我的学员列表v2
 * @param {Int} userId 登录人标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params query参数对象
 *        @param {Int} funcCode 岗位编码（LA: 200300）
 *        @param {Int} programmeName 版本
 *        @param {IntStr} postIdStr 部门ID集合，多个ID逗号分隔(按组筛选)
 *        @param {IntStr} userIdStr 用户ID集合，多个ID逗号分隔
 *        @param {Str} programmeName 版本
 *        @param {Str} courseLevel 级别
 *        @param {Str} studentName 姓名
 *        @param {Int} parentId
 *        @param {Int} subject 学科（1：中文，2：英文）
 */
export const getMyStudentList = function (userId, pageNum, pageSize, params) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/v2/student/list/${userId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取我的老师列表信息
 * @param {Int} userId 登录人标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params query参数对象
 *        @param {Int} deptType 部门类型（0：我的工作，1：我的部门）
 *        @param {Int} status 老师状态
 *        @param {Int} hide 是否对学生隐藏（0：不隐藏，1：隐藏）
 *        @param {Int} working 是否上岗（0：未上岗，1：已上岗，2：离岗）
 *
 */
export const getMyTeacherList = function (userId, pageNum, pageSize, params) {
  return $get(
    `/opsapi/workbench/myTeacher/list/${userId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 我的课堂异常驳回
 * @param {Int} virtualclassId 课堂标识
 */
export const myClassReject = function (virtualclassId) {
  return $put(`/opsapi/workbench/myClassroom/reject/${virtualclassId}`);
};

export const tourClass = function (classTypeId, virtualclassId, userId) {
  return $get(
    `/opsapi/workbench/myClassroom/tour/${classTypeId}/${virtualclassId}/${userId}`
  );
};

/**
 *
 * 获取渠道码
 *
 */
export const getChannel = function (parentUserld, terminal, subject, materiel) {
  return $get(
    `/campaign/zoho/channel/${parentUserld}/${terminal}/${subject}/${materiel}`,
    {},
    "mkt"
  );
};

export const getPostInfo = function (params) {
  return $post(`/campaign/transparent/api`, params, "mkt");
};

// 我的课堂1对1
export const oneMyclass = function (params) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/v2/my/classroom/1v1/class/list`,
    params
  );
};

// 我的课堂小班课
export const smallMyclass = function (params) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/v2/my/classroom/small/class/list`,
    params
  );
};

// 我的课堂单词陪练
export const wordPracticeApi = function (params) {
  return $post(
    `/opsapi/acevocab/core/coreCourseAppointment/byUserIds/list`,
    params
  );
};

// 工作台-我的课堂-修正课堂的试听状态 (一对一)
export const changeSureTry = function (virtualclassId) {
  return $put(`/opsapi/oneClass/correct_audition_status/${virtualclassId}`);
};

// 工作台-我的课堂-修正课堂的试听状态 (小班课)
export const changeSmallSureTry = function (memberIdStr) {
  return $put(`/opsapi/smallClass/correct_audition_status/${memberIdStr}`);
};

/**
 * 处理任务
 * @param doTaskParamList
 * @returns {*}
 */
export const handleTask = function (doTaskParamList) {
  return $put(`/opsapi/workbench/sop/do/handover`, doTaskParamList);
};

/**
 * 获取学生试听信息
 * @param studentUserId
 * @returns {*}
 */
export const getTrailInfo = function (studentUserId) {
  return $get(`/opsapi/workbench/student/first/course/${studentUserId}`);
};

/**
 * 顾问交接学生
 * @param params
 * @returns {*}
 */
export const exchangeStudent = function (params) {
  return $post(`/opsapi/workbench/handover/student`, params);
};

/**
 * 修改家长信息
 * @param params
 * @returns {*}
 */
export const changeParentUserInfo = function (params) {
  return $post(`/opsapi/user/update/parentInfo/extend/basic/`, params);
};

/**
 * 获取任务详情
 * @param taskTypeCode
 * @param taskCodeId
 * @returns {*}
 */
export const getTaskInfo = function (taskTypeCode, taskCodeId) {
  return $get(
    `/opsapi/workbench/sop/task/info/${taskTypeCode}/${taskCodeId}/5`
  );
};

/**
 * 获取海报配置
 */
export const getPostConfig = function (params) {
  return $post(`/opsapi/poster/list`, params);
};
/**
 * 查询家长是否在交接白名单
 */
export const queryIsWhiteListUser = (parentUserId) =>
  $get(`/opsapi/white/list/parent/handover/status/${parentUserId}`);

/**
 * 获取学管部门配置列表
 */
export const getLAConfigList = () =>
  $get(`/opsapi/workbench/sop/task/my/sop/post/config/list`, { configType: 1 });

/**
 * 获取学管交接部门列表
 */
export const getLAConfigSelectList = () =>
  $get(`/opsapi/workbench/sop/task/my/sop/list/handover/post`);

/**
 * 新增交接部门配置
 */
export const setHandoverConfig = (params) =>
  $post(`/opsapi/workbench/sop/task/my/sop/config/handover/post`, params);

/**
 * 获取名下学管及领导信息
 */
export const getLALists = () =>
  $get(`/opsapi/workbench/sop/task/my/sop/all/la/user/list/v1`);

/**
 * 获取名下学管部门信息
 */
export const getLAPostLists = () =>
  $get(`/opsapi/workbench/sop/task/my/sop/my/la/post/list/v1`);
/**
 * 获取待分配进度列表
 */
export const getUnAssignedList = (pageNum, pageSize, params) => {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/wait/allocation/student/list/v2/${pageNum}/${pageSize}`,
    params
  );
};

/**自动分配-新建规则 */
export const createRule = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/create`,
    params
  );
};

/**更新规则 */
export const updateRule = (params) => {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/update`,
    params
  );
};

export const deleteRule = (ruleId) => {
  return $delete(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/delete/${ruleId}`
  );
};

export const changeRuleStatus = (ruleType, id, status) => {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/update/status?ruleType=${ruleType}`,
    { id, status }
  );
};

export const ruleListSort = (ruleId, seq) => {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/update/seq/${ruleId}/${seq}`
  );
};

export const getRuleDetail = (ruleId, ruleType) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/info/${ruleId}?ruleType=${ruleType}`
  );
};

/**规则列表 */
export const getRuleList = (ruleType) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/rules/manage/rule/list?ruleType=${ruleType}`
  );
};

/** 学管分配设置列表*/
export const getAssignLaConfigList = (userIdStr, postIdStr) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/rules/person/manage/list`,
    {
      userIdStr,
      postIdStr,
    }
  );
};

/**获取人员配置信息 */
export const getLaConfigInfo = (personId) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/rules/person/manage/info?personId=${personId}`
  );
};

/**批量性修改配置信息
 * @param
 * personIdList:number[]
 * subjectIds
 * classTypeIds
 * language
 * dutyCycle
 * workStartTime
 * workEndTime
 * leaveStartTime
 * leaveEndTime
 * autoAssign
 */
export const batchUpdateConfig = (params) => {
  const personId = params.personIdList;
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/rules/person/manage/batch/update/config?personId=${personId}`,
    params
  );
};

/* 获取我的工单列表 */
export const reqWorkOrderList = async (params) => {
  const { status, data } = await $get(
    `/opsapi/ticket/api/v1/ticket/ops/list`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 获取我的工单详情 */
export const reqWorkOrderInfo = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/ticket/api/v1/ticket/ops/detail`, params);
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};

/* 工单评论 */
export const reqWorkOrderComment = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(`/opsapi/ticket/api/v1/ticket/ops/comment`, params);
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};

/* 工单更新 */
export const reqUpdateWorkOrder = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(`/opsapi/ticket/api/v1/ticket/ops/update`, params);
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};

/* 工单配置（分类） */
export const reWorkOrderConfig = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/ticket/api/v1/ticket/ops/config`, params);
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};

/* 工单创建 */
export const reWorkOrderCreate = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/ticket/api/v1/ticket/ops/create`, params);
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};
/** 获取建联看板统计数据 */
export function getContactDashboardStatistics({employeeId,querySource}) {
  return $get(`/opsapi/dws/student/handover/query/board/count?userId=${employeeId}&querySource=${querySource}`).then(res=>{
    if (res.status !== 200 || res.data.code !== 200) return Promise.reject();
    return res.data;
  });
}
/** 获取建联看板列表数据 */
export function getContactDashboardList(data) {
  return $post(`/opsapi/dws/student/handover/query/board`, data).then(res=>{
    if (res.status !== 200 || res.data.code !== 200) return Promise.reject();
    return res.data;
  });
}
