export const COIN = "coin" /* 积分 */
export const CLASS_HOUR = "classHour" /* 课时 */

export const ON_LINE = 1;
export const OFF_LINE = 2;
export const STATUS_MAP = { [ON_LINE]: "上线", [OFF_LINE]: "下线" };
export const STATUS_LIST = Object.keys(STATUS_MAP).map((key) => ({
  value: key,
  label: STATUS_MAP[key],
}));

export const CLASSIFY_MAP = { 0: "自动", 1: "手动", 2: "手动&自动" };
export const CLASSIFY_LIST = Object.keys(CLASSIFY_MAP).map((key) => ({
  value: key,
  label: CLASSIFY_MAP[key],
}));

export const SHOW_MAP = { 1: "展示", 2: "不展示" };
export const SHOW_LIST = Object.keys(SHOW_MAP).map((key) => ({
  value: key,
  label: SHOW_MAP[key],
}));
