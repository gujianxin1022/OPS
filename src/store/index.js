import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tabs from './modules/tabs'
import tagsView from './modules/tagsView'
import remberTags from './modules/remberTags'
import remberSearch from './modules/remberSearch'
import remberScroll from './modules/remberScroll'
import system from './modules/system'
import getters from './getters'
import learnManager from './modules/learnManager'
import im from './modules/im';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    remberTags,
    tabs,
    remberSearch,
    system,
    remberScroll,
    learnManager,
    im,
  },
  getters
})

export default store
