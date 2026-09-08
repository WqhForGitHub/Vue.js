export default {
  namespaced: true,
  state: {
    components: [
      {
        name: 'Button',
        category: '基础',
        count: 5,
      },
      {
        name: 'Input',
        category: '表单',
        count: 8,
      },
      {
        name: 'Table',
        category: '数据',
        count: 3,
      },
      {
        name: 'Dialog',
        category: '反馈',
        count: 4,
      },
    ],
    currentCategory: 'all',
  },
  getters: {
    categories: (state) => ['all', ...new Set(state.components.map((c) => c.category))],
    filtered: (state) => {
      if (state.currentCategory === 'all') return state.components;
      return state.components.filter((c) => c.category === state.currentCategory);
    },
  },
  mutations: {
    SET_CATEGORY(state, cat) {
      state.currentCategory = cat;
    },
    ADD_COMPONENT(state, comp) {
      state.components.push(comp);
    },
  },
  actions: {
    setCategory({ commit }, cat) {
      commit('SET_CATEGORY', cat);
    },
    addComponent({ commit }, comp) {
      commit('ADD_COMPONENT', comp);
    },
  },
};
