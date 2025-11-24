

import store from '../store' // 注入vuex仓库

export default {
  /**
   * 处理用户是否具有按钮的权限
   *  @param {String} fullCode code码
   */
  handleButtonPer: fullCode => {
    return store.getters.userBtnsViews.some( item => item.fullCode == fullCode)
  },
  /**
   * 处理用户是否具有tab的权限
   *  @param {String} fullCode
   */
  handleTabsPer: fullCode => {
    return store.getters.userTabsViews.some( item => item.fullCode == fullCode)
  },
  /**
   * 是否具有某个权限
   */
  hasPermission: fullCode => {
    return store.getters.systemPermissionList.some( item => item.fullCode == fullCode)
  }
}
