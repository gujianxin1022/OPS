<template>
  <div style="height: 100%">
    <iframe
      v-show="isCustomerServicePage"
      :src="webImUrl"
      frameborder="0"
      style="width: 100%; height: 100%"
    ></iframe>
    <div v-if="imConfig && imConfig.imEnable&&!isCustomerServicePage" class="cs-entrance-icon-wrapper">
    <vue-draggable-resizable
      :disableUserSelect="false"
      :min-width="40"
      :min-height="40"
      :w="40"
      :h="40"
      :parent="false"
      :handles="[]"
      class-name-handle="my-handle-class"
    >
      <div class="my-handle-class">
        <div class="handle-icon"></div>
        <div id="customer-service-entrance" @click="onIconClick">
          <img src="@/assets/homepage/customer-service.png" alt="" />
          <sup v-if="unReadCountText" class="cs-entrance-icon-badge">{{
            unReadCountText
          }}</sup>
        </div>
      </div>
    </vue-draggable-resizable>
  </div>
    </div>

</template>

<script>
import zoho from "@/utils/zoho"; // zoho客服
import { getIMConfig } from "./api";
let qidianDomIdTarget;
export default {
  data() {
    return {
      // im 配置信息，从接口获取
      imConfig: null,
      // 未读消息数
      unReadCount: 0,
      // 只表示在本组件创建后，收到了 qidianIM 的 ready 回调。组件销毁再创建的场景是 false
      receiveReadyCallback: false,
      webImUrl: "",
      isCustomerServicePage: false,
    };
  },
  computed: {
    unReadCountText() {
      const val = this.unReadCount;
      if (val) {
        if (val > 99) {
          return "99+";
        }
        return String(val);
      }
      return "";
    },
  },
  mounted() {
    this.init();
    this.isCustomerServicePage = this.$route.path === "/customerService";
  },
  methods: {
    init() {
      const { id } = JSON.parse(localStorage.getItem("userInfo"));
      getIMConfig(id).then((config) => {
        this.imConfig = config;
        this.unReadCount = config.imUnReadCount || 0;
        this.webImUrl = config.webImUrl;
        // 启用了腾讯IM功能，需要初始化IM后续流程由IM负责；否则走原有的流程
        if (config.imEnable) {
          this.createQidianIM(config.code);
        } else {
          this.createZohoIM();
        }
      });
    },
    getQidianKey() {
      const isProduction = process.env.NODE_ENV === "production";
      // 中英文是使用的不同的脚本地址，所以切换语言时必须刷新页面
      // const isZh = this.$i18n.locale === "zh";
      return isProduction
        ? "5c1c1161e554e459b426f909f99300c0"
        : "5ef69c2da207be3d461f0cd281bad1ed";
    },
    createQidianIM(code) {
      const vm = this;
      // const isZh = vm.$i18n.locale === "zh";
      // 中英文是使用的不同的脚本地址，所以切换语言时必须刷新页面
      const key = this.getQidianKey();
      const scriptId = "qd_" + key;
      const scriptUrl = `https://wp.qiye.qq.com/qidian/2355021264/${key}`;
      const qidianScript = document.getElementById(scriptId);
      if (qidianScript) return;
      // 1、指定sdk导出变量名
      //（qiandian文档官方代码，在window上扩展 qidianWPA 属性）
      (function (w, a, m) {
        m = "__qq_qidian_wpa";
        w[m] = a;
        w[a] =
          w[a] ||
          function (p) {
            return function () {
              (w[a]._q = w[a]._q || []).push([p, arguments]);
            };
          };
        const ifs = ["afterLogin"];
        for (let i = 0; i < ifs.length; i++) {
          w[a][ifs[i]] = w[a].call(null, ifs[i]);
        }
      })(window, "qidianWPA");
      // 2、在导出变量上定义beforeLogin函数，需要在beforeLogin中实现sso授权。
      window.qidianWPA.beforeLogin = function (key) {
        // 传递参数给afterLogin，打开聊天窗口
        const wpaInfo = { key: key, open: true, auth: "commonAuthCredential" };
        const ssoParams = { code, signature: "sign" };
        window.qidianWPA.afterLogin(wpaInfo, ssoParams);
      };
      // 3.加载 sdk，sdk加载后会自动初始化
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      document.body.appendChild(script);
      script.onload = () => {
        // 脚本加载后，会在 window 上挂载 __WPAV2 变量
        window.__WPAV2.ready(function () {
          // if (!isZh) {
          // 只能在ready事件里设置有效
          // window.__WPAV2.IM.set("qidian_lang", "en-us");
          // }
          vm.receiveReadyCallback = true;
          // 保持对 qidian domId 元素的引用，不要销毁
          qidianDomIdTarget = document.getElementById(
            "customer-service-entrance"
          );
        });
      };
    },
    createZohoIM() {
      const path = this.$route.path;
      zoho.init(path); // 调用原逻辑
    },
    onIconClick() {
      this.unReadCount = 0;
      // fix: qidian 只会在sdk加载后对 domId 执行一次事件绑定，此后元素销毁后对应的点击事件也就没了。所以这里要增加一个特殊处理
      if (!this.receiveReadyCallback) {
        if (qidianDomIdTarget) {
          qidianDomIdTarget.click();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vdr {
  border: none;
}
.cs-entrance-icon-wrapper {
  position: fixed;
  right: 10px;
  bottom: 110px;
  width: 40px;
  height: 40px;
  z-index: 9999;
  img {
    cursor: pointer;
    width: 40px;
    height: 40px;
  }
  .my-handle-class {
    width: 50px;
    height: 90px;
    background: #7580E5;
    text-align: center;
    border-radius: 4px;
    cursor: move;
    .handle-icon {
      height: 40px;
      width: 100%;
      background-image: url("../../assets/touchCall/move_handel.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
.cs-entrance-icon-badge {
  position: absolute;
  top: 10px;
  right: 20px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
}
</style>
