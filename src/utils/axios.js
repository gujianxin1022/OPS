import Vue from "vue";
import axios from "axios";
import datetime from "@/utils/datetime_utils";
import { getDevice } from "@/utils/handleData";
import { getStorage } from "../utils/handleStorage";
import { ABNORMAL_CODE } from "./constants";
import handleToken from "../utils/auth";
import checkCode from "./checkCode";
import { removeCookiesLoginInfo } from "@/views/login/autoLogin.js";
import { toSSOPage } from "@/utils/sso.js";

var instance;
function TokenInvalid() {
  Vue.prototype.$notify({
    message: "登陆过期，请重新登录",
    type: "error",
    duration: 2000,
  });
}

function SingleNotify() {
  return function () {
    if (!instance) instance = new TokenInvalid();
    return instance;
  };
}

// axios.defaults.withCredentials = true

const jstz = require("@/utils/jstz");
/**
 * 处理请求头数据和处理结果
 */
class HandleParamAndResult {
  constructor() {
    if (
      process.env.LOCAL_DEVELOPMENT === "local" ||
      process.env.NODE_ENV === "development"
    ) {
      var HOST = process.env.VUE_APP_BASE_API;
      this.api = HOST;
    } else {
      this.api = window.location.protocol + "//" + window.location.host;
    }
  }

  // 添加请求头
  _addHeaders() {
    const currentLang = window.localStorage.getItem("localeLanguage");
    const ua = navigator.userAgent.toLowerCase(),
      timezone = jstz.jstz.determine();
    // 自定义headers
    const headers = {
      "Content-Type": "application/json",
      "X-LNG": currentLang,
      "X-TZ": timezone.name() + " " + datetime.getTimeZone(),
      "X-DEVICE": getDevice(ua),
    };
    try {
      let token = JSON.parse(getStorage("userInfo"));
      if (token) {
        // 是否有token
        headers.Authorization = `Bearer ${token.jwtToken}`;
      }
    } catch (error) {
      let token = new handleToken();
      token.removeToken();
    }

    return headers;
  }

  // 处理请求
  dealAxios(url, options, type) {
    const _this = this;
    options.headers = this._addHeaders();
    // do something before request
    return new Promise((resolve, reject) => {
      let requestUrl = "";
      switch (type) {
        case "file":
          requestUrl = url;
          break;
        case "homework":
          Reflect.deleteProperty(options.headers, "Authorization");
          requestUrl = process.env.VUE_APP_BASE_API_EXER + url;
          break;
        case "discover":
          Reflect.deleteProperty(options.headers, "Authorization");
          requestUrl = process.env.VUE_APP_BASE_API_DISCOVER + url;
          break;
        case "upload":
          Reflect.deleteProperty(options.headers, "Authorization");
          requestUrl = process.env.VUE_APP_UPLOAD_URL + url;
          break;
        case "mkt":
          Reflect.deleteProperty(options.headers, "Authorization");
          requestUrl = process.env.VUE_APP_BASE_API_MKT + url;
          break;
        case "zoho":
          requestUrl = process.env.VUE_APP_ZOHO_URL + url;
          break;
        case "lms-facade":
          requestUrl = process.env.VUE_APP_API_LMS_FACADE + url;
          break;
        case "salary":
          requestUrl = 'http://100.101.100.43:9909' + url;
          break;
        default:
          requestUrl = _this.api + url;
      }
      axios(requestUrl, options)
        .then((res) => {
          if (res.data.code == 401) {
            if (window.localStorage.getItem("tokenExpire") === "expire") return;
            handle401();
            return;
          }
          if (res.data.code === 403) {
            Vue.prototype.$notify({
              message: res.data.message,
              type: "error",
              duration: 3000,
            });
          }
          if (res.data.code === 1 && res.data.code !== undefined) {
            Vue.prototype.$notify({
              message: res.data.message,
              type: "error",
              duration: 3000,
            });
            return;
          }
          if (
            res.data.code !== 200 &&
            res.data.code !== 0 &&
            res.data.code !== undefined &&
            res.data.code !== 40000 &&
            !Object.values(ABNORMAL_CODE).includes(res.data.code)
          ) {
            checkCode(res.data.code, res.data.message);
          }
          resolve(res);
        })
        .catch((err) => {
          if (err.response) {
            if (
              Number(err.response.status) == 403 ||
              err.response.data.detail == "未登录" ||
              (Number(err.response.status) === 401 &&
                err.response.status !== 401100)
            ) {
              handle401();
              return;
            }
            Vue.prototype.$notify({
              message: err.response.data.detail|| err.response?.data?.message || "出错啦~",
              type: "error",
              duration: 3000,
            });
          }
          reject(err);
        });
    });
  }
}
/**
 * 处理401错误
 */
