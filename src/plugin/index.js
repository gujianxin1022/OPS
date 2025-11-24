import * as directives from "@/directive";
import * as customUI from "@/customUI";
import * as customUIMethods from "@/customUI/js";

const Plugin = {};
Plugin.install = (Vue) => {
  // 遍历注入所有的directive
  Object.keys(directives).forEach((key) => {
    Vue.directive(key, directives[key]);
  });
  // 遍历注入所有的customUI
  Object.keys(customUI).forEach((key) => {
    Vue.component(key, customUI[key]);
  });

  // 遍历注入所有的customUIMethods
  Object.keys(customUIMethods).forEach((key) => {
    Vue.prototype[key] = customUIMethods[key];
  });
};

export default Plugin;

// urlParameterAvailable
