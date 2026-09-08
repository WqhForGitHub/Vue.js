export default {
  namespaced: true,
  state: {
    articles: [
      {
        id: 1,
        title: 'Vue 2 入门指南',
        status: 'published',
        author: '张三',
      },
      {
        id: 2,
        title: 'Vuex 状态管理实战',
        status: 'draft',
        author: '李四',
      },
      {
        id: 3,
        title: 'Vue Router 路由详解',
        status: 'published',
        author: '王五',
      },
    ],
    categories: ['技术', '生活', '随笔'],
    tags: ['Vue', 'JavaScript', '前端'],
  },
  getters: {
    published: (state) => state.articles.filter((a) => a.status === 'published'),
    draftCount: (state) => state.articles.filter((a) => a.status === 'draft').length,
  },
  mutations: {
    ADD_ARTICLE(state, article) {
      state.articles.unshift({ ...article, id: Date.now() });
    },
    DELETE_ARTICLE(state, id) {
      state.articles = state.articles.filter((a) => a.id !== id);
    },
    UPDATE_ARTICLE(state, { id, data }) {
      const article = state.articles.find((a) => a.id === id);
      if (article) Object.assign(article, data);
    },
    PUBLISH_ARTICLE(state, id) {
      const article = state.articles.find((a) => a.id === id);
      if (article) article.status = 'published';
    },
  },
  actions: {
    addArticle({ commit }, article) {
      commit('ADD_ARTICLE', article);
    },
    deleteArticle({ commit }, id) {
      commit('DELETE_ARTICLE', id);
    },
    updateArticle({ commit }, payload) {
      commit('UPDATE_ARTICLE', payload);
    },
    publishArticle({ commit }, id) {
      commit('PUBLISH_ARTICLE', id);
    },
  },
};
