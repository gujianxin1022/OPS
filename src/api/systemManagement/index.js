import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();
/**
 * 获取系统全部角色信息
 */
export const getSystemRolesList = function () {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/role/all`
  );
};
/**
 * 获取角色拥有的权限
 * @param {integer} roleId 角色标识
 */
export const getRoleHavePowers = function (roleId) {
  return $get(`/opsapi/manage/permission/role/${roleId}`);
};
/**
 * 分配角色权限
 * @param {Array} permissionIds 权限ID数组
 * @param {integer} roleId 角色标识
 */
export const distributionPower = function (permissionIds, roleId) {
  return $post(`/opsapi/manage/role/permission/add/${roleId}`, permissionIds);
};
/**
 * 取消角色权限
 * @param {Array} permissionIds 权限ID数组
 * @param {integer} roleId 角色标识
 */
export const CancelPower = function (permissionIds, roleId) {
  return $post(
    `/opsapi/manage/role/permission/delete/${roleId}`,
    permissionIds
  );
};
/**
 * 更新角色权限
 * @param {Array} permissionIds 权限ID数组
 * @param {integer} roleId 角色标识
 */
export const updatePower = function (permissionIds, roleId) {
  return $post(
    `/opsapi/manage/role/permission/update/${roleId}`,
    permissionIds
  );
};
/**
 * 添加角色信息
 * @param {Object} roleInfo 参数对象
 *    @param {String} code 角色编码
 *    @param {String} createTime 创建时间
 *    @param {Int} id 角色标识
 *    @param {String} nameEn 角色英文名
 *    @param {String} nameZh 角色中文名
 *    @param {Int} order 角色排序
 *    @param {String} remark 角色说明
 *    @param {Int} status 菜单状态，0：无效；1：有效
 *    @param {Int} type 角色类型，1：超级管理员；2：普通用户
 *    @param {String} updateTime 更新时间
 */
export const addRolesInfo = function (roleInfo) {
  return $post(`/opsapi/manage/role/add`, roleInfo);
};
/**
 * 删除角色信息
 * @param {Int} roleId 角色标识
 */
export const removeRoleInfo = function (roleId) {
  return $delete(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/role/delete/${roleId}`
  );
};
/**
 * 更新角色信息
 * @param {Int} roleId 角色标识
 * @param {Object} roleInfo 参数对象
 *    @param {String} code 角色编码
 *    @param {String} createTime 创建时间
 *    @param {Int} id 角色标识
 *    @param {String} nameEn 角色英文名
 *    @param {String} nameZh 角色中文名
 *    @param {Int} order 角色排序
 *    @param {String} remark 角色说明
 *    @param {Int} status 菜单状态，0：无效；1：有效
 *    @param {Int} type 角色类型，1：超级管理员；2：普通用户
 *    @param {String} updateTime 更新时间
 */
export const updateRoleInfo = function (roleId, roleInfo) {
  return $put(`/opsapi/manage/role/update/${roleId}`, roleInfo);
};
/**
 * 获取该角色的用户列表
 * @param {Int} roleId 角色标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getThisRoleUserList = function ({ roleId, pageNum, pageSize }) {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/role/user/list/${roleId}/${pageNum}/${pageSize}`
  );
};
export const getThisRoleUserLists = function (str) {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/role/user/list/role?roleIdList=${str}`
  );
};
/**
 * 获取系统全部岗位信息
 */
export const getJobPositionList = function () {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/all`
  );
};

/**
 * 获取系统全部权限信息
 */
export const getSystemAllPowerInfo = function () {
  return $get(`/opsapi/manage/permission/all`);
};
/**
 * 获取角色全部权限
 * @param {integer} roleId 角色标识
 */
export const getRolesAllPrower = function (roleId) {
  return $get(`/opsapi/manage/permission/role/${roleId}`);
};

/**
 * 更新系统全部权限
 * @param {Object} permissionInfoNodeList 参数对象
 */
export const updateSystemAllPower = function (permissionInfoNodeList) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/permission/update`,
    permissionInfoNodeList
  );
};

