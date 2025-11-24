import Cookies from "js-cookie";

/**
 * process.env.NODE_ENV:
 * 1、development
 * 2、test
 * 3、production
 */
const keyName = `${process.env.NODE_ENV}_ops_lms_login_info`;
// 兼容两个域名
const domain = location.hostname.endsWith(".lingo-ace.com") ? ".lingo-ace.com" : ".lingoace.com";

export const getCookiesLoginInfo = () => {
  return Cookies.get(keyName);
};

export const setCookiesLoginInfo = (info) => {
  Cookies.set(keyName, info, {
    domain,
  });
};

export const removeCookiesLoginInfo = async () => {
  Cookies.remove(keyName, { domain });
};
