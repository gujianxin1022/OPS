import GetData from "@/utils/axios.js";

const { $get, $post, $put, $delete } = new GetData();
/*************************************************  新接口 ********************************************* */

/**
 * 获取学生列表-新
 * https://yapi.lingoace.com/project/160/interface/api/14757
 */
export const getStudentListNew = function (queryParams) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/v2/student/list/v3`,
    queryParams
  );
};

/**
 * 查询列表字段显隐
 * https://yapi.lingoace.com/project/160/interface/api/14755
 * @param functionPoint 功能点
 * @param isHide  0-显示 1-隐藏
 */
export const getShowOrHideFields = function (functionPoint, isHide) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/list/field/config/list`,
    {
      functionPoint,
      isHide,
    }
  );
};

/**
 * 更新字段显隐
 * https://yapi.lingoace.com/project/160/interface/api/14751
 * @param {ownerId、functionPoint、fieldList、isHide}
 */
export const updateFields = function (params) {
  return $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/list/field/config/update`,
    params
  );
};

/**
 * 获取常用筛选列表
 * https://yapi.lingoace.com/project/160/interface/api/14747
 * @param functionPoint 功能点
 */
export const getNormalFilterList = function (functionPoint) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/query/form/cache/list`,
    {
      functionPoint,
    }
  );
};

/**
 * 新增常用筛选项
 * https://yapi.lingoace.com/project/160/interface/api/14743
 */
export const addNormalFilter = function ({
  functionPoint,
  formName,
  formInfo,
}) {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/query/form/cache/add`,
    {
      functionPoint,
      formName,
      formInfo,
    }
  );
};

/**
 * 更新常用筛选项
 * https://yapi.lingoace.com/project/160/interface/api/14745
 */
export const updateNormalFilter = function ({ id, formName, formInfo }) {
  return $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/query/form/cache/update`,
    {
      id,
      formName,
      formInfo,
    }
  );
};

/**批量更新缓存表单 */
export const batchUpdateCacheForm = (submitData) => {
  return $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/query/form/cache/update/batch`,
    submitData
  );
};

/**
 * 常用筛选项删除
 */
export const deleteNormalFilter = function (id) {
  return $delete(
    `/opsapi/conselormanager/api/v1/counselor/manage/query/form/cache/delete/${id}`
  );
};

/**
 * 学管概要数据
 * https://yapi.lingoace.com/project/160/interface/api/14759
 */
export const getDataBoard = function (userId) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/data/board/${userId}`
  );
};

/**数据更新时间 */
export const getDataUpdateTime = function (studentUserId, subjectTypeId) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/v2/student/data/analysis/time`
  );
};

/*****************************************  老接口 ******************************************** */
/**
 * 获取续费窗口用户列表
 */
export const getRenewUser = function (params) {
  return $get(`/opsapi/student/warn/active/list`, params);
};

/**
 * 获取不活跃用户列表
 */
export const getInActiveUser = function (params) {
  return $get(`/opsapi/student/warn/oscitancy/list`, params);
};

/**
 * 获取下载的续费窗口用户列表
 */
export const downloadsRenewUserData = function () {
  return $get(`/warn/student/downloads/?balance_sum=10`);
};

/**
 * 获取下载的不活跃用户列表
 */
export const downloadsInactiveUserData = function () {
  return $get(`/warn/student/downloads?active_balance_sum=10&active_day=14`);
};

/**
 * 获取学生课表
 * @param {Int} student_id 学生用户标识
 */
export const getStudentTimetables = function (
  studentUserId,
  startTime,
  endTime
) {
  return $get(
    `/opsapi/schedule/student/timetable/${studentUserId}/${startTime}/${endTime}`
  );
};

/**
 * 获取学生可用老师
 * @param {Object} param 参数对象
 *  @param {Int} page 当前页
 *  @param {Int} page_size 页尺寸
 *  @param {Int} start_time UTC时间
 *  @param {String} teacher_name 老师用户名
 *  @param {Int} status 老师状态
 *  @param {Int} student_id 老师状态
 *  @param {String} tutor_type 老师类型： often_tutor/able_tutor 常用/可用
 */
export const getStudentCanAppointTeacher = function (params) {
  return $get(`/teacher_match/`, params);
};

/**
 * 约课
 * @param {Object} params 参数对象
    tutorUserId 老师用户标识
    studentUserId 学生用户标识
    opType  操作类型 1 预约， 2，取消预约
    startTime  约课的开始时间
    endTime    一节课结束的时间
    endRecurringTime  约课的结束时间 最后的时间
 */
export const appointClass = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/one/to/one/student/subscribe`,
    params
  );
};

