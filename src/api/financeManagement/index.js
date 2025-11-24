import GetData from "@/utils/axios.js";

const { $get, $post, $put, $delete } = new GetData();

/**
 * 充值明细
 * @param {Object} params 参数对象，包括：
 *        month_query         {String} 日期
 *        start_time          {String} 时间段
 *        cms_user_id         {String} 学管或者课程顾问id
 */
export const managerRecharge = function (params) {
  return $get("/opsapi/finance/recharge/list/", params);
};

/**
 * 课消明细
 * @param {Object} params 参数对象，包括：
 *        month_query         {String} 日期
 *        start_time          {String} 时间段
 *        cms_user_id         {String} 学管或者课程顾问id
 */
// export const attendClassInfo = function(params) {
//   return $get('/attendclassinfo/', params)
// }
export const attendClassInfo = function (params) {
  return $get("/opsapi/finance/attendClassInfo/list/", params);
};

/**
 * 统计新老学生课消
 * @param {Object} params 参数对象，包括：
 *        month_query         {String} 日期
 *        start_time          {String} 时间段
 *        cms_user_id         {String} 学管或者课程顾问id
 */
// export const managerAdhoc = function(params) {
//   return $get('/statistic/ad_hoc/', params)
// }
export const managerAdhoc = function (params) {
  return $get("/opsapi/finance/attendClassInfo/statistic/", params);
};

/**
 * 统计新学生老学生充值
 * @param {Object} params 参数对象，包括：
 *        month_query         {String} 日期
 *        start_time          {String} 时间段
 *        cms_user_id         {String} 学管或者课程顾问id
 */
export const attendRecharge = function (params) {
  // return $get('/statistic/recharge/', params)
  return $get("/opsapi/finance/recharge/statistic/", params);
};

/**
 * 订单列表表格数据
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *      @param {Date} endTime 结束时间
 *      @param {Date} startTume 开始时间
 *      @param {String} parentUsername 家长用户名
 *      @param {Int} orderStatus 订单支付状态：0-待支付；1-已支付；2-支付失败；3-退款；4-退回取消
 *      @param {Int} opsUserId 学管、顾问的用户id
 */
export const orderList = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/opsorder/orderQuery/byConditions/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 获取订单详情
 * @param {Int} orderId 订单Id
 */
export const getOrderDetailData = function (orderId) {
  return $get(`/opsapi/opsorder/queryOpsOrderDetailById`, { orderId });
};

/**
 * 获取人工课时列表查询
 * @param {Int} userId 登录人标识
 * @param {Int} type 类型
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getClassHourList = function (
  userId,
  type,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/finance/classHour/list/${userId}/${type}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 查询某部门的原因列表
 * @param {Int} userId 登录人标识
 */
export const searchReasonList = async (userId, params) => {
  const result = await $get(
    `/opsapi/finance/classHour/reasonList/${userId}`,
    params
  );
  result.data.data = result.data.data ?? [];
  return result;
};

/**
 * 单个添加课时
 * @param {Object} params 参数对象
 *         @param {Int} accountClass 课程类型 （1：标准课时，2：定向课时）
 *         @param {Int} amount 申请课时数
 *         @param {String} parentUserName 家长账号
 *         @param {String} reasonDetail 赠课原因详情
 *         @param {Int} reasonId 赠课原因（人工课时原因表主键）
 *         @param {Int} userId 登录人标识
 */
export const financeAddClassHour = function (params) {
  return $post(`/opsapi/finance/classHour/add`, params);
};

/**
 * 批量添加课时
 * @param {Object} params 参数对象
 *         @param {Int} accountClass 课程类型 （1：标准课时，2：定向课时）
 *         @param {Array} importData 批量信息
 *         @param {Int} reasonId 赠课原因（人工课时原因表主键）
 *         @param {Int} userId 登录人标识
 */
export const financeAddMoreClassHour = function (params) {
  return $post(`/opsapi/finance/classHour/batchAdd`, params);
};

/**
 * 获取人工课时的订单列表
 */
