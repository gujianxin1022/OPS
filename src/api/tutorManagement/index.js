import GetData from "@/utils/axios.js";
const { $get, $put, $post } = new GetData();

function commonThen(res) {
  const { code, data } = res.data;
  if (code === 200 || code === 0) {
    return data;
  }
  throw new Error(res.data.message);
}
/**
 * 老师搜索
 * @param {Object} params 参数对象，包括：
 *        programme              {String} 版本
 *        course_level           {String} 级别
 *        class_type             {String} 班型
 *        date_day               {String} 日期
 *        times                  {String} 时间
 */
export const searchTeacher = function (params) {
  return $get("/filter_teacher/", params);
};

/**
 * 获取老师信息列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *    courseEditionId   页号
 *    courseLevel   课程级别
 *    fullWork    是否全职
 *    hide  是否对学生隐藏  0：不隐藏，1：隐藏 默认值0
 *    localArea 老师所属地区  1.新加坡、2：其他地区
 *    orderBy   排序方式， currentStudentNum:asc 正序  totalStudentNum:desc 倒叙
 *    status    用户状态  0：未激活，1：已激活，2：被封禁，3：被删除，4：被隐藏
 *    teacherUsername   老师用户名
 *    tmUserId  教师管理用户标识
 *    working   是否上岗  0：未上岗，1：已上岗， 默认值0
 */
// export const getTutorList = function (pageNum, pageSize, params) {
//   return $get(`/opsapi/tutor/all/brief/${pageNum}/${pageSize}`, params);
// };

export const getTutorList = function (pageNum, pageSize, params) {
  params.pageNum = pageNum;
  params.pageSize = pageSize;
  return $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/list`,
    params
  );
};

/**
 * 获取薪酬标签数据
 * @param {String} subjectType 1 中文 2 英文 3 数学
 */
export const getSalaryLabelsList = function (subjectType) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/front/user/tutor/salary/labels?subjectType=${subjectType}`
  );
};
/**
 * 批量发送服务协议
 * @param {Array} tutorUserIdList 老师标识集合
 */
export const tutorSendProtocol = function (tutorUserIdList) {
  return $post(
    `/opsapi/teachermanager/teacher-manage/tutor/contract/batch/send/protocol/`,
    tutorUserIdList
  );
};
/**
 * 老师的课表
 * @param {Int} tutorUserId 老师用户标识
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 */
export const teacherTimetable = function (tutorUserId, startTime, endTime) {
  return $get(`/opsapi/tutor/timetable/${tutorUserId}/${startTime}/${endTime}`);
};

/**
 * 更新老师信息
 * @param {Int} tutorUserId 老师用户标识
 * @param {Object} teacherInfo 老师信息
 */
export const updateTeacherInfo = function (tutorUserId, teacherInfo) {
  return $put(`/opsapi/tutor/update/${tutorUserId}`, teacherInfo);
};

/**
 * 上传老师头像
 * @param {Object} params 参数对象
 *    category  头像：avatar
 *    file    formData
 */
export const uploadTeacherAvatar = function (params) {
  return $post(`/opsapi/upload/uploadFile`, params);
};

/**
 * 老师发布可上课时间
 * @param {Object} schedulePublishTimeParam 参数对象
 *    endRecurringTime  结束排课UTC时间
 *    endTimes  结束UTC时间
 *    opType  操作类型，1：发布时间；2：取消发布
 *    opsRole  预约用户角色，2：学生；3：老师；5：运营人员
 *    startTimes  开始UTC时间
 *    userId  老师的用户标识
 */
