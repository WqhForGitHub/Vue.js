export default {
  namespaced: true,
  state: {
    list: [
      {
        id: 1,
        name: "商品A",
        sku: "SKU001",
        stock: 100,
        unit: "个"
      },
      {
        id: 2,
        name: "商品B",
        sku: "SKU002",
        stock: 50,
        unit: "箱"
      },
      {
        id: 3,
        name: "商品C",
        sku: "SKU003",
        stock: 200,
        unit: "件"
      }
    ],
    warehouses: [
      "北京仓",
      "上海仓",
      "广州仓"
    ]
  },
  getters: {
    totalStock: state => state.list.reduce((sum, i) => sum + i.stock, 0),
    lowStock: state => state.list.filter(i => i.stock < 60)
  },
  mutations: {
    ADD_ITEM(state, item) { state.list.push({ ...item, id: Date.now() }) },
    UPDATE_STOCK(state, { id, stock }) {
        const item = state.list.find(i => i.id === id)
        if (item) item.stock = stock
      },
    DELETE_ITEM(state, id) { state.list = state.list.filter(i => i.id !== id) }
  },
  actions: {
    addItem({ commit }, item) { commit('ADD_ITEM', item) },
    updateStock({ commit }, payload) { commit('UPDATE_STOCK', payload) },
    deleteItem({ commit }, id) { commit('DELETE_ITEM', id) }
  }
}
