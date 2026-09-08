export default {
  namespaced: true,
  state: {
    environments: ['development', 'staging', 'production'],
    currentEnv: 'development',
    buildStatus: 'idle',
  },
  getters: {
    isProduction: (state) => state.currentEnv === 'production',
    isBuilding: (state) => state.buildStatus === 'building',
  },
  mutations: {
    SET_ENV(state, env) {
      state.currentEnv = env;
    },
    SET_BUILD_STATUS(state, status) {
      state.buildStatus = status;
    },
  },
  actions: {
    setEnv({ commit }, env) {
      commit('SET_ENV', env);
    },
    async build({ commit }) {
      commit('SET_BUILD_STATUS', 'building');
      await new Promise((r) => setTimeout(r, 1000));
      commit('SET_BUILD_STATUS', 'success');
    },
  },
};