/**
 * 取消约课
 */
export const cancelClass = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/cancel/ops/doCancel/cycle`,
    params
  );
};

/**
 * 取消约课原因列表
 */
export const reqCancelReason = function () {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/class/cancelreason/config?client=ops`
  );
};

/**
 * Java 确定代课老师 1v1
 * @param {Object} params 参数对象
 *    @param {Object} tutor_user_id 老师标识
 *    @param {Object} absent_tutor_user_id 被代课的老师标识
 *    @param {Object} start_time 开始时间
 */
export const substituteTeacher = function (tutorUserId, virtualClassId) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/one/to/one/update/tutor/absent/${tutorUserId}/${virtualClassId}`
  );
};

/**
 * Java 确定代课老师 smallClass
 * @param {Object} params 参数对象
 *    @param {Object} tutor_user_id 老师标识
 *    @param {Object} absent_tutor_user_id 被代课的老师标识
 *    @param {Object} start_time 开始时间
 */
export const substituteTeacherSmallClass = function (
  tutorUserId,
  virtualClassId
) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/timetable/tutor/absent/${tutorUserId}/${virtualClassId}`
  );
};

/**
 * Java 确定代课老师 bigClass
 * @param {Object} params 参数对象
 *    @param {Object} tutor_user_id 老师标识
 *    @param {Object} absent_tutor_user_id 被代课的老师标识
 *    @param {Object} start_time 开始时间
 */
export const substituteTeacherBigClass = function (
  tutorUserId,
  virtualClassId
) {
  return $put(
    `/opsapi/bigClass/update/schedule/tutor/${tutorUserId}/${virtualClassId}`
  );
};

/**
 * 修改学生注册信息
 * @param {Object} params 参数对象
 */
export const editStudentInfo = function (student_id, params) {
  return $put(`/student/${student_id}/edit_student/`, params);
};

/**
 * 顾问注册学生用户中心账号
 * @param {Object} params 参数对象
 *      @param {Int} adviserUserId  当前登录ops用户-顾问标识
 *      @param {Int} adviserUserName  当前登录ops用户-顾问名称
 *      @param {Int} adviserUserPhone  当前登录ops用户-顾问电话
 *      @param {Int} isStaff  是否公司员工 0 不是 1是
 *      @param {Int} studentBirthday  学生出生日期
 *      @param {Int} studentRealName  学生用户名称
 *      @param {Int} studentSex  学生性别 1 男 2 女
 *      @param {Int} userIdentify  家长用户标识： 电话或者邮箱
 */
export const registryStudentUser = function (params) {
  return $post(`/opsapi/user/adviserCreate/parentAndStudentInfo`, params);
};

/**
 * 更换顾问
 * @param {Int} userStudentId 学生id
 * @param {Int} newAdviserId 新顾问id
 * @param {Int} operatorId 操作人id
 */
export const changeParentAdviserInfo = function (
  userStudentId,
  operatorId,
  { newAdviserId, newXgId }
) {
  if (newAdviserId) {
    return $put(
      `/opsapi/user/ops/change/parentAdviserInfo/${userStudentId}/${operatorId}?newAdviserId=${newAdviserId}`
    );
  } else if (newXgId) {
    return $put(
      `/opsapi/user/ops/change/parentAdviserInfo/${userStudentId}/${operatorId}?newXgId=${newXgId}`
    );
  }
};

/**
 * 获取家长详情基本资料
 * @param {Int} parentUserId 家长id
 */
