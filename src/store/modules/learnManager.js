import {
  getNewTaskStatus,
} from '../../api/learnManager/index'

const learnManager = {
  state: {
    taskList: {
      100102: [],
      101101: [],
      104101: [],
      104102: [],
      102101: [],
      103101: []
    },
    totalTask: 0,
    currentPage: 1,
    size: 25
  },

  mutations: {
    SET_NEW_TASK_STATUS(state, payload) {
      state.totalTask = payload
    },
    CHANGE_TASK_TOTAL_NUM(state,num){
      state.totalTask = num
    },
    CLEAR_LM_WORKBENCH_DATA(state) {
      state.totalTask = 0
    },
  },

  actions: {
    getNewTaskStatus({ commit }) {
      return new Promise(resolve => {
        getNewTaskStatus().then(data => {
          commit('SET_NEW_TASK_STATUS', data.data.data)
          resolve(data.data)
        })
      })
    }
  }
}

export default learnManager
