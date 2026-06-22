export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    count: state => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: state => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    isEmpty: state => state.items.length === 0
  },
  mutations: {
    ADD_ITEM(state, product) {
        const existing = state.items.find(i => i.id === product.id)
        if (existing) { existing.quantity++ }
        else { state.items.push({ ...product, quantity: 1 }) }
      },
    REMOVE_ITEM(state, productId) { state.items = state.items.filter(i => i.id !== productId) },
    UPDATE_QTY(state, { id, quantity }) {
        const item = state.items.find(i => i.id === id)
        if (item) item.quantity = Math.max(1, quantity)
      },
    CLEAR(state) { state.items = [] }
  },
  actions: {
    addToCart({ commit }, product) { commit('ADD_ITEM', product) },
    removeFromCart({ commit }, id) { commit('REMOVE_ITEM', id) },
    updateQuantity({ commit }, payload) { commit('UPDATE_QTY', payload) },
    clearCart({ commit }) { commit('CLEAR') }
  }
}
