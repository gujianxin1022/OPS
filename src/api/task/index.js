import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

// 交接单获取基础信息（家长、学生、学科）
/**
 * @param {Object} params 参数对象，包括：
 *        studentLearningPlanId  学习进度id
 *        studentUserId          学生id
 *
 * @returns {Object}  返回对象，包括：
 *        sopParentResp       家长信息
 *        sopStudentResp      学生信息
 *        studentSubjectResp  学科信息
 */
export const getHandoverBaseInfo = (studentUserId, studentLearningPlanId) => {
  return $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/my/sop/handover/student/detail/v2",
    {
      studentUserId: studentUserId,
      studentLearningPlanId: studentLearningPlanId,
    }
  );
};

// 获取试听课信息
/**
 * @param {Object} params 参数对象，包括：
 *        studentLearningPlanId  学习进度id
 *        studentUserId          学生id
 *
 */
export const getAuditionClassInfo = (studentLearningPlanId, studentUserId) => {
  return $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/my/student/list/audition/virtual/class",
    {
      studentLearningPlanId: studentLearningPlanId,
      studentUserId: studentUserId,
    }
  );
};

// 获取学生学科下所有订单v2
/**
 * @param {Object} params 参数对象，包括：
 *        studentLearningPlanId  学习进度id
 *        studentUserId          学生id
 */
export const getOrderInfo = (studentLearningPlanId, studentUserId) => {
  return $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/my/student/list/order",
    {
      studentLearningPlanId: studentLearningPlanId,
      studentUserId: studentUserId,
    }
  );
};

// 获取家庭学管
/**
 * @param {Object} params 参数对象，包括：
 *        parentUserId  学习进度id
 */
export const getFamilyLAList = (parentUserId) => {
  return $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/my/student/list/student/learning/plan",
    { parentUserId: parentUserId }
  );
};

/**
 * 获取交接单信息
 * @param
 * taskId 任务标识
 * taskTypeCode
 * 户角色(1：家长；2：儿童；3：老师；4：城市合伙人；5：OPS用户)
 */
export const getHandOverInfo = function (taskId) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/info/${taskId}/5`
  );
};


/**
 * 交接
 * @param
 * saveHandOverReq
 * sopLeaningPlanReq
 * sopParentReq
 * sopStudentReq
 * sopStudentSubjectReq
 */
export const handleHandoverStuTask = function (param) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/handover/student/v2`,
    param
  );
};

/**
 * 获取学生进度完整链路id
 * @param
 * saveHandOverReq
 * sopLeaningPlanReq
 * sopParentReq
 * sopStudentReq
 * sopStudentSubjectReq
 */
export const reqTreeIdsByPackageId = function (param) {
  return $post(
    `/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/node/no/by/id`,
    param
  );
};

/**
 * 获取名下学管列表
 * @param
 * funcCodeGroup 学管标识（200300 ）
 * userld
 */
export const reqAssignLaList = function (param) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/system/user/list`,
    param
  );
};

/**
 * 获取名下学管列表
 * @param
 * funcCodeGroup 学管标识（200300 ）
 * userld
 */
export const submitAssignLa = function (param) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/distribute/student`,
    param
  );
};
