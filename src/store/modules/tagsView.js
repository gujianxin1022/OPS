const tagsView = {
  state: {
    visitedViews: [],
    // 缓存的页面再次被请求时会走缓存
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
      if (!view.meta.noCache && view.name !== undefined) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      // 在浏览过的页面数组里删除当前选择的页面
      // entries()返回一个迭代器，它返回数组的键/值对。其实就是个数组的循环
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }

      // 在缓存的页面数组里删除当前选择的页面
      // state.cachedViews就是state.cachedViews.length
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    // 在处理上和DEL_VISITED_VIEWS相似，区别在于不是删除当前页面的路由，而是变为当前页面的路由
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, index + 1)
          break
        }
      }
    },
    // 删除所有看过的页面和缓存的页面
    DEL_ALL_VIEWS: state => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    // 删除当前选择的页面
    delVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    // 删除其他的页面
    delOthersViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
