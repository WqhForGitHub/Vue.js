export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        content: "写得很好！",
        status: "approved",
        articleId: 1
      },
      {
        id: 2,
        content: "学到了很多",
        status: "pending",
        articleId: 1
      },
      {
        id: 3,
        content: "期待更多文章",
        status: "pending",
        articleId: 2
      }
    ]
  },
  getters: {
    pending: state => state.list.filter(c => c.status === 'pending'),
    approved: state => state.list.filter(c => c.status === 'approved')
  },
  mutations: {
    ADD_COMMENT(state, comment) { state.list.push({ ...comment, id: Date.now(), status: 'pending' }) },
    APPROVE(state, id) { const c = state.list.find(c => c.id === id); if (c) c.status = 'approved' },
    DELETE(state, id) { state.list = state.list.filter(c => c.id !== id) }
  },
  actions: {
    addComment({ commit }, comment) { commit('ADD_COMMENT', comment) },
    approve({ commit }, id) { commit('APPROVE', id) },
    delete({ commit }, id) { commit('DELETE', id) }
  }
}
