    const remberTags = {
      state: {
        //单元报告tabs标识
        unitReportTabsIndex: 1,
        //单元报告当前页标识
        unitReportCurrentPage: 1,
        //首次课tabs标识
        firstClassFeedbackTabsIndex: 1,
        //首次课当前页标识
        firstClassFeedbackPage: 1,
        //上课安排tabs标识
        schedulingTabsIndex: 1,
        //上课安排当前页标识
        schedulingPage: 1,
        //教师管理查找教师当前页标识
        searchTeacherPage: 1,
        userMtPage: 1,
      },
      mutations: {
        setUnitReportTabsIndex(state, payload) {
          state.unitReportTabsIndex = payload
        },
        setUnitReportCurrentPage(state, payload) {
          state.unitReportCurrentPage = payload
        },
        setFirstClassFeedbackTabsIndex(state, payload) {
          state.firstClassFeedbackTabsIndex = payload
        },
        setFirstClassFeedbackPage(state, payload) {
          state.firstClassFeedbackPage = payload
        },
        setSchedulingTabsIndex(state, payload) {
          state.schedulingTabsIndex = payload
        },
        setSchedulingPage(state, payload) {
          state.schedulingPage = payload
        },
        /**
         * 公共方法
         * @param {Object} state 状态
         * @param {Object} payload
         *    @param {String} key state对象中存在的状态（将要修改的state）
         *    @param {Every} value  state对象中状态的值
         */
        setStateData(state, payload) {
          state[payload.key] = payload.value
        }
      }
    }

    export default remberTags