export const getParentUserBasicInfo = function (parentUserId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/parentInfo/basic/v2/${parentUserId}`
  );
};
/**
 * 修改家长短信通知开关
 * @param {Int} parentUserId 家长id
 */
export const getParentUserChangeSms = function (parentUserId) {
  return $get(`/opsapi/parent/change_sms_notify/${parentUserId}`);
};
/**
 * 查询消费归属地国家列表
 */
export const getParentUserCountryList = function () {
  return $get(`/opsapi/common/country/list`);
};

/**
 * 修改家⻓消费归属地证明材料信息
 * @param {Int} parentUserId 家长id
 * @param {String} reason 修改原因
 * @param {String} reason 消费额额归属地
 * @param {List} certificatesList 证明材料
 */
export const editParentInfoAttribution = function (params) {
  return $post(
    `/opsapi/user/update/parentInfo/consumption/attribution/`,
    params
  );
};

/**
 * 获取家长详情课时明细
 * @param {Int} parentUserId 家长id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getParentClassItemInfo = function (
  parentUserId,
  pageNum,
  pageSize
) {
  return $get(
    `/opsapi/user/parentInfo/classItem/${parentUserId}/${pageNum}/${pageSize}`
  );
};
/**
 * 获取家⻓消费归属地证明材料信息
 * @param {Int} parentUserId 家长id
 */
export const getParentUserAttribution = function (parentUserId) {
  return $get(
    `/opsapi/user/select/parentInfo/consumption/attribution/${parentUserId}`
  );
};
/**
 * 获取学生详情上课安排
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentAttendClassInfo = function (
  studentUserId,
  pageNum,
  pageSize
) {
  return $get(
    `/opsapi/user/studentInfo/attendClass/${studentUserId}/${pageNum}/${pageSize}`
  );
};
/**
 * 获取学生详情历史课堂
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentHistoryClassInfo = function (
  studentUserId,
  pageNum,
  pageSize
) {
  return $get(
    `/opsapi/user/studentInfo/hisClass/${studentUserId}/${pageNum}/${pageSize}`
  );
};

/**
 * 获取学生详情上课安排
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentAttendClass = function (
  studentUserId,
  pageNum,
  pageSize
) {
  return $get(
    `/opsapi/user/studentInfo/attendClass/${studentUserId}/${pageNum}/${pageSize}`
  );
};

/**
 * 获取学生详情历史课堂
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentHisClass = function (studentUserId, pageNum, pageSize) {
  return $get(
    `/opsapi/user/studentInfo/hisClass/${studentUserId}/${pageNum}/${pageSize}`
  );
};

/**
 * 设置推荐人
 * @param {Int} referrerUserIdentify 推荐人用户名
 * @param {Int} id 家长ID
 */
export const setReferrer = function (params) {
  return $put(`/opsapi/user/referrerUser/update`, params);
};

/**
 * 增加孩子
 * @param {Int} parentUserId 家长ID
 * @param {string} avatar 头像
 * @param {string} realName 姓名
 * @param {int} gender 性别，0-未知，1-男，2-女
 * @param {date} birthday 生日
 */
export const addNewStudent = function (params) {
  return $post(`/opsapi/user/children`, params);
};
/*
 * 获取学生档案
 */
export const getStudentDetails = function (id, subjectTypeId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/base/subject/${id}`,
    {
      subjectTypeId,
    }
  );
};

/**
 * 更新学生档案信息 java
 * @param {Int} id 学生id
 * @param {Object} params 参数对象
 *        @param {String} chineseExperience 中文学习经历
 *        @param {String} classYear 在校年级
 *        @param {String} equipment  学生备注姓名
 *        @param {String} languageEnvironment  家庭语言环境0:未知 1：父母一方华裔 2：父母双方华裔 3：父母双方均非华裔
 *        @param {String} listenSpeakAbility   中文听说能力
 *        @param {String} literacy   中文识字量：0：未知 1-0 2-1~50 3-51~100 4-101~200 5-200~500 6-500以上
 *        @param {String} parentalExpectation    家长期望和特殊说明
 *        @param {String} pinyin     是否学过拼音
 *        @param {String} teachingStyle    教学风格
 *        @param {String} writeAmount    教学风格
 */
export const updateStudentInfo = function (params) {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/base/subject/update`,
    params
  );
};

/**
 * 赠送试听课
 */
export const giveLesson = function (studentUserId, packageId, parentUserId) {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/student/free/audition/class/hours/`,
    { packageId, studentUserId, parentUserId }
  );
};

/**
 * 检查是否能赠送试听课
 */
export const checkCanGiveLesson = function (studentUserId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/student/check/free/audition/class/hours`,
    { studentUserId }
  );
};

/**
 * 试听课包列表
 */
export const getTryLessonList = function (packageType) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/course/package/list`,
    { packageType }
  );
};

/**
 * 课程树
 * @param packageId 课程包id
 * @param packageTreeId 课程树id
 */
export const getCourseTree = function (packageId, packageTreeId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/course/course/level/unit/info/v2`,
    { packageId, packageTreeId }
  );
};
/**
 * 获取学生用户家长是否充值
 * @param {Int} studentId 学生标识
 */
export const getStudentParentRecharge = function (studentId) {
  return $get(`/opsapi/student/check/parent/recharge/${studentId}`);
};

/**
 * 获取家长详情商机信息表
 */
export const getDealsDatas = function (parentId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/parentInfo/business/opportunity/${parentId}`
  );
};

