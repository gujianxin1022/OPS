const SPU_SKULIST_APP_SHOW = [
  { id: -1, nameZh: "全部", nameEn: "ALL" },
  { id: 0, nameZh: "否", nameEn: "No" },
  { id: 1, nameZh: "是", nameEn: "YES" },
];
const SPU_SKULIST_STATUS = [
  { id: -1, nameZh: "全部", nameEn: "ALL" },
  { id: 0, nameZh: "否", nameEn: "No" },
  { id: 1, nameZh: "是", nameEn: "Yes" },
];
const SPU_SKULIST_STATUS_NOT_ALL = [
  { id: 0, nameZh: "否", nameEn: "No" },
  { id: 1, nameZh: "是", nameEn: "Yes" },
];
const SPULIST_TYPE = [
  { id: -1, nameZh: "全部", nameEn: "ALL" },
  { id: 1, nameZh: "课程", nameEn: "Course" },
  { id: 2, nameZh: "实体", nameEn: "Entity" },
  { id: 3, nameZh: "虚拟", nameEn: "Virtual" },
];

const SKUMANGE_TERMOFVALIDITY = [
  { id: 0, nameZh: "日", nameEn: "day(s)" },
  { id: 1, nameZh: '周', nameEn: 'week(s)'},
  { id: 2, nameZh: "月", nameEn: "month(s)" },
  { id: 3, nameZh: "年", nameEn: "year(s)" },
];

const getValidType = (id, currentLang) => {
  switch (id) {
    case 0:
      return currentLang === "en" ? "year(s)" : "年";
    case 1:
      return currentLang === "en" ? "month(s)" : "月";
    case 2:
      return currentLang === "en" ? "day(s)" : "日";
    default:
      return "--";
  }
};

const LIMIT_TYPE = {
  addSPU: 1, // 新建一个spu
  addSKU: 2, // 只添加sku
  edit: 3, // 修改spu信息和sku信息的 状态 & 是否在商城显示 & sku列表排序
};

const getAppShow = (id, currentLang) => {
  switch (id) {
    case 0:
      return currentLang === "en" ? "no" : "否";
    case 1:
      return currentLang === "en" ? "yes" : "是";
    default:
      return "--";
  }
};
const getStatus = (id, currentLang) => {
  switch (id) {
    case 0:
      return currentLang === "en" ? "No" : "否";
    case 1:
      return currentLang === "en" ? "Yes" : "是";
    default:
      return "--";
  }
};
const getType = (id, currentLang) => {
  switch (id) {
    case 1:
      return currentLang === "en" ? "class" : "课程包";
    case 2:
      return currentLang === "en" ? "shiti" : "实体";
    case 3:
      return currentLang === "en" ? "虚拟" : "虚拟";
    default:
      return "--";
  }
};


const getPromotionTag = (id, currentLang) => {
  switch (id) {
    case 0:
      return currentLang === "en" ? "Most popular" : "最热门";
    case 1:
      return currentLang === "en" ? "Most economical" : "最划算";
    default:
      return "--";
  }
};

export {
  SPU_SKULIST_APP_SHOW,
  SPU_SKULIST_STATUS,
  SPU_SKULIST_STATUS_NOT_ALL,
  SPULIST_TYPE,
  SKUMANGE_TERMOFVALIDITY,
  LIMIT_TYPE,
  getAppShow,
  getStatus,
  getType,
  getPromotionTag,
  getValidType
};
