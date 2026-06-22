import Vue from 'vue'
import Vuex from 'vuex'
import content from './modules/content'
import stats from './modules/stats'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    content,
    stats
  }
})
