import GetData from "@/utils/axios.js";

const { $get, $post, $put } = new GetData();

/**
 * 操作明细列表  日志
 * @param {Object} params 参数列表
 */
export const getHandleList = async (pageNum, pageSize, params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/sys/log/actionlog/list/${pageNum}/${pageSize}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 约课/取消约课，关联课堂详情获取
 * @param {Object} params 参数列表
 */
export const getRelatedClassDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    "/opsapi/classmanage/api/v1/class/manage/student/time/table/batch/info/ids",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 约课日志课堂详情获取
 * @param {Object} params 参数列表
 */
export const reqOtoScheduleLogClassDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/sys/log/actionlog/oto/schedule/id",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 小班课取消课程，关联课堂详情获取
 * @param {Object} params 参数列表
 */
export const getRelatedSmallClassDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    "/opsapi/classmanage/api/v1/class/manage/small/class/batch/info/ids",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 老师批量调课日志课堂详情获取
 * @param {Object} params 参数列表
 */
export const reqOtoBatchAdjustmentLogClassDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/studentmanager/api/v1/student/manage/sys/log/actionlog/oto/adjust/id",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};