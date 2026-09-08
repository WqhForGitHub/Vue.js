export default {
  namespaced: true,
  state: {
    sessions: [
      {
        id: 1,
        name: '群聊A',
        lastMessage: '大家好',
        unread: 3,
      },
      {
        id: 2,
        name: '张三',
        lastMessage: '在吗？',
        unread: 1,
      },
    ],
    currentSession: null,
    messages: {},
  },
  getters: {
    totalUnread: (state) => state.sessions.reduce((sum, s) => sum + s.unread, 0),
  },
  mutations: {
    SET_CURRENT(state, session) {
      state.currentSession = session;
    },
    SEND_MESSAGE(state, { sessionId, text }) {
      if (!state.messages[sessionId]) {
        state.messages[sessionId] = [];
      }
      state.messages[sessionId].push({ id: Date.now(), text, mine: true });
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.lastMessage = text;
        session.unread = 0;
      }
    },
    MARK_READ(state, sessionId) {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (session) session.unread = 0;
    },
  },
  actions: {
    selectSession({ commit }, session) {
      commit('SET_CURRENT', session);
      commit('MARK_READ', session.id);
    },
    sendMessage({ commit }, payload) {
      commit('SEND_MESSAGE', payload);
    },
  },
};