export const teacherPublish = function (schedulePublishTimeParam) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/tutor/slots/publish`,
    schedulePublishTimeParam
  );
};

/**
 * 获取老师的教学记录
 * @param {Int} tutorUserId 老师用户标识
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const teachRecordData = function ({
  tutorUserId,
  startTime,
  endTime,
  pageNum,
  pageSize,
}) {
  return $get(
    `/opsapi/tutor/classrecord${tutorUserId ? `/${tutorUserId}` : ""}${
      startTime ? `/${startTime}` : ""
    }${endTime ? `/${endTime}` : ""}/${pageNum}/${pageSize}`
  );
};
/**
 * 分配教师管理人员
 * @param {Int} tmUserId 教师管理人员的用户标识
 * @param {Array} tutorUserIdList 老师标识集合
 */
export const tutorAssiginManage = function (tmUserId, tutorUserIdList) {
  return $put(`/opsapi/tutor/assign/manage/${tmUserId}`, tutorUserIdList);
};

/**
 * 配置老师可教的班型
 * @param {Int} tutorUserId 老师的用户标识
 * @param {Array} classTypeIdList 可教班型Id集合
 */
export const teacherCanTeachClassType = function (
  tutorUserId,
  classTypeIdList
) {
  return $put(`/opsapi/tutor/class/type/${tutorUserId}`, classTypeIdList);
};

/**
 * 配置老师可教的版本级别和课酬
 * @param {Int} tutorUserId 老师的用户标识
 * @param {Array} tutorCourseFeeParamList 参数集合
 *     @param {Object}  参数对象
 *        @param {courseEditionId} 版本标识
 *        @param {Array} courseLevelList  可教级别集合
 *        @param {Int} tutorLevel 老师级别
 */
export const teacherCanTeachEditionAndLevel = function (
  tutorUserId,
  tutorCourseFeeParamList
) {
  return $put(
    `/opsapi/tutor/course/fee/${tutorUserId}`,
    tutorCourseFeeParamList
  );
};
/**
 * 获取各个版本上每个级别的老师课酬信息
 */
export const getEditionLevelFee = function () {
  return $get(`/opsapi/tutor/course/edition/level/fee`);
};

/**
 * 驳回合同签名
 * @param {Int} tutorUserId 老师表示
 */
export const getOutTutorsSign = function (tutorUserId) {
  return $put(`/opsapi/tutor/sign/reject/${tutorUserId}`);
};

// -------------------------老师流程相关接口---------------------------------

/**
 * 审核接口--统一接口
 * @param {Int} examineId 审核记录id
 * @param {Object} params 参数对象
 * courseAdviceIdList	[...]
    courseEditionId	integer($int32)
    试讲版本id

    deviceRemark	string
    设备检测备注

    examineStatus*	integer($int32)
    审核状态：2 驳回 3 审核通过 4 淘汰 5 放弃

    finalRemark	string
    终面-审核备注

    finalTime	string($date-time)
    终面时间

    finalUserId	integer($int64)
    终面老师id（user_info主键）

    isAdviseSmall	integer($int32)
    是否建议小班试讲（1：是，0：否）

    isDevice	integer($int32)
    是否设备检测通过（1：是，0：否）

    isFinal	integer($int32)
    是否已完成终面（1：是，0：否）

    isMill	integer($int32)
    是否已完成磨课（1：是，0：否）

    isSkill	integer($int32)
    是否已完成技培（1：是，0：否）

    isTeach	integer($int32)
    是否已完成教培（1：是，0：否）

    isTry	integer($int32)
    是否已完成试讲（1：是，0：否）

    languageLabelList	[...]
    mainTrainUserId	integer($int64)
    主培训师id（user_info主键）

    millExaUserId	integer($int64)
    磨课考官id（user_info主键）

    millRemark	string
    磨课-审核备注

    millTime	string($date-time)
    磨课时间

    nextStage	integer($int32)
    驳回下一阶段,只有回退的时候才有值：1 新注册阶段 2 试讲阶段 3 教学培训阶段 4 技术培训阶段 5 终面阶段 6 磨课阶段 7 待上岗阶段 8 淘汰阶段 9 放弃阶段

    outReasonId	integer($int32)
    淘汰/放弃原因(sys_dict_info主键)

    outRemark	string
    淘汰/放弃审核备注

    regRemark	string
    新注册-审核备注

    skillRemark	string
    技培-审核备注

    skillTime	string($date-time)
    技术培训时间

    skillUserId	integer($int64)
    技术培训师id

    teachRemark	string
    教培-审核备注

    teachTime	string($date-time)
    教师培训时间

    tryRemark	string
    试讲-审核备注

    tryTime	string($date-time)
    试讲时间

    tryUserId	integer($int64)
    试讲考官id

    tutorStyleLabelList	[...]
    waitRemark	string
    待上岗-审核备注
 */
export const examineApi = function (examineId, params) {
  return $put(`/opsapi/examine/${examineId}`, params);
};

/**
 * 获取 部分select 的 options 数据
 * @param {Int} type 4 教学风格 5 语言标签 6淘汰原因 7放弃原因 75 时区
 */
export const getExamineDic = async (type) => {
  return $get(`/opsapi/examine/dic/${type}`);
};

/* 接口获取教师风格&试听转化率标签选项 */
export function reqLableOptionsConfig(params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/label/query/option/list`,
    params
  ).then(commonThen);
}
/**
 * 回新注册
 * @param {Int} examineId 记录id
 */
