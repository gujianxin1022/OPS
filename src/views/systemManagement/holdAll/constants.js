import { deepFreeze } from "@/utils/handleData";

export const STATUS_MAP = Object.freeze({
  0 /* 数据库为未上架，业务需求显示为下架 */: "下架",
  1: "上架",
  2: "下架",
});

export const STATUS_COLOR_MAP = Object.freeze({
  0: "#F56C6C",
  1: "#5CB87A",
  2: "#F56C6C",
});

export const STATUS_LIST = deepFreeze(
  Object.entries(STATUS_MAP)
    .map(([value, label]) => ({ value: Number(value), label }))
    .filter((v) => v.value !== 0 /* 0为未上架；业务需求没有未下架选项 */)
);

export const TYPE_MAP = Object.freeze({
  1: "普通",
  2: "积分商城",
  3: "手动赠送",
  4: "团购",
  5: "code兑换",
});

export const TYPE_LIST = deepFreeze(
  Object.entries(TYPE_MAP).map(([value, label]) => ({
    value: Number(value),
    label,
  }))
);

export const IS_SHOW_MAP = Object.freeze({
  0: "不显示",
  1: "显示",
});

export const IS_SHOW_COLOR_MAP = Object.freeze({
  0: "#F56C6C",
  1: "#5CB87A",
});

export const IS_SHOW_LIST = deepFreeze(
  Object.entries(IS_SHOW_MAP)
    .map(([value, label]) => ({ value: Number(value), label }))
    .sort((a, b) => b.value - a.value) /* 显示在前，不显示在后 */
);

export const AREA_LIST = deepFreeze([
  { label: "全部", value: "all" },
  { label: "新加坡", value: "singapore" },
]);

export const CLASS_TYPE_MAP = Object.freeze({
  1: "1v1",
  2: "小班课",
  3: "大班课",
  4: "录播课",
  5: "AI课",
});

export const CLASS_TYPE_LIST = deepFreeze(
  Object.entries(CLASS_TYPE_MAP).map(([value, label]) => ({
    value: Number(value),
    label,
  }))
);

export const COURSE_PACKAGE = 0;
export const PRODUCT = 1;

export const TERM_UNIT_LIST = deepFreeze([
  { label: "年", value: "YEAR" },
  { label: "月", value: "MONTH" },
  { label: "天", value: "DAY" },
]);
