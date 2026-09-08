export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        title: '设计登录页面',
        status: 'todo',
        priority: 'high',
      },
      {
        id: 2,
        title: '实现 API 接口',
        status: 'doing',
        priority: 'high',
      },
      {
        id: 3,
        title: '编写单元测试',
        status: 'done',
        priority: 'medium',
      },
    ],
    filter: 'all',
  },
  getters: {
    filtered: (state) => {
      if (state.filter === 'all') return state.list;
      return state.list.filter((t) => t.status === state.filter);
    },
    todoCount: (state) => state.list.filter((t) => t.status === 'todo').length,
    doingCount: (state) => state.list.filter((t) => t.status === 'doing').length,
    doneCount: (state) => state.list.filter((t) => t.status === 'done').length,
  },
  mutations: {
    ADD_TASK(state, task) {
      state.list.push({ ...task, id: Date.now(), status: 'todo' });
    },
    UPDATE_STATUS(state, { id, status }) {
      const task = state.list.find((t) => t.id === id);
      if (task) task.status = status;
    },
    DELETE_TASK(state, id) {
      state.list = state.list.filter((t) => t.id !== id);
    },
    SET_FILTER(state, filter) {
      state.filter = filter;
    },
  },
  actions: {
    addTask({ commit }, task) {
      commit('ADD_TASK', task);
    },
    updateStatus({ commit }, payload) {
      commit('UPDATE_STATUS', payload);
    },
    deleteTask({ commit }, id) {
      commit('DELETE_TASK', id);
    },
    setFilter({ commit }, filter) {
      commit('SET_FILTER', filter);
    },
  },
};