export const getHandlerByHumanClassHourList = function (
  userId,
  type,
  pageNum,
  pageSize,
  params
) {
  return $get(
    `/opsapi/finance/classHour/list/${userId}/${type}/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 手动添加订单
 * @param {Object} params 参数对象
 */
export const manualAddOrder = function (params) {
  return $post(`/opsapi/trading/center/manual/order/create`, params);
};

/**
 * 录入人工订单付款信息
 * @param manualOrderId 手动订单标识
 * @param params 手动订单付款信息
 */
export const manualPaymentOrderInfo = function (manualOrderId, params) {
  return $put(
    `/opsapi/trading/center/manual/order/payment/info/${manualOrderId}`,
    params
  );
};

/**
 * 审核人工订单
 * @param params 参数对象
 * @param examineStatus 审核状态 2驳回 3通过
 * @param manualOrderId 订单标识
 * @param remark 描述
 * @returns {*}
 */
export const examineManualPaymentOrder = function (params) {
  return $put(`/opsapi/trading/center/manual/order/examine`, params);
};

/**
 * 获取币种列表接口
 */
export const getCurrencyList = function () {
  return $get(`/opsapi/opsorder/currency/list`);
};

/**
 * 获取人工订单列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getManualOrderList = function (pageNum, pageSize, params) {
  return $get(`/opsapi/opsorder/manual/list/${pageNum}/${pageSize}`, params);
};

/**
 * 获取人工订单详情
 * @param {Int} manualOrderId 人工订单标识
 */
export const getMuanalOrderDetail = function (manualOrderId) {
  return $get(`/opsapi/opsorder/manual/list/${manualOrderId}`);
};

/**
 * 获取产品列表
 */
export const getProductList = function () {
  return $get(`/opsapi/opsorder/product/list`);
};

/**
 * 获取sku列表
 */
export const getSKUList = function (spuId, params = {}) {
  return $get(`/opsapi/opsorder/sku/list/${spuId}`, params);
};

/**
 * 校验⽤户名是否存在
 * @param {String} userIdentify 家长用户名
 */
export const checkParentUser = function (userIdentify) {
  return $get(`/opsapi/user/checkUserIdentify/1`, { userIdentify });
};

/**
 * 查询账号课时明细
 * @param {|Int} parentUserId 家长id
 */
export const getParentProductDetail = function (parentUserId) {
  return $get(`/opsapi/product/purchased/list/${parentUserId}`);
};

// ----------------------消费税相关----------------
/**
 * 修改订单消费税
 * @param {Int} orderId 订单Id
 * @param {Object} params 参数对象
 *      @param {Int} taxRateId 消费税率Id
 */
export const changeTheOrderGST = function (orderId, params) {
  return $put(`/opsapi/opsorder/taxrate/${orderId}`, params);
};

/**
 * 获取订单收据信息
 * @param orderId 订单id
 * @returns {*}
 */
export const getOrdersInvoiceInfo = function (orderId) {
  return $get(`/opsapi/opsorder/receipt/${orderId}`);
};

/**
 * 更新订单收据信息
 * @param receiptId
 * @param params
 * @returns {*}
 */
export const updateOrderInvoiceInfo = function (receiptId, params) {
  return $put(`/opsapi/opsorder/receipt/${receiptId}`, params);
};

/**
 * 发送订单收据邮件
 * @param receiptId
 * @returns {*}
 */
export const sendTheEmailOrderInvoice = function (receiptId) {
  return $post(`/opsapi/opsorder/receipt/send/${receiptId}`);
};

// 财务中台
/**
 * 未对账支付流水分页查询
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @returns {*}
 */
export const getPaymentReconciliation = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/finance/reconciliation/payment/undo/page/${pageNum}/${pageSize}`,
    params
  );
};
/**
 * 支付流水详情
 * @param {Int} channelLogId 支付通道id
 * @returns {*}
 */
export const getPaymentDetail = function (paymentLogSyncId) {
  return $get(
    `/opsapi/finance/reconciliation/payment/detail/${paymentLogSyncId}`
  );
};

/**
 * 未对账 订单分页查询
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @returns {*}
 */
