<template>
  <div
    class="login-container"
    :style="{ backgroundImage: `url(${loginbg})`, backgroundSize: '100% 100%' }"
  >
    <transition name="login-box-slide-fade">
      <el-form
        @submit.native.prevent
        v-if="loginBoxShow"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :style="{
          width: currentLang == 'en' ? '410px' : '320px',
          marginTop: isMobile ? '0px' : '190px',
        }"
      >
        <div
          v-if="loginStep === 2"
          class="back-btn"
          @click="(loginStep = 1), (loading = false)"
        >
          <i class="el-icon-back"></i> {{ $t("返回") }}
        </div>
        <div
          v-show="!isMobile"
          class="threeyear"
          :style="{ backgroundImage: `url(${title})`, backgroundSize: '100%' }"
        ></div>
        <div
          class="tigger"
          :style="{ backgroundImage: `url(${tigger})`, backgroundSize: '100%' }"
        ></div>
        <div class="title-container">
          <img :src="logo" alt="" />
          <p
            class="title font-normal-family"
            :style="{ 'font-size': currentLang == 'en' ? '18px' : '22px' }"
          >
            {{ this.$t("glb-Operation  Management  System") }}
          </p>
        </div>
        <template v-if="loginStep === 1">
          <el-form-item ref="username" class="username" prop="username">
            <i
              class="userIcon"
              :style="{
                backgroundImage: `url(${userIcon})`,
                backgroundSize: '80%',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                top: '9px',
                left: '10px',
              }"
            ></i>
            <el-input
              v-model="loginForm.username"
              :placeholder="$t('account')"
              name="username"
              type="text"
              auto-complete="on"
              @focus="usernameFocus"
              @blur="usernameBlur"
              @change="showCheckSSOBtn = true"
            />
          </el-form-item>
          <el-button
            v-if="showCheckSSOBtn"
            type="primary"
            :style="{
              backgroundColor: '#7580E5',
              border: `1px solid #7580E5`,
              fontSize: '16px',
            }"
            :loading="checkLoading"
            :disabled="!loginForm.username.length"
            class="btn-login"
            style="width: 100%; border-radius: 8px; margin-top: 40px"
            @click="handleCheckCanSSOLogin"
            >{{ $t("账号验证") }}</el-button
          >
          <el-form-item
            v-if="!showCheckSSOBtn && !canSSOLogin"
            ref="password"
            class="password"
            prop="password"
          >
            <i
              class="userIcon"
              :style="{
                backgroundImage: `url(${loginlock})`,
                backgroundSize: '80%',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                top: '9px',
                left: '10px',
              }"
            ></i>
            <el-input
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('glb-Password')"
              name="password"
              auto-complete="on"
              @focus="pswFocus"
              @blur="pswBlur"
            />
            <span
              class="show-pwd"
              :style="{ color: themeColor }"
              @click="showPwd"
            >
              <i
                class="userIcon"
                :style="{
                  backgroundImage: `url(${eyes})`,
                  backgroundSize: '80%',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  top: '9px',
                }"
              >
              </i>
            </span>
          </el-form-item>
          <el-button
            v-if="!showCheckSSOBtn && !canSSOLogin"
            class="btn-login"
            :style="{
              backgroundColor: '#7580E5',
              border: `1px solid #7580E5`,
              fontSize: '16px',
              marginTop: '10px',
              fontFamily: 'lingoaceFzy',
            }"
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 30px; border-radius: 8px"
            @click="handleLogin"
            >{{ $t("glb-Log verify") }}</el-button
          >
        </template>
        <template v-if="loginStep === 2">
          <el-form-item ref="authCode" class="usercode" prop="authCode">
            <i
              class="userIcon"
              :style="{
                backgroundImage: `url(${loginlock})`,
                backgroundSize: '80%',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                top: '9px',
                left: '10px',
              }"
            ></i>
            <el-input
              v-model="loginForm.authCode"
              :placeholder="$t('请输入验证码')"
              @input="
                loginForm.authCode = loginForm.authCode.replace(/[^\d]/g, '')
              "
              name="authCode"
              type="text"
              ref="authCode"
              maxlength="6"
              @keyup.enter.native="handleVerification"
            />
          </el-form-item>
          <el-button
            class="btn-verificate"
            :style="{
              fontSize: '16px',
              marginTop: '40px',
              fontFamily: 'lingoaceFzy',
            }"
            :loading="verificateLoading"
            :disabled="loginForm.authCode.length <= 0"
            type="primary"
            style="width: 100%; margin-bottom: 30px; border-radius: 8px"
            @click="handleVerification"
            >{{ $t("glb-Log in") }}</el-button
          >
        </template>
      </el-form>
    </transition>
    <ChangePassword
      necessary="1"
      v-if="userInfo.userInfo != null"
      :show="showChangePsw"
      :userInfo="userInfo"
      @closeChangePsw="closeChangePsw"
    ></ChangePassword>
  </div>
