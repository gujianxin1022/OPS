import { reactive, ref } from "@vue/composition-api";

export const hooksFun = (root, localeLanguage) => {
  // 递归处理级联数据
  const processCascader = (arr) => {
    // console.log(arr);
    let valueKey = ['editionId', 'levelId', 'id'];
    let labelKeyZh = ['editionNameZh', 'courseName', 'lessonNo'];
    let labelKeyEn = ['editionNameEn', 'courseName', 'lessonNo'];
    return arr.reduce((pre, cur, index) => {
      let keylist = Object.keys(cur)
      pre[index] = {};
      pre[index].value = cur[valueKey.find(i => keylist.includes(i))];
      keylist.includes('lessonNo')
        ? (pre[index].label = `lesson ${cur.lessonNo ?? "" }`)
        : (pre[index].label = localeLanguage == 'en' ? cur[labelKeyEn.find(i => keylist.includes(i))] : cur[labelKeyZh.find(i => keylist.includes(i))])
      if (cur.courseLevelInfoList && cur.courseLevelInfoList.length) {
        pre[index].children = processCascader(cur.courseLevelInfoList)
      }
      if (cur.courseLessonList && cur.courseLessonList.length) {
        pre[index].children = processCascader(cur.courseLessonList)
      }
      return pre;
    }, [])
  };

  return {
    processCascader
  };
}