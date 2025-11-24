const remberSearch = {
  state: {
    unitReportSearchData: {},
    firstClassSearchData: {},
    schedulingSearchData: {},
    groupListSearchData: {},
    pageToState: {
      unitReport: 'unitReportSearchData',
      firstClassFeedback: 'firstClassSearchData',
      scheduling: 'schedulingSearchData',
      groupList: 'groupListSearchData'
    }
  },
  mutations: {
    setUnitReportSearchData(state, payload) {
      state.unitReportSearchData = {...state.unitReportSearchData, ...payload};
    },
    setFirstClassSearchData(state, payload) {
      state.firstClassSearchData = {...state.firstClassSearchData, ...payload}
    },
    setSchedulingSearchData(state, payload) {
      state.schedulingSearchData = {...state.schedulingSearchData, ...payload}
    },
    setGroupListSearchData(state, payload) {
      state.groupListSearchData = {...state.groupListSearchData, ...payload}
    },
    clearCacheData(state, page) {
      state[state.pageToState[page]] = {}
    }
  }
}

export default remberSearch
