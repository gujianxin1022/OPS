<template>
  <span class="touch-call-icon" style="margin: 0">
    <img
      v-show="!calling"
      class="icon"
      @click="reqSDKURL"
      src="../../../assets/touchCall/phone.png"
      alt=""
    />
    <img
      v-show="calling"
      class="icon"
      src="../../../assets/touchCall/calling.png"
      alt=""
    />
  </span>
</template>
<script>
import { ref, computed, watch } from "@vue/composition-api";
import { getStorage } from "@/utils/handleStorage";
export default {
  props: ["parentUserId", "type"],
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const tcccSdk = ref(null);
    const calling = ref(false);
    const reqSDKURL = async () => {
      try {
        removeTccc();
      } finally {
        const { username, id } = JSON.parse(getStorage("userInfo"));
        calling.value = true;
        try {
          tcccSdk.value = null;
          const res = await root.$Api.studentManagement.reqLoginTCCC({
            parentId: props.parentUserId,
            staffId: id,
            staffUserName: username,
            type: props.type,
          });
          tcccSdk.value = res;
          injectTcccWebSDK();
        } catch {
          calling.value = false;
        }
      }
    };
    const injectTcccWebSDK = async () => {
      if (window.tccc) {
        console.warn("已经初始化SDK了，请确认是否重复执行初始化");
        return;
      }
      console.log("初始化开始");
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("id", "lingoaceTccc");
        script.src = tcccSdk.value.sdkURL;
        document.body.appendChild(script);
        script.addEventListener("load", listenerFun);
      });
    };
    const listenerFun = () => {
      // 加载JS SDK文件成功，此时可使用全局变量"tccc"
      console.log("初始化成功");
      window.tccc.on(window.tccc.events.ready, sdkCall);
      window.tccc.on(window.tccc.events.calloutAccepted, handleCalloutAccepted);
      window.tccc.on(window.tccc.events.sessionEnded, removeTccc);
      window.tccc.on(window.tccc.events.tokenExpired, removeTccc);
    };
    /* 接通电话处理函数 */
    const handleCalloutAccepted = () => {
      console.log("接通电话calloutAccepted");
    };
    const disabled = ref(false);
    const sdkCall = () => {
      if (disabled.value) {
        return root.$notify({
          message: "呼叫结果响应之前禁止二次外呼",
          type: "error",
        });
      }
      disabled.value = true;
      /**
       * Tccc SDK初始化成功，此时可调用外呼、监听呼入事件等功能。
       * 注意⚠️：请确保只初始化一次SDK
       * */
      window.tccc.UI.hidefloatButton();
      console.log("开始调用sdkCall");
      //回调使用 TODO
      window.tccc.Call.startOutboundCall({
        phoneNumber: tcccSdk.value.phoneNumber,
        uui: tcccSdk.value.uui,
        phoneDesc: "Tencent", //备注文案，将会在通话条上替代号码的显示
        skillGroupId: tcccSdk.value.skillGroupId,
      })
        .then((res) => {
          console.log("接通电话");
          // 外呼成功，并获取外呼ID，后续可用作查询关联录音、服务记录信息
          const sessionId = res.data.sessionId;
          saveSessionId(sessionId);
          disabled.value = false;
        })
        .catch((err) => {
          root.$notify({
            message: err.errorMsg,
            type: "error",
          });
          disabled.value = true;
          calling.value = false;
          removeTccc();
        });
    };
    const saveSessionId = async (sessionId) => {
      console.log("保存sessionId");
      let fm = new FormData();
      fm.append("createTs", tcccSdk.value.uui);
      fm.append("id", tcccSdk.value.id);
      fm.append("sessionId", sessionId);
      try {
        await root.$Api.studentManagement.reqSaveSessionId(fm);
        console.log("sessionId保存成功");
      } catch {
        root.$notify({
          message: root.$t("sessionId保存失败"),
          type: "error",
        });
        removeTccc();
      }
    };
    const removeTccc = async () => {
      let callScript = document.querySelector("script[id='lingoaceTccc']");
      if (!callScript) return;
      callScript.removeEventListener("load", listenerFun);
      callScript.onload = null;

      window.tccc.timer.emitter.removeAllListeners("tokenExpired");
      window.tccc.off(
        window.tccc.events.calloutAccepted,
        handleCalloutAccepted
      );
      window.tccc.off(window.tccc.events.sessionEnded, removeTccc);
      window.tccc.off(window.tccc.events.tokenExpired, removeTccc);
      window.tccc.off(window.tccc.events.ready, sdkCall);
      setTimeout(() => {
        window.tccc = undefined;
        document.body.removeChild(callScript);
        let t3cSdk = document.querySelector("t3c-sdk[id='tcccSdkDomRoot']");
        document.body.removeChild(t3cSdk);
      }, 1500);
      calling.value = false;
      console.log("移除成功");
    };
    /* 监听 */
    return {
      isEn,
      calling,
      reqSDKURL,
    };
  },
};
</script>
<style scoped lang="scss">
.touch-call-icon {
  cursor: pointer;
  padding-left: 5px;
  .icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}
</style>
