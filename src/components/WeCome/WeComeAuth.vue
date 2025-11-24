<!-- 企微网页授权 https://developer.work.weixin.qq.com/document/path/91120#%E6%9E%84%E9%80%A0%E4%BC%81%E4%B8%9Aoauth2%E9%93%BE%E6%8E%A5 -->
<template>
  <div class="wecome-auth">
    <div v-if="loading">loading...</div>
    <div v-else-if="isNotBinding">
      <div>账号绑定提示：</div>
      <div>Tips:</div>
      <div class="mt20">
        您的企业微信还没有与OPS账号绑定，无法登录。请联系技术支持人员进行绑定。
      </div>
      <div>
        Your Enterprise WeChat is not yet bound to your OPS account and you cannot log in. Please contact technical
        support staff for binding.
      </div>
    </div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { setCookiesLoginInfo } from "@/views/login/autoLogin.js";

export default {
  data() {
    return {
      loading: false,
      // 企微没有和OPS账号绑定
      isNotBinding: false,
      errorMessage: ''
    }
  },
  methods: {
    ...mapMutations({
      setToken: "SET_TOKEN",
      setUserInfo: "SET_USER_INFO",
      setUserName: "SET_USERNAME",
    }),
    async init() {
      // 企业微信授权 code
      const code = this.$route.query.code;
      if (code) {
        const data = await this.getAuthByWeComeCode(code);
        this.setAuthData(data);
      } else {
        this.loading = true;
        this.goWeComeAuth();
      }
    },
    goWeComeAuth() {
      const appId = 'ww2e9d48685d7dc479'; // 企业的CorpID
      // 授权后重定向的回调链接地址，请使用urlencode对链接进行处理。redirect_uri的域名必须与该应用的可信域名一致。
      const redirect_uri = encodeURIComponent(window.location.href);
      // 企业应用的id。建议填上该参数（对于第三方应用和代开发自建应用，在填写该参数的情况下或者在工作台、聊天工具栏、应用会话内发起oauth2请求的场景中，会触发接口许可的自动激活）
      // OPS 工单 AgentId = 1000115 / OPS IM AgentId = 1000119
      const agentid = this.$route.query.agentid || '';
      const state = '';
      const wecomeAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&agentid=${agentid}&state=${state}#wechat_redirect`;
      window.location.replace(wecomeAuthUrl);
    },
    // 根据企业微信授权 code 获取员工身份信息
    getAuthByWeComeCode(code) {
      const isProduction = process.env.VUE_APP_ENV === 'production';
      // 生产环境请求同域名
      const origin = isProduction ? window.location.origin : 'https://test-classroom-gateway.lingo-ace.com';
      const data = {
        authCode: code,
        agentId: this.$route.query.agentid, // 企业应用ID，OPS 工单 AgentId: 1000115
      };
      return fetch(`${origin}/opsapi/ticket/api/v1/ticket/wecom/auth`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(res => {
          const code = res.code;
          if (code !== 0) {
            throw new Error(res.message);
          }
          // 结果：0: 成功、1: 失败、2: 未绑定OPS 账号
          const result = res.data.result;
          if (result === 0) {
            return res.data;
          } else if (result === 2) {
            this.isNotBinding = true;
          } else {
            throw new Error(res.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.errorMessage = error.message ?? 'Request error';
        });
    },
    setAuthData(data) {
      const { jwtToken, userName } = data;
      if (jwtToken) {
        // this.setToken(jwtToken);
        this.setToken("登录"); // ？？？ 登录页面就是这么写的
      }
      if (userName) {
        this.setUserName(userName);
      }
      // 尽量构造登录时的用户信息
      const userInfo = {
        id: data.userId,
        jwtToken,
        jwtExpireTime: data.jwtExpireTime,
        nameEn: userName,
        nameZh: userName,
        realName: data.realName,
        username: userName,
      };
      const jsonStr = JSON.stringify(userInfo);
      this.setUserInfo(jsonStr);
      setCookiesLoginInfo(jsonStr);
      // 鉴权完成
      this.$emit('success');
    },
  },
  created() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.wecome-auth {
  padding: 30px 20px;
}
</style>
