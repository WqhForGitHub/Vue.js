export default {
  namespaced: true,
  state: {
    locale: "zh-CN",
    messages: {
      "zh-CN": {
        hello: "你好",
        welcome: "欢迎"
      },
      "en-US": {
        hello: "Hello",
        welcome: "Welcome"
      },
      "ja-JP": {
        hello: "こんにちは",
        welcome: "ようこそ"
      }
    }
  },
  getters: {
    currentMessages: state => state.messages[state.locale] || {},
    locale: state => state.locale
  },
  mutations: {
    SET_LOCALE(state, locale) { state.locale = locale }
  },
  actions: {
    setLocale({ commit }, locale) { commit('SET_LOCALE', locale) }
  }
}
