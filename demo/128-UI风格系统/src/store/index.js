import Vue from 'vue'
import Vuex from 'vuex'
import theme from './modules/theme'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    theme,
    ui
  }
})
