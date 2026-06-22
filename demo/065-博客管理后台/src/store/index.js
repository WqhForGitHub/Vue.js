import Vue from 'vue'
import Vuex from 'vuex'
import content from './modules/content'
import comments from './modules/comments'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    content,
    comments
  }
})
