"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_ENV: '"development"',
  COMPONENTS_CACHE: '"cache"',
  // COMPONENTS_CACHE: '"no_cache"', // no_cache: 为不缓存页面
  LOCAL_DEVELOPMENT: '"local"',

  PORT: '"localhost:8080"',
  VUE_APP_UPLOAD_URL: '"https://b-upload.lingoace.com"',
  VUE_APP_BASE_API: '"https://b-ops.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://d-exer.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://d-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://test-r.lingoace.com"',
  VUE_APP_H5_URL: '"https://b-student.lingoace.com"', //首课反馈H5短链地址
  VUE_APP_GROWTH_URL: '"https://b-growth-oms.lingoace.com"', // 团购内嵌页面域名
  VUE_APP_LMS_URL: '"https://b-lms.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://test-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://d-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://b-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://b-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://b-webapp-im.lingoace.com"',
  VUE_APP_AUTH_URL: '"https://test-auth.lingoace.com"',
});