export const rollBackRegistry = function (examineId) {
  $put(`/opsapi/examine/rollback/register/${examineId}`);
};

/**
 * 获取所有阶段老师的总数
 */
export const getStageTeacherNum = function () {
  return $get(`/opsapi/examine/stage/count`);
};

/**
 * 根据 stage 获取各阶段的tableData
 * @param {Int} stage 当前阶段：1 新注册阶段 2 试讲阶段 3 教学培训阶段 4 技术培训阶段 5 终面阶段 6 磨课阶段 7 待上岗阶段 8 淘汰阶段 9 放弃阶段
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *        @param {Int} adviceEditionId 建议版本
 *        @param {Int} dateType 日期类型（-1：昨天，0：今天，1：明天)
 *        @param {Int} editionId 试讲版本ID/培训版本ID/终面版本ID/终面版本ID
 *        @param {String} endTime 查询结束时间，格式2019-08-25T02:30:00.000Z
 *        @param {String} startTime 查询开始时间，格式2019-08-25T02:30:00.000Z
 *        @param {Int} finalUserId 终面试考官ID
 *        @param {Int} mainTrainUserId 主培训师id
 *        @param {Int} outStage 淘汰/放弃前阶段
 *        @param {Int} recruitUserId 招聘专员ID
 *        @param {Int} skillUserId 技术训师id
 *        @param {String} tutorName 老师姓名
 */
export const getTeacherProcessList = function (
  stage,
  pageNum,
  pageSize,
  params
) {
  return $get(`/opsapi/examine/list/${stage}/${pageNum}/${pageSize}`, params);
};

/**
 * 获取老师所在阶段
 * @param {Int} tutorId 老师id
 */
export const getTeacherView = function (tutorId) {
  return $get(`/opsapi/examine/user/stage/${tutorId}`);
};

/**
 * 回归注册阶段
 * @param {Int} examineId 审核记录id
 * @param {Object} params 参数对象
 */
export const rollbackOutTeacher = function (examineId, params) {
  return $put(`/opsapi/examine/rollback/register/${examineId}`, params);
};
/**
 * 获取操作日志
 * @param {Int} tutorId 教师id
 */
export const getTeacherTimeLineLog = function (tutorId) {
  return $get(`/opsapi/examine/log/list/${tutorId}`);
};
/**
 * 分配接口--统一接口
 * @param {Int} examineId 审核记录id
 * @param {Object} params 参数对象
 * deviceRemark	string
  设备检测备注

  isDevice	integer($int32)
  是否设备检测通过（1：是，0：否）

  mainTrainUserId	integer($int64)
  主培训师id

  millTrainUserId	integer($int64)
  磨课训师id

  recruitUserId	integer($int64)
  招聘专员id
 */
export const distributionApi = function (examineId, params) {
  return $put(`/opsapi/examine/update/${examineId}`, params);
};

/**
 * 设备检测
 * @param {Int} examineId 审核记录Id
 * @param {*} params
 */
export const deviceTestApi = function (examineId, params) {
  return $put(`/opsapi/examine/device/${examineId}`, params);
};
/**
 * 安排中面
 * @param {Int} examineId 审核记录Id
 * @param {Object} params
 */
export const finalApi = function (examineId, params) {
  return $put(`/opsapi/examine/update/final/${examineId}`, params);
};

/**
 * 根据角色获取用户列表 -- 统一接口
 * @param {String} roleCode 角色 Code    老师： tutor
 */
export const getRoleList = function (roleCode) {
  return $get(`/opsapi/examine/user/list/${roleCode}`);
};

// 一对一
export const oneClassRecord = function ({
  tutorUserId,
  startTime,
  endTime,
  pageNum,
  pageSize,
}) {
  return $get(
    `/opsapi/oneClass/classrecord/${tutorUserId}/${startTime}/${endTime}/${pageNum}/${pageSize}`
  );
};