/**
 * 更新权限信息
 * @param {integer} permissionId 权限标识
 * @param {Object} PermissionInfo 参数对象
 */
export const updatePowerInfo = function (permissionId, PermissionInfo) {
  return $post(
    `/opsapi/manage/permission/update/${permissionId}`,
    PermissionInfo
  );
};

/**
 * 获取用户信息列表
 */
export const getUserInfoList = function (params) {
  const { pageNum, pageSize } = params;
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/all/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 添加用户
 * @param {Object}} userInfo 用户信息
 */
export const addUser = function (userInfo) {
  return $post(`/opsapi/manage/user/add`, userInfo);
};

/**
 * 更新用户信息
 * @param {integer}} userId 用户标识
 * @param {Object} userInfo 用户信息
 */
export const updateUser = function (userInfo, userId) {
  return $put(`/opsapi/manage/user/update/${userId}`, userInfo);
};

/**
 * 删除用户
 * @param {integer} userId 用户标识
 */
export const deleteUser = function (userId) {
  return $delete(`/opsapi/manage/user/delete/${userId}`);
};

/**
 * 操作用户离职
 * @param {integer} userId 用户标识
 */
export const resignUser = async (userId) => {
  const { status, data } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/dimission`,
    { userId: userId }
  );
  // 700032:进入了待离职列表 200:直接离职
  const code = data.code;
  if ([200, 700032].includes(code)) {
    return data;
  }
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改用户密码
 * @param {integer} userId 用户标识
 * @param {String} oldPassword 原密码MD5
 * @param {String} newPassword 新密码MD5
 */
export const changeUserPassword = function (userId, oldPassword, newPassword) {
  return $post(
    `/opsapi/manage/user/update/password/${userId}/${oldPassword}/${newPassword}`
  );
};

/**
 * 重置用户密码
 * @param {integer} userId 用户标识
 */
export const resetUserPassword = function (userId) {
  return $post(`/opsapi/manage/user/reset/password/${userId}`);
};

/**
 * 更新用户角色
 * @param {integer} userId 用户标识
 * @param {Array} roleIds 角色标识集合
 */
export const updateUserRole = function (userId, roleIds) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/role/update/${userId}`,
    roleIds
  );
};

/**
 * 获取用户详细信息
 * @param {integer} userId 用户标识
 */
export const getUserDetailInfo = function (userId) {
  return $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/role_post_permission`,
    { userId: userId }
  );
};

/**
 * 更新系统全部岗位
 * @param {Object} postInfoNodeList 参数对象
 *      @param {String} code 岗位编码
 *      @param {integer} id 岗位标识
 *      @param {integer} leader 岗位类型 1: 管理岗，2: 基层员工岗
 *      @param {String} nameEn 岗位英文名
 *      @param {String} nameZh 岗位中文名
 *      @param {integer} pid 上级岗位标识
 *      @param {String} remark 岗位说明
 *      @param {Array} subList 下级岗位列表
 *      @param {integer} type 岗位类别 1：岗位，2：部门，3：公司
 */
export const updateJobTree = function (postInfoNodeList) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/update`,
    postInfoNodeList
  );
};

/**
 * 更新岗位信息
 * @param {integer} postId 岗位标识
 * @param {Object} postInfo 岗位信息
 */
export const updateJobInfo = function (postId, postInfo) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/update/${postId}`,
    postInfo
  );
};
/**
 * 获取该岗位以及下级岗位的用户列表
 * @param {Object} param 参数对象
 *    @param {integer} pageNum 页号
 *    @param {integer}  pageSize 页尺寸
 *    @param {integer}  fullCodePre 岗位完整编码前缀
 *    @param {integer} postFullCode postFullCode
 */
export const getThisJobUserList = function ({
  pageNum,
  pageSize,
  fullCodePre,
}) {
  return $get(`/opsapi/manage/post/user/all/${pageNum}/${pageSize}`, {
    fullCodePre,
  });
};
/**
 * 获取该岗位上的所有用户
 * @param {Object} param 参数对象
 */
export const getThisJobUsers = function ({ postId, pageNum, pageSize }) {
  return $get(`/opsapi/manage/post/user/list/${postId}/${pageNum}/${pageSize}`);
};

/**
 * 获取全量用户列表
 * @param {Int} postId 岗位标识
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getNotUserList = function (postId, pageNum, pageSize, params) {
  return $get(
    `/opsapi/manage/post/user/notList/${postId}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 设置/取消部门负责人
 * @param {Int} postId 部门标识
 * @param {Int} userId 用户标识
 * @param {Int} type 操作类型 0取消 1设置
 */
