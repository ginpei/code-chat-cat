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
    state.loadingUser = false;
  },

  ...firebaseMutations
};

export const actions = {
  setAuth (context, auth) {
    auth.onAuthStateChanged((user) => {
      context.commit('setCurrentUser', user);
      context.commit('setLoadingUser', false);
    });
  },
};
