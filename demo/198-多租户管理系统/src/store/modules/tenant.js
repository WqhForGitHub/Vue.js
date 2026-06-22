export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        name: "租户A",
        plan: "enterprise",
        status: "active"
      },
      {
        id: 2,
        name: "租户B",
        plan: "standard",
        status: "active"
      },
      {
        id: 3,
        name: "租户C",
        plan: "basic",
        status: "suspended"
      }
    ],
    current: null
  },
  getters: {
    activeCount: state => state.list.filter(t => t.status === 'active').length
  },
  mutations: {
    SET_CURRENT(state, tenant) { state.current = tenant },
    ADD_TENANT(state, tenant) { state.list.push({ ...tenant, id: Date.now() }) },
    UPDATE_TENANT(state, { id, data }) {
        const t = state.list.find(t => t.id === id)
        if (t) Object.assign(t, data)
      }
  },
  actions: {
    selectTenant({ commit }, tenant) { commit('SET_CURRENT', tenant) },
    addTenant({ commit }, tenant) { commit('ADD_TENANT', tenant) },
    updateTenant({ commit }, payload) { commit('UPDATE_TENANT', payload) }
  }
}
