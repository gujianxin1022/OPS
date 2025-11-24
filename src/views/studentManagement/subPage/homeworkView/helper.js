import { getStorage } from "@/utils/handleStorage";

/**
 * 打开Learnosity页面
 * @param {string} baseUrl 基础url
 * @param {object} query 追加URL参数
 */
export function goAssessmentPage(baseUrl, query) {
  const userInfo = JSON.parse(getStorage("userInfo"));
  const token = userInfo.jwtToken;
  // const userId = userInfo.id;
  const appendParams = {
    role: "3",
    isPreview: "1",
    ...query,
    token,
  };
  // 传入的 baseUrl 可能是完整的 url，也可能是相对路径
  const baseUrl2 = baseUrl.startsWith("http")
    ? baseUrl
    : `${process.env.VUE_APP_H5_URL}/assessment/#${baseUrl}`;
  const joinChar = baseUrl2.includes("?") ? "&" : "?";
  let fullUrl = `${baseUrl2}${joinChar}from=web_ops`;
  Object.entries(appendParams).forEach(([key, value]) => {
    if (value && fullUrl.indexOf(`${key}=`) === -1) {
      fullUrl += `&${key}=${value}`;
    }
  });
  window.open(fullUrl);
}
/**
 * 将一个URL的search参数转为一个对象
 * @param {string} url
 */
export function getQueryByUrl(url) {
  const startIndex = url ? url.indexOf("?") : 0;
  if (startIndex > 0) {
    // 去掉开头的 ?
    const search = url.substring(startIndex + 1);
    const items = search.split("&");
    const map = new Map();
    for (const item of items) {
      // 有些值本身会包含 =，所以用 = 分割后，数组第一项是 key，其他项使用 = 再连接起来
      const arr = item.split("=");
      if (arr.length > 1) {
        const key = arr[0];
        const value = arr.slice(1).join("=");
        map.set(key, decodeURIComponent(value));
      }
    }
    return Object.fromEntries(map);
  }
  return null;
}
