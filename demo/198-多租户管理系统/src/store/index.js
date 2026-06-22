import Vue from 'vue'
import Vuex from 'vuex'
import tenant from './modules/tenant'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    tenant,
    user
  }
})
