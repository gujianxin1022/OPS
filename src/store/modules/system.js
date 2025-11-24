import * as Api from "../../api/index";
import * as leaveApi from '@/api/systemManagement/leave';
const {
  getSystemRolesList,
  getSystemAllPowerInfo,
  getJobPositionList,
  getUserInfoList,
  getUserDetailInfo,
  checkOperationLog,
  checkAllOperationBehavior,
} = Api.systemManagement;
const system = {
  state: {
    rolesList: [], // 所有角色信息
    allPowerList: [], // 系统所有权限信息
    allJobList: [], //系统所有岗位
    userInfoList: [], // 用户信息列表
    userDetailInfo: null, // 用户详细信息
    allOperationBehavior: [],
    skuAmount:0, /* 记录sku课时数量 */
    awaitingResignationEmployeeCount: 0, // 待离职员工数量
    awaitingResignationEmployeeMsgReadState: false, // 待离职员工消息已读状态
  },
  getters: {
    // 待离职员工消息提示角标
    awaitingResignationEmployeeBadgeCount: (state) => state.awaitingResignationEmployeeMsgReadState ? 0 : state.awaitingResignationEmployeeCount,
  },
  mutations: {
    SET_SKU_AMOUNT( state, payload ) {
      state.skuAmount = payload
    },
    SET_ROLES_LIST( state, payload ) {
      state.rolesList = payload
    },
    SET_ALL_POWER_LIST(state, payload) {
      state.allPowerList = payload;
    },
    SET_USER_INFO_LIST(state, payload) {
      state.userInfoList = payload;
    },
    SET_USER_DETAIL_INFO(state, payload) {
      state.userDetailInfo = payload;
    },
    SET_ALL_JOB_LIST(state, payload) {
      state.allJobList = payload;
    },
    SET_ALL_OPERATION_BEHAVIOR(state, payload) {
      state.allOperationBehavior = ["全部"].concat(payload);
    },
    SET_AWAITING_RESIGNATION_EMPLOYEE_COUNT(state, payload) {
      state.awaitingResignationEmployeeCount = payload;
    },
    SET_AWAITING_RESIGNATION_EMPLOYEE_MSG_READ_STATE(state, payload) {
      state.awaitingResignationEmployeeMsgReadState = payload;
    },
  },
  actions: {
    /**
     * 获取系统全部角色信息
     */
    getSystemRolesListAction({ commit }) {
      return new Promise((resolve, reject) => {
        getSystemRolesList().then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            commit("SET_ROLES_LIST", data.data);
            resolve(data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取系统全部权限信息
     */
    getSystemPowerListAction({ commit }) {
      return new Promise((resolve, reject) => {
        getSystemAllPowerInfo().then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            commit("SET_ALL_POWER_LIST", data.data);
            resolve(data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取系统全部岗位信息
     */
    getSystemJobPositionList({ commit }) {
      return new Promise((resolve, reject) => {
        getJobPositionList().then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            commit("SET_ALL_JOB_LIST", data.data);
            resolve(data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取用户信息列表
     */
    getUserInfoListAction({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserInfoList(params).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            commit("SET_USER_INFO_LIST", data.data.list);
            resolve(data.data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取用户详细信息
     */
    getUserDetailInfo({ commit }, userId) {
      return new Promise((resolve, reject) => {
        getUserDetailInfo(userId).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            console.log(data.data);
            commit("SET_USER_DETAIL_INFO", data.data);
            resolve(data.data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取操作日志列表
     */
    getOperationLog({ commit }, params) {
      return new Promise((resolve, reject) => {
        checkOperationLog(params).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            resolve(data.data);
          } else {
            reject("error");
          }
        });
      });
    },
    /**
     * 获取所有操作行为
     */
    getAllOperationBehavior({ commit, state }) {
      return new Promise((resolve, reject) => {
        checkAllOperationBehavior().then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            commit("SET_ALL_OPERATION_BEHAVIOR", data.data);
            resolve(data.data);
          } else {
            reject("error");
          }
        });
      });
    },
    // 获取待离职员工数量
    fetchAwaitingResignationEmployeeCount({ commit }) {
      return leaveApi.getAwaitingResignationEmployeeCount().then((val) => {
        commit("SET_AWAITING_RESIGNATION_EMPLOYEE_COUNT", val);
        return val;
      });
    }
  },
};

export default system;
