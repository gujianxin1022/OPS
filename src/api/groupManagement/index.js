import GetData from "@/utils/axios.js";

const { $get, $put, $post, $delete } = new GetData();

/**
 * 获取班级列表
 * @param {Object} params
 *   page {Number} 第几页
 *  page_size {Number}  每页条数
 */
export const getGroupList = function (params) {
  return $get("/classinfo", params); ///smallclass/classroom/
};

/**
 * 调整班级进度
 * @param {Int} class_id 班级Id
 * @param {Object} params
 *    course_edition 版本Id
 *    course_level   年级
 *    lesson_no      第几节课
 */
export const changeSmallGroupProgress = function (params) {
  return $put(
    `/opsapi/smallClass/adjust/edition/level/${params.classId}/${params.newLevelId}/${params.newLessonId}/${params.oldPackageTreeId}/${params.newPackageTreeId}`
  );
};

/**
 * 班级信息
 * @param {*} params
 */
export const getClassInfo = function (classId) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/transfer/class/info/${classId}`
  );
};

/**转入班级列表 */
export const getTransferInClasses = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/transfer/enter/class/list`,
    params
  );
};

/**
 * 转出班级前置校验 leaveClass
 * @param {*} params
 */
export const translateClassBeforeCheck = function (
  studentUserId,
  leaveClassId
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/transfer/leave/check/${studentUserId}/${leaveClassId}`
  );
};

/**
 * 转入班级前置校验 enterClass
 * @param {*} params
 */
export const translateClassAfterCheck = function (
  studentUserId,
  leaveClassId,
  enterClassId,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/transfer/enter/check/${studentUserId}/${leaveClassId}/${enterClassId}`,
    params
  );
};

/**
 * 转班
 * @param {*} params
 */
export const translateClass = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/transfer/do/transfer`,
    params
  );
};

/**
 * 调整大班班级进度
 * @param {Int} class_id 班级Id
 * @param {Object} params
 *    course_edition 版本Id
 *    course_level   年级
 *    lesson_no      第几节课
 */
export const changeBigGroupProgress = function (params) {
  return $put(
    `/opsapi/bigClass/adjust/edition/level/${params.classId}/${params.newEditionId}/${params.newLevel}/${params.newLessonNo}`
  );
};

/**
 * 修改班级名称
 * @param {Int} class_id 班级Id
 * @param {*} params
 *      class_name  班级名称
 */
export const changeGroupName = function (params) {
  return $put(`/opsapi/class/class/update/${params.classId}`, params);
};

// --------- 小班课2.0 新增 api
/**
 * 获取小班课详情
 * @param {Int} class_id 班级标识 id
 */
export const getGroupDetails = function (class_id) {
  return $get(`/classinfo/${class_id}/details/`);
};

/**
 * 小班课详情 信息排课表
 * @param {Int} class_id 班级标识 id
 */
export const getGroupDetailsTimetable = function (pageNum, pageSize, classId) {
  return $get(
    `/opsapi/smallClass/classroom/courseList?pageNum=${pageNum}&pageSize=${pageSize}&classId=${classId}`
  );
};

/**
 * 大班课详情 信息排课表
 * @param {Int} class_id 班级标识 id
 */
export const getBigGroupDetailsTimetable = function (
  pageNum,
  pageSize,
  classId
) {
  return $get(
    `/opsapi/bigClass/classroom/courseList/${pageNum}/${pageSize}?classId=${classId}`
  );
};

/**
 * 获取小班课成员列表
 * @param {Int} class_id 班级标识 id
 */
export const getGroupStudents = function (classId, userName) {
  return $get(
    `/opsapi/smallClass/classroom/members?classId=${classId}${
      userName ? "&userName=" + userName : ""
    }`
  );
};

/**
 * 获取小班课成员列表
 * @param {Int} class_id 班级标识 id
 */
export const getBigGroupStudents = function (
  classId,
  page,
  pageSize,
  userName,
  userSource
) {
  return $get(
    `/opsapi/bigClass/classroom/members?classId=${classId}&page=${page}&pageSize=${pageSize}${
      userName ? "&userName=" + userName : ""
    }${userSource ? "&userSource=" + userSource : ""}`
  );
};

/**
 * 匹配老师
 * @param {Object} params 参数对象
 *    @param {Array} start_times  ['2020-10-10 00:00:00', '2021-10-10 00:00:00']  # 匹配老师选择的时间段
 *    @param {Int} page 页码
 *    @param {Int} page_size 每页条数
 */
export const matchingTeacher = function (pageNum, pageSize, params) {
  return $get(`/opsapi/tutor/search/matchtutor/${pageNum}/${pageSize}`, params);
};

/**
 * 移除班级成员
 * @param {Object} params 参数对象
 *  class_id 班级id
 *  student_id 学生id
 */
export const removeSmallClassStudent = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/student/del`,
    params
  );
};

