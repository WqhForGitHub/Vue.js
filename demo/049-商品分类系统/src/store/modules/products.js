export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        name: "Vue.js 实战",
        price: 89,
        stock: 100
      },
      {
        id: 2,
        name: "前端工程化",
        price: 79,
        stock: 80
      },
      {
        id: 3,
        name: "CSS 揭秘",
        price: 99,
        stock: 50
      }
    ],
    detail: null,
    loading: false
  },
  getters: {
    totalPrice: state => state.list.reduce((sum, p) => sum + p.price, 0),
    lowStock: state => state.list.filter(p => p.stock < 60)
  },
  mutations: {
    SET_LIST(state, list) { state.list = list },
    SET_DETAIL(state, product) { state.detail = product },
    SET_LOADING(state, val) { state.loading = val },
    ADD_PRODUCT(state, product) { state.list.push({ ...product, id: Date.now() }) },
    UPDATE_PRODUCT(state, { id, data }) {
        const idx = state.list.findIndex(p => p.id === id)
        if (idx > -1) Object.assign(state.list[idx], data)
      },
    DELETE_PRODUCT(state, id) { state.list = state.list.filter(p => p.id !== id) }
  },
  actions: {
    fetchList({ commit }) {
        commit('SET_LOADING', true)
        return new Promise(resolve => {
          setTimeout(() => { commit('SET_LOADING', false); resolve() }, 300)
        })
      },
    fetchDetail({ commit }, id) {
        return new Promise(resolve => {
          setTimeout(() => {
            commit('SET_DETAIL', { id, name: '示例商品', price: 99, stock: 100 })
            resolve()
          }, 300)
        })
      },
    addProduct({ commit }, product) { commit('ADD_PRODUCT', product) },
    updateProduct({ commit }, payload) { commit('UPDATE_PRODUCT', payload) },
    deleteProduct({ commit }, id) { commit('DELETE_PRODUCT', id) }
  }
}
