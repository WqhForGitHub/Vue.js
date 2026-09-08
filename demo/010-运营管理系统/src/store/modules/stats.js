export default {
  namespaced: true,
  state: {
    overview: {
      visits: 0,
      users: 0,
      orders: 0,
      revenue: 0,
    },
    chartData: {
      labels: [],
      datasets: [],
    },
    timeRange: 'week',
  },
  getters: {
    formattedRevenue: (state) => '¥' + state.overview.revenue.toLocaleString(),
  },
  mutations: {
    SET_OVERVIEW(state, data) {
      state.overview = data;
    },
    SET_CHART_DATA(state, data) {
      state.chartData = data;
    },
    SET_TIME_RANGE(state, range) {
      state.timeRange = range;
    },
  },
  actions: {
    fetchOverview({ commit }, range) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('SET_TIME_RANGE', range);
          commit('SET_OVERVIEW', {
            visits: Math.floor(Math.random() * 10000),
            users: Math.floor(Math.random() * 1000),
            orders: Math.floor(Math.random() * 500),
            revenue: Math.floor(Math.random() * 100000),
          });
          resolve();
        }, 300);
      });
    },
    fetchChartData({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('SET_CHART_DATA', {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
          });
          resolve();
        }, 300);
      });
    },
  },
};
