import Vue from 'vue'
import Vuex from 'vuex'
import deploy from './modules/deploy'
import monitor from './modules/monitor'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    deploy,
    monitor
  }
})
