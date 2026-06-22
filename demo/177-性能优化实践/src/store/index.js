import Vue from 'vue'
import Vuex from 'vuex'
import monitor from './modules/monitor'
import stats from './modules/stats'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    monitor,
    stats
  }
})