export const updateLeader = function (postId, userId, type) {
  return $put(
    `/opsapi/manage/post/user/updateLeader/${postId}/${userId}/${type}`
  );
};

/**
 * 关联岗位和用户
 * @param {integer} postId 岗位标识
 * @param {Array} userIds 用户标识集合
 */
export const relationJobAndUser = function (postId, userIds, operatorId) {
  return $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/user/add/${postId}/${operatorId}`,
    userIds
  );
};

export const deletePostUser = function (postId, userIds, operatorId) {
  return $delete(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/user/delete/${postId}/${operatorId}`,
    userIds
  );
};

/**
 * 查询操作日志列表
 */
export const checkOperationLog = function (params) {
  let username = params.username ? `&username=${params.username}` : "",
    startTime = params.startTime ? `&startTime=${params.startTime}` : "",
    action = params.action ? `&action=${params.action}` : "",
    endTime = params.endTime ? `&endTime=${params.endTime}` : "",
    actions = params.actions ? `&actions=${params.actions}` : "";
  return $get(
    `/opsapi/manage/opslog/all/${params.pageNum}/${params.pageSize}?${action}${startTime}${endTime}${username}?${actions}`
  );
};

/**
 * 查询所有操作行为
 */
export const checkAllOperationBehavior = function () {
  return $get(`/opsapi/manage/opslog/action/all`);
};

export const delWeChatInfo = (params) =>
  $delete(
    `/opsapi/studentcenter/api/v1/pub/studentcenter/user/wechat/info/del`,
    params
  );

export const queryWeChatDelList = (params) =>
  $post(
    `/opsapi/studentcenter/api/v1/pub/studentcenter/user/wechat/info/del/list`,
    params
  );

export const queryWeChatDelLogList = (pageInfo, params) =>
  $get(
    `/opsapi/studentcenter/api/v1/pub/studentcenter/user/wechat/info/del/log/${pageInfo.pageNum}/${pageInfo.pageSize}`,
    params
  );

/**
 * 查询白名单列表
 */
export const queryAllowList = (type, params) =>
  $get(`/opsapi/white/list/${type}`, params);

/**
 * 修改家长白名单状态
 */
export const updateAllowListStatus = (id, status) =>
  $put(`/opsapi/white/list/change/status/${id}/${status}`);

/**
 * 添加家长白名单
 */
export const createAllowList = (params) =>
  $post(`/opsapi/white/list/create`, params);

/**
 * 分页查询课包列表
 */
export const getCoursePackageList = (params) =>
  $get(
    `/opsapi/operations/api/v1/pub/operations/product/package/page/list`,
    params
  );

/**
 * 查询所有未过期的产品列表
 */
export const getEffectiveProductList = () =>
  $get("/opsapi/operations/api/v1/pub/operations/product/query/all/product");

/**
 * 新增课包
 */
export const addCoursePackage = (params) =>
  $post(
    `/opsapi/operations/api/v1/pub/operations/product/package/add/package`,
    params
  );

/**
 * 根据id查询课包
 */
export const getCoursePackageById = (id) =>
  $get(`/opsapi/operations/api/v1/pub/operations/product/package/${id}`);

/**
 * 根据id修改课包详情同时记录操作日志
 */
export const updateCoursePackage = (params) =>
  $put(
    `/opsapi/operations/api/v1/pub/operations/product/package/update/by/id`,
    params
  );

/**
 * 产品课包操作日志
 */
export const getCoursePackageOperationLog = (params) =>
  $get(
    `/opsapi/operations/api/v1/pub/operations/product/operation/log/page/list/by/reference`,
    params
  );

