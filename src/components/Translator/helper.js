import { franc } from "franc-min";

export function detectLanguage(text) {
  return franc(text);
}
/**
 * 检测文本是否为目标语言
 * @param {string} text 源文本
 * @param {string} lang 目标语言
 * @returns boolean
 */
export function isTargetLanguage(text, lang) {
  const lang1 = franc(text, {
    // 仅检测中文、法语和英语
    only: ["cmn", "fra", "eng"],
    // You can change what’s too short (default: 10):
    minLength: 5, // 少于此配置会返回 'und'.
  });
  // console.log("detectLanguage:", text, lang1);
  if (lang1 === "cmn" && lang === "zh") {
    return true;
  } else if (lang1 === "fra" && lang === "fr") {
    return true;
  } else if (lang1 === "eng" && lang === "en") {
    return true;
  }
  if (!lang1 || lang1 === "und") {
    return true;
  }
  return false;
}