/**
 * 移除班级成员
 * @param {Object} params 参数对象
 *  class_id 班级id
 *  student_id 学生id
 */
export const removeBigClassStudent = function ({ class_id, student_id }) {
  return $post(`/opsapi/bigClass/remove/student`, {
    studentId: student_id,
    classId: class_id,
  });
};

/**
 * 创建班级
 * @param {Object} params 参数对象
 *       classs_name_en 班级中文名称
 *       class_name_zh
 *       class_type   2.小班课  3.大班课
 *       class_category  1.免费  2.新加坡小班课  3.亚欧小班课
 *       course_edition   版本id
 *       course_level  级别
 *       unit_no  单元
 *       lesson_no  第几课
 *       start_times  时间数组
 */
export const createGroup = function (params) {
  return $post(`/classinfo/create_class/`, params);
};

/**
 *
 * @param {*} classCategory	integer($int32)
  minimum: -128
  maximum: 127
  收费标准 1.免费 2.新加坡小班课 3.亚欧小班课

  className	string
  班级英文名称

  classNameZh	string
  班级中文名称

  courseEditionId	integer($int32)
  版本标识

  courseLevel	integer($int32)
  课程级别

  lessonNo	integer($int32)
  每节课编号

  startTimeList	[...]
  studentArea	string
  招生区域

  userMax	integer($int32)
  班级人数
 */
export const createBigClass = function (params) {
  return $post(`/opsapi/bigClass/create`, params);
};

/**
 * classCategory	integer($int32)
    minimum: -128
    maximum: 127
    收费标准 1.免费 2.新加坡小班课 3.亚欧小班课

    className	string
    班级英文名称

    classNameZh	string
    班级中文名称

    classtypeId	integer($int64)
    小班班型ID

    courseEditionId	integer($int32)
    版本标识

    courseLevel	integer($int32)
    课程级别

    lessonNo	integer($int32)
    每节课编号

    startTimeList	[...]
    userMax	integer($int32)
    班级人数
 *
 */
export const createSmallClass = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/class/add`,
    params
  );
};

/**
 * 获取小班课课表 - 时间看板
 * @param {Object} params 参数对象
 */
export const getGroupTimetableData = function (params) {
  return $get(`/classroom/timetable_format_time/`, params);
};

/**
 * 获取小班课课表 - 班级看板
 * @param {Object} params 参数对象
 */
export const getGroupClassTabelData = function (params) {
  return $get(`/classroom/timetable_format_class/`, params);
};

/**
 * 获取小班课课表 - 列表视图的数据
 * @param {Object} params 参数对象
 *
 */
export const getGroupViewTabelData = function (params) {
  return $get(`/smallclass/classroom/`, params);
};

/**
 * 增加预排课
 * @param {Object} params 参数对象
 *    class_id  班级标识
 *     start_times 时间数组
 */
export const addSmallClassTimeTable = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/timetable/add`,
    params
  );
};

/**
 * 增加预排课
 * @param {Object} params 参数对象
 *    class_id  班级标识
 *     start_times 时间数组
 */
export const addBigClassTimeTable = function (params) {
  return $post(`/opsapi/bigClass/schedule/timetable`, params);
};

/**
 * 取消预排课
 * @param {Number} class_timetable_id 取消课标识
 */
export const cancelBigClassTimeTabel = function (params) {
  return $post(`/opsapi/bigClass/timetable`, params);
};

/**
 * 取消预排课
 * @param {Number} class_timetable_id 取消课标识
 */
export const cancelSmallClassTimeTabel = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/timetable/del`,
    params
  );
};

/**
 * 安排老师
 * @param {Object} params 参数对象
 *    class_timetable_id   课表id
 *    tutor_user_id  老师id
 */
export const bigClassTimeTableScribe = function (params) {
  return $post(`/opsapi/bigClass/timetable/assign/tutor`, params);
};

/**
 * 安排老师
 * @param {Object} params 参数对象
 *    class_timetable_id   课表id
 *    tutor_user_id  老师id
 */
export const smallClassTimeTableScribe = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/timetable/tutor/add`,
    params
  );
};

/**
 * 更换老师
 * @param {Object} params 参数对象
 *  class_timetable_ids 课表id
 *
 */
export const changeSmallGroupTeacher = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/timetable/tutor/update`,
    params
  );
};

/**
 * 更换老师
 * @param {Object} params 参数对象
 *  class_timetable_ids 课表id
 *
 */
export const changeBigGroupTeacher = function (params) {
  return $put(`/opsapi/bigClass/timetable/tutor`, params);
};

/**
 * 添加学生到小班课
 * @param {Object} param 参数对象
 *    class_id  班级标识
 *    student_id  学生标识
 */
export const addStudentToSmallClass = function ({ class_id, student_id }) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/student/add`,
    {
      classId: class_id,
      studentId: student_id,
    }
  );
};

