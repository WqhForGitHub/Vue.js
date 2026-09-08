export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    lastRequest: null,
  },
  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },
  mutations: {
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, err) {
      state.error = err;
    },
    SET_LAST_REQUEST(state, req) {
      state.lastRequest = req;
    },
  },
  actions: {
    async request({ commit }, config) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      commit('SET_LAST_REQUEST', config);
      try {
        await new Promise((r) => setTimeout(r, 500));
        commit('SET_LOADING', false);
        return { code: 200, data: { success: true } };
      } catch (err) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', err.message);
        throw err;
      }
    },
  },
};