// 小班课
export const smallClassRecord = function ({
  tutorUserId,
  startTime,
  endTime,
  pageNum,
  pageSize,
}) {
  return $get(
    `/opsapi/smallClass/classrecord/${tutorUserId}/${startTime}/${endTime}/${pageNum}/${pageSize}`
  );
};

// 大班课
export const bigClassRecord = function ({
  tutorUserId,
  startTime,
  endTime,
  pageNum,
  pageSize,
}) {
  return $get(
    `/opsapi/bigClass/classrecord/${tutorUserId}/${startTime}/${endTime}/${pageNum}/${pageSize}`
  );
};

/**
 * 配置教师的语言标签和教学风格 /opsapi/tutor/language/teach/{tutorUserId}
 * @param {Int} tutorUserId 教师ID
 * @param {Array} params
 *        @param {Int} id 教师标签表ID
 *        @param {Int} configId 这个标签的ID
 *        @param {Int} configType 这个标签的类型
 *        @param {Int} configValue 标签内容
 */
export const setLabel = function (params) {
  return $put(
    `/opsapi/tutor/language/teach/${params.tutorUserId}`,
    params.params
  );
};

/**
 * 获取教师信息
 */
export const getTeacherInfo = function (tutorUserId) {
  return $get(`/opsapi/data/tutor/info/${tutorUserId}`);
};

/**
 * 查询老师详情（OPS教师详情）
 */
export const getTeacherDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/detail`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取老师雷达图信息
 */
export const getRadarInfo = function (tutorUserId) {
  return $get(`/opsapi/data/tutor/evaluate/${tutorUserId}`);
};

/**
 * 获取老师教学权限
 * @param {Int} tutorUserId 老师标识
 */
export const getTutorCoursePower = function (tutorUserId, params) {
  return $get(`/opsapi/tutor/course/power/detail/${tutorUserId}`, params);
};

/**
 * 新增教学权限
 * @param {Int} tutorUserId 老师标识
 * @param {Object} params 参数对象
 *         @param {Array} addCourseIdList 新增的集合
 *         @param {Array} delCourseIdList 删除的集合
 *         @param {Array} finalCourseList 最后的集合
 *         @param {Int} createUserId 提交人Id
 *         @param {String} reason 修改原因
 */
export const updateTutorCoursePower = function (tutorUserId, params) {
  return $post(`/opsapi/tutor/course/power/add/${tutorUserId}`, params);
};

/**
 * 获取老师课酬规则
 * @param {Int} tutorUserId 老师标识
 */
export const getTutorClassPaysRules = function (params) {
  return $get(`/opsapi/tutor/course/salary/detail`, params);
};
/**
 * 获取老师信息
 * @param {Object} params 参数对象 id -> 老师id
 */
export const getTutorInfo = function (params) {
  return $get(`/opsapi/tutor/info`, params);
};
/**
 * 课酬修改
 * @param {Object} params 参数对象
 *          createUserId 创建人ID
 *          finalLevels  最后的levels集合
 *          fullWork
 *           localArea
 *           reason
 *           tutorUserId
 *           updateLogs
 */
export const changeTutorCourseSalary = function (params) {
  return $post(`/opsapi/tutor/course/salary/edit`, params);
};

/**
 * 添加课酬规则
 * @param {Object} params 参数列表
 */
export const addSalaryRuleConfig = function (params) {
  return $post(`/opsapi/tutor/salary/rule/config`, params);
};
/**
 * 获取课酬等级列表
 */
export const getClassPayLevelList = function () {
  return $get(`/opsapi/user/level/list`);
};

/**
 * 获取标准规则详情
 * @param {Object} params 参数对象
 */
export const getSalaryRulesDetail = function (params) {
  return $get(`/opsapi/tutor/salary/rule/info`, params);
};

/**
 * 修改标准规则详情
 * @param {Object} params 参数对象
 */
export const editSalaryRulesDetail = function (params) {
  return $post(`/opsapi/tutor/salary/rule/edit`, params);
};

/**
 * 获取老师权限课酬操作记录
 * @param {Object} params 参数对象
 */
export const getTutorSysLogsList = function (params) {
  return $get(`/opsapi/sys/log/list`, params);
};

/**
 * 老师课酬统计
 * @param {Object} params 参数对象
 *         @param {Date} 开始时间
 *         @param {Date} 结束时间
 *         @param {Int} 老师标识
 */
export const getTutorSalaryTotal = function (params) {
  return $get(`/opsapi/tutor/salary/total`, params);
};

/**
 * 获取老师数量
 * @param {Int} tutorType 全职：0不是 1是
 * @param {Object} params 参数对象
 */
export const getTutorSumTotal = function (tutorType, params) {
  return $get(`/opsapi/tutor/total/${tutorType}`, params);
};

/**
 * 获取课堂数量
 * @param {Object} params 参数对象
 *         @param {Date} 开始时间
 *         @param {Date} 结束时间
 *         @param {Int} 老师标识
 *         @param {Int} 是否全职：0不是 1是
 */
export const getTutorVirtualTotal = function (params) {
  return $get(`/opsapi/tutor/virtual/total`, params);
};
/**
 * 获取老师薪酬列表
 * @param {Int} tutorType 是否全职：0不是 1是
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *         @param {Date} startTime 开始时间
 *         @param {Date} endTime 结束时间
 *         @param {String} tutorName 老师名字
 */
export const getTutorVirtualList = function (
  tutorType,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/tutor/virtual/${tutorType}/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 薪酬列表新
 */
export const getTutorVirtualListV2 = function (
  tutorType,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/tutor/virtual/${tutorType}/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取英文和数学老师薪酬列表

 * @param {Object} params 参数对象
 *         @param {Int} businessLine 老师业务线，2：英文，3：数学
 *         @param {String} month 月份，格式：yyyymm
 *         @param {String} tutorName 老师名字
 *         @param {Int} tutorType 是否全职：0不是 1是
 *         @param {Int} pageNum 页号
 *         @param {Int} pageSize 页尺寸
 */
export const getEnTutorVirtualList = function (params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/tutor/salary/ops/list`,
    params
  );
};

