/**
 * 自研埋点
 */
import { createAnalytics } from "@pplingo/gather-lingoace";
import { Queue } from "./queue";
import { getPlatformInfo } from "@lingoace/environment-lingoace"; //环境变量sdk

const appEnv = process.env.VUE_APP_ENV;
const lang = localStorage.getItem("localeLanguage") || navigator.language;
function createInstance() {
  const instance = createAnalytics();
  instance.init({
    API_KEY: "kAtohvjx",
    appSecret: "9993b5321cb2f0c3bede6b08cdd73b90324637d2",
    config: {
      showLog: false, // 是否显示log
      env: appEnv === "production" ? "prd" : "test", // 埋点SDK log环境
      // 埋点服务地址
      request: {
        tokenHost: process.env.VUE_APP_API_AMA,
        collector: process.env.VUE_APP_API_LOGEVENT,
      },
    },
  });
  instance.setAppName("webapp-ops");
  instance.setDeviceModel(navigator.userAgent);
  instance.setDeviceOS(getPlatformInfo().os);
  instance.setLanguage(lang);
  if (window.localStorage.getItem("userInfo")) {
    const { username, id } = JSON.parse(
      window.localStorage.getItem("userInfo")
    );
    instance.setProfileProperties({
      username,
      id,
    });
  }
  return instance;
}
const analytics = createInstance();
/**
 * 设置登录人信息
 * @param {Number} parentUserId 家长用户id
 */
function setLoginUserInfo(info) {
  analytics.setProfileProperties(info);
}

/**
 * 埋点sdk要求一点埋点成功后才能进行下一个埋点，否则会重复埋点。（每次调用sdk埋点api，它会检测如果上一个埋点请求是否成功，未成功（包含请求中的）就会重新发起一个请求执行上一个埋点，导致埋点重复）
 * 所以这里使用一个队列控制埋点请求
 */
const queue = new Queue();
/**
 * 埋点
 */
function logEvent(code, name, data) {
  const param = {
    event: code,
    eventName: name,
    eventType: "access", // 一般都是 access
    eventCategory: "async", // 一般都是 async
    // topic: code.toLowerCase().includes('click') ? 'LABBL5' : 'LAABL1', // LAABL1 用于 pv/uv 类的事件；LAABL5 用于交互类的事件
    topic: "LAABL1",
    // 合并 eventProperties
    eventProperties: {
      ...data,
    },
  };
  const submitFn = () => {
    return new Promise((resolve) => {
      // bug: 埋点 sdk 有时候会不触发回调函数（似乎发生在埋点sdk的token过期，重新获取token之后的事件不触发回调），这里我们加一个保底的 resolve
      const tempId = setTimeout(() => {
        console.log("埋点事件兜底：标记任务完成");
        resolve();
      }, 5000);
      analytics.logEvent(param, function () {
        clearTimeout(tempId);
        resolve();
      });
    });
  };
  // 加入埋点队列
  queue.enqueue(submitFn);
}

export { logEvent, setLoginUserInfo };