function handle401() {
  removeCookiesLoginInfo();
  new SingleNotify()();
  window.localStorage.clear();
  if (window.location.pathname !== "/login") {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }

  // toSSOPage()
  // window.location.href = `${process.env.VUE_APP_AUTH_URL}?sourceUrl=${process.env.VUE_APP_BASE_API}`;
  // if(window.location.pathname !== '/login'){
  //   setTimeout(() => {
  //     window.location.href = '/login';
  //   }, 2000);
  // }
}
/**
 * 封装请求方法
 * @param { Number | String } 平台传递的版本号
 */
class RequestMethod {
  constructor() {
    this.$get = this.$get.bind(this);
    this.$post = this.$post.bind(this);
    this.$postImage = this.$postImage.bind(this);
    this.$put = this.$put.bind(this);
    this.$delete = this.$delete.bind(this);
    this.$upload = this.$upload.bind(this);
    this.$postSingleCourseware = this.$postSingleCourseware.bind(this);
    this.$postBatchCourseware = this.$postBatchCourseware.bind(this);
    this._method = this._method.bind(this);
  }

  /**
   * 整合请求方法
   * @param { String } url 接口路由
   * @param { Object } axios配置 请求参数
   */
  _method(url, options, type) {
    return new HandleParamAndResult().dealAxios(url, options, type);
  }

  /**
   * get方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   * @param { Object } type 接口类型，根据类型区分不同的baseApi
   */
  $get(url, data, type = null, config) {
    return this._method(
      url,
      {
        params: data,
        method: "get",
        ...config,
      },
      type
    );
  }

  /**
   * post方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $post(url, data, type = null) {
    return this._method(
      url,
      {
        data: data,
        method: "post",
        type: "json",
      },
      type
    );
  }

  $postSingleCourseware(data) {
    return this._method(
      `${process.env.VUE_APP_UPLOAD_URL}/uploadapi/single/uploadCourseWare`,
      {
        data: data,
        method: "post",
        type: "json",
      },
      "file"
    );
  }

  $postBatchCourseware(data) {
    return this._method(
      `${process.env.VUE_APP_UPLOAD_URL}/uploadapi/batch/uploadCourseWare`,
      {
        data: data,
        method: "post",
        type: "json",
      },
      "file"
    );
  }

  $postImage(data) {
    return this._method(
      `${process.env.VUE_APP_BASE_API}/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/uploadFile`,
      {
        data: data,
        method: "post",
        type: "json",
      },
      "file"
    );
  }

  /**
   * put方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $put(url, data, type = null) {
    return this._method(
      url,
      {
        data: data,
        method: "put",
        type: "json",
      },
      type
    );
  }

  /**
   * delete方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */

  $delete(url, data) {
    return this._method(url, {
      data: data,
      method: "delete",
      type: "json",
    });
  }

  /**
   * 上传方法
   * @param { String } url 接口路由
   * @param { Object } data 请求参数
   */
  $upload(url, data) {
    return this._method(url, {
      body: data,
      method: "post",
      type: "formData",
    });
  }
}
export default RequestMethod;
