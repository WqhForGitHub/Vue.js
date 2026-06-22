import Vue from 'vue'
import Vuex from 'vuex'
import tasks from './modules/tasks'
import workflow from './modules/workflow'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    tasks,
    workflow
  }
})
