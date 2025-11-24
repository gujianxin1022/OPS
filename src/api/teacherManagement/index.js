import GetData from "@/utils/axios.js";
const { $get, $post, $put, $delete } = new GetData();

/**
 * 获取老师课表
 * @param {Object} param 参数对象
 *  tutor_user_id   老师用户标识
 *  start_time  开始时间
 *  end_time    结束时间
 */
export const teacherTimetable = function ({
  tutor_user_id,
  start_time,
  end_time,
}) {
  // return $get(`/opsapi/schedule/tutor/timetable/${tutor_user_id}/${start_time}/${end_time}`)
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/tutor/time/table/ops/query/${tutor_user_id}/${start_time}/${end_time}`
  );
};

/**
 * 获取需要确认的老师课表
 */
export const scheduleTeacherTimetable = function ({
  tutor_user_id,
  start_time,
  end_time,
  studentUserId,
  coursePackageId,
}) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/tutor/time/table/ops/schedule/query/${tutor_user_id}/${start_time}/${end_time}/${coursePackageId}/?studentUserId=${studentUserId}`
  );
};

/**
 * 获取需要确认的老师课表
 */
export const reqRequestScheduleTeacherTimetable = function ({
  tutor_user_id,
  start_time,
  end_time,
  studentUserId,
  coursePackageId
}) {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/tutor/time/table/ops/request/query/${tutor_user_id}/${start_time}/${end_time}/${coursePackageId}/${studentUserId}`
  );
};

/**
 * 查询-题库大纲信息接口
 */
export const getNewOutline = function ({ lessonId }) {
  return $get(`/opsapi/homework/outline/${lessonId}`);
};

/**
 * 更新-题库大纲考察内容接口
 */
export const setNewKnowledge = function (knowledgeData) {
  return $put(`/opsapi/homework/outline/content/${knowledgeData.outlineId}`, {
    inspectionContent: knowledgeData.inspectionContent,
  });
};

/**
 * 获取某个版本级别的所有课程
 */
export const getAllLessons = function (courseId) {
  // return $get(`/course_edition/lessons/?course_id=${courseId}`)
  return $get(
    `/opsapi/teachingprogram/program/course/course/get/homework/lesson/question/${courseId}`
  );
};

/**
 * 获取录播课视频列表
 * @param {INt} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} parmas
 *         @param {String} title  视频标题
 */
export const getVideoList = function (pageNum, pageSize, params) {
  return $get(`/opsapi/course/video/list/${pageNum}/${pageSize}`, params);
};

/**
 * 获取unit的lesson
 * @param {INt} courseEditionId 版本标识
 * @param {Int} courseLevel 级别标识
 * @param {Int} unitNo 单元号标识
 */
export const getCourseList = function (courseEditionId, courseLevel, unitNo) {
  return $get(
    `/opsapi/course/lesson/unit/${courseEditionId}/${courseLevel}/${unitNo}`
  );
};

/**
 * 获取某个课程lesson的详情
 * @param {Int} lessonId 课程标识
 */
export const getLessonInfo = function (lessonId) {
  return $get(`/opsapi/course/lesson/detail/${lessonId}`);
};

/**
 * 更新lesson基本信息
 * @param {Object} params 参数对象
 *        @param {String} description 课程描述
 *        @param {Int} lessonId lesson标识
 *        @param {String} name 课程名称
 *        @param {String} pictureUrl 课程描述
 */
export const updateCourseInfo = function (params) {
  return $post(`/opsapi/course/lesson/base/info`, params);
};

/**
 * 更新lesson知识点信息
 * @param {Object} params 参数对象
 *        @param {Array} knowledgePointList 课程描述
 *        @param {Int} lessonId lessonId
 *
 */
export const updateCourseKnowledgePoint = function (params) {
  return $post(`/opsapi/course/lesson/knowledge/point`, params);
};

/**
 * 查询-题库小题的知识点类型下拉值接口
 */
export const getKnowledgePoint = function () {
  return $get(`/opsapi/homework/knowledge/point/type`);
};

/**
 * 删除-题库中一道大题接口
 */
export const deleteSubject = function (groupId) {
  return $delete(`/opsapi/homework/outline/group/${groupId}`);
};

/**
 * 更新--更新一道大题的类型描述信息接口
 */
export const changeSubjectInfo = function (params) {
  return $put(
    `/opsapi/homework/outline/group/${params.subjectId}`,
    params.subjectInfo
  );
};
// export const changeSubjectInfo = function({subjectId, subjectInfo}) {
//   return $put(`/homework/outline_group/${subjectId}/`, subjectInfo)
// }

/**
 * 新增-一套题库大题框架接口
 */
export const newOutline = function (params) {
  return $post(`/opsapi/homework/outline/group`, params);
};

/**
 * 查询-草稿/已发布状态的题库信息接口
 */
export const queryHomeworkInfo = function (params) {
  return $get(
    `/opsapi/homework/outline/group/question/${params.lessonId}/${params.status}`
  );
};

/**
 * 发布-题库大纲信息接口
 */
export const publishHomework = function (lessonId) {
  return $put(`/opsapi/homework/outline/public/${lessonId}`);
};

/**
 * 删除-题库中大题下的一道小题接口
 */
export const deleteTopic = function (questionId) {
  return $delete(`/opsapi/homework/question/${questionId}`);
};

/**
 * 上传图片，文件到S3
 */
export const uploadImage = function (params) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/uploadFile`,
    params
  );
};

