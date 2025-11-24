import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();
/**获取执行任务的状态 */
export const getTaskImplementStatus = () => {
  return $get("/opsapi/pubmessagecenter/opsapi/stat/statuslist");
};

/**业务列表 */
export const getApplicationList = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/pubmessagecenter/opsapi/task/getApplicationUIData`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data || [];
};

/**
 * 获取tag list
 */
export const getTagList = (taskId, businessId) => {
  return $get("/opsapi/pubmessagecenter/opsapi/task/getTagUIData", {
    taskId,
    businessId,
  });
};

/**
 * 获取渠道下模板
 */
export const getTemplatebyChannel = function ({
  channelId,
  filterId,
  tagId,
  taskId,
}) {
  const params = { channelId, filterId, tagId };
  if (taskId) {
    Object.assign(params, { taskId });
  }
  return $get("/opsapi/pubmessagecenter/opsapi/task/getTemplateList", params);
};

/**
 * 保存消息
 *1,*/
export const saveMessage = (params) => {
  return $post(`/opsapi/pubmessagecenter/opsapi/task/save`, params);
};

/**消息详情 */
export const getMessageDetail = (id) => {
  return $get(`/opsapi/pubmessagecenter/opsapi/task/get/${id}`);
};

// 任务列表
export const getTaskList = async (pageNum, pageSize, params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/pubmessagecenter/opsapi/task/list/${pageNum}/${pageSize}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 *
 * 操作记录
 */
export const getOptLogList = (taskId) => {
  return $get(`/opsapi/pubmessagecenter/opsapi/task/operation/list/${taskId}`);
};

/**
 *
 * @param {*} taskId
 * @param {*} params  {channelId, startTime, endTime, innerTime}
 * @returns
 */
export const getDataList = (taskId, pageNum, pageSize, params) => {
  return $get(
    `/opsapi/pubmessagecenter/opsapi/stat/list/${taskId}/${pageNum}/${pageSize}`,
    params
  );
};

/**获取发送记录
 * @param {*} params taskId channelId  historyId  searchTime
 */
export const getSendUserDataList = (pageNum, pageSize, params) => {
  return $get(
    `/opsapi/pubmessagecenter/opsapi/stat/detail/v1/${pageNum}/${pageSize}`,
    params
  );
};

// 审核任务
export const auditTask = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/pubmessagecenter/opsapi/task/examine`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 获取通知方式
export const getChannelUIData = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/pubmessagecenter/opsapi/task/getChannelUIData`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 上传目标用户
export const uploadFile = (params) => {
  return $post(`/opsapi/pubmessagecenter/opsapi/task/add/import`, params);
};

// 获取目标用户类型
export const gerTargetUserTypes = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/pubmessagecenter/opsapi/task/getAllBusiness`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 获取基本任务信息和目标用户
export const getBasicInfoAndTargetUser = (id, applicationId) => {
  return $get(`/opsapi/pubmessagecenter/opsapi/task/getBasicUIDataById`, {
    id,
    applicationId,
  });
};

// 获取任务的filter
export const getTaskFilter = (id, businessId) => {
  return $get("/opsapi/pubmessagecenter/opsapi/task/getFilterUIDataById", {
    id,
    businessId,
  });
};

// 国际化字典
export const getLanguageList = () => {
  return $get("/opsapi/pubmessagecenter/opsapi/task/ui/translate/list");
};

//红名单列表
export const getRedList = (pageNum, pageSize, params) => {
  return $get(
    `/opsapi/pubmessagecenter/opsapi/task/red/list/${pageNum}/${pageSize}`,
    params
  );
};

//添加红名单
export const addRedItem = (params) => {
  return $post("/opsapi/pubmessagecenter/opsapi/task/red/save", params);
};

//修改红名单状态
export const changeRedStatus = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/pubmessagecenter/opsapi/task/red/updateStatus`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
// 获取任务
export const getTaskListForRedUSer = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/pubmessagecenter/opsapi/task/red/taskList`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

export const getMsgTypes = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/pubmessagecenter/opsapi/task/msgTypeUIList`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// 发送测试消息
export const testSendMsg2User = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/pubmessagecenter/opsapi/task/simulate`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
}

// 获取条件消息列表
export const getTaskAllList = async (pageNum, pageSize, params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/pubmessagecenter/opsapi/stat/detail/v1/${pageNum}/${pageSize}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
}