/**
 * 获取学生是否有日志
 * @param {Int} studentId 学生标识
 */
export const getStudentHasLog = function (studentId) {
  return $get(
    `/opsapi/smallClass/classType/check/student/have/log/${studentId}`
  );
};

/**
 * 获取学生详情上课安排 - 1对1
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentAttendClassOneClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/oneClass/student/classArrangement/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    { startTimeOrder }
  );
};

/**
 * 获取学生详情上课安排 - 小班课
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentAttendClassSmallClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/smallClass/student/classArrangement/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    { startTimeOrder }
  );
};

/**
 * 获取学生详情上课安排 - 大班课
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentAttendClassBigClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/bigClass/student/classArrangement/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    { startTimeOrder }
  );
};

/**
 * 获取学生详情历史课堂 - 1对1
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentHisClassOneClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/oneClass/student/hisClass/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    {
      startTimeOrder,
    }
  );
};

/**
 * 获取学生详情历史课堂 - 小班课
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentHisClassSmallClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/smallClass/student/hisClass/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    { startTimeOrder }
  );
};

/**
 * 获取学生详情历史课堂 - 大班课
 * @param {Int} studentUserId 学生id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getStudentHisClassBigClass = function (
  studentUserId,
  pageNum,
  pageSize,
  coursePackageId,
  startTimeOrder
) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/bigClass/student/hisClass/${studentUserId}/${coursePackageId}/${pageNum}/${pageSize}`,
    { startTimeOrder }
  );
};

/**
 * 获取家长名下所有的产品列表
 * @param {Int} parentUserId 家长Id
 */
export const getParentProductList = function (parentUserId) {
  return $get(`/opsapi/product/purchased/list/${parentUserId}`);
};

/**
 * 获取产品课时明细
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Int} parentUserId 家长id
 * @param {Object} params 参数对象
 */
export const getProductHoursDetail = function (
  pageNum,
  pageSize,
  parentUserId,
  params
) {
  return $get(
    `/opsapi/product/detail/${pageNum}/${pageSize}/${parentUserId}`,
    params
  );
};

/**
 * 课时转换-1v1青少版转1v1启蒙版
 * @param {Int} userParentId 家长标识
 * @param {Int} productId 产品标识
 * @param {Int} amount 课时
 */
export const productAmountChange = function (userParentId, productId, amount) {
  return $put(
    `/opsapi/product/amount/change/${userParentId}/${productId}/${amount}`
  );
};

/**
 * 分配学生学管
 * @param {Object} params 参数对象
 */
export const studentLearnManager = function (userId, params) {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/student/reassignment/learnManager/${userId}`,
    params
  );
};

/**分配学管-新(按学科、单个) */
export const assignLASingle = function (params) {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/distribution/xg/parent/single`,
    params
  );
};

/**批量分配-新（按学科、批量） */
export const batchAssignLA = function (params) {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/distribution/xg/parent/batch`,
    params
  );
};

/**
 * 分配学生顾问
 * @param {Object} params 参数对象
 */
export const studentAdviser = function (params) {
  return $put(`/opsapi/student/adviser`, params);
};

/**
 * 添加收据
 * @param params
 * @returns {*}
 */
export const addInvoiceForParent = function (params) {
  return $post(`/opsapi/user/invoice/info/insert`, params);
};

/**
 * 删除收据
 * @param userParentInvoiceInfoId 收据id
 * @returns {*}
 */
export const deleteInvoiceForParent = function (userParentInvoiceInfoId) {
  return $post(`/opsapi/user/invoice/info/delete/${userParentInvoiceInfoId}`);
};

/**
 * 获取家长收据LIST
 * @param parentUserId
 * @returns {*}
 */
export const getParentInvoices = function (parentUserId) {
  return $post(`/opsapi/user/invoice/info/select/${parentUserId}`);
};

/**
 * 修改家长收据
 * @param params
 * @returns {*}
 */
export const updateParentInvoice = function (params) {
  return $post(`/opsapi/user/invoice/info/update`, params);
};

/**
 * 获取学生待处理的任务
 * @param studentId 学生id
 * @returns {*}
 */
export const getStudentTask = function (studentId) {
  return $get(`/opsapi/workbench/sop/todo/task/list/${studentId}`);
};

/**
 * 添加跟进记录
 * @param doTaskParamList 跟进list
 * @returns {*}
 */
export const addStudentTasks = function (doTaskParamList) {
  return $put(`/opsapi/workbench/sop/batch/do/task`, doTaskParamList);
};

/**
 * 添加自发跟进记录
 * @param addMyTaskParam 单个自发跟进对象
 * @returns {*}
 */
export const addStudentTaskByMyself = function (addMyTaskParam) {
  return $post(`/opsapi/workbench/sop/my/task`, addMyTaskParam);
};

/**
 * 获取家长可以被打的标记集合
 * @returns
 */
export const getParentTagList = function () {
  return $get(`/opsapi/workbench/select/all/parent/tag/`);
};

/**
 * 小班课请假-v2
 * @returns
 */
export const reqStudentLeave = function (params) {
  return $put(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/do/leave`,
    params
  );
};

