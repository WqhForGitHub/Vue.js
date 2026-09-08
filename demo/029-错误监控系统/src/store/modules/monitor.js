export default {
  namespaced: true,
  state: {
    logs: [],
    metrics: {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
    },
  },
  getters: {
    errorCount: (state) => state.logs.filter((l) => l.level === 'error').length,
    latestLogs: (state) => state.logs.slice(-10),
  },
  mutations: {
    ADD_LOG(state, log) {
      state.logs.push({ ...log, id: Date.now(), time: new Date().toISOString() });
    },
    SET_METRICS(state, m) {
      state.metrics = m;
    },
    CLEAR_LOGS(state) {
      state.logs = [];
    },
  },
  actions: {
    addLog({ commit }, log) {
      commit('ADD_LOG', log);
    },
    updateMetrics({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('SET_METRICS', {
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            disk: Math.floor(Math.random() * 100),
            network: Math.floor(Math.random() * 100),
          });
          resolve();
        }, 300);
      });
    },
    clearLogs({ commit }) {
      commit('CLEAR_LOGS');
    },
  },
};
