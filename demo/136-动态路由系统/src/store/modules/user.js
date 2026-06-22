export default {
  namespaced: true,
  state: {
    info: {
      id: null,
      name: "",
      avatar: "",
      roles: []
    },
    token: "",
    loggedIn: false
  },
  getters: {
    isLoggedIn: state => state.loggedIn,
    username: state => state.info.name || '游客',
    roles: state => state.info.roles
  },
  mutations: {
    SET_INFO(state, info) { state.info = info; state.loggedIn = true },
    SET_TOKEN(state, token) { state.token = token },
    LOGOUT(state) {
        state.info = { id: null, name: '', avatar: '', roles: [] }
        state.token = ''; state.loggedIn = false
      }
  },
  actions: {
    login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (username && password) {
              commit('SET_TOKEN', 'token-' + Date.now())
              commit('SET_INFO', { id: 1, name: username, avatar: '', roles: ['user'] })
              resolve()
            } else { reject(new Error('用户名或密码错误')) }
          }, 300)
        })
      },
    logout({ commit }) { commit('LOGOUT') },
    fetchProfile({ commit }) {
        return new Promise(resolve => {
          setTimeout(() => {
            commit('SET_INFO', { id: 1, name: '管理员', avatar: '', roles: ['admin'] })
            resolve()
          }, 300)
        })
      }
  }
}