/**
 * 添加学生到大班课
 * @param {Object} param 参数对象
 *    class_id  班级标识
 *    student_id  学生标识
 */
export const addStudentToBigClass = function ({ class_id, student_id }) {
  return $post(`/opsapi/bigClass/add/student`, {
    classId: class_id,
    studentId: student_id,
  });
};

/**
 * 获取可加入班级的学生列表
 * @param {Object} params 参数对象
 */
export const getStudentList = function (params) {
  return $get(`/opsapi/student/list/${params.page}/${params.page_size}`, {
    parentUserId: params.parentUserId ? params.parentUserId : null,
  });
};

/**
 * 大班课批量加入班级
 * @param {String}} data_textarea 大班课加入班级的文本
 */
export const bigGroupJoinStudents = function (data_textarea, class_no) {
  return $post(`/classinfo/add_student_batch/`, {
    data_textarea,
    class_no,
  });
};

/**
 * 获取班型详情 java
 * @param {Int} id 班型 id
 */
export const getClassTypeDetails = function (id) {
  return $get(`/opsapi/smallClass/classType/${id}`);
};

/**
 * 停用试听班型
 * @param {Int} classTypeId 班型id
 */
export const stopTryStopClassType = function (classTypeId) {
  return $put(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/try/stop/${classTypeId}`
  );
};

/**
 * 停用正式班型
 * @param {Int} classTypeId 班型id
 */
export const stopNormalStopClassType = function (classTypeId) {
  return $put(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/formal/stop/${classTypeId}`
  );
};

/**
 * 创建试听小班课班型
 * @param {Object}} params 参数对象
 *        classtypeNameZh,
 *        classtypeNameEn,
 *        team,
 *        courseEditionId,
 *        courseLevel,
 *        unitNo,
 *        lessonNo,
 *        weekList,
 *        time,
 *        applyStartTime: new Date(dateTime[0]).toISOString(),
 *        applyEndTime: new Date(dateTime[1]).toISOString(),
 *        userMax,
 *        userMin,
 *        languageLabel,
 *        ageLabel
 */
export const createTryGroupType = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/try/add`,
    params
  );
};

/**
 * 创建正式小班课班型
 * @param {Object} params 参数对象
 */
export const createNormalGroupType = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/formal/add`,
    params
  );
};

/**
 * 获取试听小班课班型列表
 * @param {Int} pageNum 页号
 * @param {INt} pageSize 页尺寸
 * @param {Object} params 参数列表
 */
export const getTryGroupTypeList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/class/type/try/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取正式小班课班型列表
 * @param {Int} pageNum 页号
 * @param {INt} pageSize 页尺寸
 * @param {Object} params 参数列表
 */
export const getNormalGroupTypeList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/class/type/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取班级学生列表
 * @param {Int} type 班级类型 1 试听 2正式
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getGroupStudentsList = function (type, pageNum, pageSize, params) {
  return $get(
    `/opsapi/smallClass/classType/apply/student/${type}/list/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取学生加入班级班型的log日志
 * @param {Int} studentId 学生表示
 */
export const getStudentGroupDetailLog = function (studentId) {
  return $get(`/opsapi/smallClass/classType/apply/log/list/${studentId}`);
};

/**
 * 获取学生可报名的试听班型
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getStudentCanApplyTryGroupTypeList = function (
  studentId,
  currentCoursePkgId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/class/type/can/apply/try/list/${studentId}/${currentCoursePkgId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取学生可报名的正式班型
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getStudentCanApplyNormalGroupTypeList = function (
  studentId,
  currentCoursePkgId,
  isStart,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/class/type/can/apply/formal/list/${studentId}/${currentCoursePkgId}/${isStart}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取学生可以报名的试听班级
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getStudentCanApplyTryGroupList = function (
  studentId,
  currentCoursePkgId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/try/can/apply/list/${studentId}/${currentCoursePkgId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取学生可以报名的正式班级
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getStudentCanApplyNormalGroupList = function (
  coursePackageId,
  studentId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/formal/can/apply/list/${studentId}/${coursePackageId}/${pageNum}/${pageSize}`,
    params
  );
};
/**
 * 学生加入试听班级
 * @param {Int} studentId 学生表示
 * @param {Int} classId 班级标识
 */
export const studentJoinTryGroup = function (studentId, classId) {
  return $post(`/opsapi/smallClass/apply/auto/try/class`, {
    classId,
    studentId,
  });
};

