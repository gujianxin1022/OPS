import GetData from '@/utils/axios.js'

const {
  $get,
  $post,
  $put,
  $delete
} = new GetData()
/* 关于课程树，课程包的所有接口（版本，级别，unit，lesson） */

/* 获取全量课程树 */
export const reqAllCourseTreeList = () => {
  return $post("/opsapi/lsmAggregate/aggregate/courseTree/feign/course/tree/conditional/query/list", {});
};


/* 课程包：获取级别下unit列表 */
export const reqUnitByLevel = (params) => {
  return $post("/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/unit/list/by/level/and/package", params);
};

/* 课程包：获取单元下lesson列表 */
export const reqLessonByUnit = (params) => {
  return $post("/opsapi/lsmAggregate/aggregate/coursePackage/feign/package/tree/lesson/list/by/unit/and/package", params);
};