import Vue from 'vue'
import Vuex from 'vuex'
import inventory from './modules/inventory'
import tasks from './modules/tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    inventory,
    tasks
  }
})
