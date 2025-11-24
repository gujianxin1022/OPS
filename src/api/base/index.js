import GetData from "@/utils/axios.js";

const {
  $get,
  $post,
  $put,
  $postImage,
  $postSingleCourseware,
  $postBatchCourseware,
} = new GetData();

/**
 * 退出
 */
export const logout = function () {
  return $post("/logout/");
};

/**
 * 登录
 * @param {Object} params 参数对象，包括：
 *        username          {String} 用户名
 *        password          {String} 密码
 */
export const tokenAuth = function (params) {
  return $post("/manager/api-token-auth/", params);
};

/**
 * 获取账号信息
 * @param {Number} all
 */
export const userInfo = function () {
  return $get("/menu/menu_list", { all: 1 });
};
/**
 * 获取学生版本
 * @param {Number} all
 */
export const courseEdition = function () {
  return $get("/opsapi/course/course/level/unit/info");
};

/**
 * 通过版本id，级别，判断该接口是否满足单元报告 v2.0 版本
 */
export const checkUnitVersion2 = function (param) {
  return $get(
    `/opsapi/teachingreport/report/unit/check/version/${param.unitId}`
  );
};

/**
 * 登录
 * @param {Object} params 参数对象
 *    @param {String} identify	账号
 *    @param {String} password	密码
 */
export const opsLogin = function (params) {
  return $post(`/opsapi/manage/user/auth/login`, params);
};

/**
 * 随机码验证
 * @param {Object} params 参数对象
 *    @param {String} identify	账号
 *    @param {String} authCode	随机验证码
 *    @param {String} authToke	验证token，非登陆后token
 *
 */
export const opsLoginVerification = function (params) {
  return $post(`/opsapi/manage/user/auth/login/ac`, params);
};

/**
 * 获取用户拥有的权限
 * @param {integer} userId 用户标识
 */
export const getUserPermission = function () {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/get/user/permissions`
  );
};

/**
 * 获取单元下的lesson
 * @param {Int} courseEditionId 版本id
 * @param {Int} courseLevel 级别好
 * @param {Int} unitNo `单元号··
 */
export const getLessonList = function (courseEditionId, courseLevel, unitNo) {
  return $get(
    `/opsapi/course/lesson/unit/${courseEditionId}/${courseLevel}/${unitNo}`
  );
};

/**
 * 获取课堂回放
 * @param {Number} virtualclass_id 教室id
 */
export const getClassRoomReplay = async (
  classTypeId,
  virtualclassId,
  userId,
  role
) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/classmanage/api/v1/class/manage/classroom/replay/by/userinfo/${classTypeId}/${virtualclassId}/${userId}/${role}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**激活回放 */
export const activeReplay = function (
  classTypeId,
  virtualclassId,
  userId,
  role
) {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/classroom/replay/renew/${classTypeId}/${virtualclassId}/${userId}/${role}`
  );
};
/**
 * 上传图片
 * @param {formData} formData 文件对象
 *        @param {formData} category 模块类型
 *        @param {formData} file 文件信息
 */
export const uploadImage = function (formData) {
  return $postImage(formData);
};

/**
 * 上传单个课件
 * @param {formData} formData
 */
export const uploadSingleCourseware = function (formData) {
  return $postSingleCourseware(formData);
};

/**
 * 上传多个课件
 * @param {formData} formData
 */
export const uploadBatchCourseware = function (formData) {
  return $postBatchCourseware(formData);
};

/**
 * 创建账号获取国家列表
 */
export const getCountryList = function () {
  return $get(`/opsapi/common/country/register/list`);
};

// 查询未读消息数量
export const getUnreadMessage = function (userId) {
  return $get(`/opsapi/message/count/unread/${userId}`);
};

/**
 * 查询消息列表
 * @deprecated
 */
export const getMessageList = function (userId, category, pageNum, pageSize) {
  return $get(
    `/opsapi/message/list/${userId}/${category}/${pageNum}/${pageSize}`
  );
};
// 查询所有分类下的未读消息数
export const getUnreadMessageCounts = function (userId) {
  const role = 5; // ops用户固定为 5
  return $get(
    `/opsapi/marketcenter/market/activemessage/iactive/count/business/type/${userId}/${role}/3`
  ).then((res) => {
    if (res.data.code !== 200) {
      return Promise.reject(res.data.message);
    }
    return res.data.data;
  });
};
// 查询某个分类下的消息列表
export const getMessageListByType = function (data) {
  return $post(
    `/opsapi/marketcenter/market/activemessage/iactive/commonpage/selectlist`,
    data
  ).then((res) => {
    if (res.data.code !== 200) {
      return Promise.reject(res.data.message);
    }
    return res.data.data;
  });
};

// 全部标记已读
export const allMessageRead = function (userId, category, lastCreateTime) {
  return $put(
    `/opsapi/message/read/all/${userId}/${category}/${lastCreateTime}`
  );
};

// 单条标记已读
export const fixParentRemark = function (userId, messageId) {
  return $put(`/opsapi/message/read/single/${userId}/${messageId}`);
};

/**获取指定用户部门 */
export const getUserDepartment = function (userId) {
  return $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/system/user/post/info`,
    { userId }
  );
};

/**退出登录 */
export const opsLogOut = function () {
  return $post(`/opsapi/manage/user/auth/logout`);
};

/**
 * 全语言列表
 */
export const getLanguageList = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/common/service/language/all"
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 是否可走sso登陆
 */
export const reqSSOLoginStatus = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/ops/user/skipsso",params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

