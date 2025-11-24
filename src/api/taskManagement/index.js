import GetData from "@/utils/axios.js";
const { $get, $post, $put, $delete } = new GetData();

/**
 * 获取字段库列表
 * @param {Object} param 参数对象
 *  formItemName   字段名字
 *  sort  排序 asc-升序 desc-降序
 */
export const reqPublicFieldList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/form/item/manage/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 添加公共库字段
 * @param {Object} param 参数对象
 *  formItemName   字段名字
 *  sort  排序 asc-升序 desc-降序
 */
export const reqAddPublicField = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/form/item/manage/add`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取字段信息
 * @param {Object} param 参数对象
 *  itemId   字段id
 */
export const reqPublicFieldInfo = async (itemId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/form/item/manage/info/${itemId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 字段管理接口
 * @param {Object} param 参数对象
 *  id   字段id
 *  itemNameMap
 *  itemType
 *  itemValueList
 */
export const updatePublicFieldInfo = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/form/item/manage/update`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取模板列表
 * @param {Object} param 参数对象
 */
export const reqTaskTemplateList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/list/template`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 添加模板
 * @param {Object} param 参数对象
 */
export const reqSubmitAddTemplate = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/add/template`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取模板详情
 * @param {Object} param 参数对象
 */
export const reqTemplateInfo = async (templateId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/template/info/${templateId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 启用/禁用模板
 * @param {Object} param 参数对象
 */
export const reqTaskTemplateEnable = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/update/template/enable`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 更新模板
 * @param {Object} param 参数对象
 */
export const reqUpdateTemplate = async (templateId, params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/update/template/${templateId}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 作废(删除)模板
 * @param {Object} param 参数对象
 */
export const reqDeleteTaskTemplate = async (templateId) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/conselormanager/api/v1/counselor/manage/template/manage/delete/template/${templateId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取我的任务列表
 * @param {Object} param 参数对象
 */
export const reqMyTaskList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取指定任务的follow表单
 * @param {Object} param 参数对象
 */
export const reqTaskForm = async (taskId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/follow/form/${taskId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/**
 * 获取指定任务的follow表单
 * @param {Object} param 参数对象
 */
export const reqSopParentAndStudentInfo = async (taskId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/student/${taskId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取学生行为数据
 */
export const reqSopStudentBehaviorData = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/student/behavior/data`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取预签名
 */
export const reqSopUploadSign = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/upload/file/s3/upload/sign`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取学管与家长微信绑定关系
 */
export const reqParentExternalUserId = async (parentUserId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/contact/record/wechat/list/${parentUserId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取与用户的联系记录
 */
export const reqThirdPartyRecord = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/contact/record/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 处理任务
 */
export const reqSubmitTask = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/processing/task`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取指定任务的任务详情记录
 */
export const reqCompletedTaskResult = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/completed/result`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取指定用户的已完成记录
 */
export const reqUserCompletedTaskResult = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/completed/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取指定用户的外呼记录
 */
export const reqUserCallResult = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/contact/record/call/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 通过学管账号动态获取学管
 */
export const reqLaListByAccount = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/usercenter-service/api/v1/pub/usercenter/manage/user/dynamic/search/users`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};


/* 检查ops用户是否绑定了平台账号 */
export const reqCheckOPSUserBinding = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/contact/record/check/platform/account/binding`,params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 动态查询任务模板类型
 */
export const reqTaskNameOptions = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/dynamic/search/task/type/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 任务类型分组数据
 */
export const reqTaskTypeGroup= async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/task/type/group/data`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 按照单一任务类型下载任务数据
 */
export const reqDownloadTaskDate= async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/my/sop/download/task/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取教师的任务列表
 * @param {Object} param 参数对象
 */
export const reqTeacherTaskList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/tutor/sop/task/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 教师任务类型分组数据
 */
export const reqTeacherTaskTypeGroup= async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/tutor/sop/task/type/group/data`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 按照单一任务类型下载老师任务数据
 */
export const reqDownloadTeacherTaskDate= async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/conselormanager/api/v1/counselor/manage/tutor/sop/download/task/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取用户设备检测最新数据
 */
export const reqUserLastDeviceCheckResult = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/liveroom/noncore/api/v1/non-core/device/detection/last/result`,
    params
  );
  if (status !== 200 || code !== 0) return Promise.reject();
  return data;
};

/**
 * 获取设备检测完成记录
 */
export const reqUserDeviceCheckResult = async (params) => {
  let {
    status,
    data,
  } = await $get(
    `/opsapi/liveroom/noncore/api/v1/non-core/device/detection/info/list`,
    params
  );
  if (status !== 200) return Promise.reject();
  return data;
};