/**
 * 处理学生首课回访任务
 * @returns
 */
export const handleRevisit = function (params) {
  return $put(`/opsapi/workbench/sop/do/first/course/revisit`, params);
};

/**
 * 朋友圈分享次数-课包列表查询
 * @returns
 */
export const reqProductTabList = function (parentUserId) {
  return $get(`/opsapi/friend/share/product/list/${parentUserId}`);
};

/**
 * 朋友圈分享次数-列表查询
 * @returns
 */
export const reqShareChangeList = function (parentUserId, pageNum, pageSize) {
  return $get(
    `/opsapi/friend/share/change/list/${parentUserId}/${pageNum}/${pageSize}`
  );
};

/**
 * 获取课程产品等值积分
 */
export const getClassHourCoin = function () {
  return $get(`/opsapi/transfer/class/hour/coin`);
};

/**
 * 获取转出课时产品下拉列表
 */
export const getUserAccountProductList = function (parentUserId) {
  return $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/get/account/product/list`,
    { parentUserId: parentUserId }
  );
};

/**
 * 获取转出原因
 */
export const getClassHourReason = function () {
  return $get(`/opsapi/transfer/reason/transfer`);
};

/**
 * 查询课时转换日志
 */
export const getClassJournalList = function (pageNum, pageSize, params) {
  return $get(`/opsapi/transfer/list/${pageNum}/${pageSize}`, params);
};

/**
 * 朋友圈分享次数-列表查询
 * @returns
 */
export const studentStatusShow = function (studentId, status) {
  return $put(`/opsapi/student/status/${studentId}/${status}`);
};

/**
 * 课前提醒 查询家长提醒开关页面
 * @returns
 */
export const getRemindSwitch = function (parentId, params) {
  return $get(`/opsapi/parent/remind/page/offOn/${parentId}`, params);
};

/**
 * 课前提醒 修改家长的消息提醒按钮
 * @returns
 */
export const editNewsRemind = function (params) {
  return $put(`/opsapi/parent/remind/update/offOn`, params);
};

/**
 * 课前提醒 是否展示提醒开关
 * @returns
 */
export const getShowSwitch = function (parentId) {
  return $get(`/opsapi/parent/show/offOn/${parentId}`);
};

// 更新家长邮箱、手机号、登陆名
export const updateParentInfo = (params) =>
  $put(
    "/opsapi/studentcenter/api/v1/pub/studentcenter/user/parent/info/by/id",
    params
  );

// 查询学生账户总览信息
export const queryStudentAccountInfo = (params) =>
  $get("/opsapi/student/account/info", params);

// 查询剩余课时明细列表
export const queryStudentAccountBalanceList = (params) =>
  $get("/opsapi/student/account/balance/list", params);

//学生课时标准转换
export const standardConversionStudentClassHours = (params) =>
  $post(
    "/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/standard/transfer",
    params
  );

//学生课时特殊转换
export const specialConversionStudentClassHours = (params) =>
  $post(
    "/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/special/transfer",
    params
  );

// 获取学生课时详情
export const queryStudentClassDetails = (params) =>
  $get(
    "/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/student/account/detail/v2",
    params
  );

// 查询家长账户明细列表
export const queryParentAccountDetailsList = (parentUserId) =>
  $get(`/opsapi/product/parent/purchased/detail/${parentUserId}`);

// 家长课时转孩子
export const parentsClassHoursTransferStudent = (params) =>
  $post(
    "/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/parent/transfer/student",
    params
  );

// 学生账户-课程包（产品）下拉列表
export const getStudentProductList = (params) =>
  $post("/opsapi/student/product/name", params);

// 作业查询接⼝
export const homeworkInfo = function (
  virtualClassId,
  studentUserId,
  classTypeId,
  lessonId,
  homeworkType
) {
  return $get(
    `/opsapi/teachinghomework/homework/student/homework/new/info/${virtualClassId}/${studentUserId}/${classTypeId}/${lessonId}/${homeworkType}`
  );
};


// 获取学生课包学习进度
export const getStudentLearningPlan = (params) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/student/learning-plan/info`,
    params
  );
};

