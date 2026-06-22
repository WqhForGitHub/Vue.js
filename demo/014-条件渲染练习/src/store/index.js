import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: "Hello Vuex",
    messages: []
  },
  getters: {
    messageCount: state => state.messages.length,
    upperMessage: state => state.message.toUpperCase()
  },
  mutations: {
    SET_MESSAGE(state, msg) { state.message = msg },
    ADD_MESSAGE(state, msg) { state.messages.push({ id: Date.now(), text: msg }) },
    CLEAR_MESSAGES(state) { state.messages = [] }
  },
  actions: {
    setMessage({ commit }, msg) { commit('SET_MESSAGE', msg) },
    addMessage({ commit }, msg) { commit('ADD_MESSAGE', msg) },
    clearMessages({ commit }) { commit('CLEAR_MESSAGES') }
  }
})
