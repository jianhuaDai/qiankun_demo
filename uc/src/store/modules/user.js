import { MENU } from './../../constants'
const state = {
  userName: "",
  permission: MENU
}

const getters = {}

const actions = {
  initUser({
    commit
  }, user) {
    commit("INIT", user);
  },
  setPermission({
    commit
  }, permission) {
    commit("PERMISSION", permission);
  }
}

const mutations = {
  INIT(state, info) {
    state.userName = info && info.user ? info.user.username : this.$storage.getUserInfo().username;
  },
  PERMISSION(state, permission) {
    state.permission = permission;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}