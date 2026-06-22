import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    counter: {
      state: {
        count: 0,
        step: 1
      },
      getters: {
        doubleCount: state => state.count * 2,
        squareCount: state => state.count * state.count
      },
      mutations: {
        INCREMENT(state) { state.count += state.step },
        DECREMENT(state) { state.count -= state.step },
        RESET(state) { state.count = 0 },
        SET_STEP(state, step) { state.step = step }
      },
      actions: {
        increment({ commit }) { commit('INCREMENT') },
        decrement({ commit }) { commit('DECREMENT') },
        reset({ commit }) { commit('RESET') },
        setStep({ commit }, step) { commit('SET_STEP', step) }
      }
    },
    message: {
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
    }
  }
})
