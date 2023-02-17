import { createStore } from 'vuex'

export default createStore({
  state: {
    showHeader:true,
    rightButton:false,
    reload:false
  },
  getters: {
    showHeader = state => state.showHeader,

    titleHeader = state => state.title,

    rightButton = state => state.rightButton,

    reload = state => state.reload
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
