import Vue from 'vue'
import Vuex from 'vuex'
import content from './modules/content'
import messages from './modules/messages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    content,
    messages
  }
})