/**
 * 获取英文和数学老师课时费用

 * @param {Object} params 参数对象
 *         @param {String} month 月份，格式：yyyymm
 *         @param {Int} tutorUserId 老师ID
 */
export const getEnTutorDetail = function (params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/tutor/salary/ops/base/fee/list`,
    params
  );
};

/**
 * 获取英文和数学老师扣款

 * @param {Object} params 参数对象
 *         @param {String} month 月份，格式：yyyymm
 *         @param {Int} tutorUserId 老师ID
 */
export const getEnTutorDeductionDetail = function (params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/tutor/salary/ops/detail/deduction/list`,
    params
  );
};

/**
 * 获取英文和数学老师扣款

 * @param {Object} params 参数对象
 *         @param {String} month 月份，格式：yyyymm
 *         @param {Int} tutorUserId 老师ID
 */
export const getEnTutorCompensateDetail = function (params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/tutor/salary/ops/detail/compensate/list`,
    params
  );
};

/**
 * 获取英文和数学老师激励

 * @param {Object} params 参数对象
 *         @param {String} month 月份，格式：yyyymm
 *         @param {Int} tutorUserId 老师ID
 */
export const getEnTutorExcitationDetail = function (params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/tutor/salary/ops/detail/excitation/list`,
    params
  );
};

/**
 * 获取英文和数学老师激励

 * @param {Object} params 参数对象
 *         @param {Int} pageNum 
 *         @param {Int} pageSize 
 */
