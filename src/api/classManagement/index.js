import GetData from "@/utils/axios.js";

const { $get, $post, $put, $delete } = new GetData();

/**
 * 上课安排
 * @param {Object} params 参数对象，包括：
 *        search_day          {String} 日期
 *        start_time          {String} 时间段
 *        class_type          {String} 班型
 *        student             {String} 课程类型
 *        teacher             {String} 教师
 *        programme_name      {String} 版本
 *        ordering            {String} 排序
 */
export const managerScheduler = function (params) {
  return $get("/classroom/", params);
};

/**
 * 新用户列表
 * @param {Object} params 参数对象，包括：
 *        source              {String} 来源
 *        student_status      {String} 状态
 *        programme_name      {String} 版本
 *        course_level        {String} 级别
 *        username            {String} 用户名
 *        ordering            {String} 排序
 */
export const managerStudent = function (params) {
  return $get("/student/", params);
};

/**
 * 学生管理-用户列表v2
 */
export const managerNewStudent = function (params) {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/students/file/student`,
    params
  );
};

/**
 * 学生详情 扩展
 * @param {Number} id 学生
 */
export const managerExtstudent = function (id) {
  return $get("/extstudent/" + id);
};

/**
 * 学生详情 扩展添加
 * @param {Object} params 参数对象
 */
export const managerExtstudentAdd = function (params) {
  return $post("/extstudent/add/", params);
};

/**
 * 学生详情 是否允许小班课
 * @param {Object} params 参数对象
 */
export const studentAllowSmallclass = function (student_id, allow_smallclass) {
  return $put("/student/" + student_id + "/set_allow_smallclass/", {
    allow_smallclass,
  });
};

/**
 * 学生详情 是否只上小班课
 * python转java
 * @param {Object} params 参数对象
 */
export const studentOnlySmallclass = function (student_id, only_smallclass) {
  // return $put('/student/' + student_id + '/set_only_smallclass/', {
  //   only_smallclass
  // })
  return $put(`/opsapi/student/only/small/class/${student_id}`, {
    onlySmallclass: only_smallclass,
  });
};

/**
 * 学生详情 上课进度
 * python转java
 * @param {Number} id 学生
 */
export const managerStudentCourse = function (id) {
  // return $get('/student/' + id + '/course_info/')
  return $get(`/opsapi/student/course/progress/${id}`);
};

/**
 * 学生详情 备注
 * @param {Object} params 参数对象
 */
export const getRemarkstudent = function (params) {
  return $get("/remarkstudent/", params);
};

/**
 * 学生详情 备注添加
 * @param {Object} params 参数对象
 */
export const postRemarkstudent = function (params) {
  return $post("/remarkstudent/", params);
};

/**
 * 课堂转换
 * @param {Number} virtualclass_id 教室id
 */
export const virtualclassRevert = function (virtualclass_id) {
  return $get("/classroom/" + virtualclass_id + "/revert/");
};

/**
 * 旁听
 * @param {Number} virtualclass_id 教室id
 */
export const virtualclassMonitor = function (classTypeId, virtualclassId) {
  return $get(
    `/opsapi/classroom/virtualclass/monitor/${classTypeId}/${virtualclassId}`
  );
};

/**
 * cc关单教室
 * @param {Number} virtualclass_id 教室id
 */
export const reqCCVideoOrderClassroomUrl = async (
  classTypeId,
  virtualclassId,
  userId
) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/classroom/tour/${classTypeId}/${virtualclassId}/${userId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 课堂回放
 * @param {Number} virtualclass_id 教室id
 */
export const virtualclassPlayback = function (virtualclass_id) {
  return $get("/classroom/" + virtualclass_id + "/course_playback/");
};

/**
 * 老师评语学生反馈
 * python转java
 * @param {Number} virtualclass_id 教室id
 * @param {Number} target Tutor获得的是学生反馈， Student获得的是老师评语
 */
// export const virtualclassComment = function (virtualclass_id, roleType) {
//   return $get(
//     `/opsapi/classroom/virtualclass/common/${virtualclass_id}?roleType=${
//       roleType == "Student" ? 3 : 2
//     }`
//   );
// };

/**
 * 老师评语学生反馈
 * python转java
 * @param {Number} virtualclass_id 教室id
 * @param {Number} target Tutor获得的是学生反馈， Student获得的是老师评语
 */
export const virtualclassComment = function (virtualclass_id, roleType) {
  return $get(
    `/opsapi/teachingreport/report/afterClass/virtualclass/common/${virtualclass_id}?roleType=${
      roleType == "Student" ? 3 : 2
    }`
  );
};

/**
 * 角色学管和课程顾问列表
 * @param {String} role 角色 course_adviser  课程顾问，learn_manager   学管老师
 */
export const managerUser = function (role) {
  return $get("/user/userlist/", {
    role,
  });
};

/**
 * 重新分配课程顾问
 * @param {Number} student_id 学生id
 * @param {Number} course_adviser_id 课程顾问id
 */
export const changeAdviser = function (student_id, course_adviser_id) {
  return $put("/student/" + student_id + "/change_adviser/", {
    course_adviser_id,
  });
};

/**
 * 重新分配学管老师
 * @param {Number} student_id 学生id
 * @param {Number} learn_manager_id 学管老师id
 */
export const changeLearnmanager = function (student_id, learn_manager_id) {
  return $put("/oldstudent/" + student_id + "/change_learnmanager/", {
    learn_manager_id,
  });
};

/**
 * 异常处理
 * @param {Number} virtualclass_id 课堂id
 */
export const virtualclassException = function (virtualclass_id) {
  return $get("/classroom/" + virtualclass_id + "/virtualclass_exception/");
};

/**
 * 提交异常审核结果
 * @param {Number} virtualclass_id 课堂id
 */
export const checkExceptionPut = function (virtualclass_id, param) {
  return $put("/classroom/" + virtualclass_id + "/check_exception/", param);
};

/**
 * 已上课堂发放课时费
 * @param {Number} virtualclass_id 课堂id
 */
export const virtualclassCost = function (virtualclass_id) {
  return $put("/classroom/" + virtualclass_id + "/provide_cost/");
};

/**
 * 设置学生等级
 * @param {Number} student_id 学生id
 */
export const setStudentLesson = function (student_id, params) {
  return $put("/student/" + student_id + "/set_student_lesson/", params);
};

/**
 * 重置C端用户的密码
 * @param {Int} userId 用户标识
 * @param {Int} role 用户角色，1：家长；2：学生；3：老师；4：城市合伙人
 */
export const resetCUserPsw = function (userId, role) {
  return $put(`/opsapi/user/reset/password/${userId}/${role}`);
};

/**
 * 正常结束
 * @param {Number} virtualclass_info_id 课堂ID
 */
export const normalEnd = function (virtualclass_info_id) {
  return $put("/classroom/" + virtualclass_info_id + "/finish_virtualclass/");
};
/**
 * 关联推荐人
 * @param {string} username 推荐人用户名
 */
export const relationReference = function (student_id, username) {
  return $put(`/student/${student_id}/add_reference/`, {
    username,
  });
};

/**
 * 批量转换课堂
 */
export const batchConversion = function (params) {
  return $post(`/classroom/revert_list/`, params);
};

/**
 * 获取班级列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getClassListData = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/all/brief`,
    params
  );
};

/**
 * 获取班级出席信息
 * @param {Int} classId 班级标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getSmallClassAttendInfo = function (classId, pageNum, pageSize) {
  return $get(
    `/opsapi/smallClass/attend/info/${classId}/${pageNum}/${pageSize}`
  );
};

/**
 * 获取班级出席统计信息
 * @param {Int} classId 班级标识
 */
export const getSmallClassAttendStatisticInfo = function (classId) {
  return $get(`/opsapi/smallClass/attend/statistic/${classId}`);
};

/**
 * 获取班级出席信息
 * @param {Int} classId 班级标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getBigClassAttendInfo = function (classId, pageNum, pageSize) {
  return $get(`/opsapi/bigClass/attend/info/${classId}/${pageNum}/${pageSize}`);
};

/**
 * 获取班级出席统计信息
 * @param {Int} classId 班级标识
 */
export const getBigClassAttendStatisticInfo = function (classId) {
  return $get(`/opsapi/bigClass/attend/statistic/${classId}`);
};

/**
 * 获取小班班级基本信息
 * @param {Int} classId 班级标识
 */
export const getSmallClassBaseInfo = function (classId) {
  return $get(`/opsapi/smallClass/classroom/basic/info?classId=${classId}`);
};

/**
 * 获取大班班级基本信息
 * @param {Int} classId 班级标识
 */
// TODO:大班课
export const getBigClassBaseInfo = function (classId) {
  return $get(`/opsapi/bigClass/classroom/basic/info?classId=${classId}`);
};

/**
 * 新成员加入班级
 * @param {Object} classroomAddClassMemberParam 参数对象
 *      classId 班级标识
 *      userId 班级成员的用户标识
 */
export const newStudentJoinClass = function (classroomAddClassMemberParam) {
  return $post(
    `/opsapi/classroom/classmember/add`,
    classroomAddClassMemberParam
  );
};

/**
 * 成员退出班级
 * @param {Int} classId 班级标识
 * @param {Int} studentUserId 退出班级的学生成员用户标识
 */
export const studentExitClass = function (classId, studentUserId) {
  return $delete(`/opsapi/classroom/classmember/${classId}/${studentUserId}`);
};

/**
 * 获取班级课程信息
 * @param {Int} classId 班级标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getClassCourseList = function (classId, pageNum, pageSize) {
  return $get(`/opsapi/class/base/course/${classId}/${pageNum}/${pageSize}`);
};

/**
 * 班级排课
 * @param {Int} classId 班级标识
 * @param {Array} startTimeList 上课开始时间集合
 */
export const classSchedule = function (classId, startTimeList) {
  return $post(`/opsapi/class/schedule/class/${classId}`, startTimeList);
};

/**
 * 班级取消约课
 * @param {Int} classId 班级标识
 * @param {Int} virtualclassIdList 取消课的标识集合
 */
export const classScheduleCancel = function (classId, virtualclassIdList) {
  return $delete(
    `/opsapi/class/schedule/cancel/${classId}`,
    virtualclassIdList
  );
};

/**
 * 班级修改预约的老师
 * @param {Object} scheduleClassChangeTutorParam 参数对象
 *        @param {Int}  classId 班级标识
 *        @param {Int}  classTypeId 班级类型标识，1：oneonone；2：smallclass
 *        @param {Array}  endTimes 结束UTC时间集合
 *        @param {Array}  startTimes 开始UTC时间	集合
 *        @param {Int}  tutorUserId 老师标识
 */
export const scheduleChangeTutorForGroup = function (
  scheduleClassChangeTutorParam
) {
  return $post(
    `/opsapi/schedule/class/change/tutor`,
    scheduleClassChangeTutorParam
  );
};

/**
 * 班级安排老师
 * @param {Int} classId 班级标识
 * @param {Int} tutorUserId 老师的用户标识
 * @param {Int} startTimeList 开始时间的集合
 */
export const scheduleTutorForGroup = function (
  classId,
  tutorUserId,
  startTimeList
) {
  return $post(
    `/opsapi/class/schedule/class/tutor/${classId}/${tutorUserId}`,
    startTimeList
  );
};

/**
 * 班级可预约老师列表
 * @param {Int} classId 班级标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *        @param {String} startTimeList 开始时间
 *        @param {Int} hide 是否对学生隐藏，0：不隐藏；1：隐藏；默认值0
 *        @param {Int} status 用户状态，0：未激活；1：已激活；2：被封禁；3：被删除；4:被隐藏；默认1
 *        @param {Int} teacherUsername 课程状态，1：进行中；2：已完结
 *        @param {Int} working 是否上岗，0：未上岗；1：已上岗；默认值0
 */
export const classCanScheduleTutorList = function (
  classId,
  pageNum,
  pageSize,
  params
) {
  let str = `?hide=${params.hide}&status=${params.status}&working=${params.working}&teacherUsername=${params.teacherUsername}`;
  params.startTimeList.forEach((item, index) => {
    str += `&startTimeList=${item}`;
  });
  return $get(
    `/opsapi/class/schedule/tutor/${classId}/${pageNum}/${pageSize}${str}`
  );
};

/**
 * 创建班级
 * @param {Object} classroomAddClassInfoParam 参数对象
 *    @param {Int}  classCategory 收费标准 1.免费 2.新加坡小班课 3.亚欧小班课
 *    @param {String}  className 班级英文名称
 *    @param {String}  classNameZh 中文班级名称
 *    @param {Int}  classTypeId 班型标识，1：1对1；2：小班课；3：新加坡小班课；默认值2
 *    @param {Int}  courseEditionId 版本标识
 *    @param {Int}  courseLevel 课程级别
 *    @param {Int}  lessonNo 每节课编号
 *    @param {String}  remark 班级描述信息
 *    @param {Array}  startTimeList 排课开始时间列表
 *
 */
export const creatClassRoom = function (classroomAddClassInfoParam) {
  return $post(`/opsapi/classroom/class/add`, classroomAddClassInfoParam);
};

/**
 * 调整班级级别和课程
 * @param {Int} classId 班级标识
 * @param {Int} newEditionId 版本编号
 * @param {Int} newLevel 新的级别
 * @param {Int} newLessonNo 新的课程编号
 */
export const editGroupProgress = function (
  classId,
  newEditionId,
  newLevel,
  newLessonNo
) {
  return $put(
    `/opsapi/schedule/adjust/smallclass/edition/level/${classId}/${newEditionId}/${newLevel}/${newLessonNo}`
  );
};

/**
 * 更新班级信息
 * @param {Int} classId 班级标识
 * @param {Object} classroomUpdateClassInfoParam 参数对象
 *        @param {Int} classId 班级标识
 *        @param {String} className 班级名称
 */
export const updateGroupInfo = function (
  classId,
  classroomUpdateClassInfoParam
) {
  return $put(
    `/opsapi/classroom/class/update/${classId}`,
    classroomUpdateClassInfoParam
  );
};

/**
 *  获取班级课表
 * @param {Object} params 参数对象
 *        @param {String} className 班级名称
 *        @param {String} classNo 班级编号
 *        @param {Int} courseEditionId 课程版本，1：高级版；2：国际版；3：SG版
 *        @param {Int} courseLevel 课程级别
 *        @param {String} createUserName 班级创建人的用户名称
 *        @param {String} endTime 结束时间，格式2019-08-25T02:30:00.000Z
 *        @param {String} startTime 开始时间，格式2019-08-25T02:30:00.000Z
 *        @param {String} studentUserName 学生的用户名称
 *        @param {String} tutorUserName 老师的用户名称
 *        @param {Int} xgUserId	 班级成员的学管和顾问用户标识
 */
export const getClassTimetable = function (params) {
  return $get(`/opsapi/class/timetable`, params);
};

/**
 * 获取班级课程列表视图
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getClassTimeListView = function (pageNum, pageSize, params) {
  return $get(`/opsapi/class/timetable/course/${pageNum}/${pageSize}`, params);
};

/**
 * java修改学生进度
 */
export const changeStudentProcess = function (
  studentUserId,
  newEditionId,
  newLevel,
  newLessonNo
) {
  return $put(
    `/opsapi/schedule/adjust/student/edition/level/${studentUserId}/${newEditionId}/${newLevel}/${newLessonNo}`
  );
};

/**
 * 获取上课安排 1vs1
 * @param {Object} params 参数对象
 */
export const getSchedulingOneByOneList = function (params) {
  // return $get(`/opsapi/oneClass/classroom`, params);
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/class/classroom`,
    params
  );
};

/**
 * 获取上课安排 大班课
 * @param {Object} params 参数对象
 */
export const getSchedulingBigClassList = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/big/class/classroom`,
    params
  );
};

/**
 * 获取上课安排 小班课
 * @param {Object} params 参数对象
 */
export const getSchedulingSmallClassList = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/classroom`,
    params
  );
};

/**
 * java 课堂转换 1vs1
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementCrCon = function (virtualclassId) {
  return $put(
    `/opsapi/oneClass/classArrangement/classroomConversion/${virtualclassId}`
  );
};

/**
 * java 课堂转换 小班课
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementCrConSmallClass = function (virtualclassId) {
  return $put(
    `/opsapi/smallClass/classArrangement/classroomConversion/${virtualclassId}`
  );
};
/**
 * java 课堂转换 大班课
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementCrConBigClass = function (virtualclassId) {
  return $put(
    `/opsapi/bigClass/classArrangement/classroomConversion/${virtualclassId}`
  );
};

/**
 * java 批量课堂转换 1vs1
 * @param {Int} params 参数对象
 *        virtualClassIds []
 *        virtualClassType
 */
export const classArrangementCrConMore = function (params) {
  return $put(
    `/opsapi/oneClass/classArrangement/batch/classroomConversion`,
    params
  );
};
/**
 * java 批量课堂转换 小班课
 * @param {Int} params 参数对象
 *        virtualClassIds []
 *        virtualClassType
 */
export const classArrangementCrConMoreSmallClass = function (params) {
  return $put(
    `/opsapi/smallClass/classArrangement/batch/classroomConversion`,
    params
  );
};
/**
 * java 批量课堂转换 大班课
 * @param {Int} params 参数对象
 *        virtualClassIds []
 *        virtualClassType
 */
export const classArrangementCrConMoreBigClass = function (params) {
  return $put(
    `/opsapi/bigClass/classArrangement/batch/classroomConversion`,
    params
  );
};

/**
 * java 结束课堂 1vs1
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementEndClass = function (virtualclassId) {
  return $put(`/opsapi/oneClass/classArrangement/endClass/${virtualclassId}`);
};

/**
 * java 结束课堂 小班课
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementEndClassSmallClass = function (virtualclassId) {
  return $put(`/opsapi/smallClass/classArrangement/endClass/${virtualclassId}`);
};
/**
 * java 结束课堂 大班课
 * @param {Int} virtualclassId 课堂标识
 */
export const classArrangementEndClassBigClass = function (virtualclassId) {
  return $put(`/opsapi/bigClass/classArrangement/endClass/${virtualclassId}`);
};

/**
 * java 获取可以代课的老师列表  1v1
 * @param {Int} tutorType 教师类型
 * @param {Int} studentUserId 学生用户标识
 * @param {String} startTime 开始时间
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const classArrangementSubstitute = function (params) {
  params.teacherUsername = params.name;
  delete params.name;
  params.teachingStyleIds = params.tutorStyleLabelList.length
    ? params.tutorStyleLabelList.split(",")
    : [];
  delete params.tutorStyleLabelList;
  params.languageIds = params.tutorLanguageLabelList.length
    ? params.tutorLanguageLabelList.split(",")
    : [];
  delete params.tutorLanguageLabelList;
  params.virtualclassId=params.virtualClassId
  delete params.virtualClassId;
  return $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/substitute/manual`,
    params
  );
};
/**
 * java 获取可以代课的老师列表  小班课
 * @param {Int} tutorType 教师类型
 * @param {Int} studentUserId 学生用户标识
 * @param {String} startTime 开始时间
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const classArrangementSubstituteSmallClass = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/small/class/classArrangement/substitute/list`,
    params
  );
};

/**
 * java 获取可以代课的老师列表  大班课
 * @param {Int} tutorType 教师类型
 * @param {Int} studentUserId 学生用户标识
 * @param {String} startTime 开始时间
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const classArrangementSubstituteBigClass = function (params) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/big/class/classArrangement/substitute/list`,
    params
  );
};

/**
 * 获取异常审核信息
 * @param {Int} classTypeId 1 1v1 2小班课 3大班课
 * @param {Int} virtualClassId 课堂id
 */
