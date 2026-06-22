import Vue from 'vue'
import Vuex from 'vuex'
import workflow from './modules/workflow'
import tasks from './modules/tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    workflow,
    tasks
  }
})