/**
 * 保存题库
 */
export const saveHomework = function (params) {
  return $post(`/opsapi/homework/question/info/save`, params);
};

/**
 * 调整--题库调整接口
 */
export const adjustOutline = function (params) {
  return $put(`/opsapi/homework/outline/group/change`, params);
};

/**
 * 获取录播课视频主题
 */
export const getVideoTopicList = function () {
  return $get(`/opsapi/course/video/select/topic/`);
};

/**
 * 修改视频主题
 * @param {Int} videoId 视频标识
 * @param {Int} topicId 视频主题标识
 */
export const updatedVideoTopic = function (videoId, topicId, oldTopicId) {
  return $post(
    `/opsapi/course/video/update/video/topic/${videoId}/${topicId}/${oldTopicId}`
  );
};

/**
 * 视频确认重新上传
 */
export const confirmReUpload = function (params) {
  return $post(`/opsapi/course/video/update/video/upload/url`, params);
};

/**
 * 导出启蒙版数据
 */
export const exportKidEditionHomeworkData = function () {
  return $get(`/opsapi/multimedia/resources/export/multimedia/resources`);
};

// 单元详情

export const getLearningPointEcho = function (unitId) {
  return $get(`/opsapi/unit/report/select/knowledge/points/${unitId}`);
};

export const getLearningPointPreserve = function (
  CourseUnitKnowledgePointsParam
) {
  return $post(
    `/opsapi/unit/report/knowledge/points`,
    CourseUnitKnowledgePointsParam
  );
};

export const getLearningPointIssue = function (CourseUnitKnowledgePointsParam) {
  return $post(
    `/opsapi/unit/report/release/knowledge/points`,
    CourseUnitKnowledgePointsParam
  );
};

export const getskillEcho = function (unitId) {
  return $get(`/opsapi/unit/report/select/skill/${unitId}`);
};

export const getskillPreserve = function (courseUnitSkillsParam) {
  return $post(`/opsapi/unit/report/skill`, courseUnitSkillsParam);
};

export const getskillIssue = function (courseUnitSkillsParam) {
  return $post(`/opsapi/unit/report/release/skill`, courseUnitSkillsParam);
};

export const getHomeworkConfig = (params) =>
  $post(
    `/opsapi/courseHomeworkMultimedia/findCourseHomeworkMultimediaByLid`,
    params
  );

// 白名单
export const getQuery = (params) =>
  $post(
    `/discover/accountsVideoTopic/findAccountsVideoTopicList`,
    params,
    "discover"
  );

export const getWhiteList = (params) =>
  $post(
    `/discover/accountsVideoTopic/addThemeVideoWhitelist`,
    params,
    "discover"
  );

export const getMultimediaListByUnitNo = (params) =>
  $post(`/opsapi/courseHomeworkMultimedia/findByUnitNo`, params);

export const updateBatchMultimedia = (params) =>
  $post(
    `/opsapi/courseHomeworkMultimedia/updateBatchByPrimaryKeySelective`,
    params
  );

// 根据版本id查询版本类型(判断是否是英文直播课单元报告)
export const getUnitReportType = (courseEditionId) =>
  $get(`/opsapi/teachingreport/report/unit/edition/type`, courseEditionId);

// 主题管理 - 查询视频主题列表    over
export const getThemeList = (params) => {
  return $post("/opsapi/course/topic/select/topic/list", params);
};
// 主题管理 - 查询主题名称是否存在    over
export const searchThemeNme = (params) => {
  return $post("/opsapi/course/topic/query/topic", params);
};
// 主题管理 - 新增视频主题    over
export const addTheme = (params) => {
  return $post("/opsapi/course/topic/insert/topic", params);
};
// 主题管理 - 编辑 数据回显    over
export const editThemeData = (id) => {
  return $get(`/opsapi/course/topic/select/topic/course/${id}`);
};
// 主题管理 - 修改视频主题    over
export const editTheme = (params) => {
  return $post("/opsapi/course/topic/update/topic", params);
};
// 主题管理 - 删除视频主题    over
export const delTheme = (id) => {
  return $get(`/opsapi/course/topic/delete/topic/${id}`);
};
// OPS端，获取预签名地址，上传资源至美西S3
export const getS3Url = (fileType) => {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/ops/media/sign/url?fileType=${fileType}`,
    null
  );
};
// 新增录播视频
export const insertVideo = (params) => {
  return $post(`/opsapi/course/video/insert/video`, params);
};
// 修改录播视频
export const editVideo = (params) => {
  return $post(`/opsapi/course/video/update/video`, params);
};
// 根据id查询录播课视频    over
export const getVideoMsg = (id) => {
  return $get(`/opsapi/course/video/select/video/${id}`);
};
// 重新上传    over
export const reupload = (params) => {
  return $post(`/opsapi/course/video/update/video/upload/url`, params);
};
// 删除视频    over
export const delVideo = (id) => {
  return $get(`/opsapi/course/video/delete/video/${id}`);
};
// 判断课程是否有绑定视频    over
export const lessonBinding = (params) => {
  return $post(`/opsapi/course/video/get/video/lesson/binding`, params);
};
/* 录播视频从s3同步至ali */

export const reqRcloneVideo = async (params) => {
  console.log(params)
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/lms-file/homework/rclone?path=${params.path}&usBucketStatus=1&cnBucketStatus=0`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
