import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    order
  }
})