/**
 * 获取课程包列表
 * @param {Int} courseType 课程类型（0：中文，1：英文）默认中文
 * @param {Int} packageType 课包类型（1-试听，0-正式）
 */
export const getCoursePackageList = (params) => {
  const { packageType, courseType, studentId } = params;
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/package/list/${studentId}`,
    {
      packageType,
      courseType,
    }
  );
};

/**
 * 获取学生档案学习情况信息
 * @param {Int} courseType 课程类型（0：中文，1：英文）默认中文
 * @param {Int} packageType 课包类型（1-试听，0-正式）
 */
export const getStudentSituation = (
  studentId,
  packageId,
  packageType,
  parentUserId,
  activityType
) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/situation/${studentId}`,
    {
      packageId,
      packageType,
      parentUserId,
      activityType: activityType,
    }
  );
};

/**
 * 学生档案-调整进度-课程树接口
 * @param
 * packageId 课程包id
 */
export const getCourseProgressTree = function (packageId) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/course/course/level/unit/info/v2`,
    { packageId: packageId }
  );
};

/**
 * 调整课程进度
 * @param studentId
 * @param newEditionId
 * @param newLevel
 * @param newLessonId
 * @param packageId
 * @param packageTreeId
 */
export const adjustCourseProgress = function (params) {
  return $put(
    `/opsapi/studentmanager/api/v1/student/manage/schedule/v2/adjustment/student/schedule`,
    params
  );
};

// 孩子课时转孩子
export const studentClassHoursTransferStudent = (params) =>
  $post(
    "/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/student/transfer/student",
    params
  );

export const getTransferCoursePackageList = () =>
  $get("/opsapi/transfer/course/package/list");

// 发送授权验证邮件
export const parentSendEmailAuth = (params) =>
  $post(
    "/opsapi/studentmanager/api/v1/student/manage/parent/send/email/auth",
    params
  );

// 修改家长认证授权
export const updateParentAuth = (params) =>
  $put(
    "/opsapi/studentmanager/api/v1/student/manage/parent/update/parent/auth",
    params
  );

/**
 * 保存学员follow
 */
export const studentFollowInsert = function (params) {
  return $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/follow/insert`,
    params
  );
};

/**
 * 学员follow列表
 */
export const reqStudentFollowList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/follow/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 家长优惠券明细
 */
export const reqParentCouponList = function (params) {
  return $get(`/opsapi/trading/center/xg/workbench/coupon`, params);
};

/**
 * 家长订单明细
 */
export const reqParentOrderList = function (params) {
  return $get(`/opsapi/trading/center/xg/workbench/order`, params);
};

/**
 * 学生数据看板
 */
export const reqStudentDataBoard = function (params) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/v2/student/data/board`,
    params
  );
};

/**
 * 获取家长微信绑定列表
 */
export const getParentWechatList = async (params) => {
  return $post(
    "/opsapi/studentmanager/api/v1/student/manage/wechat/parent/wechat/list",
    params
  );
};

/**
 * 建立绑定关系
 */
export const wechatCreateBind = async (params) => {
  return $post(
    "/opsapi/studentmanager/api/v1/student/manage/wechat/create/bind",
    params
  );
};

/**
 * 同步微信好友关系
 */
export const reqWechatSync = async (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/wechat/user/sync?userId=${params.userId}`,
  );
};

/**
 * 取消绑定
 */
export const wechatCancelBind = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    "/opsapi/studentmanager/api/v1/student/manage/wechat/cancel/bind",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 更改绑定
export const wechatUpdateBind = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    "/opsapi/studentmanager/api/v1/student/manage/wechat/parent/wechat/rebind",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return { code, data };
};

/**
 * 根据ops家长ID查询家长绑定的微信信息
 */
export const getParentBindingWechatInfo = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/wechat/get/parent/bind/friend/list",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询家长课时分布信息
 */
export const getParentAccountOverviewInfo = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/parent/account/overview/info",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询家长某一课包剩余课时明细
 */
export const getParentAccountBalanceList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/parent/account/balance/list",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询家长某一课包课时流水明细信息
 */
