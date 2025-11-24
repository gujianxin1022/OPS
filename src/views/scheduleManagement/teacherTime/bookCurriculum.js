import { ref } from "@vue/composition-api";
/* 试一下,vue3新概念响应状态替代vuex */
export const withNewTaskTemplate =
  ref(false); /* 用于创建新的任务模板后刷新任务模板列表,同级页面状态响应 */

export const bookDuration = ref(""); /* 课包上课时长 */
export const bookParamsTimes = ref([]); /* 筛选老师时间数组 */
export const markingBookTime = ref([]); /* 标记初始化进入老师列表时间arr */
export const isHasOverlap = ref(false); /* 标记初始化进入老师列表时间arr */
export const operationScheduleType =
  ref(
    "123"
  ); /* 约课次数 String(bookOneClass:约一节 ；bookMoreClass：约多节；adjustOneClass:调一节)  */
/**
 * 约课课包信息
 * nameZh
 * nameEn
 * duration
 * classType
 * packageId
 *
 */
export const bookCoursePackageInfo = ref(null);

export const bookCourseTeacherInfo = ref(null); /* 约课教师信息 */

export const bookPackageType = ref('1');

export const bookMinStartTime=ref('')