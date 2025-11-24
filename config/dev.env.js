"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

exports.test = merge(prodEnv, {
  NODE_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_ENV: '"test"',
  VUE_APP_BASE_API: '"https://test-ops.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://test-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://test-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://test-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://test-student.lingoace.com"',
  VUE_APP_GROWTH_URL: '"https://test-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://test-lms.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://test-exer.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://test-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://test-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://test-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://test-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://test-webapp-im.lingoace.com"',
  VUE_APP_AUTH_URL: '"https://b-auth.lingoace.com"',
});

exports.testb = merge(prodEnv, {
  NODE_ENV: '"test"',
  VUE_APP_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_BASE_API: '"https://b-ops.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://b-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://b-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://b-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://b-student.lingoace.com"',
  VUE_APP_GROWTH_URL: '"https://b-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://test-lms.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://b-exer.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://b-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://b-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://b-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://b-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://b-webapp-im.lingoace.com"',
  VUE_APP_AUTH_URL: '"https://b-auth.lingoace.com"',
});

exports.testd = merge(prodEnv, {
  NODE_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_ENV: '"test"',
  VUE_APP_BASE_API: '"https://d-ops.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://d-exer.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://d-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://d-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://d-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://d-student.lingoace.com"',
  VUE_APP_GROWTH_URL: '"https://d-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://test-lms.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://d-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://d-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://d-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://d-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://d-webapp-im.lingoace.com"',
});

exports.testg = merge(prodEnv, {
  NODE_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_ENV: '"test"',
  VUE_APP_BASE_API: '"https://g-ops.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://g-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://g-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://g-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://g-student.lingo-ace.com"',
  VUE_APP_GROWTH_URL: '"https://g-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://test-lms.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://g-exer.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://g-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://g-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://test-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://test-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://g-webapp-im.lingoace.com"',

});

exports.testh = merge(prodEnv, {
  NODE_ENV: '"test"',
  VUE_APP_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_BASE_API: '"https://h-ops.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://h-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://h-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://h-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://h-student.lingo-ace.com"',
  VUE_APP_GROWTH_URL: '"https://h-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://test-lms.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://h-exer.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://h-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://h-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://test-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://test-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://h-webapp-im.lingoace.com"',

});

exports.stage = merge(prodEnv, {
  NODE_ENV: '"test"',
  COMPONENTS_CACHE: '"cache"',
  VUE_APP_ENV: '"pre_production"',
  VUE_APP_BASE_API: '"https://pre-ops.lingoace.com"',
  VUE_APP_BASE_API_DISCOVER: '"https://pre-discover.lingoace.com"',
  VUE_APP_SHORTCHAIN_API: '"https://pre-r.lingoace.com"',
  VUE_APP_UPLOAD_URL: '"https://pre-upload.lingoace.com"',
  VUE_APP_H5_URL: '"https://stage-student.lingo-ace.com"',
  VUE_APP_GROWTH_URL: '"https://pre-growth-oms.lingoace.com"',
  VUE_APP_LMS_URL: '"https://pre-lms.lingoace.com"',
  VUE_APP_BASE_API_EXER: '"https://pre-exer.lingoace.com"',
  VUE_APP_BASE_API_MKT: '"https://pre-mkt-api.lingoace.com"', // 获取渠道码
  VUE_APP_MEDIA_CDN_DOMESTIC: '"https://hw-cdn.lingo-ace.com"',
  VUE_APP_UPLOAD_CDN_VIDEO_IMG: '"https://stage.cdn.lingoace.com/"',
  VUE_APP_ZOHO_URL: '"https://pre-zoho-gw.lingoace.com"',
  VUE_APP_API_AMA: '"https://pre-ama.lingoace.com"',
  VUE_APP_API_LOGEVENT: '"https://pre-collector-api.lingoace.com"',
  VUE_APP_API_LMS_FACADE: '"https://lms-facade.lingoace.com"',
  VUE_APP_IM_URL: '"https://pre-webapp-im.lingoace.com"',
  VUE_APP_AUTH_URL: '"https://pre-auth.lingoace.com"',
});
