export default {
  namespaced: true,
  state: {
    list: [],
    current: null,
    status: 'all',
  },
  getters: {
    filteredList: (state) => {
      if (state.status === 'all') return state.list;
      return state.list.filter((o) => o.status === state.status);
    },
    pendingCount: (state) => state.list.filter((o) => o.status === 'pending').length,
  },
  mutations: {
    SET_LIST(state, list) {
      state.list = list;
    },
    SET_CURRENT(state, order) {
      state.current = order;
    },
    SET_STATUS(state, status) {
      state.status = status;
    },
    ADD_ORDER(state, order) {
      state.list.unshift({ ...order, id: Date.now(), status: 'pending' });
    },
    UPDATE_STATUS(state, { id, status }) {
      const order = state.list.find((o) => o.id === id);
      if (order) order.status = status;
    },
  },
  actions: {
    fetchOrders({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = Array.from({ length: 5 }, (_, i) => ({
            id: 1000 + i,
            total: (i + 1) * 99,
            status: ['pending', 'paid', 'shipped', 'done', 'pending'][i % 5],
          }));
          commit('SET_LIST', list);
          resolve();
        }, 300);
      });
    },
    createOrder({ commit }, order) {
      commit('ADD_ORDER', order);
    },
    updateOrderStatus({ commit }, payload) {
      commit('UPDATE_STATUS', payload);
    },
    filterByStatus({ commit }, status) {
      commit('SET_STATUS', status);
    },
  },
};
