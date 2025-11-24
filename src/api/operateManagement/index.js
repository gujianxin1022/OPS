
import GetData from '@/utils/axios.js'

const { $get, $post, $put } = new GetData()


/**
 * 获取团列表
 * @param {Object} params 参数列表
 */
export const getGroupActivityList = function(params) {
  return $get(`/activity/group_activity/`, params)
}

/**
 * 获取用户
 * @param {Int} group_id 用户标识
 */
export const userActivityList = function(group_id) {
  return $get(`/opsapi/activity/small/groupRecharge`, {
    groupId: group_id
  })
}

/**
 * 小班拼团获取信息条详情
 */
export const getAllActivityInfo = function() {
  return $get(`/activity/group_activity/total_data/`)
}

//------------------------大班课活动-------------------------------


/**
 * 获取大班课活动列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 也尺寸
 * @param {Object} params 参数对象
 *         @param {String} activityName 活动中文名称
 *         @param {Int} status 活动状态 4未开始 5进行中 6暂停 7结束
 */
export const getBigClassActivityList = function( pageNum, pageSize, params ) {
  return $get(`/opsapi/activity/bigClass/all/${pageNum}/${pageSize}`, params)
}

/**
 * 获取大班课列表
 */
export const getBigClassList = function() {
  return $get(`/opsapi/activity/bigClass/class/list`)
}

/**
 * 获取大班课活动详情
 * @param {Int} activityBigClassId 大班课活动标识
 */
export const getBigClassDetails = function( activityBigClassId ) {
  return $get(`/opsapi/bigClass/info/${activityBigClassId}/activityType`)
}

/**
 * 创建大班课活动
 * @param {Object} params 参数对象
 *         @param {String} activityName 活动中文名称
 *         @param {String} activityNameEn 活动英文名称
 *         @param {Array} addClassIds	 添加关联大班课班级标识集合
 *         @param {Array} deleteClassIds 取消关联打扮班级标识集合
 *         @param {String} endTime 活动报名结束时间
 *         @param {String} startTime 活动报名开始时间
 *         @param {Int} status 活动状态 4未开始 5进行中 6暂停 7结束
 */
export const createBigClassActivity = function( params ) {
  return $post(`/opsapi/activity/bigClass/add`, params)
}

/**
 * 更新大班课活动
 * @param {Object} params 参数对象
 *         @param {Int} id 活动标识
 *         @param {String} activityName 活动中文名称
 *         @param {String} activityNameEn 活动英文名称
 *         @param {Array} addClassIds	 添加关联大班课班级标识集合
 *         @param {Array} deleteClassIds 取消关联打扮班级标识集合
 *         @param {String} endTime 活动报名结束时间
 *         @param {String} startTime 活动报名开始时间
 *         @param {Int} status 活动状态 4未开始 5进行中 6暂停 7结束
 */
export const updateBigClassActivity = function( params ) {
  return $put(`/opsapi/activity/bigClass/info/update`, params)
}

/**
 * 取消关联班级
 * @param {Int} activityId 活动id
 * @param {Int} classId 班级id
 * 
 */
export const cancelRelateClass = function(activityId, classId) {
  return $put(`/opsapi/activity/bigClass/cancel/relate/${activityId}/${classId}`)
}

/**
 * JAVA 获取大班课列表
 * @param {INt} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getBigGroupList = function( pageNum, pageSize, params ) {
  return $get(`/opsapi/bigClass/all/brief/${pageNum}/${pageSize}`, params )
}

/**
 * 获取统计信息
 */
export const getTotalDataJava = function() {
  return $get(`/opsapi/activity/small/totalData` )
}

export const getGroupActivityListJava = function( pageNum, pageSize, params ) {
  return $get(`/opsapi/activity/groupinfo/list/${pageNum}/${pageSize}`,  params )
}
//------------------------优惠券-------------------------------

/**
 * 创建优惠券
 * @param {Object} params 参数对象
 */
export const createCoupon = function( params ) {
  return $post(`/opsapi/coupon/create`, params )
}

/**
 * 获取优惠券列表
 * @param {Object} params 参数对象
 */
export const getCouponList = function( params ) {
  return $post(`/opsapi/coupon/list`, params )
}

/**
 * 发放优惠券
 * @param {Object} params 参数对象
 */
export const sendCoupon = function( params ) {
  return $post(`/opsapi/coupon/grant`, params )
}

/**
 * 获取优惠码详情
 * @param {Int} code 优惠码
 */
export const getCouponDetail = function( code ) {
  return $get(`/opsapi/coupon/detail`, { code })
}

/**
 * 修改优惠券状态
 * @param {Int} id 优惠券id
 */
export const stopTheCoupon = function( code, updateUserId ) {
  return $get(`/opsapi/coupon/edit/status`, { code, updateUserId })
}

/**
 * 获取发券记录列表
 * @param {Object} params 参数对象
 */
export const getCouponRecoedList = function( params ) {
  return $post(`/opsapi/coupon/record`, params )
}

export const getRateList = function() {
  return $get(`/opsapi/rate/list`)
}

/**
 * 获取效果分析列表
 * @param {Object} params 参数对象
 */
export const getEffectAnalysisList = function( params ) {
  return $get(`/opsapi/coupon/statistics`, params)
}

/**
 * GET 运营-活动管理-双十二拼团活动-数据列表
 */
export const getdouble12DataList = function() {
  return $get(`/opsapi/group/activity/data/list`)
}

/**
 * GET 
运营-活动管理-双十二拼团活动-拼团用户列表
 */
export const getdouble12UserDataList = function(pageObj, params) {
  return $get(`/opsapi/group/activity/user/page/${pageObj.pageNum}/${pageObj.pageSize}`, params)
}

/**
 * 运营-活动管理-双十二拼团活动-数据概览
 */
export const getdouble12UserDataView = function() {
  return $get(`/opsapi/group/activity/data/overview`)
}


/**
 * 新增消费税
 * @param {Object} params 参数对象
 */
export const addGst = function( params ) {
  return $post(`/opsapi/trading/center/finance/tax/rate/create`, params )
}

/**
 * 修改消费税
 * @param {Int} taxRateId 税率Id
 * @param {Object} params 参数对象
 */
export const editGst = function( taxRateId, params ) {
  return $put(`/opsapi/finance/taxrate/${taxRateId}`, params )
}

/**
 * 获取消费税详细信息
 * @param {Int} taxRateId 消费税Id
 */
export const getGstInfo = function( taxRateId ) {
  return $get(`/opsapi/finance/taxrate/${taxRateId}`)
}

/**
 * 获取消费税列表数据
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 */
export const getGstList = function( pageNum, pageSize, params ) {
  return $get(`/opsapi/finance/taxrate/list/${pageNum}/${pageSize}`, params )
}

/**
 * 获取国家信息列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getCountryList = function( pageNum, pageSize ) {
  return $get(`/opsapi/common/country/list/${pageNum}/${pageSize}`)
}