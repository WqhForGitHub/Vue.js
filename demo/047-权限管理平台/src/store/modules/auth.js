export default {
  namespaced: true,
  state: {
    roles: [
      {
        id: 1,
        name: "管理员",
        code: "admin",
        permissions: [
          "*"
        ]
      },
      {
        id: 2,
        name: "编辑",
        code: "editor",
        permissions: [
          "read",
          "write"
        ]
      },
      {
        id: 3,
        name: "访客",
        code: "guest",
        permissions: [
          "read"
        ]
      }
    ],
    permissions: [
      {
        id: 1,
        name: "查看",
        code: "read"
      },
      {
        id: 2,
        name: "新增",
        code: "write"
      },
      {
        id: 3,
        name: "删除",
        code: "delete"
      },
      {
        id: 4,
        name: "所有权限",
        code: "*"
      }
    ]
  },
  getters: {
    roleCount: state => state.roles.length,
    permissionCount: state => state.permissions.length
  },
  mutations: {
    ADD_ROLE(state, role) { state.roles.push({ ...role, id: Date.now() }) },
    DELETE_ROLE(state, id) { state.roles = state.roles.filter(r => r.id !== id) },
    UPDATE_ROLE(state, { id, data }) {
        const role = state.roles.find(r => r.id === id)
        if (role) Object.assign(role, data)
      }
  },
  actions: {
    addRole({ commit }, role) { commit('ADD_ROLE', role) },
    deleteRole({ commit }, id) { commit('DELETE_ROLE', id) },
    updateRole({ commit }, payload) { commit('UPDATE_ROLE', payload) }
  }
}