/**
 * 更新产品上架状态
 */
export const updateProdunctStatus = (params) =>
  $put(
    `/opsapi/operations/api/v1/pub/operations/product/update/status/by/id`,
    params
  );

/**
 * 分页查询产品列表
 */
export const getProductList = (params) =>
  $get(`/opsapi/operations/api/v1/pub/operations/product/page/list`, params);

/**
 * 根据id查询产品
 */
export const getProductById = (id) =>
  $get(
    `/opsapi/operations/api/v1/pub/operations/product/query/one/by/id/${id}`
  );

/**
 * 添加产品并记录日志
 */
export const addPorduct = (params) =>
  $post(`/opsapi/operations/api/v1/pub/operations/product/add/product`, params);

/**
 * 查询所有未失效货币
 */
export const getEffectiveCurrencyList = () =>
  $get(
    "/opsapi/operations/api/v1/pub/operations/common/exchange/rate/list/all"
  );

/**
 * 查询支付协议
 */
export const getProtocolList = () =>
  $get(
    "/opsapi/customerdata/api/v1/customer/data/agreement/query/all/protocol"
  );

/**
 * 添加支付协议
 */
export const addProtocol = (params) =>
  $post("/opsapi/customerdata/api/v1/customer/data/agreement/add", params);

/**
 * 商户信息
 */
export const getMerchantAppId = () =>
  $get(
    "/opsapi/operations/api/v1/pub/operations/teaching/and/research/merchant/appId/list"
  );

/**
 * 学科/课程包类型/上课形态列表
 */
export const getSubjectClassTypeList = () =>
  $get(
    "/opsapi/operations/api/v1/pub/operations/teaching/and/research/subject/class/type/list"
  );

/**
 * 课程包列表
 */
export const getQueryList = (params) =>
  $get(
    "/opsapi/operations/api/v1/pub/operations/teaching/and/research/package/conditional/query/list",
    params
  );

/**
 * 国家地区列表
 */
export const getCountryAll = () => $get("/opsapi/country/all");

/**
 * 支付协议列表
 */
export const getAgreement = () =>
  $get("/opsapi/operations/api/v1/pub/operations/agreement");

/**
 * spu列表
 */
export const getSPUList = (params) =>
  $get("/opsapi/operations/api/v1/pub/operations/spu/list", params);

/**
 * sku列表
 */
export const getSKUList = (params) =>
  $get("/opsapi/operations/api/v1/pub/operations/sku/list", params);

/**
 * 课程包spu详情
 */
export const getSKUDetails = (spuId) =>
  $get(`/opsapi/operations/api/v1/pub/operations/course/product/details`, {
    spuId,
  });

/**
 * 保存课程包spu
 */
export const saveCourseProduct = (params) =>
  $post(`/opsapi/operations/api/v1/pub/operations/course/product`, params);

/**
 * 上传图片
 * @param {File} file 文件信息
 * @param {Int} category 1-sku上传; 2-订单退款上传; 3-对账优化上传
 */
export const uploadFileInterface = (params) =>
  $post(`/opsapi/uploadFile`, params);

/**
 * 币种列表
 */
export const getCurrency = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/common/exchange/rate/available`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取1v1课堂平台列表
 */
export const getOneToOneList = (params) =>
  $post(
    `/opsapi/studentmanager/api/v1/student/manage/classroom/platform/manage/oneToOne/list`,
    params
  );

/**
 * 更新1v1课堂平台
 */
export const updateOneToOneList = (params) =>
  $put(
    `/opsapi/studentmanager/api/v1/student/manage/classroom/platform/manage/oneToOne/list/update/platform`,
    params
  );

/**
 * 获取小班课课堂平台列表
 */
export const getSmallClassList = (params) =>
  $post(
    `/opsapi/classmanage/api/v1/class/manage/small/class/info/by/ids`,
    params
  );

/**
 * 更新小班课课堂平台
 */
export const updateSmallClassList = (params) =>
  $put(
    `/opsapi/classmanage/api/v1/class/manage/small/class/update/virtual-class-type`,
    params
  );

/**
 * 获取平台日志
 */
export const getJournal = (params) =>
  $get(
    `/opsapi/studentmanager/api/v1/student/manage/classroom/platform/manage/log/list`,
    params
  );

/**
 * 删除家长账号列表
 */
export const reqDeleteParentAccountList = async (parentUserId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/coppa/parent/apply/list/${parentUserId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
  return {
    status: 200,
    data: {
      code: 200,
      data: {
        list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        total: 64,
      },
    },
  };
};

/**
 * 删除家长账号
 */
export const reqDeleteParentAccount = async (parentUserId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/coppa/delete/account`,
    { userId: parentUserId }
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 撤销删除
 */
