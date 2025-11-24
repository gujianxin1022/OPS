/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getStorage } from "@/utils/handleStorage";
import { getUserPermission } from "@/api/base/";
import {
  getThisRoleUserLists,
  getSystemRolesList,
} from "@/api/systemManagement";
import ApiConstants from "../utils/api_constants";
import errRouterMap from "@/router/base/error";
import { formatMenuMap, getMenuIndex } from "@/utils/handleData";
import { logout } from "@/api/base";
import HandleToken from "@/utils/auth";
const handleToken = new HandleToken();
import { getPlatformInfo } from "@lingoace/environment-lingoace";
import { toSSOPage } from "@/utils/sso.js";

import baseRouterMap from "./base/";
Vue.use(Router);

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: baseRouterMap,
});

NProgress.configure({ showSpinner: false }); // 页面加载滚动条的设置

/**
 * 免登录白名单
 * 这个页面的功能是：某个页面需要需要登录，登录后再跳转回原来的页面，并携带着之前的参数
 */
const whiteList = [
  "/login",
  "/alternativeLogin",
  "/authredirect",
  "/wecome/myWorkOrder",
  "/wecome/workOrderDetail",
  "/wecome/im",
];

router.beforeEach((to, from, next) => {
  store.commit("REMEMBER_ROUTE_CHANGE", to);
  if (!to.meta.noCache) {
    if (to.name !== null) {
      store.commit("ADD_VISITED_VIEWS", to);
      // 设置页头
      let flag = store.getters.systemPermissionList.find((item) => {
        if (item.url && item.url.indexOf(to.name) != -1) {
          return item;
        }
      });
      if (flag != undefined) {
        store.commit("SET_PAGE_TITLE", flag.nameZh);
      }
    }
  }
  // 开始滚动条
  NProgress.start();
  document.querySelector("#nprogress .bar").style.background =
    store.getters.themeColor;
  if (to.path === "/login") {
    const currentLang = window.localStorage.getItem("localeLanguage");
    handleToken.removeToken();
    window.localStorage.setItem("localeLanguage", currentLang);
    window.localStorage.setItem("deviceType", getPlatformInfo().deviceType);
  } else if (to.path.startsWith("/wecome/")) {
    // 企微场景下，直接放行。略过下面的逻辑，否则如果localStorage里有个过期的token，会导致页面一直刷新
    next();
    return;
  }
  resetStore();
  // 如果有token的缓存
  if (handleToken.getToken()) {
    if (store.getters.menuMap == null) {
      // 判断页面刷新vuex内的数据丢失，重新拉一边
      // 获取用户视图权限
      let userId = JSON.parse(getStorage("userInfo")).id;
      getUserPermission(userId)
        .then((res) => {
          let userPermissionViews = res.data.data.permissionList;
          // 将系统所有的权限集合存进vuex
          store.commit("SET_SYSTEM_PERMISSION_LIST", userPermissionViews);
          // 把用户拥有的权限的数据集合存进vuex
          store.commit("SET_USER_PERMISSION_VIEWS", userPermissionViews);
          // 用户按钮权限
          let userBtnsViews = userPermissionViews.filter(
            (item) => item.type == ApiConstants.buttonViewCode
          );
          store.commit("SET_USER_BTNS_VIEWS", userBtnsViews);
          // 把用户tabs权限存入vuex
          let userTabsViews = userPermissionViews.filter(
            (item) => item.type == ApiConstants.tabViewCode
          );
          store.commit("SET_USER_TABS_VIEWS", userTabsViews);
          // 构建用户权限树
          let tree = [];
          userPermissionViews.forEach((item) => {
            if (item.pid == null || item.level == 3) {
              tree.push(item);
            } else {
              userPermissionViews.forEach((ite) => {
                // 此处仅构建用户菜单视图权限树，不注入 tab 权限 和 button 权限
                if (
                  ite.id == item.pid &&
                  item.type != ApiConstants.buttonViewCode &&
                  item.type != ApiConstants.tabViewCode
                ) {
                  ite.children = ite.children || [];
                  ite.children.push(item);
                  ite.children.sort((a, b) => {
                    return a.orderNo - b.orderNo;
                  });
                }
              });
            }
          });
          tree.sort((a, b) => {
            return a.orderNo - b.orderNo;
          });
          // 加载动态路由
          let routers = require("@/router/admin/").default;
          routers = [].concat(routers, errRouterMap);
          router.addRoutes(routers);
          let menuMap = formatMenuMap(tree);
          let menuIndex = getMenuIndex(menuMap);
          let moduleMenuIndex = getStorage("moduleMenuIndex");
          let secondMenuIndex = JSON.parse(getStorage("secondMenuIndex"));
          let currentPath = getStorage("currentPath");
          store.commit("SET_MENU_MAP", menuMap);
          if (to.path === "/" || to.path === "home/index") {
            const secondMenu = menuMap[0].children[0].children[0];
            store.commit("SET_MENU_INDEX", [0, secondMenu, secondMenu.url]);
          } else if (to.fullPath == currentPath) {
            store.commit("SET_MENU_INDEX", [
              moduleMenuIndex,
              secondMenuIndex,
              currentPath,
            ]);
          } else if (menuIndex.hasOwnProperty(to.path)) {
            store.commit("SET_MENU_INDEX", [
              moduleMenuIndex,
              secondMenuIndex,
              to.fullPath,
            ]);
          } else {
            store.commit("SET_MENU_INDEX", [
              moduleMenuIndex,
              secondMenuIndex,
              to.fullPath,
            ]);
          }
          /**
           * 获取系统所有的权限，然后找出学管顾问的id 请求获取学管顾问列表
           */
          getSystemRolesList().then((res3) => {
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
                getThisRoleUserLists(str).then((res4) => {
                  if (res4.status == 200 && res4.data.code == 200) {
                    store.commit("SET_XG_AND_GW_LIST", res4.data.data);
                  }
                });
              }
            }
          });
        })
        .catch((err) => {
          next({ path: "/" });
          logout().then((res) => {
            handleToken.removeToken();
            router.push({ path: "/login" });
          });
        });
    } else {
      // 如果通过链接直接跳转某个页面，且该页面是二级页面
      let menuMap = store.getters.menuMap;
      const menuIndex = getMenuIndex(menuMap);
      const path = to.meta.pubPage || to.path;
      if (menuIndex.hasOwnProperty(path)) {
        const setMenuIndex = menuIndex[path];
        store.commit("SET_MENU_INDEX_NO", setMenuIndex);
      }
      next();
    }
  } else {
    // 如果没有token缓存
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      if (to.path === "/login") {
        if (to.fullPath.includes("lingoace")) {
          next({
            path: "/alternativeLogin",
          });
        } else {
          next();
          // toSSOPage();
        }
      } else {
        next();
      }
    } else {
      if (to.path === "/home/index" && to.fullPath.includes("logged")) {
        window.location.href = `${process.env.VUE_APP_BASE_API}/home/index`;
      } else {
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      }
      NProgress.done(); // 如果当前页面是登录的，就会触发afterEach钩子，所以需要手动关闭滚动条
    }
  }
});
import { logEvent } from "@/utils/analyticsNew";

router.afterEach((to, from) => {
  logEvent("ops_visit_page", "ops访问页面", {
    fullPath: to.fullPath,
    metaTitleName: to.meta?.title?.nameZh,
  });
  store.commit("SET_CURRENT_PATH", to.fullPath);
  if (!to.meta.mustCache) {
    if (to.name !== null) {
      store.commit("DEL_VISITED_VIEWS", from);
    }
  }
  // 结束滚动条
  NProgress.done();
});

function resetStore() {
  // 重置公共状态
  const getters = store.getters;
  if (getters.pageTitle !== "") {
    store.commit("SET_PAGE_TITLE", "");
  }
}
// 解决重复点击导航路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
