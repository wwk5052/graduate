import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isAdmin: false,
    },
    getters: {
        userLogin: (state) => state.isAdmin,
    },
    mutations: {},
    actions: {
        userLoginStatus: ({ commit, state }, status) => {
            commit('loginStatusChange', status);
        },
    },
    mutations: {
        loginStatusChange: (state, status) => {
            state.isAdmin = status;
        },
    },
    modules: {},
});