/**
 * 学生加入正式班级
 * @param {Int} studentId 学生表示
 * @param {Int} classId 班级标识
 */
export const studentJoinNormalGroup = function (studentId, classId) {
  return $post(`/opsapi/smallClass/apply/auto/formal/class`, {
    classId,
    studentId,
  });
};

/**
 * 学生加入试听班型
 * @param {Int} studentId 学生标识
 * @param {Int} classTypeId 班型标识
 */
export const studentJoinTryGroupType = function (studentId, timeTableId) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/try/apply/${studentId}/${timeTableId}`
  );
};

/**
 * 学生加入正式班型
 * @param {Int} studentId 学生标识
 * @param {Int} classTypeId 班型标识
 */
export const studentJoinNormalGroupType = function (studentId, classTypeId) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/small/class/type/formal/apply/${studentId}/${classTypeId}`
  );
};

/**
 * ·获取自动组班列表试听班级
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getAutoClassTryList = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/try/list`,
    params
  );
};

/**
 * ·获取自动组班列表正式班级
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getAutoClassNormalList = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/formal/list`,
    params
  );
};

/**
 * 撤销报名
 * @param {Int} applyId `XUESHENGID
 */
export const cancelStudentCancel = function (applyId) {
  return $put(`/opsapi/smallClass/classType/apply/cancel/${applyId}`);
};

export const getGroupStudentInfo = function (classId) {
  return $get(`/opsapi/smallClass/student/list/${classId}`);
};

/**
 * 获取产品列表
 */
export const getProductSPUList = function (params) {
  return $get(`/opsapi/product/spu/list`, params);
};

/**
 * 小班课补课列表-v2
 */
export const getAdjustList = function (
  studentId,
  adjustVirtualclassId,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/repair/list/${studentId}/${adjustVirtualclassId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 小班课补课-v2
 */
export const reqAdjust = function (params) {
  return $put(
    `/opsapi/classmanage/api/v1/class/manage/small/class/adjust/do/repair`,
    params
  );
};

/**
 * 班级详情-历史课程-列表查询
 */
export const getHistoryList = function (classId, pageNum, pageSize) {
  return $get(
    `/opsapi/smallClass/virtualclass/history/list/${classId}/${pageNum}/${pageSize}`
  );
};

/**
 * 小班课异常补课
 */
export const repairException = function (params) {
  return $put(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/repair/exception`,
    params
  );
};

/**
 * 班级详情-历史课程-列表查询
 */
export const repMemberlist = function (virtualclassId) {
  return $get(`/opsapi/smallClass/virtualclass/member/list/${virtualclassId}`);
};

/**
 * 学生信息-上课安排-小班课-请假-下拉学生
 */
export const getVirtualclassStudentList = function (virtualclassId) {
  return $get(
    `/opsapi/smallClass/virtualclass/member/all/list/${virtualclassId}`
  );
};

/**
 * 查询课包树的四级下拉的课程层级结构数据
 */
export const getCourseHierarchyData = function (params) {
  return $post(
    `/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/course/hierarchy/info`,
    params
  );
};

/**
 * 学生信息-上课安排-小班课-请假-下拉学生
 */
export const unmatchStartTime = function (params) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/arrange/tutor/unmatch/startTime`,
    params
  );
};

/**
 * 根据appId,学科类型，课程包类型，上课形态查询课包集合
 */
export const queryClassPackageList = function (params) {
  return $post(
    `/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/conditional/query/list`,
    params
  );
};

/**
 * 获取课程包下课包树的时长等信息。
 */
export const queryPackageTreeList = function (params) {
  return $post(
    `/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/list/by/ids`,
    params
  );
};

/**
 * 更换班级老师-获取匹配老师
 */
export const queryMatchTeacherList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/teachermanager/teacher-manage/teacher/search/matchtutor/class/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 更换班级老师
 */
export const updateClassTeacher = function (classId, tutorUserId) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/class/tutor/update/${classId}/${tutorUserId}`
  );
};

/**
 * 获取顾问学管
 */
export const getGwXg = function (studentUserId, coursePackageId) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/student/xg-advisor/info`,
    {
      studentUserId,
      coursePackageId,
    }
  );
};

/**
 * 根据level筛选获取level下的lessonId集合
 */
export const getLessonIdsByLevel = function (params) {
  return $post(
    `/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/lesson/list/by/level/and/package`,
    params
  );
};

/**
 * 查看教室事件日志
 */
export const getClassroomLog = async (classTypeId, virtualclassId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/classroom/virtualclass/room/event/${classTypeId}/${virtualclassId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 移出班级原因列表
 */
export const getDelStudentReason = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/business/before/small/class/student/del/reason`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
