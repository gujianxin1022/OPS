import router from "@/router";
import { setStorage } from "@/utils/handleStorage";
import store from "../index";

const tabs = {
  state: {
    menuMap: null,
    menuIndexObj: null,
    moduleMenuIndex: 0,
    secondMenuIndex: null,
    currentPath: "/",
    routesMemoryList: [],
    excludeCacheComponentsList: [],
  },
  mutations: {
    // 记住路由变化
    REMEMBER_ROUTE_CHANGE(state, data) {
      // 相同路由名称不添加顶部重复标签页
      const distinctRouteNames = ["im"];
      const routeMeta = data.meta || {};
      const hidden = routeMeta.hidden;
      if (
        state.routesMemoryList.some(
          (routeItem) =>
            routeItem.fullPath === data.fullPath ||
            (distinctRouteNames.includes(data.name) &&
              routeItem.name === data.name)
        ) ||
        data.name === null ||
        data.name === "page404" ||
        data.path == "/login" ||
        data.path == "/alternativeLogin" ||
        data.path == "/" ||
        hidden
      ) {
        // routesMemoryList中已有的路由不添加，404路由、login路由不添加
      } else {
        // 加入顶部标签页
        state.routesMemoryList.push(data);
      }
      // 处理缓存排除逻辑
      if (Object.keys(data.query).length > 0 ) {
        if (
          state.excludeCacheComponentsList.every(
            (item) => item !== data.name.toString()
          ) &&
          data.name !== null
        ) {
          if (data?.name) {
            state.excludeCacheComponentsList.push(data?.name?.toString());
          }
        } else {
          // 删除标签页时从excludeCacheComponentsList中删除
          state.excludeCacheComponentsList =
            state.excludeCacheComponentsList.filter((item) => {
              return data.name && item != data.name.toString();
            });
        }
      }
    },
    DELETE_ROUTE(state, data) {
      if (
        state.routesMemoryList.some((routeItem) => {
          return (
            routeItem.name === data[0].name &&
            JSON.stringify(routeItem.query) === JSON.stringify(data[0].query)
          );
        })
      ) {
        state.routesMemoryList.splice(data[1], 1);
        if (data[2] === "no_cache") {
          state.excludeCacheComponentsList.push(data[0].name.toString());
        }
        store.commit("clearCacheData", data[0].name);
      }
    },
    // 设置当前路径
    SET_CURRENT_PATH(state, path) {
      setStorage("currentPath", path);
      state.currentPath = path;
    },
    // 设置菜单数组
    SET_MENU_MAP(state, map) {
      state.menuMap = map;
    },
    // 设置menuIndex
    SET_MENU_INDEX_OBJ(state, obj) {
      state.menuIndexObj = obj;
    },
    // 设置当前页面的所在模块
    SET_MODULE_MENU_INDEX: (state, index) => {
      const menuMap = state.menuMap;
      let secondMenuIndex = null;
      if (
        menuMap[index] &&
        menuMap[index].children[0] &&
        menuMap[index].children[0].children
      ) {
        secondMenuIndex = menuMap[index].children[0].children[0];
      } else if (menuMap[index] && menuMap[index].children[0]) {
        secondMenuIndex = menuMap[index].children[0];
      } else if (menuMap[index].children[0].url != "") {
        secondMenuIndex = menuMap[index].children[0];
      } else {
        secondMenuIndex = { url: "/page/401" };
      }
      state.moduleMenuIndex = index;
      state.secondMenuIndex = secondMenuIndex;
      state.currentPath = secondMenuIndex.url;
      setStorage("moduleMenuIndex", index);
      setStorage("secondMenuIndex", JSON.stringify(secondMenuIndex));
      setStorage("currentPath", secondMenuIndex.url);
      goRouter(secondMenuIndex.url);
    },
    // 设置当前页面的所在一级菜单
    SET_FIRST_MENU_INDEX: (state, index) => {
      const menuMap = state.menuMap;
      let secondMenuIndex = null;

      if (
        menuMap[state.moduleMenuIndex].children[index] &&
        menuMap[state.moduleMenuIndex].children[index].children[0]
      ) {
        secondMenuIndex =
          menuMap[state.moduleMenuIndex].children[index].children[0];
      } else if (menuMap[index].children[0].url != "") {
        secondMenuIndex = menuMap[index].children[0];
      } else {
        secondMenuIndex = { url: "/page/401" };
      }

      // const secondMenuIndex = menuMap[state.moduleMenuIndex].children[index].children[0].children[0]

      state.secondMenuIndex = secondMenuIndex;
      state.currentPath = secondMenuIndex.url;
      setStorage("secondMenuIndex", JSON.stringify(secondMenuIndex));
      setStorage("currentPath", secondMenuIndex.url);
      goRouter(secondMenuIndex.url);
    },
    // 设置当前页面的所在二级菜单
    SET_SECOND_MENU_INDEX: (state, secondMenuIndex) => {
      state.secondMenuIndex = secondMenuIndex;
      state.currentPath = secondMenuIndex.url;
      setStorage("secondMenuIndex", JSON.stringify(secondMenuIndex));
      setStorage("currentPath", secondMenuIndex.url);
      goRouter(secondMenuIndex.url);
    },
    // 设置页面所在模块、所在一级菜单、所在二级菜单
    SET_MENU_INDEX(state, menuIndexArr) {
      state.moduleMenuIndex = menuIndexArr[0];
      state.secondMenuIndex = menuIndexArr[1];
      state.currentPath = menuIndexArr[2];
      setStorage("moduleMenuIndex", menuIndexArr[0]);
      setStorage("secondMenuIndex", JSON.stringify(menuIndexArr[1]));
      setStorage("currentPath", menuIndexArr[2]);
      goRouter(menuIndexArr[2]);
    },
    // 设置页面所在模块、所在一级菜单、所在二级菜单
    SET_MENU_INDEX_NO(state, menuIndexArr) {
      state.moduleMenuIndex = menuIndexArr[0];
      state.secondMenuIndex = menuIndexArr[1];
      setStorage("moduleMenuIndex", menuIndexArr[0]);
      setStorage("secondMenuIndex", JSON.stringify(menuIndexArr[1]));
    },
  },
};

function goRouter(path) {
  router.push({ path });
}

export default tabs;