</template>
<script>
const crypto = require("crypto"); // 引入加密模块
import ResizeMixin from "@/views/layout/mixin/ResizeHandler";
import { mapGetters, mapMutations, mapActions } from "vuex";
import errRouterMap from "@/router/base/error";
import { formatMenuMap } from "@/utils/handleData";
import logo from "@/assets/newlogo.png";
import loginbg from "@/assets/newbg.png";
import tigger from "@/assets/tigger.png";
import title from "@/assets/title@2x.png";
import userIcon from "@/assets/userIcon.png";
import loginlock from "@/assets/loginlock.png";
import openeyes from "@/assets/openeyes.png";
import closeeyes from "@/assets/closeeyes.png";
import styles from "../../styles/variables.scss";
import ChangePassword from "../systemManagement/userSub/ChangePassword";
import { setCookiesLoginInfo } from "@/views/login/autoLogin.js";
import { toSSOPage } from "@/utils/sso.js";

export default {
  name: "Login",
  mixins: [ResizeMixin],
  components: {
    ChangePassword,
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error(this.$t("glb-Account Cannot be Empty")));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error(this.$t("glb-Password Cannot be Empty")));
      } else {
        callback();
      }
    };
    return {
      showCheckSSOBtn: true,
      canSSOLogin: false,
      checkLoading: false,
      authToken: "",
      loginStep: 1,
      showChangePsw: false,
      loginBoxShow: false,
      loginbg: loginbg,
      tigger: tigger,
      title: title,
      userIcon: userIcon,
      loginlock: loginlock,
      openeyes: openeyes,
      closeeyes: closeeyes,
      eyes: closeeyes,
      eyesFlag: true,
      logo: logo,
      loginForm: {
        username: "",
        password: "",
        authCode: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      userId: "",
      loading: false,
      verificateLoading: false,
      showDialog: false,
      bgColor: styles.customPrimaryColor,
      userInfo: {
        userInfo: null,
      },
    };
  },
  computed: {
    ...mapGetters(["themeColor", "device", "currentLang"]),
    isMobile() {
      return window.localStorage.getItem("deviceType") === "mobile";
    },
  },
  watch: {
    eyesFlag(newData) {
      if (newData) {
        this.eyes = this.closeeyes;
        this.passwordType = "password";
      } else {
        this.eyes = this.openeyes;
        this.passwordType = "";
      }
    },
  },
  methods: {
    closeChangePsw() {
      this.showChangePsw = false;
      this._getAllPremission();
    },
    ...mapActions(["getTokenAction"]),
    usernameFocus() {
      this.$refs.username.$el.style.border = `1px solid ${this.bgColor}`;
    },
    usernameBlur() {
      this.$refs.username.$el.style.border = `1px solid #eaeaea`;
    },
    pswFocus() {
      this.$refs.password.$el.style.border = `1px solid ${this.bgColor}`;
    },
    pswBlur() {
      this.$refs.password.$el.style.border = `1px solid #eaeaea`;
    },
    showPwd() {
      this.eyesFlag = !this.eyesFlag;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          var md5 = crypto.createHash("md5"); //创建 MD5算法
          md5.update(this.loginForm.password); // 加密数据
          var psw = md5.digest("hex"); // 加密结果
          this.$Api.base
            .opsLogin({
              identify: this.loginForm.username,
              password: psw,
            })
            .then(({ status, data }) => {
              if (data.code == 200) {
                this.loginStep = 2;
                this.authToken = data?.data?.authToken || "";
                this.$notify.success(
                  this.$t("验证码已发送至您的手机或邮箱，请注意查收")
                );
                this.$nextTick(() => {
                  this.$refs.authCode.focus();
                });
              }
              this.loading = false;
            })
            .finally((_) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 登陆验证
    handleVerification() {
      this.verificateLoading = true;
      this.$Api.base
        .opsLoginVerification({
          identify: this.loginForm.username,
          authToken: this.authToken,
          authCode: this.loginForm.authCode,
        })
        .then(({ status, data }) => {
          this.userId = data.data.id;
          this.setUserName(this.loginForm.username);
          this.setToken("登录"); // 后台不返回token用cookie存储
          this.setUserInfo(JSON.stringify(data.data));
          setCookiesLoginInfo(JSON.stringify(data.data));
          this.userInfo.userInfo = data.data;
          if (
            data.data.passwordStatus !== 0 &&
            process.env.NODE_ENV !== "development"
          ) {
            this.showChangePsw = true;
            // 提示原因
            if (data.data.passwordStatus == 2) {
              this.$notify({
                message: this.$t("glb-Password Expiration error"),
                type: "warning",
              });
            }
          } else {
            this._getAllPremission();
          }
          this.getUserDepartmentInfo(data.data);
        })
        .finally((_) => {
          this.verificateLoading = false;
        });
    },
    /**获取部门信息 */
    getUserDepartmentInfo(userBaseInfo) {
      this.$Api.base
        .getUserDepartment(this.userId)
        .then(({ data }) => {
          const userObj = Object.assign({}, userBaseInfo, {
            department: data?.data?.nameZh,
          });
        })
        .catch(() => {});
    },
    _getAllPremission() {
      this._getUserPermission();
      // 获取学管和顾问
      this.$Api.systemManagement.getSystemRolesList().then((res3) => {
        if (res3.status == 200 && res3.data.code == 200) {
          let gwUserId = res3.data.data.find(
              (item) => item.code == "StudyAdvisor"
            ),
            xgUserId = res3.data.data.find(
              (item) => item.code == "CourseConsultant"
            ),
            jgUserId = res3.data.data.find(
              (item) => item.code == "TeacherManagement"
            );
          if (gwUserId && xgUserId && jgUserId) {
            let str = `${gwUserId.id},${xgUserId.id},${jgUserId.id}`;
            this.$Api.systemManagement
              .getThisRoleUserLists(str)
              .then((res4) => {
                if (res4.status == 200 && res4.data.code == 200) {
                  this.setXgAndGwList(res4.data.data);
                }
              });
          }
        }
      });
    },
    _getUserPermission() {
      this.$Api.base.getUserPermission(this.userId).then(({ status, data }) => {
        let userPermissionViews = data.data.permissionList;
        // 将系统所有的权限集合存进vuex
        this.setSystemPermissionList(userPermissionViews);
        // 把用户拥有的权限的数据集合存进vuex
        this.setUserPermissionViews(userPermissionViews);
        // 把用户的按钮权限存入vuex
        let userBtnsViews = userPermissionViews.filter(
          (item) => item.type == this.ApiConstants.buttonViewCode
        );
        this.setUserBtnsViews(userBtnsViews);
        // 把用户tabs权限存入vuex
        let userTabsViews = userPermissionViews.filter(
          (item) => item.type == this.ApiConstants.tabViewCode
        );
        this.setUserTabsViews(userTabsViews);
        // 构建用户权限树
        let tree = [];
        userPermissionViews.forEach((item) => {
          if (item.pid == null || item.level == 3) {
            tree.push(item);
          } else {
            userPermissionViews.forEach((ite) => {
              // 此处仅构建用户菜单视图权限树，不注入 tab 权限 和 button 权限
              if (ite.id == item.pid && item.type != 3 && item.type != 2) {
                ite.children = ite.children || [];
                ite.children.push(item);
                ite.children.sort((a, b) => {
                  return a.orderNo - b.orderNo;
                });
              }
            });
          }
        });
        let menuMap = formatMenuMap(tree);
        let secondMenuIndex = null;
        // 菜单排序
        menuMap.sort((a, b) => {
          return a.orderNo - b.orderNo;
        });
        if (
          menuMap[0] &&
          menuMap[0].children[0] &&
          menuMap[0].children[0].children
        ) {
          secondMenuIndex = menuMap[0].children[0].children[0];
        } else if (menuMap[0] && menuMap[0].children[0]) {
          secondMenuIndex = menuMap[0].children[0];
        } else {
          secondMenuIndex = { url: "/page/401" };
        }
        // 自动跳转到首页
        secondMenuIndex = { url: "/home/index" };
        // 获取当前版本并加载当前版本的路由
        let routers = require("@/router/admin/").default;
        routers = [].concat(
          routers,
          {
            path: "/",
            redirect: secondMenuIndex.url,
          },
          errRouterMap
        );
        this.$router.addRoutes(routers);

        // 初始化菜单和默认显示菜单
        this.setUserViewsTree(menuMap);
        this.setMenuMap(menuMap);
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.setMenuIndex([0, secondMenuIndex, secondMenuIndex.url]);
        }
        this.loading = false;
        this.loginStep = 1;
      });
    },

    ...mapMutations({
      setMenuMap: "SET_MENU_MAP",
      setMenuIndex: "SET_MENU_INDEX",
      setToken: "SET_TOKEN",
      setUserInfo: "SET_USER_INFO",
      setUserName: "SET_USERNAME",
      setSystemPermissionList: "SET_SYSTEM_PERMISSION_LIST",
      setUserPermissionViews: "SET_USER_PERMISSION_VIEWS",
      setUserViewsTree: "SET_USER_VIEWS_TREE",
      setUserBtnsViews: "SET_USER_BTNS_VIEWS",
      setUserTabsViews: "SET_USER_TABS_VIEWS",
      setXgAndGwList: "SET_XG_AND_GW_LIST",
    }),
    async handleCheckCanSSOLogin() {
      try {
        this.checkLoading = true;
        const flag = await this.$Api.base.reqSSOLoginStatus({
          username: this.loginForm.username,
        });
        if (flag) {
          this.canSSOLogin = false;
          this.showCheckSSOBtn = false;
        } else {
          toSSOPage();
          // setTimeout(() => {
          //   this.$router.push({ path: "/home/index" });
          // }, 1000);
        }
      } finally {
        this.checkLoading = false;
      }
    },
  },
  mounted() {
    this.loginBoxShow = true;
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/variables.scss";
$light_gray: #3b3b4d;
$dark_gray: #24cbda;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: #999;
    }
  }
}

