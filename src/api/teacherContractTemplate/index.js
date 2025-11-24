import GetData from "@/utils/axios.js";
const { $get, $post, $delete, $put } = new GetData();

/**
 * 获取老师薪酬列表
 * @param {Int} tutorType 是否全职：0不是 1是
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 * @param {Object} params 参数对象
 *         @param {Date} startTime 开始时间
 *         @param {Date} endTime 结束时间
 *         @param {String} tutorName 老师名字
 */
export const getContractTemplateList = function (
    pageNum,
    pageSize,
    contractTemplateName,
    status,
    subjectType,
    time
  ) {
    return $post(
      `/opsapi/teachermanager/teacher-manage/tutor/type/contract/template/list`,
      {
        contractTemplateName,
        status,
        subjectType,
        pageNum,
        pageSize,
        time
      }
    );
};
// 新增合同模版
export const addContractTemplate = function (params) {
  return $post(`/opsapi/teachermanager/teacher-manage/tutor/type/contract/template/saveOrUpdate`, params);
};