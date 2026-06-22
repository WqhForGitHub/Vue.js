import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import stats from './modules/stats'
import tenant from './modules/tenant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    stats,
    tenant
  }
})
