import Vue from 'vue'
import Vuex from 'vuex'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    ui,
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
    }
  }
})
