import GetData from "@/utils/axios.js";
const { $post, $get } = new GetData();

/**
 * ops-管理数据看板-企微继承进度记录数据
 */
export const getWechatExtendRecords = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    "/opsapi/conselormanager/api/v1/counselor/manage/wechat/extend/records",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 学管-数据看板-微信数据
 */
export const getWechatAddDataOverview = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/wechat/xg/data/board",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * ops-学管数据看板-微信添加情况明细
 */
export const getWechatAddDataList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    "/opsapi/conselormanager/api/v1/counselor/manage/wechat/xg/data/list",
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**分配统计列表 */
export const getAssignStatisticsList = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/log/rule/assign/distribution/statistics/api/list`,
    params
  );
};

/**
 * 首次分配记录列表
 */
export const getFirstAssignRecordList = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/rule/log/first/allocation/api/list`,
    params
  );
};

/**重新分配记录列表 */
export const getReAssignRecordList = (params) => {
  return $post(
    `/opsapi/studentmanager/api/v1/student/manage/log/distribution/assign/api/reassign/xg/log/list`,
    params
  );
};

/**分配快照 */
export const getAssignSnapshotList = (logFirstAllocationId) => {
  return $get(
    `/opsapi/studentmanager/api/v1/student/manage/rule/log/first/allocation/api/snapshot?logFirstAllocationId=${logFirstAllocationId}`
  );
};