export const getOrderReconciliation = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/finance/reconciliation/order/undo/page/${pageNum}/${pageSize}`,
    params
  );
};

/**
 * 订单详情
 * @param {Int} orderSyncId 订单id
 * @returns {*}
 */
export const getOrderDetail = function (orderSyncId) {
  return $get(`/opsapi/finance/reconciliation/order/detail/${orderSyncId}`);
};

/**
 * 手动对账
 * @param {Int} orderSyncId 订单id
 * @param {Int} paymentLogSyncId 支付流水id
 * @returns {*}
 */
export const businessArtificial = function (params) {
  return $post(`/opsapi/finance/reconciliation/business/artificial`, params);
};

/**
 * 对账分页查询  核对记录
 */
export const checkRecord = function (pageNum, pageSize, params) {
  return $get(
    `/opsapi/finance/reconciliation/business/done/page/${pageNum}/${pageSize}`,
    params
  );
};
/**
 * 获取对账详情信息
 * @param reconciliationId 对账id
 * @returns {*}
 */
export const getBusinessDetail = function (reconciliationId) {
  return $get(
    `/opsapi/finance/reconciliation/business/detail/${reconciliationId}`
  );
};
/**
 * 业务对账
 * @param {Int} paymentLogId 订单id
 * @returns {*}
 */
export const businessOrder = function (params) {
  return $post(
    `/opsapi/finance/reconciliation/business/artificial/order`,
    params
  );
};

/**
 * 手动修改订单数据
 */
export const orderArtificial = function (orderSyncId, params) {
  return $put(
    `/opsapi/finance/reconciliation/order/artificial/${orderSyncId}`,
    params
  );
};

/**
 * 银行对账
 */
export const businessArtificialpaymentlog = function (params) {
  return $post(
    `/opsapi/finance/reconciliation/business/artificial/paymentlog`,
    params
  );
};

// 财务中台
export const getCostTypeList = () =>
  $get(`/opsapi/accountcenter/api/v1/pub/account/finance/cost/type`);

export const getCostList = () =>
  $get(`/opsapi/accountcenter/api/v1/pub/account/finance/cost/list`);

export const addCost = (param) =>
  $post(`/opsapi/accountcenter/api/v1/pub/account/finance/cost`, param);

export const getCostByPid = (param) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/finance/cost/query/cost/by/pid`,
    param
  );

export const addCoinReason = (param) =>
  $post(`/opsapi/accountcenter/api/v1/pub/account/finance/reason/coin`, param);

export const getCoinReasonList = ({ pageNum, pageSize, ...rest }) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/finance/reason/coin/list/${pageNum}/${pageSize}`,
    rest
  );

export const updateCoinReasonStatus = (param) =>
  $put(
    `/opsapi/accountcenter/api/v1/pub/account/finance/reason/coin/update/status/by/id`,
    param
  );

export const addPointReason = (param) =>
  $post(`/opsapi/accountcenter/api/v1/pub/account/finance/reason/point`, param);

export const getPoinReasonList = ({ pageNum, pageSize, ...rest }) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/finance/reason/point/list/${pageNum}/${pageSize}`,
    rest
  );

export const updatePoinReasonStatus = (param) =>
  $put(
    `/opsapi/accountcenter/api/v1/pub/account/finance/reason/point/update/status/by/id`,
    param
  );

// 查询家长积分账户余额详情列表
export const getParentCoinBalance = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/coin/parent/balance/list`,
    params
  );

// 扣减家长下积分
export const removeParentCoinBalance = (params) =>
  $put(
    `/opsapi/accountcenter/api/v1/pub/account/coin/remove/coin/balance/parent`,
    params
  );

// 积分 - 用户列表
export const getCoinUser = (params) =>
  $post(
    `/opsapi/accountcenter/api/v1/pub/account/finance/reason/coin/change/log/list`,
    params
  );

// 获取课时类型
export const getClassHoursTypeList = () =>
  $get("/opsapi/accountcenter/api/v1/pub/account/account/class/hour/type");

// 扣减课时日志
export const getDeductionSessionLog = (params) =>
  $post("/opsapi/accountcenter/api/v1/pub/account/account/list/v2", params);

// 扣减相关用户课时
export const removeParentClassHoursBalance = (params) =>
  $put(
    `/opsapi/accountcenter/api/v1/pub/account/account/update/deduction/class`,
    params
  );

// 获取课时详情
// 接口暂时不用(扣减课时)
export const getParentClassHoursBalance = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/deduction/class/details`,
    params
  );

// 根据家长积分获取产品类型
// 接口暂时不用(扣减课时)
export const getProductTypeByUserName = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/product/name/parent/id`,
    params
  );

// 根据家长账号查询学生列表
export const getStudentListByParentAccount = (parentUserName) =>
  $get(`/opsapi/studentcenter/api/v1/pub/studentcenter/parent/student/list`, {
    parentUserName,
  });

// 根据家长id查询学生列表
export const getStudentListByParentId = (params) =>
  $get(
    `/opsapi/studentcenter/api/v1/pub/studentcenter/user/student/info/user/student/list/by/parent/status`,
    params
  );

// 根据家长id学生id查询产品列表
export const getProductTypeListById = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/product/name/parent/id/v1`,
    params
  );

