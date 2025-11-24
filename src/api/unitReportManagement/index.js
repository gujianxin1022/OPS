import GetData from "@/utils/axios.js";
const { $get, $put, $delete, $post } = new GetData();

/**
 * 获取单元报告列表
 * @param {Object} params
 *    status  状态 0,1,2,3
 *    id      单元报告id
 */
export const getUnitReportList = function (params) {
  return $post(`/opsapi/unit/report/list`, params);
};

/**
 * 获取单元报告详情信息
 * @param {Int} report_id 单元报告标识
 */
export const getUnitReportDetails = function (id) {
  return $get(`/opsapi/teachingreport/report/unit/detail/audit`, {
    id,
  });
};

/**
 * 获取首课反馈列表
 * @param {Object} params
 *    status 状态 0,1,2,3
 *    id  首课报告id
 *    page  第几页
 *    page_size 每页几条数据
 */
export const getFirstClassFeedbackList = function (pageNum, pageSize, params) {
  // return $get(`/first_report/`, params)
  return $get(`/opsapi/first/report/list/${pageNum}/${pageSize}`, params);
};

/**
 * 获取首课反馈督查列表
 * @param {Object} params
 *    status 状态 0,1,2,3
 *    id  首课报告id
 *    page  第几页
 *    page_size 每页几条数据
 */
export const getFirstTeachingFeedbackList = function (
  pageNum,
  pageSize,
  params
) {
  // return $get(`/first_report/`, params)
  return $get(
    `/opsapi/teachingreport/report/firstCourse/list_by_tm/${pageNum}/${pageSize}`,
    params
  );
};
/**
 * 获取首课反馈详情信息
 * @param {Int} report_id 首课反馈标识
 */
export const getFirstClassFeedbackDetails = function (
  firstReportId,
  classTypeId
) {
  return $get(
    `/opsapi/teachingreport/report/first/first/report/detail/${firstReportId}`,
    {
      classTypeId,
    }
  );
};

/**
 *
 * @param {Int} templateId
 * @param {String} language
 */
export const getFirstClassFeedbackDetailsMap = function (templateId, language) {
  return $get(
    `/opsapi/teachingreport/report/first/template/mapping/${templateId}/${language}`
  );
};

/**
 * 审核单元报告
 * @param {Int} report_id 单元报告标识
 * @param {Object} params 参数
 *    status  3 审核通过  2 审核不通过
 *    remark 审核内容
 */
export const auditUnitReport = function (params) {
  // return $put(`/unit_report/${report_id}/examine/`, params)
  return $put(`/opsapi/unit/report/audit`, params);
};

/**
 * 罚金单元报告
 * @param {Int} report_id 单元报告标识
 * @param {*} params 参数
 *    money 罚金金额
 */
export const deductionMoney = function (params) {
  return $post(`/opsapi/first/report/fine`, params);
};

/**
 * 审核首课反馈
 * @param {Int}} report_id 首课标识
 * @param {Object} params 参数
 *    status  3 审核通过  2 审核不通过
 *    remark  审核内容
 */
export const auditFirstClassFeedback = function (params) {
  return $put(`/opsapi/first/report/audit`, params);
};

/**
 * 罚金首课反馈
 * @param {Int} report_id 首课标识
 * @param {Object} params 参数
 *    money 罚金金额
 */
export const deductionMoneyFirst = function (report_id, params) {
  return $put(`/first_report/${report_id}/impose_fine/`, params);
};

/**
 * 提交单元报告备注
 * @param {Int} report_id 单元报告标识
 * @param {Object} params
 *    ramark  备注信息
 */
export const submitRemarks = function (unitReportId, remark) {
  // return $put(`/unit_report/${report_id}/remark/`, params)
  return $put(`/opsapi/unit/report/remark/${remark}/${unitReportId}`);
};

/**
 * 单元报告的撤回
 * @param {Int} reportId 报告的标识
 */
export const withdrawUnitReport = function (reportId) {
  return $get(`/opsapi/opsorder/unitReport/withdraw/${reportId}`);
};

/**
 * 首课反馈的撤回
 * @param {Int} reportId 首课反馈的标识
 */
export const withdrawFirstClass = function (reportId) {
  return $get(`/opsapi/opsorder/firstReport/withdraw/${reportId}`);
};

/**
 *
 * @param {long} id	模板id	新建时不传，修改时传
 * @param {string} name	模板名
 * @param {string} remark		模板总述
 * @param {string} language		模板对应的语言:中文CN，英文EN
 * @param {string} skillList		能力评估的id列表，逗号分割
 * @param {string} lessonShowList		课堂表现的id列表，逗号分割
 */
export const saveTrialReportTemplate = function (params) {
  return $put(`opsapi/feedback/template`, params);
};

/**
 * 首课反馈模板，保存能力评估
 *
 * {​​​​​​​​​​​​​​​​​​​​
 *   "name":"听力2",
 *   "language":"CN",
 *   "starInfos":[{​​​​​​​​​​​​​​​​​​​​"starType":1,"starTypeDesc":"听力11"}​​​​​​​​​​​​​​​​​​​​,{​​​​​​​​​​​​​​​​​​​​"starType":1,"starTypeDesc":"听力12"}​​​​​​​​​​​​​​​​​​​​,{​​​​​​​​​​​​​​​​​​​​"starType":1,"starTypeDesc":"听力13"}​​​​​​​​​​​​​​​​​​​​]
 *  }​​​​​​​​​​​​​​​​​​​​
 */
