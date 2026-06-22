import Vue from 'vue'
import Vuex from 'vuex'
import tasks from './modules/tasks'
import messages from './modules/messages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    tasks,
    messages
  }
})
