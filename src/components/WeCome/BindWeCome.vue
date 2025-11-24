<template>
  <div class="bind-wecome" v-loading="loading">
    <el-button class="logout-btn" type="default" round size="small" @click="logout">
      {{ $t("退出登录") }}
    </el-button>
    <!-- 已绑定 -->
    <template v-if="isSuccess && !isReBind">
      <div class="success-tips">{{ $t('企业微信绑定成功') }}</div>
      <div class="mt-20">
        <el-button type="primary" plain @click="rebind">{{ $t('更换企业微信号') }}</el-button>
        <el-button type="primary" @click="goHome">{{ $t('回到首页') }}</el-button>
      </div>
    </template>
    <template v-else>
      <iframe v-if="bindUrl" :src="bindUrl" class="wecome-iframe"></iframe>
      <el-button v-else type="primary" @click="rebind">{{ $t('获取绑定二维码') }}</el-button>
      <div class="qr-tips mt-20">
        <div class="remark">{{ $t('企业微信绑定说明-1') }}</div>
        <i18n path="企业微信绑定失败说明" tag="div" class="failed-tips mt-10">
            <template #br>
                <br />
            </template>
        </i18n>
      </div>
    </template>
  </div>
</template>

<script>
import api from './api';
import { removeCookiesLoginInfo } from "@/views/login/autoLogin.js";

export default {
  name: 'BindWeCome',
  data() {
    return {
      loading: false,
      isSuccess: false, // 是否已绑定
      bindUrl: "", // 企微方的绑定地址，like: https://open.work.weixin.qq.com/...
      isReBind: false, // 是否重新绑定
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    }
  },
  methods: {
    init() {
      window.addEventListener('message', this.onWindowMessage);
      const { code, state } = this.$route.query;
      // 有这两个参数表示是企业微信回跳来的
      if (code && state) {
        // 这里有个有趣的现象：如果iframe内部导航后地址和当前定级窗口地址一致，会在当前顶级窗口上改变url.也许是企微内部使用了命名窗口
        const hasParentWindow = window.parent !== window;
        // 如果是 iframe 嵌套环境，则发送给父窗口
        if (hasParentWindow) {
          window.parent.postMessage({
            type: 'bind_wecome_redirect',
            code,
            state
          }, '*');
        } else {
          this.postBind(code, state);
        }
      } else {
        console.log('this.$route.params:', this.$route.params);
        // 初始化绑定url，因为在组件外部，每个用户打开ops的时候都需要检查一下是否已绑定企微，该接口本身就是获取绑定url，所以这里可以直接使用
        const initBindUrl = this.$route.params.initBindUrl;
        if (initBindUrl) {
          this.bindUrl = initBindUrl;
        } else {
          this.getBindUrl();
        }
      }
    },
    onWindowMessage(event) {
      // console.log('onWindowMessage:', event);
      const data = event.data || {};
      if (data.type === 'bind_wecome_redirect') {
        this.postBind(data.code, data.state);
      }
    },
    getBindUrl() {
      this.loading = true;
      api.getUserWecomeBindUrl(this.isReBind).then(data => {
        if (data === null) {
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
          if (typeof data === 'string' && data.startsWith('https://')) {
            this.bindUrl = data;
          }
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 提交企业微信绑定
    postBind(code, state) {
      this.loading = true;
      api.bindWeCome(code, state).then(res => {
        const { code, data, message } = res.data;
        if (code === 200) {
          // 绑定成功
          this.isSuccess = true;
          this.isReBind = false;
          this.$alert(this.$t('企微绑定成功提示文案'), this.$t('绑定成功'), {
            confirmButtonText: this.$t('确认'),
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            type: 'success'
          });
        } else {
          // 绑定失败
          this.isSuccess = false;
          let errorMsg = message;
          // 如果有多语言的话，可以使用 data[lang] 来获取对应语言的错误信息
          if (data && data[this.lang]) {
            errorMsg = data[this.lang];
          }
          this.$alert(errorMsg, this.$t('失败'), {
            confirmButtonText: this.$t('确认'),
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            type: 'error'
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    rebind() {
      this.isReBind = true;
      this.getBindUrl();
    },
    goHome() {
      this.$router.push({
        path: '/home/index'
      });
      // window.location.href = '/home/index';
    },
    logout() {
      removeCookiesLoginInfo();
      window.location.href = "/login";
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onWindowMessage);
  }
};
</script>

<style lang="scss" scoped>
.bind-wecome {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.success-tips {
  font-size: 14px;
  color: #000;
  line-height: 1.5;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.qr-tips {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.failed-tips {
  line-height: 1.5;
}

.wecome-iframe {
  width: 378px;
  height: 400px;
  border: 0;
}

.logout-btn {
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>
