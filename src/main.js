import Vue from "vue";
import App from "./App";
import router from "./router/";
import store from "./store/";
import axios from "axios";
import VueCompositionAPI from "@vue/composition-api";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import ApiConstants from "./utils/api_constants"; // 公共常量量
import Constants from "./utils/constants";
import hiddenMenu from "./utils/hiddenMenu"; // 需要隐藏的菜单，例如详情页
import HandlePermission from "./utils/handlePermission"; // 处理button 和 tab 权限的公共方法
import Filters from "./utils/filters"; // 过滤器
import * as Api from "./api/index"; // Api
import DateTimeUtils from "./utils/datetime_utils"; // 时间处理器
import i18n from "./assets/locales/index";
import Element from "element-ui";
import "./utils/dialog.js";
import "./utils/inserParams.js";
import "./styles/element-variables.scss";
import "./styles/index.scss";
import Plugin from "./plugin";
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true; //如果要复制没有特定按钮的文本内容,请添加此行
import formCreate from "@form-create/element-ui";
/**项目里原始的wangeditor引入版本过老，与最新 @wangeditor/editor 有使用冲突 因此消息中心二期需求中引入 quill-editor 库实现富文本需求 */
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
let BlockEmbed = VueQuillEditor.Quill.import("blots/block/embed");
import VCalendar from "v-calendar";
class AudioBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    node.setAttribute("controls", "");
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute("src");
  }

  static value(domNode) {
    return domNode.getAttribute("src");
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value)
      return super.format(name, value);
    this.domNode.setAttribute("src", value);
  }
}
AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";
VueQuillEditor.Quill.register(AudioBlot);
// 引入拖拽组件
import VueDraggableResizable from "vue-draggable-resizable/dist/VueDraggableResizable.umd.min.js";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
Vue.use(VueDraggableResizable);
Vue.use(VueCompositionAPI);
Vue.use(Plugin);
Vue.use(VueClipboard);
Vue.use(formCreate);
Vue.use(Element, { size: "small", i18n: (key, value) => i18n.t(key, value) });
Vue.use(VueQuillEditor);
Vue.use(VCalendar, { componentPrefix: "vc" });

Vue.prototype.$Axios = axios;
Vue.prototype.Constants = Constants;
Vue.prototype.DateTimeUtils = DateTimeUtils;
Vue.prototype.HiddenMenu = hiddenMenu;
Vue.prototype.Per = HandlePermission;
Vue.prototype.$Api = Api;
Vue.prototype.ApiConstants = ApiConstants;
Vue.prototype.Filters = Filters;
Vue.prototype.$eventBus = new Vue();
//构造过滤器
for (let f in Filters) {
  Vue.filter(f, function (value) {
    return Filters[f](value);
  });
}

// cdn 引入 elementui 设置组件 size
for (var key in window.ELEMENT) {
  if (window.ELEMENT[key].props && window.ELEMENT[key].props.size)
    window.ELEMENT[key].props.size.default = "small";
}

Vue.config.productionTip = false;
Vue.config.devtools = true;
new Vue({
  el: "#app",
  router,
  i18n,
  store,
  render: (h) => h(App),
});
