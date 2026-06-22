export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        name: "客户A",
        level: "VIP",
        contact: "张三",
        phone: "13800138000"
      },
      {
        id: 2,
        name: "客户B",
        level: "普通",
        contact: "李四",
        phone: "13900139000"
      },
      {
        id: 3,
        name: "客户C",
        level: "VIP",
        contact: "王五",
        phone: "13700137000"
      }
    ]
  },
  getters: {
    vipCount: state => state.list.filter(c => c.level === 'VIP').length,
    totalCount: state => state.list.length
  },
  mutations: {
    ADD_CUSTOMER(state, customer) { state.list.push({ ...customer, id: Date.now() }) },
    UPDATE_CUSTOMER(state, { id, data }) {
        const c = state.list.find(c => c.id === id)
        if (c) Object.assign(c, data)
      },
    DELETE_CUSTOMER(state, id) { state.list = state.list.filter(c => c.id !== id) }
  },
  actions: {
    addCustomer({ commit }, customer) { commit('ADD_CUSTOMER', customer) },
    updateCustomer({ commit }, payload) { commit('UPDATE_CUSTOMER', payload) },
    deleteCustomer({ commit }, id) { commit('DELETE_CUSTOMER', id) }
  }
}
