import Vue from 'vue'
import Vuex from 'vuex'
import stats from './modules/stats'
import monitor from './modules/monitor'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    stats,
    monitor
  }
})