export const getSalaryImportInfo = async function (params) {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/teachersalary/tutor/manual/fee/list`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data || {};
};

/**
 * 获取老师有多少学生
 * @param {Int} tutorId 老师id
 */
export const getTutorStudentTotal = function (tutorId, parmas) {
  return $get(`/opsapi/tutor/student/total/${tutorId}`, parmas);
};

/**
 * z
 * @param {Int} tutorType 是否全职：0不是 1是
 * @param {Int} tutorId 老师id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *         @param {Date} startTime 开始时间
 *         @param {Date} endTime 结束时间
 */
export const getTutorVirtutalClassSalaryList = function (
  tutorId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/tutor/virtualClass/salary/list/${tutorId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 课酬明细-新
 */
export const getTutorVirtutalClassSalaryListV2 = function (
  tutorId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/teacher/virtualClass/salary/list/v1/${tutorId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 重置老师密码为lingoace123
 * @param {Int} tutorUserId 老师id
 */
export const resetTutorPassword = function (tutorUserId) {
  return $put(`/opsapi/tutor/password/reset/${tutorUserId}`);
};

/**
 * IPA教师列表
 */
export const getIPATeacherList = function (pageNum, PageSize, params) {
  return $get(`/opsapi/tutor/ipa/sign/list/${pageNum}/${PageSize}`, params);
};

/**
 * IPA状态
 */
export const getIPAStatus = function () {
  return $get(`/opsapi/tutor/ipa/sign/ipaStatus`);
};

/**
 * IPA批量报名
 */
export const reqInsertIpaSign = function (year, bath, params) {
  return $post(`/opsapi/tutor/ipa/sign/insertIpaSign/${year}/${bath}`, params);
};

/**
 * IPA批量认证
 */
export const updateIpaSignStatus = function (ipaStatus, params) {
  return $post(
    `/opsapi/tutor/ipa/sign/updateIpaSignStatus/${ipaStatus}`,
    params
  );
};

/**
 * 获取上传S3预签名
 */
export const getS3SignUrl = (fileName) =>
  $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/teacher/info/sign/url?fileName=${fileName}`,
    {}
  );

/**
 * S3资源同步
 */
export const syncS3Resources = (param) =>
  $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/teacher/info/resource/upload`,
    param
  );
/**
 * 教师详情: 上课方式、学科、课程类型、商户和appId下拉列表
 */
export const getCourseBasicInfoList = () =>
  $get(`/opsapi/teachermanager/teacher-manage/teacher/course/basic/info`);

/**
 * 教师管理: 全量版本下拉列表
 */
export const getCourseEditionList = () =>
  $post("/opsapi/teachermanager/teacher-manage/examine/course/info");

/**
 * 课酬规则列表
 */
export const getSalaryRuleList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get("/opsapi/teachersalary/salary/new/rule/getRuleList", params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 保存课酬规则基本信息
 */
export const saveSalaryRuleBasicInfo = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post("/opsapi/teachersalary/salary/new/rule/saveRuleBasicInfo", params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取课酬规则信息
 */
export const getSalaryRuleBasicInfo = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachersalary/salary/new/rule/getRuleDetailInfo`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取课程列表
 */
export const getCourseList = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachersalary/salary/new/rule/getRuleBindPackageList`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取薪酬规则名称列表
 */
export const getRuleNameList = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachersalary/salary/new/rule/getRuleNameList`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取薪酬规则绑定的课包列表
 */
export const getBindPackageByRule = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachersalary/salary/new/rule/getBindPackageByRule`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 绑定课包树
 */
export const bindPackageTree = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachersalary/salary/new/rule/bindPackageTree`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取课包树
 */
export const getAllPackageList = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachersalary/salary/new/rule/getAllPackageList`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取课包树
 */
export const getTreeList = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachersalary/salary/new/rule/getTreeList/ids`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询质检
 */
export const getQualityCheck = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachermanager/teacher-manage/salary/qualityCheck/getQualityCheck`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 课堂质检
 */
export const qualityCheck = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/qualityCheck/insterQualityCheck`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改质检
 */
export const updateQualityCheck = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/qualityCheck/updateQualityCheck`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取老师质检记录
 */
export const getTutorQualityCheckRecord = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/qualityCheckLog/getPage`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询投诉
 */