export const getExamineInfo = function (classTypeId, virtualClassId) {
  return $get(
    `/opsapi/classroom/virtualclass/examine/info/${classTypeId}/${virtualClassId}`
  );
};

/**
 * 异常审核
 * @param {Int} classTypeId 1 1v1 2小班课 3大班课
 * @param {Int} virtualClassId 课堂id
 * @param {*} params 参数对象
 */
export const examineJava = function (classTypeId, virtualclassId, params) {
  return $post(
    `/opsapi/classroom/virtualclass/examine/${classTypeId}/${virtualclassId}`,
    params
  );
};

// 调整精度，lesson下拉选项 status = 1 正式课 2 试听课 3 全部
export const infoByFormal = function (status) {
  return $get(`/opsapi/course/get/info/by/formal/${status}`);
};

/* 约课课包列表 */
export const reqBookCoursePackage = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/coursePackage/list`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1历史老师列表 */
export const reqOtoHistoryTutorList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/history`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1收藏老师列表 */
export const reqOtoFavoriteTutorList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/favorite`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1推荐老师列表 */
export const reqOtoRecommendTutorList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/recommend`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1ops收藏老师列表 */
export const reqOPSFavoriteTeacherList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/manage/favorite`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1ops黑名单老师列表 */
export const reqOPSBlackTeacherList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/manage/blacklist`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询1v1推荐老师列表 */
export const reqOtoAllTutorList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/schedule/find/tutor/ops/oto/all`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询家长是否已经收藏了某个老师 */
export const reqIsParentFavoriteTeacher = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachermanager/teacher-manage/favorite/tutor/ops/count/${param.parentUserId}/${param.tutorUserId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 收藏某个老师 */
export const reqAddParentFavoriteTeacher = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/favorite/tutor/ops/add`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 取消收藏某个老师 */
export const reqCancelParentFavoriteTeacher = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachermanager/teacher-manage/favorite/tutor/ops/cancel`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取学生调课原因 */
export const reqOtoAdjustReason = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/adjust/ops/reason`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 调课前置校验 */
export const reqOtoAdjustCheck = async (studentTimetableId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/adjust/ops/check`,
    { studentTimetableId }
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* OPS1v1调课 */
export const reqOtoAdjust = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/adjust/ops/doAdjust`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 根据课表ID取消约课 */
export const reqBatchCancelClass = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/cancel/ops/doCancel/ids`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取学生课包下最后一节课程上课时间 */
export const reqPackageLastStartTime = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/student/time/table/last/startTime/package`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 单次约课 */
export const reqdoScheduleSingle = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/doSchedule/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 单次求课 */
export const reqDoRequestSingle = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/request/ops/doRequest/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 周期约课前置验证 */
export const reqDoScheduleCycleCheck = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/check/doSchedule/cycle`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 周期约课前置验证 */
export const reqdoScheduleCycle = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/doSchedule/cycle`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 单次约课，按钮点击验证 */
export const reqFirstCheckSingle = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/check/first/doSchedule/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 周期约课，按钮点击验证 */
export const reqFirstCheckCycle = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/check/first/doSchedule/cycle`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 单次求课，按钮点击验证 */
export const reqFirstCheckRequest = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/request/ops/check/first/doRequest/single`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 约课课包列表（先选老师再选学生） */
export const reqBookStudentById = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/coursePackage/list/by/tutor`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 先选老师约课，点击单次/周期约课按钮验证 */
export const reqBookFromTeacherCheckFirst = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/check/first/by/tutor`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 先选老师约课，选择课包验证 */
export const reqBookFromTeacherCheckSecond = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/schedule/ops/check/coursePackage/by/tutor`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取我的求课列表 */
export const reqWorkRequestCourseList = async (params) => {
  const { status, data } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/request/ops/select/list`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};

/* 获取我的求课详情 */
export const reqWorkRequestCourseInfo = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/request/ops/select/detail/${id}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 取消单次求课 */
export const reqDoCancelRequestSingle = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/classmanage/api/v1/class/manage/one/to/one/request/ops/cancel/${id}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
