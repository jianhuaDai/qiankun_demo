const state = {
    showInterSetting: true
}

const getters = {}

const actions = {
    setShowInterSetting({
        commit
    }, showInterSetting) {
        commit("SHOWINTERSETTING", showInterSetting);
    }
}

const mutations = {
    SHOWINTERSETTING(state, showInterSetting) {
        state.showInterSetting = showInterSetting;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}