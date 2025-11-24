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
  // console.log("fullUrl", fullUrl);
  window.open(fullUrl);
}