export const getComplain = async (params) => {
  const { status, data: { code, data } } = await $get(`/opsapi/teachermanager/teacher-manage/salary/complain/getComplain`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 课堂投诉
 */
export const insterComplain = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/complain/insterComplain`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改投诉
 */
export const updateComplain = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/complain/updateComplain`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取老师投诉记录
 */
export const getTutorComplainRecord = async (params) => {
  const { status, data: { code, data } } = await $post(`/opsapi/teachermanager/teacher-manage/salary/complainLog/getPage`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 薪酬规则列表
 */
export const getPackageRuleList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get("/opsapi/teachersalary/salary/rule/list", params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 课包下的课程树对应的薪酬规则明细
 */
export const getSalaryRuleDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get("/opsapi/teachersalary/salary/rule/detail/list", params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data.map((ruleItem) => {
    const {
      rewardDetails,
      normalRule,
      trialRule,
      subsidyReward,
      absentSalary: _absentSalary,
    } = ruleItem;
    const absentSalary = JSON.parse(_absentSalary);
    rewardDetails.unshift(absentSalary);
    return {
      ...ruleItem,
      normalRule: JSON.parse(normalRule),
      trialRule: JSON.parse(trialRule),
      subsidyReward: subsidyReward && JSON.parse(subsidyReward),
      reduceSalaryUnit: absentSalary.reduceSalaryUnit,
      rewardDetails: rewardDetails.map((rewardItem, rewardIdx) => {
        if (rewardIdx === 0) return rewardItem;
        return {
          ...rewardItem,
          earlyDuration: JSON.parse(rewardItem.earlyDuration),
          classDuration: JSON.parse(rewardItem.classDuration),
          belatedDuration: JSON.parse(rewardItem.belatedDuration),
        };
      }),
    };
  });
};

/**
 * 修改课酬规则
 */
export const upateSalaryRule = async (params) => {
  const {
    status,
    data: { code },
  } = await $put("/opsapi/teachersalary/salary/rule/update", params);
  if (status !== 200 || code !== 200) return Promise.reject();
};

/**
 * 添加课酬规则
 */
export const insertSalaryRule = async (params) => {
  const {
    status,
    data: { code },
  } = await $post("/opsapi/teachersalary/salary/rule/insert", params);
  if (status !== 200 || code !== 200) return Promise.reject();
};

export const renewalStatus = (params) => {
  return $put(
    `/opsapi/teachermanager/teacher-manage/front/user/tutor/update/renewal/status`,
    params
  );
};

/**
 * 添加更新其他奖惩规则
 */
export const updateOtherRewardPunish = async (params) => {
  const {
    status,
    data: { code },
  } = await $post(
    "/opsapi/teachersalary/salary/rule/reward/punish/other/save",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
};

/**
 * 查询推其他奖惩规则
 */
export const queryOtherRewardPunish = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachersalary/salary/rule/reward/punish/other/detail`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 批量更新老师开放状态
 */
export const updateTeacherOpenState = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    "/opsapi/teachermanager/teacher-manage/teacher/update/batch/hide/status",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询推荐数据导入列表
 */
export const getRecommendDataImportList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/teacher/recommend/tutor/upload/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 创建老师账号
 */
export const createTeacherAccount = (params) =>
  $post(
    "/opsapi/teachermanager/teacher-manage/front/user/tutor/ops/register",
    params
  );

/**
 * 教室详情页 获取 部分select 的 options 数据
 * @param {Int} type 5-小语种，75-时区, 81-中文教师最高学历枚举, 82-普通话等级证书枚举, 83-英语口语水平枚举, 84-英文教师最高学历, 85-英文教师资质种类枚举
 */
export const getTeacherInfoOption = async (type) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/front/common/sys/dict/info/list`,
    { type }
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 居住地,国籍,Bank Location
export const getCountryList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/front/common/information/country/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 获取下级区域列表接口
export const getAreaList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/front/common/information/area/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 获取教师扩充信息
export const getTeachertutorInfo = (userTutorId) =>
  $get(
    `/opsapi/teachermanager/teacher-manage/front/user/tutor/tutor/info/by/id/${userTutorId}`
  );

// 更新教师扩充信息
export const updateTeachertutorInfo = (params) =>
  $put(
    `/opsapi/teachermanager/teacher-manage/front/user/tutor/ops/update/ext/by/id`,
    params
  );

// 批量修改教师权限，上课方式
export const updateTeacherPowerAndClassType = (params) =>
  $post(
    `/opsapi/teachermanager/teacher-manage/teacher/course/power/add/batch`,
    params
  );

// 增加/修改中文异常课堂规则
export const updateChineseAbnormalClassroomRules = async (userId, params) => {
  const {
    status,
    data: { code },
  } = await $post(
    `/opsapi/teachersalary/salary-rule-exception-class/create/or/update/rule/${userId}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
};

// 查询中文异常课堂规则明细
export const queryChineseAbnormalClassroomRules = async (userId, params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachersalary/salary-rule-exception-class/list/exception/class/salary/rule`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  const initData = (classType) => {
    return Array.from({ length: 8 }, (v, i) => ({
      classType /* 1: 1v1; 2: 小班课*/,
      courseType: i <= 3 ? 1 /* 正式课 */ : 0 /* 试听 */,
      lessonsTime: [0, 1, 4, 5].includes(i) ? 25 * 60 : 55 * 60,
      teacherFullWork: i % 2 ? 1 /* 全职 */ : 0 /* 兼职 */,
      rewardRule: { SNTN: 0, SNTY: 0, SYTN: 0 },
    }));
  };
  return {
    oneVoneClass: data.length
      ? data.flatMap((item) =>
          item.classType === 1
            ? [{ ...item, rewardRule: JSON.parse(item.rewardRule) }]
            : []
        )
      : initData(1),
    smallClass: data.length
      ? data.flatMap((item) =>
          item.classType === 2
            ? [{ ...item, rewardRule: JSON.parse(item.rewardRule) }]
            : []
        )
      : initData(2),
    salaryUnit: data.length ? data[0].salaryUnit : null,
  };
};
// 查询老师请假列表
export const getTutorLeaveList = async (pageNum, pageSize, params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/tutor/leave/examine/list/${pageNum}/${pageSize}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 查询老师请假详情
export const getTutorLeaveDetail = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/tutor/leave/examine/detail/${id}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 老师请假审核
export const reqTutorLeaveExamine = async (id, params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/classmanage/api/v1/class/manage/tutor/leave/examine/operate/${id}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 审核驳回教师合同
export const reqTutorContactExamineOperate = async (contractId) => {
  const {
    status,
    data: { data, code },
  } = await $put(
    `/opsapi/teachermanager/teacher-manage/tutor/contract/examine/operate/${contractId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 根据条件查询合同列表-分页
export const reqTutorContactList = async (pageNum, PageSize, params) => {
  const {
    status,
    data: { data, code },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/tutor/contract/examine/list/${pageNum}/${PageSize}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询投诉数据导入列表
 */
export const getComplaintDataImportList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/user/tutor/complaint/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询老师国籍列表
 */
export const reqCountryList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/country/dict/ops/country/group`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  data.commonCountries[5].areaId = "东欧";
  return data;
};

/**
 * 添加收藏OPS
 */
export const reqAddOPSFavoriteTeacher = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/favorite/tutor/manage/ops/add`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 取消收藏OPS
 */
export const reqCancelOPSFavoriteTeacher = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/favorite/tutor/manage/ops/cancel`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 把老师加入我的黑名单
 */
export const reqAddOPSBlackListTeacher = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/blacklist/tutor/manage/ops/add`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 把老师移出我的黑名单
 */
export const reqCancelOPSBlackListTeacher = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/blacklist/tutor/manage/ops/cancel`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 同意/不同意招聘申请
 * @param {Object} params 参数列表
 */
export const handleAgree = function (params) {
  return $post(`/opsapi/teachermanager/teacher-manage/tutor/esl/audit`, params);
};

/**
 * 单一设置slots类型
 */
export const reqSetSlotConfig = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/slot/config/ops/save/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * Slots类型设置列表查询
 */
export const reqQuerySlotConfigList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/slot/config/ops/query/config`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * Slots类型设置日志，单一设置列表查询
 */
export const reqQuerySlotConfigSingleLogList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/slot/config/ops/query/log/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * Slots类型设置日志，批量设置列表查询
 */
export const reqQuerySlotConfigBatchLogList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/slot/config/ops/query/log/batch`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据老师ID查询家长列表（老师页面调用）
 */
export const reqBookParentWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/parent/schedule/whitelist/ops/list/parent`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 添加slots白名单
 */
export const reqAddBookParentWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/parent/schedule/whitelist/ops/save`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 移除slots白名单
 */
export const reqDelBookParentWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/parent/schedule/whitelist/ops/remove`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据家长ID查询老师白名单列表（家长页面调用）
 */
export const reqBookTeacherWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/parent/schedule/whitelist/ops/list/tutor`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 教师类型设置-列表查询
 */
export const reqQueryTeacherTypeList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/tutor/type/config/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 教师类型设置-新增类型
 */
export function reqTeacherTypeCreate(params) {
  return $post(
    `/opsapi/teachermanager/teacher-manage/tutor/type/config/save/type`,
    params
  ).then(commonThen);
}

/**
 * 教师类型设置-新增类型
 */
export function reqTeacherTypePackageConfig(params) {
  return $post(
    `/opsapi/teachermanager/teacher-manage/tutor/type/config/save/package`,
    params
  ).then(commonThen);
}