export const reqCancelDeleteParentAccount = async (applyId) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/studentmanager/api/v1/student/manage/coppa/parent/apply/del/cancel/${applyId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**全量部门 */
export const getAllpost = function () {
  return $get(
    "/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/post_user/all"
  );
};

/**
 * 岗位关联角色
 */
export const jobRelatingRole = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/post/role/relating`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取岗位已关联角色
 */
export const getRoleListbyJob = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/post/role/list/by/post_id`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**移除拒绝切换版本白名单 */
export const removeSwitchPkgWhite = (id) => {
  return $delete(
    `/opsapi/classmanage/api/v1/class/manage/white/schedule/learning/plan/${id}`
  );
};

/**拒绝切换版本白名单列表 */
export const getChangePkgWhiteList = (pageNum, pageSize, params) => {
  return $get(
    `/opsapi/classmanage/api/v1/class/manage/white/schedule/learning/plan/list/${pageNum}/${pageSize}`,
    params
  );
};

/**获取学生课包列表 */
export const getCoursePkgListUnderStudent = (params) => {
  return $get(
    "/opsapi/classmanage/api/v1/class/manage/student/course-package/list",
    params
  );
};

/**添加拒切白名单 */
export const addRefuseSwitchWhiteUser = (params) => {
  return $post(
    `/opsapi/classmanage/api/v1/class/manage/white/schedule/learning/plan/ops`,
    params
  );
};

/**
 * 查询家长id
 */
export const reqParentIDByUserNameOrPhone = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/studentmanager/api/v1/student/manage/parent/get/parent/id/by/username/or/phone`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据id查询ops用户详情
 */
export const reqOpsUserInfo = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/manage/user/detail/${id}`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 创建/更新ops用户信息上次预签名 */
export const reqUserCenterUploadSign = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/ops/s3/upload/sign`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取APP版本信息列表
 */
export const reqAppVersionUpgradeList = async (pageNum, pageSize) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/app/version/upgrade/get/list`, {
    pageNum,
    pageSize,
  });
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取APP版本信息列表
 */
export const reqAppHistoryVersionList = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/app/version/upgrade/get/history/version/list`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 添加/更新APP版本信息
 */
export const reqAddOrUpdateAppVersion = async (param) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/app/version/upgrade/add/or/update`,
    param
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 视频回放有效期列表
 */
export const reqVideoExpireWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/operations/api/v1/pub/operations/video/expire/white/list/get/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 添加视频回放有效期白名单列表
 */
export const batchAddWhiteListForVideoExpire = async (params) => {
  const res = await $post(
    `/opsapi/operations/api/v1/pub/operations/video/expire/white/list/add`,
    params
  );
  return res.data;
};
/**
 * 删除视频回放有效期白名单列表
 */
export const deleteWhiteList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/video/expire/white/list/remove`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 判定是否需要选择代管人
 */
export const reqCandimission = async (userId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/candimission`,
    { userId: userId }
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 可以做代理人的用户列表
 */
export const reqUserListByidentity = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/list/by/identity`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取离职人员正在代管的员工
 */
export const reqListOfCustodians = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/getagentingbyagentid`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 全部员工操作离职的新接口
 */
export const reqHandleUserDimission = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/dimission/v2`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 重新指定代管人
 */
export const reqChangeAgent = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/dimission/v2/agent`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 待离职员工操作离职的新接口v3
 */
export const reqHandleUserDimissionV3 = async (userId) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/user/dimission/v3?userId=${userId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
