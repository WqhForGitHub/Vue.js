import Vue from 'vue'
import Vuex from 'vuex'
import comments from './modules/comments'
import content from './modules/content'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    comments,
    content
  }
})