/* reset element-ui css */
.login-container {
  background-color: #f1f3f5 !important;
  position: relative;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $dark_gray;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $cursor inset !important;
        -webkit-text-fill-color: $light_gray !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #eaeaea;
    background: $cursor;
    border-radius: 5px;
    color: #454545;
    transition: all 0.5s;
  }
  .focus-border {
    border: 1px solid $customPrimaryColor !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #f4f0e4;
$dark_gray: #24cbda;
$light_gray: #3b3b4d;
.font-normal-family {
  font-family: lingoaceFzy !important;
  font-size: 22px;
}
.tigger {
  width: 123px;
  height: 73.5px;
  position: absolute;
  top: -63.5px;
  left: 50%;
  margin-left: -53.5px;
}
.threeyear {
  width: 415.5px;
  height: 138px;
  position: absolute;
  left: 50%;
  top: -202px;
  margin-left: -203.75px;
  background-repeat: no-repeat;
}
.userIcon {
  width: 24px;
  height: 24px;
  display: inline-block;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .el-input input::first-line {
    color: none;
  }
  .login-form {
    padding: 28px 15px;
    background: $bg;
    box-shadow: 0px 8px 15px 1px rgba(3, 0, 0, 0.24);
    border-radius: 8px;
    position: relative;
    z-index: 99;
    height: 360px;
    margin-top: 190px;
    .back-btn {
      color: #999999;
      font-size: 16px;
      cursor: pointer;
    }
    .username {
      margin: 15px 0;
    }
    .password {
      margin-bottom: 30px;
    }
    .btn-login {
      height: 45px;
      font-size: 14px;
      box-shadow: 0px 8px 15px 1px rgba(3, 0, 0, 0.24);
      background: rgba(255, 255, 255, 1);
      margin-top: 18px;
    }
    .usercode {
      margin-top: 40px;
    }
  }
  .icon-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Microsoft Yahei";
    margin: 0 auto 25px auto;
    img {
      width: 128px;
      height: 44px;
    }
    .title {
      font-family: "Hiragino Sans GB";
      color: #444444;
      margin: 0px;
      font-weight: normal;
      text-align: center;
      position: relative;
      top: 5px;
      margin-top: 5px;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