export const saveAbilityAssessment = function (params) {
  return $put(`/opsapi/feedback/appraise`, params);
};

/**
 * 修改能力评估
 * @param {int} id	id	long
 * @param {int} starType	星级类型，1一星2二星3三星4四星5五星	int
 * @param {String} starTypeDesc	描述	string
 */
export const changeAbilityAssessment = function (params) {
  return $put(`/opsapi/feedback/appraise`, params);
};

/**
 * 删除能力评估
 * @param {int,int,int...} params
 */
export const deleteAbilityAssessment = function (templateId, appraiseName) {
  return $delete(`/opsapi/feedback/appraise/${templateId}/${appraiseName}`);
};

/**
 * 保存课堂表现反馈，参数同‘首课反馈模板，保存能力评估’
 */
export const saveClassPerformance = function (params) {
  return $put(`/opsapi/feedback/lessionshow`, params);
};

/**
 * 修改课堂表现反馈
 * @param {int} id	已存在的表现id
 * @param {int} showType	子分类	如：，1，2，3
 * @param {string} showTypeDesc	子分类描述	如，活跃，中等，安静
 * @param {} showDesc 表现具体描述
 */
export const changeClassPerformance = function (params) {
  return $put(`/opsapi/feedback/lessionshow`, params);
};

/**
 * 保存/修改模板
 * @param {long} id	模板id	新建时不传，修改时传
 * @param {string} name		模板名
 * @param {string} remark	模板总述
 * @param {string} language	模板对应的语言:中文CN，英文EN
 * @param {string} skillList	能力评估的id列表，逗号分割
 * @param {string} lessonShowList	课堂表现的id列表，逗号分割
 * @param {int} status	int	1已发布，2待发布
 */
export const saveTemplate = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put("/opsapi/teachingreport/report/firstCourse/template", params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 保存/修改多语言模板
 * @param {long} id	模板id	新建时不传，修改时传
 * @param {string} name		模板名
 * @param {string} remark	模板总述
 * @param {string} language	模板对应的语言:中文CN，英文EN
 * @param {string} skillList	能力评估的id列表，逗号分割
 * @param {string} lessonShowList	课堂表现的id列表，逗号分割
 * @param {int} status	int	1已发布，2待发布
 */
export const saveMultilingualTemplate = function (params, type) {
  return $put(
    `/opsapi/teachingreport/report/firstCourse/template/${type}`,
    params
  );
};

/**
 * 查询模板
 * @param  status	2待发布，1已发布
 * @param  version	版本
 * @param  lession	课程
 * @param  level	等级
 * @param  pageNum	页号
 * @param  pageSize	记录数
 */
export const getTemplate = function (params) {
  return $post(`/opsapi/teachingreport/report/feedback/template/list`, params);
};

export const getSingleTemplate = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachingreport/report/first/report/temp/detail`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 修改模板状态
 */
export const updateTemplateStatus = function (params) {
  return $put(`/opsapi/feedback/template/status`, params);
};

/**
 * 模板建立课程关系
 */
export const templateLinkCourse = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $post(
    `/opsapi/teachingreport/report/firstCourse/template/lesson`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/**
 * 记录生成的首课反馈图片或短链
 */
export const recordTemplage = function (params) {
  return $post(`/opsapi/first/report/recordTemplate`, params);
};
/**
 * 单元报告 复制h5短链
 */
export const unitReportCopy = function (unitReportId, language) {
  return $get(`/opsapi/unit/report/short/url/${unitReportId}/${language}`);
};
/**
 * 单元报告详情信息
 */
export const unitReportDdetail = function (id) {
  return $get(`/opsapi/teachingreport/report/unit/detail/auditV2`, { id });
};

/**
 * 判断新旧版本
 */
export const JudgeNewAndOld = function (reportid) {
  return $get(`/opsapi/report/check/version/${reportid}`);
};

/**
 * 判断是否基础版本
 */

export const getUnitReportEditionType = (courseEditionId) =>
  $get(
    `/opsapi/teachingreport/report/unit/edition/reportType`,
    courseEditionId
  );

// 获取单元报告3的iframe的url
export const getReport3Url = function (unitReportId, language) {
  return $get(
    `/opsapi/teachingreport/report/unit/splicing/short/url/${unitReportId}/${language}`
  );
};

// 获取试听课反馈报告，法语iframeUrl
export const getTrialClassReportUrl = function (reportId) {
  return $get(`/opsapi/teachingreport/report/firstCourse/urlSplit/ops/${reportId}/1
    `);
};

// 获取试听课反馈报告，法语iframeUrl
export const reqSaveHonor = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $put(`/opsapi/teachingreport/report/first/honor/save`, params);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

// ID加密
export const getEncryptionReslut = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/teachingreport/report/encryption/get?id=${id}`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 查询学科->产品线->课程类型->ROOT节点的树 */
export const getSubjectRelatedTree = async (params) => {
  const {
    status,
    data: { code, data },
  } = await $get(
    `/opsapi/teachingreport/report/course/relatedTree/status`,
    params
  );
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

/* 课程树详情(不包含本身) */
export const getcourseTree = async (id) => {
  const {
    status,
    data: { code, data },
  } = await $get(`/opsapi/teachingreport/report/course/tree/details/${id}`);
  if (status !== 200 || code !== 200) return Promise.reject();
  return data;
};

