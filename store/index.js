import { firebaseMutations } from 'vuexfire'

export const state = () => ({
  currentUser: null,
  loadingUser: true,
});

export const mutations = {
  setCurrentUser (state, user) {
    if (user) {
      state.currentUser = {
        id: user.uid,
        name: user.displayName,
      };
    } else {
      state.currentUser = null;
    }
  },

  setLoadingUser (state, loading) {
    state.loadingUser = loading;
  },

  ...firebaseMutations
};

export const actions = {
  setAuth ({ commit }, auth) {
    commit('setLoadingUser', true);
    auth.onAuthStateChanged((user) => {
      commit('setCurrentUser', user);
      commit('setLoadingUser', false);
    });
  },
};
