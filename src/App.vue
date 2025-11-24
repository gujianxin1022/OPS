<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="!$route.meta.noKeepAlive" />
    </keep-alive>
    <router-view v-if="$route.meta.noKeepAlive" />
  </div>
</template>

<script>
import { getCookiesLoginInfo } from "@/views/login/autoLogin.js";
import { mapMutations } from "vuex";
import { formatMenuMap } from "@/utils/handleData";
import errRouterMap from "@/router/base/error";

export default {
  name: "App",
  methods: {
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
            )
            ;
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
      this.$Api.base.getUserPermission().then(({ status, data }) => {
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
        if (window.location.pathname === "/login") {
          // 自动跳转到首页;
          secondMenuIndex = { url: "/home/index" };
        } else {
          secondMenuIndex = { url: window.location.pathname };
        }
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
        if (window.location.pathname === "/login") {
          this.setMenuIndex([0, secondMenuIndex, secondMenuIndex.url]);
        }
        this.loading = false;
        this.loginStep = 1;
      });
    },
    /**获取部门信息 */
    getUserDepartmentInfo(userBaseInfo) {
      this.$Api.base
        .getUserDepartment(userBaseInfo.id)
        .then(({ data }) => {
          const userObj = Object.assign({}, userBaseInfo, {
            department: data?.data?.nameZh,
          });
        })
        .catch(() => {});
    },
  },
  async created() {
    try {
      const {
        status,
        data: { code, data },
      } = await this.$Api.base.courseEdition();
      if (status != 200 || code !== 200) return Promise.reject();
      let courseEditionMap = new Map();
      //便利英文版课程名称
      let courseEditionMapEn = new Map();
      data.forEach((ele) => {
        courseEditionMap.set(ele.editionId, ele.editionNameZh);
      });
      data.forEach((ele) => {
        courseEditionMapEn.set(ele.editionId, ele.editionNameEn);
      });
      Vue.filter("mapEdtion", function (value) {
        let courseEdition = courseEditionMap.get(+value);
        return courseEdition ? courseEdition : "未知";
      });
      Vue.filter("mapEdtionEn", function (value) {
        let courseEditionEn = courseEditionMapEn.get(+value);
        return courseEditionEn ? courseEditionEn : "Unknown";
      });
    } catch (e) {
      console.log(e);
    }
  },
  mounted() {
    const loginInfo = getCookiesLoginInfo();
    if (loginInfo && loginInfo.length) {
      this.setToken("登录");
      this.setUserName(JSON.parse(loginInfo).username);
      this.setUserInfo(loginInfo);
      this._getAllPremission();
      this.getUserDepartmentInfo(JSON.parse(loginInfo));
    }
  },
};
</script>

<style lang="scss">
.chat-window {
  > .el-tabs {
    height: 100%;

    > .el-tabs__content {
      height: calc(100% - 50px);
      padding: 0;

      > .el-tab-pane {
        height: 100%;
      }
    }

    > .el-tabs__header {
      margin-top: 0;
    }
  }
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.chat-window {
  width: 400px;
  height: 600px;
  background: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;
}
</style>
<style>
#app {
  background: #f4f4f4;
}
#nprogress .bar {
  background: #7580e5 !important;
}
</style>
