export default {
  namespaced: true,
  state: {
    courses: [
      {
        id: 1,
        title: "Vue 2 入门",
        lessons: 20,
        students: 150
      },
      {
        id: 2,
        title: "Vuex 实战",
        lessons: 15,
        students: 80
      },
      {
        id: 3,
        title: "Vue Router 详解",
        lessons: 10,
        students: 100
      }
    ],
    progress: {}
  },
  getters: {
    totalLessons: state => state.courses.reduce((sum, c) => sum + c.lessons, 0),
    totalStudents: state => state.courses.reduce((sum, c) => sum + c.students, 0)
  },
  mutations: {
    ADD_COURSE(state, course) { state.courses.push({ ...course, id: Date.now() }) },
    ENROLL(state, courseId) {
        const course = state.courses.find(c => c.id === courseId)
        if (course) course.students++
      },
    SET_PROGRESS(state, { courseId, progress }) {
        state.progress = { ...state.progress, [courseId]: progress }
      }
  },
  actions: {
    addCourse({ commit }, course) { commit('ADD_COURSE', course) },
    enroll({ commit }, courseId) { commit('ENROLL', courseId) },
    updateProgress({ commit }, payload) { commit('SET_PROGRESS', payload) }
  }
}
