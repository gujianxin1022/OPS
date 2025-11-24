<template>
  <div
    class="flex-wrapper flex-column-center navbar"
    :style="{
      'margin-left': device !== 'mobile' ? (opened ? '180px' : '60px') : '0',
    }"
  >
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <div class="flex-wrapper flex-space-between flex-item" mode="horizontal">
      <module-menu
        v-if="device !== 'mobile'"
        @currentTabIndex="getCurrentTabIndex"
      />
      <div class="right-menu flex-wrapper flex-column-center">
        <!-- 切换语言 -->
        <div class="lang">
          <span :class="{ 'lang-active': isEng }" @click="setup('en')"
            >ENG</span
          >
          <span :class="{ 'lang-active': !isEng }" @click="setup('zh')"
            >中文</span
          >
        </div>
        <!-- 消息提示 -->
        <div @click="openDrawer" class="messageTips">
          <el-badge
            :hidden="messageTipsVal === 0"
            :value="messageTipsVal"
            :max="99"
          >
            <img
              class="messageTips-img"
              src="../../../../assets/messageTips.png"
              alt=""
            />
          </el-badge>
          <!-- <img v-show="messageTipsVal === 0" class="messageTips-img" src="../../../../assets/messageTips.png" alt="" /> -->
        </div>
        <!-- 个人信息 -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('statistical analysis')"
          placement="top"
        >
          <img
            @click="goStacks"
            class="dataicon"
            src="../../../../assets/dataIcon.png"
            alt
          />
        </el-tooltip>
        <div>
          <el-dropdown class="avatar-container" trigger="hover">
            <span>
              <span class="name" style="font-size: 12px">{{ user }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="changePassword">{{
                  $t("glb-Change Password")
                }}</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="goBindWeCome">{{
                  $t("绑定/修改企业微信账号")
                }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="exit-btn">
          <el-button type="default" round size="small" @click="layout">
            {{ $t("退出登录") }}
            <i class="fa fa-sign-out"></i>
          </el-button>
        </div>
        <!-- 下拉 -->
        <!-- 换肤 -->
        <!-- <el-tooltip content="换肤" effect="dark" placement="bottom">
          <theme-picker class="right-menu-item" />
        </el-tooltip>-->
      </div>
    </div>
    <ChangePassword
      :show="showChangePsw"
      :userInfo="userInfo"
      @closeChangePsw="closeChangePsw"
    ></ChangePassword>
    <MessageTips ref="messageTips" @getMessageNum="getUnreadMessage" />
    
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import ThemePicker from "@/components/ThemePicker";
import ModuleMenu from "../ModuleMenu";
import { getStorage } from "@/utils/handleStorage";
import HandleToken from "@/utils/auth";
const handleToken = new HandleToken();
import ChangePassword from "../../../systemManagement/userSub/ChangePassword";
import { setup } from "@/assets/locales/index";
import MessageTips from "../MessageTips/index.vue";
import { removeCookiesLoginInfo } from "@/views/login/autoLogin.js";
import { toSSOLogOutPage} from "@/utils/sso.js";

export default {
  name: "Navbar",
  components: {
    Hamburger,
    ThemePicker,
    ModuleMenu,
    ChangePassword,
    MessageTips,
  },
  data() {
    return {
      isEng: this.$i18n.locale == "en" ? true : false,
      flag: this.$i18n.locale,
      user: this.userName || getStorage("userName"),
      showChangePsw: false,
      tabIndex: "", //tabIndex
      parentInfo: null, //家长信息
      isShowloadMore: true,
      currentPageNo: 0,
      // loadingText:'获取消息中...'
      messageTipsVal: 0,
      // 轮询定时器
      timer: null,
      showBindWeComeDialog: false,
      bindWeComeDialogClosable: true, // 绑定企业微信弹窗是否可关闭
    };
  },

  created() {
    this.getUnreadMessage();
    this.createSetInterval();
  },

  destroyed() {
    this.stopSetInterval();
  },
  computed: {
    ...mapGetters([
      "token",
      "sidebar",
      "themeColor",
      "device",
      "userName",
      "opened",
      "client",
      "currentLang",
    ]),
    userInfo() {
      return { userInfo: JSON.parse(window.localStorage.getItem("userInfo")) };
    },
  },

  methods: {
    ...mapMutations(["CLEAR_LM_WORKBENCH_DATA"]),
    // 打开消息弹框
    openDrawer() {
      this.$refs.messageTips.open();
    },
    // 查询未读消息数量
    getUnreadMessage() {
      this.$Api.base
        .getUnreadMessage(this.userInfo.userInfo.id)
        .then(({ data }) => {
          if (data.code === 200) {
            this.messageTipsVal = data?.data;
          }
        });
    },
    // 创建轮询定时器任务
    createSetInterval() {
      this.stopSetInterval();
      this.timer = setInterval(() => {
        this.getUnreadMessage();
      }, 60000);
    },
    // 清除轮序定时器
    stopSetInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    setup(flag) {
      if (flag == this.flag) {
        return false;
      }
      this.flag = flag;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setup(flag);
      this.isEng = !this.isEng;
      window.location.reload();
    },
    goStacks() {
      window.open("https://report.lingoace.com/", "__blank");
    },
    toggleSideBar() {
      this.toggleSideBar();
    },
    closeChangePsw() {
      this.showChangePsw = false;
    },
    changePassword() {
      this.showChangePsw = true;
    },
    // 显示绑定企业微信弹窗
    goBindWeCome() {
      this.$router.push("/wecome/bind");
    },
    async layout() {
      await this.$Api.base.opsLogOut();
      removeCookiesLoginInfo();
      this.$eventBus.$emit("clearTimer");
      this.$router.push({ path: "/login" });
      this.CLEAR_LM_WORKBENCH_DATA();
      // toSSOLogOutPage()
      window.location.reload();
    },
    getCurrentTabIndex(index) {
      this.$emit("currentTabIndex", index);
    },
    ...mapMutations({
      toggleSideBar: "TOGGLE_SIDEBAR",
    }),
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.lang {
  font-size: 12px;
  padding: 5px 15px 0 0;

  .lang-active {
    color: #7580e5;
  }
}
::v-deep .el-tabs__header {
  margin-top: 6px !important;
}

.dataicon {
  outline: none;
  width: 25px;
  height: 25px;
  margin: 0 20px 0 5px;
}

.navbar {
  border-radius: 0px !important;
  height: 50px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  transition: margin-left 0.28s;
  background-color: white;

  .hamburger-container {
    margin: 0 25px 0 20px;
  }

  .hamburger ::v-deep .line {
    background-color: #fff !important;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    color: #444444;
    margin-right: 20px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 10px;
    }

    .avatar-container {
      color: #333;

      .name {
        margin-right: 10px;
      }
    }
  }
}

.messageTips {
  display: inline-block;
  margin: 5px 15px 0 0;
  .messageTips-img {
    width: 25px;
    height: 25px;
  }
}
</style>
