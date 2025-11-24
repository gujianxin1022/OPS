const remberScroll = {
  state: {
    unitReportAuditedScrollTop: {},
    unitReportAuditFailedScrollTop: {},
    unitReportAuditSuccessedScrollTop: {},
    unitReportAllScrollTop: {},
    feedbackAuditedScrollTop: {},
    feedbackAuditFailedScrollTop: {},
    feedbackAuditSuccessedScrollTop: {},
    feedbackAllScrollTop: {}
  },
  mutations: {
    setUnitReportAuditedScrollTop(state, payload) {
      state.unitReportAuditedScrollTop = payload
    },
    setUnitReportAuditFailedScrollTop(state, payload) {
      state.unitReportAuditFailedScrollTop = payload
    },
    setUnitReportAuditSuccessedScrollTop(state, payload) {
      state.unitReportAuditSuccessedScrollTop = payload
    },
    setUnitReportAllScrollTop(state, payload) {
      state.unitReportAllScrollTop = payload
    },
    setFeedbackAuditedScrollTop(state, payload) {
      state.feedbackAuditedScrollTop = payload
    },
    setFeedbackAuditFailedScrollTop(state, payload) {
      state.feedbackAuditFailedScrollTop = payload
    },
    setFeedbackAuditSuccessedScrollTop(state, payload) {
      state.feedbackAuditSuccessedScrollTop = payload
    },
    setFeedbackAllScrollTop(state, payload) {
      state.feedbackAllScrollTop = payload
    }
  }
}

export default remberScroll