export const getParentAccountFlowDetailsList = async (params) => {
  const { pageNum, pageSize, parentUserId, productId, orderNo } = params;
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/product/detail/${pageNum}/${pageSize}/${parentUserId}?productId=${productId}&orderNo=${orderNo}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询家长账户数据迁移前置信息
 */
export const getParentPurchasedDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/parent/purchased/detail`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询学生某一课包课时流水明细信息
 */
export const getStudentAccountFlowDetailsList = async (params) => {
  const { pageNum, pageSize, coursePackageId, studentUserId, orderNo } = params;
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/product/student/class/hour/detail/${pageNum}/${pageSize}?coursePackageId=${coursePackageId}&studentUserId=${studentUserId}&orderNo=${orderNo}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**未使用请假列表 */
export const getNoUseLeaveClassInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/detail/list/notUsed/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已占用请假列表 */
export const getOccupyLeaveClassInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/detail/list/occupy/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已使用请假列表 */
export const getUsedLeaveClassInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/detail/list/used/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已失效请假列表 */
export const getExpiredLeaveClassInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/detail/list/expired/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/** 请假次数接口*/
export const getLeaveClassTimes = (studentUserId, subjectType) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/detail/info/${studentUserId}/${subjectType}`
  );
};

/**调课前置校验接口 */
export const checkBeforeAdjustCourse = (
  studentUserId,
  adjustVirtualclassId
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/adjust/check/${studentUserId}/${adjustVirtualclassId}`
  );
};

/**请假前置校验接口 */
export const checkBeforeLeaveClass = (studentUserId, virtualclassId) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/check/${studentUserId}/${virtualclassId}`
  );
};
export const reqDeleteParentAccount = async (parentUserId) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/studentmanager/api/v1/student/manage/coppa/parent/apply/${parentUserId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**商机列表重新分配 */
export const reAssignLAOfDeals = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/user/opportunity/allocation/again`,
    params
  );
};

/**创建商机前置校验 */
export const checkBeforeCreateDeals = (parentUserId, laUserId) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/create/business/opportunity`,
    {
      parentUserId,
      laUserId,
    }
  );
};

/**创建商机提交信息 */
export const saveDealsInfo = (studentId, subjectType, params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/user/save/opportunity?studentId=${studentId}&subjectType=${subjectType}`,
    params
  );
};

/**捞起商机前置校验 */
export const checkBeforeBackDeals = (
  parentUserId,
  laUserId,
  studentId,
  laOwner,
  subjectTypeId
) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/allocation/business/opportunity`,
    {
      parentUserId,
      laUserId,
      studentId,
      laOwner: laOwner || "",
      subjectTypeId,
    }
  );
};

/**捞起商机提交信息 */
export const saveBackDealsInfo = (studentId, subjectType, params) => {
  const submitParams = {
    ...params,
    studentId,
    subjectType,
  };
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/user/save/allocation/opportunity`,
    submitParams
  );
};

/**赠送试听课前置校验 */
export const checkBeforeGiveLesson = (studentId, parentUserId, subjectType) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/present/trial/lessons?studentId=${studentId}&parentUserId=${parentUserId}&subjectType=${subjectType}`
  );
};

/**商机follow列表 */
export const getDealsFollows = (dealId) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/list/deal/follow?dealId=${dealId}`
  );
};

/**商机添加follow */
export const addFollowByDeal = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/user/opportunity/add/follow`,
    params
  );
};

/**商机 follow 时间轴列表 */
export const getDealFollowTimeLine = (dealId, eventType) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/user/list/deal/follow/timer?dealId=${dealId}&eventType=${
      eventType || ""
    }`
  );
};

/**试听学员商机列表 */
export const getTrailDeals = (params) => {
  return $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/student/v2/student/list/v3/trial/student/list`,
    params
  );
};
/**
 * 查询家长/学生某一课包课时失效明细信息
 */