// 获取课时详情
export const getClassHoursBalanceById = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/deduction/class/details/v2`,
    params
  );

// 根据课程类型,学科,上课形态查询spu
export const getSPUOptionLits = (params) =>
  $get(`/opsapi/opsorder/spu/list`, params);

// 查询订单信息和账户余额
export const getOrderRefund = (params) =>
  $get(`/opsapi/trading/center/order/refund/accounts_balance`, params);

// 获取课时详情
export const getClassDetails = (params) =>
  $get(
    `/opsapi/accountcenter/api/v1/pub/account/account/deduction/class/details/v3`,
    params
  );

// 计算退款金额
export const getCalculation = (params) =>
  $get(`/opsapi/trading/center/order/refund/calculation`, params);

// 确认退款
export const confirmFefund = (params) =>
  $post(`/opsapi/trading/center/order/refund/confirm`, params);

// 退款详情
export const fefundDetail = (params) =>
  $get(`/opsapi/trading/center/order/refund/detail`, params);

// 查询订阅卡列表
export const getSubscribeList = (params) =>
  $post(`/opsapi/trading/center/subscribe/select/list`, params);

// 订阅调整扣款日
export const updateTrialEnd = (params) =>
  $post(`/opsapi/trading/center/subscribe/update/trial/end`, params);

// 取消订阅
export const cancelSubscribe = (params) =>
  $post(`/opsapi/trading/center/subscribe/cancel`, params);

// 订阅卡操作记录
export const subscribeLogList = (params) =>
  $get(`/opsapi/trading/center/subscribe/log/list`, params);
// 根据spuid查询sku列表-代下单
export const getSKUListBySPU = (params) =>
  $get(`/opsapi/trading/center/substitute/place/order/onsale/list`, params);

// 根据spuid查询sku列表-人工订单
export const getSKUListBySPUManual = (params) =>
  $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/detail/onsale/list`,
    params
  );
// 支付渠道下拉数据
export const getChannelList = () =>
  $get(`/opsapi/operations/api/v1/pub/operations/payment/channel/list`);

/**
 * 实收金额计算
 */
export const getCalculateAmount = (params) =>
  $post(`/opsapi/trading/center/manual/order/calculate/amount`, params);

// 汇率详情列表
export const getRateListAll = () =>
  $get(
    `/opsapi/operations/api/v1/pub/operations/common/exchange/rate/list/all`
  );

// 对账页面修正Payment ID
export const updateReference = (params) =>
  $post(`/opsapi/finance/reconciliation/business/update/reference`, params);

