export default {
  namespaced: true,
  state: {
    mode: "light",
    primaryColor: "#42b983",
    fontSize: 14
  },
  getters: {
    isDark: state => state.mode === 'dark',
    themeClass: state => `theme-${state.mode}`
  },
  mutations: {
    SET_MODE(state, mode) { state.mode = mode },
    SET_PRIMARY(state, color) { state.primaryColor = color },
    SET_FONT_SIZE(state, size) { state.fontSize = size }
  },
  actions: {
    toggleMode({ commit, state }) {
        commit('SET_MODE', state.mode === 'light' ? 'dark' : 'light')
      },
    setMode({ commit }, mode) { commit('SET_MODE', mode) },
    setPrimary({ commit }, color) { commit('SET_PRIMARY', color) }
  }
}
