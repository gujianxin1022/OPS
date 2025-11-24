import GetData from "@/utils/axios.js";

const { $get, $post, $put, $delete } = new GetData();

/**
 * 家长积分-首页-数据概况
 */
export const getCoinDataOverview = function () {
  return $get(`/opsapi/coin/data/overview`);
};

/**
 * 积分发放-基本任务列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getCoinBaseTask = function (pageNum, pageSize) {
  return $get(`/opsapi/coin/base/task/page/${pageNum}/${pageSize}`);
};

/**
 * 积分发放-基本任务列表-设置-充值赠送
 */
export const putCoinBaseTask = function (params) {
  return $post(`/opsapi/coin/base/task`, params);
};

/**
 * 积分消耗列表
 */
export const getCoinConsume = function (pageNum, pageSize) {
  return $get(`/opsapi/coin/consume/page/${pageNum}/${pageSize}`);
};

/**
 * 积分消耗 - 移除
 */
export const removeCoinConsume = function (id) {
  return $delete(`/opsapi/coin/consume/${id}`);
};

/**
 * 积分消耗 - 设置任务状态
 */
export const putCoinConsumeStatus = function (id, status) {
  return $put(`/opsapi/coin/consume/status/${id}/${status}`);
};

/**
 * 积分兑换 - 适用商品列表
 */
export const getCoinConvert = function (consumeType, pageNum, pageSize) {
  return $get(
    `/opsapi/coin/convert/page/${consumeType}/${pageNum}/${pageSize}`
  );
};

export const getPointsMallProductList = async (pageNum, pageSize) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/coin/product/page/list`,
    { pageNum, pageSize }
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分 - 用户列表 - 申请原因
 */
export const getCoinClassReason = function () {
  return $get(`/opsapi/coin/class/reason`);
};

/**
 * 积分 - 用户列表 - 单个奖励积分
 */
export const postCoinUserRewardCoin = function (isSize, params) {
  return $post(`/opsapi/coin/user/reward/coin/${isSize}`, params);
};

/**
 * 积分 - 用户列表 - 批量奖励积分
 */
export const postCoinUserBatchRewardCoin = function (isSize, params) {
  return $post(`/opsapi/coin/user/batch/reward/coin/${isSize}`, params);
};

/**
 * 积分 - 积分兑换 - 顺序移动
 */
export const putCoinProductSort = function (firstId, nextId) {
  return $put(`/opsapi/coin/product/sort/${firstId}/${nextId}`);
};

/**
 * 获取家长积分收入
 * @param {Int} parentId 家长id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getParentGiveList = function (parentId, pageNum, pageSize) {
  return $get(`/opsapi/coin/parent/give/${parentId}/${pageNum}/${pageSize}`);
};

/**
 * 获取家长积分支出
 * @param {Int} parentId 家长id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getParentPayList = function (parentId, pageNum, pageSize) {
  return $get(`/opsapi/coin/parent/pay/${parentId}/${pageNum}/${pageSize}`);
};

/**
 * 获取家长积分过期
 * @param {Int} parentId 家长id
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getParentExpireList = function (parentId, pageNum, pageSize) {
  return $get(`/opsapi/coin/parent/expire/${parentId}/${pageNum}/${pageSize}`);
};

/**
 * 获取家长积分汇总
 * @param {Int} parentId 家长Id
 */
export const getParentCoinTotal = function (parentId) {
  return $get(`/opsapi/coin/parent/total/${parentId}`);
};

// 获取积分商品类目列表
export const getPointsMallCatalogList = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/accountcenter/api/v1/pub/account/product/catalog/list`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