// 重新生成;
export const regenerateReceipt = async (params) => {
  console.log(params);
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/receipt/save`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return true;
};

/**凭证列表
 *  @params type, journalLineExternalReferenceld, worktagBusiessUnitId, uploadStatus, pageNum, pageSize
 */
export const getRevenueVoucherList = (params) => {
  return $get(`/opsapi/finance/reconciliation/collection/voucher/list`, params);
};

/**推送凭证
 * @param ids: journalLineExternalReferenceId List
 */
export const pushRevenuwVoucher = (ids) => {
  return $post(
    `/opsapi/finance/reconciliation/collection/voucher/push/workday`,
    { journalLineExternalReferenceIdList: ids }
  );
};

/**下载凭证 */
export const downloadRevenuwVoucher = (ids) => {
  return $post(
    `/opsapi/finance/reconciliation/collection/voucher/download/voucher`,
    { journalLineExternalReferenceIdList: ids }
  );
};

/**下载明细 */
export const downloadRevenuwVoucherDetail = () => {
  return Promise.resolve({
    status: 200,
    data: {
      code: 200,
      data: {},
    },
  });
  return $post(``);
};
/* 新增/编辑sku */
export const handelSkuData = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/operations/api/v1/pub/operations/course/product/detail/modify`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查看sku详情 */
export const reqSkuData = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/detail/price`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 删除sku */
export const reqDeleteSku = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/detail/delete/sku`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/* 移动sku */
export const reqRemoveSku = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/operations/api/v1/pub/operations/course/product/detail/sort`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取spu名称列表 */
export const reqSpuFilterList = async () => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/select/all/spu/name`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取学生所有优惠券列表  */
export const getAllCoupon = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/substitute/place/order/coupon/code/product`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 确认订单信息-订单预览  */
export const getOrderBilling = async (parentUserId, params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/order/recharge/billing/info/${parentUserId}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/* 创建订单  */
export const reqCreateOrder = async (parentUserId, params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/order/recharge/order/${parentUserId}`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 取消订单 */
export const reqCancelOrder = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/substitute/place/order/cancel`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 判断是否是家长下的学管或者cc或者是交易管理员角色 */
export const checkPermission = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/substitute/place/order/check/student`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 添加优惠码 */
export const checkCouponCode = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/finance/tax/rate/coupon/code`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 作废对账订单/流水 */
export const reqNullifyOrderOrPayment = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/finance/reconciliation/business/nullify/order/payment`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取支付路由方案列表 */
export const reqPaymentRoutingList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/payment/program/list`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 创建支付路由方案 */
export const reqCreateProgram = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/payment/routing/manage/payment/program/create`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 更新支付路由方案 */
export const reqUpdateProgram = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/trading/center/payment/routing/manage/payment/program/update`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 发布支付路由方案 */
export const reqPublishProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/trading/center/payment/routing/manage/payment/program/publish/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 取消发布支付路由方案 */
export const reqCancelPublishProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/trading/center/payment/routing/manage/payment/program/cancel/publish/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 复制支付路由方案 */
export const reqCopyProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/payment/routing/manage/payment/program/copy/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 删除支付路由方案 */
export const reqDeleteProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $delete(
    `/opsapi/trading/center/payment/routing/manage/payment/program/delete/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 支付路由方案详情 */
export const reqProgramInfo = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/payment/program/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 检查是否有其他发布的方案 */
export const reqCheckSameProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/payment/program/check/same/publish/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 检查删除方案是否有其他方案 */
export const reqCheckDeleProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/payment/program/check/same/notDelete/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 取全部支付方式及包含渠道 */
export const reqAllPayMethodAndChannel = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/pay/method/channel/all`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询指定支付方案的规则列表 */
export const reqRulesOfProgram = async (programId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/list/${programId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 添加支付路由规则 */
export const reqAddRulesOfProgram = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/add`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 获取规则详情 */
export const reqRulesInfo = async (rulesId) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/${rulesId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 更新规则详情 */
export const reqUpdateRules = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/update`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 支付路由规则排序 */
export const reqSortRules = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/sort`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 删除支付路由规则 */
export const reqDeleteProgramRules = async (rulesId) => {
  const {
    status,
    data: { code, data },
  } = await $delete(
    `/opsapi/trading/center/payment/routing/manage/pay/routing/payment/rules/delete/${rulesId}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商城图片上传预签名
 */
export const reqPointsMallUploadSign = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/s3/upload/sign`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商品编辑
 */
export const reqUpdatePointsProduct = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/coin/product/update`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商品新建
 */
export const reqAddPointsProduct = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/coin/product/add`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商品上下架处理
 */
export const reqUpdatePointsProductStatus = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/coin/product/update/status`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商品移除
 */
export const reqDeletePointsProduct = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $put(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/delete/package/${id}`
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 积分商品排序
 */
export const reqSortPointsProduct = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/accountcenter/api/v1/pub/account/coin/consume/product/ops/coin/product/sort`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取支付费率列表
 */
export const reqPaymentFeeList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/payment/fee/get/list`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/**
 * 编辑费率
 */
export const reqUpdatePaymentFee = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/trading/center/payment/fee/update`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 获取消费税
 */
export const reqProcessingFee = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/manual/order/get/processing/fee`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 售卖规则列表
 */
export const reqSaleRuleList = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/trading/center/sale/rule/list`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 开始或结束规则
 */
export const reqSaleRuleStartOrEnd = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/sale/rule/start/or/end`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 删除售卖规则
 */
export const reqSaleRuledelete = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/sale/rule/delete`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 新建售卖规则
 */
export const reqSaleRuleCreated = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/trading/center/sale/rule/add`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据ID查询售卖规则详情
 */
export const reqSaleRuleDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/sale/rule/detail`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据ID查询售卖规则详情
 */
export const reqSaleRuleEdit = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(`/opsapi/trading/center/sale/rule/edit`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据订单号获取路由规则和支付方式
 */
export const reqPayRuleAndPayMethod = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/trading/center/common/exchange/rate/rule/and/pay/method`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 根据订单号获取路由规则和支付方式
 */
export const reqAccountCode = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/trading/center/order/pay/order/create/payment`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 查询所有课包的映射关系
 */
export const reqAllPackageMapping = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/operations/api/v1/pub/operations/course/product/select/all/package/mapping`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改特殊比例
 */
export const reqUpdateSpecialSale = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/operations/api/v1/pub/operations/course/product/update/special/sale`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改spu是否商城显示
 */
export const reqUpdateSPUIsShow = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/update/isShow`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改spu是否上架
 */
export const reqUpdateSPUStatus = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/operations/api/v1/pub/operations/course/product/update/status`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 人工课时增加有效期
 */
export const reqAccountExpiresAt = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/student/account/getExpiresAt`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
/**
 * 订单升舱回显数据接口查询
 */
export const reqUpgradeOrderDetail = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/trading/center/order/upgrade/order`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};