export const getParentAccountExpiresList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/accountcenter/api/v1/pub/account/finance/balance/change/expires/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取学生代课意愿状态 */
export const reqStudentSubstitute = async (studentId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/student/substitute/${studentId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 修改学生代课意愿状态 */
export const reqModifyStudentSubstitute = async (studentId, params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/studentmanager/api/v1/student/manage/student/substitute/${studentId}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询当前登陆人权限-设置代课意愿 */
export const reqCheckSubstitutePromise = async (studentId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/student/substitute/check/${studentId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取家长课前提醒开关状态 */
export const reqReminderStatusByBeforeClass = async (parentId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentcenter/api/v1/pub/studentcenter/remind/get/pre/class/reminder/status/${parentId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 手动发放请假次数 */
export const reqManuallyIssueTheNumberOfLeaveRequests = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/leave/grant/manual`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 调课次数接口 */
export const reqAdjustmentCourseTimes = async (studentUserId, subjectType) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/detail/info/${studentUserId}/${subjectType}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/* 查询默认服务语言集合 */
export const reqSpecialLanguagesList = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/common/service/language`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**未使用请假列表 */
export const getNoUseAdjustmentCourseInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/detail/list/notUsed/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已占用请假列表 */
export const getOccupyAdjustmentCourseInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/detail/list/occupy/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已使用请假列表 */
export const getUsedAdjustmentCourseInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/detail/list/used/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/**已失效请假列表 */
export const getExpiredAdjustmentCourseInfoList = (
  studentUserId,
  subjectType,
  pageNum,
  pageSize
) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/detail/list/expired/${studentUserId}/${subjectType}`,
    { pageNum, pageSize }
  );
};

/* 手动发放调课次数 */
export const reqManuallyIssueTheNumberOfAdjustmentCourseRequests = async (
  params
) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/grant/manual`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 请求腾讯云联络中心SDK URL */
export const reqLoginTCCC = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/pubmessagecenter/opsapi/channel/tencent/getCallToken`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 保存通话 sessionId*/
export const reqSaveSessionId = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/pubmessagecenter/opsapi/channel/tencent/saveSessionId`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 商机任务推送 */
export const reqPushDealTask = async (dealTaskId) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/studentmanager/api/v1/student/manage/user/parentInfo/deal/task/push/${dealTaskId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 今日用户健康度大盘 */
export const reqLearnOverViewSummary = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/liveroom/dataapi/learn/report/overview/summary`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 学情趋势 */
export const reqLearnOverViewTrend = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/liveroom/dataapi/learn/report/overview/trend`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 用户健康度列表 */
export const reqLearnOverViewList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/liveroom/dataapi/learn/report/overview/list`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 获取所有指标描述 */
export const reqLearnOverViewIndices = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/liveroom/dataapi/learn/report/overview/indices`);
  if (status !== 200) return Promise.reject();
  return data;
};

/* 用户健康详情图表 */
export const reqLearnOverViewGraph = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/liveroom/dataapi/learn/report/overview/graph`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 更新家长档案约课时区 */
export const reqUpdateParentTimezone = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/studentmanager/api/v1/student/manage/parent/timezone`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取考试类型列表 */
export const reqExamTypes = async (subjectTypeId) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/teachinghomework/homework/scoreRecords/examTypes`, { subjectTypeId });
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 成绩档案录入 */
export const reqCreateScoreRecords = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/teachinghomework/homework/scoreRecords/create`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 编辑成绩档案 */
export const reqUpdateScoreRecords = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/teachinghomework/homework/scoreRecords/update`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 分页获取学生成绩档案 */
export const reqScoreRecordslist = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/teachinghomework/homework/scoreRecords/list`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 删除成绩档案 */
export const reqDeleScoreRecord = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $delete(`/opsapi/teachinghomework/homework/scoreRecords/delete/${id}`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};


/* 朋友圈分享次数与扣减明细 */
export const reqShareChangeAllList = async(parentUserId) => {
  return $get(
    `/campaign/uploadscreenshot/share/change/list/count/${parentUserId}`,
    {},
    "mkt"
  );
}


export const reqShareChangeCurrentDisciplinesList = async (parentUserId,pageNum,pageSize, subject = -1) => {
  return $get(
    `/campaign/uploadscreenshot/share/change/list/subject/${parentUserId}/${pageNum}/${pageSize}/${subject}`,
    {},
    "mkt"
  );
}

/* 跨账号迁移课时 */
export const reqClassHourMigration = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/accountcenter/api/v1/pub/account/class/hour/transfer/classHour/migration`,params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 获取学生的课中作业信息（课堂练习）
export function getStudentLiveRoomHomework({virtualClassId, studentUserId, classTypeId, lessonId}) {
  return $post(`/opsapi/teachinghomework/homework/student/liveroom/homework/list?studentUserId=${studentUserId}&virtualClassId=${virtualClassId}&classTypeId=${classTypeId}&lessonId=${lessonId}`)
}
// 获取家长微信现有联系人和群组
export function getParentWeChatRelationships({ parentId, opsUserId }) {
  return $get(`/opsapi/studentcenter/api/v1/pub/studentcenter/user/wechat/info/parent/bind/friendgroup/list?parentId=${parentId}&opsUserId=${opsUserId}`);
}

/* 查询家长绑定微信数 */
export const reqParentWechatNum = async (parentUserId) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/studentcenter/api/v1/pub/studentcenter/enterprise/wechat/info/getParentExternalUserId/${parentUserId}`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};