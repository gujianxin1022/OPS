import HandleToken from "@/utils/auth";
const handleToken = new HandleToken();
import { setStorage } from "@/utils/handleStorage";
import { setLoginUserInfo } from '@/utils/analyticsNew.js';

const user = {
  state: {
    user: "",
    token: "",
    userName: "",
    studentLoginTz: "",
    systemPermissionList: [], // 系统所有权限集合
    userPermissionViews: [], // 用户权限列表，数据集合
    userViewsTree: [], // 用户权限树
    userBtnsViews: [], // 用户 按钮权限集合
    userTabsViews: [], //用户 tabs权限集合
    userInfo: null,
    xgAndGwList: [], // 系统学管和顾问的集合
    xgAndGwListSet: [], // 去重后的学管顾问集合
    tmList: [], // 教师管理人员集合
    userTimeZone: "", //家长下维护的系统课时字段
    hasDst: 2, // 用户时区是否有令时规则(1:有,2:没有)
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
      handleToken.setToken(token);
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName;
      setStorage("userName", userName);
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info;
      setStorage("userInfo", info);
      const { username, id } =JSON.parse(info)
      setLoginUserInfo({ username, id })
    },
    SET_STUDENT_LOGIN_TZ: (state, studentLoginTz) => {
      state.studentLoginTz = studentLoginTz;
    },
    SET_USER_TIME_ZONE: (state, userTimeZone) => {
      state.userTimeZone = userTimeZone;
    },
    SET_USER_HAS_DST: (state, hasDst) => {
      state.hasDst = hasDst;
    },
    SET_USER_PERMISSION_VIEWS: (state, userPermissionViews) => {
      state.userPermissionViews = userPermissionViews;
    },
    SET_SYSTEM_PERMISSION_LIST: (state, systemPermissionList) => {
      state.systemPermissionList = systemPermissionList;
    },
    SET_USER_VIEWS_TREE: (state, userViewsTree) => {
      state.userViewsTree = userViewsTree;
    },
    SET_USER_BTNS_VIEWS: (state, userBtnsViews) => {
      state.userBtnsViews = userBtnsViews;
    },
    SET_USER_TABS_VIEWS: (state, userTabsViews) => {
      state.userTabsViews = userTabsViews;
    },
    SET_XG_AND_GW_LIST(state, list) {
      state.xgAndGwList = list;
      let arr = [],
        tmarr = [];
      list.forEach((item) => {
        if (item.nameZh == null) {
          item.nameZh = "";
        }
        if (item.nameEn == null) {
          item.nameEn = "";
        }
        if (item.roleName !== "教师管理人员") {
          arr.push(item);
        } else {
          tmarr.push(item);
        }
      });
      state.xgAndGwListSet = [
        {
          id: -1,
          nameEn: "Unassigned",
          nameZh: "未分配",
          realName: "",
          roleName: "",
          username: "",
        },
        ...arr,
      ];
      state.tmList = [...tmarr];
    },
  },

  actions: {
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        handleToken.removeToken();
        resolve();
      });
    },
  },
};

export default user;
